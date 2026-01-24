# KENOVARDY'Shop - Parfumerie en Ligne

Bienvenue dans le projet **KENOVARDY'Shop**, une application e-commerce moderne dédiée à la vente de parfums et produits de beauté.

## 📋 Description

Ce projet est une boutique en ligne complète permettant aux utilisateurs de consulter un catalogue de produits (parfums, brumes, déodorants), de gérer un panier d'achat et de passer commande. Il inclut également une interface d'administration pour la gestion des articles.

## ✨ Fonctionnalités

### Côté Client (Frontend)

- **Catalogue interactif** : Filtrage par catégories (Parfums, Brumes, Déodorants).
- **Panier dynamique** : Ajout de produits, gestion des quantités, persistance via LocalStorage.
- **Pages d'information** : À propos, Contact, FAQ, Guide des tailles, etc.
- **Design moderne** : Interface soignée et réactive utilisant Tailwind CSS.

### Côté Serveur (Backend)

- **API REST** : Gestion des articles (CRUD) et des commandes.
- **Base de données** : Stockage des données léger (fichiers JSON/SQLite).
- **Interface Admin** : Page dédiée (`admin.html`) pour ajouter, modifier ou supprimer des articles du catalogue.

## 🚀 Installation et Lancement

### Prérequis

- [Node.js](https://nodejs.org/) installé sur votre machine.

### Méthode Rapide (Windows)

Double-cliquez simplement sur le fichier **`start_website.bat`** situé à la racine du projet.
Cela exécutera automatiquement les commandes nécessaires et ouvrira le site dans votre navigateur par défaut.

### Méthode Manuelle

1. **Ouvrez un terminal** et naviguez vers le dossier `backend` :

    ```bash
    cd backend
    ```

2. **Installez les dépendances** du serveur :

    ```bash
    npm install
    ```

3. **Démarrez le serveur** :

    ```bash
    npm start
    ```

4. **Accédez au site** :
    Ouvrez votre navigateur et allez à l'adresse : [http://localhost:3000](http://localhost:3000)

## 📂 Structure du Projet

- **`/` (Racine)** : Contient tous les fichiers HTML statiques (index.html, panier.html, admin.html...) et les scripts JavaScript frontend (articles.js, panier.js...).
- **`/backend`** : Héberge le serveur Node.js/Express (`server.js`) et la logique de base de données.
- **`/images`** : Images des produits et assets graphiques.
- **`/utils`** : Utilitaires divers.

## 🛠 Technologies Utilisées

- **Frontend** : HTML5, CSS3, Tailwind CSS, JavaScript Vanilla.
- **Backend** : Node.js, Express.
- **Persistance** : JSON / SQLite.

---
*Projet développé pour KENOVARDY'Shop.*
