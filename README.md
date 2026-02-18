# Planning Chantier DPR45 (Web + Desktop)

## Connexion
- **Login** : `DPR45`
- **Mot de passe** : `Isolation45`

## Fonctionnalités
- Base de données Ouvriers / Sous-traitants / Chantiers
- Ajout unitaire et **ajout en lot** de chantiers (plusieurs en même temps)
- Affectation des ouvriers et sous-traitants aux chantiers
- Plusieurs vues planning :
  - Timeline
  - Calendrier mensuel
  - Charge équipes

## Générer un fichier `.exe` (Windows)

### Option 1 — Script automatique
1. Installer Node.js LTS.
2. Lancer `build-exe.bat`.
3. Récupérer l'installeur `.exe` dans `dist/`.

### Option 2 — Ligne de commande
```bash
npm install
npm run build:win
```

Le build produit :
- un installeur NSIS (`.exe`)
- une version portable (`.exe`)

## Lancement desktop en dev
```bash
npm install
npm run start
```
