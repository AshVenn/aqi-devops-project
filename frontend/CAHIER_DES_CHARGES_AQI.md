# Cahier des Charges - Application d'Estimation de la Qualite de l'Air (AQI)

Date: 9 fevrier 2026
Auteur: Product Owner (vision client) + traduction backlog produit

## 1) Version Client (non technique)

### 1.1 Contexte
Nous voulons proposer une application simple qui aide toute personne a estimer la qualite de l'air d'un lieu, meme quand toutes les mesures ne sont pas disponibles.  
L'utilisateur doit comprendre rapidement le niveau de risque et pouvoir agir (sortie, sport, protection des personnes sensibles).

### 1.2 Objectifs metier
- Donner une estimation fiable de la qualite de l'air en quelques secondes.
- Permettre une utilisation sur carte, avec un lieu choisi librement.
- Accepter des informations partielles (pas besoin d'avoir toutes les mesures).
- Rendre le resultat lisible pour le grand public (score + niveau + explication).
- Offrir une experience fluide sur mobile et ordinateur.

### 1.3 Public cible
- Grand public souhaitant verifier l'air de son quartier.
- Personnes sensibles (asthme, enfants, personnes agees).
- Utilisateurs qui planifient des activites exterieures.
- Etudiants/analystes qui veulent une estimation rapide.

### 1.4 Parcours utilisateur attendu
1. L'utilisateur arrive sur une page de presentation qui explique simplement l'indice AQI et son utilite.
2. Il accede au calculateur.
3. Il choisit un lieu (clic sur carte ou saisie manuelle).
4. Il choisit la date/heure.
5. Il renseigne une ou plusieurs mesures disponibles.
6. Il lance l'estimation.
7. Il obtient un resultat clair: score, niveau de risque, interpretation, et informations de contexte.
8. Il peut effacer et recommencer avec un autre lieu/instant.

### 1.5 Fonctionnalites attendues (expression du besoin)
- Une page d'accueil pedagogique avec un appel a l'action clair.
- Une carte interactive pour choisir le lieu.
- Une saisie manuelle possible des coordonnees.
- Un formulaire simple de saisie des mesures.
- Une verification des saisies avec messages clairs.
- Une estimation quasi immediate.
- Une lecture simple du resultat (chiffre principal + niveau de qualite + message sante).
- Une indication sur la provenance du resultat (estimation, calcul direct ou combine).
- Une interface claire en mode jour/nuit.
- Un retour explicite en cas d'erreur.

### 1.6 Regles de gestion (cote metier)
- Un lieu et une date/heure sont obligatoires.
- Au moins une mesure de polluant doit etre fournie.
- Le resultat doit etre interpretable par un non-expert.
- Le niveau de risque doit suivre l'echelle AQI (Good, Moderate, etc.).
- L'application doit rester utilisable meme si certaines mesures sont absentes.

### 1.7 Contraintes et attentes de qualite
- Temps de reponse cible: quelques secondes.
- Fiabilite de la prediction prioritaire a la complexite visuelle.
- Message utilisateur toujours comprehensible (meme en erreur).
- Coherence du comportement sur mobile et desktop.

### 1.8 Hors perimetre MVP
- Compte utilisateur et historique personnel.
- Notifications push.
- Prevision multi-jours detaillee.
- Dashboard admin avance.

### 1.9 Indicateurs de succes
- L'utilisateur obtient une estimation sans aide externe.
- Faible taux d'abandon avant resultat.
- Temps de calcul percu court.
- Taux d'erreurs utilisateur limite grace a la validation.

## 2) Traduction en Backlog Produit (User Stories)

| ID | Epic | User Story | Priorite | Critere d'acceptation (resume) |
|---|---|---|---|---|
| US-01 | Sensibilisation | En tant que visiteur, je veux comprendre en 1 minute ce qu'est l'AQI afin de savoir pourquoi l'application m'est utile. | Haute | Une section explique l'echelle AQI et les impacts sante avec langage simple. |
| US-02 | Sensibilisation | En tant que visiteur, je veux passer rapidement de la page d'information au calculateur afin de lancer une estimation sans friction. | Haute | Un bouton principal mene au calculateur avec defilement fluide. |
| US-03 | Experience | En tant qu'utilisateur, je veux choisir un affichage jour/nuit afin d'ameliorer mon confort de lecture. | Moyenne | Le changement de theme est instantane et persistant pendant la session. |
| US-04 | Saisie localisation | En tant qu'utilisateur, je veux selectionner un point sur la carte afin de definir rapidement le lieu de l'estimation. | Haute | Un clic place un repere et remplit la position. |
| US-05 | Saisie localisation | En tant qu'utilisateur, je veux saisir manuellement latitude/longitude afin d'utiliser l'application sans clic carte. | Haute | Les valeurs manuelles remplacent la carte et sont verifiees. |
| US-06 | Saisie contexte | En tant qu'utilisateur, je veux renseigner date/heure afin d'obtenir une estimation contextualisee. | Haute | Date/heure obligatoire, format valide, message clair si invalide. |
| US-07 | Saisie polluants | En tant qu'utilisateur, je veux pouvoir renseigner seulement les mesures dont je dispose afin de ne pas bloquer l'estimation. | Haute | Au moins un polluant suffit; les autres peuvent rester vides. |
| US-08 | Qualite saisie | En tant qu'utilisateur, je veux voir des erreurs precises sur chaque champ afin de corriger vite ma saisie. | Haute | Messages par champ et blocage de soumission si incoherent. |
| US-09 | Calcul | En tant qu'utilisateur, je veux lancer l'estimation et voir un indicateur d'attente afin de savoir que ma demande est en cours. | Haute | Bouton actif/inactif, etat "analyse en cours", pas de double envoi. |
| US-10 | Restitution | En tant qu'utilisateur, je veux recevoir un score AQI et son niveau afin d'interpreter immediatement la qualite de l'air. | Haute | Score numerique + categorie + couleur + texte explicatif. |
| US-11 | Transparence | En tant qu'utilisateur, je veux savoir si le resultat vient d'un calcul direct, d'une estimation, ou des deux afin de juger la confiance. | Moyenne | Le resultat affiche clairement le mode utilise. |
| US-12 | Reinitialisation | En tant qu'utilisateur, je veux effacer toutes les donnees en un clic afin de faire une nouvelle estimation proprement. | Moyenne | Bouton de reset remet formulaire, repere et resultat a zero. |
| US-13 | Disponibilite | En tant qu'utilisateur, je veux que le service reponde de maniere stable afin d'eviter les ecrans bloques. | Haute | Point de controle sante service et gestion des indisponibilites. |
| US-14 | Donnees | En tant que PO, je veux integrer regulierement de nouvelles donnees afin de maintenir la pertinence des estimations. | Haute | Processus de collecte/nettoyage rejouable et documente. |
| US-15 | Modele | En tant que PO, je veux re-entrainer et remplacer facilement le moteur d'estimation afin d'ameliorer la precision dans le temps. | Haute | Export standardise des artefacts et procedure de mise a jour. |
| US-16 | Exploitation | En tant que PO, je veux demarrer le service de calcul localement ou en serveur afin de connecter l'interface et les resultats. | Haute | Procedure d'execution reproductible et validee. |

## 3) Sous-taches Techniques Detaillees (par User Story)

### US-01 a US-03 (Experience et comprehension)
1. Construire une page d'accueil avec sections pedagogiques (AQI, impacts, valeur d'usage).
2. Ajouter navigation fixe avec ancrages vers "top" et "calculateur".
3. Implementer defilement fluide et bouton retour en haut.
4. Integrer gestion de theme clair/sombre.
5. Verifier responsive mobile/desktop et lisibilite.

### US-04 a US-08 (Collecte et validation des entrees)
1. Integrer carte interactive OpenStreetMap + selection de point par clic.
2. Connecter clic carte au formulaire de coordonnees.
3. Autoriser saisie manuelle latitude/longitude avec priorite a l'entree manuelle.
4. Valider plages latitude [-90,90] et longitude [-180,180].
5. Ajouter champ date/heure au format ISO.
6. Controler qu'au moins 1 polluant est renseigne.
7. Gerer controles de bornes par polluant et messages d'erreur par champ.
8. Construire le payload de prediction: position, date/heure, polluants, unites.

### US-09 a US-13 (Prediction et restitution)
1. Creer client HTTP vers service backend avec URL configurable (`VITE_BACKEND_URL`).
2. Implementer appel `POST /predict` et gestion des erreurs metier/validation.
3. Ajouter etats UI: chargement, erreur, succes, vide.
4. Afficher resultat: `aqi_pred`, `aqi_category_pred`, description sanitaire.
5. Afficher informations complementaires: `aqi_exact`, `used_model`, `used_exact`, `best_model_name`.
6. Ajouter bouton reset qui vide repere, formulaire, resultat.
7. Ajouter endpoint de sante `GET /health` cote backend et verification cote frontend.

### US-14 et US-15 (Data, exploration, entrainement, export pipeline)
1. Charger le CSV OpenAQ avec gestion des separateurs (`;` puis fallback auto).
2. Uniformiser les noms de colonnes et normaliser les polluants (ex: PM2.5 -> pm25).
3. Parser coordonnees, convertir timestamp, nettoyer doublons/valeurs invalides.
4. Convertir les unites vers des unites standard AQI (ug/m3, ppm, ppb).
5. Agreger par fenetre temporelle (jour) puis pivoter en format large.
6. Calculer la valeur AQI de reference via tables EPA.
7. Creer variables temporelles (heure, jour semaine, mois).
8. Ajouter indicateurs de valeurs manquantes par polluant.
9. Simuler manquants de facon controlee pour robustesse.
10. Separer train/test par le temps (sans fuite de donnees).
11. Comparer plusieurs modeles de regression avec validation temporelle.
12. Selectionner le meilleur modele selon MAE/RMSE/R2.
13. Re-entrainer sur jeu complet.
14. Exporter pipeline et metadonnees: `aqi_estimator.joblib`, `feature_cols.json`, `model_meta.json`.
15. Versionner et archiver les artefacts pour deploiement.

### US-16 (Execution backend FastAPI)
1. Installer dependances backend dans un environnement dedie.
2. Verifier presence des artefacts dans `backend/models/`.
3. Lancer le service via Uvicorn sur le port 8000.
4. Tester `GET /health` puis `POST /predict` avec payload nominal.
5. Configurer CORS pour autoriser le frontend local.
6. Documenter commandes de demarrage et checks rapides.

## 4) Exigences Techniques de Reference (derivees du projet actuel)

### 4.1 Frontend (constate)
- Application React + TypeScript + Vite.
- Carte interactive avec react-leaflet/OpenStreetMap.
- Formulaire de prediction avec validation metier.
- Client backend parametre par variable d'environnement.
- Restitution AQI avec categories sante.

### 4.2 Backend (constate)
- Service FastAPI avec endpoints `GET /health` et `POST /predict`.
- Validation des entrees (coordonnees, date/heure, structure polluants).
- Construction des features a l'inference (temps + indicateurs de manque).
- Calcul AQI exact possible si au moins un polluant fourni.
- Prediction modele exporte si artefacts presents.

### 4.3 Data & modele (constate)
- Dataset local `openaq.csv`.
- Nettoyage + normalisation + conversions d'unites AQI.
- Agregation journaliere et calcul AQI de reference.
- Meilleur modele enregistre: RandomForest.

## 5) Etat Factuel Observe (analyse des dossiers)

- Frontend: `aqi-predictor-app` (ce dossier).
- Backend + data science: dossier voisin `..\\AQI`.
- Donnees brutes: 61 177 lignes.
- Donnees nettoyees: 54 439 lignes.
- Echantillons agreges (base modelisation): 18 968 lignes.
- Periode des donnees: 13/03/2014 -> 31/01/2025.
- Polluants supportes: PM2.5, PM10, NO2, O3, CO, SO2.
- Performance en metadonnees modele:
  - MAE: 4.907
  - RMSE: 11.063
  - R2: 0.811

## 6) Commandes d'Execution (pratiques)

### 6.1 Backend FastAPI
Depuis `..\\AQI`:

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -r backend/requirements.txt
uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000
```

### 6.2 Frontend
Depuis `aqi-predictor-app`:

```powershell
npm install
npm run dev
```

Variable d'environnement frontend:

```env
VITE_BACKEND_URL=http://localhost:8000
```

## 7) Risques et Points de Vigilance

1. Compatibilite version modele: avertissement detecte entre version scikit-learn du modele serialize et version locale.
2. Documentation projet inegale: README frontend encore generique.
3. Peu de tests automatises observes pour fiabilite API/UI.
4. Dependance aux artefacts exportes pour que la prediction modele fonctionne.

## 8) Definition of Done (DoD) proposee

1. Les stories critiques (US-04 a US-11, US-16) sont terminees et validees.
2. Les tests manuels minimum sont executes: parcours complet, erreurs de saisie, indisponibilite backend.
3. L'API renvoie des erreurs explicites et stables.
4. La prediction s'affiche correctement en mobile et desktop.
5. Le processus de re-entrainement + export est rejouable.
