#!/usr/bin/env node

'use strict'

const getUpdate = require('./lib/ocsp_stapling')
const nativeMessaging = require('./lib/native_messaging')
const input = new nativeMessaging.Input();
const transform = new nativeMessaging.Transform(handle_message);
const output = new nativeMessaging.Output()

/**
 * Faire passer le contenu de l'entrée standard
 * en temps qu'objet dans l'application,
 * deleguer le traitement du message à handle_message
 * puis renvoyer le message créer en tant qu'octets
 * précédé par sa longueur sur la sortie standard
 */
process.stdin
    .pipe(input)
    .pipe(transform)
    .pipe(output)
    .pipe(process.stdout)

// Quand on reçoit un message
function handle_message(msg, push, done) {
    // Recuperer la maj OCSP du serveur du message
    let p_date = getUpdate(msg.hostname)
    p_date.then(date => {
        // Et la renvoyer à l'application
        push({ update: date })
        done()
    }).catch(err => {
        // Si on a pas pu se connecter au serveur
        // envoyer le message d'erreur à l'extension
        push('SERVER_ERROR')
        done()
    })
}
