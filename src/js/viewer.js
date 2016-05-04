var viewer = (function () {

  var isOpen = false;
  var scaleRatio = 40;
  var duration = 350;
  var node = {};
  var template;
  var $viewer;
  var $viewerClose;
  var $viewerContent;

  function init(_$viewer, templateString) {
    $viewer = _$viewer;
    template = _.template(templateString);
    $viewer.css({ width: "0px", height: "0px" });
    $viewer.append("<div class='viewerContent'></div><div class='viewerClose'></div>");
    $viewerContent = $viewer.children(".viewerContent");
    $viewerClose = $viewer.children(".viewerClose").hide();
    $viewer.perfectScrollbar({
      suppressScrollX: true,
      wheelSpeed: 3
    });          
  }


  function on(event, callback) {
    $.subscribe(event, callback);
  }


  function open(_node) {
    node = _node;
    if (isOpen === true) return;
    if (node.level !== 2) return;
    $viewer.css({ top: node.y + "px", left: node.x + "px" });

    window.setTimeout(function () { // Important: timeout allows top/left position to be properly set before transitioning
      $viewer.css({
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        "transition-duration": duration + "ms",
        "transition-timing-function": "cubic-bezier(0.420, 0.000, 0.580, 1.000)"
      })
      .one("transitionend", function () {
        $viewerContent.append(template(node));

        $viewer.css({ "transition-duration": 0 }); // Important to prevent $viewer animation on window resize
        $viewer.scrollTop(0).perfectScrollbar("update");

        $viewerClose.show();
        $viewerClose.one("click", close);
        $(document).on("keydown", function(e) {
          if (e.which === 27) {
            $(document).off("keydown");
            $viewerClose.addClass("on");
          }
        });
        $(document).on("keyup", function (e) { // Close with Escape key
          if (e.which  === 27) {
            $(document).off("keyup");
            $viewerClose.removeClass("on");
            close();
          }
        });

        isOpen = true;
      });
    }, 1);
  }

  function close() {
    if (isOpen === false) return;
    $viewerClose.hide();
    $viewerContent.empty();
    $viewer
    .css({
      top: node.y + "px",
      left: node.x + "px",
      width: 0,
      height: 0,
      "transition-duration": duration + "ms",
      "transition-timing-function": "cubic-bezier(0.420, 0.000, 0.580, 1.000)"
    })
    .one("transitionend", function () {
      isOpen = false;
      $.publish("viewer.close");
    });
  }

  return {
    close: close,
    init: init,
    on: on,
    open: open
  };
})();