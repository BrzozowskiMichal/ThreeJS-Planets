import * as THREE from "three";
import { Injectable } from "@angular/core";

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
  private randIndex = Math.random() * this.planetTextures.length - 1;
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

  // private controls: OrbitControls;

  private cloudGeometry = new THREE.SphereGeometry(201, 201, 201);
  private cloudTexture = new THREE.TextureLoader().load("/assets/textures/clouds.jpg");
  private cloudMaterial = new THREE.MeshPhongMaterial({
    map: this.cloudTexture,
    transparent: true,
    opacity: 0.2
  });
  private clouds = new THREE.Mesh(this.cloudGeometry, this.cloudMaterial);

  public earthVector = new THREE.Vector3(2, 1, 2);

  public dx = .2;
  public dy = -.2;
  public dz = -.2;

  private particles = new THREE.BoxGeometry();
  private particleCount = 3000;
  // private particleMaterial = new THREE.ParticleBasicMaterial({
  //   color: 0xFFFFFF,
  //   size: Math.random() * 10,
  //   map: THREE.ImageUtils.loadTexture(
  //     "/assets/textures/particle.png"
  //   ),
  //   blending: THREE.AdditiveBlending,
  //   transparent: true,
  // });

  // public particleSystem = new THREE.ParticleSystem(
  //   this.particles,
  //   this.particleMaterial
  // );

  createScene(elementId: string): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = <HTMLCanvasElement>document.getElementById(elementId);

    // this.geometry.vertices.shift();

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
      80,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 700;
    this.camera.position.y = 200;
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
      color: 0xffffff,
      specular: 0x333333,
      shininess: 25
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
    // spotLight.shadowBias = 100;
    // spotLight.shadowMapWidth = 2048; // Shadow Quality
    // spotLight.shadowMapHeight = 2048; // Shadow Quality
    this.scene.add(spotLight);

    for(let p = 0; p < this.particleCount; p++ ) {
      let pX = Math.random() * 1500 - 500;
      let pY = Math.random() * 1500 - 500;
      let pZ = Math.random() * 1500 - 500;

      let particle = new (<any>THREE).Vector3(pX, pY, pZ);

      // this.particles.vertices.push(particle);

      // this.scene.add(this.particleSystem);

    }
  }

  addControls() {
    // this.controls = new OrbitControls(this.camera);
    // this.controls.rotateSpeed = 0.5;
    // this.controls.addEventListener("change", this.render);

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

  //setting animation for camera and objects
  render() {
    requestAnimationFrame(() => {
      this.render();
    });

    this.planetEarth.rotation.y += 0.001;

    this.planetMoon.rotation.z += 0.005;

    this.circle.rotation.z += 0.005;

    this.clouds.rotation.y += 0.002;
    this.clouds.rotation.z += 0.002;

    // this.camera.position.x += this.dx;
    this.camera.position.y += this.dy;
    this.camera.position.z += this.dz;

    if(this.camera.position.z < 550) {
      this.camera.position.y -= this.dy;
      this.camera.position.z -= this.dz;
    }

    this.camera.lookAt(this.earthVector);

    this.renderer.render(this.scene, this.camera);
  }
}
