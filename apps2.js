var margin = { top: 10, right: 10, bottom: 10, left: 10 },
  width = 1350 - margin.left - margin.right,
  height = 340 - margin.top - margin.bottom;

var svg = d3
  .select(".main_sample")

  .append("svg")
  .attr("transform", `translate(0,0)`)
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g");

drawline();
function drawline() {
  var sum = width / 10 + 30;
  var straightline = width / 10 + 10;
  for (i = 0; i < 9; i++) {
    svg
      .append("line")
      .style("stroke-dasharray", "5, 5")
      .attr("x1", sum)
      .attr("x2", sum)
      .attr("class", "dash")
      .attr("y1", 0)
      .attr("y2", height - margin.bottom)
      .style("stroke", "lightgray")
      .style("stroke-width", 1);
    sum += straightline;
  }

  var sum = 0;
  for (var i = 0; i < 8; i++) {
    svg
      .append("line")
      .style("stroke-dasharray", "5, 5")
      .attr("x1", margin.left * 3)
      .attr("x2", width - 60)
      .attr("y1", sum)
      .attr("y2", sum)
      .style("stroke", "lightgray")
      .style("stroke-width", 0.5);
    sum += 90;
  }

  var datas = [
    { collector: "rurubisco", rank: 8, score: 30 },
    { date: "2020-04-23 00:39:28", quality: "good" },

    { date: "2020-04-26 12:10:31", quality: "unknown" },
    { date: "2020-04-27 08:24:00", quality: "bad" },
    { date: "2020-04-28 08:24:00", quality: "bad" },
    { date: "2020-04-30 01:10:31", quality: "bad" },
  ];
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  todayMillis = today.getTime();

  var main_rank = d3
    .select(".main_rank")
    .data(datas)
    .text((d) => d.rank);

  var main_score_text = d3
    .select(".main_score_text")
    .data(datas)
    .text((d) => d.score);
  var main_score = d3
    .select(".main_progress")
    .data(datas)
    .attr("value", (d) => d.score);
  formatDay = d3.timeFormat("%Y/%m/%d ");
  formatTime = d3.timeFormat("%H:%M:%S");
}

d3.json(
  "https://api.inaturalist.org/v1/observations/105590604,108630796,105590248"
).then(function (d) {
  // datas = d.results;
  // console.log(datas[0]);
  // console.log(datas);
  showdata2(d.results);
});

// d3.csv("observations-217852.csv").then(dataloaded2);

// function dataloaded2(data) {
//   showdata2(data);
// }

function showdata2(data) {
  // var today = new Date();
  // today.setHours(0, 0, 0, 0);
  // todayMillis = today.getTime();
  // console.log(data);
  // console.log(data);
  //
  // var pho = data.map((d) => d.photos);
  // const photo = pho.map((d) => d.url);
  // console.log(pho);
  var rectcolor = ["#EFF4AC", "#34C4E3", "#000000"];
  svg
    .selectAll("rect")
    .data(rectcolor)
    .enter()
    .append("rect")
    .attr("x", 60)
    .attr("y", (d, i) => 99 * i)
    .attr("width", 1250)
    .attr("height", 104)
    .attr("transform", "translate(" + 0 + "," + 5 + ")")
    .attr("fill", (d) => d)
    .attr("opacity", 0.2);
  var main_collector = d3
    .select("#main_collector")
    .data(data)
    .text((d) => d.user.login);
  //   console.log(data);

  let taxon = null;

  data.forEach((d) => {
    date = d.time_observed_at;
    date = date.slice(0, -6);
    d.date = new Date(date);
    d.hour = formatTime(d.date);
    // photoArray = d.photos;
    d.taxon.iconic_taxon_name;

    var parts = d.hour.split(/:/);

    var timePeriodMillis =
      parseInt(parts[0], 10) * 60 * 60 * 1000 +
      parseInt(parts[1], 10) * 60 * 1000 +
      parseInt(parts[2], 10) * 1000;
    d.hour = new Date();
    d.hour.setTime(todayMillis + timePeriodMillis);
    picuture = d.photos.map((d) => d.url);
    d.picuture = picuture[0];
    // console.log();
    // data.picture
    console.log(d.picuture);
    // console.log(d);
  });

  // data.map(d=>d.)
  // console.log(data.photos);
  // var photo = photoArray.map((d) => d.url);
  // var taxonname = taxon.iconic_taxon_name;

  // photoArray = photoArray.filter((_, i) => i < 1);
  // console.log(photoArray.flat());
  // console.log(photoArray.map((d, i) => d[i]));
  // photoArray.filter((d, i) => d.length < 2);

  // console.log(taxon.iconic_taxon_name);
  var margins = { top: 20, right: 20, bottom: 20, left: 20 },
    widths = 1350 - margins.left - margins.right,
    heights = 40 - margins.top - margins.bottom;

  var xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.date))
    .range([margins.left * 3 + 5, widths])
    .nice();

  var xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y/%m/%d"));
  // .ticks(10);
  console.log(d3.extent(data, (d) => d.hour));

  var yScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.hour))
    .range([margin.bottom, height - margin.bottom])
    .nice(d3.timeDay);
  console.log(d3.extent(data, (d) => d.date));
  console.log(data.hour);
  var yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%H:%M")).ticks(11);
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .selectAll("text")
    .style("font-size", "15px");
  // var yScale = d3.axisLeft()

  svg
    .append("g")
    .attr("transform", "translate(60,0)")
    .call(yAxis)
    .selectAll("text")
    .style("font-size", "15px");

  const tooltip = d3
    .select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");
  // A function that change this tooltip when the user hover a point.
  // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)

  var div = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  svg
    .append("g")
    .attr("transform", "translate(0,20)")
    .selectAll("circle")

    .data(data)
    .enter()
    .append("g")
    .classed("circles", true)
    .append("circle")
    .filter((d, i) => d.time_observed_at != "" && i.common_name != "")
    .attr("class", "cir")
    .attr("cx", (d) => xScale(d.date))
    .attr("cy", (d) => yScale(d.hour))
    .on("mouseover", function (event, d) {
      div
        .transition()
        .duration(200)
        .style("opacity", 0.9)
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px");
      div
        .html(`${d.taxon.iconic_taxon_name}</br>${d.date}</br>`)
        .style("left", event.pageX + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function (event, d) {
      div.transition().duration(100).style("opacity", 0);
    })

    .on("click", function (d, i) {
      var main =
        this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
          .parentNode;
      console.log(i);
      main.classList.remove("main_block");
      main.classList.add("active");
      // main.classList.toggle("main_block");

      main.children[1].classList.add("detailactive");

      main.children[1].classList.remove("hide_detailcontainer");
      main.children[1].classList.add("row_container1");
      console.log(main.children[1]);
      // console.log(main.children[1].classList.contains("detailactive"));
      if (main.children[1].classList.contains("detailactive")) {
        d3.select(main.children[1]).html(`
      <div class="row_container1"  id="detail1">
         <div class="detail_container"" >
        
             <span>Sample
              
             </span>
             <div>
             time_observed_at <span>Sampless
              
             </span>
             </div>
            
           </div>
           <div class="detail_container" >
             <span>Problem</span>
           </div>
           <div class="detail_container "  >
             <span>Method to Improve</span>
           </div>
           <div class="detail_container "  >
             <span>Photo</span>
           </div>
           <div class="detail_container "  >
             <span>Map</span>
           </div>
           <div class="detail_container "  >
             <span>Score</span>
           </div>
     </div>
     
     <div class="row_container2" id="rows2">
         <div  id="qualitys_title">
         
              <div class="samples_title">
              id&nbsp;&nbsp;&nbsp;<span>15151561511</span>  
                
            </div>
            <div class="samples_title">
              <span>Quality</span>  
              
          </div>
           </div>

           <div class="detail_content">
             <div class="row_content1" >

                 <div class="quality_block_style" >
                     <div class="quality_block" >
                         <span>Visual</span>
                         
                       </div>
                       <div class="quality_block" >
                         <span>Photo</span>
                       </div>
                       <div class="quality_block" >
                         <span>DNA</span>
                       </div>  
                       
                 </div>
                 <div class="problem_block_style" >
                     <div class="detail_container" >
                         <span>Sample too dry</span>
                         
                       </div>
                       <div class="detail_container" >
                         <span>Photo too blurry</span>
                       </div>
                       <div class="detail_container" >
                         <span>good</span>
                       </div>   
                 </div>

                 <div class="problem_block_style" >
                     <div class="detail_container" >
                         <span>need to more moisture</span>
                         
                       </div>
                       <div class="detail_container" >
                         <span>take picture on a sunny day</span>
                       </div>
                       <div class="detail_container" >
                         <span>good</span>
                       </div>   
                 </div>
          
                 <div class="photo_block_style" >
                         <img src="https://static.inaturalist.org/photos/182181363/large.jpeg" alt="" width="100%" height="100%">
                     </div>
                     <div class="map_block_style" >
                         <img src="ina.png" alt="" width="100%" height="100%">
                     </div>

                     <div class="score_block_style" >
                         <progress class="main_progress" max="100"value="80"> </progress>
                         <span class="main_score_text" >80</span>
                     </div>
             </div>
             <div class="row_content2">
            <div> 
                 <span> I willing to get another sample</span>
                 <input type="button" value="Yes">
             </div>
                 
               
            </div>
       
         </div>
      `);

        d3.select(main.children[1])
          .select(".photo_block_style")
          .node()

          .children[0].setAttribute("src", i.picuture);
        console.log(i.picuture);
        // console.log(pho);

        // d3.select(main.children[1])
        //   .select(".photo_block_style")
        //   .node()

        //   .children[0].setAttribute("src", photo[0]);
        // titleblock = Array.from(d3.select(main).select("#detail1").node());

        d3
          .select(main)
          .select("#detail1")
          .node().children[0].children[0].textContent =
          i.taxon.iconic_taxon_name;

        d3
          .select(main)
          .select("#detail1")
          .node().children[0].children[1].children[0].textContent =
          i.time_observed_at;

        var quality_title = Array.from(
          d3.select(main).select("#qualitys_title")
        );
        quality_title[0].children[0].children[0].textContent = i.id;

        // d3
        // .select(main)
        // .select("#rows2")
        // .node().children[0].children[0].textContent = i.scientific_name;
        // .append("span").textContent = i.taxon_id;

        // d3
        //   .select(main)
        //   .select("#detail1")
        //   .node().children[0].children[0].textContent +=  i.taxon_id;
        // i.image_url
        // photo_block_style
      }
      // this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.children[1].classList.toggle(
      //   "hide_detailcontainer"
      // );

      // this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.children[1].classList.toggle(
      //   "detailactive"
      // );
      //   console.log(this.parentNode.parentNode.parentNode.parentNode.parentNode.children[1]);
    })
    .attr("r", 10.5);
}
