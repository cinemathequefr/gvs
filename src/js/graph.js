var graph = (function () {
  var elContainer;
  var data = {};
  var width, height;
  var force;
  var vis;
  var link, node;

  function init(_elContainer, _data) {
    var g;
    elContainer = _elContainer;
    data.nodes = _data;
    data.links = getLinks(data.nodes);

    width = window.innerWidth;
    height = window.innerHeight;

    vis = d3.select(elContainer)
      .attr("width", width)
      .attr("height", height);

    link = vis.selectAll(".link").data(data.links); // D3 Selection
    node = vis.selectAll(".node").data(data.nodes); // D3 Selection

    force = d3.layout.force()
      .charge(-200)
      .linkDistance(200)
      .gravity(0.035)
      .size([ width, height ])
      .nodes(data.nodes)
      .links(data.links)
      .start()
      .on("tick", function () {
        link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
        node.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
      });

    link.enter()
      .append("line")
      .attr("class", "link");

    g = node.enter()
      .append("g")
      .attr("class", "node");

    g.append("circle")
      // .attr("r", 9)
      .on("click", function (d) {
        $.publish("click", d);
        shake();
        update(d);
      });


    g.append("text")
      .text(function (d) { return d.name; })
      .on("click", function (d) {
        $.publish("click", d);
        shake();
        update(d);
      });

    node.call(force.drag);
    update();
  }


  function on() {}

  function shake() {
    force.alpha(Math.max(force.alpha(), 0.2));
  }

  function update(focusNode) {
    focusNode = focusNode || _.find(data.nodes, { level: 0 });


    // TEST
    // node
    // .filter(function (d) { return d.id === 16 })
    // .each(function (d) {
    //   isChild(d, focusNode);
    // });


    node.select("circle")
      .transition().duration(500)
      .attr("r", function (d) {
        if (focusNode.level === 0) {
          return [12, 9, 6][d.level];
        } else {
          if (isOnSameBranch(focusNode, d)) {
            return [12, 9, 12][d.level];
          } else {
            return [12, 9, 6][d.level];
          }
        }
      })
      .attr("class", function (d) {
        if (focusNode.level === 0) {
          return ["d3", "d2b", "d1"][d.level];
        } else {
          if (isOnSameBranch(focusNode, d)) {
            return ["d3", "d2b", "d3"][d.level];
          } else {
            return ["d3", "d2", "d1"][d.level];
          }
        }
      });

    node.select("text")
      .attr("class", function (d) {
        if (focusNode.level === 0) {
          return ["d3", "d2b", "d1"][d.level];
        } else {
          if (isOnSameBranch(focusNode, d)) {
            return ["d3", "d2b", "d3"][d.level];
          } else {
            return ["d3", "d2", "d1"][d.level];
          }
        }
      });






  }


  // Private functions

  function getLinks(data) { // See: https://github.com/mbostock/d3/wiki/Force-Layout#links
    return _(data)
      .filter("children")
      .map(function (source, i) {
        return _.map(source.children, function (target) {
          return {
            source: i,
            target: _.findIndex(data, { id: target }) // WARNING: as is, the force layout will crash if the `children` array references non-existing nodes
          };
        });
      })
      .flatten()
      .value();
  }

  function isChild(n1, n2) { // Is n1 a direct child of n2?
    return (_.isUndefined(n2.children) ? false : _.indexOf(n2.children, n1.id) > -1);
  }

  function parent(n1) {
    return _(data.nodes).find(function (n) { return isChild(n1, n) });
  }

  function level1(n1) {
    return [null, n1, parent(n1)][n1.level];
  }

  function isOnSameBranch(n1, n2) {
    return (level1(n1) === level1(n2));
  }



  return {
    init: init,
    on: on,
    shake: shake,
    update: update
  };


})();







/*
var graph = (function () {
  var width;
  var height;
  var data = {};
  var force;
  var svg;
  var elContainer;


  function init(_elContainer, _data) {
    elContainer = _elContainer;
    data.nodes = _data;
    data.links = getLinks(data.nodes);

    width = window.innerWidth;
    height = window.innerHeight;

    force = d3.layout.force()
      .charge(-200)
      .linkDistance(200)
      .gravity(0.035)
      .size([ width, height ]);

    svg = d3.select(elContainer)
      .attr("width", width)
      .attr("height", height);

    force
      .nodes(data.nodes)
      .links(data.links)
      .start();

    update();

  }


  function on(event, callback) {
    $.subscribe(event, callback);
  }


  function shake() {
    force.alpha(Math.max(force.alpha(), 0.2));
  }


  function update(focusNode) {
    var link = svg.selectAll(".link").data(data.links);
    var node = svg.selectAll(".node").data(data.nodes);
    var nodeGroup;

    focusNode = focusNode || _.find(data.nodes, { level: 0 }); // Default: the "root" node

    // svg.attr("class", "atLevel" + focusNode.level);
    if (focusNode.level < 2) svg.attr("class", "atLevel" + focusNode.level);

    // Begin Enter
    link.enter()
    .append("line")
    .attr("class", function (d) { return "link level" + d.target.level; }); // http://stackoverflow.com/questions/17452453/how-can-i-use-d3-classed-selection-to-have-name-as-function

    nodeGroup = node.enter()
      .append("g")
      .attr("class", function (d) { return "node level" + d.level; })
      .call(force.drag);

    nodeGroup.append("circle")
      .attr("r", function (d) { return getRadius(0)[d.level]; })
      .on("click", function (d) {
        $.publish("click", d);
        shake();
        update(d);
      });

    nodeGroup.append("text")
      .text(function (d) { return d.name; })
      .attr("y", function (d) { return [25, 25, 25][d.level] })
      .on("click", function (d) {
        $.publish("click", d);
        shake();
        update(d);
      });
    // End enter

    if (focusNode.level === 1) {
      var children = node.filter(function (d) { return _.indexOf(focusNode.children, d.id) > -1; });
      node.classed("on", false);
      children.classed("on", true);
    }

    force.on("tick", function() {

      link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

      node
      .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

    });

  }


  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    // Do something
  }




  // Private functions
  function getLinks(data) { // See: https://github.com/mbostock/d3/wiki/Force-Layout#links
    return _(data)
      .filter("children")
      .map(function (source, i) {
        return _.map(source.children, function (target) {
          return {
            source: i,
            target: _.findIndex(data, { id: target })
          };
        });
      })
      .flatten()
      .value();
  }

  function getRadius(level) {
    if (level === 0) return [10, 7, 5];
    if (level === 1) return [10, 10, 7];
  }

  return {
    init: init,
    on: on,
    shake: shake,
    update: update
  };
})();
*/