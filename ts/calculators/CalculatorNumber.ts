
import { isFunction, isNumber, isArray, isString, isRelative } from '../Functions';
import { Calculator } from '../Calculator';
import { Value, ComponentTest, ComponentConverter, Vec2 } from '../Types';
import { computed } from '../computed';
import { $number } from '../parse';


/**
 * A calculator for number primitives.
 */
export class CalculatorNumber extends Calculator<number>
{

  public parse (x: any, defaultValue: number, ignoreRelative = false): Value<number>
  {
    // Values computed live.
    if ( isFunction( x ) )
    {
      return x;
    }

    // Value computed from current value on animator.
    if ( x === true )
    {
      return computed.current;
    }

    // An array
    if ( isArray( x ) )
    {
      x = x[ 0 ];
    }

    // A raw number
    if ( isNumber( x ) )
    {
      return x;
    }

    // A number in a string or a relative number.
    if ( isString( x ) )
    {
      var amount = $number( x, false );

      if ( amount !== false )
      {
        if ( !ignoreRelative && isRelative( x ) )
        {
          return computed.relative( amount );
        }
        else
        {
          return amount;
        }
      }
    }

    return $number( defaultValue, Defaults.calculatorNumber );
  }

  public copy (_out: number, copy: number): number
  {
    return copy;
  }

  public create (): number
  {
    return 0.0;
  }

  public zero (_out: number): number
  {
    return 0.0;
  }

  public convert (out: number, converter: ComponentConverter): number
  {
    return converter( out );
  }

  public adds (out: number, amount: number, amountScale: number): number
  {
    return out += amount * amountScale;
  }

  public mul (out: number, scale: number): number
  {
    return out *= scale;
  }

  public div (out: number, denominator: number): number
  {
    return denominator ? out / denominator : 0;
  }

  public interpolate (_out: number, start: number, end: number, delta: number)
  {
    return (end - start) * delta + start;
  }

  public distanceSq (a: number, b: number): number
  {
    var ab = a - b;
    return ab * ab;
  }

  public distance (a: number, b: number): number
  {
    return Math.abs(a - b);
  }

  public length (a: number): number
  {
    return Math.abs(a);
  }

  public lengthSq (a: number): number
  {
    return a * a;
  }

  public isValid (a: any): a is number
  {
    return typeof a === 'number';
  }

  public test (a: number, tester: ComponentTest, _all: boolean = false): boolean
  {
    return tester(a);
  }

  public isEqual (a: number, b: number, epsilon: number = Defaults.EPSILON): boolean
  {
    return Math.abs(a - b) < epsilon;
  }

  public min (_out: number, a: number, b: number): number
  {
    return Math.min( a, b );
  }

  public max (_out: number, a: number, b: number): number
  {
    return Math.max( a, b );
  }

  public dot (a: number, b: number): number
  {
    return a * b;
  }

}
