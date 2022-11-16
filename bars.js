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
.range(["#FBAF84","#7DC0C3","#7DC0C3","#FBAF84","#7DC0C3","#FBAF84","#947BB6"])

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
.attr("markerWidth", 15)
.attr("markerHeight", 15)
.attr("refX", 4.45)
.attr("refY", 2)
.attr("orient", 0)
.attr("markerUnits", "strokeWidth")
.append("path")
.attr("d", "M4.76566 1.12179C4.5704 0.926526 4.25382 0.926526 4.05856 1.12179L0.876576 4.30377C0.681313 4.49903 0.681313 4.81561 0.876576 5.01088C1.07184 5.20614 1.38842 5.20614 1.58368 5.01088L4.41211 2.18245L7.24054 5.01088C7.4358 5.20614 7.75238 5.20614 7.94764 5.01088C8.14291 4.81561 8.14291 4.49903 7.94764 4.30377L4.76566 1.12179ZM4.91211 1.97534L4.91211 1.47534L3.91211 1.47534L3.91211 1.97534L4.91211 1.97534Z")

//add arrow to x-axis
svg.append("defs")
.append("marker")
.attr("id", "x-arrow")
.attr("markerWidth", 15)
.attr("markerHeight", 15)
.attr("refX", 4.45)
.attr("refY", 2)
.attr("orient", 90)
.attr("markerUnits", "strokeWidth")
.append("path")
.attr("d", "M4.76566 1.12179C4.5704 0.926526 4.25382 0.926526 4.05856 1.12179L0.876576 4.30377C0.681313 4.49903 0.681313 4.81561 0.876576 5.01088C1.07184 5.20614 1.38842 5.20614 1.58368 5.01088L4.41211 2.18245L7.24054 5.01088C7.4358 5.20614 7.75238 5.20614 7.94764 5.01088C8.14291 4.81561 8.14291 4.49903 7.94764 4.30377L4.76566 1.12179ZM4.91211 1.97534L4.91211 1.47534L3.91211 1.47534L3.91211 1.97534L4.91211 1.97534Z")


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
    .attr('x2',width+20)
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


    //scroll update function
    function update(val){

        // if (val) step = val.target.value;

        if (stp == 1) {

            bar_rect.attr('rx',0).attr('width',rect_width)
            .attr("x", function(d) {return xScale(d[data_map.x]);})
            .attr('height',function(d) { return height - yScale(d[data_map.y]); })

            bar_outline.style('opacity',0)

        } else if (stp == 2){

            bar_rect.attr('rx',20).attr('width',rect_width-10)
            .attr("x", function(d) {return xScale(d[data_map.x])+5;})
            .attr('height',function(d) { return height - yScale(d[data_map.y]); })

            bar_outline.style('opacity',1)

        } else if (stp == 3){

            bar_outline.style('opacity',0)

            bar_rect.attr('height',rect_width-10).attr('fill','#947BB6')
            // update_shape(data[2],'#52E0BE')

            // study1.style('opacity',0)
            // hover_rect.attr('display',"none")
            // study2.style('opacity',0)
            // study3.style('opacity',1)
            // study4.style('opacity',0)

        } else {

            bar_outline.style('opacity',0)
            bar_rect.attr('height',rect_width-10).attr('fill',function(d) {return colorScale(d[data_map.x])})
            // update_shape(data[3],'#52E0BE')

            // study1.style('opacity',0)
            // hover_rect.attr('display',"none")
            // study2.style('opacity',0)
            // study3.style('opacity',0)
            // study4.style('opacity',1)
        }

        

    }
   
})
