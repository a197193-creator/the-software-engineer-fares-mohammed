import test from "node:test";
import assert from "node:assert/strict";
import { stopBeforeFooter } from "../src/guideBoundary.js";
import { projectMedia, featuredProjectId } from "../src/projectMedia.js";
import { verifiedProjects } from "../src/projectContent.js";
import { existsSync } from "node:fs";

test("guardian remains above footer even during fast scrolling and drift", () => {
  for (const viewport of [768,900,1080]) {
    for (const footerTop of [1300,viewport,500,200,0,-100]) {
      for (const height of [150,310,460]) {
        const top = stopBeforeFooter(viewport - height - 20 + 7, height, footerTop);
        assert.ok(top + height <= footerTop - 32);
      }
    }
  }
  assert.equal(stopBeforeFooter(550,310,1500),550);
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
