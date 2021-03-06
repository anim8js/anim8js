# TODO

1. [X] Attach units to events instead of the Animator
2. [X] Add `follow(attribute, path[, duration][, delay][, easing][, repeat][, sleep])` to Animator
3. [X] Add `tweenTo(attribute, end[, duration][, delay][, easing][, repeat][, sleep])` to Animator
4. [X] Add `tween(attribute, start, end[, duration][, delay][, easing][, repeat][, sleep])` to Animator
5. [X] Add `transitionInto(transitionDuration, transitionOutDelta, transitionInDelta, transitionEasing, animation[, options][, all])` to Animator
6. [X] Add option merging to Parser
7. [X] Make anim8.Parser class
8. [X] Make anim8.Calculator class
9. [X] Move all dom functions to anim8.dom namespace
10. [X] Figure out how to separate attributes for one animatable type to the next (add attribute resolution to Factory?)
11. [X] Finish Document
12. [ ] Create an animated splash page showcasing library
13. [X] Change Animator.eventsFor to return an array if a function was not provided
14. [X] Correct `anim8.isFunction`
15. [X] Add gravity to springs
16. [X] Allow reference values in path (they don't get copied - they point to an attribute in another Animator) - add `Animator.ref(attribute)`
17. [X] Add sequence to anim8 which has a delay between animations, an easing, the animation, and the list of animators. `anim8.sequence(delay, easing, animation[, options])`
18. [X] Remove anim8.parseValue
19. [X] *cancelled* Animators can be removed from subject after X seconds of inactivity (default functionality). Add `anim8.free()`.
20. [X] Allow reference values in spring.
21. [X] Add automatic rest & position determination to Springs which defaults to current Animator values.
22. [X] Complete Event.seek
23. [X] Styles are generated in DomAnimator.update and applied & cleared in DomAnimator.apply
24. [X] Add live mode (RAF constantly executes)
25. [X] If transition is called and not playing anything, treat as play
26. [X] If transition and partial play, delay new attributes by transitionTime
27. [X] Test true values
28. [X] Add queue to anim8.Sequence
29. [X] Add transition to anim8.Sequence
30. [ ] Add anim8.Movie?
31. [X] Fix bug where one Animator partially plays another animators events
32. [X] Final parser events shouldn't be called on applyInitialState
33. [X] Add tween parser
34. [X] Add anim8.Factory
35. [X] Add factory to Animator
36. [X] Register springs with animator & factory (uses attributes to determine defaultValue and calculator)
37. [X] Add animation string parsing to anim8.animation. You can specify multiple with commas, which queues up the events
38. [X] Add time parsing in animation parsers for delay, duration, & sleep (and add default duration unit)
39. [X] Add anim8.fn/m8.fn and anim8s.fn/m8s.fn so users can add their own functions
40. [X] Refactor all arrays of events & Animator.events to new anim8.EventMap
41. [X] Add scale to Event when not 1 takes calculator from path and scales values
42. [X] Add priority to factory
43. [X] Add concept of animation cycles, which is a number you assign to events when they're placed on an EventMap. Initial state is automatically applied when a new animation cycle is started in placeEvent. Once a new animation cycle is hit, all events (checked up to next) are made active - this fixes the issue of infinite events being stopped on queue
44. [X] Add anim8.options which parses options, remove anim8.parseAnimationString
45. [X] Instead of delay/duration/sleep/repeat replacing the previous value, enable use to add or subtract from the existing value
46. [X] Add relative value parsing (similar to true) which adds/subtracts a value
47. [X] Add move parser
48. [X] Factory.attribute returns a resolved version of an attribute where calculator is instanceof anim8.Calculator, defaultValue is parsed, defaultUnit is present, and property is a reference (contains calculatorName, propertyName, name)
49. [X] Create super interface called AttributeAnimator which Event & Spring extend (update, isFinished, next, queue, timeRemaining())
50. [X] Create FastMap which has an array and a map of key to index. Use over object iteration.
51. [X] Add Event.setTime
52. [X] Add reverse & flip easing types
53. [X] Implement mixing relative and absolute values by passing a mask that's multiplied against the current value before adding the relativeAmount
54. [X] Add path length calculation given granularity (for curved paths)
55. [X] Consistently use bracket notation for adding things to registries
56. [X] Add anim8.transition parsing function, transitions now take objects or strings
57. [X] Option to cache parsed options & transition strings
58. [X] Infinite events stop when no more finite events exist in the same cycle and the next event is in the new current cycle
59. [X] Throw cycle start & end events, add functions to listen start/end of last animation added
60. [X] Add transitionSmooth which takes into account current velocity and velocity of the new event to provide a seemless transition (req: 63)
61. [X] Add anim8.Physics : anim8.AttributeAnimator
62. [X] Replace object iteration with anim8.FastMap
63. [X] Refactor transition into a single method
64. [X] Replace calc.create() with calc.zero() where possible.
65. [X] Add endTime to attrimators
66. [X] Add tweenFrom parser
67. [X] Add physics parser
68. [X] Add spring parser
69. [X] Add anim8.computed.random
70. [X] Add travel parser which uses Physics to move to a target point at a constant velocity or acceleration
71. [X] EaselJS Plugin
72. [X] Pixi.js Plugin
73. [X] Add anim8.pause() & anim8.resume() as shorthand for anim8.animating.pause/resume()
74. [X] Test in IE
75. [X] Animator.move
76. [X] Animator.applyInitialState
77. [X] transform DOM property get logic
78. [X] Add tweenFrom & tweenFromMany to Animator
79. [X] Add easeType only parsing to anim8.easing
80. [X] Add nopeat to Animator & Attrimator
81. [X] Add & operator to anim8.animation parser which combines generated attrimators into single attrimator map
82. [X] Add @ operator to anim8.animation parser which defines an offset into the animation
83. [X] Add array parsing to calculator
84. [X] IE transform percent units
85. [X] Dom animator should parse units from tween, tweenTo, tweenManyTo, tweenMany tweenFrom, tweenManyFrom, move, moveMany
86. [X] Fix zIndex property
87. [X] Modify anim8.computed.current for DomAnimator to convert the current value (if it exists) into the desired unit. We need to keep track of the previous unit.
88. [X] Add attributes: textShadowX, textShadowY, textShadowBlur, textShadowColor, shadowX, shadowY, shadowBlur, shadowSpread, shadowColor, shadowInset,
89. [X] IE8 Tweening
90. [X] Pass attributes to property.unset
91. [X] Make anim8.Animators not extend Array
92. [X] anim8.eventize.off should only accept events, or none at all to remove all listeners
93. [X] queued animations applying initial state to early
94. [X] Fix transform clearing for IE
95. [X] jquery.html issue with origin being wrong (really short duration events) - setter attrimator needed
96. [ ] Investigate IE8 transform issues (see travel.html & animate.css.html) - scaling, rotation, & skewing are off.
97. [X] Refactor animation parsing logic. 
98. [ ] Add groupId (Number) to attrimators which tells what attrimators should be on the same animation cycle
99. [ ] Add mergeId (Number) to attrimators which tells option merging
100. [X] Add queue parser
101. [X] Add and parser
102. [X] Call start on attrimators in queue (or add prestart) 
103. [ ] When duration is merged on attrimators, any queued need to be additionaly delayed by the difference
104. [ ] If safari version < 7 or chrome version < 31, brightness is handled differently (0 being normal instead of 100). The math is also different, brightness is not additive - it scales between black (-100) and white (100).
105. [X] Make sure all calculator.parse calls passes a default value (Path parsing)
106. [X] Pass factory along when using and/queue parsers if not specified
107. [X] Pass units along when using and/queue parsers if not specified
108. [X] Add a method to anim8.computed which wraps a function and marks it as computed.