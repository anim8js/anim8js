
declare module 'anim8js'
{

  // S = Subject
  // A = Attributes with strict type
  // V = A "primitive" data type (2d, 3d, color, number, quaternion, string)

  export type AttributesInput<A> = keyof A | (keyof A)[] | { [P in keyof A]?: any };

  export type AttributesValues<A> = Partial<A>;

  export type Dynamic<V> =
    (() => V) |
    ((index: number, delta: number) => V);

  export interface Computed<V>
  {
    (attrimator: Attrimator<any, any>, animator: Animator<any, any>): (V | Dynamic<V>);
    computed: true;
  }

  export type Value<V> =
    V |
    Dynamic<V> |
    Computed<V>;

  export type Value2d = { x: number, y: number };

  export type Value3d = { x: number, y: number, z: number };

  export type ValueNumber = number;

  export type ValueRGB = { r: number, g: number, b: number };

  export type ValueRGBA = { r: number, g: number, b: number, a: number };

  export type ValueString = string;

  export type ValueQuat = { x: number, y: number, z: number, angle: number };
  
  
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

  export type Input<V> = 
    V extends object ? InputObject<V> : InputScalar<V>;

  export type Inputs<A> =
    { [K in keyof A]?: Input<A[K]> };


  export class Calculator<V>
  {
    public readonly ZERO: V;
    public readonly ONE: V;
    public readonly INFINITY: V;

    public createConstants (): void;
    public parse (input: Input<V>, defaultValue?: V, ignoreRelative?: boolean): Value<V>;
    public parseArray (input: Input<V>[], output: Value<V>[], defaultValue?: Input<V>): Value<V>;
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

  export type CalculatorInput<V> = keyof CalculatorMap | Calculator<V>;

  export interface CalculatorMap
  {
    'number':     Calculator<ValueNumber>;
    '2d':         Calculator<Value2d>;
    '3d':         Calculator<Value3d>;
    'quat':       Calculator<ValueQuat>;
    'quaternion': Calculator<ValueQuat>;
    'rgb':        Calculator<ValueRGB>;
    'rgba':       Calculator<ValueRGBA>;
    'color':      Calculator<ValueRGBA>;
    'string':     Calculator<ValueString>;
    'default':    Calculator<ValueNumber>;
  }

  export const Calculators: CalculatorMap;
  export const Calculator2d: Calculator<Value2d>;
  export const Calculator3d: Calculator<Value3d>;
  export const CalculatorNumber: Calculator<ValueNumber>;
  export const CalculatorQuaternion: Calculator<ValueQuat>;
  export const CalculatorRGB: Calculator<ValueRGB>;
  export const CalculatorRGBA: Calculator<ValueRGBA>;
  export const CalculatorString: Calculator<ValueString>;

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

  export class AttrimatorMap<A> extends FastMap<Attrimator<A, keyof A>>
  {
    public setGroup (groupId: number, force?: boolean, deep?: boolean): void;
    public delay (time: number): this;
    public queue<K extends keyof A> (attrimator: Attrimator<A, K>): Attrimator<A, K> | undefined;
    public queueMap (map: AttrimatorMap<A>, offset: number, onNewAttribute?: <K extends keyof A>(attrimator: Attrimator<A, K>) => void, context?: object): this;
    public insertMap (map: AttrimatorMap<A>, onNewAttribute?: <K extends keyof A>(attrimator: Attrimator<A, K>) => any, context?: object): this;
    public unqueueAt (index: number): this;
    public playMapAt (attrimatorMap: AttrimatorMap<A>, all: boolean, time: number): this;
    public playAttrimatorAt (attrimator: Attrimator<A, keyof A>, time: number): void;
    public transitionMap (transition: Transition, attrimatorMap: AttrimatorMap<A>, getValue: <K extends keyof A>(attr: K) => A[K], getAttribute: <K extends keyof A>(attr: K) => Attribute<A, K> | undefined, placeAttrimator: <K extends keyof A>(attrimator: Attrimator<A, K>) => Attrimator<A, K> | undefined, getValueAt: <K extends keyof A>(attrimator: Attrimator<A, K>, relativeTime: number, out: AttributesValues<A>) => A[K], stopAttrimator: <K extends keyof A>(attrimator: Attrimator<A, K>, relativeTime: number) => void, context: object): this;
    public finishNotPresent (attrimatorMap: AttrimatorMap<A>, delay?: number): this;
    public stopNotPresentAt (attrimatorMap: AttrimatorMap<A>, time: number): this;
    public clone (): AttrimatorMap<A>;
    public timeRemaining (returnInfinity?: boolean): number;
    public applyCycle (nextCycle: number): number;
    public iterate (callback: <K extends keyof A>(attrimator: Attrimator<A, K>, depth: number, previous?: Attrimator<A, K>) => void): this;
  }

  export interface Attribute<A, K extends keyof A>
  {
    name: K;
    calculatorName: keyof CalculatorMap;
    calculator: Calculator<A[K]>;
    defaultValue: A[K];
    parse (input: Input<A[K]>, defaultValue?: A[K]): Value<A[K]>;
    cloneDefault (): A[K];
  }

  export class Animator<A = any, S = any> extends EventSource implements Animatable<A, S>
  {
    public subject: S;
    public attrimators: AttrimatorMap<A>;
    public attrimatorsAdded: string[];
    public frame: AttributesValues<A>;
    public updated: AttributesValues<A>;
    public finished: boolean;
    public factory: Factory<A, S>;
    public active: boolean;
    public cycleCurrent: number;
    public cycleNext: number;
    public cycleEnded: number;

    public constructor (subject: S);
    public reset (subject: S): this;
    public newCycle<K extends keyof A> (attrimators: AttrimatorMap<A> | Attrimator<A, K>): this;
    public applyCurrentCycle (): this;
    public endCurrentCycle (): this;
    public getAttribute<K extends keyof A> (attr: K): Attribute<A, K> | undefined;
    public restore (): this;
    public applyInitialState (): this;
    public preupdate (now: number): this;
    public setDefault (attr: keyof A): void;
    public update (now: number): this;
    public placeAttrimator<K extends keyof A> (attrimator: Attrimator<A, K>): Attrimator<A, K> | undefined;
    public apply (): this;
    public trimAttrimators (): this;
    public value (attr: keyof A): any;
    public activate (): this;
    public deactivate (): this;
    public destroy (): this;
    public spring<K extends keyof A> (spring: SpringInput<A, K>): Spring<A, K>;
    public play (animation: AnimationInput<A>, options?: OptionsInput, all?: boolean, cache?: boolean): this;
    public playAttrimators (attrimatorMap: AttrimatorMap<A>, all?: boolean): this;
    public unplay (animation: AnimationInput<A>, transition?: TransitionInput, options?: OptionsInput, all?: boolean, cache?: boolean): this;
    public unplayAttrimators (attrimatorMap: AttrimatorMap<A>, transition?: Transition, all?: boolean): this;
    public queue (animation: AnimationInput<A>, options?: OptionsInput, cache?: boolean): this;
    public queueAttrimators (attrimatorMap: AttrimatorMap<A>): this;
    public insert (animation: AnimationInput<A>, options?: OptionsInput, cache?: boolean): this;
    public insertAttrimators (attrimatorMap: AttrimatorMap<A>): this;
    public transition (transition: TransitionInput, animation: AnimationInput<A>, options?: OptionsInput, all?: boolean, cache?: boolean): this;
    public transitionAttrimators (transition: Transition, attrimatorMap: AttrimatorMap<A>, all?: boolean): this;
    private transitionGetValue <K extends keyof A>(attr: K): A[K];
    private transitionGetValueAt <K extends keyof A>(attrimator: Attrimator<A, K>, relativeTime: number, out: AttributesValues<A>): A[K];
    private transitionStopAttrimator <K extends keyof A>(attrimator: Attrimator<A, K>, relativeTime: number): void;
    public tweenTo<K extends keyof A> (attr: K, target: Input<A[K]>, options?: OptionsInput, cache?: boolean, placeholder1?: any): this;
    public tweenManyTo (targets: Inputs<A>, options?: OptionsInput, cache?: boolean, placeholder1?: any): this;
    public tweenFrom<K extends keyof A> (attr: K, starting: Input<A[K]>, options?: OptionsInput, cache?: boolean, placeholder1?: any): this;
    public tweenManyFrom (startings: Inputs<A>, options?: OptionsInput, placeholder1?: any): this;
    public tween<K extends keyof A> (attr: K, starts: Input<A[K]>, ends: Input<A[K]>, options?: OptionsInput, cache?: boolean, placeholder1?: any): this;
    public tweenMany (starts: Inputs<A>, ends: Inputs<A>, options?: OptionsInput, cache?: boolean, placeholder1?: any): this;
    public move<K extends keyof A> (attr: K, amount: Input<A[K]>, options?: OptionsInput, cache?: boolean, placeholder1?: any): this;
    public moveMany (amounts: Inputs<A>, options?: OptionsInput, cache?: boolean, placeholder1?: any): this;
    public ref<K extends keyof A> (attr: K, placeholder1?: any, placeholder2?: any): () => A[K];
    public follow<K extends keyof A> (attr: K, path: PathInput<A[K]>, options?: OptionsInput, cache?: boolean, placeholder1?: any): this;
    public attrimatorsFor (): Attrimator<A, keyof A>[];
    public attrimatorsFor (attributes: AttributesInput<A>): Attrimator<A, keyof A>[];
    public attrimatorsFor (attributes: AttributesInput<A>, callback: <K extends keyof A>(attrimator: Attrimator<A, K>, attr: K) => void): this;
    public attrimatorsFor (attributes: undefined, callback: <K extends keyof A>(attrimator: Attrimator<A, K>, attr: K) => void): this;
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
    public defer (eventType: 'on' | 'once', event: string, callback?: EventCallback): Defer<Animator<A, S>, Animator<A, S>>;
    public onCycleStart (callback: EventCallback, context?: object): this;
    public onCycleEnd (callback: EventCallback, context?: object): this;
  }

  export class Animators<A = any, S = any> implements Animatable<A, S>
  {
    public $: Animator<A, S>[];

    public constructor (input?: Animator<A, S>[]);
    public push (animator: Animator<A, S>): this;
    public length (): number;
    public at (index: number): Animator<A, S>;
    public each (iterator: (animator: Animator<A, S>, index: number) => void, context?: object): this;
    public fill (animators: Animator<A, S>[]): this;
    public filter (filterer: (animator: Animator<A, S>) => boolean): this;
    public getSubjects<T> (wrapper?: (subject: S) => T): T[];
    public first (): Animator<A, S>;
    public reverse (): this;
    public activate (): this;
    public sequence (delay?: number, easing?: Easing): Sequence<A, S>;
    public timeRemaining (): number;
    public preupdate (now: number, max?: number): this;
    public update (now: number, max?: number): this;
    public apply (max?: number): this;
    public handleFinished (animator: Animator<A, S>): boolean;
    public restore (): this;
    public placeAttrimator<K extends keyof A> (attrimator: Attrimator<A, K>): Attrimator<A, K> | undefined;
    public applyInitialState (): this;
    public trimAttrimators (): this;
    public deactivate (): this;
    public destroy (): this;
    public spring<K extends keyof A> (spring: SpringInput<A, K>): Spring<A, K>;
    public play (animation: AnimationInput<A>, options?: OptionsInput, all?: boolean, cache?: boolean): this;
    public playAttrimators (attrimatorMap: AttrimatorMap<A>, all?: boolean): this;
    public unplay (animation: AnimationInput<A>, transition?: TransitionInput, options?: OptionsInput, all?: boolean, cache?: boolean): this;
    public unplayAttrimators (attrimatorMap: AttrimatorMap<A>, transition?: Transition, all?: boolean): this;
    public queue (animation: AnimationInput<A>, options?: OptionsInput, cache?: boolean): this;
    public queueAttrimators (attrimatorMap: AttrimatorMap<A>): this;
    public insert (animation: AnimationInput<A>, options?: OptionsInput, cache?: boolean): this;
    public insertAttrimators (attrimatorMap: AttrimatorMap<A>): this;
    public transition (transition: TransitionInput, animation: AnimationInput<A>, options?: OptionsInput, all?: boolean, cache?: boolean): this;
    public transitionAttrimators (transition: Transition, attrimatorMap: AttrimatorMap<A>, all?: boolean): this;
    public tweenTo<K extends keyof A> (attr: K, target: Input<A[K]>, options?: OptionsInput, cache?: boolean): this;
    public tweenManyTo (targets: Inputs<A>, options?: OptionsInput, cache?: boolean): this;
    public tweenFrom<K extends keyof A> (attr: K, starting: Input<A[K]>, options?: OptionsInput, cache?: boolean): this;
    public tweenManyFrom (startings: Inputs<A>, options?: OptionsInput): this;
    public tween<K extends keyof A> (attr: K, starts: Input<A[K]>, ends: Input<A[K]>, options?: OptionsInput, cache?: boolean): this;
    public tweenMany (starts: Inputs<A>, ends: Inputs<A>, options?: OptionsInput, cache?: boolean): this;
    public move<K extends keyof A> (attr: K, amount: Input<A[K]>, options?: OptionsInput, cache?: boolean): this;
    public moveMany (amounts: Inputs<A>, options?: OptionsInput, cache?: boolean): this;
    public follow<K extends keyof A> (attr: K, path: PathInput<A[K]>, options?: OptionsInput, cache?: boolean): this;
    public attrimatorsFor (): Attrimator<A, keyof A>[];
    public attrimatorsFor (attributes: AttributesInput<A>): Attrimator<A, keyof A>[];
    public attrimatorsFor (attributes: AttributesInput<A>, callback: <K extends keyof A>(attrimator: Attrimator<A, K>, attr: K) => void): this;
    public attrimatorsFor (attributes: undefined, callback: <K extends keyof A>(attrimator: Attrimator<A, K>, attr: K) => void): this;
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

  export interface Animatable<A = any, S = any>
  {
    activate (): this;
    timeRemaining (): number;
    preupdate (now: number, max?: number): this;
    update (now: number, max?: number): this;
    apply (max?: number): this;
    restore (): this;
    placeAttrimator<K extends keyof A> (attrimator: Attrimator<A, K>): Attrimator<A, K> | undefined;
    applyInitialState (): this;
    trimAttrimators (): this;
    deactivate (): this;
    destroy (): this;
    spring<K extends keyof A> (spring: SpringInput<A, K>): Spring<A, K>;
    play (animation: AnimationInput<A>, options?: OptionsInput, all?: boolean, cache?: boolean): this;
    playAttrimators (attrimatorMap: AttrimatorMap<A>, all?: boolean): this;
    unplay (animation: AnimationInput<A>, transition?: TransitionInput, options?: OptionsInput, all?: boolean, cache?: boolean): this;
    unplayAttrimators (attrimatorMap: AttrimatorMap<A>, transition?: Transition, all?: boolean): this;
    queue (animation: AnimationInput<A>, options?: OptionsInput, cache?: boolean): this;
    queueAttrimators (attrimatorMap: AttrimatorMap<A>): this;
    insert (animation: AnimationInput<A>, options?: OptionsInput, cache?: boolean): this;
    insertAttrimators (attrimatorMap: AttrimatorMap<A>): this;
    transition (transition: TransitionInput, animation: AnimationInput<A>, options?: OptionsInput, all?: boolean, cache?: boolean): this;
    transitionAttrimators (transition: Transition, attrimatorMap: AttrimatorMap<A>, all?: boolean): this;
    tweenTo<K extends keyof A> (attr: K, target: Input<A[K]>, options?: OptionsInput, cache?: boolean): this;
    tweenManyTo (targets: Inputs<A>, options?: OptionsInput, cache?: boolean): this;
    tweenFrom<K extends keyof A> (attr: K, starting: Input<A[K]>, options?: OptionsInput, cache?: boolean): this;
    tweenManyFrom (startings: Inputs<A>, options?: OptionsInput): this;
    tween<K extends keyof A> (attr: K, starts: Input<A[K]>, ends: Input<A[K]>, options?: OptionsInput, cache?: boolean): this;
    tweenMany (starts: Inputs<A>, ends: Inputs<A>, options?: OptionsInput, cache?: boolean): this;
    move<K extends keyof A> (attr: K, amount: Input<A[K]>, options?: OptionsInput, cache?: boolean): this;
    moveMany (amounts: Inputs<A>, options?: OptionsInput, cache?: boolean): this;
    follow<K extends keyof A> (attr: K, path: PathInput<A[K]>, options?: OptionsInput, cache?: boolean): this;
    attrimatorsFor (): Attrimator<A, keyof A>[];
    attrimatorsFor (attributes: AttributesInput<A>): Attrimator<A, keyof A>[];
    attrimatorsFor (attributes: AttributesInput<A>, callback: <K extends keyof A>(attrimator: Attrimator<A, K>, attr: K) => void): this;
    attrimatorsFor (attributes: undefined, callback: <K extends keyof A>(attrimator: Attrimator<A, K>, attr: K) => void): this;
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

  export class Sequence<A = any, S = any>
  {
    public animators: Animators<A, S>;
    public delay: number;
    public easing: Easing;

    public constructor (animators: Animators<A, S>, delay?: Delay, easing?: EasingInput);
    public maxDelay (): number;
    public createAttrimators (template: Animation<A>, i: number): AttrimatorMap<A>;
    public reverse (): this;
    public play (animation: AnimationInput<A>, options?: OptionsInput, all?: boolean, cache?: boolean): this;
    public queue (animation: AnimationInput<A>, options?: OptionsInput, cache?: boolean): this;
    public insert (animation: AnimationInput<A>, options?: OptionsInput, cache?: boolean): this;
    public transition (transition: TransitionInput, animation: AnimationInput<A>, all?: boolean, options?: OptionsInput, cache?: boolean): this;
    public add (): this;
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

  export type BuilderInput<A> = string | Builder<A>;

  export class Builder<A>
  {
    public parse (animation: AnimationDefinition<A>, options: Options, attrimatorMap: AttrimatorMap<A>, helper: BuilderHelper<A>): void;
    public merge (animation: AnimationDefinition<A>, newOptions: Options, oldOptions: Options, attrimatorMap: AttrimatorMap<A>, helper: BuilderHelper<A>): void;
    public mergeAttrimator<K extends keyof A> (e: Attrimator<A, K>, attr: K, helper: BuilderHelper<A>, factory: Factory<any, A>): void;
    public submerge (animation: AnimationDefinition<A>, newOptions: Options, oldOptions: Options, attrimatorMap: AttrimatorMap<A>): void;

    public static nextMergeId (): number;
  }

  export const BuilderAnd: Builder<any>;
  export const BuilderDeltas: Builder<any>;
  export const BuilderFinal: Builder<any>;
  export const BuilderInitial: Builder<any>;
  export const BuilderKeyframe: Builder<any>;
  export const BuilderMove: Builder<any>;
  export const BuilderPath: Builder<any>;
  export const BuilderPhysics: Builder<any>;
  export const BuilderQueue: Builder<any>;
  export const BuilderSpring: Builder<any>;
  export const BuilderTravel: Builder<any>;
  export const BuilderTweenFrom: Builder<any>;
  export const BuilderTweenTo: Builder<any>;

  export class BuilderHelper<A>
  {
    public input: AnimationDefinition<A>;
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
    public parseEvent<K extends keyof A> (attr: K, path: Path<A[K]>, builder: Builder<A>, hasInitialState: boolean, mergeId: number): Event<A, K>
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

  export type FactoryInput<A, S> = string | Factory<A, S>;

  export class Factory<A, S>
  {
    public priority: number;

    public is (subject: any): subject is S;
    public animatorFor (subject: S): Animator<A, S>;
    public animatorsFor (subject: S, animators: Animators<A, S>): void;
    public destroy (animator: Animator<A, S>): void;
    public attribute<K extends keyof A> (attr: K): Attribute<A, K>  | undefined;
  }

  export class FactoryObject extends Factory<any, any>
  {
    public attributes: {
      [attr: string]: Attribute<any, any>
    };
  }

  export const Factories:
  {
    [factoryName: string]: Factory<any, any>
  }

  export const object:
  {
    [custom: string]: Partial<Attribute<any, any>>
  }

  export class Attrimator<A = any, K extends keyof A = any>
  {
    public attribute: K;
    public builder: Builder<A>;
    public next: Attrimator<A, K> | undefined;
    public startTime: number;
    public pauseTime: number;
    public elapsed: number;
    public stopTime: number;
    public paused: boolean;
    public cycle: number;
    public delay: Delay;
    public offset: Offset;

    public reset (attribute: K, builder: Builder<A>, next?: Attrimator<A, K>): void;
    public prestart (now: number): void;
    public prestartNext (overrideNext?: boolean): void;
    public start (now: number, animator: Animator<any, A>): void;
    public startCycle (frame: AttributesValues<A>): boolean;
    public setTime (now: number, frame: AttributesValues<A>): boolean;
    public update (elapsed: number, frame: AttributesValues<A>): boolean;
    public getElapsed (): number;
    public stopIn (milliseconds: number): this;
    public stopAt (time: number): this;
    public nopeat (): this;
    public valueAt (time: number, out: A[K]): A[K];
    public valueAtSearch (time: number, out: A[K]): A[K] | false;
    public attrimatorAt (time: number): Attrimator<A, K>;
    public totalTime (): number;
    public timeRemaining (): number;
    public clone (): Attrimator<A, K>;
    public hasComputed (): boolean;
    public isInfinite (): boolean;
    public pause (): this;
    public resume (): this;
    public isPaused (): boolean;
    public finish (frame: AttributesValues<A>): boolean;
    public isFinished (): boolean;
    public getBuilder (): Builder<A>
    public queue (next: Attrimator<A, K>): this;
    public nextAt (next: Attrimator<A, K>, time: number): this;
    public parseValue (animator: Animator<any, A>, value: Input<A[K]>, defaultValue?: A[K]): A[K];
  }

  export type SpringInput<A = any, K extends keyof A = any> =
    string |
    Spring<A, K> |
    SpringDefinition<A, K>

  export interface SpringDefinition<A = any, K extends keyof A = any>
  {
    type: keyof SpringMap;
    attribute?: K;
    calculator?: CalculatorInput<A[K]>;
    position: Input<A[K]>;
    rest: Input<A[K]>;
    velocity: Input<A[K]>;
    gravity: Input<A[K]>;
    finishOnRest: boolean;
  }

  export class Spring<A = any, K extends keyof A = any> extends Attrimator<A, K>
  {
    public calculator: Calculator<A[K]>;
    public rest: Value<A[K]>;
    public position: Value<A[K]>;
    public gravity: Value<A[K]>;
    public velocity: Value<A[K]>;
    public finishOnRest: boolean;

    public set (attribute: K, calculator: CalculatorInput<A[K]>, rest: Input<A[K]>, position: Input<A[K]>, velocity?: Input<A[K]>, gravity?: Input<A[K]>, finishOnRest?: boolean): void;
    public resolveRest (): A[K];
    public updateVelocity (dt: number): void;

    public static MAX_DT: number;
    public static EPSILON: number;
  }

  export interface SpringMap
  {
    'distance': <A, K extends keyof A>(def: SpringDistanceDefinition<A, K>) => SpringDistance<A, K>;
    'linear': <A, K extends keyof A>(def: SpringLinearDefinition<A, K>) => SpringLinear<A, K>;
  }

  export interface SpringDistanceDefinition<A = any, K extends keyof A = any> extends SpringDefinition<A, K>
  {
    type: 'distance';
    distance: number;
    damping: number;
    stiffness: number;
  }

  export class SpringDistance<A = any, K extends keyof A = any> extends Spring<A, K>
  {
    public distance: number;
    public damping: number;
    public stiffness: number;

    public constructor (attribute: K, calculator: Calculator<A[K]>, position: Input<A[K]>, rest: Input<A[K]>, distance: number, damping: number, stiffness: number, velocity?: Input<A[K]>, gravity?: Input<A[K]>, finishOnRest?: boolean);
  }

  export interface SpringLinearDefinition<A = any, K extends keyof A = any> extends SpringDefinition<A, K>
  {
    type: 'linear';
    damping: Input<A[K]>;
    stiffness: Input<A[K]>;
  }

  export class SpringLinear<A = any, K extends keyof A = any> extends Spring<A, K>
  {
    public damping: Value<A[K]>;
    public stiffness: Value<A[K]>;

    public constructor (attribute: K, calculator: Calculator<A[K]>, position: Input<A[K]>, rest: Input<A[K]>, damping: Input<A[K]>, stiffness: Input<A[K]>, velocity?: Input<A[K]>, gravity?: Input<A[K]>, finishOnRest?: boolean);
  }

  export const enum EventState
  {
    DELAYED = 1,
    ANIMATING = 2,
    SLEEPING = 4,
    FINISHED = 8
  }

  export class Event<A = any, K extends keyof A = any> extends Attrimator<A, K>
  {
    public path: Path<A[K]>;
    public duration: Duration;
    public easing: EasingInput;
    public sleep: Sleep;
    public repeat: Repeat;
    public scale: Scale;
    public scaleBase: ScaleBase<A[K]>;
    public hasInitialState: boolean;
    public input: AnimationDefinition<A> | undefined;
    public mergeId: number | undefined;
    public state: EventState;

    public constructor (attribute: K, path: Path<A[K]>, duration: Duration, easing: EasingInput, delay: Delay, sleep: Sleep, offset: Offset, repeat: Repeat, scale: Scale, scaleBase: ScaleBase<A[K]>, parameters: object, hasInitialState: boolean, builder: Builder<A>, next?: Attrimator<A, K>, input?: AnimationDefinition<A>, mergeId?: number);
    public computeValue (baseValue: A[K], delta: number): A[K];
    public applyValue (frame: AttributesValues<A>, baseValue: A[K], delta: number): A[K];

    public static fromOptions <A, K extends keyof A>(attr: K, path: Path<A[K]>, options?: Options): Event<A, K>;
  }

  export class Oncer<A = any, K extends keyof A = any> extends Attrimator<A, K>
  {
    public value: Value<A[K]>;
    public delay: number;
    public applied: boolean;
    public input: AnimationInput<A>;

    public constructor (attribute: K, value: Input<A[K]>, delay: Delay, hasInitialState: boolean, builder: Builder<A>, next?: Attrimator<A, K>, input?: AnimationInput<A>);
    public getValue (): A[K];
  }

  export class Physics<A = any, K extends keyof A = any> extends Attrimator<A, K>
  {
    public value: Value<A[K]>;
    public delay: number;
    public applied: boolean;
    public input: AnimationInput<A>;

    public constructor (attribute: K, value: Input<A[K]>, delay: Delay, hasInitialState: boolean, builder: Builder<A>, next?: Attrimator<A, K>, input?: AnimationInput<A>);
    public getValue (): A[K];
  }

  export type AnimationInput<A = any> = string | Animation<A> | AnimationDefinition<A>;

  export interface AnimationDefinition<A = any>
  {
    factory?: FactoryInput<any, A>;
    initial?: BuilderInitialInputs<A>;
    values?: BuilderDeltasValuesInputs<A>;
    deltas?: BuilderDeltasDeltasInputs<A>;
    point?: BuilderPointInput<A>;
    keyframe?: BuilderKeyframeInputs<A>;
    move?: BuilderMoveInputs<A>;
    path?: BuilderPathInputs<A>;
    physics?: BuilderPhysicsInput<A>;
    springs?: BuilderSpringsInputs<A>;
    travel?: BuilderTravelInputs<A>;
    tweenFrom?: BuildeTweenFromInputs<A>;
    tweenTo?: BuildeTweenToInputs<A>,
    final?: BuilderFinalInputs<A>;
    and?: AnimationDefinition<A>;
    queue?: AnimationDefinition<A>;
    easings?: AnimationOptions<A, EasingInput>;
    repeats?: AnimationOptions<A, Repeat>;
    delays?: AnimationOptions<A, Delay>;
    sleeps?: AnimationOptions<A, Sleep>;
    durations?: AnimationOptions<A, Duration>;
    offsets?: AnimationOptions<A, Offset>;
    scales?: AnimationOptions<A, number>;
    scaleBases?: Inputs<A>;
    parameters?: AnimationOptions<A, object>;
  }

  export type AnimationOptions<A, T> =
    T | { [P in keyof A]?: T };

  export type BuilderDeltasValuesInputs<A> =
    { [P in keyof A]?: Input<A[P]>[]; }

  export type BuilderDeltasDeltasInputs<A> =
    { [P in keyof A]?: number[]; } | number[];

  export type BuilderFinalInputs<A> =
    Inputs<A>;

  export type BuilderInitialInputs<A> =
    Inputs<A>;

  export type BuilderKeyframeInputs<A> =
    { [frame: string]: Inputs<A> };

  export type BuilderMoveInputs<A> =
    Inputs<A>;

  export type BuilderPathInputs<A> =
    { [P in keyof A]?: PathInput<A[P]>; };

  export type BuilderPhysicsInput<A> =
  {
    [P in keyof A]?: {
      calculator?: CalculatorInput<A[P]>;
      position?: Input<A[P]>;
      velocity?: Input<A[P]>;
      acceleration?: Input<A[P]>;
      terminal?: number;
      stopAt?: number | string;
    }
  };

  export type BuilderPointInput<A> =
    Inputs<A>;

  export type BuilderSpringsInputs<A> =
    { [P in keyof A]?: SpringInput<A, P>; };

  export type BuilderTravelInputs<A> =
  {
    [P in keyof A]?: {
      from?: Input<A[P]>;
      to?: Input<A[P]>;
      velocity?: number;
      acceleration?: number;
      terminal?: number;
      epsilon?: number;
    }
  };

  export type BuildeTweenFromInputs<A> =
    Inputs<A>;

  export type BuildeTweenToInputs<A> =
    Inputs<A>;


  export class Animation<A = any>
  {
    public name: string | undefined;
    public input: AnimationDefinition<A>;
    public options: Options | undefined;
    public attrimators: AttrimatorMap<A>;

    public newAttrimators (): AttrimatorMap<A>;
    public merge (options: Options | undefined, attrimatorMap: AttrimatorMap<A>): void;
  }

  export const Animations:
  {
    [animationName: string]: Animation<any>
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

  export type PathInput<V> = keyof PathMap | Path<V> | PathDefinition;

  export interface PathDefinition
  {
    type: keyof PathMap;
    name?: string;
  }

  export class Path<V>
  {
    public name: string | undefined;
    public points: Value<V>[];
    public calculator: Calculator<V>;
    public computed: boolean;
    public deterministic: boolean;

    public reset (calculator: Calculator<V>, points: Value<V>[]): void;
    public compute (out: V, delta: number): V;
    public hasComputed (): boolean;
    public isDeterministic (): boolean;
    public examinePoints<T> (examiner: (point: V) => boolean, returnOnTrue: T, returnOnFalse: T): T;
    public replaceComputed<A> (attrimator: Attrimator<A, keyof A>, animator: Animator<any, A>): (V | Dynamic<V>)[]
    public resolvePoint (i: number, dt: number): V;
    public isLinear (): boolean;
    public length (granularity: number): number;
  }

  export interface PathMap
  {
    'point': <V>(def: PathPointDefinition<V>) => PathPoint<V>;
    'combo': <V>(def: PathComboDefinition<V>) => PathCombo<V>;
    'compiled': <V>(def: PathCompiledDefinition<V>) => PathCompiled<V>;
    'cubic': <V>(def: PathCubicDefinition<V>) => PathCubic<V>;
    'delta': <V>(def: PathDeltaDefinition<V>) => PathDelta<V>;
    'series': <V>(def: PathSeriesDefinition<V>) => PathSeries<V>;
    'jump': <V>(def: PathJumpDefinition<V>) => PathJump<V>;
    'keyframe': <V>(def: PathKeyframeDefinition<V>) => PathKeyframe<V>;
    'quadratic': <V>(def: PathQuadraticDefinition<V>) => PathQuadratic<V>;
    'tween': <V>(def: PathTweenDefinition<V>) => PathTween<V>;
    'sub': <V>(def: PathSubDefinition<V>) => PathSub<V>;
    'quadratic-corner': <V>(def: PathQuadraticCornerDefinition<V>) => PathQuadraticCorner<V>;
    'linear': <V>(def: PathLinearDefinition<V>) => PathLinear<V>;
    'uniform': <V>(def: PathUniformDefinition<V>) => PathUniform<V>;
    'hermite': <V>(def: PathHermiteDefinition<V>) => PathHermite<V>;
    'bezier': <V>(def: PathBezierDefinition<V>) => PathBezier<V>;
    'parametric': <V>(def: PathParametricDefinition<V>) => PathParametric<V>;
    'catmull-rom': <V>(def: PathCatmullRomDefinition<V>) => PathCatmullRom<V>;
    'basis-spline': <V>(def: PathBasisSplineDefinition<V>) => PathBasisSpline<V>;
  }

  export const Paths: PathMap;

  export interface PathPointDefinition<V> extends PathDefinition
  {
    type: 'point';
    calculator?: CalculatorInput<V>;
    defaultValue?: Input<V>;
    point: Input<V>;
  }

  export class PathPoint<V> extends Path<V>
  {
    public constructor (name: string | undefined, calculator: Calculator<V>, point: V);
    public set (calculator: Calculator<V>, point: V): void;
  }

  export interface PathComboDefinition<V> extends PathDefinition
  {
    type: 'combo';
    paths: PathInput<V>[];
    uniform?: boolean;
    granularity?: number;
  }

  export class PathCombo<V> extends Path<V>
  {
    public paths: Path<V>[];
    public deltas: number[];
    public uniform: boolean;
    public granularity: number;
    public linear: boolean;
    public cachedLength: number | false;

    public constructor (name: string | undefined, paths: Path<V>[], uniform?: boolean, granularity?: boolean);
    public set (paths: Path<V>[], uniform?: boolean, granularity?: boolean): void;
  }

  export interface PathCompiledDefinition<V> extends PathDefinition
  {
    type: 'compiled';
    path: PathInput<V>;
    n?: number;
    pointCount?: number;
  }

  export class PathCompiled<V> extends Path<V>
  {
    public path: Path<V>;
    public pointCount: number;

    public constructor (name: string | undefined, path: Path<V>, pointCoint: number);
    public set (path: Path<V>, pointCoint: number): void;

    public static compile<V> (calc: Calculator<V>, path: Path<V>, pointCount: number): V[];
  }

  export interface PathCubicDefinition<V> extends PathDefinition
  {
    type: 'cubic';
    calculator?: CalculatorInput<V>;
    defaultValue?: Input<V>;
    p0: Input<V>;
    p1: Input<V>;
    p2: Input<V>;
    p3: Input<V>;
  }

  export class PathCubic<V> extends Path<V>
  {
    public constructor (name: string | undefined, calculator: Calculator<V>, p0: Value<V>, p1: Value<V>, p2: Value<V>, p3: Value<V>);
    public set (calculator: Calculator<V>, p0: Value<V>, p1: Value<V>, p2: Value<V>, p3: Value<V>): void;
  }

  export interface PathDeltaDefinition<V> extends PathDefinition
  {
    type: 'delta';
    calculator?: CalculatorInput<V>;
    defaultValue?: Input<V>;
    deltas?: number[];
    points: Input<V>[];
  }

  export class PathDelta<V> extends Path<V>
  {
    public deltas: number[];

    public constructor (name: string | undefined, calculator: Calculator<V>, points: Value<V>, deltas: number[]);
    public set (calculator: Calculator<V>, points: Value<V>, deltas: number[]): void;
  }

  export interface PathSeriesDefinition<V> extends PathDefinition
  {
    type: 'series',
    calculator?: CalculatorInput<V>;
    defaultValue?: Input<V>;
    series?: number[];
    points: Input<V>[]
  }

  export class PathSeries<V> extends Path<V>
  {
    public series: number[];

    public constructor (name: string | undefined, calculator: Calculator<V>, points: Value<V>, series: number[]);
    public set (calculator: Calculator<V>, points: Value<V>, series: number[]): void;
    public between (i: number, delta: number): boolean;
  }

  export interface PathJumpDefinition<V> extends PathDefinition
  {
    type: 'jump',
    calculator?: CalculatorInput<V>;
    defaultValue?: Input<V>;
    points: Input<V>[]
  }

  export class PathJump<V> extends Path<V>
  {
    public constructor (name: string | undefined, calculator: Calculator<V>, points: Value<V>);
    public set (calculator: Calculator<V>, points: Value<V>): void;
  }

  export interface PathKeyframeDefinition<V> extends PathDefinition
  {
    type: 'keyframe',
    calculator?: CalculatorInput<V>;
    defaultValue?: Input<V>;
    deltas?: number[];
    easings?: EasingInput | EasingInput[];
    points: Input<V>[]
  }

  export class PathKeyframe<V> extends Path<V>
  {
    public deltas: number[];
    public easings: Easing[];

    public constructor (name: string | undefined, calculator: Calculator<V>, points: Value<V>, deltas: number[], easings: Easing[]);
    public set (calculator: Calculator<V>, points: Value<V>, deltas: number[], easings: Easing[]): void;
  }

  export interface PathQuadraticDefinition<V> extends PathDefinition
  {
    type: 'quadratic';
    calculator?: CalculatorInput<V>;
    defaultValue?: Input<V>;
    p0: Input<V>;
    p1: Input<V>;
    p2: Input<V>;
  }

  export class PathQuadratic<V> extends Path<V>
  {
    public constructor (name: string | undefined, calculator: Calculator<V>, p0: Value<V>, p1: Value<V>, p2: Value<V>);
    public set (calculator: Calculator<V>, p0: Value<V>, p1: Value<V>, p2: Value<V>): void;
  }

  export interface PathTweenDefinition<V> extends PathDefinition
  {
    type: 'tween';
    calculator?: CalculatorInput<V>;
    defaultValue?: Input<V>;
    start: Input<V>;
    end: Input<V>;
  }

  export class PathTween<V> extends Path<V>
  {
    public constructor (name: string | undefined, calculator: Calculator<V>, start: Value<V>, end: Value<V>);
    public set (calculator: Calculator<V>, start: Value<V>, end: Value<V>): void;
  }

  export interface PathSubDefinition<V> extends PathDefinition
  {
    type: 'sub';
    path: PathInput<V>;
    start?: number;
    end?: number;
  }

  export class PathSub<V> extends Path<V>
  {
    public start: number;
    public end: number;
    public path: Path<V>;

    public constructor (name: string | undefined, path: Path<V>, start: number, end: number);
    public set (path: Path<V>, start: number, end: number): void;
  }

  export interface PathQuadraticCornerDefinition<V> extends PathDefinition
  {
    type: 'quadratic-corner';
    calculator?: CalculatorInput<V>;
    defaultValue?: Input<V>;
    points: Input<V>[];
    midpoint: number;
    loop?: boolean;
  }

  export class PathQuadraticCorner<V> extends Path<V>
  {
    public midpoint: number;
    public loop: boolean;

    public constructor (name: string | undefined, calculator: Calculator<V>, points: Value<V>[], midpoint: number, loop: boolean);
    public set (calculator: Calculator<V>, points: Value<V>[], midpoint: number, loop: boolean): void;
  }

  export interface PathLinearDefinition<V> extends PathDefinition
  {
    type: 'linear';
    calculator?: CalculatorInput<V>;
    defaultValue?: Input<V>;
    points: Input<V>[];
  }

  export class PathLinear<V> extends PathDelta<V>
  {
    public constructor (name: string | undefined, calculator: Calculator<V>, points: Value<V>[]);
    public setLinear (calculator: Calculator<V>, points: Value<V>[]): void;

    public static getTimes<V> (calc: Calculator<V>, points: V[]): number[];
  }

  export interface PathUniformDefinition<V> extends PathDefinition
  {
    type: 'uniform';
    path: PathInput<V>;
    n?: number;
    pointCount?: number;
  }

  export class PathUniform<V> extends PathDelta<V>
  {
    public path: Path<V>;
    public pointCount: number;

    public constructor (name: string | undefined, path: Path<V>, pointCount: number);
    public setUniform (path: Path<V>, pointCount: number): void;
  }

  export interface PathHermiteDefinition<V> extends PathDefinition
  {
    type: 'hermite';
    calculator?: CalculatorInput<V>;
    defaultValue?: Input<V>;
    start: Input<V>;
    startTangent: Input<V>;
    end: Input<V>;
    endTangent: Input<V>;
  }

  export class PathHermite<V> extends Path<V>
  {
    public startTangent: Value<V>;
    public endTangent: Value<V>;

    public constructor (name: string | undefined, calculator: Calculator<V>, start: Value<V>, startTangent: Value<V>, end: Value<V>, endTangent: Value<V>);
    public set (calculator: Calculator<V>, start: Value<V>, startTangent: Value<V>, end: Value<V>, endTangent: Value<V>): void;
  }

  export interface PathBezierDefinition<V> extends PathDefinition
  {
    type: 'bezier';
    calculator?: CalculatorInput<V>;
    defaultValue?: Input<V>;
    points: Input<V>[];
    weights?: number[]
  }

  export class PathBezier<V> extends Path<V>
  {
    public weights: number[];
    public inverses: number[];

    public constructor (name: string | undefined, calculator: Calculator<V>, points: Value<V>[], weights?: number[]);
    public set (calculator: Calculator<V>, points: Value<V>[], weights?: number[]): void;

    public static computeWeights (n: number): number[];
  }

  export type Matrix = [
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number]
  ];

  export interface PathParametricDefinition<V> extends PathDefinition
  {
    type: 'parametric';
    calculator?: CalculatorInput<V>;
    defaultValue?: Input<V>;
    points: Input<V>[];
    loop?: boolean;
    matrix: Matrix;
    weight: number;
    invert?: boolean;
  }

  export class PathParametric<V> extends Path<V>
  {
    public loop: boolean;
    public matrix: Matrix;
    public weight: number;
    public invert: boolean;

    public constructor (name: string | undefined, calculator: Calculator<V>, points: Value<V>[], loop: boolean, matrix: Matrix, weight: number, invert: boolean);
    public set (calculator: Calculator<V>, points: Value<V>[], loop: boolean, matrix: Matrix, weight: number, invert: boolean): void;
  }

  export interface PathCatmullRomDefinition<V> extends PathDefinition
  {
    type: 'catmull-rom';
    calculator?: CalculatorInput<V>;
    defaultValue?: Input<V>;
    points: Input<V>[];
    loop?: boolean;
  }

  export class PathCatmullRom<V> extends PathParametric<V>
  {
    public constructor (name: string | undefined, calculator: Calculator<V>, points: Value<V>[], loop: boolean);
    public setCatmullRom (calculator: Calculator<V>, points: Value<V>[], loop: boolean): void;

    public static WEIGHT: number;
    public static MATRIX: Matrix;
  }

  export interface PathBasisSplineDefinition<V> extends PathDefinition
  {
    type: 'basis-spline';
    calculator?: CalculatorInput<V>;
    defaultValue?: Input<V>;
    points: Input<V>[];
    loop?: boolean;
  }

  export class PathBasisSpline<V> extends PathParametric<V>
  {
    public constructor (name: string | undefined, calculator: Calculator<V>, points: Value<V>[], loop: boolean);
    public setCatmullRom (calculator: Calculator<V>, points: Value<V>[], loop: boolean): void;

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

  export class Movie<A = any> extends EventSource
  {
    public name: string | undefined;
    public currentTime: number;
    public currentTimelines: MovieTimeline<A>[];
    public sequenceDelay: number;
    public sequenceEasing: Easing;
    public introduce: boolean;
    public timelines: FastMap<MovieTimeline<A>>;
    public autoEnd: boolean;

    public constructor(name?: string);
    public setAutoEnd (autoEnd: boolean): this;
    public sequence (delay: Delay, easing: EasingInput): this;
    public intro (subjects: any[]): this;
    public with (subjects: any[]): this;
    public add (subjects: any[]): this;
    public getTimeline (animator: Animator<any, A>): MovieTimeline<A>;
    public getTimelines (subjects: any[]): MovieTimeline<A>[];
    public at (time: string | number): this;
    public seek (time: string | number): this;
    public end (): this;
    public play (animation: AnimationInput<A>, options?: OptionsInput, all?: boolean): this;
    public queue (animation: AnimationInput<A>, options?: OptionsInput, all?: boolean): this;
    public transition (transition: TransitionInput, animation: AnimationInput<A>, options?: OptionsInput, all?: boolean): this;
    public eachCurrentTimeline (onTimeline: (timeline: MovieTimeline<A>, time: number) => void): this;
    public duration (): number;
  }

  export class MovieTimeline<A = any>
  {
    public animator: Animator<any, A>;
    public attrimators: AttrimatorMap<A>;
    public start: number;

    public constructor (animator: Animator<any, A>);
    public playAttrimators (attrimatorMap: AttrimatorMap<A>, all: boolean, time: number, intro?: boolean): void;
    public queueAttrimators (attrimatorMap: AttrimatorMap<A>, all: boolean, time: number): void;
    public transitionAttrimators (attrimatorMap: AttrimatorMap<A>, all: boolean, time: number, transition: Transition): void;
    public preupdate (time: number): void;
    public update (time: number): void;
    public apply (): void;
  }

  export class MoviePlayer<A = any> extends EventSource
  {
    public speed: number;
    public time: number;
    public currentTime: number;
    public playing: boolean;
    public movie: Movie<A>;
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
    public runner (movie: Movie<A>, player: MoviePlayer<A>): () => void;
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

  export function on (events: EventsInput, callback: EventCallback, context?: object): void;
  export function once (events: EventsInput, callback: EventCallback, context?: object): void;
  export function off (events?: EventsInput, callback?: EventCallback): void;
  export function trigger (event: string, argument: any): void;

  export function isRunning (): boolean;
  export function isLive (): boolean;
  export function setLive (newLive: boolean): void;

  export const animating: Animators<any, any>;

  export function activitateAnimator (animator: Animator<any, any>): void;
  export function pushAnimator (animator: Animator<any, any>): void;
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

  export function animation <A>(animation: AnimationInput<A>, options?: OptionsInput, cache?: boolean): Animation<A> | undefined;
  export function attrimatorsFor <A>(animation: AnimationInput<A>, options?: OptionsInput, cache?: boolean): AttrimatorMap<A> | undefined;
  export function builder<A> (builderInput: BuilderInput<A>): Builder<A> | undefined;
  export function calculator<V> (calculatorInput: CalculatorInput<V>): Calculator<V>;
  export function delay (time: Delay): number;
  export function deltas (deltas: number[], clone?: boolean): number[];
  export function duration (time: Duration): number;
  export function easing<E> (easing: EasingInput, returnOnInvalid?: E): Easing | E;
  export function easingType (easingType: EasingTypeInput, optional?: boolean): EasingType | undefined;
  export function factory<A, S> (factoryInput: Factory<A, S>, forObject?: Factory<A, S> | Sequence<A, S> | Animators<A, S> | Animator<A, S>): Factory<A, S>;
  export function factoryFor<A, S> (subject: S, optional?: boolean): Factory<A, S> | false;
  export function number<E> (value: ValueNumber, returnOnInvalid?: E): number | E;
  export function offset (time: Offset): number;
  export function options (options: OptionsInput, cache?: boolean): Options;
  
  
  export function path<V> (pathInput: PathPointDefinition<V>): PathPoint<V>;
  export function path<V> (pathInput: PathComboDefinition<V>): PathCombo<V>;
  export function path<V> (pathInput: PathCompiledDefinition<V>): PathCompiled<V>;
  export function path<V> (pathInput: PathCubicDefinition<V>): PathCubic<V>;
  export function path<V> (pathInput: PathDeltaDefinition<V>): PathDelta<V>;
  export function path<V> (pathInput: PathSeriesDefinition<V>): PathSeries<V>;
  export function path<V> (pathInput: PathJumpDefinition<V>): PathJump<V>;
  export function path<V> (pathInput: PathKeyframeDefinition<V>): PathKeyframe<V>;
  export function path<V> (pathInput: PathQuadraticDefinition<V>): PathQuadratic<V>;
  export function path<V> (pathInput: PathTweenDefinition<V>): PathTween<V>;
  export function path<V> (pathInput: PathSubDefinition<V>): PathSub<V>;
  export function path<V> (pathInput: PathQuadraticCornerDefinition<V>): PathQuadraticCorner<V>;
  export function path<V> (pathInput: PathLinearDefinition<V>): PathLinear<V>;
  export function path<V> (pathInput: PathUniformDefinition<V>): PathUniform<V>;
  export function path<V> (pathInput: PathHermiteDefinition<V>): PathHermite<V>;
  export function path<V> (pathInput: PathBezierDefinition<V>): PathBezier<V>;
  export function path<V> (pathInput: PathParametricDefinition<V>): PathParametric<V>;
  export function path<V> (pathInput: PathCatmullRomDefinition<V>): PathCatmullRom<V>;
  export function path<V> (pathInput: PathBasisSplineDefinition<V>): PathBasisSpline<V>;

  export function repeat<E> (repeat: Repeat, returnOnInvalid?: E): number | E;
  export function scale (scale: Scale): number;
  export function sleep (time: number): number;
  
  export function spring<A, K extends keyof A> (springInput: SpringDistanceDefinition<A, K>): SpringDistance<A, K>;
  export function spring<A, K extends keyof A> (springInput: SpringLinearDefinition<A, K>): SpringLinear<A, K>;

  export function time<E> (repeat: any, returnOnInvalid?: E): number | E;
  export function transition (transition: TransitionInput, cache?: boolean): Transition;

  export const Color: 
  {
    (r?: number, g?: number, b?: number, a?: number): ValueRGBA;

    parse (input: string): ValueRGBA | false;
    format (color: Partial<ValueRGBA>): string;

    parsers: {
      parse (input: string): ValueRGBA | false;
    }[];
  };

  export function isRelative (x: any): boolean;
  export function isComputed<V> (x: any): x is Computed<V>;
  export function resolveComputed<A, K extends keyof A> (attrimator: Attrimator<A, K>, animator: Animator<any, A>, value: Input<A[K]>, parser: Calculator<A[K]> | ((attrimator: Attrimator<A, K>, animator: Animator<any, A>, value: Input<A[K]>) => Input<A[K]>)): A[K];

  export const computed: 
  {
     <V>(func: Computed<V>): Computed<V>;
     <V>(name: string, func: Computed<V>): Computed<V>;

    current: Computed<any>;

    relative<V> (relativeAmount: V, mask: V): Computed<V>;

    random<V> (randomSelection: Input<V>[] | {min: Input<V>, max: Input<V>} | Path<V>): Computed<V>;

    combined<V> (numbers: Value<number>[]): Computed<V>;
  };

  export function composite<A> (map: { [name: string]: string}): (value: AttributesValues<A>, frame: AttributesValues<A>) => void;
  export function partial<A, K extends keyof A> (attribute: K, subattribute: keyof A[K]): (value: AttributesValues<A>, frame: AttributesValues<A>) => void;
  export function spread<A> (attributes: (keyof A)[]): (value: AttributesValues<A>, frame: AttributesValues<A>) => void;

  export function param<V> (paramName: string, paramCalculator?: CalculatorInput<V>, paramDefaultValue?: Input<V>): Parameters;

  export interface Parameters
  {
    add<V> (value: Input<V>): Computed<V> & Parameters;
    sub<V> (value: Input<V>): Computed<V> & Parameters;
    mul<V> (value: Input<V>): Computed<V> & Parameters;
    scale<V> (scalar: number): Computed<V> & Parameters;
    adds<V> (value: Input<V>, scalar: number): Computed<V> & Parameters;
    neg<V> (): Computed<V> & Parameters;
    min<V> (value: Input<V>): Computed<V> & Parameters;
    max<V> (value: Input<V>): Computed<V> & Parameters;
    truncate<V> (denominator: number): Computed<V> & Parameters;
    mode<V> (divisor: number): Computed<V> & Parameters;
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
    distance<V> (value: Input<V>): Computed<V> & Parameters;
    property<V> (propertyName: string, defaultValue: Input<V>): Computed<V> & Parameters;
    vector<V> (calculator: Calculator<V>): Computed<V> & Parameters;
  }

  export const Defaults: 
  {
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

  export const SaveOptions: 
  {
    prefix: string;
    options: Options;
    cache: boolean;
    forObject: any;
  }

  export function save<A> (name: string, animation: AnimationInput<A>, options?: OptionsInput): void;

  export function saveGroup<A> (prefixOrOptions: string | SaveOptionsInput, animations: (() => void) | { [name: string]: AnimationInput<A> }): void;

  export function translate<A> (animation: AnimationInput<A>, mappings: { [fromAttribute: string]: string }, saveAs?: string, options?: OptionsInput, cache?: boolean): Animation<A>;

  export default function anim8<A, S> (subject: S): Animator<A, S>;
  export default function anim8s<A, S> (subject: S[]): Animators<A, S>;
  export default function m8<A, S> (subject: S): Animator<A, S>;
  export default function m8s<A, S> (subject: S[]): Animators<A, S>;

}
