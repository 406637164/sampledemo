const url = "https://api.inaturalist.org/v1/observations/80365";
// let datas = null;
// function requestHandler() {
//   datas = JSON.parse(this.response);
//   // console.log(datas);
//   // console.log(datas.time_observed_at);
// }

// let req = new XMLHttpRequest();
// req.addEventListener("load", requestHandler);
// req.open("get", url);

// req.send();

// console.log(req);
var datas = null;
d3.json("https://api.inaturalist.org/v1/observations/80365").then(function (d) {
  datas = d.results;
  // console.log(datas[0]);
  console.log(datas[0]);
});

// const citys = [];
// fetch(url)
//   .then((blob) => blob.json())
//   .then((data) => citys.push(data));
// console.log(citys);

// function findMatched(wordToMatch, citys) {
//   return citys.filter((place) => {
//     const regex = new RegExp(wordToMatch, "gi");
//     return place.city.match(regex) || place.state.match(regex);
//   });
// }

// function inputHandler() {
//   const matchArray = findMatched(this.value, cities);
// }
