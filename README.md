# test_backend
Ce projet est testé sous Postman.
Pour commencer, il faut tapez le commande: "npm install" pour installer les dépendances.
Pour démarrer le serveur, tapez npm start

Selon la structure du code, les Urls disponibles sont les suivants:

POST http://localhost:8000/user/login
exemple
tsiry@gmail.com passwd: passwd
solo@gmail.com  passwd: passwd

Pour se connecter

 DELETE http://localhost:8000/user/:id

Pour supprimer l'utilisateur
 exemple: http://localhost:8000/user/Jtt75FugdzM4ee9W2kFL

  POST http://localhost:8000/user/register 
  pour inscrire un utilisateur

http://localhost:8000/resource/songs/

pour lister les audios


http://localhost:8000/resource/songs/:id
pour lister un audio spécifique

http://localhost:8000/resource/bills/
pour lister les factures.


pour intérpreter sur l'abonnement, il y a de type, Lite, de premium.
Il y a aussi l'utilisateur admin et utilisateur simple. 

