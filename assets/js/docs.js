anim8.save('bottomBorderGrow', {
  tweenTo: {
    borderBottomWidth: 10,
    marginBottom: -9,
    borderColor: '#155799'
  },
  easings: {
    borderColor: 'linear'
  }
});

anim8.save('bottomBorderShrink', {
  tweenTo: {
    borderBottomWidth: 1,
    marginBottom: 0,
    borderColor: 'rgba(255,255,255,0.2)'
  }
});

anim8.save('undoTada', {
  tweenTo: {
    scale: 1,
    rotate: 0
  }
});

anim8.save('pulseWords', {
  values: {
    scale: [1, 1.1, 1],
    backgroundColor: ['#f3f6fa', '#383e41', '#f3f6fa'],
    color: ['#383e41', '#f3f6fa', '#383e41']
  }
});

var emphasis = ['bounce', 'flash', 'pulse', 'rubberBand', 'shake', 'swing', 'tada', 'wobble'];
var all = Object.keys(anim8.Animations);

function random(arr) {
  return arr[ Math.floor( arr.length * Math.random() ) ];
}
function restoreMe() {
  this.restore();
}
function restoreMeFadeIn() {
  this.restore();
  this.transition('fadeOut');
  this.queue('fadeIn');
  this.applyInitialState();
}
function getFinishedListener(animation) {
  return /out/.test( animation ) ? restoreMeFadeIn : restoreMe;
}
function exec(methodName) {
  return function(e) {
    anim8[ methodName ]();
    if (window.example) {
      window.example.frameElement.contentWindow.anim8[ methodName ]();
    }
  };
}

$(function() {

  // Buttons on enter/leave
  $('.btn').on('mouseenter', function() {
    var animator = anim8( this );
    animator.play('bottomBorderGrow 500, tada ~500 1.5s inf z3s linear');
  });

  $('.btn').on('mouseleave', function() {
    var animator = anim8( this );
    animator.stop().play('bottomBorderShrink 250 & undoTada');
  });

  // Title on hover
  var projectName = $('.project-name').sequence().animators();
  var projectNameSequence = projectName.sequence( 50, 'linear' );

  $('.project-name').on('mouseenter click', function() {
    if (!projectName.hasAttrimators()) {
      var animation = random( all );
      projectNameSequence.play( animation );
      projectName.once( 'finished', getFinishedListener( animation ) );
    }
  });

  // Subtitle
  $('.project-tagline')
    .sequence()
    .animators()
    .sequence(25, 'linear')
    .play('fadeInDown')
    .animators
    .applyInitialState()
  ;

  // Intro
  $('.intro .inline')
    .animators()
    .sequence('1s', 'linear')
    .play('pulseWords inf z10s linear')
    .animators
    .applyInitialState()
  ;

  // Global Commands
  $('.btn.pause').on( 'click', exec('pause') );
  $('.btn.resume').on( 'click', exec('resume') );
  $('.btn.stop').on( 'click', exec('stop') );
  $('.btn.end').on( 'click', exec('end') );
  $('.btn.finish').on( 'click', exec('finish') );
  $('.btn.nopeat').on( 'click', exec('nopeat') );

  // Example Descriptions
  $('[data-for]').each(function() {
    var $e = $(this);
    var $link = $('[href="' + $e.data('for') + '"]');

    $e.hide();
    $link.click(function() {
      $('[data-for]').hide();
      $('[target].active').removeClass('active');
      $e.show();
      $link.addClass('active');
    });

    if ($link.hasClass('active')) {
      $link.click();
    }
  });

  // Example Button
  $('.btn.example').dataPlay('lookatme');
});
