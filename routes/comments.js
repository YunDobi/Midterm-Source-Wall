const express = require('express');
const router  = express.Router();

const comments = (db) => {
  // GET /comments/
  router.get('/', (req, res) => {
    db.query('SELECT * FROM comments;')
      .then((response) => {
        res.json(response.rows);
      });
  });
  return router;
};

module.exports = comments;