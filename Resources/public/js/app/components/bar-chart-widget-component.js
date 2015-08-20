define(['d3', 'd3-tip', 'underscore'], function (d3, d3tip, _) {

  "use strict";

  var RATIO = 16 / 9,
      resizeBars = {};

  window.addEventListener('resize', _.debounce(function(){
    for(var key in resizeBars) {
      if(resizeBars.hasOwnProperty(key)){
        resizeBars[key]();
      }
    }
  }, 100), false);

  return function (options) {

    var data = options.data,
        parent = options.parent.el,
        elem = options._sourceElement.get(0),
        plot = d3.select(elem);

    var w = elem.clientWidth,
        h = w / RATIO,
        margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = w - margin.left - margin.right,
        height = h - margin.top - margin.bottom;

    var svg = plot.append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("viewBox", "0 0 " + w + " " + h);

    var root = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(1);

    var tip = d3tip()
        .attr('class', 'diam-d3-tip tooltip top')
        .html(function(d) {
          return '<div class="tooltip-arrow"></div><div class="tooltip-inner">Tickets: <span>' + d.y + '</span></div>';
        });

    x.domain( data.map(function(d) { return d.x; }));
    y.domain([0, d3.max(data, function(d) { return d.y; })]);

    root.call(tip);

    root.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    root.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    root.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.x); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.y); })
        .attr("height", function(d) { return height - y(d.y); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    resizeBars[parent.id] = function () {
      var w = elem.clientWidth,
          h = w / RATIO,
          width = w - margin.left - margin.right,
          height = h - margin.top - margin.bottom;

      x.rangeRoundBands([0, width], .1);
      y.range([height, 0]);

      xAxis.scale(x);
      yAxis.scale(y);

      svg.attr("viewBox", "0 0 " + w + " " + h);

      svg.select('.x.axis')
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.select('.y.axis')
          .call(yAxis);

      svg.selectAll(".bar")
          .attr("x", function(d) { return x(d.x); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.y); })
          .attr("height", function(d) { return height - y(d.y); });

    };

  };

});