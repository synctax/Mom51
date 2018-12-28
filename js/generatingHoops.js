
//variables that change species
let iterations = 4;

var circles = [];

function drawHoops(lastNode, nodesLeft, prevAng){

	var circleDoesWork = true;
	var centerX, centerY, radius, ang;
	var suggestedRadius;
	var failedAttempts = 0;
	do {
		let angDir = Math.random() * 100 > 50 ? -1 : 1;
		let ang = -1 * 90 + (angDir * (Math.random() * (90 - 45) + 30 )) * Math.PI / 180; g = (Math.random() * (Math.PI * 100 / 180) + 40);
		radius = Math.random() * 15 + (6.5 * nodesLeft) + 10;
		if(failedAttempts > 50) {
			radius = suggestedRadius - 2;
			break;
		} 
		radius = radius / 16;

		centerX = lastNode.x + lastNode.radius*(Math.cos(ang)) + (Math.cos(ang)*radius);
		centerY = lastNode.y + lastNode.radius*(Math.sin(ang)) + (Math.sin(ang)*radius);

		circleDoesWork = true;
		for(var ic = 0; ic < circles.length; ic++){
			let c = circles[ic];
			dist = Math.pow(c.x - centerX, 2) + Math.pow(c.y - centerY, 2);
			if ( dist < Math.pow(c.radius + radius - 1, 2) ){
				circleDoesWork = false;
				suggestedRadius = Math.sqrt(dist) - c.radius;
				radius = suggestedRadius;
				failedAttempts += 1;
			}
		}
	} while(!circleDoesWork);
	radius -= .1;
	if(radius > 0 && failedAttempts <= 40 && radius > .25){

		let red =  Math.random() * 125; 
		let green = Math.random() * 10 * nodesLeft + 10; 
		let blue = Math.random() * 125;


		//add object to scene
		var cylinderGeometry = new THREE.CylinderGeometry(radius, radius, .25, 32);
		var cylinderMaterial = new THREE.MeshBasicMaterial( {color : parseInt("0x" + decToHex(red) + decToHex(green) + decToHex(blue))} );
		var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
		cylinder.position.x = centerX;
		cylinder.position.y = -centerY - 5;
		cylinder.position.z = 0;
		cylinder.rotation.x = Math.PI/2;
		//scene.add(cylinder);
		var ringGeometry = new THREE.RingGeometry(radius - 0.125, radius, 32);
		var ringMaterial = new THREE.MeshBasicMaterial( { color : 0x000000 });
		var ring = new THREE.Mesh(ringGeometry, ringMaterial);
		ring.position.x = centerX;
		ring.position.y = -centerY - 5;
		ring.position.z = .5;
		//scene.add(ring);


		//scr.arc(centerX, centerY, radius, 0, 2 * Math.PI);

		//color changing for species
	
		let node = {"x": centerX, "y": centerY,"radius":radius, "nodeNum": iterations - nodesLeft, "cyl": cylinder, "rin": ring};
		circles.push(node);
		for(var i = 0; i < nodesLeft; i++){
			let a = Math.random() * 100;
			if( a < 5){
				drawHoops(node, i + 1, ang)
			} else if(a < 15) {
				drawHoops(node, nodesLeft - 1, ang);
			} else {
				drawHoops(node, i, ang);
			}
		}
	}	

}

drawHoops({"x": 0, "y": 0, "radius": 0}, iterations, 0);


var currNodeNum = 0;
function addHoop(){
	if(currNodeNum > iterations){
		return ;
	} else {
		for(var c = 0; c < circles.length; c++){
			if(circles[c].nodeNum == currNodeNum){
				scene.add(circles[c].cyl);
				scene.add(circles[c].rin);
			}
		}
		currNodeNum += 1;
	}
}

setInterval(addHoop, 5 * 1000);

function decToHex(a){
	let rStr = a.toString(16); let rPos = rStr.indexOf('.'); let rHex = rStr.substr(0, rPos);
	if (rHex.length % 2) {
  		rHex = '0' + rHex;
	}
	return rHex;
}

render();
