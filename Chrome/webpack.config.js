const path = require('path')

module.exports = {
    // Fichiers en entrée
    entry: {
        background: path.join(__dirname, "src", "background.js"),
        content: path.join(__dirname, "src", "content.js"),
        popup: path.join(__dirname, "src", "popup.js")
    },
    // Fichier compilés en sortie
    output: {
        path: path.join(__dirname, "dist", "js"),
        filename: "[name].bundle.js"
    }
}
