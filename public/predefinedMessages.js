const predefinedMessages=(name,option,date,RCN,message,carModel,carYear,problem,email,pass,contact,longMessage,address)=>{
    switch(option){
        case 1:

            return(`<h4>Greetings ${name}!</h4><br>
            Thank you for Signing up with us, we are glad to welcome you to the AutoDogg Family!<br>
            <ul> 
            <li><b>Username: ${email}</b></li>
            <li><b>Password: ${pass}</b></li>
            </ul>
            <br>Browse our high quality spare parts catalog and buy them at competitive Prices!<br>
            <br><b>Thank You For Choosing AutoDogg!</b>
            `);
    break;
    case 2:
        return(`Dear ${name},<br>This is to inform you that we have received your request for the assistance and our executive will contact you shortly.<br>
        <br><b>Particulars Of The Assistance Request:</b><br>
        <ul> 
        <li><b>Car Model: ${carModel}</b></li>
        <li><b>Manufactured In Year: ${carYear}</b></li>
        <li><b>Car Registration Number: ${RCN}</b></li>
        <li><b>Problem(s): ${problem}</b></li>
        <li><b>Addtional Information: </b><em>${message}</em></li>
        </ul>
        <b>Thank You For Using AutoDogg! </b>
        `);
    break;
    case 3:
        return(` 
        <h4> Greetings ${name}! </h4><br><em>This is to inform you that your slot has been booked successfully!</em><br>
       <br><b>Particulars Of The Appointment:</b> <br>
        <ul> 
        <li><b>Car Model: ${carModel}</b></li>
        <li><b>Manufactured In Year: ${carYear}</b></li>
        <li><b>Car Registration Number: ${RCN}</b></li>
        <li><b>Problem(s): ${problem}</b></li>
        <li><b>Appointment Date: ${date}</b></li>
        <li><b>Addtional Information: </b><em>${message}</em></li>
        </ul>
        <b>Thank You For Using AutoDogg! </b>
        `);
       
    break;
    case 4:
        return(`<h4>Greetings ${name}!</h4><br>
        Thank you for Contacting us! We will contact you in the next 24 hours.<br>
        <br>Meanwhile, browse our high quality spare parts catalog and buy them at competitive Prices!<br>
        <br><b>Thank You!</b>
        `);

    break;
    case 5:
        return(` 
        <h4>Slot Booking requested by: <b>${name}</b></h4><br>
       <br><b>Particulars Of The Appointment:</b> <br>
        <ul> 
        <li><b>Car Model: ${carModel}</b></li>
        <li><b>Manufactured In Year: ${carYear}</b></li>
        <li><b>Car Registration Number: ${RCN}</b></li>
        <li><b>Problem(s): ${problem}</b></li>
        <li><b>Appointment Date: ${date}</b></li>
        <li><b>Addtional Information: </b><em>${message}</em></li>
        </ul>
      
        `);
       
    break;
    case 6:
        return(`Assistance was requested by:  <b>${name}</b><br>
        <br><b>Particulars Of The Assistance Request:</b><br>
        <ul> 
        <li><b>Car Model: ${carModel}</b></li>
        <li><b>Manufactured In Year: ${carYear}</b></li>
        <li><b>Car Registration Number: ${RCN}</b></li>
        <li><b>Problem(s): ${problem}</b></li>
        <li><b>Addtional Information: </b><em>${message}</em></li>
        </ul>
        
        `);
    break;
    case 7:
        return(`<h4>A customer has contacted</b></h4><br>
        Particulars:<br>
        <ul> 
        <li><b>Name: ${name}</b></li>
        <li><b>Contact Number: ${contact}</b></li>
        <li><b>Message: </b><em>${message}</em></li>
        </ul>
        `);

    break;
    case 8:
        return(`<h4>Greetings ${name}!</h4><br>
        Thank you for Ordering from us! Your order will be shipped within 24 hours.<br>
        <b>Address: </b> <p>${address}</p><br>
        <b>Order Particulars:</b> <br>
        <br><p>${longMessage}</p> <br>
        <br><b>Thank You for Choosing AutoDogg!</b>
        `);

        break;
    case 9:
        return(`<h4>Order Requested By: ${name}!</h4><br>
        <b>Contact Number: ${contact}</b>
        <b>Address: </b> <p>${address}</p> <br>
        <b>Addtional Information: </b><em>${message}</em> <br>
        <b>Order Particulars:</b> <br>
        <br><p>${longMessage}</p> <br>
        <br><b>Thank You for Choosing AutoDogg!</b>
        `);

        break;
    default:
        return("Oops! there was an error while processing your request. Please try again later.")  ;  
    }
    

}

    
module.exports = predefinedMessages;