const { response } = require('express');
const express = require('express');
const res = require('express/lib/response');
const router  = express.Router();

const resources = (db) => {
  // GET all resources on root
  router.get('/', (req, res) => {
    db.query('SELECT * FROM resources;')
      .then((response) => {
        res.json(response.rows);
      });
  });
  //go to the new route to fill in the inputs *requrie the new page with input.ejs
  router.get("/new", (req, res) => {
    res.render("new_resource");
  });

  //create the resources with user typed, and redirct to the all resoureces
  router.post('/new', (req, res) => {
    db.query('INSERT INTO resources (url, title, descripton) VALUES ($1, %2, $3);',[])
      .then((response) => {
        res.json(response.rows);
        res.redirect('/');
      });
  });

  //search the resources by title. However, not sure about how the input will be req.
  router.get('/search', (req, res) => {
    db.query('SELECT * from resources Join resourcescategories on resources.id = resource_id WHERE title = $1;', ['testing'])
      .then((response) => {
        res.json(response.rows);
      });
  });
  //see each resource one by one
  router.get('/:id', (req, res) => {
    console.log(req.params.id);
    db.query('SELECT * FROM resources WHERE id = $1;', [req.params.id])
      .then((response)=> {
        res.json(response.rows[0]);
      });
  });

  return router;
};

module.exports = resources;