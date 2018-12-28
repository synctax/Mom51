var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
const ROOM_WIDTH = 200;
const ROOM_HEIGHT = 100;
const ROOM_LENGTH = 150;

var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0x222222, 1);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

//Camera
var camera = new THREE.PerspectiveCamera(65, WIDTH/HEIGHT, 0.1, 10000);
camera.position.set(0,10,90);
camera.rotation.set(-0.15,0,0);
scene.add(camera);

//Floor Boards
var floorBoardGeometry = new THREE.BoxGeometry(2, 0.5, 150);
for(var i = 0; i < ROOM_WIDTH/2; i++){
	var h = Math.floor(40 + Math.random()*5);
	var s = Math.floor(60 + Math.random()*20);
	var l = Math.floor(25 + Math.random()*5);
	var floorBoardMaterial = new THREE.MeshLambertMaterial({color: "hsl("+h+","+s+"%,"+l+"%)"});
	var floorBoard = new THREE.Mesh(floorBoardGeometry, floorBoardMaterial);
	floorBoard.position.x = -ROOM_WIDTH/2+2*i;
	floorBoard.position.y = -ROOM_HEIGHT/2+Math.random()/4;
	scene.add(floorBoard);
}

//Walls and Ceiling
var wallGeometry = new THREE.BoxGeometry(2,ROOM_HEIGHT,ROOM_LENGTH);
var wallMaterial = new THREE.MeshLambertMaterial({color: "rgb(250,250,250)"});
var leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
leftWall.position.x = -ROOM_WIDTH/2;
scene.add(leftWall);
var rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
rightWall.position.x = ROOM_WIDTH/2;
scene.add(rightWall)
var ceiling = new THREE.Mesh(wallGeometry,wallMaterial);
ceiling.position.y = ROOM_HEIGHT/2
ceiling.scale.y = ROOM_WIDTH/ROOM_HEIGHT;
ceiling.rotation.z = Math.PI/2;
scene.add(ceiling);


//Windows
var loader = new THREE.ObjectLoader();
var Window = loader.parse(windowJSON);
Window.position.z = -ROOM_LENGTH/2;
Window.scale.set(3,2,2);
scene.add(Window);

//Light
var light = new THREE.AmbientLight(0x222233);
light.position.set(0, 0, 0);
scene.add(light);
var spotLight = new THREE.SpotLight(0xFFDDEE);
spotLight.position.set(0,0,-100);
spotLight.rotation.set(0,Math.PI,0);
// spotLight.castShadow = true;
// spotLight.shadow.mapSize.width = 1024;
// spotLight.shadow.mapSize.height = 1024;
// spotLight.shadow.camera.near = 500;
// spotLight.shadow.camera.far = 4000;
// spotLight.shadow.camera.fov = 30;
scene.add(spotLight);

var t = 0;
function render() {
	t += 0.01;
	requestAnimationFrame(render);
	renderer.render(scene, camera);
	spotLight.position.z -= 0.1;
}
render();

//Resizing
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
