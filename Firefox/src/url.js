/**
 * Récupère le nom d'hote d'une URL donnée 
 * @param {String} url 
 */
module.exports = function (url) {
    let parser = document.createElement('a')
    parser.href = url
    return parser.hostname
}
