# anim8js
An animation library for javascript objects. 

**TODO:**

1. Attach units to events instead of the Animator
2. Add follow(path[, duration][, delay][, easing][, repeat][, sleep]) to Animator
3. Add tweenTo(end[, duration][, delay][, easing][, repeat][, sleep]) to Animator
3. Add tween(start, end[, duration][, delay][, easing][, repeat][, sleep]) to Animator
4. Add transitionInto(transitionDuration, transitionOutDelta, transitionInDelta, transitionEasing, animation[, options][, all]) to Animator
5. Add option merging to Parser
6. Make anim8.Parser class
7. Make anim8.Calculator class
8. Move all dom functions to anim8.dom namespace
9. Figure out how to separate attributes for one animatable type to the next
10. Finish Document 
11. Create an animated splash page showcasing library
12. Change Animator.eventsFor to return an array of a function was not provided
13. Correct anim8.isFunction
14. Add gravity to springs
15. Allow reference values in path (they don't get copied - they point to an attribute in another Animator) - add Animator.ref(attribute)
16. Add sequence to anim8 which has a delay between animations, an easing, the animation, and the list of animators. anim8.sequence(delay, easing, animation[, options])
