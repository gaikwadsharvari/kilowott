/* jshint node: true, esversion: 9 */
"use strict";

const nodemailer = require("nodemailer");
const conf = require("../config/config");

module.exports = {
  sendEmail: function (username,name,surname) {
    let sMessage =
      "*** This is an automatically generated email, please do not reply *** <br><br>" +
      "Dear "+ name +", <br><br>" +
      
      "<ol type='A'><li><b>Here are your temporary login credentials - </b>" +
      "<ul>" +
      "<li>Username - " +
      username +
      " </li>" +
      "<li>Password - Welcome@kilowott </li></ul></li></ol>" +
      "Thank you<br>" +
      "Kind regards,<br>" +
      "Team KILOWOTT<br>";

    let emailBody = "<html><body>" + sMessage + "</body></html>";
    const message = {
      from: "sharvari.v.gaikwad@gmail.com",
      to: username,
      subject: "Kilowott login credentials",
      text: emailBody,
      html: emailBody,
    };
    try {
      console.log(message);
//       let emailer = conf.get("notifier.emailer");
//       const transport = nodemailer.createTransport(emailer);
//       transport.sendMail(message)
    } catch (err) {
      err.message = "Error while sending Email";
      return err;
    }
   
  }
};
