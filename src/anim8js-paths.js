
m8.definePath('tween', function(delta, params) {
  return params[0] * (1.0 - delta) + params[1] * delta;
});
m8.definePath('linear', function(delta, params) {
  var max = params.length - 1;
  var d = delta * max;
  var df = Math.floor(d);
  var dr = d - df;
  var i = Math.min(max, df);
  
  return params[i] * (1.0 - dr) + params[i + 1] * dr;
});
m8.definePath('jump', function(delta, params) {
  var max = params.length - 1;
  var i = Math.min(max, Math.floor(max * delta));
  
  return params[i];
});