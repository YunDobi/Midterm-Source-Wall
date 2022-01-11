/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users WHERE id = 1;`)
      .then(data => {
        const users = data.rows[0];
        //res.json({ users });
        const templateVars = {
          user: users,
        };
        console.log(templateVars);
        res.render("profile", templateVars)
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

  });

  return router;
};
