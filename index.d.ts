import { Animator } from "anim8js";

declare module "anim8js"
{
  // S = Subject
  // A = Attributes with strict type
  // I = Attributes with input types
  // T = Any

  export type Input<A> = { [P in keyof A]: any };

  export class FastMap<V>
  {
    public values: V[];
    public keys: string[];
    public indices: { [key: string]: number };

    public constructor (input?: FastMap<V> | { [prop: string]: V });
    public reset (): this;
    public put (key: string, value: V): this;
    public rekey (fromKey: string, toKey: string): this;
    public putMap (map: FastMap<V>): this;
    public get (key: string): V | undefined;
    public remove (key: string): this;
    public removeAt (index: number): this;
    public indexOf (key: string): number;
    public has (key: string): boolean;
    public hasOverlap (map: FastMap<V>): boolean;
    public size (): number
    public clear (): this;
  }

  export class AttrimatorMap<S, A, I extends Input<A>> extends FastMap<Attrimator<S, A, I, keyof A>>
  {
    public setGroup (groupId: number, force?: boolean, deep?: boolean): void;
    public delay (time: number): this;
    public queue<K extends keyof A> (attrimator: Attrimator<S, A, I, K>): Attrimator<S, A, I, K> | undefined;
    public queueMap (
      map: AttrimatorMap<S, A, I>, 
      offset: number,
      onNewAttribute?: <K extends keyof A>(attrimator: Attrimator<S, A, I, K>) => void, 
      context?: object): this;
    public insertMap (
      map: AttrimatorMap<S, A, I>, 
      onNewAttribute?: <K extends keyof A>(attrimator: Attrimator<S, A, I, K>) => any, 
      context?: object): this;
    public unqueueAt (index: number): this;
    public playMapAt (attrimatorMap: AttrimatorMap<S, A, I>, all: boolean, time: number): this;
    public playAttrimatorAt (attrimator: Attrimator<S, A, I, keyof A>, time: number): void;
    public transitionMap (
      transition: TransitionDefinition, 
      attrimatorMap: AttrimatorMap<S, A, I>, 
      getValue: <K extends keyof A>(attr: K) => A[K],
      getAttribute: <K extends keyof A>(attr: K) => Attribute<A, I, K> | undefined,
      placeAttrimator: <K extends keyof A>(attrimator: Attrimator<S, A, I, K>) => Attrimator<S, A, I, K> | undefined,
      getValueAt: <K extends keyof A>(attrimator: Attrimator<S, A, I, K>, relativeTime: number, out: AttributesValues<A>) => A[K],
      stopAttrimator: <K extends keyof A>(attrimator: Attrimator<S, A, I, K>, relativeTime: number) => void,
      context: object): this;
    public finishNotPresent (attrimatorMap: AttrimatorMap<S, A, I>, delay?: number): this;
    public stopNotPresentAt (attrimatorMap: AttrimatorMap<S, A, I>, time: number): this;
    public clone (): AttrimatorMap<S, A, I>;
    public timeRemaining (returnInfinity?: boolean): number;
    public applyCycle (nextCycle: number): number;
    public iterate (callback: <K extends keyof A>(attrimator: Attrimator<S, A, I, K>, depth: number, previous?: Attrimator<S, A, I, K>) => void): this;
  }

  export interface Attribute<A, I extends Input<A>, K extends keyof A>
  {
    name: K;
    calculatorName: keyof CalculatorMap;
    calculator: Calculator<A[K], I[K]>;
    defaultValue: A[K];
    parse (input: I[K], defaultValue?: A[K]): Value<A[K]>;
    cloneDefault (): A[K];
  }

  export type Dynamic<V> = 
    (() => V) |
    ((index: number, delta: number) => V);

    // TODO
  export type Computed<V> = <S, A, I extends Input<A>, K extends keyof A>
    ( attrimator: Attrimator<S, A, I, K>, animator: Animator<S, A, I> ) => (V | Dynamic<V>);

  export type Value<V> = V | Dynamic<V> | Computed<V>;

  export class Calculator<V, I = any>
  {
    public parse (x: I, defaultValue?: V, ignoreRelative?: boolean): Value<V>;
    public parseArray (input: I[], defaultValue?: V): Value<V>;
  }

  export type CalculatorInput<V, I> = keyof CalculatorMap | Calculator<V, I>;

  export interface CalculatorMap
  {
    'number':     Calculator<ValueNumber, InputNumber>;
    '2d':         Calculator<Value2d, Input2d>;
    '3d':         Calculator<Value2d, Input2d>;
    'quat':       Calculator<ValueQuat, InputQuat>;
    'quaternion': Calculator<ValueQuat, InputQuat>;
    'rgb':        Calculator<ValueRGB, InputRGB>;
    'rgba':       Calculator<ValueRGBA, InputRGBA>;
    'color':      Calculator<ValueRGBA, InputRGBA>;
    'string':     Calculator<ValueString, InputString>;
    'default':    Calculator<ValueNumber, InputNumber>;
  }

  export const Calculators: CalculatorMap;

  export type InputScalar<V> =
    number |
    string | 
    true | 
    Dynamic<V> |
    Computed<V> |
    (number | string)[];

  export type InputObject<V> =  
    InputScalar<V> |
    { [P in keyof V]?: number | string };

  export type Value2d = { x: number, y: number };

  export type Input2d = InputObject<Value2d>;

  export type Value3d = { x: number, y: number, z: number };

  export type Input3d = InputObject<Value3d>;

  export type ValueNumber = number;

  export type InputNumber = InputScalar<ValueNumber>;

  export type ValueRGB = { r: number, g: number, b: number };

  export type InputRGB = InputObject<ValueRGB>;

  export type ValueRGBA = { r: number, g: number, b: number, a: number };

  export type InputRGBA = InputObject<ValueRGBA>;

  export type ValueString = string;

  export type InputString = InputScalar<string>;

  export type ValueQuat = { x: number, y: number, z: number, angle: number };

  export type InputQuat = InputObject<ValueQuat>


  export class Animator<S, A, I extends Input<A>> extends EventSource
  {
    public subject: S;
    public attrimators: AttrimatorMap<S, A, I>;
    public attrimatorsAdded: string[];
    public frame: AttributesValues<A>;
    public updated: AttributesValues<A>;
    public finished: boolean;
    public factory: Factory<S, A, I>;
    public active: boolean;
    public cycleCurrent: number;
    public cycleNext: number;
    public cycleEnded: number;

    public constructor (subject: S);
    public reset (subject: S): this;
    public newCycle<K extends keyof A> (attrimators: AttrimatorMap<S, A, I> | Attrimator<S, A, I, K>): this;
    public applyCurrentCycle (): this;
    public endCurrentCycle (): this;
    public getAttribute<K extends keyof A> (attr: K): Attribute<A, I, K> | undefined;
    public restore (): this;
    public applyInitialState (): this;
    public preupdate (now: number): this;
    public setDefault (attr: keyof A): void;
    public update (now: number): this;
    public placeAttrimator<K extends keyof A> (attrimator: Attrimator<S, A, I, K>): Attrimator<S, A, I, K> | undefined;
    public apply (): this;
    public trimAttrimators (): this;
    public value (attr: keyof A): any;
    public activate (): this;
    public deactivate (): this;
    public destroy (): this;
    public spring<K extends keyof A> (spring: SpringInput<S, A, I, K>): Spring<S, A, I, K>;
    public play (animation: AnimationInput, options?: OptionsInput, all?: boolean, cache?: boolean): this;
    public playAttrimators (attrimatorMap: AttrimatorMap<S, A, I>, all?: boolean): this;
    public unplay (animation: AnimationInput, transition?: TransitionInput, options?: OptionsInput, all?: boolean, cache?: boolean): this;
    public unplayAttrimators (attrimatorMap: AttrimatorMap<S, A, I>, transition?: TransitionDefinition, all?: boolean): this;
    public queue (animation: AnimationInput, options?: OptionsInput, cache?: boolean): this;
    public queueAttrimators (attrimatorMap: AttrimatorMap<S, A, I>): this;
    public insert (animation: AnimationInput, options?: OptionsInput, cache?: boolean): this;
    public insertAttrimators (attrimatorMap: AttrimatorMap<S, A, I>): this;
    public transition (transition: TransitionInput, animation: AnimationInput, options?: OptionsInput, all?: boolean, cache?: boolean): this;
    public transitionAttrimators (transition: TransitionDefinition, attrimatorMap: AttrimatorMap<S, A, I>, all?: boolean): this;
    private transitionGetValue <K extends keyof A>(attr: K): A[K];
    private transitionGetValueAt <K extends keyof A>(attrimator: Attrimator<S, A, I, K>, relativeTime: number, out: AttributesValues<A>): A[K];
    private transitionStopAttrimator <K extends keyof A>(attrimator: Attrimator<S, A, I, K>, relativeTime: number): void;
    public tweenTo<K extends keyof A> (attr: K, target: I[K], options?: OptionsInput, cache?: boolean): this;
    public tweenManyTo (targets: { [P in keyof A]: I[P] }, options?: OptionsInput, cache?: boolean): this;
    public tweenFrom<K extends keyof A> (attr: K, starting: I[K], options?: OptionsInput, cache?: boolean): this;
    public tweenManyFrom (startings: { [P in keyof A]: I[P] }, options?: OptionsInput): this;
    public tween<K extends keyof A> (attr: K, starts: I[K], ends: I[K], options?: OptionsInput, cache?: boolean): this;
    public tweenMany (starts: { [P in keyof A]: I[P] }, ends: { [P in keyof A]: I[P] }, options?: OptionsInput, cache?: boolean): this;
    public move<K extends keyof A> (attr: K, amount: I[K], options?: OptionsInput, cache?: boolean): this;
    public moveMany (amounts: { [P in keyof A]: I[P] }, options?: OptionsInput, cache?: boolean): this;
    public ref<K extends keyof A> (attr: K): () => A[K];
    public follow<K extends keyof A> (attr: K, path: PathInput<A[K]>, options?: OptionsInput, cache?: boolean): this;
    public attrimatorsFor (): Attrimator<S, A, I, keyof A>[];
    public attrimatorsFor (attributes: AttributesInput<A>): Attrimator<S, A, I, keyof A>[];
    public attrimatorsFor (attributes: AttributesInput<A>, callback: <K extends keyof A>(attrimator: Attrimator<S, A, I, K>, attr: K) => void): this;
    public attrimatorsFor (attributes: undefined, callback: <K extends keyof A>(attrimator: Attrimator<S, A, I, K>, attr: K) => void): this;
    public stop (attributes?: AttributesInput<A>): this;
    public end (attributes?: AttributesInput<A>): this;
    public finish (attributes?: AttributesInput<A>): this;
    public nopeat (attributes?: AttributesInput<A>): this;
    public pause (attributes?: AttributesInput<A>): this;
    public resume (attributes?: AttributesInput<A>): this;
    public set (attributes: AttributesValues<A>): this;
    public unset (attributes?: AttributesInput<A>): this;
    public get (attributes: AttributesValues<A>): this;
    public timeRemaining (): number;
    public hasAttrimators (): boolean;
    public getSubject<T> (wrapper?: (subject: S) => T): T;
    public invoke (func: EventCallback, context?: object, args?: any[]): this;
    public defer (eventType: string, event: string, callback?: EventCallback): DeferAnimator; // TODO
    public onCycleStart (callback: EventCallback, context?: object): this; // TODO
    public onCycleEnd (callback: EventCallback, context?: object): this; // TODO
  }

  export class Animators<S, A, I extends Input<A>>
  {

  }

  export class EventSource
  {
    public on (events: EventsInput, callback: EventCallback, context?: object): this;
    public once (events: EventsInput, callback: EventCallback, context?: object): this;
    public off (events?: EventsInput, callback?: EventCallback): this;
    public trigger (event: string, argument: any): this;
  }

  export type EventCallback = (...args: any) => any;

  export type EventsInput = string | string[] | { [event: string]: any };

  export class Builder<S, A, I extends Input<A>>
  {
    public parse (animation: AnimationDefinition, options: OptionsDefinition, attrimatorMap: AttrimatorMap<S, A, I>, helper: BuilderHelper<S, A, I>): void;
    public merge (animation: AnimationDefinition, newOptions: OptionsDefinition, oldOptions: OptionsDefinition, attrimatorMap: AttrimatorMap<S, A, I>, helper: BuilderHelper<S, A, I>): void;
    public mergeAttrimator<K extends keyof A> (e: Attrimator<S, A, I, K>, attr: K, helper: BuilderHelper<S, A, I>, factory: Factory<S, A, I>): void;
    public submerge (animation: AnimationDefinition, newOptions: OptionsDefinition, oldOptions: OptionsDefinition, attrimatorMap: AttrimatorMap<S, A, I>): void;

    public static nextMergeId (): number;
  }

  export class BuilderHelper<S, A, I extends Input<A>>
  {
    public input: AnimationDefinition;
    public oldOptions: OptionsDefinition;
    public newOptions: OptionsDefinition;
    public forObject: any;

    public prepareSpecifics (specifics: string): void;
    public parseEasing (attr: keyof A): EasingInput;
    public parseRepeat (attr: keyof A): number;
    public parseDelay (attr: keyof A): number;
    public parseSleep (attr: keyof A): number;
    public parseDuration (attr: keyof A): number;
    public parseOffset (attr: keyof A): number;
    public parseScale (attr: keyof A): number;
    public parseScaleBase (attr: keyof A): number;
    public parseFirst (attr: keyof A, option: keyof A, specifics: keyof A): any;
    public parseEvent<K extends keyof A> (attr: K, path: Path<A[K]>, builder: Builder<S, A, I>, hasInitialState: boolean, mergeId: number): Event<S, A, I, K>
    public parseNumber (
      attr: keyof A, 
      parseFunction: (input: any) => any, 
      parseOptionsFunction: (options: OptionsDefinition) => OptionsDefinition,
      option: string, 
      optionAdd: string,
      optionScale: string,
      specifics: string
    ): number;
    public parseParameters (): object;
    public mergeEasing (attr: keyof A, current?: Easing): Easing;
    public mergeRepeat (attr: keyof A, current?: number): number;
  }

  export class Factory<S, A, I extends Input<A>>
  {
    public is (subject: any): subject is S;
    public animatorFor (subject: S): Animator<S, A, I>;
    public animatorsFor (subject: S, animators: Animators<S, A, I>): void;
    public destroy (animator: Animator<S, A, I>): void;
    public attribute<K extends keyof A> (attr: K): Attribute<A, I, K>  | undefined;
  }

  export class Attrimator<S, A, I extends Input<A>, K extends keyof A>
  {
    public attribute: K;
    public builder: Builder<S, A, I>;
    public next: Attrimator<S, A, I, K> | undefined;
    public startTime: number;
    public pauseTime: number;
    public elapsed: number;
    public stopTime: number;
    public paused: boolean;
    public cycle: number;
    public delay: Delay;
    public offset: Offset;

    public reset (attribute: K, builder: Builder<S, A, I>, next?: Attrimator<S, A, I, K>): void;
    public prestart (now: number): void;
    public prestartNext (overrideNext?: boolean): void;
    public start (now: number, animator: Animator<S, A, I>): void;
    public startCycle (frame: AttributesValues<A>): boolean;
    public setTime (now: number, frame: AttributesValues<A>): boolean;
    public update (elapsed: number, frame: AttributesValues<A>): boolean;
    public getElapsed (): number;
    public stopIn (milliseconds: number): this;
    public stopAt (time: number): this;
    public nopeat (): this;
    public valueAt (time: number, out: A[K]): A[K];
    public valueAtSearch (time: number, out: A[K]): A[K] | false;
    public attrimatorAt (time: number): Attrimator<S, A, I, K>;
    public totalTime (): number;
    public timeRemaining (): number;
    public clone (): Attrimator<S, A, I, K>;
    public hasComputed (): boolean;
    public isInfinite (): boolean;
    public pause (): this;
    public resume (): this;
    public isPaused (): boolean;
    public finish (frame: AttributesValues<A>): boolean;
    public isFinished (): boolean;
    public getBuilder (): Builder<S, A, I>
    public queue (next: Attrimator<S, A, I, K>): this;
    public nextAt (next: Attrimator<S, A, I, K>, time: number): this;
    public parseValue (animator: Animator<S, A, I>, value: I[K], defaultValue?: A[K]): A[K];
  }

  export type SpringInput<S, A, I extends Input<A>, K extends keyof A> = 
    string | 
    Spring<S, A, I, K> | 
    SpringDefinition;

  export interface SpringDefinition
  {

  }

  export class Spring<S, A, I extends Input<A>, K extends keyof A> extends Attrimator<S, A, I, K>
  {
    public calculator: Calculator<A[K], I[K]>;
    public rest: Value<A[K]>;
    public position: Value<A[K]>;
    public gravity: Value<A[K]>;
    public velocity: Value<A[K]>;
    public finishOnRest: boolean;

    public set (attribute: keyof A, calculator: CalculatorInput<A[K], I[K]>, rest: Value<A[K]>, position: Value<A[K]>, velocity: Value<A[K]>, gravity: Value<A[K]>, finishOnRest: boolean): void;
    public resolveRest (): A[K];
    public updateVelocity (dt: number): void;
    
    public static MAX_DT: number;
    public static EPSILON: number;
  }

  export function $spring<S, A, I extends Input<A>, K extends keyof A> (springInput: SpringInput<S, A, I, K>): Spring<S, A, I, K>;

  export class Event<S, A, I extends Input<A>, K extends keyof A> extends Attrimator<S, A, I, K>
  {
    public path: Path<A[K]>;
    public duration: Duration;
    public easing: EasingInput;
    public sleep: Sleep;
    public repeat: Repeat;
    public scale: Scale;
    public scaleBase: ScaleBase<A[K]>;
    public hasInitialState: boolean;
    public input: AnimationInput | undefined;
    public mergeId: number | undefined;

    public constructor (attribute: K, path: Path<A[K]>, duration: Duration, easing: EasingInput, delay: Delay, sleep: Sleep, offset: Offset, repeat: Repeat, scale: Scale, scaleBase: ScaleBase<A[K]>, parameters: object, hasInitialState: boolean, builder: Builder<S, A, I>, next?: Attrimator<S, A, I, K>, input?: AnimationInput, mergeId?: number);
    public computeValue (baseValue: A[K], delta: number): A[K];
    public applyValue (frame: AttributesValues<A>, baseValue: A[K], delta: number): A[K];

    public static fromOptions <S, A, I extends Input<A>, K extends keyof A>(attr: K, path: Path<A[K]>, options?: Options): Event<S, A, I, K>;
  }

  export type AnimationInput = string | Animation | AnimationDefinition;

  export interface AnimationDefinition
  {

  }

  export class Animation
  {

  }

  export type OptionsInput = string | Options | OptionsDefinition;

  export interface OptionsDefinition
  {

  }

  export class Options
  {

  }

  export type TransitionInput = string | string[] | TransitionDefinition;

  export interface TransitionDefinition
  {

  }

  export type PathInput<V> = keyof PathMap | Path<V> | PathDefinition;

  export interface PathDefinition
  {

  }

  export class Path<V>
  {
    public points: Value<V>[];
    public calculator: Calculator<V>;
    public computed: boolean;
    public deterministic: boolean;

    public reset<I> (calculator: Calculator<V, I>, points: I[]): void;
    public compute (out: V, delta: number): V;
    public hasComputed (): boolean;
    public isDeterministic (): boolean;
    public examinePoints<T> (examiner: (point: V) => boolean, returnOnTrue: T, returnOnFalse: T): T;
    public replaceComputed<S, A, I extends Input<A>> (attrimator: Attrimator<S, A, I, keyof A>, animator: Animator<S, A, I>): (V | Dynamic<V>)[]
    public resolvePoint (i: number, dt: number): V;
    public isLinear (): boolean;
    public length (granularity: number): number;
  }

  export interface PathMap
  {
    // 'point': 
    // 'combo':
  }

  export const Paths: PathMap;

  export function $path<V> (pathInput: PathInput<V>): Path<V>;


  export interface PathPointDefinition<A, I extends Input<A>, K extends keyof A>
  {
    calculator?: CalculatorInput<A[K], I[K]>;
    defaultValue?: I[K];
    name?: K
    point: I[K]
  }


  export type AttributesInput<A> = keyof A | (keyof A)[] | { [P in keyof A]: any };

  export type AttributesValues<A> = Partial<A>;

  export class DeferAnimator
  {

  }

  export type EasingInput = 
    keyof EasingMap | 
    keyof EasingTypeMap | 
    Easing | 
    [number, number, number, number];

  export type Easing = (delta: number) => number;

  export function isEasingName (name: string): boolean;

  export interface EasingMap
  {
    'linear': Easing;
    'quad': Easing;
    'ease': Easing;
    'cubic': Easing;
    'quartic': Easing;
    'quintic': Easing;
    'back': Easing;
    'sine': Easing;
    'overshot': Easing;
    'elastic': Easing;
    'revisit': Easing;
    'lasso': Easing;
    'slowbounce': Easing;
    'bounce': Easing;
    'smallbounce': Easing;
    'tinybounce': Easing;
    'hesitant': Easing;
    'sqrt': Easing;
    'sqrtf': Easing;
    'log10': Easing;
    'slingshot': Easing;
    'circular': Easing;
    'gentle': Easing;
    'scale': (scale: number, easing: Easing) => Easing;
    'bezier': (mX1: number, mY1: number, mX2: number, mY2: number) => Easing;
  }

  export const Easings: EasingMap;

  export type EasingType = (easing: Easing) => Easing;

  export interface EasingTypeMap
  {
    'in': EasingType;
    'out': EasingType;
    'inout': EasingType;
    'yoyo': EasingType;
    'mirror': EasingType;
    'reverse': EasingType;
    'flip': EasingType;
  }

  export const EasingTypes: EasingTypeMap;

  export type Duration = string | number;
  export type Delay = string | number;
  export type Sleep = string | number;
  export type Offset = string | number;
  export type Repeat = string | number;
  export type Scale = number;
  export type ScaleBase<V> = V | number;


  export function anim8<S, A, I extends Input<A>> (subject: S): Animator<S, A, I>;
  export function anim8s<S, A, I extends Input<A>> (subject: S[]): Animators<S, A, I>;
  export function m8<S, A, I extends Input<A>> (subject: S): Animator<S, A, I>;
  export function m8s<S, A, I extends Input<A>> (subject: S[]): Animators<S, A, I>;














  export interface DomAttributes
  {
    opacity: ValueNumber;
  }

  export interface DomAttributeInputs
  {
    opacity: InputNumber;
  }

  export type DomSubject = HTMLElement | Element | EventTarget;

  export type DomAnimator = Animator<DomSubject, DomAttributes, DomAttributeInputs>;


  

}
