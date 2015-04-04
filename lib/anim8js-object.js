
/**
 * A factory for plain objects.
 */
anim8.ObjectFactory = function()
{
  this.priority = 0;
  this.attributes = {};
};

anim8.override( anim8.ObjectFactory.prototype = new anim8.Factory(),
{
  /**
   * Determines whether the given subject is valid for this factory to create Animators for.
   * 
   * @param  {any} subject
   * @return {boolean}
   */
  is: function(subject)
  {
    return anim8.isObject( subject ) && !anim8.isElement( subject ) && !anim8.isArray( subject );
  },

  /**
   * Returns an animator given a subject.
   * 
   * @param  {any} subject
   * @return {anim8.Animator}
   */
  animatorFor: function(subject)
  {
    var animator = subject.$animator;
      
    if ( !animator )
    {
      animator = new anim8.Animator( subject );
      animator.factory = this;
      
      subject.$animator = animator;
    }
    
    return animator;
  },

  /**
   * Destroys the animator by unlinking the animator from the subject.
   * 
   * @param  {anim8.Animator} animator
   * @return {void}
   */
  destroy: function(animator)
  {
    delete animator.subject.$animator;
  },

  /**
   * Returns the attribute descriptor for the given attribute.
   * 
   * @param  {string} attr
   * @return {object}
   */
  attribute: function(attr)
  {
    var attribute = this.attributes[ attr ];

    if ( !attribute )
    {
      attribute = this.attributes[ attr ] = anim8.object.attribute( attr );

      var calculatorName = attribute.calculator;
      var calculator = anim8.calculator( calculatorName );
      var defaultValue = calculator.parse( attribute.defaultValue, calculator.create() );

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
 * Registers the object factory.
 */
anim8.factory.object = new anim8.ObjectFactory();
anim8.factory.default = anim8.factory.object;

/**
 * The Object namespace.
 * 
 * @type {Object}
 */
anim8.object = {};

/**
 * Returns an attribute based on the given input. If the input is an object it's assumed to be an attribute and it's
 * returned immediately. If the input is a string the attribute with the given name is returned. Otherwise
 * the default attribute is returned.
 *
 * @param {object|string} attr
 */
anim8.object.attribute = function(attr) 
{
  if ( anim8.isObject( attr ) && anim8.isDefined( attr.defaultValue ) ) 
  {
    return attr;
  }
  if ( anim8.isString( attr ) && attr in anim8.dom.attribute ) 
  {
    return anim8.object.attribute[ attr ];
  }
  
  return anim8.object.attribute.default;
};

/**
 * The default attribute.
 */
anim8.object.attribute.default                 = {defaultValue: 0};
