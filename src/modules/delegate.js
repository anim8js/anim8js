
/**
 * Creates a function which calls a method on all elements in the array or on
 * the first element.
 *
 * @method delegate
 * @param {String} functionName
 * @param {String} returning
 */
function delegate(functionName, returning)
{
  switch (returning)
  {
  case DelegateTypes.THIS:
    return function()
    {
      var array = this.$ || this;

      for (var i = 0; i < array.length; i++)
      {
        array[i][functionName].apply( array[i], arguments );
      }

      return this;
    };

  case DelegateTypes.RESULTS:
    return function()
    {
      var array = this.$ || this;
      var results = [];

      for (var i = 0; i < array.length; i++)
      {
        results.push( array[i][functionName].apply( array[i], arguments ) );
      }

      return results;
    };

  case DelegateTypes.FIRST:
    return function()
    {
      var array = this.$ || this;

      return array.length === 0 ? undefined : array[0][functionName].apply( array[0], arguments );
    };

  case DelegateTypes.TRUE:
    return function()
    {
      var array = this.$ || this;

      for (var i = 0; i < array.length; i++)
      {
        if ( array[i][functionName].apply( array[i], arguments ) )
        {
          return true;
        }
      }

      return false;
    };

  }

  return noop;
}
