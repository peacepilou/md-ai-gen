# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Lancer avec Docker

Ce projet inclut une configuration Docker pour faciliter le développement et le déploiement.

### Prérequis

Assurez-vous d'avoir [Docker](https://www.docker.com/) et Docker Compose installés sur votre machine.

### Utilisation

1. **Construire et lancer le conteneur :**

   À la racine du projet, exécutez :

   ```bash
   docker-compose up --build
   ```

2. **Accéder à l'application :**

   Une fois le conteneur lancé, ouvrez votre navigateur à l'adresse : [http://localhost:5173](http://localhost:5173)

### Fonctionnalités Docker

- **Hot Reloading** : Le fichier `docker-compose.yml` monte le répertoire courant dans le conteneur, permettant au serveur de développement Vite de détecter vos changements en temps réel.
- **Node Modules** : Un volume anonyme est utilisé pour `/app/node_modules` afin d'éviter les conflits avec vos dépendances locales.
