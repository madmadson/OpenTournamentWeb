'use strict';

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const secureCompare = require('secure-compare');
const nodemailer = require('nodemailer');

const _ = require('lodash');

const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(
  `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

exports.mailForTournamentManager = functions.https.onRequest((req, res) => {

  const key = req.query.key;

  // Exit if the keys don't match
  if (!secureCompare(key, functions.config().cron.key)) {
    console.log('The key provided in the request does not match the key set in the environment. Check that', key,
      'matches the cron.key attribute in `firebase env:get`');
    res.status(403).send('Security key does not match. Make sure your "key" URL query parameter matches the ' +
      'cron.key environment variable.');
    return;
  }

  admin.database().ref('/tournaments').once('value').then(tournaments => {

    tournaments.forEach(function (snap) {

      const tournament = snap.val();
      if (tournament && !tournament.finished && tournament.creatorMail) {
        console.log('send mail to: ' + tournament.creatorMail);

        const regs = [];
        const lists = [];

        admin.database().ref('/tournament-registrations/' + snap.key).once('value').then(registrations => {
          registrations.forEach(function (snap) {
            const registration = snap.val();
            regs.push(registration);
          });
        }).then(function () {

          admin.database().ref('/tournament-armyLists/' + snap.key).once('value').then(armyLists => {
            armyLists.forEach(function (snap) {
              const armyList = snap.val();
              lists.push(armyList);
            });
          }).then(function () {

            const mailOptions = {
              from: '"OpenTournament" <noreply@firebase.com>',
              to: tournament.creatorMail
            };

            mailOptions.subject = 'Daily Mail for your Tournament: ' + tournament.name;
            mailOptions.text = 'Hello,\n';

            mailOptions.text = mailOptions.text + 'Here is a list of all registrations and armyLists:\n';

            mailOptions.text = mailOptions.text + 'Registrations: \n';
            _.each(regs, function (registration) {
              mailOptions.text = mailOptions.text + registration.playerName + '\n';
            });

            mailOptions.text = mailOptions.text + '\nArmyLists: \n';
            _.each(lists, function (armyList) {
              mailOptions.text = mailOptions.text + armyList.playerName + '\n';
              mailOptions.text = mailOptions.text + armyList.name + '\n';
            });

            mailOptions.text = 'You can switch off this mail in the configuration of your tournament';
            mailOptions.text = 'Thanks, Your OpenTournament team';

            mailTransport.sendMail(mailOptions).then(() => {
              console.log('Send mail to ' + tournament.creatorMail);
            }).catch(error => {
              console.error('There was an error while sending the email:', error);
            });

          }); // end armyLists
        }); // end registrations
      } // end check for tournament finished/mail set
    }); // end tournaments loop
  });  // end tournaments
  return res.status(200).send('Sending mails successfully');
}); // end functions
