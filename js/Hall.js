var Hall = function(x, y, z, facesZ){
  //room1 exists already
  this.x = x;
  this.y = y;
  this.z = z;
  this.facesZ = facesZ;

  this.objects = [];
  if(facesZ){
    this.objects.push(new THREE.Mesh(new THREE.BoxBufferGeometry(this.gallery.hallWidth, this.gallery.hallHeight, this.gallery.hallSize), this.gallery.createMaterial()));
  } else {
    this.objects.push(new THREE.Mesh(new THREE.BoxBufferGeometry(this.gallery.hallSize, this.gallery.hallHeight, this.gallery.hallWidth), this.gallery.createMaterial()));
  }
  this.objects[0].position.set(x, y, z);
  scene.add(this.objects[0]);
  this.bbox = new THREE.Box3().setFromObject(this.objects[0]);
};
Hall.prototype.collided = function(pos){
  return this.bbox.containsPoint(pos);
}
Hall.prototype.delete = function(){
  for(var i = 0; i < this.objects.length; i++){
    scene.remove(this.objects[i]);
  }
}
