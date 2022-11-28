'use strict'

let bars = ((data, data_map = {x:'category', y:'value'}, selector = '#bars-placeholder') => {

    ////////////////////////////////////
    //////////// svg setup /////////////
    ////////////////////////////////////

    var body = d3.select(selector)
    body.html("")

     // margins for SVG
    var margin = {
        left: 145,
        right: 145,
        top: 120,
        bottom: 110
    }

    // responsive width & height
    var svgWidth = 720
    var svgHeight = 713

    // helper calculated variables for inner width & height
    const height = svgHeight - margin.top - margin.bottom
    const width = svgWidth - margin.left - margin.right

    // add SVG
    d3.select(".bar-svg").remove();

    const svg = body.append('svg')
        .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
        .attr('class', 'bar-svg')
        .append('g')
        .attr('id','bar-group')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    ////////////////////////////////////
    //////////scroll observers//////////
    ////////////////////////////////////
    let stp = 1;
    let options = {
        root: null,
        rootMargin: "0px",
        threshold: [.75]
      };
        
        const start = document.querySelector('#start');

        const startObserver = new IntersectionObserver(handleStart, options);
    
        function handleStart(entry, observer) {
            if (entry[0].intersectionRatio > .75) {
                stp = 1
                update()
            }
        };
    
        startObserver.observe(start);

        const round = document.querySelector('#round');

        const roundObserver = new IntersectionObserver(handleRound, options);
    
        function handleRound(entry, observer) {
            if (entry[0].intersectionRatio > .75) {
                stp = 2
                update()
            }
        };

        roundObserver.observe(round);

        const scatter = document.querySelector('#scatter');

        const scatterObserver = new IntersectionObserver(handleScatter, options);
    
        function handleScatter(entry, observer) {
            if (entry[0].intersectionRatio > .75) {
                stp = 3
                update()
            }
        };

        scatterObserver.observe(scatter);

        const color = document.querySelector('#color');

        const colorObserver = new IntersectionObserver(handleColor, options);
    
        function handleColor(entry, observer) {
            if (entry[0].intersectionRatio > .75) {
                stp = 4
                update()
            }
        };

        colorObserver.observe(color);


    ////////////////////////////////////
    //////////////scales////////////////
    ////////////////////////////////////

    
// Add scales
var xScale = d3.scaleBand()
    .domain(data.map(function(d) { return d[data_map.x]; }))
    .rangeRound([0, width])
    .padding(0.1);

var yScale = d3.scaleLinear()
    .domain([0, 100])
    .rangeRound([height, 0]);

var colorScale = d3.scaleOrdinal()
.domain(data.map(function(d) { return d[data_map.x]; }))
.range(["#FBAF84","#7DC0C3","#7DC0C3","#FBAF84","#947BB6","#FBAF84","#7DC0C3"])

// Add x-axis
svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).tickValues([]));

svg
    .select('#x-axis .domain')
    .attr('stroke',0);

// Add y-axis
svg.append("g")
    .attr("id", "y-axis")
    .call(d3.axisLeft(yScale).tickValues([]));
    
svg
    .select('#y-axis .domain')
    .attr('stroke',0);

//add arrow to y-axis
svg.append("defs")
.append("marker")
.attr("id", "y-arrow")
.attr("markerWidth", 51)
.attr("markerHeight", 26)
.attr("refX", 25.4)
.attr("refY", 1)
.attr("orient", 0)
.attr("markerUnits", "strokeWidth")
.append("path")
.attr("d", 'M0.714844 25.4369L25.3881 0.763672L50.0613 25.4369')
.attr('fill','none').attr('stroke','#504E4E')

//add arrow to x-axis
svg.append("defs")
.append("marker")
.attr("id", "x-arrow")
.attr("markerWidth", 51)
.attr("markerHeight", 26)
.attr("refX", 25.4)
.attr("refY", 1)
.attr("orient", 90)
.attr("markerUnits", "strokeWidth")
.append("path")
.attr("d", 'M0.714844 25.4369L25.3881 0.763672L50.0613 25.4369')
.attr('fill','none').attr('stroke','#504E4E')

//draw split y-axis w/ label

svg
.append("line")
.attr('id','y-line')
.attr('y1',height+25)
.attr('y2',40)
.attr('x1',-20)
.attr('x2',-20)
.attr('stroke','#504E4E')
.attr('marker-end',"url(#y-arrow)");

svg
    .append("line")
    .attr('id','x-line')
    .attr('y1',height+25)
    .attr('y2',height+25)
    .attr('x1',-20)
    .attr('x2',width+40)
    .attr('stroke','#504E4E')
    .attr('marker-end',"url(#x-arrow)");

// Append rectangles
var rect_width = xScale.bandwidth()-3

var bar_rect = svg.selectAll(".bars")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d) {return xScale(d[data_map.x]);})
    .attr("y", function(d) { return yScale(d[data_map.y]); })
    .attr("width", rect_width)
    .attr("height", function(d) { return height - yScale(d[data_map.y]); })
    .attr("class", "bars")
    .attr('fill','#947BB6');

var bar_outline = svg.selectAll(".outline")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d) {return xScale(d[data_map.x]);})
    .attr("y", function(d) { return yScale(d[data_map.y]); })
    .attr("width", rect_width)
    .attr("height", function(d) { return height - yScale(d[data_map.y]); })
    .attr("class", "outline")
    .attr('fill','none')
    .attr('stroke','#504E4E')
    .attr('stroke-width',1)
    .style("stroke-dasharray", ("10, 10"))
    .style('opacity',0);


svg.append('image').attr('href','assets/Annotation.svg').attr('x',width*.695).attr('y',yScale(82)).attr('transform','scale(.75)')


    //scroll update function
    function update(val){

        if (stp == 1) {

            bar_rect.attr('rx',0).attr('width',rect_width)
            .attr("x", function(d) {return xScale(d[data_map.x]);})
            .attr('height',function(d) { return height - yScale(d[data_map.y]); }).attr('fill','#947BB6')

            bar_outline.style('opacity',0)

        } else if (stp == 2){

            bar_rect.attr('rx',20).attr('width',rect_width-10)
            .attr("x", function(d) {return xScale(d[data_map.x])+5;})
            .attr('height',function(d) { return height - yScale(d[data_map.y]); }).attr('fill','#947BB6')

            bar_outline.style('opacity',1)

        } else if (stp == 3){

            bar_outline.style('opacity',0)

            bar_rect.attr('rx',20).attr('width',rect_width-10)
            .attr("x", function(d) {return xScale(d[data_map.x])+5;}).attr('height',rect_width-10).attr('fill','#947BB6')

        } else {

            bar_outline.style('opacity',0)
            bar_rect.attr('rx',20).attr('width',rect_width-10)
            .attr("x", function(d) {return xScale(d[data_map.x])+5;}).attr('height',rect_width-10)
            .attr('fill',function(d) {return colorScale(d[data_map.x])})

        }

        

    }
   
})
