'use strict'

// Permet de faire la requete au serveur
const request = require('https').request
// Décodeur pour la réponse
const BasicOCSPResponse = require('asn1.js-rfc2560').BasicOCSPResponse
const OCSPResponse = require('asn1.js-rfc2560').OCSPResponse

module.exports = function (hostname) {
    return new Promise((resolve, reject) => {
        // Faire la requête au serveur en demandant un attestation OCSP
        let req = request({
            host: hostname,
            port: 443,
            requestOCSP: true
        })
        // Quand on est connecté
        req.on('socket', socket => {
            // Quand on recoit la réponse
            socket.on('OCSPResponse', stapled => {
                // Si il n'y a pas eu de réponse, le serveur n'utilise pas OCSP Stapling
                if (!stapled) {
                    resolve('NO_OCSP')
                } else {
                    // Sinon décoder la réponse
                    let res = OCSPResponse.decode(stapled, 'der')
                    let type = res.responseBytes.responseType
                    // Vérifier qu'il s'agisse bien d'une attestation
                    if (type != 'id-pkix-ocsp-basic') {
                        // Sinon le serveur n'utilise pas la bonne implémentation
                        resolve('NO_OCSP')
                    } else {
                        // Décoder le corps de l'attestation
                        let bytes = res.responseBytes.response
                        let basic = BasicOCSPResponse.decode(bytes, 'der')
                        // Recuperer la date de la dernière maj en UNIX timestamp
                        let update = basic.tbsResponseData.responses[0].thisUpdate
                        // La renvoyer
                        resolve(new Date(update))
                    }
                }
            })
        })
        // Impossible de joindre le serveur
        req.on('error', err => {
            reject(err)
        })
    })
}
