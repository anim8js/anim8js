
var Springs = {};

/**
 * Register the spring builder.
 *
 * @param {Object}
 * @return {SpringDistance}
 */
Springs['distance'] = function(spring)
{
  return new SpringDistance(
    spring.attribute,
    spring.calculator,
    coalesce( spring.position, true ),
    coalesce( spring.rest, true ),
    spring.distance,
    spring.damping,
    spring.stiffness,
    spring.velocity,
    spring.gravity,
    spring.finishOnRest
  );
};

/**
 * Register the spring builder.
 *
 * @param {Object}
 * @return {SpringLinear}
 */
Springs['linear'] = function(spring)
{
  return new SpringLinear(
    spring.attribute,
    spring.calculator,
    coalesce( spring.position, true ),
    coalesce( spring.rest, true ),
    spring.damping,
    spring.stiffness,
    spring.velocity,
    spring.gravity,
    spring.finishOnRest
  );
};
