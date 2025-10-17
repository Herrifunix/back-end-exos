
CREATE DATABASE "not-pokemon";




CREATE TABLE attacks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    damage INTEGER NOT NULL CHECK (damage >= 0),
    usage_limit INTEGER NOT NULL CHECK (usage_limit > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE trainers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    level INTEGER DEFAULT 1 CHECK (level > 0),
    experience INTEGER DEFAULT 0 CHECK (experience >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE pokemons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    life_points INTEGER NOT NULL CHECK (life_points > 0),
    max_life_points INTEGER NOT NULL CHECK (max_life_points > 0),
    trainer_id INTEGER REFERENCES trainers(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE pokemon_attacks (
    id SERIAL PRIMARY KEY,
    pokemon_id INTEGER REFERENCES pokemons(id) ON DELETE CASCADE,
    attack_id INTEGER REFERENCES attacks(id) ON DELETE CASCADE,
    current_usage INTEGER DEFAULT 0,
    UNIQUE(pokemon_id, attack_id)
);


CREATE OR REPLACE FUNCTION check_max_attacks()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM pokemon_attacks WHERE pokemon_id = NEW.pokemon_id) >= 4 THEN
        RAISE EXCEPTION 'Un Pokémon ne peut avoir que 4 attaques maximum';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_max_attacks
    BEFORE INSERT ON pokemon_attacks
    FOR EACH ROW
    EXECUTE FUNCTION check_max_attacks();


INSERT INTO attacks (name, damage, usage_limit) VALUES
('Charge', 20, 10),
('Boule de Feu', 30, 8),
('Pistolet à O', 25, 12),
('Fouet Lianes', 35, 6),
('Tonnerre', 40, 5),
('Blizzard', 45, 4),
('Séisme', 50, 3),
('Lance-Flammes', 55, 5);


INSERT INTO attacks (name, damage, usage_limit) VALUES
('Tranche', 35, 15),
('Plaquage', 40, 10),
('Double Pied', 30, 12),
('Uppercut', 45, 7),
('Coupe-Vent', 30, 15),
('Ouragan', 50, 5),
('Aéropique', 40, 10),
('Aile d''Acier', 45, 8),
('Jet de Sable', 15, 20),
('Lame de Roc', 55, 5),
('Roulade', 20, 20),
('Éboulement', 50, 6),
('Tunnel', 45, 7),
('Lance-Boue', 25, 15),
('Croc de Feu', 40, 10),
('Danse Flammes', 35, 12),
('Déflagration', 60, 4),
('Nitrocharge', 30, 15),
('Aqua-Jet', 30, 15),
('Bulles d''O', 25, 20),
('Surf', 55, 6),
('Hydrocanon', 65, 4),
('Cascade', 50, 7),
('Eco-Sphère', 50, 7),
('Tranch''Herbe', 35, 15),
('Canon Graine', 30, 20),
('Danse-Fleur', 55, 5),
('Poudre Dodo', 0, 10),
('Vampigraine', 0, 10),
('Choc Mental', 35, 15),
('Psyko', 60, 4),
('Onde Folie', 0, 10),
('Ball''Ombre', 50, 6),
('Feinte', 40, 10),
('Morsure', 35, 15),
('Machouille', 50, 6),
('Tricherie', 55, 5),
('Éclair', 25, 20),
('Fatal-Foudre', 70, 3),
('Cage-Éclair', 0, 15),
('Étincelle', 35, 12),
('Poing-Éclair', 45, 8),
('Laser Glace', 55, 6),
('Vent Glace', 30, 15),
('Blizzard+', 65, 3),
('Poing-Glace', 45, 8),
('Coup d''Boule', 40, 12),
('Mitra-Poing', 60, 3),
('Close Combat', 65, 4),
('Poing de Feu', 45, 8),
('Pied Voltige', 60, 3),
('Draco-Rage', 40, 10),
('Draco-Griffe', 55, 6),
('Colère', 65, 4),
('Cisaillement', 45, 8),
('Griffe Acier', 40, 10),
('Bomb-Beurk', 50, 6),
('Dard-Venin', 25, 20),
('Direct Toxik', 45, 8),
('Toxik', 0, 10),
('Luminocanon', 55, 6),
('Bomb''Aimant', 40, 12),
('Queue de Fer', 50, 6),
('Gyroballe', 45, 8),
('Aurasphère', 55, 6),
('Éclat Magique', 45, 8),
('Pouvoir Lunaire', 60, 4),
('Vent Féérique', 30, 15),
('Sabotage', 50, 6),
('Jet-Pierres', 35, 15),
('Tête de Fer', 55, 5),
('Coup-Croix', 55, 5),
('Aboiement', 25, 20),
('Hurlement', 0, 10),
('Atterrissage', 0, 10),
('Repos', 0, 5),
('Giga Impact', 80, 2),
('Ultralaser', 75, 3),
('Éboulement+', 60, 4),
('Mur Lumière', 0, 10),
('Protection', 0, 10),
('Reflet', 0, 15),
('Hâte', 0, 15),
('Danse-Draco', 0, 10),
('Crocs Givre', 45, 8),
('Crocs Feu', 45, 8),
('Crocs Éclair', 45, 8),
('Poing Ombre', 45, 8),
('Ball''Brume', 40, 12),
('Exploforce', 70, 3),
('Telluriforce', 60, 4),
('Éruption', 75, 3),
('Puriforce', 55, 6),
('Giga-Sangsue', 55, 6),
('Méga-Sangsue', 45, 8),
('Claquoir', 45, 8),
('Lame d''Air', 45, 8),
('Giga-Impact+', 90, 1);


INSERT INTO trainers (name, level, experience) VALUES
('Sacha', 1, 0),
('Ondine', 1, 0),
('Pierre', 1, 0),
('Leaf', 1, 0),
('Blue', 1, 0),
('Red', 1, 0),
('Maître Légendaire', 50, 500);



INSERT INTO pokemons (name, life_points, max_life_points, trainer_id) VALUES
('Pikachu', 110, 110, 1),
('Salamèche', 105, 105, 1),
('Bulbizarre', 115, 115, 1),
('Carapuce', 120, 120, 1),
('Roucool', 95, 95, 1),
('Rattata', 90, 90, 1);


INSERT INTO pokemons (name, life_points, max_life_points, trainer_id) VALUES
('Stari', 120, 120, 2),
('Starmie', 135, 135, 2),
('Psykokwak', 110, 110, 2),
('Tentacool', 100, 100, 2),
('Lokhlass', 150, 150, 2),
('Poissoroi', 115, 115, 2);


INSERT INTO pokemons (name, life_points, max_life_points, trainer_id) VALUES
('Onix', 160, 160, 3),
('Racaillou', 120, 120, 3),
('Gravalanch', 140, 140, 3),
('Machoc', 130, 130, 3),
('Nosferapti', 95, 95, 3),
('Taupiqueur', 100, 100, 3);


INSERT INTO pokemons (name, life_points, max_life_points, trainer_id) VALUES
('Goupix', 100, 100, 4),
('Miaouss', 95, 95, 4),
('Évoli', 120, 120, 4),
('Mystherbe', 105, 105, 4),
('Rondoudou', 110, 110, 4),
('Papilusion', 115, 115, 4);


INSERT INTO pokemons (name, life_points, max_life_points, trainer_id) VALUES
('Draco', 140, 140, 5),
('Dracaufeu', 150, 150, 5),
('Tortank', 155, 155, 5),
('Florizarre', 155, 155, 5),
('Nidoqueen', 145, 145, 5),
('Nidoking', 145, 145, 5);


INSERT INTO pokemons (name, life_points, max_life_points, trainer_id) VALUES
('Ronflex', 180, 180, 6),
('Alakazam', 130, 130, 6),
('Élecsprint', 125, 125, 6),
('Dracolosse', 170, 170, 6),
('Arcanin', 150, 150, 6),
('Tyranocif', 165, 165, 6);


INSERT INTO pokemons (name, life_points, max_life_points, trainer_id) VALUES
('Mewtwo', 600, 600, 7),
('Lugia', 520, 520, 7),
('Ho-Oh', 520, 520, 7),
('Groudon', 580, 580, 7),
('Kyogre', 580, 580, 7),
('Rayquaza', 650, 650, 7);






INSERT INTO pokemon_attacks (pokemon_id, attack_id) VALUES
((SELECT id FROM pokemons WHERE name='Pikachu' AND trainer_id=1), (SELECT id FROM attacks WHERE name='Éclair')),
((SELECT id FROM pokemons WHERE name='Pikachu' AND trainer_id=1), (SELECT id FROM attacks WHERE name='Étincelle')),
((SELECT id FROM pokemons WHERE name='Pikachu' AND trainer_id=1), (SELECT id FROM attacks WHERE name='Tonnerre')),
((SELECT id FROM pokemons WHERE name='Pikachu' AND trainer_id=1), (SELECT id FROM attacks WHERE name='Fatal-Foudre')),
((SELECT id FROM pokemons WHERE name='Salamèche' AND trainer_id=1), (SELECT id FROM attacks WHERE name='Croc de Feu')),
((SELECT id FROM pokemons WHERE name='Salamèche' AND trainer_id=1), (SELECT id FROM attacks WHERE name='Lance-Flammes')),
((SELECT id FROM pokemons WHERE name='Salamèche' AND trainer_id=1), (SELECT id FROM attacks WHERE name='Déflagration')),
((SELECT id FROM pokemons WHERE name='Salamèche' AND trainer_id=1), (SELECT id FROM attacks WHERE name='Nitrocharge')),
((SELECT id FROM pokemons WHERE name='Bulbizarre' AND trainer_id=1), (SELECT id FROM attacks WHERE name='Tranch''Herbe')),
((SELECT id FROM pokemons WHERE name='Bulbizarre' AND trainer_id=1), (SELECT id FROM attacks WHERE name='Canon Graine')),
((SELECT id FROM pokemons WHERE name='Bulbizarre' AND trainer_id=1), (SELECT id FROM attacks WHERE name='Eco-Sphère')),
((SELECT id FROM pokemons WHERE name='Bulbizarre' AND trainer_id=1), (SELECT id FROM attacks WHERE name='Danse-Fleur')),
((SELECT id FROM pokemons WHERE name='Carapuce' AND trainer_id=1), (SELECT id FROM attacks WHERE name='Aqua-Jet')),
((SELECT id FROM pokemons WHERE name='Carapuce' AND trainer_id=1), (SELECT id FROM attacks WHERE name='Pistolet à O')),
((SELECT id FROM pokemons WHERE name='Carapuce' AND trainer_id=1), (SELECT id FROM attacks WHERE name='Surf')),
((SELECT id FROM pokemons WHERE name='Carapuce' AND trainer_id=1), (SELECT id FROM attacks WHERE name='Hydrocanon')),
((SELECT id FROM pokemons WHERE name='Roucool' AND trainer_id=1), (SELECT id FROM attacks WHERE name='Aéropique')),
((SELECT id FROM pokemons WHERE name='Roucool' AND trainer_id=1), (SELECT id FROM attacks WHERE name='Lame d''Air')),
((SELECT id FROM pokemons WHERE name='Roucool' AND trainer_id=1), (SELECT id FROM attacks WHERE name='Coupe-Vent')),
((SELECT id FROM pokemons WHERE name='Roucool' AND trainer_id=1), (SELECT id FROM attacks WHERE name='Ouragan')),
((SELECT id FROM pokemons WHERE name='Rattata' AND trainer_id=1), (SELECT id FROM attacks WHERE name='Tranche')),
((SELECT id FROM pokemons WHERE name='Rattata' AND trainer_id=1), (SELECT id FROM attacks WHERE name='Morsure')),
((SELECT id FROM pokemons WHERE name='Rattata' AND trainer_id=1), (SELECT id FROM attacks WHERE name='Feinte')),
((SELECT id FROM pokemons WHERE name='Rattata' AND trainer_id=1), (SELECT id FROM attacks WHERE name='Coup d''Boule'));


INSERT INTO pokemon_attacks (pokemon_id, attack_id) VALUES
((SELECT id FROM pokemons WHERE name='Stari' AND trainer_id=2), (SELECT id FROM attacks WHERE name='Bulles d''O')),
((SELECT id FROM pokemons WHERE name='Stari' AND trainer_id=2), (SELECT id FROM attacks WHERE name='Aqua-Jet')),
((SELECT id FROM pokemons WHERE name='Stari' AND trainer_id=2), (SELECT id FROM attacks WHERE name='Cascade')),
((SELECT id FROM pokemons WHERE name='Stari' AND trainer_id=2), (SELECT id FROM attacks WHERE name='Surf')),
((SELECT id FROM pokemons WHERE name='Starmie' AND trainer_id=2), (SELECT id FROM attacks WHERE name='Hydrocanon')),
((SELECT id FROM pokemons WHERE name='Starmie' AND trainer_id=2), (SELECT id FROM attacks WHERE name='Psyko')),
((SELECT id FROM pokemons WHERE name='Starmie' AND trainer_id=2), (SELECT id FROM attacks WHERE name='Choc Mental')),
((SELECT id FROM pokemons WHERE name='Starmie' AND trainer_id=2), (SELECT id FROM attacks WHERE name='Surf')),
((SELECT id FROM pokemons WHERE name='Psykokwak' AND trainer_id=2), (SELECT id FROM attacks WHERE name='Choc Mental')),
((SELECT id FROM pokemons WHERE name='Psykokwak' AND trainer_id=2), (SELECT id FROM attacks WHERE name='Feinte')),
((SELECT id FROM pokemons WHERE name='Psykokwak' AND trainer_id=2), (SELECT id FROM attacks WHERE name='Aqua-Jet')),
((SELECT id FROM pokemons WHERE name='Psykokwak' AND trainer_id=2), (SELECT id FROM attacks WHERE name='Bulles d''O')),
((SELECT id FROM pokemons WHERE name='Tentacool' AND trainer_id=2), (SELECT id FROM attacks WHERE name='Dard-Venin')),
((SELECT id FROM pokemons WHERE name='Tentacool' AND trainer_id=2), (SELECT id FROM attacks WHERE name='Direct Toxik')),
((SELECT id FROM pokemons WHERE name='Tentacool' AND trainer_id=2), (SELECT id FROM attacks WHERE name='Lance-Boue')),
((SELECT id FROM pokemons WHERE name='Tentacool' AND trainer_id=2), (SELECT id FROM attacks WHERE name='Surf')),
((SELECT id FROM pokemons WHERE name='Lokhlass' AND trainer_id=2), (SELECT id FROM attacks WHERE name='Surf')),
((SELECT id FROM pokemons WHERE name='Lokhlass' AND trainer_id=2), (SELECT id FROM attacks WHERE name='Laser Glace')),
((SELECT id FROM pokemons WHERE name='Lokhlass' AND trainer_id=2), (SELECT id FROM attacks WHERE name='Blizzard')),
((SELECT id FROM pokemons WHERE name='Lokhlass' AND trainer_id=2), (SELECT id FROM attacks WHERE name='Hydrocanon')),
((SELECT id FROM pokemons WHERE name='Poissoroi' AND trainer_id=2), (SELECT id FROM attacks WHERE name='Cascade')),
((SELECT id FROM pokemons WHERE name='Poissoroi' AND trainer_id=2), (SELECT id FROM attacks WHERE name='Aqua-Jet')),
((SELECT id FROM pokemons WHERE name='Poissoroi' AND trainer_id=2), (SELECT id FROM attacks WHERE name='Tranche')),
((SELECT id FROM pokemons WHERE name='Poissoroi' AND trainer_id=2), (SELECT id FROM attacks WHERE name='Plaquage'));


INSERT INTO pokemon_attacks (pokemon_id, attack_id) VALUES
((SELECT id FROM pokemons WHERE name='Onix' AND trainer_id=3), (SELECT id FROM attacks WHERE name='Éboulement')),
((SELECT id FROM pokemons WHERE name='Onix' AND trainer_id=3), (SELECT id FROM attacks WHERE name='Lame de Roc')),
((SELECT id FROM pokemons WHERE name='Onix' AND trainer_id=3), (SELECT id FROM attacks WHERE name='Tunnel')),
((SELECT id FROM pokemons WHERE name='Onix' AND trainer_id=3), (SELECT id FROM attacks WHERE name='Séisme')),
((SELECT id FROM pokemons WHERE name='Racaillou' AND trainer_id=3), (SELECT id FROM attacks WHERE name='Jet-Pierres')),
((SELECT id FROM pokemons WHERE name='Racaillou' AND trainer_id=3), (SELECT id FROM attacks WHERE name='Roulade')),
((SELECT id FROM pokemons WHERE name='Racaillou' AND trainer_id=3), (SELECT id FROM attacks WHERE name='Éboulement')),
((SELECT id FROM pokemons WHERE name='Racaillou' AND trainer_id=3), (SELECT id FROM attacks WHERE name='Lame de Roc')),
((SELECT id FROM pokemons WHERE name='Gravalanch' AND trainer_id=3), (SELECT id FROM attacks WHERE name='Éboulement+')),
((SELECT id FROM pokemons WHERE name='Gravalanch' AND trainer_id=3), (SELECT id FROM attacks WHERE name='Telluriforce')),
((SELECT id FROM pokemons WHERE name='Gravalanch' AND trainer_id=3), (SELECT id FROM attacks WHERE name='Séisme')),
((SELECT id FROM pokemons WHERE name='Gravalanch' AND trainer_id=3), (SELECT id FROM attacks WHERE name='Tunnel')),
((SELECT id FROM pokemons WHERE name='Machoc' AND trainer_id=3), (SELECT id FROM attacks WHERE name='Close Combat')),
((SELECT id FROM pokemons WHERE name='Machoc' AND trainer_id=3), (SELECT id FROM attacks WHERE name='Mitra-Poing')),
((SELECT id FROM pokemons WHERE name='Machoc' AND trainer_id=3), (SELECT id FROM attacks WHERE name='Poing de Feu')),
((SELECT id FROM pokemons WHERE name='Machoc' AND trainer_id=3), (SELECT id FROM attacks WHERE name='Uppercut')),
((SELECT id FROM pokemons WHERE name='Nosferapti' AND trainer_id=3), (SELECT id FROM attacks WHERE name='Morsure')),
((SELECT id FROM pokemons WHERE name='Nosferapti' AND trainer_id=3), (SELECT id FROM attacks WHERE name='Ball''Ombre')),
((SELECT id FROM pokemons WHERE name='Nosferapti' AND trainer_id=3), (SELECT id FROM attacks WHERE name='Aéropique')),
((SELECT id FROM pokemons WHERE name='Nosferapti' AND trainer_id=3), (SELECT id FROM attacks WHERE name='Lame d''Air')),
((SELECT id FROM pokemons WHERE name='Taupiqueur' AND trainer_id=3), (SELECT id FROM attacks WHERE name='Tunnel')),
((SELECT id FROM pokemons WHERE name='Taupiqueur' AND trainer_id=3), (SELECT id FROM attacks WHERE name='Telluriforce')),
((SELECT id FROM pokemons WHERE name='Taupiqueur' AND trainer_id=3), (SELECT id FROM attacks WHERE name='Séisme')),
((SELECT id FROM pokemons WHERE name='Taupiqueur' AND trainer_id=3), (SELECT id FROM attacks WHERE name='Roulade'));


INSERT INTO pokemon_attacks (pokemon_id, attack_id) VALUES
((SELECT id FROM pokemons WHERE name='Goupix' AND trainer_id=4), (SELECT id FROM attacks WHERE name='Croc de Feu')),
((SELECT id FROM pokemons WHERE name='Goupix' AND trainer_id=4), (SELECT id FROM attacks WHERE name='Lance-Flammes')),
((SELECT id FROM pokemons WHERE name='Goupix' AND trainer_id=4), (SELECT id FROM attacks WHERE name='Déflagration')),
((SELECT id FROM pokemons WHERE name='Goupix' AND trainer_id=4), (SELECT id FROM attacks WHERE name='Nitrocharge')),
((SELECT id FROM pokemons WHERE name='Miaouss' AND trainer_id=4), (SELECT id FROM attacks WHERE name='Griffe Acier')),
((SELECT id FROM pokemons WHERE name='Miaouss' AND trainer_id=4), (SELECT id FROM attacks WHERE name='Feinte')),
((SELECT id FROM pokemons WHERE name='Miaouss' AND trainer_id=4), (SELECT id FROM attacks WHERE name='Sabotage')),
((SELECT id FROM pokemons WHERE name='Miaouss' AND trainer_id=4), (SELECT id FROM attacks WHERE name='Coup d''Boule')),
((SELECT id FROM pokemons WHERE name='Évoli' AND trainer_id=4), (SELECT id FROM attacks WHERE name='Tranche')),
((SELECT id FROM pokemons WHERE name='Évoli' AND trainer_id=4), (SELECT id FROM attacks WHERE name='Plaquage')),
((SELECT id FROM pokemons WHERE name='Évoli' AND trainer_id=4), (SELECT id FROM attacks WHERE name='Coup d''Boule')),
((SELECT id FROM pokemons WHERE name='Évoli' AND trainer_id=4), (SELECT id FROM attacks WHERE name='Aboiement')),
((SELECT id FROM pokemons WHERE name='Mystherbe' AND trainer_id=4), (SELECT id FROM attacks WHERE name='Tranch''Herbe')),
((SELECT id FROM pokemons WHERE name='Mystherbe' AND trainer_id=4), (SELECT id FROM attacks WHERE name='Canon Graine')),
((SELECT id FROM pokemons WHERE name='Mystherbe' AND trainer_id=4), (SELECT id FROM attacks WHERE name='Eco-Sphère')),
((SELECT id FROM pokemons WHERE name='Mystherbe' AND trainer_id=4), (SELECT id FROM attacks WHERE name='Danse-Fleur')),
((SELECT id FROM pokemons WHERE name='Rondoudou' AND trainer_id=4), (SELECT id FROM attacks WHERE name='Éclat Magique')),
((SELECT id FROM pokemons WHERE name='Rondoudou' AND trainer_id=4), (SELECT id FROM attacks WHERE name='Pouvoir Lunaire')),
((SELECT id FROM pokemons WHERE name='Rondoudou' AND trainer_id=4), (SELECT id FROM attacks WHERE name='Coup d''Boule')),
((SELECT id FROM pokemons WHERE name='Rondoudou' AND trainer_id=4), (SELECT id FROM attacks WHERE name='Plaquage')),
((SELECT id FROM pokemons WHERE name='Papilusion' AND trainer_id=4), (SELECT id FROM attacks WHERE name='Lame d''Air')),
((SELECT id FROM pokemons WHERE name='Papilusion' AND trainer_id=4), (SELECT id FROM attacks WHERE name='Aéropique')),
((SELECT id FROM pokemons WHERE name='Papilusion' AND trainer_id=4), (SELECT id FROM attacks WHERE name='Eco-Sphère')),
((SELECT id FROM pokemons WHERE name='Papilusion' AND trainer_id=4), (SELECT id FROM attacks WHERE name='Vent Féérique'));


INSERT INTO pokemon_attacks (pokemon_id, attack_id) VALUES
((SELECT id FROM pokemons WHERE name='Draco' AND trainer_id=5), (SELECT id FROM attacks WHERE name='Draco-Rage')),
((SELECT id FROM pokemons WHERE name='Draco' AND trainer_id=5), (SELECT id FROM attacks WHERE name='Draco-Griffe')),
((SELECT id FROM pokemons WHERE name='Draco' AND trainer_id=5), (SELECT id FROM attacks WHERE name='Colère')),
((SELECT id FROM pokemons WHERE name='Draco' AND trainer_id=5), (SELECT id FROM attacks WHERE name='Ouragan')),
((SELECT id FROM pokemons WHERE name='Dracaufeu' AND trainer_id=5), (SELECT id FROM attacks WHERE name='Lance-Flammes')),
((SELECT id FROM pokemons WHERE name='Dracaufeu' AND trainer_id=5), (SELECT id FROM attacks WHERE name='Déflagration')),
((SELECT id FROM pokemons WHERE name='Dracaufeu' AND trainer_id=5), (SELECT id FROM attacks WHERE name='Croc de Feu')),
((SELECT id FROM pokemons WHERE name='Dracaufeu' AND trainer_id=5), (SELECT id FROM attacks WHERE name='Aile d''Acier')),
((SELECT id FROM pokemons WHERE name='Tortank' AND trainer_id=5), (SELECT id FROM attacks WHERE name='Hydrocanon')),
((SELECT id FROM pokemons WHERE name='Tortank' AND trainer_id=5), (SELECT id FROM attacks WHERE name='Surf')),
((SELECT id FROM pokemons WHERE name='Tortank' AND trainer_id=5), (SELECT id FROM attacks WHERE name='Cascade')),
((SELECT id FROM pokemons WHERE name='Tortank' AND trainer_id=5), (SELECT id FROM attacks WHERE name='Poing-Glace')),
((SELECT id FROM pokemons WHERE name='Florizarre' AND trainer_id=5), (SELECT id FROM attacks WHERE name='Eco-Sphère')),
((SELECT id FROM pokemons WHERE name='Florizarre' AND trainer_id=5), (SELECT id FROM attacks WHERE name='Tranch''Herbe')),
((SELECT id FROM pokemons WHERE name='Florizarre' AND trainer_id=5), (SELECT id FROM attacks WHERE name='Canon Graine')),
((SELECT id FROM pokemons WHERE name='Florizarre' AND trainer_id=5), (SELECT id FROM attacks WHERE name='Danse-Fleur')),
((SELECT id FROM pokemons WHERE name='Nidoqueen' AND trainer_id=5), (SELECT id FROM attacks WHERE name='Direct Toxik')),
((SELECT id FROM pokemons WHERE name='Nidoqueen' AND trainer_id=5), (SELECT id FROM attacks WHERE name='Séisme')),
((SELECT id FROM pokemons WHERE name='Nidoqueen' AND trainer_id=5), (SELECT id FROM attacks WHERE name='Bomb-Beurk')),
((SELECT id FROM pokemons WHERE name='Nidoqueen' AND trainer_id=5), (SELECT id FROM attacks WHERE name='Queue de Fer')),
((SELECT id FROM pokemons WHERE name='Nidoking' AND trainer_id=5), (SELECT id FROM attacks WHERE name='Direct Toxik')),
((SELECT id FROM pokemons WHERE name='Nidoking' AND trainer_id=5), (SELECT id FROM attacks WHERE name='Séisme')),
((SELECT id FROM pokemons WHERE name='Nidoking' AND trainer_id=5), (SELECT id FROM attacks WHERE name='Bomb-Beurk')),
((SELECT id FROM pokemons WHERE name='Nidoking' AND trainer_id=5), (SELECT id FROM attacks WHERE name='Lame de Roc'));


INSERT INTO pokemon_attacks (pokemon_id, attack_id) VALUES
((SELECT id FROM pokemons WHERE name='Ronflex' AND trainer_id=6), (SELECT id FROM attacks WHERE name='Plaquage')),
((SELECT id FROM pokemons WHERE name='Ronflex' AND trainer_id=6), (SELECT id FROM attacks WHERE name='Coup d''Boule')),
((SELECT id FROM pokemons WHERE name='Ronflex' AND trainer_id=6), (SELECT id FROM attacks WHERE name='Giga Impact')),
((SELECT id FROM pokemons WHERE name='Ronflex' AND trainer_id=6), (SELECT id FROM attacks WHERE name='Ultralaser')),
((SELECT id FROM pokemons WHERE name='Alakazam' AND trainer_id=6), (SELECT id FROM attacks WHERE name='Psyko')),
((SELECT id FROM pokemons WHERE name='Alakazam' AND trainer_id=6), (SELECT id FROM attacks WHERE name='Choc Mental')),
((SELECT id FROM pokemons WHERE name='Alakazam' AND trainer_id=6), (SELECT id FROM attacks WHERE name='Poing Ombre')),
((SELECT id FROM pokemons WHERE name='Alakazam' AND trainer_id=6), (SELECT id FROM attacks WHERE name='Aurasphère')),
((SELECT id FROM pokemons WHERE name='Élecsprint' AND trainer_id=6), (SELECT id FROM attacks WHERE name='Éclair')),
((SELECT id FROM pokemons WHERE name='Élecsprint' AND trainer_id=6), (SELECT id FROM attacks WHERE name='Étincelle')),
((SELECT id FROM pokemons WHERE name='Élecsprint' AND trainer_id=6), (SELECT id FROM attacks WHERE name='Fatal-Foudre')),
((SELECT id FROM pokemons WHERE name='Élecsprint' AND trainer_id=6), (SELECT id FROM attacks WHERE name='Poing-Éclair')),
((SELECT id FROM pokemons WHERE name='Dracolosse' AND trainer_id=6), (SELECT id FROM attacks WHERE name='Draco-Griffe')),
((SELECT id FROM pokemons WHERE name='Dracolosse' AND trainer_id=6), (SELECT id FROM attacks WHERE name='Colère')),
((SELECT id FROM pokemons WHERE name='Dracolosse' AND trainer_id=6), (SELECT id FROM attacks WHERE name='Ouragan')),
((SELECT id FROM pokemons WHERE name='Dracolosse' AND trainer_id=6), (SELECT id FROM attacks WHERE name='Aile d''Acier')),
((SELECT id FROM pokemons WHERE name='Arcanin' AND trainer_id=6), (SELECT id FROM attacks WHERE name='Lance-Flammes')),
((SELECT id FROM pokemons WHERE name='Arcanin' AND trainer_id=6), (SELECT id FROM attacks WHERE name='Déflagration')),
((SELECT id FROM pokemons WHERE name='Arcanin' AND trainer_id=6), (SELECT id FROM attacks WHERE name='Croc de Feu')),
((SELECT id FROM pokemons WHERE name='Arcanin' AND trainer_id=6), (SELECT id FROM attacks WHERE name='Nitrocharge')),
((SELECT id FROM pokemons WHERE name='Tyranocif' AND trainer_id=6), (SELECT id FROM attacks WHERE name='Lame de Roc')),
((SELECT id FROM pokemons WHERE name='Tyranocif' AND trainer_id=6), (SELECT id FROM attacks WHERE name='Éboulement')),
((SELECT id FROM pokemons WHERE name='Tyranocif' AND trainer_id=6), (SELECT id FROM attacks WHERE name='Machouille')),
((SELECT id FROM pokemons WHERE name='Tyranocif' AND trainer_id=6), (SELECT id FROM attacks WHERE name='Séisme'));


INSERT INTO pokemon_attacks (pokemon_id, attack_id) VALUES
((SELECT id FROM pokemons WHERE name='Mewtwo' AND trainer_id=7), (SELECT id FROM attacks WHERE name='Psyko')),
((SELECT id FROM pokemons WHERE name='Mewtwo' AND trainer_id=7), (SELECT id FROM attacks WHERE name='Aurasphère')),
((SELECT id FROM pokemons WHERE name='Mewtwo' AND trainer_id=7), (SELECT id FROM attacks WHERE name='Ultralaser')),
((SELECT id FROM pokemons WHERE name='Mewtwo' AND trainer_id=7), (SELECT id FROM attacks WHERE name='Exploforce')),
((SELECT id FROM pokemons WHERE name='Lugia' AND trainer_id=7), (SELECT id FROM attacks WHERE name='Lame d''Air')),
((SELECT id FROM pokemons WHERE name='Lugia' AND trainer_id=7), (SELECT id FROM attacks WHERE name='Aéropique')),
((SELECT id FROM pokemons WHERE name='Lugia' AND trainer_id=7), (SELECT id FROM attacks WHERE name='Surf')),
((SELECT id FROM pokemons WHERE name='Lugia' AND trainer_id=7), (SELECT id FROM attacks WHERE name='Laser Glace')),
((SELECT id FROM pokemons WHERE name='Ho-Oh' AND trainer_id=7), (SELECT id FROM attacks WHERE name='Lance-Flammes')),
((SELECT id FROM pokemons WHERE name='Ho-Oh' AND trainer_id=7), (SELECT id FROM attacks WHERE name='Déflagration')),
((SELECT id FROM pokemons WHERE name='Ho-Oh' AND trainer_id=7), (SELECT id FROM attacks WHERE name='Lame d''Air')),
((SELECT id FROM pokemons WHERE name='Ho-Oh' AND trainer_id=7), (SELECT id FROM attacks WHERE name='Nitrocharge')),
((SELECT id FROM pokemons WHERE name='Groudon' AND trainer_id=7), (SELECT id FROM attacks WHERE name='Séisme')),
((SELECT id FROM pokemons WHERE name='Groudon' AND trainer_id=7), (SELECT id FROM attacks WHERE name='Telluriforce')),
((SELECT id FROM pokemons WHERE name='Groudon' AND trainer_id=7), (SELECT id FROM attacks WHERE name='Lame de Roc')),
((SELECT id FROM pokemons WHERE name='Groudon' AND trainer_id=7), (SELECT id FROM attacks WHERE name='Éruption')),
((SELECT id FROM pokemons WHERE name='Kyogre' AND trainer_id=7), (SELECT id FROM attacks WHERE name='Hydrocanon')),
((SELECT id FROM pokemons WHERE name='Kyogre' AND trainer_id=7), (SELECT id FROM attacks WHERE name='Surf')),
((SELECT id FROM pokemons WHERE name='Kyogre' AND trainer_id=7), (SELECT id FROM attacks WHERE name='Cascade')),
((SELECT id FROM pokemons WHERE name='Kyogre' AND trainer_id=7), (SELECT id FROM attacks WHERE name='Laser Glace')),
((SELECT id FROM pokemons WHERE name='Rayquaza' AND trainer_id=7), (SELECT id FROM attacks WHERE name='Draco-Griffe')),
((SELECT id FROM pokemons WHERE name='Rayquaza' AND trainer_id=7), (SELECT id FROM attacks WHERE name='Colère')),
((SELECT id FROM pokemons WHERE name='Rayquaza' AND trainer_id=7), (SELECT id FROM attacks WHERE name='Ouragan')),
((SELECT id FROM pokemons WHERE name='Rayquaza' AND trainer_id=7), (SELECT id FROM attacks WHERE name='Lame d''Air'));
