# Utiliser une image Node officielle légère
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Exposer le port par défaut de Vite
EXPOSE 5173

# Commande de démarrage
CMD ["npm", "run", "dev", "--", "--host"]
