const parts = [
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
       className:"spark",
       cost: Math.floor(Math.random()*100)+600
    },
    {
       name:"Tyres",
       url: "../img/parts/tyre.jpg",
       className:"tyre",
       cost: Math.floor(Math.random()*1500)+600
    }
   ];
   
   
   
export default parts;