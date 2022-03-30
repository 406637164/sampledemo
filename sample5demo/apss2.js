const url = "https://api.inaturalist.org/v1/observations/80365";
// d3.json("https://api.inaturalist.org/v1/observations/80365").then(function (d) {
//   showdata(data);
// });
// d3.csv("observations-217852.csv").then(dataloaded);
// function dataloaded(data) {
//   showdata(data);
// }
datas = [
  "https://api.inaturalist.org/v1/observations?user_login=yenshu1&year=2022&order=desc&order_by=created_at",
  "https://api.inaturalist.org/v1/observations?user_login=xin883238&year=2022&order=desc&order_by=created_at",
  "https://api.inaturalist.org/v1/observations?user_login=ssnp100&year=2022&order=desc&order_by=created_at",
  "https://api.inaturalist.org/v1/observations?user_login=wairambar_rainforest&year=2022&order=desc&order_by=created_at",
  "https://api.inaturalist.org/v1/observations?user_login=jeff314&year=2022&order=desc&order_by=created_at",
  "https://api.inaturalist.org/v1/observations?user_login=michaelpatrickyoon&year=2022&order=desc&order_by=created_at",
  "https://api.inaturalist.org/v1/observations?user_login=nikitacoppisetti&year=2022&order=desc&order_by=created_at",

  "https://api.inaturalist.org/v1/observations?user_login=ku6777&year=2022&order=desc&order_by=created_at",
  "https://api.inaturalist.org/v1/observations?user_login=naturalist25592500&year=2022&order=desc&order_by=created_at",
  "https://api.inaturalist.org/v1/observations?user_login=wollihuang&year=2022&order=desc&order_by=created_at",
  "https://api.inaturalist.org/v1/observations?user_login=naturalist3828&year=2022&order=desc&order_by=created_at",
  "https://api.inaturalist.org/v1/observations?user_login=naturalist29475&year=2022&order=desc&order_by=created_at",
  "https://api.inaturalist.org/v1/observations?user_login=enya12&year=2022&order=desc&order_by=created_at",
];
for (let i = 0; i < datas.length; i++) {
  d3.select("body").append("section").attr("id", i).attr("class", "small")
    .html(` <div class="small_block">
<div class="row_container1">
<div class="small_rank row"><p></p></div>
<div class="small_collector row"><p></p></div>
<div class="small_sample row largerow"></div>
<div class="small_score row">
<div class="progress"> 
<div class="progress__bar"></div>
</div>
    
    </progress>
</div>
</div>
<div class="detailactive">
<div class="row_container2"></div>
</div>
</div>`);

  d3.json(datas[i]).then(function (d) {
    datas = d.results;

    showdata(d.results);
    function showdata(data) {
      // console.log(data);
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      todayMillis = today.getTime();
      // console.log(new Date(data[i].time_observed_at));
      data.forEach((d) => {
        d.date = new Date(d.time_observed_at);
        d.hour = formatTime(d.date);

        var parts = d.hour.split(/:/);

        var timePeriodMillis =
          parseInt(parts[0], 10) * 60 * 60 * 1000 +
          parseInt(parts[1], 10) * 60 * 1000 +
          parseInt(parts[2], 10) * 1000;
        d.hour = new Date();
        d.hour.setTime(todayMillis + timePeriodMillis);
      });
      // console.log(data[i]);

      let blocks = Array.from(d3.selectAll(".small"))[i];
      // console.log(data[i].user);

      d3.select(blocks).select(".small_collector>p").node().textContent =
        data[i].user.login;

      d3.select(blocks).select(".small_rank>p").node().textContent = i + 2;
      $(document).ready(function () {
        $(Array.from(d3.select(blocks).selectAll(".row_container1"))[1]).hide();
      });
      console.log(
        d3
          .select(blocks)
          .select("#small_progress")
          .attr("value", (d) => 60)
      );
      // console.log(d3.select(blocks).select(".small_sample").node());

      var margin = { top: 20, right: 20, bottom: 20, left: 20 },
        width = 1350 - margin.left - margin.right,
        height = 50 - margin.top - margin.bottom;

      let xScale_small = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.date))
        .range([margin.left * 8 + 5, width])
        .nice();
      // console.log(d3.extent(data, (d) => d.date));

      let yScale_small = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.hour))
        .range([margin.bottom, height - margin.bottom])
        .nice(d3.timeDay);
      var xAxis_small = d3
        .axisBottom(xScale_small)
        .tickFormat(d3.timeFormat("%Y/%m/%d"))
        .ticks(7);
      var yAxis_small = d3
        .axisLeft(yScale_small)
        .tickFormat(d3.timeFormat("%H:%M"))
        .ticks(10);
      // console.log(d3.extent(data, (d) => d.hour));

      var div = d3.select("body").append("div");

      const smallsvg = d3
        .select(blocks)
        .select(".small_sample")

        .append("svg")
        .attr("transform", `translate(0,0)`)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g");
      // console.log(data);

      smallsvg
        .attr("transform", `translate(30,20)`)
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("class", "cir")
        .attr("cx", (d) => {
          console.log(xScale_small(d.date));
          return xScale_small(d.date);
        })
        .attr("cy", (d) => yScale_small(d.hour))
        .attr("r", 10.5)
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
          blocks.children[0].classList.remove("small_block");
          blocks.children[0].children[0].classList.add("row_container2");

          $(document).ready(function () {
            $(blocks.children[0]).slideDown();
            blocks.children[0].classList.add("active");
          });
          blocks.children[0].children[1].innerHTML = `
          <div class="row_container1"  id="detail1" style="height: 300px;">
     
  
          <div class="row_container2" id="rows2" style="height:300px; ">
             
        
                <div class="detail_content" style="width: 100%; height:470px  ">
                  <div class="row_content1" style="width: 1840px;justify-content:flex-start">
        
                      <div class="quality_block_style" style="width:265px;" >
                   
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
        
                    <div class="quality_block_style" style="width: 280px;" >
                     
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
            
              </div>
         `;

          d3.select(blocks.children[0].children[1])
            .select(".photo_block_style")
            .node()
            .children[0].setAttribute("src", i.photos[0].url);

          // d3
          //   .select(blocks.children[0].children[1])
          //   .node().children[0].children[0].children[0].children[0].children[0].textContent =
          //   i.species_guess;
          Array.from(d3.select(blocks).select("#times"))[0].textContent =
            i.time_observed_at;
          Array.from(d3.select(blocks).select("#sampleid"))[0].textContent =
            i.id;
          const small_speices = Array.from(
            d3.select(
              blocks.children[0].children[1].children[0].children[0].children[0]
                .children[1].children[0]
            )
          )[0];
          small_speices.textContent = i.species_guess;
          if (small_speices.textContent == "") {
            small_speices.textContent = "unknown";
          }
          var margins = { top: 40, right: 50, bottom: 40, left: 40 },
            widths = 1350 - margins.left - margins.right,
            heights = 360 - margins.top - margins.bottom;

          d3.select(blocks)
            .select("svg")
            .node()
            .setAttribute("height", heights + margin.top + margin.bottom);

          xScale_small.range([margins.left + 25, widths]);
          yScale_small.range([margins.bottom, heights - margins.bottom]);
          d3.select(blocks)
            .select("svg")
            .selectAll("circle")
            .attr("cx", (d) => {
              console.log(xScale_small(d.date));
              return xScale_small(d.date);
            })
            .attr("cy", (d) => yScale_small(d.hour));
          smallsvg
            .append("g")
            .attr("transform", `translate(0,${heights - margins.bottom})`)
            .call(xAxis_small)
            .selectAll("text")
            .style("font-size", "15px");
          // var yScale = d3.axisLeft()

          smallsvg
            .append("g")
            .attr("transform", "translate(60,0)")
            .call(yAxis_small)
            .selectAll("text")
            .style("font-size", "15px");
          const mains_hide = d3.select(main).select(".detailactive").node();

          $(document).ready(function () {
            $(mains_hide).hide();
            $("#main").removeClass("active");
            $("#main").addClass("main_block");
          });
          // console.log(d3.select(main));
          //small section hide
          var sections = Array.from(d3.selectAll(".small>div"));
          for (k of sections) {
            if (k.parentNode.getAttribute("id") == blocks.getAttribute("id")) {
              continue;
            } else {
              if (k.getAttribute("class") == "active") {
                k.setAttribute("class", "small_block");
                k.children[0].classList.remove("row_container2");

                var orgsvg = d3.select(k.children[0]).select("svg");

                xScale_small = d3
                  .scaleTime()
                  .domain(d3.extent(data, (d) => d.date))
                  .range([margin.left * 6 + 5, width])
                  .nice();

                yScale_small = d3
                  .scaleTime()
                  .domain(d3.extent(data, (d) => d.hour))
                  .range([margin.bottom, height - margin.bottom])
                  .nice(d3.timeDay);

                orgsvg
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom);
                orgsvg

                  .selectAll("circle")
                  .data(data)
                  .attr("cx", (d) => {
                    // console.log(xScale_small(d.date));
                    return xScale_small(d.date);
                  })
                  .attr("cy", (d) => yScale_small(d.hour));
                // console.log();
                for (p of Array.from(orgsvg.selectAll("g"))) {
                  // if (p.getAttribute("class") == "tick") {
                  //   p.remove();
                  // }
                  // console.log();
                  for (r of Array.from(p.children)) {
                    if (r.getAttribute("class") !== "cir") {
                      r.remove();
                    }
                  }
                }
              }
            }
          }
          //           d3.select(blocks.children[0].children[1])
          //             .select(".photo_block_style")
          //             .node()

          //             .children[0].setAttribute("src", i.photos[0].url);

          //           d3
          //             .select(blocks.children[0].children[1])
          //             .node().children[0].children[0].children[0].textContent =
          //             i.species_guess;

          //           var quality_title = Array.from(
          //             d3.select(blocks.children[0].children[1]).select("#qualitys_title")
          //           );

          //           quality_title[0].children[0].children[0].textContent = i.id;
          //           var margins = { top: 20, right: 20, bottom: 20, left: 20 },
          //             widths = 1350 - margins.left - margins.right,
          //             heights = 340 - margins.top - margins.bottom;

          //           d3.select(blocks)
          //             .select("svg")
          //             .node()
          //             .setAttribute("height", heights + margin.top + margin.bottom);

          //           xScale_small.range([margins.left * 3 + 5, widths]);
          //           yScale_small.range([margins.bottom, heights - margins.bottom]);
          //           d3.select(blocks)
          //             .select("svg")
          //             .selectAll("circle")
          //             .attr("cx", (d) => {
          //               console.log(xScale_small(d.date));
          //               return xScale_small(d.date);
          //             })
          //             .attr("cy", (d) => yScale_small(d.hour));
          //           smallsvg
          //             .append("g")
          //             .attr("transform", `translate(0,${heights - margins.bottom})`)
          //             .call(xAxis_small)
          //             .selectAll("text")
          //             .style("font-size", "15px");

          //           smallsvg
          //             .append("g")
          //             .attr("transform", "translate(60,0)")
          //             .call(yAxis_small)
          //             .selectAll("text")
          //             .style("font-size", "15px");
          //           const mains_hide = d3.select(main).select(".detailactive").node();

          //           $(document).ready(function () {
          //             $(mains_hide).hide();
          //             $("#main").removeClass("active");
          //             $("#main").addClass("main_block");
          //           });

          //           var sections = Array.from(d3.selectAll(".small>div"));
          //           for (k of sections) {
          //             if (k.parentNode.getAttribute("id") == blocks.getAttribute("id")) {
          //               continue;
          //             } else {
          //               if (k.getAttribute("class") == "active") {
          //                 k.setAttribute("class", "small_block");
          //                 k.children[0].classList.remove("row_container2");

          //                 var orgsvg = d3.select(k.children[0]).select("svg");

          //                 xScale_small = d3
          //                   .scaleTime()
          //                   .domain(d3.extent(data, (d) => d.date))
          //                   .range([margin.left * 6 + 5, width])
          //                   .nice();

          //                 yScale_small = d3
          //                   .scaleTime()
          //                   .domain(d3.extent(data, (d) => d.hour))
          //                   .range([margin.bottom, height - margin.bottom])
          //                   .nice(d3.timeDay);

          //                 orgsvg
          //                   .attr("width", width + margin.left + margin.right)
          //                   .attr("height", height + margin.top + margin.bottom);
          //                 orgsvg

          //                   .selectAll("circle")
          //                   .data(data)
          //                   .attr("cx", (d) => {
          //                     return xScale_small(d.date);
          //                   })
          //                   .attr("cy", (d) => yScale_small(d.hour));

          //                 for (p of Array.from(orgsvg.selectAll("g"))) {
          //                   for (r of Array.from(p.children)) {
          //                     if (r.getAttribute("class") !== "cir") {
          //                       r.remove();
          //                     }
          //                   }
          //                 }
          //               }
          //             }
          //           }
        });
    }
  });
}
