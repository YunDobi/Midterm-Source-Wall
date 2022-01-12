/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

const renderProfile = function(user, res, error, success) {
  viewProperties = {
    user: user,
    success: success,
    error: error
  };
  res.render("profile", viewProperties)
}

const queryUser = function(db, userid, callback) {
  db.query(`SELECT * FROM users WHERE id = ${userid};`)
  .then(data => {
    const users = data.rows[0];
    callback(users, null);
  })
  .catch(err => {
    callback(null, err.message);
  });
}

module.exports = (db) => {
  router.get("/", (req, res) => {
    queryUser(db, 1, (user, error) => {
        renderProfile(user, res, error)
      })
  });

  router.post("/", (req, res) => {
    let error;
    let success;
    db.query(
      `UPDATE users SET name = '${req.body.name}', email = '${req.body.email}' WHERE id = ${req.body.id};`
    ).then(data => {
      if (data.rowCount > 0) {
        success = "Profile updated!"
      } else error = "Couldn't update profile";
    }).catch(err => {
      error = err.message;
    });
    queryUser(db, 1, (user, err) => {
      if (err) {
        error = err;
        success = undefined;
      }
      renderProfile(user, res, error, success)
    })
  })

  return router;
};
