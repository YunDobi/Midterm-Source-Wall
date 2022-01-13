/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/login/:user_id", (req, res) => {
    db.query(`SELECT * FROM users WHERE id = ${req.params.user_id}`)
      .then(response => {
        console.log(response.rows);
        if (response && response.rows.length > 0) {
          console.log('redirect');
          req.session.user_id = response.rows[0].id;
          res.redirect('/');
        } else throw Error("No user.");
      }).catch(err => {
        console.log("Caught exception: " + err.message)
        res.status(403).send("Failed to login. Please use valid userid.");
      });
  });

  return router;
};
