var margin = { top: 10, right: 10, bottom: 10, left: 10 },
  width = 1350 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

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

  var today = new Date();
  today.setHours(0, 0, 0, 0);
  todayMillis = today.getTime();

  var main_rank = d3
    .select(".main_rank")

    .text((d) => 1);

  var main_score_text = d3
    .select(".main_score_text")

    .text((d) => 80);
  var main_score = d3
    .select(".main_progress")

    .attr("value", (d) => 80);
  formatDay = d3.timeFormat("%Y/%m/%d ");
  formatTime = d3.timeFormat("%H:%M:%S");
}

d3.json(
  "https://api.inaturalist.org/v1/observations?user_login=naturalist71914&year=2022&order=desc&order_by=created_at"
).then(function (d) {
  // datas = d.results;
  // console.log(datas[0]);
  // console.log(datas);
  showdata2(d.results);
});

function showdata2(data) {
  var rectcolor = ["#EFF4AC", "#34C4E3", "#000000"];
  svg
    .selectAll("rect")
    .data(rectcolor)
    .enter()
    .append("rect")
    .attr("x", 60)
    .attr("y", (d, i) => 87 * i)
    .attr("width", 1250)
    .attr("height", 87)
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
    // d.taxon.iconic_taxon_name;
    data.arc = 50;
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

  // A function that change this tooltip when the user hover a point.
  // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
  var div = d3.select("body").append("div");

  svg
    .append("g")
    .attr("transform", "translate(10,0)")
    .classed("gs", true)
    .selectAll("circle")
    .data(data)
    .enter()
    .append("g")
    .classed("circles", true)
    .attr("height", 50 + "px")
    .attr("width", 50 + "px")
    .append("circle")

    .filter((d, i) => d.time_observed_at != "" && i.common_name != "")
    .attr("class", "cir")
    .attr("cx", (d) => xScale(d.date))
    .attr("cy", (d) => yScale(d.hour))

    .on("mouseover", function (event, d) {
      div
        .attr("class", "tooltip")
        .style("opacity", 0)
        .transition()
        .duration(200)
        .style("opacity", 0.9)
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px");
      div
        .html(`${d.species_guess}</br>${d.date}</br>`)
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

      main.classList.remove("main_block");
      main.classList.add("active");

      // main.classList.toggle("main_block");

      main.children[1].classList.add("detailactive");
      $(document).ready(function () {
        $(main.children[1]).show();
      });

      // main.children[1].classList.remove("hide_detailcontainer");
      main.children[1].classList.add("row_container1");
      console.log(main.children[1]);
      if (main.children[1].classList.contains("detailactive")) {
        d3.select(main.children[1])
          .html(`    <div class="row_container1"  id="detail1" style="height: 300px;">
     
  
          <div class="row_container2" id="rows2" style="height:300px; ">
             
        
                <div class="detail_content" style="width: 100%; height:470px  ">
                  <div class="row_content1" style="width: 1840px;justify-content:flex-start">
        
                      <div class="quality_block_style" style="width:264px;" >
                   
                          <div class="quality_block" style="height: 100%;display:flex colomn;justify-content: center;align-items:flex-start;font-size: 1rem;">
                             <div  style="display:flex;justify-content: center;align-items:center;background-color:white;">&#128337;<span id="times">55465</span></div>   
                             <div  style="display:flex;justify-content: center;align-items:center;background-color:white;">🆔<span id="sampleid">54654</span></div>   
                            </div>
                           
                              
                           </div>
                    <div class="quality_block_style" style="width: 150px;" >
                   
                      <div class="quality_block" style="height: 100%;">
                          <span>Quality</span>
                          
                        </div>
                       
                          
                       </div>
                     
                       <div class="quality_block_style" style="width: 325px;" >
                   
                        <div class="quality_block" style="height: 100%;">
                            <span>Problem</span>
                            
                          </div>
                         
                            
                         </div>
                         <div class="quality_block_style" style="width: 325px;" >
                   
                          <div class="quality_block" style="height: 100%;">
                              <span> Method to Improve
                              </span>
                              
                            </div>
                           
                              
                           </div>
                           <div class="quality_block_style" style="width: 325px;" >
                   
                            <div class="quality_block" style="height: 100%;">
                                <span>Photo</span>
                                
                              </div>
                             
                                
                             </div>
                             <div class="quality_block_style" style="width: 325px;" >
                   
                              <div class="quality_block" style="height: 100%;">
                                  <span> Map </span>
                                  
                                </div>
                               
                                  
                               </div>
                               <div class="quality_block_style" style="width: 141px;" >
                   
                                <div class="quality_block" style="height: 100%;">
                                    <span>Score</span>
                                    
                                  </div>
                                 
                                    
                                 </div>
         
                
                  </div>
                  <div class="row_content1" style="width: 1840px;">
        
                    <div class="quality_block_style" style="width: 280px;text-align:center" >
                     
                      <div class="quality_block" style="height: 100%;">
                          
                          <span>Sample</span>
                          
                        </div>
                       
                          
                       </div>
                      <div class="quality_block_style" style="width: 160px;" >
                          <div class="quality_block"   >
                              <span>Visual</span>
                              
                            </div>
                            <div class="quality_block" >
                              <span>Photo</span>
                            </div>
                            <div class="quality_block" >
                              <span>DNA</span>
                            </div>  
                            
                      </div>
                      <div class="problem_block_style" style="width: 345px;">
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
        
                      <div class="problem_block_style" style="width: 345px;">
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
               
                      <div class="photo_block_style"style="width: 345px;display:flex; flex-direction: column;">
                          
                             <img src="https://static.inaturalist.org/photos/182181363/large.jpeg" alt="" width="100%" height="100%">
                         
                             <div background-image: url("ina.png");  alt="" width="100px" height="100px"></div>
                          </div>
                          <div class="map_block_style" style="width: 345px;">
                              <img src="ina.png" alt="" width="100%" height="100%">
                          </div>
        
                          <div class="score_block_style" style="height: 100%;">
                          <div class="progress"> 
                          <div class="progress__bar"></div>
                        </div>
                              
                              </progress>
                          </div>
                  </div>
                  <div class="row_content2">
                 <div> 
                        I willing to get another sample 
                      <input type="button" value="Yes">
                  </div>
                      
                    
                 </div>
            
              </div>`);

        d3.select(main.children[1])
          .select(".photo_block_style")
          .node()

          .children[0].setAttribute("src", i.picuture);
        console.log(i.picuture);

        // d3
        //   .select(main.children[1])
        //   .node().children[0].children[0].children[0].children[0].children[0].textContent =
        //   i.species_guess;
        const species_name = d3.select(main.children[1]).node().children[0]
          .children[0].children[0].children[1].children[0];
        species_name.textContent = i.species_guess;
        if (species_name.textContent == "") {
          species_name.textContent = "unknown";
        }
        // d3.select(main).select("#times").textContent = data.hour;

        Array.from(d3.select(main).select("#times"))[0].textContent =
          i.time_observed_at;
      }
      Array.from(d3.select(main).select("#sampleid"))[0].textContent = i.id;

      var sectionss = Array.from(d3.selectAll(".small>div"));

      // let blocks = Array.from(d3.selectAll(".small"))[i];
      // console.log(blocks);

      var margins = { top: 40, right: 50, bottom: 40, left: 40 },
        widths = 1350 - margins.left - margins.right,
        heights = 340 - margins.top - margins.bottom;

      // console.log(blocks);
      for (k of sectionss) {
        console.log(k);
        if (k.getAttribute("class") == "active") {
          k.setAttribute("class", "small_block");
          k.children[0].classList.remove("row_container2");
          var orgsvg = d3.select(k.children[0]).select("svg");
          // console.log(orgsvg);
          var margin = { top: 20, right: 20, bottom: 20, left: 20 },
            width = 1350 - margin.left - margin.right,
            height = 50 - margin.top - margin.bottom;
          orgsvg
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
          // console.log(orgsvg);
          // console.log();
          // for (j of Array.from(orgsvg.selectAll("circle"))) {

          // }
          const clicked_circle = Array.from(orgsvg.selectAll("circle"));
          const small_data = clicked_circle.map((d) => d.__data__);

          let xScale_small = d3
            .scaleTime()
            .domain(d3.extent(small_data, (d) => d.date))
            .range([margin.left * 6 + 5, width])
            .nice();
          let yScale_small = d3
            .scaleTime()
            .domain(d3.extent(small_data, (d) => d.hour))
            .range([margin.bottom, height - margin.bottom])
            .nice(d3.timeDay);

          orgsvg

            .selectAll("circle")
            .data(small_data)
            .attr("cx", (d) => {
              return xScale_small(d.date);
            })
            .attr("cy", (d) => yScale_small(d.hour));

          // orgsvg  .selectAll("circle").data(data)
          // console.log(j.__data__);
        }
      }

      // console.log(main.children[1].classList.contains("detailactive"));
    })
    .attr("r", 10.5);
  // console.log(data.arc);

  //   .selectAll(".circles")
  //   .append("text")
  //   .data(data)
  //   // .enter()
  //   // .append("div")
  //   .style("width", 10 + "px")
  //   .style("height", 10 + "px")
  //   .attr("x", (d) => xScale(d.date))
  //   .attr("y", (d) => yScale(d.hour))
  //   .attr("font-size", "10px")
  //   .text((d) => "dasdsa");

  // .attr(
  //   "d",
  //   d3
  //     .arc()
  //     .innerRadius(100) // This is the size of the donut hole
  //     .outerRadius(radius)
  // )
  // .attr("fill", (d) => color(d.arc))
  // .attr("stroke", "black")
  // // .attr("x", (d) => xScale(d.date))
  // // .attr("y", (d) => yScale(d.hour))
  // .style("stroke-width", "2px")
  // .style("opacity", 0.7);

  // svg
  //   .selectAll(".circles")
  //   .append("path")
  //   .data(data)

  //   .join("path")
  //   .attr(
  //     "d",
  //     d3
  //       .arc()
  //       .innerRadius(100) // This is the size of the donut hole
  //       .outerRadius(radius)
  //   )
  //   .attr("fill", (d) => color(d.arc))
  //   .attr("stroke", "black")
  //   .attr("x", (d) => xScale(d.date))
  //   .attr("y", (d) => yScale(d.hour))
  //   .style("stroke-width", "2px")
  //   .style("opacity", 0.7);
  const arcPath = d3.arc().outerRadius(10).innerRadius(50);
  svg
    .select(".gs")
    .selectAll("path")
    // .append("path")
    .data(data)

    .join("path")
    .attr("d", arcPath)
    .attr("fill", (d) => color(d.arc))
    .attr("stroke", "black")
    .attr("cx", (d) => xScale(d.date))
    .attr("cy", (d) => yScale(d.hour))
    .style("stroke-width", "2px")
    .style("opacity", 0.7);
}
