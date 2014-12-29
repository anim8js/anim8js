m8.defineEasing('linear', function(d) {
  return d;
});
m8.defineEasing('quad', function(d) {
  return d * d;
});
m8.defineEasing('cubic', function(d) {
  return d * d * d;
});
m8.defineEasing('quartic', function(d) {
  var d2 = d * d;
  return d2 * d2;
});
m8.defineEasing('quintic', function(d) {
  var d2 = d * d;
  return d2 * d2 * d;
});
m8.defineEasing('back', function(d) {
  var d2 = d * d;
	var d3 = d2 * d;
	return d3 + d2 - d;
});
m8.defineEasing('sine', function(d) {
  var FREQUENCY = Math.PI * 0.5;
  return Math.sin(d * FREQUENCY);
});