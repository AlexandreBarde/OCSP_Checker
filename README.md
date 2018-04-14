# OCSP Checker

## Présentation

OCSP Checker est une extension de navigateur web qui permet d’être averti lorsque
l’attestation OCSP du site que vous êtes en train de consulter est trop ancienne.
Elle permet de définir quels sites vous voulez surveiller et, pour chaque site, à partir de
combien de temps vous estimez que l’attestation est trop vieille.

## Installation

### Pour webpack

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

### Pour l'application native

```
./navigateur_install.sh
```

### Tests du module date
Dans la dossier Addon/OCSP\_CHECKER
```
npm run test
```
