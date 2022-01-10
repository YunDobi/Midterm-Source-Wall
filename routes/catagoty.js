/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM categories`;
    console.log(query);
    db.query(query)
      .then(data => {
        const widgets = data.rows;
        res.json({ widgets });
      });
  });

  router.get('/:user_id', (req, res) => {
    db.query('SELECT * FROM categories WHERE user_id = $1;', [req.params.user_id])
      .then((response)=> {
        res.json(response.rows[0]);
      });
  });

  return router;
};
