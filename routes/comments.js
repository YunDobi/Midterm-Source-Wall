const express = require('express');
const router  = express.Router();

const comments = (db) => {
  // GET /comments/
  // router.get('/', (req, res) => {
  //   console.log("received")
  //   db.query('INSERT INTO comments (comment, user_id, resource_id) VALUE ($1,$2,$3)',[req.params],[])
  //     .then(() => {
  //       res.redirect('resource/');
  //     });
  // });
  return router;
};

module.exports = comments;
