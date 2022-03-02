var margin = { top: 10, right: 10, bottom: 10, left: 10 },
  width = 1350 - margin.left - margin.right,
  height = 320 - margin.top - margin.bottom;

var svg = d3
  .select(".main_sample")

  .append("svg")
  .attr("transform", `translate(0,${margin.top})`)
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

  var rectcolor = ["#EFF4AC", "#34C4E3", "#000000"];
  svg
    .selectAll("rect")
    .data(rectcolor)
    .enter()
    .append("rect")
    .attr("x", 60)
    .attr("y", (d, i) => 95 * i)
    .attr("width", 1280)
    .attr("height", 102)
    .attr("fill", (d) => d)
    .attr("opacity", 0.2);
  var datas = [
    { collector: "rurubisco", rank: 8, score: 30 },
    { date: "2020-04-23 00:39:28", quality: "good" },

    { date: "2020-04-26 12:10:31", quality: "unknown" },
    { date: "2020-04-27 08:24:00", quality: "bad" },
    { date: "2020-04-28 08:24:00", quality: "bad" },
    { date: "2020-04-30 01:10:31", quality: "bad" },
  ];

  var main_rank = d3
    .select(".main_rank")
    .data(datas)
    .text((d) => d.rank);
  var main_collector = d3
    .select(".main_collector")
    .data(datas)
    .text((d) => d.collector);

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
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  todayMillis = today.getTime();
  datas.forEach((d) => {
    d.date = new Date(d.date);
    //   console.log(formatDay(d.date));
    d.hour = formatTime(d.date);
    // console.log(d.hour);
    var parts = d.hour.split(/:/);

    var timePeriodMillis =
      parseInt(parts[0], 10) * 60 * 60 * 1000 +
      parseInt(parts[1], 10) * 60 * 1000 +
      parseInt(parts[2], 10) * 1000;
    d.hour = new Date();
    //   d.hour.setTime(todayMillis + timePeriodMillis);
    d.hour.setTime(todayMillis + timePeriodMillis);
    console.log(d.hour);
  });
  var xScale = d3
    .scaleTime()
    .domain(d3.extent(datas, (d) => d.date))
    .range([margin.left * 6 + 5, width])
    .nice();
  var xAxis = d3
    .axisBottom(xScale)
    .tickFormat(d3.timeFormat("%Y/%m/%d"))
    .ticks(4);

  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .selectAll("text")
    .style("font-size", "15px");
  // var yScale = d3.axisLeft()
  var yScale = d3
    .scaleTime()
    .domain(d3.extent(datas, (d) => d.hour))
    .range([margin.bottom, height - margin.bottom])
    .nice(d3.timeDay);
  var yAxis = d3
    .axisLeft(yScale)
    .tickFormat(d3.timeFormat("%H:%M"))

    .ticks(10);

  svg
    .append("g")
    .attr("transform", "translate(60,0)")
    .call(yAxis)
    .selectAll("text")
    .style("font-size", "15px");
  svg

    .selectAll("circle")
    .data(datas)
    .enter()
    .append("g")
    .classed("circles", true)
    .append("circle")
    .attr("class", "cir")
    .attr("cx", (d) => xScale(d.date))
    .attr("cy", (d) => yScale(d.hour))
    .on("click", function (d, i) {
      console.log(i);
    })
    .filter((d) => d.rank === undefined)
    .attr("r", 10.5)
    .attr("fill", function (d) {
      console.log(d.quality);
      if (d.quality == "good") {
        return "green";
      } else if (d.quality == "bad") {
        return "red";
      } else {
        return "black";
      }
    });
  svg
    .selectAll(".circles")
    .data(datas)
    .filter((d) => d.quality == "unknown")
    .append("text")
    .text((d) => d.quality)
    .attr("x", (d) => xScale(d.date) + 3)
    .attr("y", (d) => yScale(d.hour) - 10)
    .attr("font-size", "1.25rem")
    .attr("fill", "gray");

  document.querySelector(".main_block").addEventListener("click", function () {
    // document.querySelector(this);
    document.querySelector(this);
  });
  // d3.select(".main_block").on("click", function () {
  //   d3.select(this).node().children[1];
  //   // console.log();
  // });
  // svg
  //   .selectAll("circle")
  //   .data(datas)
  //   .join("text")
  //   .text((d) => d.quality)
  //   .attr("x", xScale(d.date))
  //   .attr("y", yScale(d.hour))
  //   .attr("font-family", "sans-serif")
  //   .attr("font-size", "11px");
  // var margin2 = { top: 10, right: 10, bottom: 10, left: 10 },
  //   width2 = 1350 - margin.left - margin.right,
  //   height2 = 100 - margin.top - margin.bottom;
  // var svgs = d3
  //   .select(".second_sample")
  //   .append("svg")
  //   .attr("transform", `translate(0,20)`)
  //   .attr("width", width2 + margin2.left + margin2.right)
  //   .attr("height", height2 + margin2.top + margin2.bottom)
  //   .append("g");
  // var datas2 = [
  //   { collector: "v9320032", rank: 2, score: 90 },
  //   { date: "2020-04-23 00:39:28", quality: "good" },

  //   { date: "2020-04-24 01:10:31", quality: "good" },
  //   { date: "2020-04-25 01:10:31", quality: "good" },
  //   { date: "2020-04-26 18:24:00", quality: "bad" },
  //   { date: "2020-04-27 13:24:00", quality: "good" },
  // ];
  // var second_rank = d3
  //   .select(".second_rank")
  //   .data(datas2)
  //   .text((d) => d.rank);
  // var second_collector = d3
  //   .select(".second_collector")
  //   .data(datas2)
  //   .text((d) => d.collector);

  // var second_score_text = d3.select(".second_score_text").data(datas2);
  // // .text((d) => d.score);
  // var second_score = d3
  //   .select(".second_progress")
  //   .data(datas2)
  //   .attr("value", (d) => d.score);

  // datas2.forEach((d) => {
  //   d.date = new Date(d.date);
  //   //   console.log(formatDay(d.date));
  //   d.hour = formatTime(d.date);
  //   // console.log(d.hour);
  //   var parts = d.hour.split(/:/);

  //   var timePeriodMillis =
  //     parseInt(parts[0], 10) * 60 * 60 * 1000 +
  //     parseInt(parts[1], 10) * 60 * 1000 +
  //     parseInt(parts[2], 10) * 1000;
  //   d.hour = new Date();
  //   //   d.hour.setTime(todayMillis + timePeriodMillis);
  //   d.hour.setTime(todayMillis + timePeriodMillis);
  //   console.log(d.hour);
  // });
  // var xScale = d3
  //   .scaleTime()
  //   .domain(d3.extent(datas2, (d) => d.date))
  //   .range([margin.left * 6 + 5, width2])
  //   .nice();
  // var xAxis = d3
  //   .axisBottom(xScale)
  //   .tickFormat(d3.timeFormat("%Y/%m/%d"))
  //   .ticks(4);

  // // var yScale = d3.axisLeft()
  // var yScale = d3
  //   .scaleTime()
  //   .domain(d3.extent(datas2, (d) => d.hour))
  //   .range([margin.bottom, height2 - margin.bottom])
  //   .nice(d3.timeDay);
  // var yAxis = d3
  //   .axisLeft(yScale)
  //   .tickFormat(d3.timeFormat("%H:%M"))

  //   .ticks(10);

  // svgs
  //   .selectAll("circle")
  //   .data(datas2)
  //   .enter()
  //   .append("circle")

  //   .attr("class", "cir")
  //   .attr("cx", (d) => xScale(d.date))
  //   .attr("cy", (d) => yScale(d.hour))
  //   .on("click", function (d, i) {
  //     console.log(i);
  //   })
  //   .filter((d) => d.rank === undefined)
  //   .attr("r", 6.5)
  //   .attr("fill", function (d) {
  //     console.log(d.quality);
  //     if (d.quality == "good") {
  //       return "green";
  //     } else if (d.quality == "bad") {
  //       return "red";
  //     } else {
  //       return "black";
  //     }
  // });

  // var margin3 = { top: 10, right: 10, bottom: 10, left: 10 },
  //   width3 = 1350 - margin.left - margin.right,
  //   height3 = 50 - margin.top - margin.bottom;
  // var svgs = d3
  //   .select(".small_sample")
  //   .append("svg")
  //   .attr("transform", `translate(0,3)`)
  //   .attr("width", width3 + margin3.left + margin3.right)
  //   .attr("height", height3 + margin3.top + margin3.bottom)
  //   .append("g");
  // var datas3 = [
  //   { collector: "naturalist14740", rank: 1, score: 90 },
  //   { date: "2020-04-23 00:39:28", quality: "good" },

  //   { date: "2020-04-24 04:10:31", quality: "good" },
  //   { date: "2020-04-25 01:10:31", quality: "good" },
  //   { date: "2020-04-26 18:24:00", quality: "good" },
  //   { date: "2020-04-27 13:24:00", quality: "good" },
  // ];
  // var small_rank = d3
  //   .select(".small_rank")
  //   .data(datas3)
  //   .text((d) => d.rank);
  // var small_collector = d3
  //   .select(".small_collector")
  //   .data(datas3)
  //   .text((d) => d.collector);

  // var small_score_text = d3.select(".second_score_text").data(datas3);
  // // .text((d) => d.score);
  // var small_score = d3
  //   .select(".small_progress")
  //   .data(datas3)
  //   .attr("value", (d) => d.score);

  // datas3.forEach((d) => {
  //   d.date = new Date(d.date);
  //   //   console.log(formatDay(d.date));
  //   d.hour = formatTime(d.date);
  //   // console.log(d.hour);
  //   var parts = d.hour.split(/:/);

  //   var timePeriodMillis =
  //     parseInt(parts[0], 10) * 60 * 60 * 1000 +
  //     parseInt(parts[1], 10) * 60 * 1000 +
  //     parseInt(parts[2], 10) * 1000;
  //   d.hour = new Date();
  //   //   d.hour.setTime(todayMillis + timePeriodMillis);
  //   d.hour.setTime(todayMillis + timePeriodMillis);
  //   console.log(d.hour);
  // });
  // var xScale = d3
  //   .scaleTime()
  //   .domain(d3.extent(datas3, (d) => d.date))
  //   .range([margin.left * 6 + 5, width2])
  //   .nice();
  // var xAxis = d3
  //   .axisBottom(xScale)
  //   .tickFormat(d3.timeFormat("%Y/%m/%d"))
  //   .ticks(4);

  // // var yScale = d3.axisLeft()
  // var yScale = d3
  //   .scaleTime()
  //   .domain(d3.extent(datas2, (d) => d.hour))
  //   .range([margin.bottom, height3 - margin.bottom])
  //   .nice(d3.timeDay);
  // var yAxis = d3
  //   .axisLeft(yScale)
  //   .tickFormat(d3.timeFormat("%H:%M"))

  //   .ticks(10);

  // svgs
  //   .selectAll("circle")
  //   .data(datas3)
  //   .enter()
  //   .append("circle")

  //   .attr("class", "cir")
  //   .attr("cx", (d) => xScale(d.date))
  //   .attr("cy", (d) => yScale(d.hour))
  //   .on("click", function (d, i) {
  //     console.log(i);
  //   })
  //   .filter((d) => d.rank === undefined)
  //   .attr("r", 3.5)
  //   .attr("fill", function (d) {
  //     console.log(d.quality);
  //     if (d.quality == "good") {
  //       return "green";
  //     } else if (d.quality == "bad") {
  //       return "red";
  //     } else {
  //       return "black";
  //     }
  //   });
}
