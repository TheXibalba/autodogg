console.log("JS running!");
const path = window.location.pathname;

    const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
   
   if(width <=990){
const brandImgExpanded= document.getElementById("brandImgExpanded");
const brandImgExpandedContainer= document.getElementById("brandImgExpandedContainer");

brandImgExpandedContainer.style.display="none";
brandImgExpanded.style.display="none";
} 





if (path === "/signup") {
    const passwordOfTheUser = document.getElementById("passwordOfTheUser");
    const rePasswordOfTheUser = document.getElementById("rePasswordOfTheUser");

    const formSubmitButton = document.getElementById("submit");
  

    passwordOfTheUser.addEventListener("keyup", (e1) => {

        rePasswordOfTheUser.addEventListener("keyup", (e) => {


            if ((e.target.value) === (e1.target.value)) {



                formSubmitButton.setAttribute("type", "submit");
                formSubmitButton.setAttribute("value", "Sign Up!");

            } else {

                formSubmitButton.setAttribute("type", "none");
                formSubmitButton.setAttribute("value", "Check The Password!");

            }
        });



    });

}


window.addEventListener("resize",(e)=>{
    const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
   
   if(width <=990){
const brandImgExpanded= document.getElementById("brandImgExpanded");
const brandImgExpandedContainer= document.getElementById("brandImgExpandedContainer");

brandImgExpandedContainer.style.display="none";
brandImgExpanded.style.display="none";
} 
});


