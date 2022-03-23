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
];
for (let i = 0; i < datas.length; i++) {
  d3.select("body").append("section").attr("id", i).attr("class", "small")
    .html(` <div class="small_block">
<div class="row_container1">
<div class="small_rank row"><p></p></div>
<div class="small_collector row"><p></p></div>
<div class="small_sample row largerow"></div>
<div class="small_score row">
  <progress class="small_progress" max="100"></progress>
  <span class="small_score_text"></span>
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

      // console.log(d3.select(blocks).select(".small_sample").node());

      var margin = { top: 20, right: 20, bottom: 20, left: 20 },
        width = 1350 - margin.left - margin.right,
        height = 50 - margin.top - margin.bottom;

      let xScale_small = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.date))
        .range([margin.left * 6 + 5, width])
        .nice();
      // console.log(d3.extent(data, (d) => d.date));

      let yScale_small = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.hour))
        .range([margin.bottom, height - margin.bottom])
        .nice(d3.timeDay);
      var xAxis_small = d3
        .axisBottom(xScale_small)
        .tickFormat(d3.timeFormat("%Y/%m/%d"));
      var yAxis_small = d3
        .axisLeft(yScale_small)
        .tickFormat(d3.timeFormat("%H:%M"))
        .ticks(11);
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
        .attr("transform", `translate(0,20)`)
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
          blocks.children[0].classList.add("active");
          blocks.children[0].children[1].innerHTML = `
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
          `;
          d3.select(blocks.children[0].children[1])
            .select(".photo_block_style")
            .node()

            .children[0].setAttribute("src", i.photos[0].url);

          // d3
          //   .select(blocks.children[0].children[1])
          //   .node().children[0].children[0].textContent =
          //   i.taxon.iconic_taxon_name;

          d3
            .select(blocks.children[0].children[1])
            .node().children[0].children[0].children[0].textContent =
            i.species_guess;

          d3
            .select(blocks.children[0].children[1])
            .select("#detail1")
            .node().children[0].children[1].children[0].textContent =
            i.time_observed_at;
          // console.log();
          var quality_title = Array.from(
            d3.select(blocks.children[0].children[1]).select("#qualitys_title")
          );

          quality_title[0].children[0].children[0].textContent = i.id;
          var margins = { top: 20, right: 20, bottom: 20, left: 20 },
            widths = 1350 - margins.left - margins.right,
            heights = 340 - margins.top - margins.bottom;

          // smallsvg.attr("height", heights + margin.top + margin.bottom);

          d3.select(blocks)
            .select("svg")
            .node()
            .setAttribute("height", heights + margin.top + margin.bottom);

          xScale_small.range([margins.left * 3 + 5, widths]);
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

                // console.log(d3.extent(data, (d) => d.date));

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

                //  .remove("row_container1");
              }
              // if(k.parentNode.getAttribute)
              // console.log(k);
            }
          }
          // console.log(blocks.getAttribute("id"));
        });
    }
  });
}
// datas.forEach((d) => {
//   // console.log(d);
//   d3.json(d).then(function (d) {
//     datas = d.results;

//     showdata(d.results);
//   });
// });

// function showdata(data) {
//   data.forEach((d) => {
//     date = d.time_observed_at;
//     date = date.slice(0, -6);
//     d.date = new Date(date);
//     d.hour = formatTime(d.date);
//     // photoArray = d.photos;
//     d.taxon.iconic_taxon_name;

//     var parts = d.hour.split(/:/);

//     var timePeriodMillis =
//       parseInt(parts[0], 10) * 60 * 60 * 1000 +
//       parseInt(parts[1], 10) * 60 * 1000 +
//       parseInt(parts[2], 10) * 1000;
//     d.hour = new Date();
//     d.hour.setTime(todayMillis + timePeriodMillis);
//     picuture = d.photos.map((d) => d.url);
//     d.picuture = picuture[0];
//     // console.log();
//     // data.picture
//     console.log(d.picuture);
//     // console.log(d);
//   });

//   var margins = { top: 20, right: 20, bottom: 20, left: 20 },
//     widths = 1350 - margins.left - margins.right,
//     heights = 40 - margins.top - margins.bottom;
//   let xScale_small = d3
//     .scaleTime()
//     .domain(d3.extent(data, (d) => d.date))
//     .range([margins.left * 6 + 5, widths])
//     .nice();
//   // var yScale = d3.axisLeft()
//   let yScale_small = d3
//     .scaleTime()
//     .domain(d3.extent(data, (d) => d.hour))
//     .range([margins.bottom, heights - margins.bottom])
//     .nice(d3.timeDay);
//   const sampleSvg = Array.from(d3.selectAll(".small_sample"));
//   for (i of sampleSvg) {
//     const canvas = i.childNodes[0];

//     var circles = d3
//       .select(canvas)
//       .selectAll("circle")
//       .data(data)
//       .join("circle")
//       .append("g")
//       .attr("transform", "translate(0,10)")
//       .attr("class", "cir")
//       .attr("cx", (d) => xScale_small(d.date))
//       .attr("cy", (d) => yScale_small(d.hour))
//       .on("click", function (d, i) {
//         let activenode = d3.selectAll("section>.active").node();
//         if (activenode.getAttribute("id") == "main") {
//           activenode.classList.remove("active");
//           console.log(i);
//           console.log(activenode);
//           activenode.classList.add("main_block");
//           activenode.children[1].classList.add("hide_detailcontainer");
//           activenode.children[1].classList.remove("detailactive");
//         }
//       });
//     // console.log(d3.select(canvas).selectAll("circle"));
//   }
// }
