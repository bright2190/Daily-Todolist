
exports.getDate = function () {      // this is used to export a block of code
    const today = new Date();
    const option = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
};

return today.toLocaleDateString("en-US", option);
};



exports.getDay = function () {       // this is used to export a block of code
    const today = new Date();
    const option = {
          weekday: "long"
    };
    
    return today.toLocaleDateString("en-US", option); 
    };
    

    
    
    
    
    
    
    
    
    
    
    
    // var today = new Date();
    // var currentDay = today.getDay();
    // var day = "";

    // switch (currentDay) {           // using a switch statement to get the current day in a week
    //     case 0:
    //         day = "Sunday";
    //         break;

    //     case 1:
    //         day = "Monday";
    //         break;

    //     case 2:
    //         day = "Tuesday";
    //         break;
                
    //     case 3:
    //         day = "Wednesday";
    //         break;
                    
    //     case 4:
    //         day = "Thursday";
    //         break;

    //     case 5:
    //         day = "Friday";
    //         break;

    //     case 6:
    //         day = "Saturday";
    //         break;
    
    //     default:
    //     console.log("Error: Current day is equal to: " + currentDay);
    //  }
