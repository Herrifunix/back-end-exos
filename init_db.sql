
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    is_done BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




INSERT INTO tasks (title, description, is_done) VALUES 
    ('Apprendre Node.js', 'Comprendre les bases de Node.js et Express', false),
    ('Configurer PostgreSQL', 'Installer et configurer une base de données PostgreSQL', true),
    ('Créer une API REST', 'Développer une API pour gérer une todo list', false)
ON CONFLICT DO NOTHING;


SELECT COUNT(*) as nombre_de_taches FROM tasks;