const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static("public"));

app.use("/templates", express.static("templates"));

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

});

let accepted_urls = ["/hello", "/auth", "/static", "/some-html", "/some-json", "/transaction", "/log-req", "/exo-query-string", "/get-user/:userId"];

pool.connect((err, client, release) => {
  if (err) {
    console.error("Erreur de connexion à la base de données:", err);
    console.error("Vérifiez vos paramètres dans le fichier .env");
  } else {
    console.log("Connexion à PostgreSQL réussie");
    console.log(
      `Connecté à la base: ${process.env.DB_NAME} sur ${process.env.DB_HOST}:${process.env.DB_PORT}`
    );
    release();
  }
});

function getConnection(username, password, database) {
  const connectionPool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    user: username,
    password: password,
    database: database,

  });

  connectionPool.connect((err, client, release) => {
    if (err) {
      console.error(
        `Erreur de connexion pour ${username}@${database}:`,
        err.message
      );
    } else {
      console.log(`Connexion réussie: ${username}@${database}`);
      release();
    }
  });

  return connectionPool;
}

/**
 * Fonction pour récupérer tous les utilisateurs
 * @param {function} callback - Fonction de rappel avec (err, users)
 */
function getUsers(callback) {
  const query = "SELECT id, email FROM users ORDER BY id";

  pool.query(query, (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération des utilisateurs:", err);
      callback(err, null);
    } else {
      const users = result.rows;
      console.log(`${users.length} utilisateur(s) récupéré(s)`);
      callback(null, users);
    }
  });
}

app.get("/", (req, res) => {
  res.send("Hello World! - Version avec PostgreSQL");
});

app.get("/static", (req, res) => {
  res.sendFile(__dirname + "/templates/index.html");
});

app.get("/some-html", (req, res) => {
  res.send("<html><body><h1>bonjour html</h1></body></html>");
});

app.get("/some-json", (req, res) => {
  const obj = { age: 22, nom: "Jane" };
  res.json(obj);
});

app.get("/transaction", (req, res) => {
  res.json([100, 2000, 3000]);
});

app.get("/log-req", (req, res) => {
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  res.send("Logged headers to console");
});

app.get("/exo-query-string", (req, res) => {
  console.log("Query:", req.query);
  const age = req.query.age;
  if (age) {
    res.send(`<h1>${age}</h1>`);
  } else {
    res.send("hello");
  }
});

function monPropreMiddleware(req, res, next) {
  console.log("Je déteste le js");

  next();
}
app.use(monPropreMiddleware);

app.get("/get-user/:userId", monPropreMiddleware, (req, res) => {
  console.log("Params:", req.params);
  res.send(`User ID: ${req.params.userId}`);
});

app.get("/users", (req, res) => {
  getUsers((err, users) => {
    if (err) {
      res.status(500).json({
        error: "Erreur lors de la récupération des utilisateurs",
        details: err.message,
      });
    } else {
      res.json({
        message: "Liste des utilisateurs",
        count: users.length,
        users: users,
      });
    }
  });
});

app.post("/users", async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({
      error: "Email requis et doit être une chaîne de caractères",
    });
  }

  try {
    const query = "INSERT INTO users (email) VALUES ($1) RETURNING id, email";
    const { rows } = await pool.query(query, [email]);

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: rows[0],
    });
  } catch (err) {
    console.error("Erreur lors de la création de l'utilisateur:", err);
    res.status(500).json({
      error: "Erreur lors de la création de l'utilisateur",
      details: err.message,
    });
  }
});

app.get("/test-connection", (req, res) => {
  const { username, password, database } = req.query;

  if (!username || !password || !database) {
    return res.status(400).json({
      error: "Paramètres requis: username, password, database",
      example:
        "/test-connection?username=postgres&password=motdepasse&database=exo",
    });
  }

  try {
    const testPool = getConnection(username, password, database);

    testPool.query("SELECT NOW() as current_time", (err, result) => {
      if (err) {
        res.status(500).json({
          error: "Échec de la connexion",
          details: err.message,
        });
      } else {
        res.json({
          message: "Connexion réussie",
          server_time: result.rows[0].current_time,
          connection_info: {
            username: username,
            database: database,
            host: process.env.DB_HOST || "localhost",
          },
        });
      }

      testPool.end();
    });
  } catch (err) {
    res.status(500).json({
      error: "Erreur lors de la création de la connexion",
      details: err.message,
    });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const query =
      "SELECT id, title, description, is_done FROM tasks ORDER BY id";
    const { rows } = await pool.query(query);

    const tasks = rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      isDone: row.is_done,
    }));

    res.json(tasks);
  } catch (err) {
    console.error("Erreur lors de la récupération des tâches:", err);
    res.status(500).json({ error: "Erreur de base de données" });
  }
});

app.get("/hello", async (req, res) => {
  res.send("<html><body><h1>Bonjour</h1></body></html>");
});

app.get("/restricted", (req, res) => {
  const token = req.headers.authorization;

  if (!token || token !== 42) {
    return res.status(403).json({ error: "Accès interdit par le firewall" });
  }

  res.send("Bienvenue dans la zone restreinte !");
});

app.post("/new-task", async (req, res) => {
  const { title, description, isDone } = req.body;

  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof isDone !== "boolean"
  ) {
    return res.status(400).json({
      error:
        "Format de tâche invalide. Attendu: { title: string, description: string, isDone: boolean }",
    });
  }

  try {
    const query =
      "INSERT INTO tasks (title, description, is_done) VALUES ($1, $2, $3) RETURNING id, title, description, is_done";
    const values = [title, description, isDone];
    const { rows } = await pool.query(query, values);

    const newTask = rows[0];
    const task = {
      id: newTask.id,
      title: newTask.title,
      description: newTask.description,
      isDone: newTask.is_done,
    };

    res.status(201).json(task);
  } catch (err) {
    console.error("Erreur lors de la création de la tâche:", err);
    res.status(500).json({ error: "Erreur de base de données" });
  }
});

function firewall(req, res, next) {
  const token = req.headers.token;
  if (accepted_urls.includes(req.url)) {
    return next();
  } else if (token !== "42") {
    return res.status(403).json({ error: "Accès refusé par le firewall" });
  }
  next();
}
app.use(firewall);

app.post("/auth", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "password") {
    let randomNumber = Math.floor(Math.random() * 1000000);
    return res.json({ token: randomNumber });
  }

  res.status(401).json({ error: "Identifiants invalides" });
});

app.put("/update-task/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, description, isDone } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID invalide" });
  }

  try {
    const checkQuery = "SELECT id FROM tasks WHERE id = $1";
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Tâche non trouvée" });
    }

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (title !== undefined) {
      if (typeof title !== "string") {
        return res
          .status(400)
          .json({ error: "title doit être une chaîne de caractères" });
      }
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }

    if (description !== undefined) {
      if (typeof description !== "string") {
        return res
          .status(400)
          .json({ error: "description doit être une chaîne de caractères" });
      }
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }

    if (isDone !== undefined) {
      if (typeof isDone !== "boolean") {
        return res.status(400).json({ error: "isDone doit être un booléen" });
      }
      updates.push(`is_done = $${paramCount++}`);
      values.push(isDone);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "Aucune donnée à mettre à jour" });
    }

    values.push(id);
    const query = `UPDATE tasks SET ${updates.join(
      ", "
    )} WHERE id = $${paramCount} RETURNING id, title, description, is_done`;

    const { rows } = await pool.query(query, values);
    const updatedTask = rows[0];

    const task = {
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description,
      isDone: updatedTask.is_done,
    };

    res.json(task);
  } catch (err) {
    console.error("Erreur lors de la mise à jour de la tâche:", err);
    res.status(500).json({ error: "Erreur de base de données" });
  }
});

app.delete("/delete-task/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID invalide" });
  }

  try {
    const query =
      "DELETE FROM tasks WHERE id = $1 RETURNING id, title, description, is_done";
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Tâche non trouvée" });
    }

    const deletedTask = rows[0];
    const task = {
      id: deletedTask.id,
      title: deletedTask.title,
      description: deletedTask.description,
      isDone: deletedTask.is_done,
    };

    res.json({ deleted: task });
  } catch (err) {
    console.error("Erreur lors de la suppression de la tâche:", err);
    res.status(500).json({ error: "Erreur de base de données" });
  }
});

app.get("/hello", (req, res) => {
  res.send("<h1>hello</h1>");
});

app.get("/restricted1", (req, res) => {
 
  
  res.json({ message: "Accès autorisé à restricted1" });
});

app.get("/restricted2", (req, res) => {
  
  res.send("<h1>Accès autorisé à restricted2</h1>");
});

app.use((req, res) => {
  res.status(404).send("Not Found");
});

process.on("SIGINT", async () => {
  console.log("Fermeture du serveur...");
  await pool.end();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Fermeture du serveur...");
  await pool.end();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Serveur Express avec PostgreSQL écoute sur localhost:${port}`);
});
