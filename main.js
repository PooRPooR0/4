import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 2000 );
scene.background = new THREE.Color( '#cccccc' );

scene.fog = new THREE.Fog( 0xcccccc, 7, 50 );

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
controls.enablePan = false;
controls.minPolarAngle = THREE.MathUtils.degToRad(45);
controls.maxPolarAngle = THREE.MathUtils.degToRad(90);
controls.minDistance = 2;
controls.maxDistance = 30;
controls.enableDamping = true;

//light
const ambientLight = new THREE.AmbientLight('#fff8e3', 0.1)
const light = new THREE.DirectionalLight(0xfff8e3, 1);
light.position.set(30, 50, 30);
light.castShadow = true;
light.shadow.mapSize.width = 4096;
light.shadow.mapSize.height = 4096;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 5000;
light.shadow.camera.left = -50;
light.shadow.camera.bottom = -50;
light.shadow.camera.right = 50;
light.shadow.camera.top = 50;
scene.add(light, ambientLight);

// football goals
const loader = new GLTFLoader();
loader.load( 'static/footballGoal.glb', function ( gltf ) {
	const footballGoal = gltf.scene;
	const footballGoal2 = footballGoal.clone()

	footballGoal.traverse(function (child) {
		if (child.isMesh) {
			child.castShadow = true
			child.receiveShadow = true
		}
	})

	footballGoal.position.x = -5
	footballGoal.position.y = -1.2
	footballGoal.position.z = 0

	footballGoal.rotation.y = Math.PI

	scene.add(footballGoal);
	footballGoal2.traverse(function (child) {
		if (child.isMesh) {
			child.castShadow = true
			child.receiveShadow = true
		}
	})

	footballGoal2.position.x = -12.5
	footballGoal2.position.y = -1.2
	footballGoal2.position.z = 0

	scene.add(footballGoal2);
}, undefined, function ( error ) {
	console.error(error);
} );

// benches
loader.load('static/bench.glb', (gltf) => {
	const bench = gltf.scene;
	bench.scale.set(0.6, 0.6, 0.6)
	bench.position.x = -10
	bench.position.z = -12
	bench.position.y = -0.87

	bench.traverse(function (child) {
		if (child.isMesh) {
			child.castShadow = true
			child.receiveShadow = true
		}
	})

	for (let i = 0; i < 10; i++) {
		if (i === 4) continue;
		const newBench = bench.clone()
		newBench.position.x = bench.position.x + i * 1.5
		scene.add(newBench);
	}
})

//tires
loader.load('static/tire.glb', (gltf) => {
	const tire = gltf.scene;
	tire.scale.set(0.3, 0.3, 0.3)
	tire.position.x = 7
	tire.position.z = -12
	tire.position.y = -1.11
	tire.rotateY(-Math.PI / 8.5);

	tire.traverse(function (child) {
		if (child.isMesh) {
			child.castShadow = true
			child.receiveShadow = true
		}
	})

	for (let j = 0; j < 5; j++) {
		for (let i = 0; i < 4; i++) {
			const newBench = tire.clone()
			newBench.position.x = tire.position.x + i * 0.6
			newBench.position.z = tire.position.z + j * 0.5
			scene.add(newBench);
		}
	}
})

//trees
loader.load('static/trees.glb', (gltf) => {
	const trees = gltf.scene;
	trees.scale.set(0.03, 0.03, 0.03)
	trees.position.x = 15
	trees.position.z = -40
	trees.position.y = -1.11

	trees.traverse(function (child) {
		if (child.isMesh) {
			child.castShadow = true
			child.receiveShadow = false
		}
	})

	for (let j = 0; j < 10; j++) {
		for (let i = 0; i < 4; i++) {
			const newTrees = trees.clone()
			newTrees.position.x = trees.position.x + i * 5 + Math.random() * 5
			newTrees.position.z = trees.position.z + j * 7 + Math.random() * 5
			scene.add(newTrees);
		}
	}
})


const textureLoader = new THREE.TextureLoader()

//ground
textureLoader.load( "static/grass.jpg", (texture) => {
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 100, 100 );
	texture.center.set(0.5, 0.5)

	const geometry = new THREE.PlaneGeometry( 1, 1 );
	const material = new THREE.MeshStandardMaterial( {side: THREE.DoubleSide, map: texture} );
	const ground = new THREE.Mesh( geometry, material );
	ground.rotation.x = Math.PI / 2
	ground.position.y = -1
	ground.scale.x = 100
	ground.scale.y = 100
	ground.receiveShadow = true
	scene.add( ground );
}, undefined, (error) => {
	console.error(error)
} );

//lines
const lineGeometry = new THREE.PlaneGeometry( 0.1, 20 );
const lineMaterial = new THREE.MeshPhongMaterial( {side: THREE.DoubleSide, color: 0xffffff} );
const line = new THREE.Mesh( lineGeometry, lineMaterial );
line.rotation.x = Math.PI / 2
line.position.set(4.03, -0.9999, 0)
scene.add( line );

const line2 = new THREE.Mesh( lineGeometry, lineMaterial );
line2.rotation.x = Math.PI / 2
line2.position.set(-21.5, -0.9999, 0)
scene.add( line2 );

const longLineGeometry = new THREE.PlaneGeometry( 25.53, 0.1 );

const line3 = new THREE.Mesh( longLineGeometry, lineMaterial );
line3.rotation.x = Math.PI / 2
line3.position.set(-8.75, -0.9999, 10)
scene.add( line3 );

const line4 = new THREE.Mesh( longLineGeometry, lineMaterial );
line4.rotation.x = Math.PI / 2
line4.position.set(-8.75, -0.9999, -10)
scene.add( line4 );

// ball
textureLoader.load( "static/ball.jpg", (texture) => {
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 1, 1 );

	//ball
	const ballGeometry = new THREE.SphereGeometry(0.05, 32, 32)
	const ballMaterial = new THREE.MeshStandardMaterial( {map: texture} );
	const ball = new THREE.Mesh(ballGeometry, ballMaterial)
	ball.castShadow = true
	ball.position.y = -0.97
	scene.add( ball );
}, undefined, (error) => {
	console.error(error)
} );

camera.position.z = 3;
controls.update();

function animate() {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render( scene, camera );
}
animate();