
import { resolve, isComputed, isFunction } from './Functions';
import { $calculator } from './parsing/calculator';
import { Calculator } from './Calculator';
import { Event } from './Event`';
import { Animator } from './Animator';


/**
 * Path class computes a value given a delta value [0, 1].
 *
 * @class Path
 * @constructor
 */
export abstract class Path<T>
{

  public calculator: Calculator<T>;
  public points: T[];
  public computed: boolean;
  public deterministic: boolean;

  /**
   * Resets the path with the given name, calculator, and points.
   *
   * @method reset
   * @param calculator
   * @param points
   */
  public reset (calculator: Calculator<T>, points: T[]): void
  {
    this.calculator = $calculator( calculator );
    this.points = points;
    this.computed = this.hasComputed();
    this.deterministic = this.isDeterministic();
  }

  /**
   * Computes a value at the given delta setting and returning out.
   *
   * @param out
   * @param delta
   */
  abstract compute (out: T, delta: number): T;

  /**
   * Returns a copy of this path.
   *
   * @param out
   * @param delta
   */
  abstract copy(): Path<T>;


  public combine (with: Path<T>, uniform: boolean = false, granularity: number = 0): PathCombo<T>
  {
    return new PathCombo<T>( this.name, [this, with], uniform, granularity );
  }

  public compile (pointCount: number): PathCompiled<T>
  {
    return new PathCompiled<T>( this.name, this, pointCount );
  }

  public sub (start: number, end: number): PathSub<T>
  {
    return new PathSub<T>( this.name, this, start, end );
  }

  public uniform (pointCount: number): PathUniform<T>
  {
    return new PathUniform<T>( this.name, this, pointCount );
  }

  /**
   * Determines if this path has at least one computed value.
   *
   * **See:** {{#crossLink "anim8.computed"}}{{/crossLink}}
   *
   * @method hasComputed
   * @return {Boolean}
   */
  public hasComputed (): boolean
  {
    return this.examinePoints( isComputed, true, false );
  }

  /**
   * Determines if this path has at least one computed value.
   *
   * **See:** {{#crossLink "anim8.computed"}}{{/crossLink}}
   *
   * @method isDeterministic
   * @return {Boolean}
   */
  public isDeterministic (): boolean
  {
    return this.examinePoints( isFunction, false, true );
  }

  /**
   * Examines the points in the path by passing each point to the examiner
   * function. If the examiner function returns true then `returnOnTrue` true
   * is returned immediately, otherwise `returnOnFalse` is returned.
   *
   * @method examinePoints
   * @param examiner
   * @param returnOnTrue
   * @param returnOnFalse
   * @return
   */
  public examinePoints <R>(examiner: (item: T) => boolean, returnOnTrue: R, returnOnFalse: R): R
  {
    const ps = this.points;

    for (var i = 0; i < ps.length; i++)
    {
      if ( examiner( ps[ i ] ) )
      {
        return returnOnTrue;
      }
    }

    return returnOnFalse;
  }

  /**
   * Replaces any computed values in this path with the result from invoking
   * the function and returns a clone of this path.
   *
   * @method replaceComputed
   * @return {anim8.Path}
   */
  public replaceComputed <S>(event: Event<T>, animator: Animator<S>): Path<T>
  {
    const clone = this.copy();
    const ps = clone.points;

    for (var i = 0; i < ps.length; i++)
    {
      if ( isComputed( ps[i] ) )
      {
        ps[i] = ps[i]( event, animator );
      }
    }

    return clone;
  }

  /**
   * Resolves and returns the point at the given index.
   *
   * @method resolvePoint
   * @param {Number} i
   * @return {T}
   */
  public resolvePoint (i: number, _dt: number): T
  {
    return resolve( this.points[ i ], arguments );
  }

  /**
   * Returns whether the path is linear. Linear paths go directly from point to
   * point where curved paths do not. Linear paths can have their length
   * calculated fairly easily however curves you must compute length with a
   * given granularity.
   *
   * @method isLinear
   * @return {Boolean}
   */
  public isLinear (): boolean
  {
    return true;
  }

  /**
   * Computes the length of the Path with a given granularity. Granularity is
   * used for non-linear paths - it's the number of segments are calculated on
   * the path where the length of the segments are summed and returned as the
   * length.
   *
   * @method length
   * @param {Number} granularity
   * @return {Number}
   */
  public length (granularity: number): number
  {
    var distance = 0;
    var calc = this.calculator;

    if ( this.isLinear() )
    {
      var prev = this.resolvePoint( 0, 0 );
      var n = this.points.length - 1;

      for (var i = 1; i <= n; i++)
      {
        var next = this.resolvePoint( i, i / n );

        distance += calc.distance( prev, next );

        prev = next;
      }
    }
    else
    {
      var deltadelta = 1.0 / granularity;
      var delta = deltadelta;
      var prev = calc.clone( this.resolvePoint( 0, 0 ) );
      var temp = calc.create();

      for (var i = 1; i <= granularity; i++)
      {
        var next = this.compute( temp, delta );

        distance += calc.distance( prev, next );
        delta += deltadelta;

        temp = prev;
        prev = next;
      }
    }

    return distance;
  }

}