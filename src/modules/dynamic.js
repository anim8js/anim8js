
/**
 * Creates a composite dyanmic attribute which is an object of existing
 * attributes which takes advantage of an object based calculator.
 *
 * **Example:**
 *
 *     anim8.object.attribute.topLeft = {
 *       dynamic: anim8.composite({x:'left', y:'top'}),
 *       calculator:'2d',
 *       defaultValue: {x: 0, y: 0},
 *       defaultUnit: 'px'
 *     };
 *
 * Which results in the values in 'topLeft' being placed in left and top.
 *
 * @method anim8.composite
 * @param  {Object} map
 * @for Core
 * @return {Function}
 */
function composite( map )
{
  return function( value, frame )
  {
    for ( var prop in map )
    {
      frame[ map[ prop ] ] = value[ prop ];
    }
  };
}

/**
 * Creates a partial dynamic attribute which is a value that's placed in a
 * sub-property of an attribute.
 *
 * **Example:**
 *
 *     anim8.object.attribute.x = {
 *       dynamic: anim8.partial( 'position', 'x' ),
 *       calculator: 'number',
 *       defaultValue: 0,
 *       defaultUnit: 'px'
 *     };
 *
 * Which results in the values in 'x' being placed in position.x
 *
 * @method anim8.partial
 * @param {String} attribute
 * @param {String} subattribute
 * @for Core
 * @return {Function}
 */
function partial( attribute, subattribute )
{
  return function( value, frame )
  {
    if ( !isObject( frame[ attribute ] ) )
    {
      frame[ attribute ] = {};
    }

    frame[ attribute ][ subattribute ] = value;
  };
}

/**
 * Creates a dynamic attribute which spreads its value over several attributes.
 *
 * **Example:**
 *
 *     anim8.dom.attribute.padding = {
 *       dynamic: anim8.spread( ['paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom' ] ),
 *       calculator: 'number',
 *       defaultValue: 0,
 *       defaultUnit: 'px'
 *     };
 *
 * Which results in the value in 'padding' being placed in paddingLeft, paddingTop,
 * paddingRight, and paddingBottom.
 *
 * @param  {Array} attributes
 * @return {Function}
 */
function spread( attributes )
{
  return function( value, frame )
  {
    for ( var i = 0; i < attributes.length; i++ )
    {
      frame[ attributes[ i ] ] = value;
    }
  };
}
