# Planning Chantier DPR45 (Web + Desktop)

Application simple de gestion de planning chantier avec 4 pages :
1. **Connexion** (login / mot de passe)
2. **Chantiers** (ajout, édition, suppression)
3. **Équipes & sous-traitants**
4. **Planning** (vues Liste, Timeline, Mois, Charge équipes)

## Connexion
- **Login** : `DPR45`
- **Mot de passe** : `Isolation45`

## Données gérées
- Chantiers : nom, lieu, chef d'équipe, interne/sous-traité, date de démarrage, date de fin, durée estimée.
- Équipes : nom, chef d'équipe, type (interne ou sous-traitant), entreprise.

## Lancement desktop en dev
```bash
npm install
npm run start
```

## Générer un `.exe` (Windows)
```bash
npm install
npm run build:win
```
