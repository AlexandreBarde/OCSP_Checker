#!/bin/sh

# Si on est sur macOS
if [ "$(uname -s)" = "Darwin" ]; then
    # Installer pour l'utilisateur
    TARGET_DIR="$HOME/Library/Application Support/Mozilla/NativeMessagingHosts"
else
    # Si on est sur Linux
    TARGET_DIR="$HOME/.mozilla/native-messaging-hosts"
fi

# Nom de l'application
HOST=com.e2.ocsp_checker

# Créer le repértoire cible
mkdir -p "$TARGET_DIR"

# Répertoire courant
DIR="$(pwd)"

# Copier la manifeste depuis le dossier courant jusqu'a la cible
cp "$DIR/$HOST.json" "$TARGET_DIR"

# Modifier le chemin de l'éxecutable dans le manifeste copié
sed -i "s#/path/to/app#$DIR#" "$TARGET_DIR/$HOST.json"

# Donner les droits de lecture
chmod o+r "$TARGET_DIR/$HOST.json"

# Installer les dépendances de l'application dans le dossier courant
npm install

# S'assurer qu'on ai les droits d'execution sur l'application
chmod o+x app.js

echo "L'application a bien été installée"