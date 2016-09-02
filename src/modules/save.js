
var Animations = {};

/**
 * Options to modify the properties of the animations being saved.
 */
var SaveOptions =
{
  prefix: '',
  options: {},
  cache: false
};

/**
 * Saves an animation under the given name. It can be played, queued, and
 * transitioned into at a later time providing the name and optionally options
 * to override with.
 *
 * **See:** {{#crossLink "Core/anim8.animation:method"}}anim8.animation{{/crossLink}},
 *          {{#crossLink "Core/anim8.options:method"}}anim8.options{{/crossLink}}
 *
 * @method anim8.save
 * @for Core
 * @param {String} name
 * @param {Animation|String|Object} animation
 * @param {String|Object} [options]
 */
function save( name, animation, options )
{
  var animation = $animation( animation, coalesce( options, SaveOptions.options ), SaveOptions.cache );
  var qualifiedName = SaveOptions.prefix + name;
  var key = qualifiedName.toLowerCase();

  animation.name = qualifiedName;

  Animations[ key ] = animation;
}

/**
 * Starts a save group with a prefix or an object containing a prefix and/or
 * default options to pass to the animations. The animations passed can be
 * an object or a function to call which contains save calls.
 *
 * @method anim8.saveGroup
 * @param {String|Object} prefixOrOptions
 * @param {Function|Object} animations
 */
function saveGroup( prefixOrOptions, animations )
{
  var previousOptions = copy( SaveOptions );

  if ( isString( prefixOrOptions ) )
  {
    SaveOptions.prefix += prefixOrOptions;
  }
  else if ( isObject( prefixOrOptions ) )
  {
    if ( isString( prefixOrOptions.prefix ) )
    {
      SaveOptions.prefix += prefixOrOptions.prefix;
    }
    if ( isDefined( prefixOrOptions.cache ) )
    {
      SaveOptions.cache = prefixOrOptions.cache;
    }
    if ( isDefined( prefixOrOptions.options ) )
    {
      var parsedOptions = $options( prefixOrOptions.options, SaveOptions.cache );

      if ( parsedOptions !== Defaults.noOptions )
      {
        extend( SaveOptions.options, parsedOptions );
      }
    }
  }

  if ( isObject( animations ) )
  {
    for (var animationName in animations)
    {
      save( animationName, animations[ animationName ] );
    }
  }
  else if ( isFunction( animations ) )
  {
    animations();
  }

  SaveOptions = previousOptions;
}
