# Pour webpack

Dans le dossier Firefox/

Après avoir installé NodeJS

1. Installer les dépendances:
```
npm install
```

2. Installer webpack

```
sudo npm install webpack -g
```

3. Compiler les \*.bundle.js:
```
webpack
```

4. Compiler à chaque modification
```
webpack --watch
```

# Pour l'application native

Copier *com.e2.ocsp_checker.json* dans *~/.mozilla/NativeMessagingHosts/*

Modifier la valeur de *path* dans le JSON avec l'emplacement de app.js:
*/emplacement-du-repo/Native/app.js*

Installer les dépendance:
Dans Native/

```
npm install
```

Vérifier que l'application marche

```
echo 100 | ./app.js
```

Ne devrait rien afficher
