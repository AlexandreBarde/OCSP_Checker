#!/usr/bin/env node

'use strict'

const getUpdate = require('./lib/ocsp_stapling')
const nativeMessaging = require('./lib/native_messaging')
const input = new nativeMessaging.Input();
const transform = new nativeMessaging.Transform(handle_message);
const output = new nativeMessaging.Output()

process.stdin
    .pipe(input)
    .pipe(transform)
    .pipe(output)
    .pipe(process.stdout)

// Quand on reçoit un message
function handle_message(msg, push, done) {
    // Recuperer la maj OCSP du serveur du message
    let p_date = getUpdate(msg.url)
    p_date.then(date => {
        // Et la renvoyer à l'application
        push(date)
        done()
    }).catch(err => {
        push('SERVER_ERROR')
        done()
    })
}
