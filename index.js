const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');


var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     
  extended: true
})); 

const Query_Posts_Responses = 'SELECT * FROM posts JOIN responses ON posts.`post_id` = responses.`post_id`';

const con = mysql.createConnection({
    host: "192.168.10.10",
    user: "homestead",
    password: "secret",
    database: "blog-node"
  });
  

app.get('/posts', function(req, res) {
      con.connect(function(err) {
        con.query("SELECT * FROM posts", function (err, result, fields) {
          res.json(result);
        });
    });
  });

//Save a posts  
app.post('/create_posts', function(req, res) {
    let post_content = req.body.post_content;
    let now = new Date();
    var sql_posts = "INSERT INTO posts (responses_count, post_content, created_at) VALUES ( '0','"+ post_content + "','" + now + "')";
    con.connect(function(err) {
        con.query(sql_posts, function (err, result, fields) {
            res.json(result);
          });
});
});

//Save a responses
app.post('/create_responses', function(req, res) {
    let responses_content = req.body.responses_content;
    let post_id = req.body.post_id;
    let now = new Date();
    var sql_responses = "INSERT INTO responses (post_id, response_content, created_at) VALUES ( '"+ post_id +"','"+ responses_content + "','" + now + "')";
    con.connect(function(err) {
        //Save a responses 
        con.query(sql_responses, function (err, result, fields) {
        });
        //Update data
        con.query("UPDATE posts SET responses_count = responses_count + 1 WHERE post_id = " + post_id, function (err, result, fields) {
            res.json(result);
          })
    });    
});  


app.listen(4000, function () {
  console.log('La API corre en el puerto 4000!');
});