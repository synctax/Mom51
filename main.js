var Width = 0
var Height = 0


let screen = document.getElementById("screen");
let scr = screen.getContext("2d")

function draw(){
	Width = document.getElementsByTagName('body')[0].clientWidth
	Height = document.getElementsByTagName('body')[0].clientHeight

	screen.width = Width
	screen.height = Height

	scr.fillStyle = "0000FF";
	scr.beginPath();
	//scr.arc(Width/2, Height/2, 100, 0, 2 * Math.PI);
	drawPlant();
	//scr.stroke();
}

function drawPlant(){

	var circles = [];

	let nodes = 5;
	let StartX = Width/2;
	let StartY = Height/2;


	for(var i = 0; i < nodes; i++){
		while(){}
		let ang = Math.random() * Math.PI * 2;
		let radius = Math.random() * 90 + 10;
		let centerX = lastCenterX + lastRadius*(Math.cos(ang)) + (Math.cos(ang)*radius);
		let centerY = lastCenterY + lastRadius*(Math.sin(ang)) + (Math.sin(ang)*radius);
		scr.beginPath();
		scr.arc(centerX, centerY, radius, 0, 2 * Math.PI);
		scr.stroke();
		circles.push({"x": centerX, "y": centerY,"radius":radius});
	}
}

draw()
