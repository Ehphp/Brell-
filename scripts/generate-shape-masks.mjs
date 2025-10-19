import { NodeIO } from "@gltf-transform/core";
import fs from "fs";
const io = new NodeIO();
const doc = await io.read("public/3d_model/umbrella.glb");
const meshMap = {
  circle: "Plane.022",
  crown: "Plane.012",
  segment: "Plane.029"
};
function extract(mesh) {
  const result = { triangles: [], uvBounds: { minU: Infinity, maxU: -Infinity, minV: Infinity, maxV: -Infinity } };
  for (const prim of mesh.listPrimitives()) {
    const uv = prim.getAttribute("TEXCOORD_0");
    const indices = prim.getIndices();
    if (!uv || !indices) continue;
    const arr = uv.getArray();
    const idx = indices.getArray();
    for (let i = 0; i < idx.length; i += 3) {
      const ia = idx[i] * 2;
      const ib = idx[i + 1] * 2;
      const ic = idx[i + 2] * 2;
      const tri = [
        arr[ia], arr[ia + 1],
        arr[ib], arr[ib + 1],
        arr[ic], arr[ic + 1]
      ];
      result.triangles.push(tri.map(v => Number.parseFloat(v.toFixed(6))));
      for (let j = 0; j < tri.length; j += 2) {
        const u = tri[j];
        const v = tri[j + 1];
        if (u < result.uvBounds.minU) result.uvBounds.minU = u;
        if (u > result.uvBounds.maxU) result.uvBounds.maxU = u;
        if (v < result.uvBounds.minV) result.uvBounds.minV = v;
        if (v > result.uvBounds.maxV) result.uvBounds.maxV = v;
      }
    }
  }
  result.uvBounds.minU = Number.parseFloat(result.uvBounds.minU.toFixed(6));
  result.uvBounds.maxU = Number.parseFloat(result.uvBounds.maxU.toFixed(6));
  result.uvBounds.minV = Number.parseFloat(result.uvBounds.minV.toFixed(6));
  result.uvBounds.maxV = Number.parseFloat(result.uvBounds.maxV.toFixed(6));
  return result;
}
const output = {};
for (const [key, meshName] of Object.entries(meshMap)) {
  const mesh = doc.getRoot().listMeshes().find((m) => m.getName() === meshName);
  if (!mesh) {
    throw new Error(`Mesh ${meshName} not found`);
  }
  output[key] = {
    mesh: meshName,
    ...extract(mesh)
  };
}
fs.writeFileSync("src/modules/editor/shape-masks.json", JSON.stringify(output, null, 2));
console.log("shape data written");
