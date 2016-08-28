
/**
 * Parses a path given the input and returns an instance of anim8.Path or throws
 * an error if the path could not be parsed. If the input is an object and has
 * a type property with a value that maps to a path type the path's parsing
 * function is invoked with the object.
 *
 * @method anim8.path
 * @for Core
 * @param  {anim8.Path|String|Object} pathInput
 * @return {anim8.Path}
 * @throws {String} If the input is not a valid path.
 */
function $path(pathInput)
{
  if ( pathInput instanceof Path )
  {
    return pathInput;
  }
  if ( isString( pathInput ) && pathInput in Paths )
  {
    return Paths[ pathInput ];
  }
  if ( isObject( pathInput ) && pathInput.type in Paths )
  {
    return Paths[ pathInput.type ]( pathInput );
  }

  throw pathInput + ' is not a valid path';
}
