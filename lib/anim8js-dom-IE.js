
anim8.matrix = {
  
  identity: function() {
    return {
      m11: 1.0, m12: 0.0, m21: 0.0, m22: 1.0, dx: 0.0, dy: 0.0
    };
  },
  
  multiply: function(a, b) {
    var out = identity(); 
    out.m11 = (a.m11 * b.m11) + (a.m12 * b.m21);
		out.m22 = (a.m21 * b.m12) + (a.m22 * b.m22);
		out.m21 = (a.m21 * b.m11) + (a.m22 * b.m21);
		out.m12 = (a.m11 * b.m12) + (a.m12 * b.m22);
		out.dx = (a.dx * b.m11) + (a.dy * b.dx) + b.dx;
		out.dy = (a.dx * b.m12) + (a.dy * b.dy) + b.dy;
    return out;
  },
  
  rotate: function(degrees) {
    var radians = degrees * Math.PI / 180.0;
    var cos = Math.cos( radians );
    var sin = Math.sin( radians );
    var out = identity();          
    out.m11 = cos;
    out.m12 = sin;
    out.m21 = -sin;
    out.m22 = cos;
    return out;
  },
  
  scale: function(scaleX, scaleY) {
    var out = identity();          
    out.m11 = scaleX;
    out.m22 = scaleY;
    return out;
  },
  
  translate: function(dx, dy) {
    var out = identity();          
    out.dx = dx;
    out.dy = dy;
    return out;
  }
  
};

var iematrix = function(e, frame)
{
  var w = e.offsetWidth;
  var h = e.offsetHeight;
  
  var scales      = anim8.isDefined(frame.scale) || anim8.isDefined(frame.scaleX) || anim8.isDefined(frame.scaleY);
  var translates  = anim8.isDefined(frame.translateX) || anim8.isDefined(frame.translateY);
  var rotates     = anim8.isDefined(frame.rotate);
  
  if (scales || rotates || translates)
  {
    var centerX = anim8.coalesce(frame.anchorX, frame.anchor, 0.5) * w;
    var centerY = anim8.coalesce(frame.anchorY, frame.anchor, 0.5) * h;
    
    var matrix = anim8.matrix.identity();
    
    if (scales || rotates)
    { 
      matrix = anim8.matrix.multiply( matrix, anim8.matrix.translate( centerX, centerY ) );
    }
    
    if (scales)
    {
      var scaleX = anim8.coalesce(frame.scaleX, frame.scale, 1.0);
      var scaleY = anim8.coalesce(frame.scaleY, frame.scale, 1.0);
      
      matrix = anim8.matrix.multiply( matrix, anim8.matrix.scale( scaleX, scaleY ) );
    }
    
    if (rotates)
    {              
      matrix = multiply( matrix, anim8.matrix.rotate( frame.rotate ) );
    }
    
    if (scales || rotates)
    {
      matrix = multiply( matrix, anim8.matrix.translate( -centerX, -centerY ) );
    }
    
    if (translates)
    {
      matrix.dx += anim8.coalesce( frame.translateX, 0.0 );
      matrix.dy += anim8.coalesce( frame.translateY, 0.0 ); 
    }
    
    e.style['transform'] = 'matrix(' + matrix.m11 + ', ' + matrix.m12 + ', ' + matrix.m21 + ', ' + matrix.m22 + ', ' + matrix.dx + ', ' + matrix.dy + ')';
  }
};