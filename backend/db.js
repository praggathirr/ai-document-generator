const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      project_overview TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS selected_topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      topic TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS subtopic_responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      topic TEXT,
      subtopic TEXT,
      response TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);
});

module.exports = db;
