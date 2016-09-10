
  // Add events to the animation cycle: begin, end, finished, starting
  eventize( anim8 );

  // anim8.js
  anim8.anim8s = anim8s;
  anim8.fn = Animator.prototype;
  anim8s.fn = Animators.prototype;
  anim8.isRunning = isRunning;
  anim8.isLive = isLive;
  anim8.setLive = setLive;
  anim8.animating = animating;
  anim8.requestRun = requestRun;
  anim8.activateAnimator = activateAnimator;
  anim8.pushAnimator = pushAnimator;
  anim8.activate = activate;
  anim8.run = run;
  anim8.pause = pause;
  anim8.resume = resume;
  anim8.stop = stop;
  anim8.end = end;
  anim8.finish = finish;
  anim8.nopeat = nopeat;

  // Core
  anim8.noop = noop;
  anim8.isDefined = isDefined;
  anim8.isFunction = isFunction;
  anim8.isNumber = isNumber;
  anim8.isBoolean = isBoolean;
  anim8.isString = isString;
  anim8.isArray = isArray;
  anim8.isObject = isObject;
  anim8.isEmpty = isEmpty;
  anim8.now = now;
  anim8.trim = trim;
  anim8.toArray = toArray;
  anim8.copy = copy;
  anim8.extend = extend;
  anim8.coalesce = coalesce;
  anim8.constant = constant;
  anim8.resolve = resolve;
  anim8.id = id;
  anim8.Class = Class;
  anim8.Defaults = Defaults;

  // Math
  anim8.clamp = clamp;
  anim8.gcd = gcd;
  anim8.choose = choose;

  // Registries
  anim8.Animations = Animations;
  anim8.Calculators = Calculators;
  anim8.Factories = Factories;
  anim8.Builders = Builder;
  anim8.Paths = Paths;
  anim8.Springs = Springs;
  anim8.Easings = Easings;
  anim8.EasingTypes = EasingTypes;
  anim8.Options = Options;
  anim8.Transitions = Transitions;

  // Parsing
  anim8.animation = $animation;
  anim8.attrimatorsFor = $attrimatorsFor;
  anim8.calculator = $calculator;
  anim8.delay = $delay;
  anim8.duration = $duration;
  anim8.easing = $easing;
  anim8.easingType = $easingType;
  anim8.factory = $factory;
  anim8.factoryFor = $factoryFor;
  anim8.number = $number;
  anim8.offset = $offset;
  anim8.options = $options;
  anim8.builder = $builder;
  anim8.path = $path;
  anim8.repeat = $repeat;
  anim8.scale = $scale;
  anim8.sleep = $sleep;
  anim8.spring = $spring;
  anim8.time = $time;
  anim8.transition = $transition;

  // Modules
  // - color.js
  anim8.Color = Color;
  // - computed.js
  anim8.computed = computed;
  anim8.isComputed = isComputed;
  // - dynamic.js
  anim8.composite = composite;
  anim8.partial = partial;
  anim8.spread = spread;
  // - eventize.js
  anim8.eventize = eventize;
  // - save.js
  anim8.save = save;
  anim8.saveGroup = saveGroup;
  anim8.SaveOptions = SaveOptions;
  // - translate.js
  anim8.translate = translate;
  // - param.js
  anim8.param = param;
  anim8.paramFactory = paramFactory;
  anim8.paramCalculator = paramCalculator;
  anim8.paramResolve = paramResolve;
  anim8.Parameters = Parameters;

  // Classes
  anim8.Aninmation = Animation;
  anim8.Animator = Animator;
  anim8.Animators = Animators;
  anim8.Attrimator = Attrimator;
  anim8.AttrimatorMap = AttrimatorMap;
  anim8.Calculator = Calculator;
  anim8.Defer = Defer;
  anim8.DeferAnimator = DeferAnimator;
  anim8.Event = Event;
  anim8.EventState = EventState;
  anim8.Factory = Factory;
  anim8.FastMap = FastMap;
  anim8.Oncer = Oncer;
  anim8.Builder = Builder;
  anim8.Path = Path;
  anim8.Physics = Physics;
  anim8.Sequence = Sequence;
  anim8.Spring = Spring;

  // Movie
  anim8.Movie = Movie;
  anim8.MoviePlayer = MoviePlayer;
  anim8.MovieTimeline = MovieTimeline;

  // Calculators
  anim8.Calculator2d = Calculator2d;
  anim8.Calculator3d = Calculator3d;
  anim8.CalculatorNumber = CalculatorNumber;
  anim8.CalculatorQuaternion = CalculatorQuaternion;
  anim8.CalculatorRGB = CalculatorRGB;
  anim8.CalculatorRGBA = CalculatorRGBA;
  anim8.CalculatorString = CalculatorString;

  // Factories
  anim8.object = object;
  anim8.FactoryObject = FactoryObject;

  // Builders
  anim8.BuilderAnd = BuilderAnd;
  anim8.BuilderDeltas = BuilderDeltas;
  anim8.BuilderFinal = BuilderFinal;
  anim8.BuilderInitial = BuilderInitial;
  anim8.BuilderKeyframe = BuilderKeyframe;
  anim8.BuilderMove = BuilderMove;
  anim8.BuilderPath = BuilderPath;
  anim8.BuilderPhysics = BuilderPhysics;
  anim8.BuilderQueue = BuilderQueue;
  anim8.BuilderSpring = BuilderSpring;
  anim8.BuilderTravel = BuilderTravel;
  anim8.BuilderTweenFrom = BuilderTweenFrom;
  anim8.BuilderTweenTo = BuilderTweenTo;

  // Paths
  anim8.PathBasisSpline = PathBasisSpline;
  anim8.PathBezier = PathBezier;
  anim8.PathCatmullRom = PathCatmullRom;
  anim8.PathCombo = PathCombo;
  anim8.PathCompiled = PathCompiled;
  anim8.PathCubic = PathCubic;
  anim8.PathDelta = PathDelta;
  anim8.PathHermite = PathHermite;
  anim8.PathJump = PathJump;
  anim8.PathKeyframe = PathKeyframe;
  anim8.PathLinear = PathLinear;
  anim8.PathParametric = PathParametric;
  anim8.PathQuadratic = PathQuadratic;
  anim8.PathQuadraticCorner = PathQuadraticCorner;
  anim8.PathSub = PathSub;
  anim8.PathUniform = PathUniform;
  anim8.PathTween = Tween;

  // Springs
  anim8.SpringDistance = SpringDistance;
  anim8.SpringLinear = SpringLinear;

  return anim8;

}));
