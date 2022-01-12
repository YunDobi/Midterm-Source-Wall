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
        db.query(`SELECT * FROM categories WHERE user_id = 1`)
        .then((catResponse) => {
          console.log(catResponse.rows)
          res.render('home', {
            categories: catResponse.rows,
            urls: allResources
          });
        });
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
  //comments
  router.post('/:id/comments', (req, res) => {
    console.log("++++++", req.body);
    db.query('INSERT INTO comments (comments, user_id, resource_id) VALUES ($1,$2,$3)',[req.body.inputBody, req.params.user_id, req.params.id])
      .then(() => {
        res.redirect('/');
      });
  });

  //like
  router.post('/like', (req, res) => {
    db.query('UPDATE feedbacks SET likes = $1 where $2;' , [req.params.likes, req.params.id])
      .then(() => {
        res.redirect('/response/:id');
      });
  });

  //rating

  //see each resource one by one
  router.get('/:id', (req, res) => {
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
                  resource: JSON.stringify(resource.title),
                  comment: JSON.stringify(comments),
                  like :JSON.stringify(likeRating.likes),
                  rating: JSON.stringify(likeRating.rating),
                  id: req.params.id
                };
                res.render('resourceID', allSources);
              });
          });
      });
  });

  //

  return router;
};

module.exports = resources;
