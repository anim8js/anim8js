m8.defineEasingType('in', function(d, easing) {
  return easing(d);
});

m8.defineEasingType('out', function(d, easing) {
  return 1.0 - easing(1.0 - d);
}); 

m8.defineEasingType('inout', function(d, easing) {
  if (d < 0.5) {
    return easing(2 * d) * 0.5;
  } else {
    return 1.0 - (easing(2 - 2 * d) * 0.5);
  }
});

m8.defineEasingType('pingpong', function(d, easing) {
  if (d < 0.5) {
    return easing(2 * d);
  } else {
    return easing(2 - 2 * d);
  }
});