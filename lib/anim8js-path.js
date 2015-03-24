anim8.path = function(path)
{
  if ( path instanceof anim8.Path )
  {
    return path;
  }
  if ( anim8.isString( path ) && path in anim8.path )
  {
    return anim8.path[ spring ];
  }
  if ( anim8.isObject( path ) && path.type in anim8.path )
  {
    return anim8.path[ path.type ]( path );
  }
  
  return false;
};


anim8.Path = function()
{
};

anim8.Path.prototype = 
{
  reset: function(name, calculator, points)
  {
    this.name = name;
    this.calculator = anim8.calculator( calculator );
    this.points = points;
    this.trues = this.hasTrue();
  },
  compute: function(out, delta) 
	{
    return out;
  },
  hasTrue: function() 
	{
    var ps = this.points;
    
    for (var i = 0; i < ps.length; i++) 
    {
      if (ps[i] === true) 
      {
        return true;
      }
    }
    return false;
  },
  reference: function() 
	{
    return this.trues ? this.copy() : this;
  },
  last: function()
  {
    return this.points[ this.points.length - 1 ];
  },
  first: function()
  {
    return this.points[ 0 ];
  },
  point: function(i)
  {
    return this.points[ i ];
  },
  resolvePoint: function(i)
  {
    var p = this.points[ i ];
    
    if ( anim8.isFunction( p ) )
    {
      p = p();
    }
    
    return p;
  }
};





anim8.DeltaPath = function(name, calculator, points, deltas) 
{
  this.reset( name, calculator, points );
  this.deltas = deltas;
};

anim8.DeltaPath.prototype = new anim8.Path();

anim8.DeltaPath.prototype.compute = function(out, delta) 
{
  var ds = this.deltas;
  var end = ds.length - 2;
  var i = 0;
  while (ds[i + 1] < delta && i < end) i++;
  var d0 = ds[i];
  var d1 = ds[i + 1];
  var pd = (delta - d0) / (d1 - d0);
  var p0 = this.resolvePoint( i );
  var p1 = this.resolvePoint( i + 1 );
  
  return this.calculator.interpolate( out, p0, p1, pd );
};
  
anim8.DeltaPath.prototype.copy = function() 
{
    return new anim8.DeltaPath( this.name, anim8.copy(this.points), anim8.copy(this.deltas), this.calculator );
};

anim8.path.delta = function(path)
{
  var calc = anim8.calculator( path.calculator );
  
  if (!path.deltas)
  {
    path.deltas = [];
    
    for (var i = 0; i < path.points.length; i++)
    {
      path.deltas[ i ] = i / ( path.points.length - 1 );
    }
  }

  for (var i = 0; i < path.points.length; i++)
  {
    path.points[ i ] = calc.parse( path.points[i] );
  }
  
  return new anim8.DeltaPath(
    path.name,
    calc,
    path.points,
    path.deltas
  );
};



anim8.PointPath = function(name, calculator, point)
{
  this.reset( name, calculator, [point] );
};

anim8.PointPath.prototype = new anim8.Path();

anim8.PointPath.prototype.compute = function(out, delta)
{
  return this.calculator.copy( out, this.resolvePoint( 0 ) );
};
  
anim8.PointPath.prototype.copy = function() 
{
  return new anim8.PointPath( this.name, this.calculator, this.points[0] );
};

anim8.path.point = function(path)
{
  var calc = anim8.calculator( path.calculator );
  
  return new anim8.PointPath(
    path.name,
    calc,
    calc.parse( path.point )
  );
};



anim8.KeyframePath = function(name, calculator, points, deltas, easings) 
{
  this.reset( name, calculator, points );
  this.deltas = deltas;
  this.easings = easings;
};

anim8.KeyframePath.prototype = new anim8.Path();

anim8.KeyframePath.prototype.compute = function(out, delta) 
{  
  var ds = this.deltas;
  var end = ds.length - 2;
  
  if ( delta < ds[0] ) {
    return false;
  }
  
  if ( delta > ds[ds.length - 1] ) {
    return this.points[ds.length - 1];
  }
  
  var i = 0;
  while (ds[i + 1] < delta && i < end) i++;
  var d0 = ds[i];
  var d1 = ds[i + 1];
  var pd = (delta - d0) / (d1 - d0);
  var p0 = this.resolvePoint( i );
  var p1 = this.resolvePoint( i + 1 );
  var ea = this.easings[i];
  
  return this.calculator.interpolate( out, p0, p1, ea( pd ) );
};
  
anim8.KeyframePath.prototype.copy = function() 
{
  return new anim8.KeyframePath( this.name, this.calculator, anim8.copy(this.points), anim8.copy(this.deltas), anim8.copy(this.easings) );
};

anim8.path.keyframe = function(point)
{
  var calc = anim8.calculator( path.calculator );
  
  if (!path.deltas)
  {
    path.deltas = [];
    
    for (var i = 0; i < path.points.length; i++)
    {
      path.deltas[ i ] = i / ( path.points.length - 1 );
    }
  }
  
  var defaultEasing = anim8.easing( path.easings, true );
  
  if ( !anim8.isDefined( path.easings ) || !anim8.isArray( path.easings ) || defaultEasing !== null )
  {
    path.easings = [];
    
    for (var i = 0; i < path.points.length; i++)
    {
      path.easings[ i ] = defaultEasing;
    }
  }
  
  for (var i = 0; i < path.easings.length; i++)
  {
    path.easings[ i ] = anim8.easing( path.easings[ i ] );
  }
  
  for (var i = 0; i < path.points.length; i++)
  {
    path.points[ i ] = calc.parse( path.points[i] );
  }
  
  return new anim8.KeyframePath(
    path.name,
    calc,
    path.points,
    path.deltas,
    path.easings
  );
};




anim8.CubicPath = function(name, calculator, p0, p1, p2, p3)
{
  this.reset( name, calculator, [p0, p1, p2, p3] );
};

anim8.CubicPath.prototype = new anim8.Path();

anim8.CubicPath.prototype.compute = function(out, d1)
{
  var calc = this.calculator;
  var d2 = d1 * d1;
  var d3 = d1 * d2;
  var i1 = 1 - d1;
  var i2 = i1 * i1;
  var i3 = i1 * i2;
  
  out = calc.copy( out, this.resolvePoint( 0 ) );
  out = calc.scale( out, i3 );
  out = calc.adds( out, this.resolvePoint( 1 ), 3 * i2 * d1 );
  out = calc.adds( out, this.resolvePoint( 2 ), 3 * i1 * d2 );
  out = calc.adds( out, this.resolvePoint( 3 ), d3 );
  
  return out;
};
  
anim8.CubicPath.prototype.copy = function() 
{
  return new anim8.CubicPath( this.name, this.calculator, this.points[0], this.points[1], this.points[2], this.points[3] );
};

anim8.path.cubic = function(path)
{
  var calc = anim8.calculator( path.calculator );
  
  return new anim8.CubicPath(
    path.name,
    calc,
    calc.parse( path.p0 ),
    calc.parse( path.p1 ),
    calc.parse( path.p2 ),
    calc.parse( path.p3 )
  );
};




anim8.QuadraticPath = function(name, calculator, p0, p1, p2)
{
  this.reset( name, calculator, [p0, p1, p2] );
};

anim8.QuadraticPath.prototype = new anim8.Path();

anim8.QuadraticPath.prototype.compute = function(out, d1)
{
  var calc = this.calculator;
  var d2 = d1 * d1;
  var i1 = 1 - d1;
  var i2 = i1 * i1;
  
  out = calc.copy( out, this.resolvePoint( 0 ) );
  out = calc.scale( out, i2 );
  out = calc.adds( out, this.resolvePoint( 1 ), 2 * i1 * d1 );
  out = calc.adds( out, this.resolvePoint( 2 ), d2 );
    
  return out;
};
  
anim8.QuadraticPath.prototype.copy = function() 
{
  return new anim8.QuadraticPath( this.name, this.calculator, this.points[0], this.points[1], this.points[2] );
};

anim8.path.quadratic = function(path)
{
  var calc = anim8.calculator( path.calculator );
  
  return new anim8.QuadraticPath(
    path.name,
    calc,
    calc.parse( path.p0 ),
    calc.parse( path.p1 ),
    calc.parse( path.p2 )
  );
};



anim8.CompiledPath = function(name, path, pointCount)
{
  var calc = path.calculator;
  var points = [];
  
  for (var i = 0; i < pointCount; i++)
  {
    points.push( path.compute( calc.create(), i / (pointCount - 1) ) );
  }
  
  this.reset( name, calc, points );
};

anim8.CompiledPath.prototype = new anim8.Path();

anim8.CompiledPath.prototype.compute = function(out, delta)
{
  var a = Math.floor( delta * this.points.length );
  var index = Math.min( a, this.points.length - 1 );
  
  return this.calculator.copy( out, this.resolvePoint( index ) );
};
  
anim8.CompiledPath.prototype.copy = function() 
{
  return new anim8.CompiledPath( this.name, this, this.points.length );
};

anim8.path.compiled = function(path)
{
  return new anim8.CompiledPath(
    path.name,
    anim8.path( path.path ),
    path.pointCount
  );
};





anim8.Tween = function(name, calculator, start, end)
{
  this.reset( name, calculator, [start, end] );
};

anim8.Tween.prototype = new anim8.Path();

anim8.Tween.prototype.compute = function(out, delta)
{
  return this.calculator.interpolate( out, this.resolvePoint( 0 ), this.resolvePoint( 1 ), delta );
};
  
anim8.Tween.prototype.copy = function() 
{
    return new anim8.Tween( this.name, this.calculator, this.points[0], this.points[1] );
};

anim8.path.tween = function(path)
{
  var calc = anim8.calculator( path.calculator );
  
  return new anim8.Tween(
    path.name, 
    calc,
    calc.parse( path.start ),
    calc.parse( path.end )
  );
};




anim8.JumpPath = function(name, calculator, points)
{
  this.reset( name, calculator, points );
};

anim8.JumpPath.prototype = new anim8.Path();

anim8.JumpPath.prototype.compute = function(out, delta)
{
  var a = Math.floor( delta * this.points.length );
  var index = Math.min( a, this.points.length - 1 );
  
  return this.calculator.copy( out, this.resolvePoint( index ) );
};
  
anim8.JumpPath.prototype.copy = function() 
{
  return new anim8.JumpPath( this.name, this.calculator, anim8.copy(this.points) );
};

anim8.path.jump = function(path)
{
  var calc = anim8.calculator( path.calculator );
  
  for (var i = 0; i < path.points.length; i++)
  {
    path.points[ i ] = calc.parse( path.points[i] );
  }
  
  return new anim8.JumpPath(
    path.name, 
    calc,
    path.points
  );
};

