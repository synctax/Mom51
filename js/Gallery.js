var Gallery = function(scene, player, exhibits){

  this.createMaterial = function() {
    const material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide
    });

    const hue = Math.random();
    const saturation = 1;
    const luminance = .5;
    material.color.setHSL(hue, saturation, luminance);

    return material;
  };

  //sphere radius
  this.roomSize = 20;
  //half hall length
  this.hallSize = 20;
  this.hallHeight = 7.5;
  this.hallWidth = 10;

  //janky way (requires gallery singleton)
  Room.prototype.gallery = this;
  Hall.prototype.gallery = this;

  this.player = player;

  this.currentRoom;
  //if we are in a hall, this will be populated with the next hall
  this.inHall = false;
  this.currentHall = 0;
  this.nextRoom = 0;

  //init
  player.position.set(0, 0, 0);
  this.currentRoom = new Room(0, 0, 0); //lobby
  this.currentRoom.genHalls();
};
Gallery.prototype.update = function(){
  var hallPositions = [{x:  1, z:  0, facesZ: false},
                       {x:  0, z:  1, facesZ: true },
                       {x: -1, z:  0, facesZ: false},
                       {x:  0, z: -1, facesZ: true }];
  //see if we entered a hall
  if(!this.inHall){
    for(var i = 0; i < this.currentRoom.halls.length; i++){
      if(this.currentRoom.halls[i].collided(this.player.position)){
        this.inHall = true;
        this.currentHall = this.currentRoom.halls[i];
        this.nextRoom = new Room(this.currentRoom.halls[i].x + hallPositions[i].x*(this.hallSize/2 + this.roomSize),
                                 this.currentRoom.halls[i].y,
                                 this.currentRoom.halls[i].z + hallPositions[i].z*(this.hallSize/2 + this.roomSize));
        return
      }
    }
  } else {
    if(this.currentRoom.collided(this.player.position)){
      this.inHall = false;
      this.nextRoom.delete();
      this.nextRoom = 0;
    } else if(this.nextRoom.collided(this.player.position)){
      this.inHall = false;
      this.currentRoom.delete();
      this.currentRoom = 0;

      this.currentRoom = this.nextRoom;
      this.currentRoom.genHalls();
      this.nextRoom = 0;
    }
  }
}
