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
        const user_id = req.session.user_id;
        db.query(`SELECT * FROM categories WHERE user_id = ${user_id}`)
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
    db.query('INSERT INTO comments (comments, user_id, resource_id) VALUES ($1,$2,$3)',[req.body.inputBody, 1, req.params.id])
      .then(() => {
        res.redirect('/');
      });
  });

  //like
  router.post('/:id/like', (req, res) => {

    db.query('UPDATE feedbacks SET likes = $1 where resource_id = $2;' , [Number(req.body.bth) + 1, req.params.id])
      .then(() => {
        res.redirect('/');
      });
  });

  //rating
  router.post('/:id/rating', (req, res) => {
    db.query('INSERT INTO feedbacks (likes ,rating, user_id, resource_id) values ($1,$2, $3, $4);', [0, req.body.rating, 1, req.params.id])
      .then(() => {
        res.redirect('/response/');
      });
  });

  //rating

  //see each resource one by one
  router.get('/:id', (req, res) => {
    db.query('SELECT * FROM resources WHERE id = $1;', [req.params.id])
      .then((response)=> {
        // res.json(response.rows[0]);
        const resource = response.rows[0];

        db.query('SELECT *, users.name as username FROM comments JOIN users on user_id = users.id WHERE resource_id = $1;', [req.params.id])
          .then((response) => {
            // console.log(response.rows)
            const comments = response.rows;
            // res.json({ resource, comments });


            db.query(`SELECT avg(rating) FROM feedbacks WHERE resource_id = $1;`,[req.params.id])
              .then((response)=>{
                const avgRating = response.rows[0].avg;


                db.query('SELECT likes, rating from feedbacks JOIN resources ON resources.id = resource_id WHERE resource_id = $1;', [req.params.id])
                  .then((response) => {
                    // console.log("++++",comments)
                    const likeRating = response.rows[0];
                    const allSources = {
                      title: JSON.stringify(resource.title),
                      description: JSON.stringify(resource.description),
                      comments: comments,
                      username: JSON.stringify(comments.username),
                      like :JSON.stringify(likeRating.likes),
                      rating: Math.round(avgRating),
                      id: req.params.id,
                    };
                    console.log("allSources",allSources)
                    res.render('resourceID', allSources);
                  });
              });


          });
      });
  });

  //

  return router;
};

module.exports = resources;
