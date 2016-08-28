
/**
 * A factory for plain objects.
 *
 * @class FactoryObject
 * @constructor
 * @extends Factory
 */
function FactoryObject()
{
  this.priority = 0;
  this.attributes = {};
}

Class.extend( FactoryObject, Factory,
{
  is: function(subject)
  {
    return isObject( subject ) && !isArray( subject ); /* !isElement( subject ) && */
  },
  animatorFor: function(subject)
  {
    var animator = subject.$animator;

    if ( !animator )
    {
      animator = new Animator( subject );
      animator.factory = this;

      subject.$animator = animator;
    }

    return animator;
  },
  destroy: function(animator)
  {
    delete animator.subject.$animator;
  },
  attribute: function(attr)
  {
    var attribute = this.attributes[ attr ];

    if ( !attribute )
    {
      attribute = this.attributes[ attr ] = object.attribute( attr );

      var calculatorName = attribute.calculator;
      var calculator = calculator( calculatorName );
      var defaultValue = calculator.parse( attribute.defaultValue, calculator.ZERO );

      attribute.calculatorName = calculatorName;
      attribute.calculator = calculator;
      attribute.defaultValue = defaultValue;
      attribute.name = attr;
      attribute.parse = function(value) {
        return this.calculator.parse( value, this.defaultValue );
      };
      attribute.cloneDefault = function() {
        return this.calculator.clone( this.defaultValue );
      };
    }

    return attribute;
  }
});

/**
 * The Object namespace.
 *
 * @type {Object}
 */
var object = {};

/**
 * Returns an attribute based on the given input. If the input is an object it's assumed to be an attribute and it's
 * returned immediately. If the input is a string the attribute with the given name is returned. Otherwise
 * the default attribute is returned.
 *
 * @param {Object|String} attr
 * @return {Object}
 */
object.attribute = function(attr)
{
  if ( isObject( attr ) && isDefined( attr.defaultValue ) )
  {
    return attr;
  }
  if ( isString( attr ) && attr in object.attribute )
  {
    return object.attribute[ attr ];
  }

  return object.attribute['default'];
};

/**
 * The default attribute.
 */
object.attribute['default']                 = {defaultValue: 0};
