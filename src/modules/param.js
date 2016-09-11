
function param(paramName, paramCalculator, paramDefaultValue)
{
  var getCalculator, parseValue;

  if ( paramCalculator )
  {
    var calculator = $calculator( paramCalculator );
    var defaultValue = calculator.parse( paramDefaultValue );

    getCalculator = function(attrimator, animator)
    {
      return calculator;
    };
    parseValue = function(attrimator, animator, value)
    {
      return calculator.parse( value, defaultValue, true );
    };
  }
  else
  {
    getCalculator = function(attrimator, animator)
    {
      return animator.getAttribute( attrimator.attribute ).calculator;
    };
    parseValue = function(attrimator, animator, value)
    {
      return animator.getAttribute( attrimator.attribute ).parse( value, true );
    };
  }

  return paramFactory(getCalculator, parseValue, function(attrimator, animator)
  {
    return resolveComputed( attrimator, animator, attrimator.parameters[ paramName ], parseValue );
  });
}

function paramFactory(getCalculator, parseValue, computer)
{
  extend( computer, Parameters );

  computer.getCalculator = getCalculator;
  computer.parseValue = parseValue;

  return computed( computer );
}

function paramCalculator(parent, handleCalculation, newCalculator)
{
  var getCalculator = parent.getCalculator;
  var parseValue = parent.parseValue;

  if ( newCalculator )
  {
    newCalculator = $calculator( newCalculator );

    getCalculator = function(attrimator, animator)
    {
      return newCalculator;
    };

    parseValue = function(attrimator, animator, value)
    {
      return newCalculator.parse( value, undefined, true );
    };
  }

  return paramFactory(getCalculator, parseValue, function(attrimator, animator)
  {
    var calc = getCalculator( attrimator, animator );

    return handleCalculation( attrimator, animator, parent, calc );
  });
}

var Parameters =
{
  add: function(value)
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );
      var valueResolve = resolveComputed( attrimator, animator, value, parent.parseValue );

      return calc.add( out, valueResolve );
    };

    return paramCalculator( this, handleCalculation );
  },

  sub: function(value)
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );
      var valueResolve = resolveComputed( attrimator, animator, value, parent.parseValue );

      return calc.sub( out, valueResolve );
    };

    return paramCalculator( this, handleCalculation );
  },

  mul: function(value)
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );
      var valueResolve = resolveComputed( attrimator, animator, value, parent.parseValue );

      return calc.mul( out, valueResolve );
    };

    return paramCalculator( this, handleCalculation );
  },

  div: function(value)
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );
      var valueResolve = resolveComputed( attrimator, animator, value, parent.parseValue );

      return calc.div( out, valueResolve );
    };

    return paramCalculator( this, handleCalculation );
  },

  scale: function(scalar)
  {
    var calcScalar = $calculator('number');

    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );
      var scalarResolve = resolveComputed( attrimator, animator, scalar, calcScalar );

      return calc.scale( out, scalarResolve );
    };

    return paramCalculator( this, handleCalculation );
  },

  adds: function(value, scalar)
  {
    var calcScalar = $calculator('number');

    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );
      var valueResolve = resolveComputed( attrimator, animator, value, parent.parseValue );
      var scalarResolve = resolveComputed( attrimator, animator, scalar, calcScalar );

      return calc.adds( out, valueResolve, scalarResolve );
    };

    return paramCalculator( this, handleCalculation );
  },

  neg: function()
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );

      return calc.scale( out, -1 );
    };

    return paramCalculator( this, handleCalculation );
  },

  min: function(value)
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );
      var valueResolve = resolveComputed( attrimator, animator, value, parent.parseValue );

      return calc.min( out, out, valueResolve );
    };

    return paramCalculator( this, handleCalculation );
  },

  max: function(value)
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );
      var valueResolve = resolveComputed( attrimator, animator, value, parent.parseValue );

      return calc.max( out, out, valueResolve );
    };

    return paramCalculator( this, handleCalculation );
  },

  truncate: function(denominator)
  {
    var calcDenominator = $calculator('number');

    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );
      var denominatorResolve = resolveComputed( attrimator, animator, denominator, calcDenominator );

      return Math.floor( out * denominatorResolve ) / denominatorResolve;
    };

    return paramCalculator( this, handleCalculation );
  },

  mod: function(divisor)
  {
    var calcDivisor = $calculator('number');

    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );
      var divisorResolve = resolveComputed( attrimator, animator, divisor, calcDivisor );

      return calc.convert( out, modder( divisor ) );
    };

    return paramCalculator( this, handleCalculation );
  },

  clamp: function(min, max)
  {
    var calcClamp = $calculator('number');

    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );
      var minResolve = resolveComputed( attrimator, animator, min, calcClamp );
      var maxResolve = resolveComputed( attrimator, animator, max, calcClamp );

      return calc.convert( out, clamper( minResolve, maxResolve ) );
    };

    return paramCalculator( this, handleCalculation );
  },

  convert: function(converter)
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );

      return calc.convert( out, converter );
    };

    return paramCalculator( this, handleCalculation );
  },

  abs: function()
  {
    return this.convert( Math.abs );
  },

  sqrt: function()
  {
    return this.convert( Math.sqrt );
  },

  floor: function()
  {
    return this.convert( Math.floor );
  },

  ceil: function()
  {
    return this.convert( Math.ceil );
  },

  round: function()
  {
    return this.convert( Math.round );
  },

  toDegrees: function()
  {
    return this.convert( toDegrees );
  },

  toRadians: function()
  {
    return this.convert( toRadians );
  },

  cos: function()
  {
    return this.convert( Math.cos );
  },

  sin: function()
  {
    return this.convert( Math.sin );
  },

  tan: function()
  {
    return this.convert( Math.tan );
  },

  cosDegrees: function()
  {
    return this.toRadians().cos();
  },

  sinDegrees: function()
  {
    return this.toRadians().sin();
  },

  tanDegrees: function()
  {
    return this.toRadians().tan();
  },

  distance: function(value)
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );
      var valueResolve = resolveComputed( attrimator, animator, value, parent.parseValue );

      return calc.distance( out, valueResolve );
    };

    return paramCalculator( this, handleCalculation, 'number' );
  },

  property: function(propertyName, defaultValue)
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );

      return isObject( out ) ? out[ propertyName ] : defaultValue;
    };

    return paramCalculator( this, handleCalculation, 'number' );
  },

  vector: function(calculator)
  {
    var vectorCalculator = coalesce( calculator, '2d' );

    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var angle = parent( attrimator, animator );

      switch (vectorCalculator) {
        case '2d':
          return {
            x: Math.cos( angle ),
            y: Math.sin( angle )
          };
        case '3d':
          var yaw = angle.x;
          var pitch = angle.y;
          return {
            x: Math.cos( yaw ) * Math.cos( pitch ),
            y: Math.sin( yaw ) * Math.cos( pitch ),
            z: Math.sin( pitch )
          };
      }

      return angle;
    };

    return paramCalculator( this, handleCalculation, vectorCalculator );
  },

  vectorDegrees: function(type)
  {
    return this.toRadians().vector( type );
  },

  relative: function(mask)
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );

      return computed.relative( out, mask )( attrimator, animator );
    };

    return paramCalculator( this, handleCalculation );
  }

};
