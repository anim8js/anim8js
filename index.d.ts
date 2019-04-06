import { Animator } from "anim8js";

declare module "anim8js"
{
  // S = Subject
  // A = Attributes with strict type
  // I = Attributes with input types
  // T = Any
  // V = A "primitive" data type (2d, 3d, color, number, quaternion, string)

  export type Input<A> = { [P in keyof A]: any };

  export type AttributesInput<A> = keyof A | (keyof A)[] | { [P in keyof A]: any };

  export type AttributesValues<A> = Partial<A>;

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

  export class AttrimatorMap<A, I extends Input<A>> extends FastMap<Attrimator<A, I, keyof A>>
  {
    public setGroup (groupId: number, force?: boolean, deep?: boolean): void;
    public delay (time: number): this;
    public queue<K extends keyof A> (attrimator: Attrimator<A, I, K>): Attrimator<A, I, K> | undefined;
    public queueMap (map: AttrimatorMap<A, I>, offset: number, onNewAttribute?: <K extends keyof A>(attrimator: Attrimator<A, I, K>) => void, context?: object): this;
    public insertMap (map: AttrimatorMap<A, I>, onNewAttribute?: <K extends keyof A>(attrimator: Attrimator<A, I, K>) => any, context?: object): this;
    public unqueueAt (index: number): this;
    public playMapAt (attrimatorMap: AttrimatorMap<A, I>, all: boolean, time: number): this;
    public playAttrimatorAt (attrimator: Attrimator<A, I, keyof A>, time: number): void;
    public transitionMap (transition: Transition, attrimatorMap: AttrimatorMap<A, I>, getValue: <K extends keyof A>(attr: K) => A[K], getAttribute: <K extends keyof A>(attr: K) => Attribute<A, I, K> | undefined, placeAttrimator: <K extends keyof A>(attrimator: Attrimator<A, I, K>) => Attrimator<A, I, K> | undefined, getValueAt: <K extends keyof A>(attrimator: Attrimator<A, I, K>, relativeTime: number, out: AttributesValues<A>) => A[K], stopAttrimator: <K extends keyof A>(attrimator: Attrimator<A, I, K>, relativeTime: number) => void, context: object): this;
    public finishNotPresent (attrimatorMap: AttrimatorMap<A, I>, delay?: number): this;
    public stopNotPresentAt (attrimatorMap: AttrimatorMap<A, I>, time: number): this;
    public clone (): AttrimatorMap<A, I>;
    public timeRemaining (returnInfinity?: boolean): number;
    public applyCycle (nextCycle: number): number;
    public iterate (callback: <K extends keyof A>(attrimator: Attrimator<A, I, K>, depth: number, previous?: Attrimator<A, I, K>) => void): this;
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

  export interface Computed<V> 
  {
    (attrimator: Attrimator<any, any, any>, animator: Animator<any, any, any>): (V | Dynamic<V>);
    computed: true;
  }

  export type Value<V> = 
    V | 
    Dynamic<V> | 
    Computed<V>;

  export class Calculator<V, I>
  {
    public readonly ZERO: V;
    public readonly ONE: V;
    public readonly INFINITY: V;

    public createConstants (): void;
    public parse (input: I, defaultValue?: V, ignoreRelative?: boolean): Value<V>;
    public parseArray (input: I[], output: Value<V>[], defaultValue?: I): Value<V>;
    public copy (out: V, copy: V): V;
    public zero (out: V): V;
    public clone (clone: V): V;
    public create (): V;
    public scale (out: V, scale: number): V;
    public add (out: V, amount: V): V;
    public adds (out: V, amount: V, amountScale: number): V;
    public sub (out: V, amount: V): V;
    public mul (out: V, scale: V): V;
    public div (out: V, denominator: V): V;
    public interpolate (out: V, start: V, end: V, delta: number): V;
    public random (out: V, min: V, max: V): V;
    public distance (a: V, b: V): number;
    public distanceSq (a: V, b: V): number;
    public length (a: V): number;
    public lengthSq (a: V): number;
    public isValid (a: any): a is V;
    public isNaN (a: V): boolean;
    public isZero (a: V, epsilon: number): boolean;
    public isEqual (a: V, b: V, epsilon: number): boolean;
    public min (out: V, a: V, b: V): V;
    public max (out: V, a: V, b: V): V;
    public dot (a: V, b: V): number;
    public clamp (out: V, min: number, max: number): V;
    public setLength (out: V, length: number): V;
  }

  export type CalculatorInput<V, I> = keyof CalculatorMap | Calculator<V, I>;

  export interface CalculatorMap
  {
    'number':     Calculator<ValueNumber, InputNumber>;
    '2d':         Calculator<Value2d, Input2d>;
    '3d':         Calculator<Value3d, Input3d>;
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


  export class Animator<S, A, I extends Input<A>> extends EventSource implements Animatable<S, A, I>
  {
    public subject: S;
    public attrimators: AttrimatorMap<A, I>;
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
    public newCycle<K extends keyof A> (attrimators: AttrimatorMap<A, I> | Attrimator<A, I, K>): this;
    public applyCurrentCycle (): this;
    public endCurrentCycle (): this;
    public getAttribute<K extends keyof A> (attr: K): Attribute<A, I, K> | undefined;
    public restore (): this;
    public applyInitialState (): this;
    public preupdate (now: number): this;
    public setDefault (attr: keyof A): void;
    public update (now: number): this;
    public placeAttrimator<K extends keyof A> (attrimator: Attrimator<A, I, K>): Attrimator<A, I, K> | undefined;
    public apply (): this;
    public trimAttrimators (): this;
    public value (attr: keyof A): any;
    public activate (): this;
    public deactivate (): this;
    public destroy (): this;
    public spring<K extends keyof A> (spring: SpringInput<A, I, K>): Spring<A, I, K>;
    public play (animation: AnimationInput<A, I>, options?: OptionsInput, all?: boolean, cache?: boolean): this;
    public playAttrimators (attrimatorMap: AttrimatorMap<A, I>, all?: boolean): this;
    public unplay (animation: AnimationInput<A, I>, transition?: TransitionInput, options?: OptionsInput, all?: boolean, cache?: boolean): this;
    public unplayAttrimators (attrimatorMap: AttrimatorMap<A, I>, transition?: Transition, all?: boolean): this;
    public queue (animation: AnimationInput<A, I>, options?: OptionsInput, cache?: boolean): this;
    public queueAttrimators (attrimatorMap: AttrimatorMap<A, I>): this;
    public insert (animation: AnimationInput<A, I>, options?: OptionsInput, cache?: boolean): this;
    public insertAttrimators (attrimatorMap: AttrimatorMap<A, I>): this;
    public transition (transition: TransitionInput, animation: AnimationInput<A, I>, options?: OptionsInput, all?: boolean, cache?: boolean): this;
    public transitionAttrimators (transition: Transition, attrimatorMap: AttrimatorMap<A, I>, all?: boolean): this;
    private transitionGetValue <K extends keyof A>(attr: K): A[K];
    private transitionGetValueAt <K extends keyof A>(attrimator: Attrimator<A, I, K>, relativeTime: number, out: AttributesValues<A>): A[K];
    private transitionStopAttrimator <K extends keyof A>(attrimator: Attrimator<A, I, K>, relativeTime: number): void;
    public tweenTo<K extends keyof A> (attr: K, target: I[K], options?: OptionsInput, cache?: boolean): this;
    public tweenManyTo (targets: { [P in keyof A]: I[P] }, options?: OptionsInput, cache?: boolean): this;
    public tweenFrom<K extends keyof A> (attr: K, starting: I[K], options?: OptionsInput, cache?: boolean): this;
    public tweenManyFrom (startings: { [P in keyof A]: I[P] }, options?: OptionsInput): this;
    public tween<K extends keyof A> (attr: K, starts: I[K], ends: I[K], options?: OptionsInput, cache?: boolean): this;
    public tweenMany (starts: { [P in keyof A]: I[P] }, ends: { [P in keyof A]: I[P] }, options?: OptionsInput, cache?: boolean): this;
    public move<K extends keyof A> (attr: K, amount: I[K], options?: OptionsInput, cache?: boolean): this;
    public moveMany (amounts: { [P in keyof A]: I[P] }, options?: OptionsInput, cache?: boolean): this;
    public ref<K extends keyof A> (attr: K): () => A[K];
    public follow<K extends keyof A> (attr: K, path: PathInput<A[K], I[K]>, options?: OptionsInput, cache?: boolean): this;
    public attrimatorsFor (): Attrimator<A, I, keyof A>[];
    public attrimatorsFor (attributes: AttributesInput<A>): Attrimator<A, I, keyof A>[];
    public attrimatorsFor (attributes: AttributesInput<A>, callback: <K extends keyof A>(attrimator: Attrimator<A, I, K>, attr: K) => void): this;
    public attrimatorsFor (attributes: undefined, callback: <K extends keyof A>(attrimator: Attrimator<A, I, K>, attr: K) => void): this;
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
    public defer (eventType: 'on' | 'once', event: string, callback?: EventCallback): Defer<Animator<S, A, I>, Animator<S, A, I>>;
    public onCycleStart (callback: EventCallback, context?: object): this;
    public onCycleEnd (callback: EventCallback, context?: object): this;
  }

  export class Animators<S, A, I extends Input<A>> implements Animatable<S, A, I>
  {
    public $: Animator<S, A, I>[];

    public constructor (input?: Animator<S, A, I>[]);
    public push (animator: Animator<S, A, I>): this;
    public length (): number;
    public at (index: number): Animator<S, A, I>;
    public each (iterator: (animator: Animator<S, A, I>, index: number) => void, context?: object): this;
    public fill (animators: Animator<S, A, I>[]): this;
    public filter (filterer: (animator: Animator<S, A, I>) => boolean): this;
    public getSubjects<T> (wrapper?: (subject: S) => T): T[];
    public first (): Animator<S, A, I>;
    public reverse (): this;
    public activate (): this;
    public sequence (delay?: number, easing?: Easing): Sequence<S, A, I>;
    public timeRemaining (): number;
    public preupdate (now: number, max?: number): this;
    public update (now: number, max?: number): this;
    public apply (max?: number): this;
    public handleFinished (animator: Animator<S, A, I>): boolean;
    public restore (): this;
    public placeAttrimator<K extends keyof A> (attrimator: Attrimator<A, I, K>): Attrimator<A, I, K> | undefined;
    public applyInitialState (): this;
    public trimAttrimators (): this;
    public deactivate (): this;
    public destroy (): this;
    public spring<K extends keyof A> (spring: SpringInput<A, I, K>): Spring<A, I, K>;
    public play (animation: AnimationInput<A, I>, options?: OptionsInput, all?: boolean, cache?: boolean): this;
    public playAttrimators (attrimatorMap: AttrimatorMap<A, I>, all?: boolean): this;
    public unplay (animation: AnimationInput<A, I>, transition?: TransitionInput, options?: OptionsInput, all?: boolean, cache?: boolean): this;
    public unplayAttrimators (attrimatorMap: AttrimatorMap<A, I>, transition?: Transition, all?: boolean): this;
    public queue (animation: AnimationInput<A, I>, options?: OptionsInput, cache?: boolean): this;
    public queueAttrimators (attrimatorMap: AttrimatorMap<A, I>): this;
    public insert (animation: AnimationInput<A, I>, options?: OptionsInput, cache?: boolean): this;
    public insertAttrimators (attrimatorMap: AttrimatorMap<A, I>): this;
    public transition (transition: TransitionInput, animation: AnimationInput<A, I>, options?: OptionsInput, all?: boolean, cache?: boolean): this;
    public transitionAttrimators (transition: Transition, attrimatorMap: AttrimatorMap<A, I>, all?: boolean): this;
    public tweenTo<K extends keyof A> (attr: K, target: I[K], options?: OptionsInput, cache?: boolean): this;
    public tweenManyTo (targets: { [P in keyof A]: I[P] }, options?: OptionsInput, cache?: boolean): this;
    public tweenFrom<K extends keyof A> (attr: K, starting: I[K], options?: OptionsInput, cache?: boolean): this;
    public tweenManyFrom (startings: { [P in keyof A]: I[P] }, options?: OptionsInput): this;
    public tween<K extends keyof A> (attr: K, starts: I[K], ends: I[K], options?: OptionsInput, cache?: boolean): this;
    public tweenMany (starts: { [P in keyof A]: I[P] }, ends: { [P in keyof A]: I[P] }, options?: OptionsInput, cache?: boolean): this;
    public move<K extends keyof A> (attr: K, amount: I[K], options?: OptionsInput, cache?: boolean): this;
    public moveMany (amounts: { [P in keyof A]: I[P] }, options?: OptionsInput, cache?: boolean): this;
    public follow<K extends keyof A> (attr: K, path: PathInput<A[K], I[K]>, options?: OptionsInput, cache?: boolean): this;
    public attrimatorsFor (): Attrimator<A, I, keyof A>[];
    public attrimatorsFor (attributes: AttributesInput<A>): Attrimator<A, I, keyof A>[];
    public attrimatorsFor (attributes: AttributesInput<A>, callback: <K extends keyof A>(attrimator: Attrimator<A, I, K>, attr: K) => void): this;
    public attrimatorsFor (attributes: undefined, callback: <K extends keyof A>(attrimator: Attrimator<A, I, K>, attr: K) => void): this;
    public stop (attributes?: AttributesInput<A>): this;
    public end (attributes?: AttributesInput<A>): this;
    public finish (attributes?: AttributesInput<A>): this;
    public nopeat (attributes?: AttributesInput<A>): this;
    public pause (attributes?: AttributesInput<A>): this;
    public resume (attributes?: AttributesInput<A>): this;
    public set (attributes: AttributesValues<A>): this;
    public unset (attributes?: AttributesInput<A>): this;
    public get (attributes: AttributesValues<A>): this;
    public hasAttrimators (): boolean;
    public invoke (func: EventCallback, context?: object, args?: any[]): this;
    public onCycleStart (callback: EventCallback, context?: object): this;
    public onCycleEnd (callback: EventCallback, context?: object): this;
  }

  export interface Animatable<S, A, I extends Input<A>>
  {
    activate (): this;
    timeRemaining (): number;
    preupdate (now: number, max?: number): this;
    update (now: number, max?: number): this;
    apply (max?: number): this;
    restore (): this;
    placeAttrimator<K extends keyof A> (attrimator: Attrimator<A, I, K>): Attrimator<A, I, K> | undefined;
    applyInitialState (): this;
    trimAttrimators (): this;
    deactivate (): this;
    destroy (): this;
    spring<K extends keyof A> (spring: SpringInput<A, I, K>): Spring<A, I, K>;
    play (animation: AnimationInput<A, I>, options?: OptionsInput, all?: boolean, cache?: boolean): this;
    playAttrimators (attrimatorMap: AttrimatorMap<A, I>, all?: boolean): this;
    unplay (animation: AnimationInput<A, I>, transition?: TransitionInput, options?: OptionsInput, all?: boolean, cache?: boolean): this;
    unplayAttrimators (attrimatorMap: AttrimatorMap<A, I>, transition?: Transition, all?: boolean): this;
    queue (animation: AnimationInput<A, I>, options?: OptionsInput, cache?: boolean): this;
    queueAttrimators (attrimatorMap: AttrimatorMap<A, I>): this;
    insert (animation: AnimationInput<A, I>, options?: OptionsInput, cache?: boolean): this;
    insertAttrimators (attrimatorMap: AttrimatorMap<A, I>): this;
    transition (transition: TransitionInput, animation: AnimationInput<A, I>, options?: OptionsInput, all?: boolean, cache?: boolean): this;
    transitionAttrimators (transition: Transition, attrimatorMap: AttrimatorMap<A, I>, all?: boolean): this;
    tweenTo<K extends keyof A> (attr: K, target: I[K], options?: OptionsInput, cache?: boolean): this;
    tweenManyTo (targets: { [P in keyof A]: I[P] }, options?: OptionsInput, cache?: boolean): this;
    tweenFrom<K extends keyof A> (attr: K, starting: I[K], options?: OptionsInput, cache?: boolean): this;
    tweenManyFrom (startings: { [P in keyof A]: I[P] }, options?: OptionsInput): this;
    tween<K extends keyof A> (attr: K, starts: I[K], ends: I[K], options?: OptionsInput, cache?: boolean): this;
    tweenMany (starts: { [P in keyof A]: I[P] }, ends: { [P in keyof A]: I[P] }, options?: OptionsInput, cache?: boolean): this;
    move<K extends keyof A> (attr: K, amount: I[K], options?: OptionsInput, cache?: boolean): this;
    moveMany (amounts: { [P in keyof A]: I[P] }, options?: OptionsInput, cache?: boolean): this;
    follow<K extends keyof A> (attr: K, path: PathInput<A[K], I[K]>, options?: OptionsInput, cache?: boolean): this;
    attrimatorsFor (): Attrimator<A, I, keyof A>[];
    attrimatorsFor (attributes: AttributesInput<A>): Attrimator<A, I, keyof A>[];
    attrimatorsFor (attributes: AttributesInput<A>, callback: <K extends keyof A>(attrimator: Attrimator<A, I, K>, attr: K) => void): this;
    attrimatorsFor (attributes: undefined, callback: <K extends keyof A>(attrimator: Attrimator<A, I, K>, attr: K) => void): this;
    stop (attributes?: AttributesInput<A>): this;
    end (attributes?: AttributesInput<A>): this;
    finish (attributes?: AttributesInput<A>): this;
    nopeat (attributes?: AttributesInput<A>): this;
    pause (attributes?: AttributesInput<A>): this;
    resume (attributes?: AttributesInput<A>): this;
    set (attributes: AttributesValues<A>): this;
    unset (attributes?: AttributesInput<A>): this;
    get (attributes: AttributesValues<A>): this;
    hasAttrimators (): boolean;
    invoke (func: EventCallback, context?: object, args?: any[]): this;
    onCycleStart (callback: EventCallback, context?: object): this;
    onCycleEnd (callback: EventCallback, context?: object): this;
  }

  export class Sequence<S, A, I>
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

  export type BuilderInput<A, I extends Input<A>> = string | Builder<A, I>;

  export class Builder<A, I extends Input<A>>
  {
    public parse (animation: AnimationDefinition<A, I>, options: Options, attrimatorMap: AttrimatorMap<A, I>, helper: BuilderHelper<A, I>): void;
    public merge (animation: AnimationDefinition<A, I>, newOptions: Options, oldOptions: Options, attrimatorMap: AttrimatorMap<A, I>, helper: BuilderHelper<A, I>): void;
    public mergeAttrimator<K extends keyof A> (e: Attrimator<A, I, K>, attr: K, helper: BuilderHelper<A, I>, factory: Factory<any, A, I>): void;
    public submerge (animation: AnimationDefinition<A, I>, newOptions: Options, oldOptions: Options, attrimatorMap: AttrimatorMap<A, I>): void;

    public static nextMergeId (): number;
  }

  export class BuilderHelper<A, I extends Input<A>>
  {
    public input: AnimationDefinition<A, I>;
    public oldOptions: Options;
    public newOptions: Options;
    public forObject: any;

    public prepareSpecifics (specifics: string): void;
    public parseEasing (attr: keyof A): EasingInput;
    public parseRepeat (attr: keyof A): number;
    public parseDelay (attr: keyof A): number;
    public parseSleep (attr: keyof A): number;
    public parseDuration (attr: keyof A): number;
    public parseOffset (attr: keyof A): number;
    public parseScale (attr: keyof A): number;
    public parseScaleBase<K extends keyof A> (attr: K): A[K];
    public parseFirst (attr: keyof A, option: keyof A, specifics: keyof A): any;
    public parseEvent<K extends keyof A> (attr: K, path: Path<A[K], I[K]>, builder: Builder<A, I>, hasInitialState: boolean, mergeId: number): Event<A, I, K>
    public parseNumber (attr: keyof A,  parseFunction: (input: any) => any, parseOptionsFunction: (options: Options) => Options, option: string, optionAdd: string, optionScale: string, specifics: string): number;
    public parseParameters (): object;
    public mergeEasing (attr: keyof A, current?: Easing): Easing;
    public mergeRepeat (attr: keyof A, current?: number): number;
    public mergeDelay (attr: keyof A, current?: number): number;
    public mergeSleep (attr: keyof A, current?: number): number;
    public mergeDuration (attr: keyof A, current?: number): number;
    public mergeOffset (attr: keyof A, current?: number): number;
    public mergeScale (attr: keyof A, current?: number): number;
    public mergeScaleBase<K extends keyof A> (attr: keyof A, current?: A[K]): A[K];
    public mergeParameters (current?: object): object;
    public mergeFirst<T> (attr: keyof A, current: T, parseOptionFunction: (value: T, current: T) => T, option: string, specifics: string): T;
    public mergeNumber (attr: keyof A, current: number, parseOptionFunction: (value: number, current: number) => number, option: string, optionAdd: string, optionScale: string, specifics: string): number;
  }

  export type FactoryInput<S, A, I extends Input<A>> = string | Factory<S, A, I>;

  export class Factory<S, A, I extends Input<A>>
  {
    public priority: number;

    public is (subject: any): subject is S;
    public animatorFor (subject: S): Animator<S, A, I>;
    public animatorsFor (subject: S, animators: Animators<S, A, I>): void;
    public destroy (animator: Animator<S, A, I>): void;
    public attribute<K extends keyof A> (attr: K): Attribute<A, I, K>  | undefined;
  }

  export class FactoryObject extends Factory<any, any, any>
  {
    public attributes: {
      [attr: string]: Attribute<any, any, any>
    };
  }

  export const Factories:
  {
    [factoryName: string]: Factory<any, any, any>
  }

  export const object:
  {
    [custom: string]: Partial<Attribute<any, any, any>>
  }

  export class Attrimator<A, I extends Input<A>, K extends keyof A>
  {
    public attribute: K;
    public builder: Builder<A, I>;
    public next: Attrimator<A, I, K> | undefined;
    public startTime: number;
    public pauseTime: number;
    public elapsed: number;
    public stopTime: number;
    public paused: boolean;
    public cycle: number;
    public delay: Delay;
    public offset: Offset;

    public reset (attribute: K, builder: Builder<A, I>, next?: Attrimator<A, I, K>): void;
    public prestart (now: number): void;
    public prestartNext (overrideNext?: boolean): void;
    public start (now: number, animator: Animator<any, A, I>): void;
    public startCycle (frame: AttributesValues<A>): boolean;
    public setTime (now: number, frame: AttributesValues<A>): boolean;
    public update (elapsed: number, frame: AttributesValues<A>): boolean;
    public getElapsed (): number;
    public stopIn (milliseconds: number): this;
    public stopAt (time: number): this;
    public nopeat (): this;
    public valueAt (time: number, out: A[K]): A[K];
    public valueAtSearch (time: number, out: A[K]): A[K] | false;
    public attrimatorAt (time: number): Attrimator<A, I, K>;
    public totalTime (): number;
    public timeRemaining (): number;
    public clone (): Attrimator<A, I, K>;
    public hasComputed (): boolean;
    public isInfinite (): boolean;
    public pause (): this;
    public resume (): this;
    public isPaused (): boolean;
    public finish (frame: AttributesValues<A>): boolean;
    public isFinished (): boolean;
    public getBuilder (): Builder<A, I>
    public queue (next: Attrimator<A, I, K>): this;
    public nextAt (next: Attrimator<A, I, K>, time: number): this;
    public parseValue (animator: Animator<any, A, I>, value: I[K], defaultValue?: A[K]): A[K];
  }

  export type SpringInput<A, I extends Input<A>, K extends keyof A> = 
    string | 
    Spring<A, I, K> | 
    SpringDefinition<A, I, K>

  export interface SpringDefinition<A, I extends Input<A>, K extends keyof A>
  {
    type: keyof SpringMap;
    attribute?: K;
    calculator?: CalculatorInput<A[K], I[K]>;
    position: I[K];
    rest: I[K];
    velocity: I[K];
    gravity: I[K];
    finishOnRest: boolean;
  }

  export class Spring<A, I extends Input<A>, K extends keyof A> extends Attrimator<A, I, K>
  {
    public calculator: Calculator<A[K], I[K]>;
    public rest: Value<A[K]>;
    public position: Value<A[K]>;
    public gravity: Value<A[K]>;
    public velocity: Value<A[K]>;
    public finishOnRest: boolean;

    public set (attribute: K, calculator: CalculatorInput<A[K], I[K]>, rest: I[K], position: I[K], velocity?: I[K], gravity?: I[K], finishOnRest?: boolean): void;
    public resolveRest (): A[K];
    public updateVelocity (dt: number): void;
    
    public static MAX_DT: number;
    public static EPSILON: number;
  }

  export interface SpringMap
  {
    'distance': <A, I extends Input<A>, K extends keyof A>(def: SpringDistanceDefinition<A, I, K>) => SpringDistance<A, I, K>;
    'linear': <A, I extends Input<A>, K extends keyof A>(def: SpringLinearDefinition<A, I, K>) => SpringLinear<A, I, K>;
  }

  export interface SpringDistanceDefinition<A, I extends Input<A>, K extends keyof A> extends SpringDefinition<A, I, K>
  {
    type: 'distance';
    distance: number;
    damping: number;
    stiffness: number;
  }

  export class SpringDistance<A, I extends Input<A>, K extends keyof A> extends Spring<A, I, K>
  {
    public distance: number;
    public damping: number;
    public stiffness: number;

    public constructor (attribute: K, calculator: Calculator<A[K], I[K]>, position: I[K], rest: I[K], distance: number, damping: number, stiffness: number, velocity?: I[K], gravity?: I[K], finishOnRest?: boolean);
  }

  export interface SpringLinearDefinition<A, I extends Input<A>, K extends keyof A> extends SpringDefinition<A, I, K>
  {
    type: 'linear';
    damping: I[K];
    stiffness: I[K];
  }

  export class SpringLinear<A, I extends Input<A>, K extends keyof A> extends Spring<A, I, K>
  {
    public damping: Value<A[K]>;
    public stiffness: Value<A[K]>;

    public constructor (attribute: K, calculator: Calculator<A[K], I[K]>, position: I[K], rest: I[K], damping: I[K], stiffness: I[K], velocity?: I[K], gravity?: I[K], finishOnRest?: boolean);
  }

  export const enum EventState 
  {
    DELAYED = 1,
    ANIMATING = 2,
    SLEEPING = 4,
    FINISHED = 8
  }

  export class Event<A, I extends Input<A>, K extends keyof A> extends Attrimator<A, I, K>
  {
    public path: Path<A[K], I[K]>;
    public duration: Duration;
    public easing: EasingInput;
    public sleep: Sleep;
    public repeat: Repeat;
    public scale: Scale;
    public scaleBase: ScaleBase<A[K]>;
    public hasInitialState: boolean;
    public input: AnimationDefinition<A, I> | undefined;
    public mergeId: number | undefined;
    public state: EventState;

    public constructor (attribute: K, path: Path<A[K], I[K]>, duration: Duration, easing: EasingInput, delay: Delay, sleep: Sleep, offset: Offset, repeat: Repeat, scale: Scale, scaleBase: ScaleBase<A[K]>, parameters: object, hasInitialState: boolean, builder: Builder<A, I>, next?: Attrimator<A, I, K>, input?: AnimationDefinition<A, I>, mergeId?: number);
    public computeValue (baseValue: A[K], delta: number): A[K];
    public applyValue (frame: AttributesValues<A>, baseValue: A[K], delta: number): A[K];

    public static fromOptions <A, I extends Input<A>, K extends keyof A>(attr: K, path: Path<A[K], I[K]>, options?: Options): Event<A, I, K>;
  }

  export class Oncer<A, I extends Input<A>, K extends keyof A> extends Attrimator<A, I, K>
  {
    public value: Value<A[K]>;
    public delay: number;
    public applied: boolean;
    public input: AnimationInput<A, I>;

    public constructor (attribute: K, value: I[K], delay: Delay, hasInitialState: boolean, builder: Builder<A, I>, next?: Attrimator<A, I, K>, input?: AnimationInput<A, I>);
    public getValue (): A[K];
  }

  export class Physics<A, I extends Input<A>, K extends keyof A> extends Attrimator<A, I, K>
  {
    public value: Value<A[K]>;
    public delay: number;
    public applied: boolean;
    public input: AnimationInput<A, I>;

    public constructor (attribute: K, value: I[K], delay: Delay, hasInitialState: boolean, builder: Builder<A, I>, next?: Attrimator<A, I, K>, input?: AnimationInput<A, I>);
    public getValue (): A[K];
  }

  export type AnimationInput<A, I extends Input<A>> = string | Animation<A, I> | AnimationDefinition<A, I>;

  export interface AnimationDefinition<A, I extends Input<A>>
  {
    factory?: FactoryInput<any, A, I>;
    initial?: BuilderInitialInputs<A, I>;
    values?: BuilderDeltasValuesInputs<A, I>;
    deltas?: BuilderDeltasDeltasInputs<A, I>;
    point?: BuilderPointInput<A, I>;
    keyframe?: BuilderKeyframeInputs<A, I>;
    move?: BuilderMoveInputs<A, I>;
    path?: BuilderPathInputs<A, I>;
    physics?: BuilderPhysicsInput<A, I>;
    springs?: BuilderSpringsInputs<A, I>;
    travel?: BuilderTravelInputs<A, I>;
    tweenFrom?: BuildeTweenFromInputs<A, I>;
    tweenTo?: BuildeTweenToInputs<A, I>,
    final?: BuilderFinalInputs<A, I>;
    and?: AnimationDefinition<A, I>;
    queue?: AnimationDefinition<A, I>;
    easings?: AnimationOptions<A, EasingInput>;
    repeats?: AnimationOptions<A, Repeat>;
    delays?: AnimationOptions<A, Delay>;
    sleeps?: AnimationOptions<A, Sleep>;
    durations?: AnimationOptions<A, Duration>;
    offsets?: AnimationOptions<A, Offset>;
    scales?: AnimationOptions<A, number>;
    scaleBases?: { [P in keyof A]?: I[P] };
    parameters?: AnimationOptions<A, object>;
  }

  export type AnimationOptions<A, T> = T | { [P in keyof A]?: T };

  export type BuilderDeltasValuesInputs<A, I extends Input<A>> =
    { [P in keyof A]: I[P][]; }

  export type BuilderDeltasDeltasInputs<A, I extends Input<A>> =
    { [P in keyof A]: number[]; } | number[];

  export type BuilderFinalInputs<A, I extends Input<A>> =
    { [P in keyof A]: I[P]; };
  
  export type BuilderInitialInputs<A, I extends Input<A>> =
    { [P in keyof A]: I[P]; };

  export type BuilderKeyframeInputs<A, I extends Input<A>> =
    { [frame: string]: { [P in keyof A]: I[P]; } };

  export type BuilderMoveInputs<A, I extends Input<A>> =
    { [P in keyof A]: I[P]; };

  export type BuilderPathInputs<A, I extends Input<A>> =
    { [P in keyof A]: PathInput<A[P], I[P]>; };

  export type BuilderPhysicsInput<A, I extends Input<A>> =
  { 
    [P in keyof A]: {
      calculator?: CalculatorInput<A[P], I[P]>;
      position?: I[P];
      velocity?: I[P];
      acceleration?: I[P];
      terminal?: number;
      stopAt?: number | string;
    }
  };

  export type BuilderPointInput<A, I extends Input<A>> =
    { [P in keyof A]: I[P]; };

  export type BuilderSpringsInputs<A, I extends Input<A>> =
    { [P in keyof A]: SpringInput<A, I, P>; };

  export type BuilderTravelInputs<A, I extends Input<A>> =
  { 
    [P in keyof A]: {
      from?: I[P];
      to?: I[P];
      velocity?: number;
      acceleration?: number;
      terminal?: number;
      epsilon?: number;
    }
  };

  export type BuildeTweenFromInputs<A, I extends Input<A>> =
    { [P in keyof A]: I[P]; };

  export type BuildeTweenToInputs<A, I extends Input<A>> =
    { [P in keyof A]: I[P]; };


  export class Animation<A, I extends Input<A>>
  {
    public name: string | undefined;
    public input: AnimationDefinition<A, I>;
    public options: Options | undefined;
    public attrimators: AttrimatorMap<A, I>;

    public newAttrimators (): AttrimatorMap<A, I>;
    public merge (options: Options | undefined, attrimatorMap: AttrimatorMap<A, I>): void;
  }

  export const Animations: 
  {
    [animationName: string]: Animation<any, any>
  }

  export type OptionsInput = string | string[] | Options;

  export interface Options
  {
    repeat?: Repeat;
    repeatAdd?: Repeat;
    repeatScale?: Repeat;
    sleep?: Sleep;
    sleepAdd?: Sleep;
    sleepScale?: Sleep;
    delay?: Delay;
    delayAdd?: Delay;
    delayScale?: Delay;
    scale?: Scale;
    scaleAdd?: Scale;
    scaleScale?: Scale;
    offset?: Offset;
    offsetAdd?: Offset;
    offsetScale?: Offset;
    duration?: Duration;
    durationAdd?: Duration;
    durationScale?: Duration;
    easing?: EasingInput;
    parameters?: object;
  }

  // export const Options: { [name: string]: Options }

  export type TransitionInput = string | string[] | Transition;

  export interface Transition
  {
    time: number;
    outro: number;
    intro: number;
    easing: Easing;
    granularity: number;
    lookup: number;
  }

  export const Transitions: {
    [name: string]: Transition
  };

  export type PathInput<V, I> = keyof PathMap | Path<V, I> | PathDefinition;

  export interface PathDefinition
  {
    type: keyof PathMap;
    name?: string;
  }

  export class Path<V, I>
  {
    public name: string | undefined;
    public points: Value<V>[];
    public calculator: Calculator<V, I>;
    public computed: boolean;
    public deterministic: boolean;

    public reset (calculator: Calculator<V, I>, points: Value<V>[]): void;
    public compute (out: V, delta: number): V;
    public hasComputed (): boolean;
    public isDeterministic (): boolean;
    public examinePoints<T> (examiner: (point: V) => boolean, returnOnTrue: T, returnOnFalse: T): T;
    public replaceComputed<A, I extends Input<A>> (attrimator: Attrimator<A, I, keyof A>, animator: Animator<any, A, I>): (V | Dynamic<V>)[]
    public resolvePoint (i: number, dt: number): V;
    public isLinear (): boolean;
    public length (granularity: number): number;
  }

  export interface PathMap
  {
    'point': <V, I>(def: PathPointDefinition<V, I>) => PathPoint<V, I>;
    'combo': <V, I>(def: PathComboDefinition<V, I>) => PathCombo<V, I>;
    'compiled': <V, I>(def: PathCompiledDefinition<V, I>) => PathCompiled<V, I>;
    'cubic': <V, I>(def: PathCubicDefinition<V, I>) => PathCubic<V, I>;
    'delta': <V, I>(def: PathDeltaDefinition<V, I>) => PathDelta<V, I>;
    'series': <V, I>(def: PathSeriesDefinition<V, I>) => PathSeries<V, I>;
    'jump': <V, I>(def: PathJumpDefinition<V, I>) => PathJump<V, I>;
    'keyframe': <V, I>(def: PathKeyframeDefinition<V, I>) => PathKeyframe<V, I>;
    'quadratic': <V, I>(def: PathQuadraticDefinition<V, I>) => PathQuadratic<V, I>;
    'tween': <V, I>(def: PathTweenDefinition<V, I>) => Tween<V, I>;
    'sub': <V, I>(def: PathSubDefinition<V, I>) => PathSub<V, I>;
    'quadratic-corner': <V, I>(def: PathQuadraticCornerDefinition<V, I>) => PathQuadraticCorner<V, I>;
    'linear': <V, I>(def: PathLinearDefinition<V, I>) => PathLinear<V, I>;
    'uniform': <V, I>(def: PathUniformDefinition<V, I>) => PathUniform<V, I>;
    'hermite': <V, I>(def: PathHermiteDefinition<V, I>) => PathHermite<V, I>;
    'bezier': <V, I>(def: PathBezierDefinition<V, I>) => PathBezier<V, I>;
    'parametric': <V, I>(def: PathParametricDefinition<V, I>) => PathParametric<V, I>;
    'catmull-rom': <V, I>(def: PathCatmullRomDefinition<V, I>) => PathCatmullRom<V, I>;
    'basis-spline': <V, I>(def: PathBasisSplineDefinition<V, I>) => PathBasisSpline<V, I>;
  }

  export const Paths: PathMap;

  export interface PathPointDefinition<V, I = any> extends PathDefinition
  {
    type: 'point';
    calculator?: CalculatorInput<V, I>;
    defaultValue?: I;
    point: I;
  }

  export class PathPoint<V, I = any> extends Path<V, I>
  {
    public constructor (name: string | undefined, calculator: Calculator<V, I>, point: V);
    public set (calculator: Calculator<V, I>, point: V): void;
  }

  export interface PathComboDefinition<V, I = any> extends PathDefinition
  {
    type: 'combo';
    paths: PathInput<V, I>[];
    uniform?: boolean;
    granularity?: number;
  }

  export class PathCombo<V, I = any> extends Path<V, I>
  {
    public paths: Path<V, I>[];
    public deltas: number[];
    public uniform: boolean;
    public granularity: number;
    public linear: boolean;
    public cachedLength: number | false;

    public constructor (name: string | undefined, paths: Path<V, I>[], uniform?: boolean, granularity?: boolean);
    public set (paths: Path<V, I>[], uniform?: boolean, granularity?: boolean): void;
  }

  export interface PathCompiledDefinition<V, I = any> extends PathDefinition
  {
    type: 'compiled';
    path: PathInput<V, I>;
    n?: number;
    pointCount?: number;
  }

  export class PathCompiled<V, I = any> extends Path<V, I>
  {
    public path: Path<V, I>;
    public pointCount: number;

    public constructor (name: string | undefined, path: Path<V, I>, pointCoint: number);
    public set (path: Path<V, I>, pointCoint: number): void;

    public static compile<V, I> (calc: Calculator<V, I>, path: Path<V, I>, pointCount: number): V[];
  }

  export interface PathCubicDefinition<V, I = any> extends PathDefinition
  {
    type: 'cubic';
    calculator?: CalculatorInput<V, I>;
    defaultValue?: I;
    p0: I;
    p1: I;
    p2: I;
    p3: I;
  }

  export class PathCubic<V, I = any> extends Path<V, I>
  {
    public constructor (name: string | undefined, calculator: Calculator<V, I>, p0: Value<V>, p1: Value<V>, p2: Value<V>, p3: Value<V>);
    public set (calculator: Calculator<V, I>, p0: Value<V>, p1: Value<V>, p2: Value<V>, p3: Value<V>): void;
  }

  export interface PathDeltaDefinition<V, I = any> extends PathDefinition
  {
    type: 'delta';
    calculator?: CalculatorInput<V, I>;
    defaultValue?: I;
    deltas?: number[];
    points: I[];
  }

  export class PathDelta<V, I = any> extends Path<V, I>
  {
    public deltas: number[];

    public constructor (name: string | undefined, calculator: Calculator<V, I>, points: Value<V>, deltas: number[]);
    public set (calculator: Calculator<V, I>, points: Value<V>, deltas: number[]): void;
  }

  export interface PathSeriesDefinition<V, I = any> extends PathDefinition
  {
    type: 'series',
    calculator?: CalculatorInput<V, I>;
    defaultValue?: I;
    series?: number[];
    points: I[]
  }

  export class PathSeries<V, I = any> extends Path<V, I>
  {
    public series: number[];

    public constructor (name: string | undefined, calculator: Calculator<V, I>, points: Value<V>, series: number[]);
    public set (calculator: Calculator<V, I>, points: Value<V>, series: number[]): void;
    public between (i: number, delta: number): boolean;
  }
  
  export interface PathJumpDefinition<V, I = any> extends PathDefinition
  {
    type: 'jump',
    calculator?: CalculatorInput<V, I>;
    defaultValue?: I;
    points: I[]
  }

  export class PathJump<V, I = any> extends Path<V, I>
  {
    public constructor (name: string | undefined, calculator: Calculator<V, I>, points: Value<V>);
    public set (calculator: Calculator<V, I>, points: Value<V>): void;
  }

  export interface PathKeyframeDefinition<V, I = any> extends PathDefinition
  {
    type: 'keyframe',
    calculator?: CalculatorInput<V, I>;
    defaultValue?: I;
    deltas?: number[];
    easings?: EasingInput | EasingInput[];
    points: I[]
  }

  export class PathKeyframe<V, I = any> extends Path<V, I>
  {
    public deltas: number[];
    public easings: Easing[];

    public constructor (name: string | undefined, calculator: Calculator<V, I>, points: Value<V>, deltas: number[], easings: Easing[]);
    public set (calculator: Calculator<V, I>, points: Value<V>, deltas: number[], easings: Easing[]): void;
  }

  export interface PathQuadraticDefinition<V, I = any> extends PathDefinition
  {
    type: 'quadratic';
    calculator?: CalculatorInput<V, I>;
    defaultValue?: I;
    p0: I;
    p1: I;
    p2: I;
  }

  export class PathQuadratic<V, I = any> extends Path<V, I>
  {
    public constructor (name: string | undefined, calculator: Calculator<V, I>, p0: Value<V>, p1: Value<V>, p2: Value<V>);
    public set (calculator: Calculator<V, I>, p0: Value<V>, p1: Value<V>, p2: Value<V>): void;
  }

  export interface PathTweenDefinition<V, I = any> extends PathDefinition
  {
    type: 'tween';
    calculator?: CalculatorInput<V, I>;
    defaultValue?: I;
    start: I;
    end: I;
  }

  export class Tween<V, I = any> extends Path<V, I>
  {
    public constructor (name: string | undefined, calculator: Calculator<V, I>, start: Value<V>, end: Value<V>);
    public set (calculator: Calculator<V, I>, start: Value<V>, end: Value<V>): void;
  }

  export interface PathSubDefinition<V, I = any> extends PathDefinition
  {
    type: 'sub';
    path: PathInput<V, I>;
    start?: number;
    end?: number;
  }

  export class PathSub<V, I = any> extends Path<V, I>
  {
    public start: number;
    public end: number;
    public path: Path<V, I>;

    public constructor (name: string | undefined, path: Path<V, I>, start: number, end: number);
    public set (path: Path<V, I>, start: number, end: number): void;
  }

  export interface PathQuadraticCornerDefinition<V, I = any> extends PathDefinition
  {
    type: 'quadratic-corner';
    calculator?: CalculatorInput<V, I>;
    defaultValue?: I;
    points: I[];
    midpoint: number;
    loop?: boolean;
  }

  export class PathQuadraticCorner<V, I = any> extends Path<V, I>
  {
    public midpoint: number;
    public loop: boolean;

    public constructor (name: string | undefined, calculator: Calculator<V, I>, points: Value<V>[], midpoint: number, loop: boolean);
    public set (calculator: Calculator<V, I>, points: Value<V>[], midpoint: number, loop: boolean): void;
  }

  export interface PathLinearDefinition<V, I = any> extends PathDefinition
  {
    type: 'linear';
    calculator?: CalculatorInput<V, I>;
    defaultValue?: I;
    points: I[];
  }

  export class PathLinear<V, I = any> extends PathDelta<V, I>
  {
    public constructor (name: string | undefined, calculator: Calculator<V, I>, points: Value<V>[]);
    public setLinear (calculator: Calculator<V, I>, points: Value<V>[]): void;

    public static getTimes<V, I> (calc: Calculator<V, I>, points: V[]): number[];
  }

  export interface PathUniformDefinition<V, I = any> extends PathDefinition
  {
    type: 'uniform';
    path: PathInput<V, I>;
    n?: number;
    pointCount?: number;
  }

  export class PathUniform<V, I = any> extends PathDelta<V, I>
  {
    public path: Path<V, I>;
    public pointCount: number;

    public constructor (name: string | undefined, path: Path<V, I>, pointCount: number);
    public setUniform (path: Path<V, I>, pointCount: number): void;
  }

  export interface PathHermiteDefinition<V, I = any> extends PathDefinition
  {
    type: 'hermite';
    calculator?: CalculatorInput<V, I>;
    defaultValue?: I;
    start: I;
    startTangent: I;
    end: I;
    endTangent: I;
  }

  export class PathHermite<V, I = any> extends Path<V, I>
  {
    public startTangent: Value<V>;
    public endTangent: Value<V>;

    public constructor (name: string | undefined, calculator: Calculator<V, I>, start: Value<V>, startTangent: Value<V>, end: Value<V>, endTangent: Value<V>);
    public set (calculator: Calculator<V, I>, start: Value<V>, startTangent: Value<V>, end: Value<V>, endTangent: Value<V>): void;
  }

  export interface PathBezierDefinition<V, I = any> extends PathDefinition
  {
    type: 'bezier';
    calculator?: CalculatorInput<V, I>;
    defaultValue?: I;
    points: I[];
    weights?: number[]
  }

  export class PathBezier<V, I = any> extends Path<V, I>
  {
    public weights: number[];
    public inverses: number[];

    public constructor (name: string | undefined, calculator: Calculator<V, I>, points: Value<V>[], weights?: number[]);
    public set (calculator: Calculator<V, I>, points: Value<V>[], weights?: number[]): void;

    public static computeWeights (n: number): number[];
  }

  export type Matrix = [
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number]
  ];

  export interface PathParametricDefinition<V, I = any> extends PathDefinition
  {
    type: 'parametric';
    calculator?: CalculatorInput<V, I>;
    defaultValue?: I;
    points: I[];
    loop?: boolean;
    matrix: Matrix;
    weight: number;
    invert?: boolean;
  }

  export class PathParametric<V, I = any> extends Path<V, I>
  {
    public loop: boolean;
    public matrix: Matrix;
    public weight: number;
    public invert: boolean;
    
    public constructor (name: string | undefined, calculator: Calculator<V, I>, points: Value<V>[], loop: boolean, matrix: Matrix, weight: number, invert: boolean);
    public set (calculator: Calculator<V, I>, points: Value<V>[], loop: boolean, matrix: Matrix, weight: number, invert: boolean): void;
  }

  export interface PathCatmullRomDefinition<V, I = any> extends PathDefinition
  {
    type: 'catmull-rom';
    calculator?: CalculatorInput<V, I>;
    defaultValue?: I;
    points: I[];
    loop?: boolean;
  }

  export class PathCatmullRom<V, I = any> extends PathParametric<V, I>
  {
    public constructor (name: string | undefined, calculator: Calculator<V, I>, points: Value<V>[], loop: boolean);
    public setCatmullRom (calculator: Calculator<V, I>, points: Value<V>[], loop: boolean): void;

    public static WEIGHT: number;
    public static MATRIX: Matrix;
  }

  export interface PathBasisSplineDefinition<V, I = any> extends PathDefinition
  {
    type: 'basis-spline';
    calculator?: CalculatorInput<V, I>;
    defaultValue?: I;
    points: I[];
    loop?: boolean;
  }

  export class PathBasisSpline<V, I = any> extends PathParametric<V, I>
  {
    public constructor (name: string | undefined, calculator: Calculator<V, I>, points: Value<V>[], loop: boolean);
    public setCatmullRom (calculator: Calculator<V, I>, points: Value<V>[], loop: boolean): void;

    public static WEIGHT: number;
    public static MATRIX: Matrix;
  }  

  export interface DeferChain<T, P>
  {
    undefer (): P;
    defer (eventType: 'on' | 'once', event: string): Defer<T, Defer<T, P>>
  }
  
  export type Defer<T, P> = DeferChain<T, P> & T

  export function nextTimeline (): number;

  export class Movie<A, I extends Input<A>> extends EventSource
  {
    public name: string | undefined;
    public currentTime: number;
    public currentTimelines: MovieTimeline<A, I>[];
    public sequenceDelay: number;
    public sequenceEasing: Easing;
    public introduce: boolean;
    public timelines: FastMap<MovieTimeline<A, I>>;
    public autoEnd: boolean;

    public constructor(name?: string);
    public setAutoEnd (autoEnd: boolean): this;
    public sequence (delay: Delay, easing: EasingInput): this;
    public intro (subjects: any[]): this;
    public with (subjects: any[]): this;
    public add (subjects: any[]): this;
    public getTimeline (animator: Animator<any, A, I>): MovieTimeline<A, I>;
    public getTimelines (subjects: any[]): MovieTimeline<A, I>[];
    public at (time: string | number): this;
    public seek (time: string | number): this;
    public end (): this;
    public play (animation: AnimationInput<A, I>, options?: OptionsInput, all?: boolean): this;
    public queue (animation: AnimationInput<A, I>, options?: OptionsInput, all?: boolean): this;
    public transition (transition: TransitionInput, animation: AnimationInput<A, I>, options?: OptionsInput, all?: boolean): this;
    public eachCurrentTimeline (onTimeline: (timeline: MovieTimeline<A, I>, time: number) => void): this;
    public duration (): number;
  }

  export class MovieTimeline<A, I extends Input<A>>
  {
    public animator: Animator<any, A, I>;
    public attrimators: AttrimatorMap<A, I>;
    public start: number;

    public constructor (animator: Animator<any, A, I>);
    public playAttrimators (attrimatorMap: AttrimatorMap<A, I>, all: boolean, time: number, intro?: boolean): void;
    public queueAttrimators (attrimatorMap: AttrimatorMap<A, I>, all: boolean, time: number): void;
    public transitionAttrimators (attrimatorMap: AttrimatorMap<A, I>, all: boolean, time: number, transition: Transition): void;
    public preupdate (time: number): void;
    public update (time: number): void;
    public apply (): void;
  }

  export class MoviePlayer<A, I extends Input<A>> extends EventSource
  {
    public speed: number;
    public time: number;
    public currentTime: number;
    public playing: boolean;
    public movie: Movie<A, I>;
    public duration: number;
    public run: () => void;

    public reverse (): this;
    public backward (): this;
    public forward (): this;
    public start (applyNow?: boolean, avoidApplyTrigger?: boolean): this;
    public end (applyNow?: boolean, avoidApplyTrigger?: boolean): this;
    public play (): this;
    public pause (): this;
    public goto (time: number, applyNow?: boolean, avoidApplyTrigger?: boolean): this;
    public apply (applyTime?: number, avoidApplyTrigger?: boolean): this;
    public evaluatePlaying (): this;
    public runner (movie: Movie<A, I>, player: MoviePlayer<A, I>): () => void;
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

  export type EasingTypeInput = string | EasingType;

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

  export function on (events: EventsInput, callback: EventCallback, context?: object): void;
  export function once (events: EventsInput, callback: EventCallback, context?: object): void;
  export function off (events?: EventsInput, callback?: EventCallback): void;
  export function trigger (event: string, argument: any): void;

  export function isRunning (): boolean;
  export function isLive (): boolean;
  export function setLive (newLive: boolean): void;

  export const animating: Animators<any, any, any>;

  export function activitateAnimator (animator: Animator<any, any, any>): void;
  export function pushAnimator (animator: Animator<any, any, any>): void;
  export function activate (): void;
  export function requestRun (runner: () => void): void;

  export function run (): void;
  export function pause (attributes?: AttributesInput<any>): void;
  export function resume (attributes?: AttributesInput<any>): void;
  export function stop (attributes?: AttributesInput<any>): void;
  export function end (attributes?: AttributesInput<any>): void;
  export function finish (attributes?: AttributesInput<any>): void;
  export function nopeat (attributes?: AttributesInput<any>): void;

  export function noop (): void;
  export function isDefined<T> (x: T | undefined): x is T;
  export function isFunction (x: any): x is ((...args: any[]) => any);
  export function isNumber (x: any): x is number;
  export function isBoolean (x: any): x is boolean;
  export function isString (x: any): x is string;
  export function isArray<T> (x: any): x is T[];
  export function isObject (x: any): x is { [prop: string]: any };
  export function now (): number;
  export function trim (x: string): string;
  export function isEmpty (x: any): boolean;
  export function toArray (x: any, split?: string): any[];
  export function copy<T> (x: T): T;
  export function extend (out: any, ...extensions: any[]): any;
  export function coalesce<T> (a?: T, b?: T, c?: T, d?: T): T | undefined;
  export function constant<T> (variable: T): () => T;
  export function resolve<T> (variable: T | (() => T)): T;
  export function resolve<T, A extends any[]> (variable: ((...args: A) => T), args: A): T;
  export function id (): number;

  export function gcd (a: number, b: number): number;
  export function choose (n: number, m: number): number;
  export function clamp (v: number, min: number, max: number): number;
  export function clamper (min: number, max: number): (v: number) => number;
  export function toDegrees (radians: number): number;
  export function toRadians (degrees: number): number;
  export function modder (divisor: number): (v: number) => number;
  
  export function animation <A, I extends Input<A>>(animation: AnimationInput<A, I>, options?: OptionsInput, cache?: boolean): Animation<A, I> | undefined;
  export function attrimatorsFor <A, I extends Input<A>>(animation: AnimationInput<A, I>, options?: OptionsInput, cache?: boolean): AttrimatorMap<A, I> | undefined;
  export function builder<A, I extends Input<A>> (builderInput: BuilderInput<A, I>): Builder<A, I> | undefined;
  export function calculator<V, I> (calculatorInput: CalculatorInput<V, I>): Calculator<V, I>;
  export function delay (time: Delay): number;
  export function deltas (deltas: number[], clone?: boolean): number[];
  export function duration (time: Duration): number;
  export function easing<E> (easing: EasingInput, returnOnInvalid?: E): Easing | E;
  export function easingType (easingType: EasingTypeInput, optional?: boolean): EasingType | undefined;
  export function factory<S, A, I extends Input<A>> (factoryInput: Factory<S, A, I>, forObject?: Factory<S, A, I> | Sequence<S, A, I> | Animators<S, A, I> | Animator<S, A, I>): Factory<S, A, I>;
  export function factoryFor<S, A, I extends Input<A>> (subject: S, optional?: boolean): Factory<S, A, I> | false;
  export function number<E> (value: ValueNumber, returnOnInvalid?: E): number | E;
  export function offset (time: Offset): number;
  export function options (options: OptionsInput, cache?: boolean): Options;
  export function path<V, I = any> (pathInput: PathInput<V, I>): Path<V, I>;
  export function repeat<E> (repeat: Repeat, returnOnInvalid?: E): number | E;
  export function scale (scale: Scale): number;
  export function sleep (time: number): number;
  export function spring<A, I extends Input<A>, K extends keyof A> (springInput: SpringInput<A, I, K>): Spring<A, I, K>;
  export function time<E> (repeat: any, returnOnInvalid?: E): number | E;
  export function transition (transition: TransitionInput, cache?: boolean): Transition;
  
  export const Color: {
    (r?: number, g?: number, b?: number, a?: number): ValueRGBA;

    parse (input: string): ValueRGBA | false;
    format (color: Partial<ValueRGBA>): string;

    parsers: {
      parse (input: string): ValueRGBA | false;
    }[];
  };

  export function isRelative (x: any): boolean;
  export function isComputed<V> (x: any): x is Computed<V>;
  export function resolveComputed<A, I extends Input<A>, K extends keyof A> (attrimator: Attrimator<A, I, K>, animator: Animator<any, A, I>, value: I[K], parser: Calculator<A[K], I[K]> | ((attrimator: Attrimator<A, I, K>, animator: Animator<any, A, I>, value: I[K]) => I[K])): A[K];

  export const computed: {
     <V>(func: Computed<V>): Computed<V>;
     <V>(name: string, func: Computed<V>): Computed<V>;

    current: Computed<any>;

    relative<V> (relativeAmount: V, mask: V): Computed<V>;

    random<V, I> (randomSelection: I[] | {min: I, max: I} | Path<V, I>): Computed<V>;

    combined<V> (numbers: Value<number>[]): Computed<V>;
  };

  export function composite<A> (map: { [name: string]: string}): (value: AttributesValues<A>, frame: AttributesValues<A>) => void;
  export function partial<A, K extends keyof A> (attribute: K, subattribute: keyof A[K]): (value: AttributesValues<A>, frame: AttributesValues<A>) => void;
  export function spread<A> (attributes: (keyof A)[]): (value: AttributesValues<A>, frame: AttributesValues<A>) => void;

  export function param<V, I> (paramName: string, paramCalculator?: CalculatorInput<V, I>, paramDefaultValue?: I): Parameters;
  
  export interface Parameters
  {
    add<V, I> (value: I): Computed<V> & Parameters;
    sub<V, I> (value: I): Computed<V> & Parameters;
    mul<V, I> (value: I): Computed<V> & Parameters;
    scale<V, I> (scalar: number): Computed<V> & Parameters;
    adds<V, I> (value: I, scalar: number): Computed<V> & Parameters;
    neg<V, I> (): Computed<V> & Parameters;
    min<V, I> (value: I): Computed<V> & Parameters;
    max<V, I> (value: I): Computed<V> & Parameters;
    truncate<V, I> (denominator: number): Computed<V> & Parameters;
    mode<V, I> (divisor: number): Computed<V> & Parameters;
    clamp<V> (min: number, max: number): Computed<V> & Parameters;
    convert<V> (converter: (x: number) => number): Computed<V> & Parameters;
    abs<V> (): Computed<V> & Parameters;
    sqrt<V> (): Computed<V> & Parameters;
    floor<V> (): Computed<V> & Parameters;
    ceil<V> (): Computed<V> & Parameters;
    round<V> (): Computed<V> & Parameters;
    toDegrees<V> (): Computed<V> & Parameters;
    toRadians<V> (): Computed<V> & Parameters;
    cos<V> (): Computed<V> & Parameters;
    sin<V> (): Computed<V> & Parameters;
    tan<V> (): Computed<V> & Parameters;
    cosDegrees<V> (): Computed<V> & Parameters;
    sinDegrees<V> (): Computed<V> & Parameters;
    tanDegrees<V> (): Computed<V> & Parameters;
    distance<V, I> (value: I): Computed<V> & Parameters;
    property<V, I> (propertyName: string, defaultValue: I): Computed<V> & Parameters;
    vector<V, I> (calculator: Calculator<V, I>): Computed<V> & Parameters;
  }

  export const Defaults: {
    duration: number;
    easing: Easing;
    teasing: Easing;
    delay: number;
    sleep: number;
    repeat: number;
    scale: number;
    offset: number;
    transitionTime: number;
    transitionOutro: number;
    transitionIntro: number;
    transitionEasing: Easing;
    transitionGranularity: number;
    transitionLookup: number;
    cache: boolean;
    cacheOptions: boolean;
    cacheTransitions: boolean;
    noOptions: Options;
    noTransition: Transition;
    frameRate: number;
    pauseTime: number;
    comboPathUniformGranularity: number;
    calculatorNumber: ValueNumber;
    calculator2d: Value2d;
    calculator3d: Value3d;
    calculatorQuaternion: ValueQuat;
    calculatorRGB: ValueRGB;
    calculatorRGBA: ValueRGBA;
    calculatorString: ValueString;
  }

  export interface SaveOptionsInput
  {
    prefix: string;
    options: OptionsInput;
    cache: boolean;
    forObject: any;
  }

  export const SaveOptions: {
    prefix: string;
    options: Options;
    cache: boolean;
    forObject: any;
  }

  export function save<A, I extends Input<A>> (name: string, animation: AnimationInput<A, I>, options?: OptionsInput): void;

  export function saveGroup<A, I extends Input<A>> (prefixOrOptions: string | SaveOptionsInput, animations: (() => void) | { [name: string]: AnimationInput<A, I> }): void;

  export function translate<A, I extends Input<A>> (animation: AnimationInput<A, I>, mappings: { [fromAttribute: string]: string }, saveAs?: string, options?: OptionsInput, cache?: boolean): Animation<A, I>;

  


















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
