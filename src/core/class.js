
var Class =
{
  superPrefix: '_',

  create: function(construct, parentConstructor, properties)
  {
    construct.prototype = new parentConstructor();

    if ( isObject( properties ) )
    {
      this.define( construct, properties );
    }
  },

  define: function(construct, properties)
  {
    var target = construct.prototype;

    for (var prop in properties)
    {
      if ( prop in target )
      {
        this.defineProperty( target, this.superPrefix + prop, target[ prop ] );
      }

      this.defineProperty( target, prop, properties[ prop ] );
    }
  },

  defineProperty: function(target, property, value)
  {
    if ( Object.defineProperty )
    {
      Object.defineProperty( target, property, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: value
      });
    }
    else
    {
      target[ property ] = value;
    }
  }
};
