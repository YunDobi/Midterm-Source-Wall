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
        const categories = data.rows;
        res.json(categories);
      });
  });

  router.get('/:catid', (req, res) => {
    db.query(`SELECT resources.id, resources.user_id, resources.url, resources.title, resources.description,
    resourcescategories.resource_id, resourcescategories.category_id FROM resources
    INNER JOIN resourcescategories ON resources.id = resourcescategories.resource_id
    WHERE resourcescategories.category_id = ${req.params.catid};`)
      .then((response) => {
        const allResources = response.rows;
        db.query(`SELECT * FROM categories WHERE user_id = 1`)
        .then((catResponse) => {
          //console.log(catResponse.rows)
          res.render('category', {
            categories: catResponse.rows,
            urls: allResources
          });
        });
      });
  });

  return router;
};
