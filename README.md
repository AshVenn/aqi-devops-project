# AQI DevOps Project

Plateforme de prediction de la qualite de l'air (AQI) composee d'un frontend React/Vite, d'une API FastAPI et d'une chaine DevOps automatisee basee sur Docker, Kubernetes, GitHub Actions, Terraform et Ansible.

## Vue d'ensemble

Le projet permet de :

- selectionner une position sur une carte interactive ;
- saisir un horodatage et des concentrations de polluants ;
- calculer un AQI exact quand toutes les donnees necessaires sont presentes ;
- estimer l'AQI via un modele ML quand certaines valeurs sont absentes ;
- deployer automatiquement les services sur un cluster K3s heberge sur AWS.

## Architecture

```text
Frontend React/Vite
    -> /api/* via Nginx
    -> Service Kubernetes frontend (NodePort)

Nginx frontend
    -> proxy /api vers backend.aqi.svc.cluster.local:8000

Backend FastAPI
    -> chargement des artefacts ML depuis backend/models/
    -> calcul AQI exact ou prediction modele

CI/CD GitHub Actions
    -> tests backend/frontend selon les fichiers modifies
    -> build et push des images Docker
    -> mise a jour des deployments Kubernetes

Terraform
    -> provisioning de 2 instances EC2

Ansible
    -> installation Docker + K3s
    -> deploiement des manifests Kubernetes
```

## Stack technique

- Frontend : React 19, TypeScript, Vite, React Query, Leaflet, Tailwind CSS
- Backend : FastAPI, Pydantic, scikit-learn, pandas, joblib
- Conteneurisation : Docker
- Orchestration : Kubernetes / K3s
- Provisioning : Terraform
- Configuration serveur : Ansible
- CI/CD : GitHub Actions + Docker Hub
- Cloud : AWS EC2 (`us-east-1`)

## Structure du depot

```text
.
|-- backend/                 API FastAPI, logique AQI, modele et tests
|-- frontend/                application React/Vite
|-- k8s/                     manifests Kubernetes
|-- terraform/               infrastructure AWS
|-- ansible/                 installation K3s et deploiement cluster
|-- .github/workflows/       pipeline CI/CD
|-- reports/                 livrables de presentation/documentation
`-- README.md
```

## Fonctionnement applicatif

### Backend

L'API expose principalement deux endpoints :

- `GET /health` : etat du service et disponibilite du modele ;
- `POST /predict` : calcul ou estimation de l'AQI a partir de la position, du timestamp et des polluants saisis.

Le backend :

- charge les artefacts depuis `backend/models/` ;
- convertit les unites entrantes vers un format standard ;
- calcule l'AQI exact par maximum des sous-indices quand les polluants necessaires sont fournis ;
- utilise le modele ML comme fallback quand certaines valeurs sont manquantes.

### Frontend

L'interface web :

- affiche une landing page avec navigation ;
- permet de cliquer sur une carte Leaflet pour definir une position ;
- valide les coordonnees, la date et les concentrations ;
- envoie la requete au backend ;
- affiche la valeur AQI, la categorie associee et les metadonnees du modele utilise.

En production, le frontend sert l'application via Nginx et relaie `/api/*` vers le service backend du namespace Kubernetes `aqi`.

## Prerequis

Pour un usage local :

- Python 3.12
- Node.js 22
- npm

Pour la conteneurisation et le deploiement :

- Docker
- Terraform
- Ansible
- acces AWS
- acces Docker Hub
- cluster Kubernetes ou K3s

## Lancement en local

### 1. Demarrer le backend

Depuis la racine du depot :

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -r backend/requirements.txt
uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000
```

Le backend charge par defaut :

- `backend/models/aqi_estimator.joblib`
- `backend/models/feature_cols.json`
- `backend/models/model_meta.json`

Configuration optionnelle via `backend/.env` :

```env
AQI_ALLOWED_ORIGINS=http://localhost:5173
AQI_ALLOWED_ORIGIN_REGEX=^https?://[a-z0-9-]+\.167\.235\.153\.252\.sslip\.io$
AQI_MODEL_PATH=backend/models/aqi_estimator.joblib
AQI_FEATURE_COLS_PATH=backend/models/feature_cols.json
AQI_MODEL_META_PATH=backend/models/model_meta.json
```

### 2. Demarrer le frontend

Dans un second terminal :

```powershell
Copy-Item frontend/.env.example frontend/.env
cd frontend
npm ci
npm run dev
```

Variable attendue cote frontend :

```env
VITE_BACKEND_URL=http://localhost:8000
```

Application disponible par defaut sur `http://localhost:5173`.

## Execution avec Docker

### Backend

```powershell
docker build -t aqi-backend:local .\backend
docker run --rm -p 8000:8000 aqi-backend:local
```

### Frontend

```powershell
docker build -t aqi-frontend:local --build-arg VITE_BACKEND_URL=http://localhost:8000 .\frontend
docker run --rm -p 8080:80 aqi-frontend:local
```

## Tests

### Backend

```powershell
python -m pip install -r backend/requirements.txt pytest
cd backend
$env:PYTHONPATH="."
pytest tests
```

### Frontend

```powershell
cd frontend
npm ci
npm run test
```

## Deploiement infrastructure

### Terraform

Le dossier `terraform/` provisionne actuellement :

- un security group ;
- une instance EC2 `aqi-master` ;
- une instance EC2 `aqi-worker`.

Commandes usuelles :

```powershell
cd terraform
terraform init
terraform plan
terraform apply
```

Les outputs exposent notamment les IP publiques du master et du worker.

### Ansible

Le playbook `ansible/playbook.yml` :

- installe Docker ;
- installe K3s en mode serveur sur le master ;
- joint le worker au cluster ;
- cree le namespace `aqi` ;
- applique les manifests Kubernetes du projet.

Execution :

```powershell
cd ansible
ansible-playbook -i inventory.ini playbook.yml
```

## Deploiement Kubernetes

Les manifests du dossier `k8s/` definissent :

- un deployment backend ;
- un service backend en `ClusterIP` ;
- un deployment frontend ;
- un service frontend en `NodePort`.

Le frontend contacte le backend via le DNS interne Kubernetes :

```text
http://backend.aqi.svc.cluster.local:8000
```

## CI/CD

Le workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) s'execute sur chaque push vers `main` et :

1. detecte si les changements concernent `backend/**` ou `frontend/**` ;
2. execute les tests correspondants ;
3. build les images Docker ;
4. pousse les images sur Docker Hub ;
5. met a jour les deployments Kubernetes avec `kubectl set image` puis `kubectl rollout`.

Secrets attendus dans GitHub Actions :

- `DOCKER_USER`
- `DOCKER_PASS`
- `KUBECONFIG`

## Exemple de requete API

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 33.5731,
    "longitude": -7.5898,
    "timestamp": "2026-03-23T12:00:00",
    "pollutants": {
      "pm25": 12.5,
      "pm10": 20.0,
      "no2": 8.2,
      "o3": 14.0,
      "co": 0.6,
      "so2": 3.1
    },
    "units": {
      "pm25": "ug/m3",
      "pm10": "ug/m3",
      "no2": "ppb",
      "o3": "ppb",
      "co": "ppm",
      "so2": "ppb"
    }
  }'
```

## Ressources complementaires

- `backend/README.md` : details specifiques a l'API
- `frontend/README.md` : documentation frontend d'origine
- `reports/` : rapport et support de presentation du projet
