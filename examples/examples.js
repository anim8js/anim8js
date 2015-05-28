function windowHeight()
{
  return window.innerHeight || document.documentElement.clientHeight;
}

function windowWidth()
{
  return window.innerWidth || document.documentElement.clientWidth;
}

function getRandomPoint()
{
  return {
    x: Math.random() * (windowWidth() - 100) + 50,
    y: Math.random() * (windowHeight() - 100) + 50 
  };
}
getRandomPoint.computed = true;

function getPageMouse(e)
{
  var ev = e || window.event;

  if ( ev.changedTouches && ev.changedTouches.length > 0 )
  {
    return {
      x: ev.changedTouches[0].pageX,
      y: ev.changedTouches[0].pageY
    };
  }

  if ( typeof ev.pageX === 'undefined' ) 
  {
    return {
      x: ev.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
      y: ev.clientY + document.body.scrollTop + document.documentElement.scrollTop
    };
  }

  return {
    x: ev.pageX || 0,
    y: ev.pageY || 0
  };
}

function getClientMouse(e)
{
  var ev = e || window.event;

  if ( ev.changedTouches && ev.changedTouches.length > 0 )
  {
    return {
      x: ev.changedTouches[0].clientX,
      y: ev.changedTouches[0].clientY
    };
  }

  return {
    x: ev.clientX || 0,
    y: ev.clientY || 0
  };
}

function getOffsetMouse(e)
{
  var ev = e || window.event;
  var client = getClientMouse( e );
  var target = ev.target || ev.srcElement;
  var bounds = target.getBoundingClientRect();
  var style = target.currentStyle || window.getComputedStyle(target, null);
  var borderLeftWidth = parseInt(style['borderLeftWidth'], 10);
  var borderTopWidth = parseInt(style['borderTopWidth'], 10);
  
  return {
    x: client.x - borderLeftWidth - bounds.left,
    y: client.y - borderTopWidth - bounds.top
  };
}

function $listen(object, type, callback)
{
  var listener = function(e)
  {
    var ev = e || window.event;
    var mouse = getPageMouse( ev );

    callback( mouse, ev, type );
  };

  try
  {
    object.addEventListener( type, listener, false );
  }
  catch (e)
  {
    object.attachEvent( 'on' + type, listener );
  }
  finally
  {
    try
    {
      object['on' + type] = listener;
    }
    catch(die)
    {
      alert('Use a decent browser.');
      location.href = 'http://www.mozilla.org/en-US/firefox/new/';
    }
  }
}

/* Mouse Movement, whether you want it or not */

function MousePosition() 
{
  return {
    x: MousePosition.x,
    y: MousePosition.y
  };
}
MousePosition.x = MousePosition.y = 0;

var updateMouse = function(mouse)
{
  MousePosition.x = mouse.x;
  MousePosition.y = mouse.y;
};

$listen( document, 'mousemove', updateMouse );
$listen( document, 'touchmove', updateMouse );

function MouseClicked()
{
  return {
    x: MouseClicked.x,
    y: MouseClicked.y
  };
}
MouseClicked.x = MouseClicked.y = 0;

var updateMouseClicked = function(mouse)
{
  MouseClicked.x = mouse.x;
  MouseClicked.y = mouse.y;
};

$listen( document, 'click', updateMouseClicked );
$listen( document, 'touchstart', updateMouseClicked );