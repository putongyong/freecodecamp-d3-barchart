getData=()=>{
    createTitle();
    createTooltip();
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(reponse=>{return reponse.json()})
    .then(reponseData => {
    var dataset=reponseData.data;
    createSVG(dataset);
    })
}
getData();

function createTitle(){
    d3.select("main")
    .append("div")
    .attr("id", "title")
    .text("United States GDP");
}

function createTooltip(){
    d3.select("body")
    .append("div")
    .attr("id", "tooltip")
}

function createSVG(dataset){
    var width = 800;
    var height = 500;
    var svg = d3.select("main")
    
    .append("svg")
    .attr("width", width+100)
    .attr("height", height+100)

    const mindate= new Date(d3.min(dataset,d=>d[0]));
    const maxdate= new Date(d3.max(dataset,d=>d[0]));
    const maxgdp= d3.max(dataset, d=>d[1]);  

    const xScale = d3.scaleTime()
    .domain([mindate,maxdate])
    .range([50,width-10])

    const yScale = d3.scaleLinear()
    .domain([0,maxgdp])
    .range([height-20,20])

    var xAxisTranslate = height-20;

    var x_axis = d3.axisBottom()
    .scale(xScale);
    
    svg.append("g")
    .attr("id","x-axis")
    .attr("transform", "translate(0, " + xAxisTranslate  +")")
    .call(x_axis);

    var y_axis = d3.axisLeft()
    .scale(yScale);

    svg.append("g")
    .attr("id","y-axis")
    .attr("transform", "translate(50)")
    .call(y_axis);
    
    svg.selectAll(".bar")
         .data(dataset)
         .enter()
         .append("rect")
         .attr("class", "bar")
         .style("fill","green")
         .attr("x", (d,i) => xScale(new Date(dataset[i][0])))
         .attr("y", (d) => yScale(d[1]))
         .attr("width",(width-10)/dataset.length)
         .attr("height", (d) =>height-yScale(d[1])-20)
         .attr("data-date",(d,i) => dataset[i][0])
         .attr("data-gdp",(d) => d[1])
         .on("mouseout",(d)=> {
            d3.select("#tooltip")
            .style("visibility", "visible") 
         })
         .on("mouseover",(e,d) => {
            d3.select("#tooltip")
            .style("position", "absolute")
            .style("background-color","yellow")
            .style("opacity",".85")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("top", e.pageY+"px")
            .style("left",e.pageX+6+"px")
            .attr("data-date",d[0])
            .html(`<p> Date:${d[0]} </p>`)
            .style("visibility", "visible")
         })
         .on("mouseout",(d)=> {
            d3.select("#tooltip")
            .style("visibility", "hidden")            
         })
;
}
