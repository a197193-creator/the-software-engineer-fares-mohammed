import test from "node:test";
import assert from "node:assert/strict";
import { placeGuide } from "../src/guideBoundary.js";
import { canRenderWorld } from "../src/worldCapability.js";

test("guide remains between the header and reading surface, or suspends safely", () => {
  for (const boundary of [Infinity, 1300, 800, 500, 300, 200, 80, 0, -100]) {
    for (const height of [150, 310, 460]) {
      const result = placeGuide(700, height, boundary, 96);
      assert.ok(result.top >= 96);
      if (result.visible) {
        assert.ok(result.height >= 150);
        assert.ok(result.top + result.height <= boundary - 32);
      } else assert.ok(boundary - 96 - 32 < 150);
    }
  }
  assert.deepEqual(placeGuide(550, 310, 1500), { visible: true, height: 310, top: 550 });
});

test("constrained visitors get the existing static world without requiring hardware hints", () => {
  const normal = { motion: true, level: "balanced", light: false };
  assert.equal(canRenderWorld(normal), true);
  for (const preference of [{motion:false}, {level:"subtle"}, {light:true}, {saveData:true}, {memory:2}, {cores:2}])
    assert.equal(canRenderWorld({...normal, ...preference}), false);
  assert.equal(canRenderWorld({...normal, memory:8, cores:4}), true);
});
