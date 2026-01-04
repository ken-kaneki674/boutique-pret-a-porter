@echo off
echo Lancement du serveur backend...
cd backend
start npm start
echo Serveur lance ! Ouverture du site dans 5 secondes...
timeout /t 5
start http://localhost:3000
pause
