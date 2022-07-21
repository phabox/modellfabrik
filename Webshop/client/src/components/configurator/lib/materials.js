import { Color3, CubeTexture } from "@babylonjs/core";
import { PBRMetallicRoughnessMaterial } from "@babylonjs/core/Materials/PBR/pbrMetallicRoughnessMaterial";
/**
 * @module Materials
 * @category Configurator
 * @subcategory Helper
 */

/**
 * Creates a metallic material for the plate
 *
 * @param {Scene} scene - The scene the material will be used in
 */
export function createPlateMaterial(scene) {
  var plateMaterial = new PBRMetallicRoughnessMaterial("plateMaterial", scene);
  plateMaterial.baseColor = new Color3(0.85, 0.85, 0.85);
  plateMaterial.metallic = 0.8;
  plateMaterial.roughness = 0.15;

  plateMaterial.environmentTexture = CubeTexture.CreateFromPrefilteredData(
    process.env.BASE_URL + "assets/environment.dds",
    scene
  );
  return plateMaterial;
}

/**
 * Creates a metallic material for the cylinders
 *
 * @param {Scene} scene - The scene the material will be used in
 */
export function createCylinderMaterial(scene) {
  var cylinderMaterial = new PBRMetallicRoughnessMaterial(
    "cylinderMaterial",
    scene
  );

  cylinderMaterial.metallic = 0.8;
  cylinderMaterial.roughness = 0.15;
  cylinderMaterial.environmentTexture = CubeTexture.CreateFromPrefilteredData(
    process.env.BASE_URL + "assets/environment.dds",
    scene
  );
  return cylinderMaterial;
}
