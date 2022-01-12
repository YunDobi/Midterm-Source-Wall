const { response } = require('express');
const express = require('express');
const res = require('express/lib/response');
const router  = express.Router();

const resources = (db) => {

  //search the resources by title. However, not sure about how the input will be req.
  router.get('/', (req, res) => {
  
    db.query('SELECT * from resources left  join resourcescategories on resources.id = resource_id WHERE title LIKE $1;', [`%${req.query.searchtitle}%`])
      .then((response) => {
        const searchResources = response.rows;
        console.log(searchResources);
        res.render('search',{urls:searchResources});
      });
      
    //res.render("search");
  });

  return router;
};

module.exports = resources;
