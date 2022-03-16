const url = "https://api.inaturalist.org/v1/observations/80365";
// d3.json("https://api.inaturalist.org/v1/observations/80365").then(function (d) {
//   showdata(data);
// });
// d3.csv("observations-217852.csv").then(dataloaded);
// function dataloaded(data) {
//   showdata(data);
// }

d3.json(
  "https://api.inaturalist.org/v1/observations/105590604,108630796,105590248"
).then(function (d) {
  datas = d.results;
  // console.log(datas[0]);
  showdata(d.results);
});

function showdata(data) {
  //   console.log(data);
  // data.forEach((d) => {
  //   date = d.time_observed_at;
  //   date = date.slice(0, -6);
  //   d.date = new Date(date);
  //   d.hour = formatTime(d.date);
  //   var parts = d.hour.split(/:/);

  //   var timePeriodMillis =
  //     parseInt(parts[0], 10) * 60 * 60 * 1000 +
  //     parseInt(parts[1], 10) * 60 * 1000 +
  //     parseInt(parts[2], 10) * 1000;
  //   d.hour = new Date();

  //   d.hour.setTime(todayMillis + timePeriodMillis);
  // });

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

  var margins = { top: 20, right: 20, bottom: 20, left: 20 },
    widths = 1350 - margins.left - margins.right,
    heights = 40 - margins.top - margins.bottom;
  let xScale_small = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.date))
    .range([margins.left * 6 + 5, widths])
    .nice();
  // var yScale = d3.axisLeft()
  let yScale_small = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.hour))
    .range([margins.bottom, heights - margins.bottom])
    .nice(d3.timeDay);
  const sampleSvg = Array.from(d3.selectAll(".small_sample"));
  for (i of sampleSvg) {
    const canvas = i.childNodes[0];

    var circles = d3
      .select(canvas)
      .selectAll("circle")
      .data(data)
      .join("circle")
      .append("g")
      .attr("transform", "translate(0,10)")
      .attr("class", "cir")
      .attr("cx", (d) => xScale_small(d.date))
      .attr("cy", (d) => yScale_small(d.hour))
      .on("click", function (d, i) {
        let activenode = d3.selectAll("section>.active").node();
        if (activenode.getAttribute("id") == "main") {
          activenode.classList.remove("active");
          console.log(i);
          console.log(activenode);
          activenode.classList.add("main_block");
          activenode.children[1].classList.add("hide_detailcontainer");
          activenode.children[1].classList.remove("detailactive");
        }
      });
    // console.log(d3.select(canvas).selectAll("circle"));
  }
}
