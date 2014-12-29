var script = document.scripts[document.scripts.length - 1];

var m8prop = script.dataset['prop'] || '$';
var m8access = script.dataset['access'] || 'property';
    
_isString = function(x) {
  return typeof x === 'string';
};
_isArray = function(x) {
  return x instanceof Array;
};
_isObject = function(x) {
  return typeof x === 'object';
};
_isNumber = function(x) {
  return typeof x === 'number';
};
_isDefined = function(x) {
  return typeof x !== 'undefined';
};
_extend = function(out) {
  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i];
    for (var key in arg) {
      if (!(key in out)) {
        out[key] = arg[key];
      }
    }
  }
  return out;
};
_coalesce = function(a, b, c, d) {
  if (_isDefined(a) && a !== null) return a;
  if (_isDefined(b) && b !== null) return b;
  if (_isDefined(c) && c !== null) return c;
  if (_isDefined(d) && d !== null) return d;
};

function anim8js(object) {
  this.object = object;
  m8.init(object, this);
}

// get('x') : 0
// get(['x', 'y']) : {x:0, y:1}

anim8js.prototype.get = function(prop) {
  if (_isArray(prop)) {
    var values = {};
    for (var i = 0; i < prop.length; i++) {
      values[prop[i]] = this.get(prop[i]);
    }
  }
  if (_isString(prop)) {
    return m8.properties[prop].get(this.object); 
  }
};

// set('x', 0) : this
// set({x:0, y:1}) : this

anim8js.prototype.set = function(prop, value) {
  if (_isObject(prop)) {
    for (var nm in prop) {
      this.set(nm, prop[nm]);
    }
  }
  if (_isNumber(value)) {
    m8.properties[prop].set(this.object, value); 
  }
  return this;
};

var m8 = function(object) {
  if (!(m8prop in object)) {
    object[m8prop] = new anim8js(object);
  }
  return object[m8prop];
};

m8.properties = {};

m8.defineProperty = function(nm, definition) {
  m8.properties[nm] = definition;
  if (m8access === 'function') {
    anim8js.prototype[nm] = function() {
      if (arguments.length == 0) {
        return definition.get(this.object);
      } else {
        definition.set(this.object, arguments[0]);
        return this;
      }
    };
  }
  else if (m8access === 'property') {
    Object.defineProperty(anim8js.prototype, nm, {
      get: function() {
        return definition.get(this.object);
      },
      set: function(value) {
        definition.set(this.object, value);
      }
    });
  }
  else if (m8access in window && typeof window[m8access] === 'function') {
    window[m8access](anim8js.prototype, nm, definition);
  }
};

m8.paths = {};
m8.definePath = function(nm, path) {
  m8.paths[nm] = path;
  anim8js.prototype[nm] = function(property, params, duration, easing, easingType) {
    
    if (_isArray(property)) {
      for (var i = 0; i < property.length; i++) {
        var prop = property[i];
        var fparams = [];
        for (var k = 0; k < params.length; k++) {
          var p = params[k];
          if (p === true) {
            fparams[k] = this.get(prop);
          }
          else if (_isNumber(p)) {
            fparams[k] = p;
          }
          else if (_isObject(p)) {
            fparams[k] = p[prop]; 
          }
        }
        this[nm](prop, fparams, duration, easing, easingType);
      }
      return this;
    }
    
    for (var k = 0; k < params.length; k++) {
      var p = params[k];
      if (p === true) {
        params[k] = this.get(property);
      }
    }
    
    var prop = m8.properties[property];
    var time = 0;
    var interval = null;
    var object = this.object;
    easing = easing || 'linear';
    easingType = easingType || 'in';
    interval = setInterval(function() {
      time += 10;
      prop.set(object, path(m8.ease(easingType, easing, time / duration), params));
      if (time >= duration) {
        clearInterval(interval);
      }
    }, 10);
    return this;
  };
};

m8.easings = {};
m8.easingTypes = {};
m8.defineEasing = function(nm, easing) {
  m8.easings[nm] = easing; // function(d)
};
m8.defineEasingType = function(nm, easingType) {
  m8.easingTypes[nm] = easingType; // function(d, easing)
};
m8.ease = function(type, easing, delta) {
  type = m8.easingTypes[type];
  ease = m8.easings[easing];
  
  return type(delta, ease);
};


m8.calculators = {};
m8.defineCalculator = function(nm, methods) {
  
  // copy(out, copy)
  //-clone(out)
  // create()
  // zero(out)
  //-scale(out, scale)
  //-add(out, amount)
  // adds(out, amount, amountScale)
  //-sub(out, amount)
  // mul(out, scale)
  //-interpolate(out, start, end, delta)
  // distanceSq(a, b)
  // isValid(a)
  // isNaN(a)
  // isZero(a, epsilon)
  // isEqual(a, b, epsilon)
  
  _extend(methods, {
    clone: function(out) {
      return this.copy(this.create(), out);
    },
    scale: function(out, scale) {
      return this.adds(out, out, scale - 1);
    },
    add: function(out, amount) {
      return this.adds(out, amount, 1);
    },
    sub: function(out, amount) {
      return this.adds(out, amount, -1);
    },
    interpolate: function(out, start, end, delta) {
      out = c.zero(out);
      out = c.adds(out, start, 1 - delta);
      out = c.adds(out, end, delta);
      return out;
    }
  });
  
  m8.calculators[nm] = methods;
};
