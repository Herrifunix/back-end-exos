
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(80) NOT NULL
);

-- Insertion des trois utilisateurs de test
INSERT INTO users (email) VALUES ('email1@test.com');
INSERT INTO users (email) VALUES ('email2@test.com');
INSERT INTO users (email) VALUES ('email3@test.com');

-- Vérification des données insérées
SELECT * FROM users;