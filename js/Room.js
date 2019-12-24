var Room = function(x, y, z){
  this.x = x;
  this.y = y;
  this.z = z;

  this.halls = [];
  this.objects = [];

  //set up the default room
  this.objects.push(new THREE.PointLight(0x333333));
  this.objects[0].position.set(x,y-10,z);
  scene.add(this.objects[0]);

  this.objects.push(new THREE.Mesh(new THREE.SphereBufferGeometry(this.gallery.roomSize, 12, 8), this.gallery.createMaterial()));
  this.objects[1].position.set(x, y, z);
  scene.add(this.objects[1]);

  this.bbox = new THREE.Box3().setFromObject(this.objects[1]);
}

Room.prototype.genHalls = function(){
  var hallPositions = [{x:  1, z:  0, facesZ: false},
                       {x:  0, z:  1, facesZ: true },
                       {x: -1, z:  0, facesZ: false},
                       {x:  0, z: -1, facesZ: true }];
  this.halls = [];
  for(var i = 0; i < 4; i++){
    this.halls.push(new Hall(this.x + hallPositions[i].x*(this.gallery.roomSize + this.gallery.hallSize/2 - 2),
                             this.y,
                             this.z + hallPositions[i].z*(this.gallery.roomSize + this.gallery.hallSize/2 - 2),
                             hallPositions[i].facesZ));
    }
}

Room.prototype.collided = function(pos){
  return this.bbox.containsPoint(pos);
}

Room.prototype.delete = function(){
  for(var i = 0; i < this.halls.length; i++){
    this.halls[i].delete();
  }
  for(var i = 0; i < this.objects.length; i++){
    scene.remove(this.objects[i]);
  }
}
