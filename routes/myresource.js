const express = require("express");
const router = express.Router();

const resource = (db) => {
  router.get('/', (req, res) => {
    db.query('SELECT resources.title, categories.name FROM resources JOIN resourcescategories ON resource_id = resources.id JOIN categories ON category_id = categories.id JOIN users on users.id = categories.user_id WHERE users.id = $1;', [1])
      .then((response) => {
        res.render(response.rows);
      });
      //res.render("my_resources");
  });
  return router;
};
module.exports = resource;
