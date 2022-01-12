const { response } = require('express');
const express = require('express');
const res = require('express/lib/response');
const router  = express.Router();

const resources = (db) => {
  // GET all resources on root
  router.get('/', (req, res) => {
    db.query('SELECT * FROM resources;')
      .then((response) => {
        const allResources = response.rows;
          
        res.render('home', {urls: allResources});
      });
  });

  router.get('/new', (req, res) => {
    res.render("new_resource");
  });


  //create the resources with user typed, and redirct to the all resoureces
  router.post('/new', (req, res) => {
    const title = req.body.title;
    const url = req.body.url;
    const description = req.body.description;
    db.query('INSERT INTO resources (url, title, description) VALUES ($1, $2, $3);',[url,title, description])
      .then(() => {
        // res.json(response.rows);
        res.redirect('/resources');
      });
  });

  //see each resource one by one
  router.get('/:id', (req, res) => {
    console.log(req.params.id);
    db.query('SELECT * FROM resources WHERE id = $1;', [req.params.id])
      .then((response)=> {
        // res.json(response.rows[0]);
        const resource = response.rows[0];

        db.query('SELECT * FROM comments WHERE resource_id = $1;', [req.params.id])
          .then((response) => {
            const comments = response.rows;
            // res.json({ resource, comments });

            db.query('SELECT likes, rating from feedbacks JOIN resources ON resources.id = resource_id WHERE resource_id = $1;', [req.params.id])
              .then((response) => {
                const likeRating = response.rows[0];
                const allSources = {
                  resource: JSON.stringify({resource}),
                  comment: JSON.stringify({comments}),
                  rating :JSON.stringify({likeRating})
                };
                res.render('resourceID', allSources);
              });
          });
      });
  });

  return router;
};

module.exports = resources;
