var bg = (function () {
  "use strict";
  var $bg;
  var imgs;
  var delay;
  var duration;
  var i = 0; // Current index on imgs
  var isRunning = false;

  // $_bg: jQuery selection of 2 containers
  // _imgs: array of img urls
  // _duration: duration of cross-fade
  function init(_$bg, _imgs, _delay, _duration) {
    $bg = _$bg;
    imgs = _imgs; // Array of image URLs (TODO: preload)
    duration = _duration || 1000;
    delay = _delay || 0;
    $bg.eq(1).hide();
    $bg.eq(0).css({
      backgroundImage: "url(" + imgs[i] + ")"
    });
  }

  function next() {
    if (isRunning === true) return;
    isRunning = true;

    window.setTimeout(function () {
      var nextImg = imgs[(i + 1) < imgs.length ? (i = i + 1) : i = 0];
      var $from = $bg.filter(":visible").eq(0);
      var $to = $bg.filter(":not(:visible)").eq(0);

      $to.css({
        backgroundImage: "url(" + nextImg + ")"
      }).fadeIn(duration);

      $from.fadeOut(duration, function () { isRunning = false; });

    }, delay);
  }

  return {
    init: init,
    next: next
  };
})();