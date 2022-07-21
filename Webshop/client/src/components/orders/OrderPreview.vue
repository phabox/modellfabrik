<template>
  <div class="Scene" v-resize="layout">
    <canvas
      id="renderCanvas"
      ref="canvas"
      class="Scene-canvas"
      touch-action="none"
      oncontextmenu="return false"
    ></canvas>
  </div>
</template>

<script>
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  Tools,
  HighlightLayer,
  Color3,
  Mesh,
} from "@babylonjs/core";

import "@babylonjs/loaders/OBJ";
import { AssetsManager } from "@babylonjs/core/Misc/assetsManager";
import { DefaultRenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline";
import {
  loadPlateMesh,
  createCylinder,
  loadSymbolAMesh,
  loadSymbolBMesh,
} from "../configurator/lib/assets";
import {
  createPlateMaterial,
  createCylinderMaterial,
} from "../configurator/lib/materials";
import { xRight, xLeft } from "../../constants/constants";
import { mapGetters } from "vuex";

/**
 * The company displays a preview of a placed order.
 * The plate with the corresponding cylinders will be displayed within a canvas.
 *
 * @category Orders
 *
 * @vue-data {Object} babylon - Data that is necessary for the BabylonJS render library. Includes the canvas and the scene
 * @vue-data {Object} scene - Contains basic elements of the scene such as light, meshes, and materials
 *
 * @vue-computed {Object} selectedOrder - The currently selected order that the preview will be shown for
 */
export default {
  name: "OrderPreview",

  provide() {
    return {
      babylon: this.babylon,
    };
  },

  computed: {
    ...mapGetters(["selectedOrder"]),
  },

  watch: {
    selectedOrder(newOrder, oldOrder) {
      if (newOrder && newOrder != oldOrder) {
        this.resetScene();
        this.previewConfiguration(newOrder);
      }
    },
  },

  created() {
    window.addEventListener("resize", () => this.layout());
  },

  data() {
    return {
      babylon: {
        scene: null,
        sceneReady: false,
        canvas: null,
      },
      scene: {
        camera: null,
        plateMesh: null,
        cylinderMeshes: [],
        plateMaterial: null,
        cylinderMaterial: null,
        symbolAMesh: null,
        symbolBMesh: null,
      },
    };
  },
  async mounted() {
    await this.createScene();
    this.babylon.sceneReady = true;
    this.babylon.canvas = this.$refs.canvas;

    this.engine.runRenderLoop(() => {
      this.babylon.scene.render();
    });
  },

  beforeDestroy() {
    this.babylon.scene.dispose();
    this.engine.dispose();
  },

  methods: {
    /**
     * Creates the product configuration scene.
     * - Sets up the rendering pipeline
     * - Loads the plate mesh
     * - Creates all necessary cylinder meshes
     * - Sets up camera and lighting
     */
    async createScene() {
      this.engine = new Engine(
        this.$refs.canvas,
        true,
        { preserveDrawingBuffer: true },
        false
      );
      this.babylon.scene = new Scene(this.engine);
      var camera = new ArcRotateCamera(
        "camera",
        -Math.PI / 2,
        Tools.ToRadians(67),
        300,
        new Vector3(0, 50, 0),
        this.babylon.scene
      );
      this.scene.camera = camera;
      camera.useAutoRotationBehavior = true;
      camera.autoRotationBehavior.idleRotationSpeed = 0.25;
      camera.lowerRadiusLimit = 250;
      camera.upperRadiusLimit = 450;

      camera.attachControl(this.$refs.canvas, true);
      this.scene.highlightLayer = new HighlightLayer("hl1", this.babylon.scene);
      new HemisphericLight("light1", new Vector3(1, 1, 0), this.babylon.scene);

      this.babylon.scene.createDefaultEnvironment({
        createGround: false,
        createSkybox: true,
        skyboxSize: 1000,
        skyboxColor: new Color3(144 / 255, 202 / 255, 249 / 255),
        enableGroundMirror: false,
      });

      var defaultPipeline = new DefaultRenderingPipeline(
        "DefaultRenderingPipeline",
        false, // HDR?
        this.babylon.scene,
        this.babylon.scene.cameras
      );
      defaultPipeline.samples = 1;
      defaultPipeline.fxaaEnabled = false;

      this.scene.plateMaterial = createPlateMaterial(this.babylon.scene);
      this.scene.cylinderMaterial = createCylinderMaterial(this.babylon.scene);
      var assetLoader = new AssetsManager(this.babylon.scene);
      loadPlateMesh(
        assetLoader,
        (mesh) => (this.scene.plateMesh = mesh),
        this.scene.plateMaterial
      );
      loadSymbolAMesh(assetLoader, (mesh) => {
        this.scene.symbolAMesh = mesh;
        this.scene.symbolAMesh.billboardMode = Mesh.BILLBOARDMODE_ALL;
      });
      loadSymbolBMesh(assetLoader, (mesh) => {
        this.scene.symbolBMesh = mesh;
        this.scene.symbolBMesh.billboardMode = Mesh.BILLBOARDMODE_ALL;
      });
      await assetLoader.loadAsync();
      this.previewConfiguration(this.selectedOrder);
    },

    /**
     * Removes all meshes from the current scene
     */
    resetScene() {
      this.scene.cylinderMeshes.forEach((mesh) => {
        mesh.dispose();
      });
    },

    /**
     * Displays a preview of the order. The preview will show the product like it was configured in the {@link ProductConfigurator}
     *
     * @param {Object} selectedOrder - The order that will be previewed
     */
    previewConfiguration(selectedOrder) {
      var leftHeight = 0;
      var rightHeight = 0;

      selectedOrder.leftStack.forEach((cylinder) => {
        var current = createCylinder(
          cylinder.height,
          { r: cylinder.color.r, g: cylinder.color.g, b: cylinder.color.b },
          this.scene.cylinderMaterial.clone(),
          this.babylon.scene
        );
        current.position = new Vector3(
          xLeft,
          leftHeight + cylinder.height / 2,
          0
        );
        leftHeight += cylinder.height;
        this.scene.cylinderMeshes.push(current);
      });
      selectedOrder.rightStack.forEach((cylinder) => {
        var current = createCylinder(
          cylinder.height,
          { r: cylinder.color.r, g: cylinder.color.g, b: cylinder.color.b },
          this.scene.cylinderMaterial.clone(),
          this.babylon.scene
        );
        current.position = new Vector3(
          xRight,
          rightHeight + cylinder.height / 2,
          0
        );
        rightHeight += cylinder.height;
        this.scene.cylinderMeshes.push(current);
      });

      this.scene.symbolAMesh.position.y = this.scene.symbolBMesh.position.y =
        Math.max(leftHeight, rightHeight) + 70;
    },

    /**
     * Resizes the BabylonJS engine if it exists
     */
    layout() {
      if (this.engine) this.engine.resize();
    },
  },
};
</script>

<style scoped>
.Scene {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-color: white;
  overflow: hidden;
}
.Scene-canvas {
  width: 100%;
  height: 100%;
  touch-action: none;
  outline: none;
  display: block;
}
</style>
