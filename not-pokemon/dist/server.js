"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const Attack_1 = require("./Attack");
const Pokemon_1 = require("./Pokemon");
const Trainer_1 = require("./Trainer");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
app.use(express_1.default.json());
app.get('/api', (req, res) => {
    res.json({
        message: 'API Pokémon - Système de jeu simplifié',
        status: 'running',
        endpoints: {
            attacks: '/attacks',
            trainers: '/trainers',
            pokemons: '/pokemons',
            combat: {
                random_challenge: '/combat/random-challenge',
                arena1: '/combat/arena1',
                deterministic_challenge: '/combat/deterministic-challenge',
                arena2: '/combat/arena2'
            }
        }
    });
});
app.use(express_1.default.static('public'));
(0, db_1.connectDB)();
app.get('/attacks', async (req, res) => {
    try {
        const result = await db_1.pool.query('SELECT * FROM attacks ORDER BY name');
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des attaques' });
    }
});
app.post('/attacks', async (req, res) => {
    const { name, damage, usage_limit } = req.body;
    if (!name || !damage || !usage_limit) {
        return res.status(400).json({ error: 'Nom, dégâts et limite d\'usage requis' });
    }
    try {
        const result = await db_1.pool.query('INSERT INTO attacks (name, damage, usage_limit) VALUES ($1, $2, $3) RETURNING *', [name, damage, usage_limit]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de l\'attaque' });
    }
});
app.get('/trainers', async (req, res) => {
    try {
        const result = await db_1.pool.query('SELECT * FROM trainers ORDER BY level DESC, experience DESC');
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des dresseurs' });
    }
});
app.post('/trainers', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Nom requis' });
    }
    try {
        const result = await db_1.pool.query('INSERT INTO trainers (name) VALUES ($1) RETURNING *', [name]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du dresseur' });
    }
});
app.get('/trainers/:id', async (req, res) => {
    const trainerId = parseInt(req.params.id);
    try {
        const trainerResult = await db_1.pool.query('SELECT * FROM trainers WHERE id = $1', [trainerId]);
        if (trainerResult.rows.length === 0) {
            return res.status(404).json({ error: 'Dresseur non trouvé' });
        }
        const pokemonsResult = await db_1.pool.query(`
      SELECT p.*, 
             json_agg(
               json_build_object(
                 'id', a.id,
                 'name', a.name,
                 'damage', a.damage,
                 'usage_limit', a.usage_limit,
                 'current_usage', pa.current_usage
               )
             ) FILTER (WHERE a.id IS NOT NULL) as attacks
      FROM pokemons p
      LEFT JOIN pokemon_attacks pa ON p.id = pa.pokemon_id
      LEFT JOIN attacks a ON pa.attack_id = a.id
      WHERE p.trainer_id = $1
      GROUP BY p.id
      ORDER BY p.name
    `, [trainerId]);
        const trainer = {
            ...trainerResult.rows[0],
            pokemons: pokemonsResult.rows
        };
        res.json(trainer);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du dresseur' });
    }
});
app.get('/pokemons', async (req, res) => {
    try {
        const result = await db_1.pool.query(`
      SELECT p.*, t.name as trainer_name
      FROM pokemons p
      LEFT JOIN trainers t ON p.trainer_id = t.id
      ORDER BY p.name
    `);
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des Pokémon' });
    }
});
app.post('/pokemons', async (req, res) => {
    const { name, life_points, trainer_id } = req.body;
    if (!name || !life_points) {
        return res.status(400).json({ error: 'Nom et points de vie requis' });
    }
    try {
        const result = await db_1.pool.query('INSERT INTO pokemons (name, life_points, max_life_points, trainer_id) VALUES ($1, $2, $2, $3) RETURNING *', [name, life_points, trainer_id]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du Pokémon' });
    }
});
app.put('/pokemons/:id/assign-trainer', async (req, res) => {
    const pokemonId = parseInt(req.params.id);
    const { trainer_id } = req.body;
    if (!trainer_id) {
        return res.status(400).json({ error: 'ID du dresseur requis' });
    }
    try {
        const trainerCheck = await db_1.pool.query('SELECT id FROM trainers WHERE id = $1', [trainer_id]);
        if (trainerCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Dresseur non trouvé' });
        }
        const result = await db_1.pool.query('UPDATE pokemons SET trainer_id = $1 WHERE id = $2 RETURNING *', [trainer_id, pokemonId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Pokémon non trouvé' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'attribution du Pokémon' });
    }
});
app.post('/pokemons/:id/learn-attack', async (req, res) => {
    const pokemonId = parseInt(req.params.id);
    const { attack_id } = req.body;
    if (!attack_id) {
        return res.status(400).json({ error: 'ID de l\'attaque requis' });
    }
    try {
        const attackCount = await db_1.pool.query('SELECT COUNT(*) FROM pokemon_attacks WHERE pokemon_id = $1', [pokemonId]);
        if (parseInt(attackCount.rows[0].count) >= 4) {
            return res.status(400).json({ error: 'Le Pokémon connaît déjà 4 attaques' });
        }
        const result = await db_1.pool.query('INSERT INTO pokemon_attacks (pokemon_id, attack_id) VALUES ($1, $2) RETURNING *', [pokemonId, attack_id]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        if (error instanceof Error && error.message?.includes('unique')) {
            res.status(400).json({ error: 'Le Pokémon connaît déjà cette attaque' });
        }
        else {
            res.status(500).json({ error: 'Erreur lors de l\'apprentissage de l\'attaque' });
        }
    }
});
app.post('/pokemons/:id/heal', async (req, res) => {
    const pokemonId = parseInt(req.params.id);
    try {
        await db_1.pool.query('UPDATE pokemons SET life_points = max_life_points WHERE id = $1', [pokemonId]);
        await db_1.pool.query('UPDATE pokemon_attacks SET current_usage = 0 WHERE pokemon_id = $1', [pokemonId]);
        res.json({ message: 'Pokémon soigné avec succès' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors des soins' });
    }
});
app.post('/combat/random-challenge', async (req, res) => {
    const { trainer1_id, trainer2_id } = req.body;
    if (!trainer1_id || !trainer2_id) {
        return res.status(400).json({ error: 'IDs des deux dresseurs requis' });
    }
    if (trainer1_id === trainer2_id) {
        return res.status(400).json({ error: 'Les deux dresseurs doivent être différents' });
    }
    try {
        const trainer1Data = await getTrainerWithPokemons(trainer1_id);
        const trainer2Data = await getTrainerWithPokemons(trainer2_id);
        if (!trainer1Data || !trainer2Data) {
            return res.status(404).json({ error: 'Un ou plusieurs dresseurs non trouvés' });
        }
        const trainer1 = createTrainerFromData(trainer1Data);
        const trainer2 = createTrainerFromData(trainer2Data);
        const winner = Trainer_1.Trainer.randomChallenge(trainer1, trainer2);
        await db_1.pool.query('UPDATE trainers SET experience = $1, level = $2 WHERE id = $3', [winner.experience, winner.level, winner.id]);
        res.json({
            winner: {
                id: winner.id,
                name: winner.name,
                level: winner.level,
                experience: winner.experience
            },
            combat_type: 'random_challenge'
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors du combat aléatoire' });
    }
});
app.post('/combat/arena1', async (req, res) => {
    const { trainer1_id, trainer2_id } = req.body;
    try {
        if (!trainer1_id || !trainer2_id) {
            return res.status(400).json({ error: 'IDs des deux dresseurs requis' });
        }
        if (trainer1_id === trainer2_id) {
            return res.status(400).json({ error: 'Les deux dresseurs doivent être différents' });
        }
        const trainer1Data = await getTrainerWithPokemons(trainer1_id);
        const trainer2Data = await getTrainerWithPokemons(trainer2_id);
        if (!trainer1Data || !trainer2Data) {
            return res.status(404).json({ error: 'Un ou plusieurs dresseurs non trouvés' });
        }
        const trainer1 = createTrainerFromData(trainer1Data);
        const trainer2 = createTrainerFromData(trainer2Data);
        const winner = Trainer_1.Trainer.arena1(trainer1, trainer2);
        await db_1.pool.query('UPDATE trainers SET experience = $1, level = $2 WHERE id = $3', [trainer1.experience, trainer1.level, trainer1.id]);
        await db_1.pool.query('UPDATE trainers SET experience = $1, level = $2 WHERE id = $3', [trainer2.experience, trainer2.level, trainer2.id]);
        res.json({
            winner: {
                id: winner.id,
                name: winner.name,
                level: winner.level,
                experience: winner.experience
            },
            combat_type: 'arena1',
            total_combats: 100
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'Arène 1' });
    }
});
app.post('/combat/deterministic-challenge', async (req, res) => {
    const { trainer1_id, trainer2_id } = req.body;
    try {
        if (!trainer1_id || !trainer2_id) {
            return res.status(400).json({ error: 'IDs des deux dresseurs requis' });
        }
        if (trainer1_id === trainer2_id) {
            return res.status(400).json({ error: 'Les deux dresseurs doivent être différents' });
        }
        const trainer1Data = await getTrainerWithPokemons(trainer1_id);
        const trainer2Data = await getTrainerWithPokemons(trainer2_id);
        if (!trainer1Data || !trainer2Data) {
            return res.status(404).json({ error: 'Un ou plusieurs dresseurs non trouvés' });
        }
        const trainer1 = createTrainerFromData(trainer1Data);
        const trainer2 = createTrainerFromData(trainer2Data);
        const winner = Trainer_1.Trainer.deterministicChallenge(trainer1, trainer2);
        await updatePokemonLifePoints(trainer1);
        await updatePokemonLifePoints(trainer2);
        await db_1.pool.query('UPDATE trainers SET experience = $1, level = $2 WHERE id = $3', [winner.experience, winner.level, winner.id]);
        res.json({
            winner: {
                id: winner.id,
                name: winner.name,
                level: winner.level,
                experience: winner.experience
            },
            combat_type: 'deterministic_challenge'
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors du combat déterministe' });
    }
});
app.post('/combat/arena2', async (req, res) => {
    const { trainer1_id, trainer2_id } = req.body;
    try {
        if (!trainer1_id || !trainer2_id) {
            return res.status(400).json({ error: 'IDs des deux dresseurs requis' });
        }
        if (trainer1_id === trainer2_id) {
            return res.status(400).json({ error: 'Les deux dresseurs doivent être différents' });
        }
        const trainer1Data = await getTrainerWithPokemons(trainer1_id);
        const trainer2Data = await getTrainerWithPokemons(trainer2_id);
        if (!trainer1Data || !trainer2Data) {
            return res.status(404).json({ error: 'Un ou plusieurs dresseurs non trouvés' });
        }
        const trainer1 = createTrainerFromData(trainer1Data);
        const trainer2 = createTrainerFromData(trainer2Data);
        const winner = Trainer_1.Trainer.arena2(trainer1, trainer2);
        await updatePokemonLifePoints(trainer1);
        await updatePokemonLifePoints(trainer2);
        await db_1.pool.query('UPDATE trainers SET experience = $1, level = $2 WHERE id = $3', [trainer1.experience, trainer1.level, trainer1.id]);
        await db_1.pool.query('UPDATE trainers SET experience = $1, level = $2 WHERE id = $3', [trainer2.experience, trainer2.level, trainer2.id]);
        res.json({
            winner: {
                id: winner.id,
                name: winner.name,
                level: winner.level,
                experience: winner.experience
            },
            combat_type: 'arena2'
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'Arène 2' });
    }
});
async function getTrainerWithPokemons(trainerId) {
    const trainerResult = await db_1.pool.query('SELECT * FROM trainers WHERE id = $1', [trainerId]);
    if (trainerResult.rows.length === 0)
        return null;
    const pokemonsResult = await db_1.pool.query(`
    SELECT p.*, 
           json_agg(
             json_build_object(
               'id', a.id,
               'name', a.name,
               'damage', a.damage,
               'usage_limit', a.usage_limit,
               'current_usage', pa.current_usage
             )
           ) FILTER (WHERE a.id IS NOT NULL) as attacks
    FROM pokemons p
    LEFT JOIN pokemon_attacks pa ON p.id = pa.pokemon_id
    LEFT JOIN attacks a ON pa.attack_id = a.id
    WHERE p.trainer_id = $1
    GROUP BY p.id
    ORDER BY p.name
  `, [trainerId]);
    return {
        ...trainerResult.rows[0],
        pokemons: pokemonsResult.rows
    };
}
function createTrainerFromData(data) {
    const trainer = new Trainer_1.Trainer(data.name, data.level, data.experience, data.id);
    data.pokemons.forEach((pokemonData) => {
        const pokemon = new Pokemon_1.Pokemon(pokemonData.name, pokemonData.life_points, trainer.id, pokemonData.id);
        pokemon.maxLifePoints = pokemonData.max_life_points;
        if (pokemonData.attacks) {
            pokemonData.attacks.forEach((attackData) => {
                const attack = new Attack_1.Attack(attackData.name, attackData.damage, attackData.usage_limit, attackData.id);
                attack.currentUsage = attackData.current_usage;
                pokemon.attacks.push(attack);
            });
        }
        trainer.addPokemon(pokemon);
    });
    return trainer;
}
async function updatePokemonLifePoints(trainer) {
    for (const pokemon of trainer.pokemons) {
        await db_1.pool.query('UPDATE pokemons SET life_points = $1 WHERE id = $2', [pokemon.lifePoints, pokemon.id]);
        for (const attack of pokemon.attacks) {
            await db_1.pool.query('UPDATE pokemon_attacks SET current_usage = $1 WHERE pokemon_id = $2 AND attack_id = $3', [attack.currentUsage, pokemon.id, attack.id]);
        }
    }
}
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint non trouvé' });
});
const server = app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📖 Documentation API: http://localhost:${PORT}/`);
});
const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} reçu. Fermeture du serveur...`);
    server.close(async () => {
        console.log('Serveur HTTP fermé.');
        try {
            await db_1.pool.end();
            console.log('Connexion à la base de données fermée.');
            process.exit(0);
        }
        catch (error) {
            console.error('Erreur lors de la fermeture de la base de données:', error);
            process.exit(1);
        }
    });
    setTimeout(() => {
        console.error('Fermeture forcée du serveur après timeout.');
        process.exit(1);
    }, 10000);
};
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
if (process.platform === 'win32') {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on('SIGINT', () => {
        process.emit('SIGINT');
    });
}
exports.default = app;
//# sourceMappingURL=server.js.map