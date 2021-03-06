import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js'
import { GLTFLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls";

import { colorToFog, colorToScene, colorToLight } from './colorTo.js';

let fish
let theLoader
var fishArr = new Array;
let fishMixerArr = new Array;

const clock = new THREE.Clock()
let t = clock.getElapsedTime();

const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xe5fbee)
scene.fog = new THREE.FogExp2(0xe5fbee, 0.01);

const light = new THREE.AmbientLight( 0xd2f6fa, 1 ); // soft white light
scene.add( light );
const pointLight = new THREE.PointLight( 0xc7dbff,.01 );
pointLight.position.set( -7, 15, 8 );
scene.add( pointLight );
// //   const lightHelper = new THREE.PointLightHelper(pointLight)
// //   scene.add(lightHelper)
// // const pointLight2 = new THREE.PointLight( 0x2600ff, 20, 10 );
// // light.position.set( 5, 0, 0 );
// // scene.add( pointLight2 );
const directionalLight2 = new THREE.DirectionalLight(0x0091ff,.3);
directionalLight2.position.set(0,-7,0)
directionalLight2.castShasow = true;
scene.add(directionalLight2);


//Boilerplate code
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 100)
camera.position.set(0,30,-30)
camera.rotation.y += Math.PI
scene.add(camera)

const renderer = new THREE.WebGL1Renderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
renderer.shadowMap.enabled = true

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

var speednum = 0.01
function animate(){
    requestAnimationFrame(animate)

    //make the fish animte
    var dt = clock.getDelta()
    for (var i = 0; i<num; i++){
        if(fishMixerArr[i]){
            fishMixerArr[i].update(dt)
        }
    }
    // for (var i = 0; i<dropNum; i++){
    //     if(dropMixerArr[i]){
    //         dropMixerArr[i].update(dt)
    //     }
    // }
    if(leaf) {
        leafMixer.update(dt)
    }
    if(flower) {
        flowerMixer.update(dt)
    }
    if(flower2) {
        flowerMixer2.update(dt)
    }
    if(water) {
        waterMixer.update(dt)
    }

    //make the fish move forward
    for (var i = 0; i<num; i++){
        var speed = (Math.random() * (10 - 1) + 1).toFixed(2)
        if(fishArr[i]){
            fishArr[i].position.x -= 0.01 * speed
        }
    }

    //make the fish start over
    for (var i = 0; i<num; i++){
        const [x, y, z] = Array(3).fill().map(()=>THREE.MathUtils.randFloatSpread(7))
        if(fishArr[i] && fishArr[i].position.x < - 50){
            fishArr[i].position.x = x*10 + 50;
            fishArr[i].position.y = y*2-6;
            fishArr[i].position.z = z*4-4;
        }
    }

    //raining
    for (var i = 0; i<rain.length; i++){
      var speed = (Math.random() * (10 - 1) + 1).toFixed(2)
      if(rain[i]){
        rain[i].position.y -= 0.05 * speed
      }
    }
    for (var i = 0; i<rain.length; i++){
      const [x, y, z] = Array(3).fill().map(()=>THREE.MathUtils.randFloatSpread(100))
      if(rain[i] && rain[i].position.y < 5){
        rain[i].position.x = x+20
        rain[i].position.y = 40+y
        rain[i].position.z = z
      }
  }
    renderer.render(scene, camera)
}
var color = 2
function addFish(index){
    var size = (Math.random() * (2 - 0.8) + 0.8).toFixed(2)
    const [x, y, z] = Array(3).fill().map(()=>THREE.MathUtils.randFloatSpread(7))
  theLoader = new GLTFLoader()
  theLoader.load(
    './model/fish' + color.toString() + '.gltf',
    gltf => {
        fish = gltf.scene
        fish.scale.set(size*.01,size*.01,size*.01)
        fish.position.set(x*10 + 50, y*2-6, z*4-4)
        fish.rotation.y += Math.PI;
        let Mixer = new THREE.AnimationMixer(fish)
        Mixer.clipAction(gltf.animations[0]).play();
      scene.add(fish);
      fishArr[index] = fish;
      fishMixerArr[index] = Mixer;
    }
  )
  if(color >= 5){
      color = 2
  } else {
      color++
  }
}
let water
let waterMixer
function addWater(){
  theLoader = new GLTFLoader()
  theLoader.load(
    './model/floyds_rain_drop_prop/scene.gltf',
    gltf => {
        water = gltf.scene
        water.scale.set(10,10,10)
        water.position.set(0,4,0)
        waterMixer= new THREE.AnimationMixer(water)
        waterMixer.clipAction(gltf.animations[0]).play();
      scene.add(water);
    }
  )
}

let leaf
let leafMixer
function addLeaf(){
  theLoader = new GLTFLoader()
  theLoader.load(
    './model/heye.gltf',
    gltf => {
        leaf = gltf.scene
        leaf.scale.set(.02,.02,.02)
        leaf.position.set(0,5,0)
        leafMixer = new THREE.AnimationMixer(leaf)
        leafMixer.clipAction(gltf.animations[0]).play();
      scene.add(leaf);
    }
  )
}
let flower
let flowerMixer
function addFlower(){
  theLoader = new GLTFLoader()
  theLoader.load(
    './model/flower.gltf',
    gltf => {
        flower = gltf.scene
        flower.scale.set(.02,.02,.02)
        flower.position.set(-10,5,0)
        flower.rotation.y += Math.PI;
        flowerMixer = new THREE.AnimationMixer(flower)
        flowerMixer.clipAction(gltf.animations[0]).play();
      scene.add(flower);
    }
  )
}
let rock
function addRock(){
  theLoader = new GLTFLoader()
  theLoader.load(
    './model/rock.gltf',
    gltf => {
        rock = gltf.scene
        rock.scale.set(.05,.05,.05)
        rock.position.set(0,8,48)
        rock.rotation.y = Math.PI/6;
      scene.add(rock);
    }
  )
}
let bridge
function addBridge(){
  theLoader = new GLTFLoader()
  theLoader.load(
    './model/bridge.gltf',
    gltf => {
        bridge = gltf.scene
        bridge.scale.set(.01,.01,.01)
        bridge.position.set(10,0,0)
      scene.add(bridge);
    }
  )
}
let building
function addBuilding(){
  theLoader = new GLTFLoader()
  theLoader.load(
    './model/tingzi.gltf',
    gltf => {
      building = gltf.scene
      building.scale.set(.06,.06,.06)
      building.position.set(-5,6,40)
      building.rotation.y = -Math.PI/2
      scene.add(building);
    }
  )
}
let grass
function addGrass(){
  theLoader = new GLTFLoader()
  theLoader.load(
    './model/grass.gltf',
    gltf => {
        grass = gltf.scene
        grass.scale.set(.05,.05,.05)
        grass.position.set(-10,10,-13)
      scene.add(grass);
    }
  )
}

let grass2
function addGrass2(){
  theLoader = new GLTFLoader()
  theLoader.load(
    './model/grass.gltf',
    gltf => {
        grass2 = gltf.scene
        grass2.scale.set(.06,.06,.06)
        grass2.position.set(20,10,13)
        grass2.rotation.y += Math.PI;
      scene.add(grass2);
    }
  )
}

let flower2
let flowerMixer2
function addFlower2(){
  theLoader = new GLTFLoader()
  theLoader.load(
    './model/flower2.gltf',
    gltf => {
        flower2 = gltf.scene
        flower2.scale.set(.01,.01,.01)
        flower2.position.set(20,5,0)
        flowerMixer2 = new THREE.AnimationMixer(flower2)
        flowerMixer2.clipAction(gltf.animations[0]).play();
      scene.add(flower2);
    }
  )
}

const geometry = new THREE.BoxGeometry( 90, 35, 2 );
const material = new THREE.MeshPhongMaterial({
    color: 0x8cffab,
    opacity: 0.2,
    transparent: true,
  });
const plane = new THREE.Mesh( geometry, material );
plane.rotation.x += Math.PI/2;
plane.position.y  = 5;
plane.position.x  = -20;
scene.add( plane );
const geometry2 = new THREE.BoxGeometry( 50, 70, 2 );
const material2 = new THREE.MeshPhongMaterial({
    color: 0x32a852,
  });
const plane2 = new THREE.Mesh( geometry2, material2 );
plane2.rotation.x += Math.PI/2;
plane2.position.z  = -50;
plane2.position.y  = 5;
scene.add( plane2 );


const plane4 = new THREE.Mesh( geometry2, material2 );
plane4.rotation.x += Math.PI/2;
plane4.rotation.z += Math.PI/2;
plane4.position.z  = 40;
plane4.position.y  = 5;
scene.add( plane4 );

var rain = new Array
for (var i = 0; i < 1000; i++){
  const geometry = new THREE.BoxGeometry( .1, .2, .1 );
  const material = new THREE.MeshPhongMaterial({
    color: 0xe5efe7,
  });
  const plane = new THREE.Mesh( geometry, material );
  const [x, y, z] = Array(3).fill().map(()=>THREE.MathUtils.randFloatSpread(100))
  plane.position.set(x+20,-39,z-30)
  rain[i] = plane;
  scene.add( plane );
}

let num = 6
for(var i = 0; i < num; i++){
    addFish(i);
}
animate()
addLeaf()
addFlower()
addRock()
addFlower2()
addBridge()
addBuilding()
addGrass()
addGrass2()
// addWater()

var flag = true;
var btn = document.querySelector("#btn")
var title = document.querySelector("#title")
btn.addEventListener("click", function(){
    if(flag){
        colorToScene(scene, 0x050124);
        colorToFog(scene.fog, 0x050124)
        light.intensity = 0.001;
        pointLight.intensity = 1.5
        colorToLight(pointLight, 0xf7a820)
        title.style.color = "white";
        flag = false;
    } else {
        colorToScene(scene, 0xd2f6fa);
        colorToFog(scene.fog, 0xd2f6fa)
        light.intensity = 0.5;
        pointLight.intensity = 2
        colorToLight(pointLight, 0xc7dbff)
        title.style.color = "black";
        flag = true;
    }
})