-- Script d'initialisation de la base de données pour l'application Todo List
-- Exécutez ce script dans votre base PostgreSQL avant de lancer le serveur

-- Création de la table tasks
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    is_done BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_tasks_is_done ON tasks(is_done);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour automatiquement updated_at lors des modifications
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insertion de données d'exemple (optionnel)
INSERT INTO tasks (title, description, is_done) VALUES 
    ('Apprendre Node.js', 'Comprendre les bases de Node.js et Express', false),
    ('Configurer PostgreSQL', 'Installer et configurer une base de données PostgreSQL', true),
    ('Créer une API REST', 'Développer une API pour gérer une todo list', false)
ON CONFLICT DO NOTHING;

-- Affichage des tâches créées
SELECT 'Base de données initialisée avec succès !' as message;
SELECT COUNT(*) as nombre_de_taches FROM tasks;