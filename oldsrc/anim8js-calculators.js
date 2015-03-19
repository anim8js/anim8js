/*********************************************************************
 * A calculator for number primitives.
 *********************************************************************/
m8.defineCalculator('number', {
  copy: function(out, copy) {
    return copy;
  },
  create: function() {
    return 0.0;
  },
  zero: function(out) {
    return 0.0;
  },
  adds: function(out, amount, amountScale) {
    return out += amount * amountScale;
  },
  mul: function(out, scale) {
    return out *= scale;
  },
  distanceSq: function(a, b) {
    var ab = a - b;
    return ab * ab;
  },
  isValid: function(a) {
    return typeof a === 'number';
  },
  isNaN: function(a) {
    return isNaN(a);
  },
  isZero: function(a, epsilon) {
    return Math.abs(a) < epsilon;
  },
  isEqual: function(a, b, epsilon) {
    return Math.abs(a - b) < epsilon;
  }
});

/*********************************************************************
 * A calculator for objects with an x and y component (number)
 *********************************************************************/
m8.defineCalculator('2d', {
  copy: function(out, copy) {
    out.x = copy.x;
    out.y = copy.y;
    return out;
  },
  create: function() {
    return {x: 0.0, y:0.0};
  },
  zero: function(out) {
    out.x = 0.0;
    out.y = 0.0;
    return out;
  },
  adds: function(out, amount, amountScale) {
    out.x += amount.x * amountScale;
    out.y += amount.y * amountScale;
    return out;
  },
  mul: function(out, scale) {
    out.x *= scale.x;
    out.y *= scale.y;
    return out;
  },
  distanceSq: function(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;    
    return dx * dx + dy * dy;
  },
  isValid: function(a) {
    return typeof a === 'object' && 'x' in a && 'y' in a;
  },
  isNaN: function(a) {
    return isNaN(a.x) || isNaN(a.y);
  },
  isZero: function(a, epsilon) {
    return Math.abs(a.x) < epsilon && Math.abs(a.y) < epsilon;
  },
  isEqual: function(a, b, epsilon) {
    return Math.abs(a.x - b.x) < epsilon && Math.abs(a.y - b.y) < epsilon;
  }
});

/*********************************************************************
 * A calculator for objects with r, g, & b components (numbers 0 -> 255)
 *********************************************************************/
m8.defineCalculator('rgb', {
  copy: function(out, copy) {
    out.r = copy.r;
    out.g = copy.g;
    out.b = copy.b;
    return out;
  },
  create: function() {
    return {r: 0, g:0, b:0};
  },
  zero: function(out) {
    out.r = 0;
    out.g = 0;
    out.b = 0;
    return out;
  },
  adds: function(out, amount, amountScale) {
    out.r += amount.r * amountScale;
    out.g += amount.g * amountScale;
    out.b += amount.b * amountScale;
    return out;
  },
  mul: function(out, scale) {
    out.r *= scale.r;
    out.g *= scale.g;
    out.b *= scale.b;
    return out;
  },
  distanceSq: function(a, b) {
    var dr = a.r - b.r;
    var dg = a.g - b.g;    
    var db = a.b - b.b;    
    return dr * dr + dg * dg + db * db;
  },
  isValid: function(a) {
    return typeof a === 'object' && 'r' in a && 'g' in a && 'b' in a;
  },
  isNaN: function(a) {
    return isNaN(a.r) || isNaN(a.g) || isNaN(a.b);
  },
  isZero: function(a, epsilon) {
    return Math.abs(a.r) < epsilon && 
           Math.abs(a.g) < epsilon && 
           Math.abs(a.b) < epsilon;
  },
  isEqual: function(a, b, epsilon) {
    return Math.abs(a.r - b.r) < epsilon && 
           Math.abs(a.g - b.g) < epsilon && 
           Math.abs(a.b - b.b) < epsilon;
  }
});

/*********************************************************************
 * A calculator for objects with r, g, & b components 
 * (numbers 0 -> 255) and an a (alpha) component (0.0 -> 1.0).
 *********************************************************************/
m8.defineCalculator('rgba', {
  copy: function(out, copy) {
    out.r = copy.r;
    out.g = copy.g;
    out.b = copy.b;
    out.a = copy.a;
    return out;
  },
  create: function() {
    return {r: 0, g:0, b:0, a:0};
  },
  zero: function(out) {
    out.r = 0;
    out.g = 0;
    out.b = 0;
    out.a = 0;
    return out;
  },
  adds: function(out, amount, amountScale) {
    out.r += amount.r * amountScale;
    out.g += amount.g * amountScale;
    out.b += amount.b * amountScale;
    out.a += amount.a * amountScale;
    return out;
  },
  mul: function(out, scale) {
    out.r *= scale.r;
    out.g *= scale.g;
    out.b *= scale.b;
    out.a *= scale.a;
    return out;
  },
  distanceSq: function(a, b) {
    var dr = a.r - b.r;
    var dg = a.g - b.g;    
    var db = a.b - b.b;    
    var da = a.a - b.a;    
    return dr * dr + dg * dg + db * db + da * da;
  },
  isValid: function(a) {
    return typeof a === 'object' && 'r' in a && 'g' in a && 'b' in a && 'a' in a;
  },
  isNaN: function(a) {
    return isNaN(a.r) || isNaN(a.g) || isNaN(a.b) || isNaN(a.a);
  },
  isZero: function(a, epsilon) {
    return Math.abs(a.r) < epsilon && 
           Math.abs(a.g) < epsilon && 
           Math.abs(a.b) < epsilon && 
           Math.abs(a.a) < epsilon;
  },
  isEqual: function(a, b, epsilon) {
    return Math.abs(a.r - b.r) < epsilon && 
           Math.abs(a.g - b.g) < epsilon && 
           Math.abs(a.b - b.b) < epsilon && 
           Math.abs(a.a - b.a) < epsilon;
  }
});
