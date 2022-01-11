const { response } = require('express');
const express = require('express');
const res = require('express/lib/response');
const router  = express.Router();

const resources = (db) => {

  //search the resources by title. However, not sure about how the input will be req.
  router.get('/', (req, res) => {
    db.query('SELECT * from resources Join resourcescategories on resources.id = resource_id WHERE title = $1;', ['testing'])
      .then((response) => {
        res.json(response.rows);
      });
      //res.render("search")
  });

  return router;
};

module.exports = resources;
