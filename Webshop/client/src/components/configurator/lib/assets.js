import { Vector3, MeshBuilder, CSG, Mesh, Color3 } from "@babylonjs/core";
import { xRight, xLeft } from "../../../constants/constants";

/**
 * @module Assets
 * @category Configurator
 * @subcategory Helper
 */

/**
 * Creates a cylinder-mesh with the provided height, color and material.
 *
 * @param {number} height - Height of the cylinder without the cone
 * @param {Color3} color - The color of the cylinder. RGB-values must be in range [0, 1].
 * @param {PBRMetallicRoughnessMaterial} material - Material of the cylinder
 * @param {Scene} scene - The scene, the cylinder will be added to
 */
export function createCylinder(height, color, material, scene) {
  var cylinder = createCsgCylinder(height, material, scene);
  cylinder.height = height;
  cylinder.material.baseColor = new Color3(color.r, color.g, color.b);
  return cylinder;
}

/**
 * Creates a cylinder mesh using Constructive Solid Geometry
 * @see {@link https://doc.babylonjs.com/typedoc/classes/babylon.csg}
 *
 * @param {number} height - Height of the cylinder without the cone
 * @param {PBRMetallicRoughnessMaterial} material - Material of the cylinder
 * @param {Scene} scene - The scene, the cylinder will be added to
 */
function createCsgCylinder(height, material, scene) {
  //height is reduced in order to have visible separation between cylinders when stacking them
  height -= 0.75;

  var cylinderDiameter = 40;
  var tipHeight = 5;
  var tipDiameterBottom = 20;
  var tipDiameterTop = 14;
  var cylinderTesselation = 24;
  var coneTesselation = 24;

  var bottom = MeshBuilder.CreateCylinder(
    "cylinder",
    {
      height: height,
      diameterBottom: cylinderDiameter,
      diameterTop: cylinderDiameter,
      tessellation: cylinderTesselation,
    },
    scene
  );
  var top = MeshBuilder.CreateCylinder(
    "cone",
    {
      height: tipHeight,
      diameterBottom: tipDiameterBottom,
      diameterTop: tipDiameterTop,
      tessellation: coneTesselation,
    },
    scene
  );
  top.position.y = height / 2 + tipHeight / 2 - height;
  var bottomCsg = CSG.FromMesh(bottom);
  var topCsg = CSG.FromMesh(top);
  var sub = bottomCsg.subtract(topCsg);
  var bottomNew = sub.toMesh("csg", material, scene);
  top.position.y = height / 2 + tipHeight / 2;
  var csgCylinder = Mesh.MergeMeshes([bottomNew, top]);
  csgCylinder.material = material;
  scene.removeMesh(bottom);

  return csgCylinder;
}

/**
 * Creates a cylinder mesh using Constructive Solid Geometry
 * @see {@link https://doc.babylonjs.com/divingDeeper/mesh/creation/param/lathe}
 *
 * @param {number} height - Height of the cylinder without the cone
 * @param {PBRMetallicRoughnessMaterial} material - Material of the cylinder
 * @param {Scene} scene - The scene, the cylinder will be added to
 */
function createLatheCylinder(height, material, scene) {
  var shape = [
    new Vector3(0, 5, 0),
    new Vector3(7, 5, 0),
    new Vector3(10, 0, 0),
    new Vector3(20, 0, 0),
    new Vector3(20, height, 0),
    new Vector3(10, height, 0),
    new Vector3(7, height + 5, 0),
    new Vector3(0, height + 5, 0),
    new Vector3(0, 5, 0),
  ];
  var latheCylinder = MeshBuilder.CreateLathe(
    "cylinder_" + height,
    { shape: shape },
    scene
  );
  latheCylinder.material = material;
  return latheCylinder;
}

/**
 * Loads the plate mesh that the cylinders will be stacked on
 * @param {AssetsManager} assetLoader - Babylon AssetsManager that loads meshes from various types
 * @param {function(Mesh):void} callback - The callback that will be called after the mesh was loaded successfully. The mesh is passed as a parameter into the callback 
 * @param {PBRMetallicRoughnessMaterial} plateMaterial - Material of the plate
 */
export function loadPlateMesh(assetLoader, callback, plateMaterial) {
  var plate = assetLoader.addMeshTask(
    "",
    "",
    process.env.BASE_URL + "assets/",
    "plate.obj"
  );
  plate.onSuccess = function() {
    var plateMesh = plate.loadedMeshes[0];
    plateMesh.scaling = new Vector3(0.7, 0.7, 0.7);
    plateMesh.setPositionWithLocalVector(new Vector3(-75, 0, 0));
    plateMesh.rotation.x = -Math.PI / 2;
    plateMesh.material = plateMaterial;

    callback(plateMesh);
  };
}

/**
 * Loads the "A" symbol mesh, that will be used to distinguish both stacks of the plate
 * 
 * @param {AssetsManager} assetLoader -  Babylon AssetsManager that loads meshes from various types
 * @param {function(Mesh):void} callback - Callback that will be executed after the mesh was loaded. The mesh will be passed into the function
 */
export function loadSymbolAMesh(assetLoader, callback) {
  var symbolA = assetLoader.addMeshTask(
    "",
    "",
    process.env.BASE_URL + "assets/",
    "A.stl"
  );
  symbolA.onSuccess = function() {
    var symbolAMesh = symbolA.loadedMeshes[0];

    symbolAMesh.rotation.x = -Math.PI / 2;
    symbolAMesh.position = new Vector3(xLeft, 70, 4);
    symbolAMesh.scaling = new Vector3(2, 2, 2);
    callback(symbolAMesh);
  };
}

/**
 * Loads the "B" symbol mesh, that will be used to distinguish both stacks of the plate
 * 
 * @param {AssetsManager} assetLoader -  Babylon AssetsManager that loads meshes from various types
 * @param {function(Mesh):void} callback - Callback that will be executed after the mesh was loaded. The mesh will be passed into the function
 */
export function loadSymbolBMesh(assetLoader, callback) {
  var symbolB = assetLoader.addMeshTask(
    "",
    "",
    process.env.BASE_URL + "assets/",
    "B.stl"
  );
  symbolB.onSuccess = function() {
    var symbolBMesh = symbolB.loadedMeshes[0];

    symbolBMesh.rotation.x = -Math.PI / 2;
    symbolBMesh.position = new Vector3(xRight, 70, 4);
    symbolBMesh.scaling = new Vector3(2, 2, 2);
    callback(symbolBMesh);
  };
}
