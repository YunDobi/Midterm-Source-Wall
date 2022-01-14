const { response } = require('express');
const express = require('express');
const res = require('express/lib/response');
const router  = express.Router();

const resources = (db) => {
// GET all resources on root
  router.get('/', (req, res) => {
    const user_id = req.session.user_id;
    if (!user_id) {
      res.redirect('/auth/login/1');
    }
    db.query('SELECT * FROM resources;')
      .then((response) => {
        const allResources = response.rows;

        db.query(`SELECT * FROM categories WHERE user_id = ${user_id}`)
          .then((catResponse) => {
            // console.log(catResponse.rows);
            res.render('home', {
              categories: catResponse.rows,
              urls: allResources
            });
          });
      });

    router.get('/new', (req, res) => {
      console.log(req.params);
      res.render("new_resource");
    });


    //create the resources with user typed, and redirct to the all resoureces
    router.post('/new', (req, res) => {
      const id = req.session.user_id;
      const title = req.body.title;
      const url = req.body.url;
      const description = req.body.description;
      db.query('INSERT INTO resources (user_id, url, title, description) VALUES ($1, $2, $3, $4) returning id;',[id, url,title, description])
        .then((response) => {
          const resource_id = response.rows[0].id;

          db.query('INSERT INTO feedbacks (likes, rating, user_id, resource_id) VALUES ($1,$2,$3, $4);' , [0, 0, id ,resource_id])
          res.redirect(`/resources/`);
        });
    });
    //comments
    router.post('/:id/comments', (req, res) => {
      // console.log("++++++", req.body);
      db.query('INSERT INTO comments (comments, user_id, resource_id) VALUES ($1,$2,$3)',[req.body.inputBody, 1, req.params.id])
        .then(() => {
          res.redirect(`/resources/${req.params.id}`);
        });
    });

    //like
    router.post('/:id/like', (req, res) => {
      db.query('UPDATE feedbacks SET likes = $1 where resource_id = $2;',[Number(req.body.bth) + 1, req.params.id])
        .then(() => {
          res.redirect(`/resources/${req.params.id}`);
        });
    });

    //rating
    router.post('/:id/rating', (req, res) => {
      db.query('UPDATE feedbacks SET rating = $1 where resource_id = $2;', [req.body.rating, req.params.id])
        .then(() => {
          res.redirect(`/resources/${req.params.id}`);
        });
      
    });


    //see each resource one by one
    router.get('/:id', (req, res) => {
      const userId = req.session.user_id;
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

                  db.query('SELECT * FROM categories WHERE user_id = $1;', [userId])
                    .then((response)=> {
                      console.log(req.params)
                      const categories = response.rows;


                      db.query('SELECT likes, rating from feedbacks JOIN resources ON resources.id = resource_id WHERE resource_id = $1;', [req.params.id])
                        .then((response) => {
                          
                          console.log("++++", response)
                          const likeRating = response.rows[response.rows.length - 1];

                          const allSources = {
                            resourceId: resource.id,
                            title: JSON.stringify(resource.title),
                            description: JSON.stringify(resource.description),
                            comments: comments,
                            username: JSON.stringify(comments.username),
                            like :likeRating ? JSON.stringify(likeRating.likes) : 0,
                            rating: Math.round(avgRating),
                            id: req.params.id,
                            name: categories

                          };
                          res.render('resourceID', allSources);
                        });
                    });
                });

            });
        });
    });
  });
  return router;
};

module.exports = resources;
