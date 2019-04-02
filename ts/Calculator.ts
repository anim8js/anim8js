
import { Value, ComponentConverter, ComponentTest } from './Types';


export abstract class Calculator<T>
{

  public ZERO: T;
  public ONE: T;
  public INFINITY: T;

  /**
   * Instantiates a new Calculator instance.
   *
   * @constructor
   */
  public constructor()
  {
    this.ZERO = this.create();
    this.ONE = this.parse( 1.0, this.ZERO ) as T;
    this.INFINITY = this.parse( Number.POSITIVE_INFINITY, this.ZERO ) as T;
  }

  /**
   * Parses the given input for a value this calculator understands.
   *
   * @param x
   * @param defaultValue
   * @param ignoreRelative
   * @return
   */
  abstract parse (_x: any, _defaultValue: T, _ignoreRelative?: boolean): Value<T>;

  /**
   * Parses the given input for a value this calculator understands.
   *
   * @param x
   * @param defaultValue
   * @return
   */
  public parseArray (input: any[], output: Value<T>[], defaultValue: any): Value<T>[]
  {
    if (input.length !== output.length)
    {
      output.length = input.length;
    }

    const parsedDefault: T = this.parse( defaultValue, this.ZERO ) as T;

    for (let i = 0; i < input.length; i++)
    {
      output[ i ] = this.parse( input[ i ], parsedDefault );
    }

    return output;
  }

  /**
   * Copies a value and places it in out and returns out.
   *
   * @param out
   * @param copy
   * @return
   */
  abstract copy (out: T, copy: T): T;

  /**
   * Zeros out and returns it.
   *
   * @param out
   * @return
   */
  abstract zero (out: T): T;

  /**
   * Converts each component in the given value using a converter function and
   * returns the result.
   */
  abstract convert (out: T, converter: ComponentConverter): T;

  /**
   * Clones the value and returns the clone.
   *
   * @param clone
   * @return
   */
  public clone (clone: T): T
  {
    return this.copy( this.create(), clone );
  }

  /**
   * Creates an empty value equivalent to zero.
   *
   * @return
   */
  abstract create (): T;

  /**
   * Scales out by the given scalar value and returns out.
   *
   * @param out
   * @param scale
   * @return
   */
  public scale (out: T, scale: number): T
  {
    return this.adds( out, out, scale - 1 );
  }

  /**
   * Adds an amount to out and returns out.
   *
   * @param out
   * @param amount
   * @return
   */
  public add (out: T, amount: T): T
  {
    return this.adds( out, amount, 1 );
  }

  /**
   * Adds an amount scaled by a scalar value to out and returns out.
   *
   * @param out
   * @param amount
   * @param amountScale
   * @return
   */
  abstract adds (out: T, amount: T, amountScale: number): T;

  /**
   * Subtracts an amount from out and returns out.
   *
   * @param out
   * @param amount
   * @return
   */
  public sub (out: T, amount: T): T
  {
    return this.adds( out, amount, -1 );
  }

  /**
   * Multiplies out by some amount and returns out.
   *
   * @param out
   * @param scale
   * @return
   */
  abstract mul (out: T, scale: T): T;

  /**
   * Divides out by some amount and returns out.
   *
   * @param out
   * @param denominator
   * @return
   */
  abstract div (out: T, denominator: T): T;

  /**
   * Interpolates out between start & end given a delta value and returns out.
   * A delta value typically lies between 0 and 1 inclusively.
   *
   * @param out
   * @param start
   * @param end
   * @param delta
   * @return
   */
  public interpolate (out: T, start: T, end: T, delta: number)
  {
    out = this.zero( out );
    out = this.adds( out, start, 1 - delta );
    out = this.adds( out, end, delta );

    return out;
  }

  /**
   * Returns a random value between the given min and max.
   *
   * @param out
   * @param min
   * @param max
   * @return
   */
  public random (out: T, min: T, max: T): T
  {
    return this.interpolate( out, min, max, Math.random() );
  }

  /**
   * Calculates the distance between the two values.
   *
   * @param a
   * @param b
   * @return
   */
  public distance (a: T, b: T): number
  {
    return Math.sqrt( this.distanceSq( a, b ) );
  }

  /**
   * Calculates the squared distance between the two values.
   *
   * @param a
   * @param b
   * @return
   */
  abstract distanceSq (a: T, b: T): number;

  /**
   * Returns the distance the given value is from zero.
   *
   * @param a
   * @return
   */
  public length (a: T): number
  {
    return this.distance( a, this.ZERO );
  }

  /**
   * Returns the squared distance the given value is from zero.
   *
   * @param a
   * @return
   */
  public lengthSq (a: T): number
  {
    return this.distanceSq( a, this.ZERO );
  }

  /**
   * Determines whether the given value passes the
   *
   * @param a
   * @return
   */
  abstract test (a: T, tester: ComponentTest, all?: boolean): boolean;

  /**
   * Determines whether the given value is valid for this calculator.
   *
   * @param a
   * @return
   */
  abstract isValid (a: any): a is T;

  /**
   * Returns whether the given value is not a number or has a component which is
   * not a number.
   *
   * @param a
   * @return
   */
  public isNaN (a: T): boolean
  {
    return this.test( a, isNaN, false );
  }

  /**
   * Determines whether the given value is equivalent to zero given an
   * acceptable distance from zero (epsilon).
   *
   * @param a
   * @param epsilon
   * @return
   */
  public isZero (a: T, epsilon: number): boolean
  {
    return this.isEqual( a, this.ZERO, epsilon );
  }

  /**
   * Determines whether the given values are equivalent up to an acceptable
   * distance apart.
   *
   * @param a
   * @param b
   * @param epsilon
   * @return
   */
  abstract isEqual (a: T, b: T, epsilon: number): boolean;

  /**
   * Sets out to the minimum value between the two values and returns out.
   *
   * @param out
   * @param a
   * @param b
   * @return
   */
  abstract min (out: T, a: T, b: T): T;

  /**
   * Sets out to the maximum value between two values and returns out.
   *
   * @param out
   * @param a
   * @param b
   * @return
   */
  abstract max (out: T, a: T, b: T): T;

  /**
   * Performs the dot product between two values.
   *
   * @param a
   * @param b
   * @return
   */
  abstract dot (a: T, b: T): number;

  /**
   * Clamps out between the given minimum and maximum values and returns out.
   *
   * @param out
   * @param min
   * @param max
   */
  public clamp (out: T, min: number, max: number): T
  {
    const distSq = this.distanceSq( out, this.ZERO );

    if ( distSq < min * min )
    {
      return this.scale( out, min / Math.sqrt( distSq ) );
    }
    else if ( distSq > max * max )
    {
      return this.scale( out, max / Math.sqrt( distSq ) );
    }

    return out;
  }

  /**
   * Sets the length of the given value and returns the new value.
   *
   * @param out
   * @param length
   * @return
   */
  public setLength (out: T, length: number): T
  {
    const lengthSq = this.lengthSq( out );

    if ( lengthSq !== 0 )
    {
      return this.scale( out, length / Math.sqrt( lengthSq ) );
    }

    return out;
  }

}