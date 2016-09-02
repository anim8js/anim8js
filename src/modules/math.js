
function gcd(a,b)
{
  if (a < 0)
  {
    a = -a;
  }
  if (b < 0)
  {
    b = -b;
  }
  if (b > a)
  {
    var temp = a;
    a = b;
    b = temp;
  }

  while (true)
  {
    if (b === 0)
    {
      return a;
    }

    a %= b;

    if (a === 0)
    {
      return b;
    }

    b %= a;
  }
}

function choose(n, m)
{
  var num = 1, den = 1, gcd;

  if ( m > (n / 2) )
  {
    m = n - m;
  }

  while ( m >= 1 )
  {
    num *= n--;
    den *= m--;
    gcd = gcd( num, den );
    num /= gcd;
    den /= gcd;
  }

  return num;
}

/**
 * Returns a value between the given minimum and maximum.
 *
 * **Examples:**
 *
 *     anim8.clamp( 5, 1, 6 );   // 5
 *     anim8.clamp( 0, 1, 6 );   // 1
 *     anim8.clamp( 7, 1, 6 );   // 6
 *
 * @method anim8.clamp
 * @param  {Number} v
 * @param  {Number} min
 * @param  {Number} max
 * @return {Number}
 */
function clamp(v, min, max)
{
  return (v < min) ? min : (v > max ? max : v);
}
