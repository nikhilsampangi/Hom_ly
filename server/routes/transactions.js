const https= require('https');

const checksum_lib = require('../config/paytm/checksum');

const MID= "VVdwCu48262795226018";
const MK= "MlZSaA0@T0WuIBW1";

function payment(paymentData, callback){

    let params ={};

    params['MID'] = MID,
    params['WEBSITE'] = 'WEBSTAGING',
    params['CHANNEL_ID'] = 'WEB',
    params['INDUSTRY_TYPE_ID'] = 'Retail',
    params['ORDER_ID'] = paymentData.orderId,
    params['CUST_ID'] = paymentData.customerId,
    params['TXN_AMOUNT'] = paymentData.amount,
    params['CALLBACK_URL'] = 'http://localhost:8008/transaction/success',
    params['EMAIL'] = paymentData.email,
    params['MOBILE_NO'] = paymentData.phoneNumber

    checksum_lib.genchecksum(params, MK ,function(err,checksum){
        if(err) {
            callback(err, null);
        }else {    
            params['CHECKSUMHASH'] = checksum;
            callback(null, params);
        }   
        
    })

}


function verifyCheckSum(verifyData){

    var paytmChecksum = "";

    var paytmParams = {};

    for(var key in verifyData){
        
        if(key == "CHECKSUMHASH") {
            paytmChecksum = verifyData[key];
        }else {
            paytmParams[key] = verifyData[key];
        }
    }

    var isValidChecksum = checksum_lib.verifychecksum(paytmParams, MK, paytmChecksum);
        if(isValidChecksum) {
            return true
        } else {
            return false
        }
}

function success(resData, callback){

    const verified= verifyCheckSum(resData);

    if(!verified) {
        callback("something went wrong, forgery request!!!", null);
    }else {

        var paytmParams = {};

        paytmParams["MID"] = MID;

        paytmParams["ORDERID"] = resData.ORDERID;

        checksum_lib.genchecksum(paytmParams, MK , function(err, checksum){
            if(err) {
                callback(err, null);
            }else {
                paytmParams["CHECKSUMHASH"] = checksum;

                var post_data = JSON.stringify(paytmParams);

                var options = {
                    hostname: 'securegw-stage.paytm.in',
                    port: 443,
                    path: '/order/status',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': post_data.length
                    }
                };

                // Set up the request
                var successData = "";
                var reqPaytm = https.request(options);
                reqPaytm.write(post_data);
                reqPaytm.end();

                
                reqPaytm.on('error', (err)=>{
                    callback(err, null);
                }) 

                reqPaytm.on('response', (response)=>{
                    response.on('error', (err)=>{
                        callback(err, null);
                    });
                    response.on('data', (chunk)=>{
                        successData += chunk;
                    });
                    response.on('end', ()=>{
                        callback(null, successData);
                    })
                });   
                
            }     
        });
    }

}

module.exports= {payment, success, verifyCheckSum};