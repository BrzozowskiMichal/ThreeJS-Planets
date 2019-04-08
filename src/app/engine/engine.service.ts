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

  public objects = [];

  public planetTextures = [
    "/assets/textures/sun.jpg",
    "/assets/textures/mars.jpg",
    "/assets/textures/fake.jpg",
    "/assets/textures/haumea.jpg",
    "/assets/textures/ceres.jpg",
    "/assets/textures/eris.jpg",
    "/assets/textures/jupiter.jpg",
    "/assets/textures/make.jpg",
    "/assets/textures/moon.jpg",
    "/assets/textures/neptun.jpg",
    "/assets/textures/saturn.jpg",
    "/assets/textures/uranus.jpg"
  ];

  private controls: OrbitControls;

  createScene(elementId: string): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = <HTMLCanvasElement>document.getElementById(elementId);

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
    this.camera.position.y = 3;
    this.scene.add(this.camera);

    // soft white light
    var light = new THREE.SpotLight(0xffffff, 2);
    light.position.set(100, 500, 2000);
    this.scene.add(light);

    for (var i = 0; i < 10; i++) {
      let planetGeometry = new THREE.SphereGeometry(40, 40, 40);
      let randIndex = THREE.Math.randInt(0, this.planetTextures.length - 1);
      var planetTexture = new THREE.TextureLoader().load(
        this.planetTextures[randIndex]
      );
      let planetMaterial = new THREE.MeshPhongMaterial({
        map: planetTexture
      });
      var planet = new THREE.Mesh(planetGeometry, planetMaterial);
      planet.position.x = Math.random() * 1000 - 500;
      planet.position.y = Math.random() * 600 - 300;
      planet.position.z = Math.random() * 800 - 400;

      planet.castShadow = true;
      planet.receiveShadow = true;

      this.objects.push(planet);
      this.scene.add(planet);
    }

    let earthGeometry = new THREE.SphereGeometry(150, 150, 150);
    let map = new THREE.TextureLoader().load("/assets/textures/earth.jpg");
    let earthMaterial = new THREE.MeshPhongMaterial({
      map: map
    });

    let planetEarth = new THREE.Mesh(earthGeometry, earthMaterial);
    planetEarth.receiveShadow = true;
    planetEarth.castShadow = true;

    planetEarth.rotation.x += 0.01;
    planetEarth.rotation.y += 0.01;
    planetEarth.position.x = 1;
    planetEarth.position.y = 1;

    planetEarth.rotation.x += 0.01;
    planetEarth.rotation.y += 0.01;
    planetEarth.position.x = 3;
    planetEarth.position.y = 1;
    planetEarth.castShadow = true;

    this.scene.add(planetEarth);

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
    this.controls.maxPolarAngle = Math.PI / 3;
    this.controls.addEventListener("change", this.render);

    window.addEventListener( 'mousewheel', () => {
      this.scroll(event);
    } );
  }

  animate(): void {
    window.addEventListener("DOMContentLoaded", () => {
      this.render();
    });
  }

  //Check scroll event mouse wheel up or down
  scroll(event): void {
      if(event.deltaY > 0) {
        this.camera.position.z -= 100;
      }
      else if (event.deltaY < 0) {
        this.camera.position.z += 100;
      }
  }

  render() {
    requestAnimationFrame(() => {
      this.render();
    });

    this.renderer.render(this.scene, this.camera);
  }
}
