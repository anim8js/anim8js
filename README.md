# anim8js
An animation library for javascript objects. 

**TODO:**

1. [X] Attach units to events instead of the Animator
2. [X] Add `follow(attribute, path[, duration][, delay][, easing][, repeat][, sleep])` to Animator
3. [ ] Add `tweenTo(attribute, end[, duration][, delay][, easing][, repeat][, sleep])` to Animator
4. [ ] Add `tween(attribute, start, end[, duration][, delay][, easing][, repeat][, sleep])` to Animator
5. [ ] Add `transitionInto(transitionDuration, transitionOutDelta, transitionInDelta, transitionEasing, animation[, options][, all])` to Animator
6. [ ] Add option merging to Parser
7. [ ] Make anim8.Parser class
8. [ ] Make anim8.Calculator class
9. [ ] Move all dom functions to anim8.dom namespace
10. [ ] Figure out how to separate attributes for one animatable type to the next
11. [ ] Finish Document 
12. [ ] Create an animated splash page showcasing library
13. [X] Change Animator.eventsFor to return an array if a function was not provided
14. [X] Correct `anim8.isFunction`
15. [X] Add gravity to springs
16. [X] Allow reference values in path (they don't get copied - they point to an attribute in another Animator) - add `Animator.ref(attribute)`
17. [X] Add sequence to anim8 which has a delay between animations, an easing, the animation, and the list of animators. `anim8.sequence(delay, easing, animation[, options])`
18. [X] Remove anim8.parseValue
19. [ ] Animators can be removed from subject after X seconds of inactivity (default functionality). Add `anim8.free()`.
20. [X] Allow reference values in spring.
21. [ ] Add automatic rest & position determination to Springs which defaults to current Animator values.
22. [X] Complete Event.seek
23. [X] Styles are generated in DomAnimator.update and applied & cleared in DomAnimator.apply
24. [X] Add live mode (RAF constantly executes)
25. [X] If transition is called and not playing anything, treat as play
26. [X] If transition and partial play, delay new attributes by transitionTime
27. [X] Test true values
28. [ ] Add queue to anim8.Sequence
29. [ ] Add transition to anim8.Sequence
30. [ ] Add anim8.Movie?
31. [ ] Fix bug where one Animator partially plays another animators events