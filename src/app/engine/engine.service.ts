import * as THREE from "three";
import { Injectable } from "@angular/core";
import { OrbitControls } from "three-orbitcontrols-ts";
import { load } from "@angular/core/src/render3";

@Injectable({
  providedIn: "root"
})
export class EngineService {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private planetEarth: THREE.Mesh;
  private planetGeometry = new THREE.SphereGeometry(40, 40, 40);
  public planetTextures = [
    "/assets/textures/moon.jpg"
  ];
  private randIndex = THREE.Math.randInt(0, this.planetTextures.length - 1);
  private planetTexture = new THREE.TextureLoader().load(
    this.planetTextures[this.randIndex]
  );
  private planetMaterial = new THREE.MeshPhongMaterial({
    map: this.planetTexture
  });
  private planetMoon = new THREE.Mesh(this.planetGeometry, this.planetMaterial);
  private geometry = new THREE.CircleGeometry(400, 400);
  private circle = new THREE.Line(
    this.geometry,
    new THREE.LineDashedMaterial({ color: "white" })
  );

  private orbit = new THREE.Group();
  private orbitDir = new THREE.Group();

  public objects = [];

  private controls: OrbitControls;

  private cloudGeometry = new THREE.SphereGeometry(205, 205, 205);
  private cloudTexture = new THREE.TextureLoader().load("/assets/textures/clouds.jpg");
  private cloudMaterial = new THREE.MeshPhongMaterial({
    map: this.cloudTexture,
    transparent: true,
    opacity: 0.09
  });
  private clouds = new THREE.Mesh(this.cloudGeometry, this.cloudMaterial);

  createScene(elementId: string): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = <HTMLCanvasElement>document.getElementById(elementId);

    this.geometry.vertices.shift();

    this.circle.rotation.x = Math.PI * 0.5;

    this.orbit.add(this.circle);
    this.orbit.add(this.planetMoon);

    this.orbitDir.add(this.orbit);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true, // transparent background
      antialias: true // smooth edges
    });
    this.renderer.shadowMapEnabled = true; //Shadow
    this.renderer.shadowMapType = THREE.PCFShadowMap;
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // create the scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.TextureLoader().load(
      "/assets/images/galaxy.jpg"
    );

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 500;
    this.camera.position.y = 100;
    this.scene.add(this.camera);

    // soft white light
    var ambientLight = new THREE.AmbientLight(0xfdfcf0);
    this.scene.add(ambientLight);

    var light = new THREE.DirectionalLight(0xfdfcf0, 1);
    light.position.set(120, 110, 120);
    this.scene.add(light);

    this.planetMoon.position.x = 400;

    this.planetMoon.castShadow = true;
    this.planetMoon.receiveShadow = true;

    this.objects.push(this.planetMoon);
    this.scene.add(this.planetMoon);


    let earthGeometry = new THREE.SphereGeometry(200, 200, 200);
    let map = new THREE.TextureLoader().load("/assets/textures/earth.jpg");
    let earthMaterial = new THREE.MeshPhongMaterial({
      map: map,
      color: 0xaaaaaa,
      specular: 0x333333,
      shininess: 15
    });

    this.planetEarth = new THREE.Mesh(earthGeometry, earthMaterial);
    this.planetEarth.receiveShadow = true;
    this.planetEarth.castShadow = true;

    this.planetEarth.rotation.x += 100;
    this.planetEarth.rotation.y += 100;

    this.planetEarth.castShadow = true;

    this.circle.add(this.planetMoon);

    this.scene.add(this.planetEarth);
    this.scene.add(this.clouds);
    this.scene.add(this.circle);

    var spotLight = new THREE.SpotLight(0xaaaaaa);
    spotLight.position.set(100, 100, 100);
    spotLight.castShadow = true;
    spotLight.shadowBias = 100;
    spotLight.shadowMapWidth = 2048; // Shadow Quality
    spotLight.shadowMapHeight = 2048; // Shadow Quality
    this.scene.add(spotLight);
  }

  addControls() {
    this.controls = new OrbitControls(this.camera);
    this.controls.rotateSpeed = 0.5;
    this.controls.addEventListener("change", this.render);

    window.addEventListener("mousewheel", () => {
      this.scroll(event);
    });
  }

  //Check scroll event mouse wheel up or down
  scroll(event): void {
    if (event.deltaY > 0) {
      this.camera.position.z -= 100;
    } else if (event.deltaY < 0) {
      this.camera.position.z += 100;
    }
  }

  animate(): void {
    window.addEventListener("DOMContentLoaded", () => {
      this.render();
    });
  }

  render() {
    requestAnimationFrame(() => {
      this.render();
    });

    this.planetEarth.rotation.y += 0.001;

    this.planetMoon.rotation.z += 0.005;

    this.circle.rotation.z += 0.005;

    this.clouds.rotation.x += 0.001;
    this.clouds.rotation.y += 0.002;
    this.clouds.rotation.z += 0.002;

    this.renderer.render(this.scene, this.camera);
  }
}
