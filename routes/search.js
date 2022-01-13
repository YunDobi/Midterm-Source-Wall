const { response } = require('express');
const express = require('express');
const res = require('express/lib/response');
const router  = express.Router();

const resources = (db) => {

  //search the resources by title. However, not sure about how the input will be req.
  router.get('/', (req, res) => {

    db.query(`SELECT * FROM resources
    WHERE title ILIKE '%${req.query.searchtitle}%' --case insensitive OR description ILIKE '%${req.query.searchtitle}%' --case insensitive;`)
      .then((response) => {
        const searchResources = response.rows;
        const user_id = req.session.user_id;
        db.query(`SELECT * FROM categories WHERE user_id = ${user_id}`)
        .then((catResponse) => {
          //console.log(searchResources.rows)
          res.render('search', {
            categories: catResponse.rows,
            urls: searchResources
          });
        });
      });
  });

  return router;
};

module.exports = resources;
