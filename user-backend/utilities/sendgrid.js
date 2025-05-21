const sendgridMail = require('@sendgrid/mail');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

const formatedDate = () => {
    return new Date().toLocaleString('en-us', {
          day: 'numeric'
        , month: 'short'
        , year: 'numeric'
        , hour: 'numeric'
        , minute: 'numeric'
    });
};

// get templates for sending email in format
const getTemplate = (filename, body) => {
    console.log('utilities/sendgrid.js: getTemplate("'+filename+'", body)');
    body.dDate = formatedDate();
    const emailTemplatePath = path.join(__dirname, 'email_templates', filename);
    console.log('emailTemplatePath = ', emailTemplatePath);
    const template = fs.readFileSync(emailTemplatePath, { encoding: 'utf-8' });
    //console.log('template = ', template);
    console.log('template.length = ', template.length);
    return ejs.render(template, body);
};

const collection = {

    verification: body => ({
          subject: 'Account Activation'
        , html: getTemplate('account-activation.html', body)
    })

    , resetPassword: body => ({
          subject: 'Reset Password'
        , html: getTemplate('reset-password.html', body)
    })

};

const sendgridService = {};

sendgridService.send = function (type, body, callback) {
    console.log('utilities/sendgrid.js: sendgridService.send(type:'+type+', body:'+body+', callback)');

    console.log('type = ', type);
    console.log('body = ', body);
    console.log('callback = ', callback);
    console.log('process.env.SUPPORT_EMAIL = ' + process.env.SUPPORT_EMAIL);

    let fromAddress = 'RealSplit™ <' + process.env.SUPPORT_EMAIL + '>';
    console.log('fromAddress = ', fromAddress);

    let subject = type(body).subject;
    let htmlBody = type(body).html;
    console.log('subject = ', subject);
    //console.log('htmlBody = ', htmlBody);
    console.log('htmlBody.length = ', htmlBody.length);

    //   if (process.env.NODE_ENV !== 'prod') return callback();
    return new Promise((resolve, reject) => {

        const sendgridParams = {
              to: body.email
            , from: fromAddress
            , subject: subject
            , html: htmlBody
        };
        //console.log('sendgridParams = ', sendgridParams);
        console.log('sendgridParams.to = ', sendgridParams.to);
        console.log('sendgridParams.from = ', sendgridParams.from);
        console.log('sendgridParams.subject = ', sendgridParams.subject);

        sendgridMail
            .send(sendgridParams)
            .then(response => {
                //console.log('response = ', response);
                callback ? callback(null, response) : resolve(response)
            })
            .catch(error => {
                console.log('error = ', error);
                (callback ? callback(error) : reject(error))
            });
    });
};

module.exports = { ...sendgridService, ...collection };
