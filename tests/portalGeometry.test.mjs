import test from "node:test";
import assert from "node:assert/strict";
import { portalGeometry } from "../src/portalGeometry.js";

test("portal starts at the measured orb and finishes exactly at viewport center", () => {
  const source = { left: 185.5, top: 203.25, width: 242, height: 242 };
  const geometry = portalGeometry(source, { width: 1440, height: 900 });
  assert.equal(geometry.left, source.left);
  assert.equal(geometry.top, source.top);
  assert.equal(geometry.left + geometry.width / 2 + geometry.x, 720);
  assert.equal(geometry.top + geometry.height / 2 + geometry.y, 450);
});

test("expanded authored globe covers corners on desktop, tablet and mobile", () => {
  for (const viewport of [{ width: 1920, height: 1080 }, { width: 768, height: 1024 }, { width: 390, height: 844 }]) {
    const geometry = portalGeometry({ left: 40, top: 100, width: 84, height: 84 }, viewport);
    const globeRadius = geometry.width * .73 * geometry.scale / 2;
    assert.ok(globeRadius >= Math.hypot(viewport.width / 2, viewport.height / 2));
  }
});

test("unavailable or invalid source geometry gives a finite centered fallback", () => {
  for (const source of [null, { left: NaN, top: 1, width: 20, height: 20 }, { left: 1, top: 1, width: 0, height: 20 }]) {
    const geometry = portalGeometry(source, { width: 390, height: 844 });
    assert.equal(geometry.x, 0);
    assert.equal(geometry.y, 0);
    assert.ok(Object.values(geometry).every(Number.isFinite));
  }
});
