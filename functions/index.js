const fs = require('fs')
const express = require('express');
const app = express();
const port = 3000;

app.get('/inquiry', (req, res) => {

     // Getting data from valist.json
     let vaList        = JSON.parse(fs.readFileSync('./valist.json'));

    // Checking if there is a virtual account number
    let vaNumber      = vaList.find(va => va.va_number === req.query.vaNo);

    // Returns the response when the payment status has been paid
    if (vaNumber.status == '1')
    {
        var response = {
            "inquiryVAResponse":
            {
                "responseCode": "88",
                "responseMessage": "Bill alerady paid"
            }
        }
        return res.status(422).json(response);
    };

    // Response success
    var response = {
        "inquiryVAResponse":
        {
            "responseCode": "00",
            "responseMessage": "Success",
            "detailResponse": {
                "vaName": vaNumber.name,
                "billingAmount": vaNumber.amount,
                "currency": vaNumber.currency,
                "reference": vaNumber.reference
            }
        }
    };
    return res.status(200).json(response);
});

app.get('/payment', (req, res) => {

    // Getting data from valist.json
    let vaList        = JSON.parse(fs.readFileSync('./valist.json'));

    // Checking if there is a virtual account number
    let vaNumber      = vaList.find(va => va.va_number === req.query.vaNo);

    // Returns the response when there is no virtual account number
    if (!vaNumber) 
    {
        var response = {
            "inquiryVAResponse":
            {
                "responseCode": "14",
                "responseMessage": "Record Specified was not found in the database"
            }
        }
        return res.status(422).json(response);
    };

    // Returns the response when the payment status has been paid
    if (vaNumber.status == '1')
    {
        var response = {
            "inquiryVAResponse":
            {
                "responseCode": "88",
                "responseMessage": "Bill alerady paid"
            }
        }
        return res.status(422).json(response);
    };

    // Checking when closed payment does the amount match
    if(vaNumber.scenario === '1')
    {
        if(vaNumber.amount != req.query.amount)
        {
            var response = [{
                "inquiryVAResponse":
                {
                    "responseCode": "13",
                    "responseMessage": "Invalid Amount"
                }
            }]
            return res.status(422).json(response);
        }
    }

    // Response success
    var response = {
        "paymentVAResponse": 
        {
            "responseCode": "00",
            "responseMessage": "Success"
        }
    }
    return res.status(200).json(response);
});

app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`);
});