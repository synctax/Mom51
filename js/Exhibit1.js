var Exhibit = function(){

}
Exhibit.prototype = Object.create(Room.prototype);
Object.defineProperty(Exhibit.prototype, 'constructor', {
    value: Exhibit,
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });
