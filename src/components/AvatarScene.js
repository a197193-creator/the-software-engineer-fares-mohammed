import * as THREE from "three";

const SECTIONS = [
  { id: "home", pose: 0, turn: 0.015, roll: -0.012 },
  { id: "about", pose: 4, turn: 0.09, roll: -0.022 },
  { id: "skills", pose: 1, turn: -0.09, roll: 0.018 },
  { id: "projects", pose: 2, turn: 0.055, roll: -0.025 },
  { id: "experience", pose: 3, turn: -0.045, roll: 0.012 },
  { id: "contact", pose: 5, turn: 0, roll: 0 },
];
const clamp = THREE.MathUtils.clamp;
const lerp = THREE.MathUtils.lerp;
const smooth = (value) => value * value * (3 - 2 * value);
const abortError = () =>
  new DOMException("Avatar loading cancelled", "AbortError");

function loadTexture(url, signal) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    const cleanup = () => {
      clearTimeout(timeout);
      image.onload = null;
      image.onerror = null;
      signal?.removeEventListener("abort", abort);
    };
    const abort = () => {
      cleanup();
      image.src = "";
      reject(abortError());
    };
    const timeout = setTimeout(() => {
      cleanup();
      image.src = "";
      reject(new Error("Avatar image unavailable"));
    }, 15000);
    image.onload = () => {
      cleanup();
      if (signal?.aborted) {
        reject(abortError());
        return;
      }
      const texture = new THREE.Texture(image);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      texture.needsUpdate = true;
      resolve(texture);
    };
    image.onerror = () => {
      cleanup();
      reject(new Error("Avatar image unavailable"));
    };
    signal?.addEventListener("abort", abort, { once: true });
    if (signal?.aborted) abort();
    else image.src = url;
  });
}

function disposeObject(root) {
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();
  const skeletons = new Set();
  root.traverse((node) => {
    if (node.geometry) geometries.add(node.geometry);
    if (node.skeleton) skeletons.add(node.skeleton);
    const nodeMaterials = Array.isArray(node.material)
      ? node.material
      : [node.material];
    nodeMaterials.filter(Boolean).forEach((material) => {
      materials.add(material);
      Object.values(material).forEach((value) => {
        if (value?.isTexture) textures.add(value);
      });
    });
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
  textures.forEach((texture) => {
    texture.dispose();
    texture.image?.close?.();
  });
  skeletons.forEach((skeleton) => skeleton.dispose());
}

function radialMaterial(color, opacity) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: false,
    uniforms: {
      tint: { value: new THREE.Color(color) },
      strength: { value: opacity },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform vec3 tint;
      uniform float strength;
      void main() {
        vec2 p = (vUv - 0.5) * 2.0;
        float a = pow(max(0.0, 1.0 - dot(p, p)), 3.0) * strength;
        gl_FragColor = vec4(tint, a);
        #include <colorspace_fragment>
      }
    `,
  });
}

/**
 * Uses the supplied transparent pose images as 2.5D textured planes. A real,
 * self-contained GLB can be supplied later; no skeletal/head motion is invented.
 * DOM anchors reserve the avatar's space, while this canvas never changes layout.
 */
export async function createAvatarScene(
  host,
  {
    modelUrl = null,
    activeSection = "home",
    theme = "dark",
    signal,
    onProgress,
    onReady,
    onError,
  },
) {
  let disposed = false;
  let renderer;
  let frameId = 0;
  let previousTime = 0;
  let elapsed = 0;
  let ready = false;
  let dirty = true;
  let anchors = [];
  let viewport = { width: window.innerWidth, height: window.innerHeight };
  let options = { activeSection, theme };
  let model = null;
  let mixer = null;
  let animations = [];
  let previousAction = null;
  let clipSection = null;
  let modelReason = null;
  let initialized = false;
  let resizeObserver;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 5000);
  camera.position.z = 2000;
  const avatar = new THREE.Group();
  scene.add(avatar);
  const sprites = [];
  const textures = [];
  const pointer = { x: 0, y: 0 };
  const currentPointer = { x: 0, y: 0 };
  const current = { x: 0, y: 0, height: 300, turn: 0, roll: 0 };
  const plane = new THREE.PlaneGeometry(1, 1);
  const aura = new THREE.Mesh(plane, radialMaterial("#aaa0ff", 0.1));
  aura.position.z = -80;
  aura.renderOrder = -2;
  avatar.add(aura);
  const shadow = new THREE.Mesh(plane, radialMaterial("#080911", 0.24));
  shadow.position.z = -70;
  shadow.renderOrder = -1;
  avatar.add(shadow);
  const ambient = new THREE.AmbientLight("#ffffff", 1.15);
  const key = new THREE.DirectionalLight("#fff1dc", 2.1);
  key.position.set(-300, 500, 1000);
  const rim = new THREE.DirectionalLight("#aaa0ff", 2.5);
  rim.position.set(450, 240, -400);
  scene.add(ambient, key, rim);

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frameId);
    window.removeEventListener("scroll", markDirty);
    window.removeEventListener("resize", resize);
    window.removeEventListener("pointermove", movePointer);
    window.removeEventListener("pointerout", leavePointer);
    document.removeEventListener("visibilitychange", visibility);
    signal?.removeEventListener("abort", dispose);
    resizeObserver?.disconnect();
    mixer?.stopAllAction();
    if (model) mixer?.uncacheRoot(model);
    disposeObject(scene);
    // Textures loaded before plane creation must also be released on cancellation.
    textures.forEach((texture) => texture?.dispose());
    scene.clear();
    if (renderer) {
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    }
  }

  function fail(error) {
    if (disposed) return;
    dispose();
    if (!signal?.aborted) onError?.(error);
  }

  function contextLost(event) {
    event.preventDefault();
    fail(new Error("Avatar graphics context unavailable"));
  }

  function markDirty() {
    dirty = true;
  }
  function movePointer(event) {
    pointer.x = clamp((event.clientX / viewport.width) * 2 - 1, -1, 1);
    pointer.y = clamp((event.clientY / viewport.height) * 2 - 1, -1, 1);
  }
  function leavePointer(event) {
    if (!event.relatedTarget) {
      pointer.x = 0;
      pointer.y = 0;
    }
  }

  function readAnchors() {
    const scrollY = window.scrollY;
    const available = SECTIONS.map((config) => {
      const node = document.querySelector(
        `[data-avatar-anchor="${config.id}"]`,
      );
      if (!node) return null;
      const rect = node.getBoundingClientRect();
      const section = node.closest("section") || node;
      const sectionRect = section.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      const ratio =
        textures[config.pose]?.image.width /
          textures[config.pose]?.image.height || 2 / 3;
      const maxHeight = Math.max(
        24,
        Math.min(viewport.height - 132, viewport.height * 0.84),
      );
      const height = clamp(
        Math.min(rect.height, rect.width / ratio),
        Math.min(96, maxHeight),
        maxHeight,
      );
      const halfWidth = (height * ratio) / 2;
      return {
        ...config,
        start: Math.max(0, sectionRect.top + scrollY - viewport.height * 0.24),
        bottom: sectionRect.bottom,
        x: clamp(
          rect.left + rect.width / 2,
          halfWidth + 16,
          viewport.width - halfWidth - 16,
        ),
        y: clamp(
          rect.top + rect.height / 2,
          height / 2 + 88,
          viewport.height - height / 2 - 24,
        ),
        height,
      };
    }).filter(Boolean);
    if (available.length) anchors = available.sort((a, b) => a.start - b.start);
    dirty = false;
  }

  function getTarget() {
    if (!anchors.length) {
      const config =
        SECTIONS.find((section) => section.id === options.activeSection) ||
        SECTIONS[0];
      return {
        ...config,
        x: viewport.width * 0.76,
        y: viewport.height * 0.52,
        height: Math.min(500, viewport.height * 0.72),
        weights: { [config.pose]: 1 },
      };
    }
    const scrollY = window.scrollY;
    let index = 0;
    while (index < anchors.length - 1 && scrollY >= anchors[index + 1].start)
      index += 1;
    const from = anchors[index];
    const to = anchors[Math.min(index + 1, anchors.length - 1)];
    const progress =
      from === to
        ? 0
        : clamp(
            (scrollY - from.start) / Math.max(1, to.start - from.start),
            0,
            1,
          );
    // Keep each pose established, then ease through the final part of the section.
    const blend = smooth(clamp((progress - 0.55) / 0.45, 0, 1));
    const weights = { [from.pose]: 1 - blend };
    weights[to.pose] = (weights[to.pose] || 0) + blend;
    return {
      id: blend > 0.5 ? to.id : from.id,
      x: lerp(from.x, to.x, blend),
      y: lerp(from.y, to.y, blend),
      height: lerp(from.height, to.height, blend),
      turn: lerp(from.turn, to.turn, blend),
      roll: lerp(from.roll, to.roll, blend),
      weights,
    };
  }

  function resize() {
    if (disposed || !renderer) return;
    viewport = { width: window.innerWidth, height: window.innerHeight };
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(viewport.width, viewport.height, false);
    camera.left = -viewport.width / 2;
    camera.right = viewport.width / 2;
    camera.top = viewport.height / 2;
    camera.bottom = -viewport.height / 2;
    camera.updateProjectionMatrix();
    dirty = true;
  }

  function selectClip(section) {
    if (!mixer || !animations.length || section === clipSection) return;
    clipSection = section;
    const expression = {
      home: /idle|stand/i,
      about: /talk|idle/i,
      skills: /look|idle/i,
      projects: /type|work|idle/i,
      experience: /walk|idle/i,
      contact: /wave|celebrat|idle/i,
    }[section];
    const clip =
      animations.find((animation) => expression?.test(animation.name)) ||
      animations[0];
    const action = mixer.clipAction(clip);
    if (action === previousAction) return;
    action.reset().setEffectiveWeight(1).play();
    if (previousAction) previousAction.crossFadeTo(action, 0.4, false);
    previousAction = action;
  }

  function render(now) {
    if (disposed || document.hidden) return;
    frameId = 0;
    try {
      const delta = previousTime
        ? clamp((now - previousTime) / 1000, 0.001, 0.05)
        : 1 / 60;
      previousTime = now;
      elapsed += delta;
      if (dirty) readAnchors();
      const target = getTarget();
      const damping = 1 - Math.exp(-9 * delta);
      const firstFrame = !initialized;
      if (firstFrame) {
        ["x", "y", "height", "turn", "roll"].forEach((name) => {
          current[name] = target[name];
        });
        initialized = true;
      }
      ["x", "y", "height", "turn", "roll"].forEach((name) => {
        current[name] = lerp(current[name], target[name], damping);
      });
      currentPointer.x = lerp(currentPointer.x, pointer.x, damping);
      currentPointer.y = lerp(currentPointer.y, pointer.y, damping);
      const breathing = Math.sin(elapsed * 1.5) * 0.006;
      avatar.position.set(
        current.x - viewport.width / 2 + currentPointer.x * 4,
        viewport.height / 2 - current.y + breathing * current.height,
        0,
      );
      avatar.rotation.set(
        currentPointer.y * 0.012,
        current.turn + currentPointer.x * 0.022,
        current.roll + currentPointer.x * 0.003,
      );
      aura.scale.set(current.height * 1.15, current.height * 1.1, 1);
      shadow.scale.set(current.height * 0.48, current.height * 0.055, 1);
      shadow.position.y = -current.height * 0.48;
      if (model) {
        model.scale.setScalar(current.height * (1 + breathing * 0.3));
        selectClip(target.id);
        mixer?.update(delta);
      } else {
        const fallback = sprites.find(Boolean);
        const weights = {};
        Object.entries(target.weights).forEach(([pose, weight]) => {
          const selected = sprites[pose] || fallback;
          if (selected)
            weights[selected.userData.pose] =
              (weights[selected.userData.pose] || 0) + weight;
        });
        sprites.forEach((sprite) => {
          if (!sprite) return;
          const opacity = weights[sprite.userData.pose] || 0;
          sprite.material.opacity = firstFrame
            ? opacity
            : lerp(sprite.material.opacity, opacity, 1 - Math.exp(-13 * delta));
          sprite.visible = sprite.material.opacity > 0.002;
          const ratio =
            sprite.material.map.image.width / sprite.material.map.image.height;
          sprite.scale.set(current.height * ratio, current.height, 1);
        });
      }
      renderer.render(scene, camera);
      if (!ready) {
        ready = true;
        onReady?.({
          mode: model ? "model" : "sprite",
          rendered: true,
          ...(modelReason ? { reason: modelReason } : {}),
        });
      }
      frameId = requestAnimationFrame(render);
    } catch (error) {
      fail(error);
    }
  }

  function visibility() {
    if (disposed) return;
    cancelAnimationFrame(frameId);
    frameId = 0;
    previousTime = 0;
    if (!document.hidden) {
      dirty = true;
      frameId = requestAnimationFrame(render);
    }
  }

  async function loadModel() {
    const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
    if (signal?.aborted || disposed) throw abortError();
    const loader = new GLTFLoader();
    const request = new AbortController();
    const cancel = () => request.abort();
    signal?.addEventListener("abort", cancel, { once: true });
    const timeout = setTimeout(cancel, 15000);
    try {
      const response = await fetch(modelUrl, { signal: request.signal });
      if (!response.ok) throw new Error("Avatar model unavailable");
      const buffer = await response.arrayBuffer();
      const base = new URL(".", new URL(modelUrl, window.location.href)).href;
      const gltf = await loader.parseAsync(buffer, base);
      if (disposed || signal?.aborted) {
        disposeObject(gltf.scene);
        throw abortError();
      }
      return gltf;
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener("abort", cancel);
    }
  }

  try {
    if (signal?.aborted) throw abortError();
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.cssText =
      "display:block;width:100%;height:100%;pointer-events:none";
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.addEventListener(
      "webglcontextlost",
      contextLost,
      false,
    );
    host.appendChild(renderer.domElement);
    signal?.addEventListener("abort", dispose, { once: true });
    resize();
    let completed = 0;
    const total = modelUrl ? 7 : 6;
    const results = await Promise.allSettled(
      SECTIONS.map((_, pose) =>
        loadTexture(`/assets/avatar-${pose}.webp`, signal)
          .then((texture) => {
            if (disposed) {
              texture.dispose();
              throw abortError();
            }
            textures[pose] = texture;
            return texture;
          })
          .finally(() => {
            completed += 1;
            if (!disposed) onProgress?.(completed / total);
          }),
      ),
    );
    if (disposed || signal?.aborted) throw abortError();
    results.forEach((result, pose) => {
      if (result.status !== "fulfilled") return;
      const material = new THREE.MeshBasicMaterial({
        map: result.value,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        opacity: pose === 0 ? 1 : 0,
        toneMapped: false,
        side: THREE.DoubleSide,
      });
      const sprite = new THREE.Mesh(plane, material);
      sprite.userData.pose = pose;
      sprite.renderOrder = pose + 1;
      sprites[pose] = sprite;
      avatar.add(sprite);
    });
    if (!sprites.some(Boolean)) throw new Error("Avatar images unavailable");

    if (modelUrl) {
      try {
        const gltf = await loadModel();
        const bounds = new THREE.Box3().setFromObject(gltf.scene);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        if (!Number.isFinite(size.y) || size.y <= 0) {
          disposeObject(gltf.scene);
          throw new Error("Avatar model has no visible geometry");
        }
        // Keep animation targets intact: center via a parent, not the model root.
        const centered = new THREE.Group();
        centered.position.copy(center).negate();
        centered.add(gltf.scene);
        const normalized = new THREE.Group();
        normalized.add(centered);
        normalized.scale.setScalar(1 / size.y);
        model = new THREE.Group();
        model.add(normalized);
        avatar.add(model);
        sprites.forEach((sprite) => {
          if (sprite) sprite.visible = false;
        });
        animations = gltf.animations || [];
        if (animations.length) mixer = new THREE.AnimationMixer(model);
      } catch (error) {
        if (disposed || signal?.aborted) throw error;
        modelReason = "model-unavailable";
      } finally {
        completed += 1;
        if (!disposed) onProgress?.(completed / total);
      }
    }

    if (disposed || signal?.aborted) throw abortError();
    window.addEventListener("scroll", markDirty, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", movePointer, { passive: true });
    window.addEventListener("pointerout", leavePointer, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(markDirty);
      resizeObserver.observe(document.documentElement);
      // Filtering projects can move later sections without resizing the viewport.
      document.querySelectorAll("[data-avatar-anchor]").forEach((node) => {
        resizeObserver.observe(node);
        const section = node.closest("section");
        if (section) resizeObserver.observe(section);
      });
    }
    document.fonts?.ready.then(() => {
      if (!disposed) dirty = true;
    });
    const handle = {
      dispose,
      setOptions(next) {
        options = { ...options, ...next };
        ambient.intensity = options.theme === "light" ? 1.5 : 1.15;
        aura.material.uniforms.strength.value =
          options.theme === "light" ? 0.07 : 0.1;
        shadow.material.uniforms.strength.value =
          options.theme === "light" ? 0.16 : 0.24;
        dirty = true;
      },
    };
    handle.setOptions(options);
    if (!document.hidden) frameId = requestAnimationFrame(render);
    return handle;
  } catch (error) {
    dispose();
    throw error;
  }
}
