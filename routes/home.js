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

    // db.query('SELECT * FROM resources;')
    //   .then((response) => {
    //     res.json(response.rows);
    //   });

    res.render("home");
  });

  return router;
};
