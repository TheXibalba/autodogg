const partsTweaked = [
 {   
     name: "HeadLight",  
     url:"../img/parts/headlight.jpg",
     className:"headlight",
     cost: Math.floor(Math.random()*1000)+600
 },{
     name:"Engine Oil",
     url:"../img/parts/oil.jpg",
     className:"oil"
 },{
    name: "Spark Plug", 
    url:"../img/parts/spark.jpg",
    className:"sparkplug",
    cost: Math.floor(Math.random()*100)+600
 },
 {
    name:"Tyres",
    url: "../img/parts/tyre.jpg",
    className:"tyres",
    cost: Math.floor(Math.random()*1500)+600
 }
];



module.exports = partsTweaked;