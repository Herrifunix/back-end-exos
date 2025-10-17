# Not-Pokémon — API + Front (TypeScript/Express + Vanilla JS)

Projet d'entraînement qui simule un mini-système Pokémon: dresseurs, pokémon, attaques et combats, avec une API REST en TypeScript/Express, une base PostgreSQL, et une interface HTML simple servie par le serveur.

## Sommaire
- Aperçu rapide
- Stack & structure
- Base de données (schéma)
- Installation & lancement
- Variables d'environnement
- API (endpoints)
- Front-end (interface et flux)
- Modèle métier (classes)
- Combats (logique)
- Dépannage

---

## Aperçu rapide
- API disponible sur `http://localhost:3001`
- Health check JSON sur `GET /api`
- Interface web servie depuis `public/index.html` (accessible sur `http://localhost:3001/` si vous lancez le serveur Express, ou via un Live Server local)
- CORS ouvert pour tests (toutes origines)

---

## Stack & structure
- Node.js, TypeScript, Express
- PostgreSQL (`pg`)
- Front simple en HTML/JS (Vanilla)

Arborescence principale:
- `src/server.ts` — routes REST et logique d'orchestration
- `src/db.ts` — connexion PostgreSQL via `pg.Pool`
- `src/Pokemon.ts`, `src/Trainer.ts`, `src/Attack.ts` — classes métier
- `public/index.html` — interface d'administration (création/attribution, actions, combats)
- `init_db.sql` — script d'initialisation de la base
- `package.json`, `tsconfig.json`

---

## Base de données (schéma)
Tables principales (voir `init_db.sql`):
- `attacks(id, name, damage, usage_limit, created_at)`
- `trainers(id, name, level, experience, created_at)`
- `pokemons(id, name, life_points, max_life_points, trainer_id, created_at)`
- `pokemon_attacks(id, pokemon_id, attack_id, current_usage)` avec `UNIQUE(pokemon_id, attack_id)` et un trigger qui limite à 4 attaques par pokémon

Relations:
- `pokemons.trainer_id` → `trainers.id` (nullable: un Pokémon peut ne pas avoir de dresseur)
- `pokemon_attacks` relie N:N entre `pokemons` et `attacks`

---

## Installation & lancement
Prérequis:
- Node.js 18+
- PostgreSQL 13+

1) Installer les dépendances
```cmd
npm install
```

2) Créer et remplir la base
- Adaptez vos identifiants dans les variables d'environnement (voir ci-dessous)
- Exécutez `init_db.sql` dans PostgreSQL pour créer la base `not-pokemon` et la remplir d'exemples

3) Lancer en développement (TypeScript directement)
```cmd
npm run dev
```
Le serveur écoute par défaut sur `http://localhost:3001`.

4) Build + start (production)
```cmd
npm run build
npm start
```

---

## Variables d'environnement
Chargées via `dotenv` dans `src/db.ts`:
- `DB_HOST` (défaut: `localhost`)
- `DB_PORT` (défaut: `5432`)
- `DB_USER` (défaut: `postgres`)
- `DB_PASSWORD` (obligatoire si nécessaire)
- `DB_NAME` (défaut: `not-pokemon`)

Créez un fichier `.env` à la racine si besoin:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=monsecret
DB_NAME=not-pokemon
```

---

## API (endpoints)
Base: `http://localhost:3001`

### Health check
- `GET /api`
  - Renvoie un JSON d'état et les chemins principaux.

### Attaques
- `GET /attacks`
  - Retour: liste des attaques.
- `POST /attacks`
  - Body: `{ name, damage, usage_limit }`
  - Crée une attaque.

### Dresseurs
- `GET /trainers`
  - Retour: liste triée par level puis expérience.
- `POST /trainers`
  - Body: `{ name }`
  - Crée un dresseur.
- `GET /trainers/:id`
  - Retour: dresseur + ses pokémon avec leurs attaques (via agrégations SQL JSON).

### Pokémon
- `GET /pokemons`
  - Retour: liste des pokémon avec éventuellement `trainer_name`.
- `POST /pokemons`
  - Body: `{ name, life_points, trainer_id }` où `trainer_id` peut être `null`.
  - Crée un pokémon (désormais par défaut sans dresseur côté front).
- `PUT /pokemons/:id/assign-trainer`
  - Body: `{ trainer_id }` (obligatoire)
  - Attribue un pokémon existant à un dresseur.
- `POST /pokemons/:id/learn-attack`
  - Body: `{ attack_id }`
  - Ajoute une attaque au pokémon (serveur vérifie max 4 et l'unicité).
- `POST /pokemons/:id/heal`
  - Soigne le pokémon: PV remis au max + usages des attaques réinitialisés.

### Combats
- Entrées communes: `{ trainer1_id, trainer2_id }`
- `POST /combat/random-challenge`
  - Combat aléatoire entre un pokémon au hasard de chaque dresseur. Donne 1 XP au vainqueur et met à jour son level/XP en base.
- `POST /combat/arena1`
  - Enchaîne 100 combats aléatoires (randomChallenge) et met à jour l'expérience/level des deux dresseurs en base.
- `POST /combat/deterministic-challenge`
  - Combat déterministe: le plus fort (PV) de chaque côté s'affronte; met à jour les PV et usages en base.
- `POST /combat/arena2`
  - Boucle de combats déterministes jusqu'à élimination d'une équipe (capée à 100 combats), mise à jour des PV/usages et XP/level des deux dresseurs.

Notes techniques côté serveur:
- Les mises à jour de PV et `current_usage` se font avec `updatePokemonLifePoints(trainer)`.
- Les conversions DB→objets sont faites via `createTrainerFromData()` qui instancie `Trainer`, `Pokemon`, `Attack`.

---

## Front-end (interface et flux)
Fichier: `public/index.html`

Sections principales:
- Gestion des Dresseurs
  - Créer un dresseur → `POST /trainers`
  - Liste des dresseurs → `GET /trainers`
  - Détails d'un dresseur → `GET /trainers/:id`
- Gestion des Attaques
  - Créer une attaque → `POST /attacks`
  - Liste des attaques → `GET /attacks`
- Gestion des Pokémon
  - Créer un pokémon (sans dresseur) → `POST /pokemons` avec `trainer_id: null`
  - Liste des pokémon → `GET /pokemons`
- Attribution des Pokémon
  - Sélectionner un pokémon sans dresseur + un dresseur → `PUT /pokemons/:id/assign-trainer`
  - Liste des pokémon sans dresseur (filtrage côté client)
- Actions Pokémon
  - Apprendre une attaque → `POST /pokemons/:id/learn-attack`
  - Soigner un pokémon → `POST /pokemons/:id/heal`
- Combats
  - Boutons: Random, Arène 1, Déterministe, Arène 2 → appellent les endpoints `/combat/*`

Chargement initial:
- Sur `window.load`, la page appelle `GET /api` (health), puis charge en parallèle dresseurs, attaques, pokémon (`Promise.all`), met à jour les listes et remplit les `<select>` correspondants.

Mises à jour UI:
- Après chaque création ou action, les fonctions `load*()` rechargent les listes et `fill*Selects()` mettent à jour les menus déroulants (y compris le sélecteur spécial pour l'attribution des pokémon sans dresseur).

---

## Modèle métier (classes)
Fichiers: `src/Attack.ts`, `src/Pokemon.ts`, `src/Trainer.ts`

### Attack
- Propriétés: `id?`, `name`, `damage`, `usageLimit`, `currentUsage`
- Méthodes:
  - `canBeUsed()` → bool (reste des usages)
  - `use()` → consomme 1 usage (sinon exception)
  - `resetUsage()` → remet `currentUsage` à 0
  - `getInfo()` → string info lisible

### Pokemon
- Propriétés: `id?`, `name`, `lifePoints`, `maxLifePoints`, `attacks: Attack[]`, `trainerId?`
- Méthodes:
  - `learnAttack(attack)` → ajoute si < 4 et non dupliqué
  - `heal()` → PV au max + reset des usages attaques
  - `isDead()` → PV <= 0
  - `takeDamage(damage)` → réduit les PV sans passer sous 0
  - `attackPokemon(target)` → choisit une attaque dispo au hasard, l'utilise, inflige des dégâts
  - `getAvailableAttacks()` → liste filtrée des attaques utilisables

### Trainer
- Propriétés: `id?`, `name`, `level`, `experience`, `pokemons: Pokemon[]`
- Méthodes:
  - `addPokemon(pokemon)` → pousse dans l'équipe, affecte `trainerId`
  - `healAllPokemons()` → soigne tous
  - `gainExperience(points)` → met à jour `experience` et recalcule `level` (`level = floor(experience/10)+1`)
  - `getRandomPokemon()` → prend un pokémon vivant au hasard
  - `getStrongestPokemon()` → vivant avec le plus de PV
  - `hasAlivePokemon()` → au moins un vivant
  - Statics de combat: `randomChallenge`, `arena1`, `deterministicChallenge`, `arena2`

---

## Combats (logique)
- `randomChallenge(t1, t2)`
  - Soigne les équipes, prend un pokémon au hasard de chaque côté, alterne les attaques jusqu'à KO, +1 XP au vainqueur.
- `arena1(t1, t2)`
  - Joue 100 `randomChallenge` et retourne le meilleur au final (avec mise à jour XP/level des deux en DB côté serveur).
- `deterministicChallenge(t1, t2)`
  - Plus forts (PV) s'affrontent, met à jour les PV/usages côté DB via `updatePokemonLifePoints`.
- `arena2(t1, t2)`
  - Boucle de `deterministicChallenge` jusqu'à KO total d'une équipe (max 100 combats de sécurité), mise à jour XP/level pour les deux.

---

## Dépannage
- Erreur CORS (navigateur): le serveur envoie `Access-Control-Allow-Origin: *`. Vérifiez que le serveur écoute bien sur 3001 et que vous appelez l'API sur `http://localhost:3001`.
- La page affiche du HTML au lieu de JSON: utilisez `GET /api` pour le health check (la racine `/` sert le `index.html`).
- Ctrl+C ne ferme pas le serveur: un arrêt gracieux a été ajouté (gestion `SIGINT`, `SIGTERM`, fermeture HTTP + pool PG). Relancez et réessayez.
- Données initiales manquantes: rejouez `init_db.sql`.

---

## Scripts npm
```cmd
npm run dev    
npm run build  
npm start      
```

Bon usage et amusez-vous avec vos combats ! 🥊
# API Pokémon - Système de Jeu Simplifié

Une API REST développée en TypeScript avec Express.js et PostgreSQL pour gérer un système de jeu Pokémon simplifié en appliquant les principes de la programmation orientée objet.

## 🚀 Installation et Configuration

### Prérequis
- Node.js (v16 ou supérieur)
- PostgreSQL (v12 ou supérieur)
- npm ou yarn

### Installation
```bash
cd not-pokemon
npm install
```

### Configuration de la base de données
1. Créer la base de données PostgreSQL :
```sql
psql -U postgres -c "CREATE DATABASE \"not-pokemon\";"
```

2. Exécuter le script d'initialisation :
```bash
psql -U postgres -d not-pokemon -f init_db.sql
```

3. Configurer les variables d'environnement dans `.env` :
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
DB_NAME=not-pokemon
DB_PORT=5432
PORT=3001
```

### Démarrage
```bash
# Mode développement (avec rechargement automatique)
npm run dev

# Mode production
npm run build
npm start
```

### Interface Web
Une fois le serveur démarré, accédez à l'interface d'administration :
```
http://localhost:3001
```

L'interface permet de :
- ✅ Gérer les dresseurs, Pokémon et attaques
- ✅ Faire apprendre des attaques aux Pokémon
- ✅ Soigner les Pokémon
- ✅ Lancer les 4 types de combat
- ✅ Voir les résultats en temps réel

## 📖 Structure du Projet

```
not-pokemon/
├── src/
│   ├── Attack.ts      # Classe Attack avec gestion des usages
│   ├── Pokemon.ts     # Classe Pokemon avec attaques et PV
│   ├── Trainer.ts     # Classe Trainer avec méthodes de combat
│   ├── db.ts          # Configuration PostgreSQL
│   └── server.ts      # Serveur Express avec routes API
├── init_db.sql        # Script d'initialisation de la BDD
├── package.json
├── tsconfig.json
└── .env
```

## 🎮 Classes et Fonctionnalités

### Classe `Attack`
- **Propriétés** : `name`, `damage`, `usageLimit`, `currentUsage`
- **Méthodes** : `canBeUsed()`, `use()`, `resetUsage()`, `getInfo()`

### Classe `Pokemon`
- **Propriétés** : `name`, `lifePoints`, `maxLifePoints`, `attacks[]`
- **Méthodes** : 
  - `learnAttack()` : Apprendre une attaque (max 4, sans doublon)
  - `heal()` : Restaurer PV et réinitialiser usages
  - `attackPokemon()` : Attaquer avec une attaque aléatoire
  - `isDead()`, `takeDamage()`, `getAvailableAttacks()`

### Classe `Trainer`
- **Propriétés** : `name`, `level`, `experience`, `pokemons[]`
- **Méthodes** :
  - `addPokemon()`, `healAllPokemons()`, `gainExperience()`
  - `getRandomPokemon()`, `getStrongestPokemon()`
  - **Méthodes de combat statiques** :
    - `randomChallenge()` : Combat aléatoire avec soins
    - `arena1()` : 100 combats aléatoires
    - `deterministicChallenge()` : Combat avec Pokémon le plus fort
    - `arena2()` : Combats déterministes jusqu'à élimination

## 🌐 API Endpoints

### Attaques
```http
GET    /attacks                    # Lister toutes les attaques
POST   /attacks                    # Créer une attaque
```

### Dresseurs
```http
GET    /trainers                   # Lister tous les dresseurs
POST   /trainers                   # Créer un dresseur
GET    /trainers/:id              # Détails d'un dresseur avec ses Pokémon
```

### Pokémon
```http
GET    /pokemons                   # Lister tous les Pokémon
POST   /pokemons                   # Créer un Pokémon
POST   /pokemons/:id/learn-attack  # Apprendre une attaque
POST   /pokemons/:id/heal          # Soigner un Pokémon
```

### Combat
```http
POST   /combat/random-challenge     # Défi aléatoire
POST   /combat/arena1              # Arène 1 (100 combats aléatoires)
POST   /combat/deterministic-challenge # Défi déterministe
POST   /combat/arena2              # Arène 2 (combats jusqu'à élimination)
```

## 📋 Exemples d'Utilisation

### Créer un dresseur
```bash
curl -X POST http://localhost:3001/trainers \
  -H "Content-Type: application/json" \
  -d '{"name": "Sacha"}'
```

### Créer un Pokémon
```bash
curl -X POST http://localhost:3001/pokemons \
  -H "Content-Type: application/json" \
  -d '{"name": "Pikachu", "life_points": 100, "trainer_id": 1}'
```

### Apprendre une attaque
```bash
curl -X POST http://localhost:3001/pokemons/1/learn-attack \
  -H "Content-Type: application/json" \
  -d '{"attack_id": 5}'
```

### Lancer un combat aléatoire
```bash
curl -X POST http://localhost:3001/combat/random-challenge \
  -H "Content-Type: application/json" \
  -d '{"trainer1_id": 1, "trainer2_id": 2}'
```

### Lancer l'Arène 1 (100 combats)
```bash
curl -X POST http://localhost:3001/combat/arena1 \
  -H "Content-Type: application/json" \
  -d '{"trainer1_id": 1, "trainer2_id": 2}'
```

## 🎯 Types de Combat

### 1. **Défi Aléatoire** (`/combat/random-challenge`)
- Les deux dresseurs soignent leurs Pokémon
- Chaque dresseur choisit un Pokémon aléatoire
- Combat jusqu'à KO d'un Pokémon

### 2. **Arène 1** (`/combat/arena1`)
- 100 combats aléatoires successifs
- Le vainqueur est celui avec le plus haut niveau
- En cas d'égalité, compare l'expérience

### 3. **Défi Déterministe** (`/combat/deterministic-challenge`)
- Chaque dresseur utilise son Pokémon avec le plus de PV
- Combat sans soins préalables
- Un seul combat jusqu'au KO

### 4. **Arène 2** (`/combat/arena2`)
- Combats déterministes consécutifs
- Arrêt si un dresseur perd tous ses Pokémon
- Maximum 100 combats

## 📊 Schéma de Base de Données

```sql
attacks (id, name, damage, usage_limit)
trainers (id, name, level, experience)
pokemons (id, name, life_points, max_life_points, trainer_id)
pokemon_attacks (id, pokemon_id, attack_id, current_usage)
```

## 🔧 Scripts Disponibles

```bash
npm run dev     # Développement avec rechargement auto
npm run build   # Compilation TypeScript
npm start       # Démarrage en production
npm run watch   # Compilation en mode watch
```

## 🎮 Règles du Jeu

1. **Pokémon** : Maximum 4 attaques, pas de doublons
2. **Attaques** : Limite d'usage, se réinitialise aux soins
3. **Dresseurs** : Gagnent de l'expérience (+1 niveau tous les 10 points)
4. **Combat** : Choix d'attaque aléatoire parmi celles disponibles
5. **Soins** : Restaure PV et réinitialise les usages d'attaques

## 🛠️ Technologies Utilisées

- **TypeScript** : Typage statique
- **Express.js** : Framework web
- **PostgreSQL** : Base de données relationnelle
- **pg** : Driver PostgreSQL pour Node.js
- **dotenv** : Gestion des variables d'environnement

## 📝 Notes

- Les erreurs de compilation TypeScript sont normales en l'absence des `node_modules`
- Assurez-vous que PostgreSQL est démarré avant de lancer l'API
- Les logs de combat s'affichent dans la console du serveur
- L'API écoute par défaut sur le port 3001