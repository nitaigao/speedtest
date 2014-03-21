exports.square = function(x) {
  var result = x * x;
  return result;
}

exports.distance = function (a, b) {
  var distance = Math.sqrt(this.square(a.latitude - b.latitude) + this.square(a.longitude - b.longitude))
  return distance;
}
