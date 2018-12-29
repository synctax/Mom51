
let wait = 10 * 1000;

var plants = [];

//variables that change species
let iterations = 5;

function sortObjectsOnProperty(name) {
    return function(a, b) { return a[name] - b[name]; }
}

function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}


function drawHoops(lastNode, nodesLeft, circles){

	var circleDoesWork = true;
	var centerX, centerY, centerZ, radius, ang;
	var suggestedRadius;
	var failedAttempts = 0;
	do {
		let angDir = Math.random() * 100 > 50 ? -1 : 1;
		let ang = -1 * 90 + (angDir * (Math.random() * (90 - 45) )) * Math.PI / 180; g = (Math.random() * (Math.PI * 100 / 180) + 40);
		radius = Math.random() * 15 + (6.5 * nodesLeft) + 10;
		if(failedAttempts > 50) {
			radius = suggestedRadius - 2;
			break;
		}
		radius = radius / 64;

		centerX = lastNode.radius == 0 ? lastNode.x : lastNode.x + lastNode.radius*(Math.cos(ang)) + (Math.cos(ang)*radius);
		centerY = lastNode.radius == 0 ? lastNode.y : lastNode.y + lastNode.radius*(Math.sin(ang)) + (Math.sin(ang)*radius);
		centerZ = lastNode.z;

		circleDoesWork = true;
		for(var ic = 0; ic < circles.dat.length; ic++){
			let c = circles.dat[ic];
			dist = Math.pow(c.x - centerX, 2) + Math.pow(c.y - centerY, 2);
			if ( dist < Math.pow(c.radius + radius - .15, 2) ){
				circleDoesWork = false;
				suggestedRadius = Math.sqrt(dist) - c.radius;
				radius = suggestedRadius;
				failedAttempts += 1;
			}
		}
	} while(!circleDoesWork);
	radius -= .01;
	if(radius > 0 && failedAttempts <= 40 && radius > .25){

		let red =  Math.random() * 125 + 20;
		let green = Math.random() * 100;
		let blue = Math.random() * 125;

		//add object to scene
		//centerY = -1 * centerY

		let node = {"uuid": create_UUID(), "x": centerX, "y": centerY, "z": centerZ, "radius":radius, "rgb": parseInt("0x" + decToHex(red) + decToHex(green) + decToHex(blue)) };
		circles.dat.push(node);
		for(var i = 0; i < nodesLeft; i++){
			let a = Math.random() * 100;
			if( a < 20){
				drawHoops(node, i + 2 < nodesLeft ? i + 2 : i + 1, circles)
			} else if(a < 40) {
				drawHoops(node, i + 1, circles);
			} else {
				drawHoops(node, i, circles);
			}
		}
	}
}

function formSceneObject(node){
	//console.log("ehllo " + node.y);
	var cylinderGeometry = new THREE.CylinderGeometry(node.radius, node.radius, .125, 32);
	var cylinderMaterial = new THREE.MeshBasicMaterial( {color : node.rgb } );
	var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
	cylinder.position.x = node.x;
	cylinder.position.y = -node.y - 5;
	cylinder.position.z = node.z;
	cylinder.rotation.x = Math.PI/2;
	cylinder.name = node.uuid;
	//scene.add(cylinder);
	var ringGeometry = new THREE.RingGeometry(node.radius - 0.0525, node.radius, 32);
	var ringMaterial = new THREE.MeshBasicMaterial( { color : 0xdb9a29 });
	var ring = new THREE.Mesh(ringGeometry, ringMaterial);
	ring.position.x = node.x;
	ring.position.y = -node.y - 5;
	ring.position.z = node.z + 0.0625;
	ring.name = node.uuid + 1;
	//scene.add(ring);
	return {"cylinder": cylinder, "ring": ring}
}

function grow(plant, currStage, delay, end){
	var cPlant;
	for(var p = 0; p < plants.length; p++){
		if(plants[p].name == plant.name){
			cPlant = plants[p];
		}
	}
	if(currStage == end || plant.exists == false || plant.dat[0].uuid != cPlant.dat[0].uuid){
		return;
	} else {
		//order by y-coord
		sortedCircles = plant.dat.sort(sortObjectsOnProperty("y")).reverse();
		//console.log(sortedCircles);
		let a = formSceneObject(plant.dat[currStage]);
		scene.add(a.cylinder);
		scene.add(a.ring);
	}
	if(currStage > plant.stage){
		plant.stage += 1;
		let pData = JSON.stringify(plant);
		localStorage.setItem(plant.name, pData);
	}
	window.setTimeout(function(){grow(plant, currStage + 1, delay, end)}, delay);
}

function onDocumentMouseDown( event ) {
	var raycaster = new THREE.Raycaster();

    var mouse2D = new THREE.Vector2( ( event.clientX / window.innerWidth ) * 2 - 1,   //x
                                    -( event.clientY / window.innerHeight ) * 2 + 1)  //y

    //console.log(event.clientX + " " + event.clientY);

    raycaster.setFromCamera( mouse2D, camera );
    //console.log(raycaster.intersectObjects(scene.children))
    var p = raycaster.intersectObjects(scene.children)[0] != undefined ? raycaster.intersectObjects(scene.children)[0].object : NaN;
    //console.log(p);

    if (p != NaN){
    	for(var pl = 0; pl < plants.length; pl++){
    		for(var c = 0; c < plants[pl].stage + 1; c++){
    			if(plants[pl].dat[c].uuid == p.name){
    				//console.log("you clicked " + plants[pl].name + " node: " + c);
    				//make it stop growing
    				plants[pl].exists = false;
    				//destroy all the plants nodes
    				for(var n = 0; n < plants[pl].stage + 1; n++){
    					var nodeCylinderObject = scene.getObjectByName(plants[pl].dat[n].uuid);
    					var nodeRingObject = scene.getObjectByName(plants[pl].dat[n].uuid + 1);
    					scene.remove(nodeCylinderObject);
    					scene.remove(nodeRingObject);
    				}
    				//create a new plant and have it begin growth
    				plant = {"name": plants[pl].name, "exists": true, "dat": new Array(), "xpos": plants[pl].xpos, "ypos": plants[pl].ypos, "zpos": plants[pl].zpos, "stage": 0};
    				drawHoops({"x": plant.xpos, "y": plant.ypos, "z": plant.zpos, "radius": 0}, iterations, plant);
    				pData = JSON.stringify(plant);

    				plants[pl] = plant;

    				localStorage.setItem(plant.name, pData);

    				setTimeout(function(){grow(plant, plant.stage, wait, plant.dat.length)}, (Math.random() * 10 + 1) * 1000);
    				break;
    			}

    		}
    	}
    	console.log(p.x + " " + p.y + " " + p.z);
    }

}

document.addEventListener("click", onDocumentMouseDown);

//localStorage.clear();

if(localStorage.getItem("plant1") != undefined){
	console.log("ehllo1");
	let p1Data = localStorage.getItem("plant1");
	var plant1 = JSON.parse(p1Data);
	let p2Data = localStorage.getItem("plant2");
	var plant2 = JSON.parse(p2Data);
	let p3Data = localStorage.getItem("plant3");
	var plant3 = JSON.parse(p3Data);

	plants.push(plant1); plants.push(plant2); plants.push(plant3);

	//catch up on previous growth
	grow(plant1, 0, 0, plant1.stage + 1);
	grow(plant2, 0, 0, plant2.stage + 1);
	grow(plant3, 0, 0, plant3.stage + 1);

	grow(plant1, plant1.stage + 1, wait, plant1.dat.length);
	setTimeout(function(){grow(plant2, plant2.stage + 1, wait, plant2.dat.length)}, (Math.random() * 10 + 1) * 1000);
	setTimeout(function(){grow(plant3, plant3.stage + 1, wait, plant3.dat.length)}, (Math.random() * 10 + 2) * 1000);

} else {
	console.log("ehllo2");
	var plant1 = {"name": "plant1", "exists": true, "dat": new Array(), "xpos": -4, "ypos": -1.25, "zpos": -0.2, "stage": 0};
	drawHoops({"x": plant1.xpos, "y": plant1.ypos, "z": plant1.zpos, "radius": 0}, iterations, plant1);
	let p1Data = JSON.stringify(plant1);

	var plant2 = {"name": "plant2", "exists": true, "dat": new Array(), "xpos": -0.1, "ypos": -1.25, "zpos": -0.5, "stage": 0};
	drawHoops({"x": plant2.xpos, "y": plant2.ypos, "z": plant2.zpos, "radius": 0}, iterations, plant2);
	let p2Data = JSON.stringify(plant2);

	var plant3 = {"name": "plant3", "exists": true, "dat": new Array(), "xpos": 3.75, "ypos": -1.25,  "zpos": .6, "stage": 0};
	drawHoops({"x": plant3.xpos, "y": plant3.ypos, "z": plant3.zpos, "radius": 0}, iterations, plant3);
	let p3Data = JSON.stringify(plant3);

	plants.push(plant1); plants.push(plant2); plants.push(plant3);

	localStorage.setItem(plant1.name, p1Data); localStorage.setItem(plant2.name, p2Data); localStorage.setItem(plant3.name, p3Data);

	setTimeout(function(){grow(plant1, plant1.stage, wait, plant1.dat.length)}, (Math.random() * 10 + 1) * 1000);
	setTimeout(function(){grow(plant2, plant2.stage, wait, plant2.dat.length)}, (Math.random() * 10 + 2) * 1000);
	setTimeout(function(){grow(plant3, plant3.stage, wait, plant3.dat.length)}, (Math.random() * 10 + 3) * 1000);

}


function decToHex(a){
	let rStr = a.toString(16); let rPos = rStr.indexOf('.'); let rHex = rStr.substr(0, rPos);
	if (rHex.length % 2) {
  		rHex = '0' + rHex;
	}
	return rHex;
}

render();
