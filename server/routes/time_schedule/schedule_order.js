var cron = require('node-cron');

function scheduleOrder(){   

    var currDate= new Date();
    var taskTime= currDate.setSeconds(currDate.getSeconds() + 120);

    var task = cron.schedule('* * * * *', () => {
        if(new Date().getTime() > taskTime){
            console.log("assign dekivery to particular order details");
            task.stop();
        }
        else{
             console.log("cronJob running");
        }

    },{scheduled: false});
    
    task.start();
};    

module.exports= {scheduleOrder};