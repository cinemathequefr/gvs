var main = (function () {
  "use strict";
  var templateString;
  var elGraph = document.querySelector("svg#graph");
  var elBg = document.querySelectorAll(".bg");
  var elViewer = document.querySelector("#viewer");

  _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
  templateString = "<div class='title'><h1><span class='light'>Gus Van Sant&nbsp;+ </span>{{ name }}</h1></div><div class='left'><% _.forEach(media, function (m, i) { %><div class='mediaWrapper'><% if (m.type === 'video') { %><div class='videoContainer'><iframe class='video' src='//player.vimeo.com/video/{{m.id}}' frameborder='0'></iframe></div><%  } else if (m.type === 'img') { %><img src='http://www.cinematheque.fr/expositions-virtuelles/gus-van-sant/img/items/{{ m.id }}.jpg' alt=''><% } %><div class='caption'>{{ m.desc }}</div></div><% }); %></div><div class='right'><div class='textContainer'>{{ text }}</div></div>";

  d3.json("data/data.json", function (error, _data) {
    var data = normalizeCollection(_data, ["media"]);
    if (error) throw error;

    bg.init($(elBg), [
      "http://www.cinematheque.fr/expositions-virtuelles/gus-van-sant/img/sky/1.jpg",
      "http://www.cinematheque.fr/expositions-virtuelles/gus-van-sant/img/sky/2.jpg",
      "http://www.cinematheque.fr/expositions-virtuelles/gus-van-sant/img/sky/3.jpg",
      "http://www.cinematheque.fr/expositions-virtuelles/gus-van-sant/img/sky/4.jpg",
      "http://www.cinematheque.fr/expositions-virtuelles/gus-van-sant/img/sky/5.jpg",
      "http://www.cinematheque.fr/expositions-virtuelles/gus-van-sant/img/sky/6.jpg"
    ], 2500, 2000);

    viewer.init($(elViewer), templateString);
    graph.init(elGraph, data);


    // Event handling
    graph.on("graph.click", function (e, node) {
      if (node.level === 2) {
        window.location.hash = "#!/" + node.id;
      }
    });

    viewer.on("viewer.close", function () {
      bg.next();
      window.location.hash = "#!/";
    });


    // Routing
    // NOTE: not implemented: going from an open viewer to another one by manually changing the id the location hash
    Path.root("#!/");
    Path.map("#!/").to(function() {
      viewer.close();
    });
    Path.map("#!/").to(navigateGraph);
    Path.map("#!/credits").to(navigateCredits);
    Path.map("#!/:id").to(navigateViewer);
    Path.rescue(_.noop);
    Path.listen();

    function navigateCredits() {
      var node = _(data).find({ id: "credits" });
      graph.update(node);
      viewer.open(node);
    }

    function navigateGraph() {
      viewer.close();
    }

    function navigateViewer() {
      var id = parseInt(this.params.id, 10);
      var node = _(data).find({ id: id });
      if (_.isUndefined(node) || _.isUndefined(node.level) || node.level !== 2) {
        window.location.hash = "#!/";
      } else {
        graph.update(node);
        viewer.open(node);
      }
    }

  });

  function normalizeCollection(collection, properties) {
    properties = properties || [];
    return _.map(collection, function(obj) {
      return _.assign({}, _.zipObject(properties, _.fill(Array(properties.length), null)), obj);
    });
  }

  return;
})();

$(main);