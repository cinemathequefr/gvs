var main = (function () {
  "use strict";
  var elGraph = document.querySelector("svg#graph");

  d3.json("data/data.json", function (error, _data) {
    var data = normalizeCollection(_data, ["media"]);
    if (error) throw error;
    graph.init(elGraph, data);
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


/*
var main = (function () {
  "use strict";
  var templateString;
  var bgCycle = 0; // Counter for background changes

  var elBg = document.querySelectorAll(".bg");
  var elGraph = document.querySelector("svg#graph");
  var elViewer = document.querySelector("#viewer");

  _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
  // templateString = "<div class='title'><h1><span class='light'>Gus Van Sant&nbsp;+ </span>{{ name }}</h1></div><div class='left'><% _.forEach(media, function (m, i) { if (m.type === 'video') { %><div class='videoContainer'><iframe class='video' src='//player.vimeo.com/video/{{m.id}}' frameborder='0'></iframe></div><%  } else if (m.type === 'img') { %><img src='http://www.cinematheque.fr/expositions-virtuelles/gus-van-sant/img/items/{{ m.id }}.jpg' alt=''><% } }); %></div><div class='right'><div class='textContainer'>{{ text }}</div></div>";
  templateString = "<div class='title'><h1><span class='light'>Gus Van Sant&nbsp;+ </span>{{ name }}</h1></div><div class='left'><% _.forEach(media, function (m, i) { %><div class='mediaWrapper'><% if (m.type === 'video') { %><div class='videoContainer'><iframe class='video' src='//player.vimeo.com/video/{{m.id}}' frameborder='0'></iframe></div><%  } else if (m.type === 'img') { %><img src='http://www.cinematheque.fr/expositions-virtuelles/gus-van-sant/img/items/{{ m.id }}.jpg' alt=''><% } %><div class='caption'>{{ m.desc }}</div></div><% }); %></div><div class='right'><div class='textContainer'>{{ text }}</div></div>";

  d3.json("data/data.json", function (error, _data) {
    var data = normalizeCollection(_data, ["media"]);
    if (error) throw error;

    bg.init($(elBg), [
      "http://www.cinematheque.fr/expositions-virtuelles/gus-van-sant/img/sky/1.jpg",
      "http://www.cinematheque.fr/expositions-virtuelles/gus-van-sant/img/sky/2.jpg",
      "http://www.cinematheque.fr/expositions-virtuelles/gus-van-sant/img/sky/4.jpg",
      "http://www.cinematheque.fr/expositions-virtuelles/gus-van-sant/img/sky/3.jpg"
    ], 10000);

    viewer.init($(elViewer), templateString);
    graph.init(elGraph, data);

    graph.on("click", function (e, node) {
      if (node.level === 2) {
        // bgCycle = (bgCycle % 3 === 2 ? (window.setTimeout(bg.next, 5000), 0) : bgCycle + 1); // Change background after each 3 clicks on a node
        // bgCycle = (bgCycle % 1 === 0 ? (window.setTimeout(bg.next, 5000), 0) : bgCycle + 1); // Change background after each 3 clicks on a node
        cycle(1);
        viewer.open(node);
      }
    });
  });

  function cycle(n) { // Change background after each n clicks on a node
    bgCycle = (bgCycle % n === (n - 1) ? (window.setTimeout(bg.next, 5000), 0) : bgCycle + 1);
  };


  function normalizeCollection(collection, properties) {
    properties = properties || [];
    return _.map(collection, function(obj) {
      return _.assign({}, _.zipObject(properties, _.fill(Array(properties.length), null)), obj);
    });
  }
});

$(main);
*/