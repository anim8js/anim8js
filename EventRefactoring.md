anim8.setTime = function(animator, pos, vel, acc, time)
{
  var calc = anim8.calculator('2d');

  // P = P0 + V0 * t + A * t^2

  var temp = calc.clone( pos );
  temp = calc.adds( temp, vel, time );
  temp = calc.adds( temp, acc, time * time );

  animator.set({
    center: temp
  });
};