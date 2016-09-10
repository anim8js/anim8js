
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
      return calculator.parse( value, defaultValue );
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
      return animator.getAttribute( attrimator.attribute ).parse( value );
    };
  }

  return paramFactory(getCalculator, parseValue, function(attrimator, animator)
  {
    return paramResolve( attrimator, animator, attrimator.parameters[ paramName ], parseValue );
  });
}

function paramFactory(getCalculator, parseValue, computer)
{
  extend( computer, Parameters );

  computer.getCalculator = getCalculator;
  computer.parseValue = parseValue;

  return computed( computer );
}

function paramCalculator(parent, handleCalculation)
{
  return paramFactory(parent.getCalculator, parent.parseValue, function(attrimator, animator)
  {
    var calc = parent.getCalculator( attrimator, animator );

    return handleCalculation( attrimator, animator, parent, calc );
  });
}

function paramResolve(attrimator, animator, value, parser)
{
  if ( parser instanceof Calculator )
  {
    value = parser.parse( value );
  }
  else if ( isFunction( parser ) )
  {
    value = parser( attrimator, animator, value );
  }

  if ( isComputed( value ) )
  {
    return value( attrimator, animator );
  }

  return resolve( value );
}

var Parameters =
{
  add: function(value)
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );
      var valueResolve = paramResolve( attrimator, animator, value, parent.parseValue );

      return calc.add( out, valueResolve );
    };

    return paramCalculator( this, handleCalculation );
  },

  sub: function(value)
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );
      var valueResolve = paramResolve( attrimator, animator, value, parent.parseValue );

      return calc.sub( out, valueResolve );
    };

    return paramCalculator( this, handleCalculation );
  },

  mul: function(value)
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );
      var valueResolve = paramResolve( attrimator, animator, value, parent.parseValue );

      return calc.mul( out, valueResolve );
    };

    return paramCalculator( this, handleCalculation );
  },

  div: function(value)
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );
      var valueResolve = paramResolve( attrimator, animator, value, parent.parseValue );

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
      var scalarResolve = paramResolve( attrimator, animator, scalar, calcScalar );

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
      var valueResolve = paramResolve( attrimator, animator, value, parent.parseValue );
      var scalarResolve = paramResolve( attrimator, animator, scalar, calcScalar );

      return calc.adds( out, valueResolve, scalarResolve );
    };

    return paramCalculator( this, handleCalculation );
  },

  abs: function()
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );

      return calc.abs( out );
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

  sqrt: function()
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );

      return Math.sqrt( out );
    };

    return paramCalculator( this, handleCalculation );
  },

  min: function(value)
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );
      var valueResolve = paramResolve( attrimator, animator, value, parent.parseValue );

      return calc.min( out, out, valueResolve );
    };

    return paramCalculator( this, handleCalculation );
  },

  max: function(value)
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );
      var valueResolve = paramResolve( attrimator, animator, value, parent.parseValue );

      return calc.max( out, out, valueResolve );
    };

    return paramCalculator( this, handleCalculation );
  },

  floor: function()
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );

      return Math.floor( out );
    };

    return paramCalculator( this, handleCalculation );
  },

  ceil: function()
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );

      return Math.ceil( out );
    };

    return paramCalculator( this, handleCalculation );
  },

  round: function()
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );

      return Math.round( out );
    };

    return paramCalculator( this, handleCalculation );
  },

  truncate: function(denominator)
  {
    var calcDenominator = $calculator('number');

    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );
      var denominatorResolve = paramResolve( attrimator, animator, denominator, calcDenominator );

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
      var divisorResolve = paramResolve( attrimator, animator, divisor, calcDivisor );

      return out % divisorResolve;
    };

    return paramCalculator( this, handleCalculation );
  },

  toDegrees: function()
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );

      return out * 180 / Math.PI;
    };

    return paramCalculator( this, handleCalculation );
  },

  toRadians: function()
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );

      return out / 180 * Math.PI;
    };

    return paramCalculator( this, handleCalculation );
  },

  cos: function()
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );

      return Math.cos( out );
    };

    return paramCalculator( this, handleCalculation );
  },

  sin: function()
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );

      return Math.sin( out );
    };

    return paramCalculator( this, handleCalculation );
  },

  tan: function()
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );

      return Math.tan( out );
    };

    return paramCalculator( this, handleCalculation );
  },

  cosDegrees: function()
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );

      return Math.cos( out / 180 * Math.PI );
    };

    return paramCalculator( this, handleCalculation );
  },

  sinDegrees: function()
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );

      return Math.sin( out / 180 * Math.PI );
    };

    return paramCalculator( this, handleCalculation );
  },

  tanDegrees: function()
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );

      return Math.tan( out / 180 * Math.PI );
    };

    return paramCalculator( this, handleCalculation );
  },

  distance: function(value)
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );
      var valueResolve = paramResolve( attrimator, animator, value, parent.parseValue );

      return calc.distance( out, valueResolve );
    };

    return paramCalculator( this, handleCalculation );
  },

  property: function(propertyName, defaultValue)
  {
    var handleCalculation = function(attrimator, animator, parent, calc)
    {
      var out = parent( attrimator, animator );

      return isObject( out ) ? out[ propertyName ] : defaultValue;
    };

    return paramCalculator( this, handleCalculation );
  }

};
