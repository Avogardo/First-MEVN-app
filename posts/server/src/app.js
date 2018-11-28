const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
var Post = require("../models/post");

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.listen(process.env.PORT || 8081);

// Fetch all posts
app.get('/posts', (req, res) => {
  Post.find({}, 'title description', function (error, posts) {
    if (error) {
      console.error(error);
    }
    res.send({
      posts: posts
    })
  }).sort({_id:-1})
})

mongoose.connect('mongodb://localhost:27017/posts', { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", (callback) => {
  console.log("Connection Succeeded");
});

// Add new post
app.post('/posts', (req, res) => {
  const db = req.db;
  const title = req.body.title;
  const description = req.body.description;
  const newPost = new Post({
    title: title,
    description: description
  })

  newPost.save(function (error) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Post saved successfully!'
    })
  })
})

// Fetch single post
app.get('/post/:id', (req, res) => {
  Post.findById(req.params.id, 'title description', function (error, post) {
    if (error) {
      console.error(error);
    }
    res.send(post)
  })
})

// Update a post
app.put('/posts/:id', (req, res) => {
  Post.findById(req.params.id, 'title description', function (error, post) {
    if (error) {
      console.error(error);
    }

    post.title = req.body.title
    post.description = req.body.description
    post.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
})
