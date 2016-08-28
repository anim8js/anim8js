
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
  case delegate.RETURN_THIS:
    return function()
    {
      var array = this.$ || this;

      for (var i = 0; i < array.length; i++)
      {
        array[i][functionName].apply( array[i], arguments );
      }

      return this;
    };

  case delegate.RETURN_RESULTS:
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

  case delegate.RETURN_FIRST:
    return function()
    {
      var array = this.$ || this;

      return array.length === 0 ? undefined : array[0][functionName].apply( array[0], arguments );
    };

  case delegate.RETURN_TRUE:
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

/**
 * this is returned at the end.
 *
 * @property RETURN_THIS
 * @for delegate
 */
delegate.RETURN_THIS = 'this';

/**
 * An array of results for each method call is returned.
 *
 * @property RETURN_RESULTS
 * @for delegate
 */
delegate.RETURN_RESULTS = 'results';

/**
 * The result of the first element.
 *
 * @property RETURN_FIRST
 * @for delegate
 */
delegate.RETURN_FIRST = 'first';

/**
 * True if any of the methods return true, otherwise false.
 *
 * @property RETURN_TRUE
 * @for delegate
 */
delegate.RETURN_TRUE = 'true';
