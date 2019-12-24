var EventHandler = function(scene, camera){

  this.controls = new PointerLockControls(camera, document.body);
  this.forwardDown = false;
  this.downDown = false;
  this.leftDown = false;
  this.rightDown = false;

  var scope = this;
  var raycaster = new THREE.Raycaster();

  this.checkCollide = function(){
    var intersections = raycaster.intersectObjects(scene.children);
    for(var i = 0; i < intersections.length; i++){
      if(intersections[i].distance < 1){
        //return true;
      }
    }
    return false;
  }

  this.update = function(){
    if(scope.forwardDown) {
      var v = new THREE.Vector3()
      v.setFromMatrixColumn( camera.matrix, 0 );
  		v.crossVectors( camera.up, v );
      raycaster.set(camera.position, v);
      if(!this.checkCollide()){
        scope.controls.moveForward(1);
      }
  	}
  	if(scope.leftDown) {
      var v = new THREE.Vector3()
      v.setFromMatrixColumn( camera.matrix, 0 );
      v.negate();
      raycaster.set(camera.position, v);
      if(!this.checkCollide()){
        scope.controls.moveRight(-1);
      }
  	}
  	if(scope.downDown){
      var v = new THREE.Vector3()
      v.setFromMatrixColumn( camera.matrix, 0 );
  		v.crossVectors( camera.up, v );
      v.negate();
      raycaster.set(camera.position, v);
      if(!this.checkCollide()){
        scope.controls.moveForward(-1);
      }
  	}
  	if(scope.rightDown){
      var v = new THREE.Vector3()
      v.setFromMatrixColumn( camera.matrix, 0 );
      raycaster.set(camera.position, v);
      if(!this.checkCollide()){
        scope.controls.moveRight(1);
      }
  	}
  }

  document.addEventListener('keydown', function(event) {
      if(event.keyCode == 87) {
  			//w pressed
  			scope.forwardDown = true;
  		}
      else if(event.keyCode == 65) {
      	//a pressed
  			scope.leftDown = true;
  		}
  		else if(event.keyCode == 83){
  			//s pressed
  			scope.downDown = true;
  		}
  		else if(event.keyCode == 68){
  			//d pressed
  			scope.rightDown = true;
  		}
  		else if(event.keyCode == 27) {
  			scope.controls.unlock();
  		}
  });

  document.addEventListener('keyup', function(event) {
  	if(event.keyCode == 87) {
  		//w pressed
  		scope.forwardDown = false;
  	}
  	else if(event.keyCode == 65) {
  		//a pressed
  		scope.leftDown = false;
  	}
  	else if(event.keyCode == 83){
  		//s pressed
  		scope.downDown = false;
  	}
  	else if(event.keyCode == 68){
  		//d pressed
  		scope.rightDown = false;
  	}
  });

  window.addEventListener( 'click', function () {
  		//console.log("clicked");
  		scope.controls.lock();
  }, false );
}
