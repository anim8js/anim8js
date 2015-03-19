m8.init = function(e, anim8js) {
  e.style.position = 'absolute';
  
  /*
  anim8js.x = new Attribute('x');
  anim8js.y = new Attribute('y');
  anim8js.pos = new Attribute2d(anim8js.x, anim8js.y);
  
  anim8js.sx = new Attribute('sx');
  anim8js.sy = new Attribute('sy');
  anim8js.scale = new Attribute2d(anim8js.sx, anim8js.sy);

  anim8js.ax = new Attribute('ax');
  anim8js.ay = new Attribute('ay');
  anim8js.anchor = new Attribute2d(anim8js.ax, anim8js.ay);
  
  
  */
};

anim8js.prototype.apply = function()
{
  
};

m8.defineProperty('x', {
  calculator: 'number',
  get: function(e) {
    return e.offsetLeft;
  },
  set: function(e, value) {
    return e.style.left = value + 'px';
  }
});

m8.defineProperty('y', {
  calculator: 'number',
  get: function(e) {
    return e.offsetTop;
  },
  set: function(e, value) {
    return e.style.top = value + 'px';
  }
});

m8.defineProperty('w', {
  calculator: 'number',  
  get: function(e) {
    return e.offsetWidth;
  },
  set: function(e, value) {
    return e.style.width = value + 'px';
  }
});

m8.defineProperty('h', {
  calculator: 'number',  
  get: function(e) {
    return e.offsetHeight;
  },
  set: function(e, value) {
    return e.style.height = value + 'px';
  }
});

m8.defineProperty('distance', {
  calculator: 'number',  
  get: function(e) {
    var x = e.offsetLeft;
    var y = e.offsetTop;
    return Math.sqrt(x * x + y * y);
  },
  set: function(e, value) {
    var angle = Math.atan2(e.offsetTop, e.offsetLeft);
    e.style.left = (Math.cos(angle) * value) + 'px';
    e.style.top = (Math.sin(angle) * value) + 'px';
  }
});

m8.defineProperty('angle', {
  calculator: 'number',  
  get: function(e) {
    var x = e.offsetLeft;
    var y = e.offsetTop;
    return Math.atan2(y, x);
  },
  set: function(e, value) {
    var x = e.offsetLeft;
    var y = e.offsetTop;
    var d = Math.sqrt(x * x + y * y);
    e.style.left = (Math.cos(value) * d) + 'px';
    e.style.top = (Math.sin(value) * d) + 'px';
  }
});

m8.defineProperty('bgcolor', {
  calculator: 'rgb',
  get: function(e) {
    return m8.color.parse(e.style.backgroundColor);
  },
  set: function(e, value) {
    e.style.backgroundColor = m8.color.format(value);
  }
});

m8.defineProperty('rotation', {
  calculator: 'number', 
  
  get: function(e) {
    
    if (!_isDefined(this._getter)) {
      
      var parse = function(property, regex, converter) {
        return function(e) {
          var stringValue = e.style[property];
          if (_isString(stringValue)) {
            var matches = regex.exec(stringValue);
            if (matches instanceof Array) {
              var value = parseFloat(matches[1]);
              if (!isNaN(value)) {
                return converter(value, matches);
              } 
            }
          }
          return 0.0;
        };
      };
      
      if (_isDefined(e.style.transform)) {
        this._getter = parse('transform', this.regex.transform, this.convert.transform);
      }
      else if (_isDefined(e.style.WebkitTransform)) {
        this._getter = parse('WebkitTransform', this.regex.transform, this.convert.transform);
      }
      else if (_isDefined(e.style.MozTransform)) {
        this._getter = parse('MozTransform', this.regex.transform, this.convert.transform);
      }
      else if (_isDefined(e.style.OTransform)) {
        this._getter = parse('OTransform', this.regex.transform, this.convert.transform);
      }
      else if (_isDefined(e.style.filter)) {
        this._getter = parse('filter', this.regex.filter, this.convert.filter);
      }
      else if (_isDefined(e.style.MsFilter)) {
        this._getter = parse('MsFilter', this.regex.filter, this.convert.filter);
      }
    }
    
    return this._getter ? this._getter(e) : 0.0;
  },
  
  set: function(e, value) {
    
    if (!_isDefined(this._setter)) {
      
      var format = function(property, formatter) {
        return function(e, value) {
          e.style[property] = formatter(value);
        };
      };
      
      if (_isDefined(e.style.transform)) {
        this._setter = format('transform', this.formatter.transform);
      }
      else if (_isDefined(e.style.WebkitTransform)) {
        this._setter = format('WebkitTransform', this.formatter.transform);
      }
      else if (_isDefined(e.style.MozTransform)) {
        this._setter = format('MozTransform', this.formatter.transform);
      }
      else if (_isDefined(e.style.OTransform)) {
        this._setter = format('OTransform', this.formatter.transform);
      }
      else if (_isDefined(e.style.filter)) {
        this._setter = format('filter', this.formatter.filter);
      }
      else if (_isDefined(e.style.MsFilter)) {
        this._setter = format('MsFilter', this.formatter.msfilter);
      }
    }
   
    if (this._setter) {
      this._setter(e, value);
    }
  },
  
  regex: {
    transform: /rotate\((.+)(deg|rad)\)/i,
    filter: /M11=([^,]+)/i
  },
  
  convert: {
    transform: function(x, matches) {
      if (matches[2] === 'rad') {
        x = x * 180 / Math.PI;
      }
      return x;
    },
    filter: function(x, matches) {
      return Math.acos(x);
    }
  },
  
  formatter: {
    transform: function(x) {
      return 'rotate('+x+'deg)';
    },
    filter: function(x) {
      var cos = Math.cos(x);
      var sin = Math.sin(x);
      return "progid:DXImageTransform.Microsoft.Matrix(SizingMethod='auto expand', M11="+cos+", M12="+(-sin)+", M21="+sin+", M22="+cos+")";
    }
    msfilter: function(x) {
      return '"' + this.filter(x) + '"';
    }
  }
});

