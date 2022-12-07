'use strict'

let launch = ((selector = '#launch') => {

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false

    ////////////////////////////////////
    //////////// svg setup /////////////
    ////////////////////////////////////

    var body = d3.select(selector)
    body.html("")

    // margins for SVG
    const margin = isMobile ? {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
    } : {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
    }

    // responsive width & height
    const svgWidth = 1050 // parseInt(d3.select(selector).style('width'), 10)
    const svgHeight = 1050 // parseInt(d3.select(selector).style('height'), 10)

    // helper calculated variables for inner width & height
    const height = svgHeight - margin.top - margin.bottom
    const width = svgWidth - margin.left - margin.right

    // add SVG
    d3.select(`${selector} svg`).remove();

    d3.select('#confetti-placeholder').append('canvas').attr('id','confetti-canvas');

    const svg = d3.select(selector)
        .append('svg')
        .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    // d3.select(selector).append('canvas').attr('id','confetti-canvas');
    ////////////////////////////////////
    //////////scroll observers//////////
    ////////////////////////////////////
    let stp = 1;
    // let remove = false;
    let options = {
        root: null,
        rootMargin: "0px",
        threshold: [.75]
      };
        
        const contract = document.querySelector('#contract');

        const contractObserver = new IntersectionObserver(handleContract, options);
    
        function handleContract(entry, observer) {
            if (entry[0].intersectionRatio > .75) {
                stp = 1
                update()
            }
        };
    
        contractObserver.observe(contract);

        const expand = document.querySelector('#expand');

        const expandObserver = new IntersectionObserver(handleExpand, options);
    
        function handleExpand(entry, observer) {
            if (entry[0].intersectionRatio > .75) {
                stp = 2
                // remove = false
                update()
            }
        };

        expandObserver.observe(expand);

        const confettiOb = document.querySelector('#confetti');

        const confettiObserver = new IntersectionObserver(handleConfetti, options);
    
        function handleConfetti(entry, observer) {
            if (entry[0].intersectionRatio > .75) {
                stp = 3
                update()
            }
        };

        confettiObserver.observe(confettiOb);

    ////////////////////////////////////
    //////////////globals///////////////
    ////////////////////////////////////



    ////////////////////////////////////
    //////////////wrangle///////////////
    ////////////////////////////////////

    const data = {
        "nodes": [
            { "id": "1", "group": 1, "translate": '(-50px, -50px)', "scl": 0},
            { "id": "2", "group": 1, "translate": '(-50px, -50px)', "scl": 0},
            { "id": "3", "group": 1, "translate": '(-50px, -50px)', "scl": 0},
            { "id": "4", "group": 1, "translate": '(-100px, -100px)', "scl": 0},
            { "id": "5", "group": 1, "translate": '(-100px, -50px)', "scl": 1},
            { "id": "6", "group": 1, "translate": '(-100px, -100px)', "scl": 0}
        ],
        "links": [
            { "source": "1", "target": "6", "value": 1 },
            { "source": "1", "target": "5", "value": 1 },
            { "source": "2", "target": "3", "value": 1 },
            { "source": "2", "target": "3", "value": 1 },
            { "source": "2", "target": "4", "value": 1 },
            { "source": "2", "target": "5", "value": 1 },
            { "source": "3", "target": "6", "value": 1 },
            { "source": "3", "target": "5", "value": 1 },
            { "source": "4", "target": "1", "value": 1 },
            { "source": "4", "target": "5", "value": 1 },
            { "source": "5", "target": "6", "value": 1 },
        ]
    }

    const links = data.links.map(d => Object.create(d))
    const nodes = data.nodes.map(d => Object.create(d))


    ////////////////////////////////////
    //////// simulation setup //////////
    ////////////////////////////////////   

    let drag = simulation => {

        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            event.subject.fx = event.subject.x
            event.subject.fy = event.subject.y
        }

        function dragged(event) {
            event.subject.fx = event.x
            event.subject.fy = event.y
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0)
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
    }


    var simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(10))
        .force("charge", d3.forceManyBody())
        .force("collide", d3.forceCollide(0).iterations(100))
        .force("center", d3.forceCenter(width / 2, height / 2))
        // .alphaDecay(0.01)



    ////////////////////////////////////
    //////////// add to DOM ////////////
    ////////////////////////////////////  

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value))


    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll(".forcebubbles")
        .data(nodes)
        .join("svg:image")
        .attr("xlink:href", (d,i) => `https://datacult.github.io/studio-website/assets/launch/${i+1}.svg`)
        .style("transform", d => "translate"+d.translate)
        .style("opacity",d => d.scl)
        .attr("class", "forcebubbles")
        .attr('id',d=>'bubble'+d.id)
        .call(drag(simulation));

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)

        node
            .attr("x", d => d.x)
            .attr("y", d => d.y)
    })

    var confettiSettings = {
        "target":"confetti-canvas",
        "max":"400",
        "size":"1.5",
        "animate":true,
        // "props":["square","line"],
        "props": [
            {"type":"svg","src":"https://datacult.github.io/studio-website/assets/confetti/confetti-1.svg","size":15,"weight":0.2},
            {"type":"svg","src":"https://datacult.github.io/studio-website/assets/confetti/confetti-2.svg","size":15,"weight":0.2},
            {"type":"svg","src":"https://datacult.github.io/studio-website/assets/confetti/confetti-3.svg","size":15,"weight":0.2},
            {"type":"svg","src":"https://datacult.github.io/studio-website/assets/confetti/confetti-4.svg","size":15,"weight":0.2},
            {"type":"svg","src":"https://datacult.github.io/studio-website/assets/confetti/confetti-5.svg","size":15,"weight":0.2},
            {"type":"svg","src":"https://datacult.github.io/studio-website/assets/confetti/confetti-6.svg","size":15,"weight":0.2},
            {"type":"svg","src":"https://datacult.github.io/studio-website/assets/confetti/confetti-7.svg","size":15,"weight":0.2},
            {"type":"svg","src":"https://datacult.github.io/studio-website/assets/confetti/confetti-8.svg","size":15,"weight":0.2},
            {"type":"svg","src":"https://datacult.github.io/studio-website/assets/confetti/confetti-9.svg","size":15,"weight":0.2},
            {"type":"svg","src":"https://datacult.github.io/studio-website/assets/confetti/confetti-10.svg","size":15,"weight":0.2},
        ],
        "colors":[[125,192,195],[214,77,102],[251,175,132],[148,123,182]],
        "clock":"35",
        "rotate":true,
        "start_from_edge":false,
        "respawn":true
    };
    var confetti = new ConfettiGenerator(confettiSettings);

    //scroll update function
    function update(val){
        

        console.log(stp)

        if (stp == 1) {

            simulation
            .alpha(1)
            .force("collide", d3.forceCollide(0).iterations(100)).restart()

            node
            .style("transform", d => "translate"+d.translate)
            .style("opacity",d => d.scl)
            .call(drag(simulation))
        } else if (stp == 2){
            
            confetti.clear();

            simulation
            .alpha(1)
            .force("collide", d3.forceCollide(125).iterations(100)).restart()

            node
            .style("transform", d => "translate"+d.translate)
            .style("opacity",1)
            .call(drag(simulation))

        } else {

            console.log('confetti')
            confetti = new ConfettiGenerator(confettiSettings);
            confetti.render();

        }

        

    }

})

