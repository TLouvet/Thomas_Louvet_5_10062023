# Thomas_Louvet_5_10062023

# Prérequis

- Node v14+
- yarn 
- Java 11+
- Maven 

# Installation

- Clôner le projet avec ```git clone https://github.com/TLouvet/Thomas_Louvet_5_10062023.git```
- Se déplacer dans le dossier nouvellement créé puis dans le sous-dossier front, lancer la commande ```yarn```
- Se déplacer dans le dossier back, puis créer le fichier application.properties à partir de l'exemple fourni. NOTE: la clé jwt token fournie sert à une version de test, ne pas l'utiliser en production.
- Importer les ressources SQL disponibles depuis le dossier ressources
 
# Lancement des tests

## Backend 

- Lancer ```mvn clean test```, cela lancera les tests et génèrera le rapport jacoco

## Frontend

- Lancer ```yarn test``` pour éxécuter les tests, rajouter l'option ```--coverage``` pour regénérer le dossier de coverage
- Lancer ```yarn e2e``` pour ouvrir l'interface Cypress, tester le flow via le test fourni, le coverage se génère dans le dossier coverage.
