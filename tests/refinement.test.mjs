import test from "node:test";
import assert from "node:assert/strict";
import { portalGeometry } from "../src/portalGeometry.js";
import { projectMedia, featuredProjectId } from "../src/projectMedia.js";
import { verifiedProjects } from "../src/projectContent.js";
import { existsSync } from "node:fs";

test("portal centers on the viewport and covers every corner at all target sizes", () => {
  for (const [width,height] of [[1920,1080],[1440,900],[1024,768],[768,1024],[390,844]]) {
    for (const left of [width*.16,width*.84]) {
      const origin={left,top:110,width:width*.15,height:width*.15};
      const result=portalGeometry(origin,width,height);
      assert.equal(origin.left+origin.width/2+result.x,width/2);
      assert.equal(origin.top+origin.height/2+result.y,height/2);
      assert.ok(origin.width*.73/2*result.scale > Math.hypot(width,height)/2);
    }
  }
});
test("featured project and all real media remain present", () => {
  assert.equal(verifiedProjects.length,5);
  assert.ok(verifiedProjects.some(p=>p.id===featuredProjectId));
  assert.ok(!verifiedProjects.some(p=>p.id==='coda'));
  for (const project of verifiedProjects) for (const shot of project.gallery) {
    assert.ok(existsSync(`public${shot.src}`),shot.src);
    const info=projectMedia(shot.src);
    assert.ok(info.width>0 && info.height>0);
    if (project.id==='diacare') assert.equal(info.kind,'phone');
  }
  assert.deepEqual(projectMedia('/projects/diacare-dashboard.webp'),{width:362,height:1080,kind:'phone'});
  assert.equal(projectMedia('/projects/uwc-plan.webp').kind,'document');
  assert.equal(projectMedia('/projects/tmc-research-home.webp').kind,'browser');
});
