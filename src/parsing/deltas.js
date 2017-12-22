

/**
 * Parses an array of delta values and normalizes them between the range of
 * 0 and 1. Optionally the array can be cloned.
 *
 * @method anim8.deltas
 * @param {Number[]} deltas
 * @param {Boolean} clone
 */
function $deltas(deltas, clone)
{
  var max = deltas[ 0 ];

  for (var i = 1; i < deltas.length; i++)
  {
    max = Math.max( max, deltas[ i ] );
  }

  var target = clone ? [] : deltas;
  var invertMax = 1.0 / max;

  for (var i = 0; i < deltas.length; i++)
  {
    target[ i ] = deltas[ i ] * invertMax;
  }

  return target;
}
