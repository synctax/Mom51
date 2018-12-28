var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
const ROOM_WIDTH = 500;
const ROOM_HEIGHT = 100;
const ROOM_LENGTH = 150;

var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0x52d3e5, 1);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

//Camera
var camera = new THREE.PerspectiveCamera(55, WIDTH/HEIGHT, 0.1, 10000);
camera.position.set(0,0,15);
camera.rotation.set(-0.05,0,0);
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
var leftWindow = loader.parse(windowJSON);
leftWindow.position.z = -ROOM_LENGTH/2;
leftWindow.position.y = 5;
leftWindow.scale.set(2.5,2,2);
leftWindow.position.x = -49;
scene.add(leftWindow);
var rightWindow = loader.parse(windowJSON);
rightWindow.rotation.y = Math.PI;
rightWindow.position.z = -ROOM_LENGTH/2;
rightWindow.scale.set(2.5,2,2);
rightWindow.position.x = 49;
leftWindow.position.y = 5;
scene.add(rightWindow);

//Table and Pots
var table = loader.parse(tableJSON);
table.scale.set(3,2.7,3);
table.rotation.set(0,Math.PI,0);
table.position.set(0,-30,-10);
scene.add(table)

//Light
var light = new THREE.PointLight(0x555555);
light.position.set(0,0,0);
scene.add(light);
var spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( -49, 40, -100 );
scene.add( spotLight );


var t = 0;
function render() {
	t += 0.01;
	requestAnimationFrame(render);
	renderer.render(scene, camera);
	//spotLight.position.z -= 0.1;
}

//Resizing
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){

	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;

    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
    renderer.setSize( WIDTH, HEIGHT );
}
