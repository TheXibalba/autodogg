console.log("JS running!");

const passwordOfTheUser=document.getElementById("passwordOfTheUser");
const rePasswordOfTheUser=document.getElementById("rePasswordOfTheUser");

const tick=document.getElementById("tick");
const formSubmitButton=document.getElementById("submit");
let tempValue="";

passwordOfTheUser.addEventListener("keyup",(e1)=>{

rePasswordOfTheUser.addEventListener("keyup",(e)=>{


if((e.target.value)===(e1.target.value)){
    

   
    formSubmitButton.setAttribute("type","submit");
    formSubmitButton.setAttribute("value","Sign Up!");
    
}else{

    formSubmitButton.setAttribute("type","none");
    formSubmitButton.setAttribute("value","Check The Password!");
    
}
});



});


