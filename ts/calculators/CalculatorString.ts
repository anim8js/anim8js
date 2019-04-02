
import { isFunction, isNumber, isArray, isObject, isString, isRelative, coalesce } from '../Functions';
import { Calculator } from '../Calculator';
import { Value, ComponentTest, ComponentConverter, Color } from '../Types';
import { computed } from '../computed';
import { Colors, $number } from '../parse';


/**
 * A calculator for strings.
 */
export class CalculatorString extends Calculator<string>
{

  public parse (x: any, defaultValue: string, ignoreRelative = false): Value<string>
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

    // A raw string
    if ( isString( x ) )
    {
      return x;
    }

    return coalesce( defaultValue, Defaults.calculatorString );
  }

  public copy (_out: string, copy: string): string
  {
    return copy;
  }

  public create (): string
  {
    return '';
  }

  public zero (_out: string): string
  {
    return '';
  }

  public convert (out: string, _converter: ComponentConverter): string
  {
    return out;
  }

  public adds (_out: string, amount: string, _amountScale: number): string
  {
    return amount;
  }

  public mul (_out: string, scale: string): string
  {
    return scale;
  }

  public div (out: string, _denominator: string): string
  {
    return out;
  }

  public interpolate (_out: string, start: string, end: string, delta: number): string
  {
    return delta < 0.5 ? start : end;
  }

  public distanceSq (a: string, b: string): number
  {
    var d = Math.abs( a.length - b.length );
    return d * d;
  }

  public distance (a: string, b: string): number
  {
    return Math.abs( a.length - b.length );
  }

  public length (a: string): number
  {
    return a.length;
  }

  public lengthSq (a: string): number
  {
    return a.length * a.length;
  }

  public isValid (a: any): a is string
  {
    return typeof a === 'string';
  }

  public test (_a: string, _tester: ComponentTest, _all: boolean = false): boolean
  {
    return false;
  }

  public isEqual (a: string, b: string, _epsilon: number = Defaults.EPSILON)
  {
    return a === b;
  }

  public min (_out: string, a: string, b: string): string
  {
    return a < b ? a : b;
  }

  public max (_out: string, a: string, b: string): string
  {
    return a > b ? a : b;
  }

  public dot (a: string, b: string): number
  {
    return a.length * b.length;
  }

}
