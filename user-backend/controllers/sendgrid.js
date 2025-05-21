const {
      SendgridEvent
} = require('../models/index');

const HttpResponse = require('../utilities/HttpResponse');

const processEvent = async (event) => {
    console.log('controllers/sendgrid.js: processEvent(event)', event);

    const sendgridEventCreate = {
          email: event.email
        , timestamp: event.timestamp
        , smtpId: event['smtp-id']
        , event: event.event
        , bounceClassification: event.bounce_classification
        , category: event.category
        , sgEventId: event.sg_event_id
        , sgMessageId: event.sg_message_id
        , response: event.response
        , attempt: event.attempt
        , reason: event.reason
        , status: event.status
        , type: event.type
    };
    console.log("sendgridEventCreate = ", sendgridEventCreate);

    try {

        //*
        console.log("await SendgridEvent.create(sendgridEventCreate);");
        //SendgridEvent.create(sendgridEventCreate);
        const sendgridEvent = await SendgridEvent.create(sendgridEventCreate);
        console.log("sendgridEvent = ", sendgridEvent);
        //*/
        /*
        console.log("SendgridEvent.create(sendgridEventCreate);");
        SendgridEvent.create(sendgridEventCreate)
            .then(function(sendgridEvent) {
                console.log("sendgridEvent = ", sendgridEvent);
            })
            .catch(function (err) {
                console.error(err);
                console.log("err = ", err);
            });
        //*/

    } catch(error) {
        console.error(error);
        console.log('error = ', error);
    }
};

exports.sendgridEvent = async (req, res) => {
    console.log('controllers/sendgrid.sendgridEvent(req, res)');

    let events = req.body;
    if (events) {
        //console.log('events = ', events);
        console.log('events = ', events.length);
        events.forEach(function (event) {
            // Here, you now have each event and can process them how you like
            processEvent(event);
        });
    }

    return HttpResponse.successResponse(
          res
        , 'SendGrid Events Saved Successfully'
    );
};