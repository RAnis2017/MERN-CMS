require('dotenv').config()
var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require('../config');
const adminRoutes = require('./admin');
const ObjectId = require('mongodb').ObjectId;

//Middleware to log time for easy debugging when in development
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date().toLocaleString());
  next();
});

// Define the home page route
router.get('/', function (req, res) {
  res.status(200).json({ 'message': 'hello' });
});

function createUser(userModel, email, name, password) {
  return new Promise((resolve, reject) => {
    let hash = bcrypt.hashSync(password, 12);
    userModel.create({
      email: email,
      password: hash,
      name: name,
    }, (err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
}

//random string generator
function makePass(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

router.post('/login-google', function (req, res) {
  console.log(req.body);
  let email = req.body.email
  let name = req.body.name
  let userModel = mongoose.model('User');
  userModel.findOne({ email: email }).populate('permissions').exec(async (err, user) => {
    if (err) {
      console.log(err);
      res.status(500).json({ 'message': 'Internal server error' });
    } else if (!user) {
      let password = makePass(8);
      let user = await createUser(userModel, email, name, password)

      const token = jwt.sign(
        { user_id: user._id, email },
        config.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      let loggedInUser = {
        token,
        email
      };

      res.status(200).json(loggedInUser);
    } else {
      if (err) {
        console.log(err);
        res.status(500).json({ 'message': 'Internal server error' });
      } else if (!user) {
        res.status(401).json({ 'message': 'Password incorrect' });
      } else {
        const token = jwt.sign(
          { user_id: user._id, email, permissions: user.permissions },
          config.TOKEN_KEY,
          {
            expiresIn: "24h",
          }
        );

        let loggedInUser = {
          token,
          email,
          permissions: user.permissions
        };

        res.status(200).json(loggedInUser);
      }
    }
  });
})


router.post('/login', function (req, res) {
  console.log(req.body);
  let email = req.body.email;
  let password = req.body.password;
  let user = mongoose.model('User');
  user.findOne({ email: email }).populate('permissions').exec(async (err, user) => {
    if (err) {
      console.log(err);
      res.status(500).json({ 'message': 'Internal server error' });
    } else if (!user) {
      res.status(401).json({ 'message': 'User not found' });
    } else {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          console.log(err);
          res.status(500).json({ 'message': 'Internal server error' });
        } else if (!result) {
          res.status(401).json({ 'message': 'Password incorrect' });
        } else {
          const token = jwt.sign(
            { user_id: user._id, email, permissions: user.permissions },
            config.TOKEN_KEY,
            {
              expiresIn: "24h",
            }
          );

          let loggedInUser = {
            token,
            email,
            permissions: user.permissions
          };

          res.status(200).json(loggedInUser);
        }
      });
    }
  });
});

router.use(auth);

router.get('/get-categories', (req, res, next) => {
  let categoryModel = mongoose.model('Category');
  categoryModel.find({}, (err, categories) => {
    if (err) {
      console.log(err);
      res.status(500).json({ 'message': 'Internal server error' });
    } else {
      res.status(200).json(categories);
    }
  })
})

router.get('/get-posts', (req, res, next) => {
  let postModel = mongoose.model('Post');
  let userModel = mongoose.model('User');
  let likeDislikeModel = mongoose.model('LikeDislike');
  let categoryModel = mongoose.model('Category');
  
  const isAdmin = req.user.permissions.find((permission) =>  permission.label === 'can_admin_posts');

  postModel.aggregate([
    {
      $lookup: {
        from: likeDislikeModel.collection.name,
        localField: '_id',
        foreignField: 'postId',
        pipeline: isAdmin ? [] : [
          { $match: { created_by:  ObjectId(req.user.user_id) } },
        ],
        as: 'likesDislikes'
      }
    }
  ]).exec((err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ 'message': 'Internal server error' });
    }
    postModel.populate(results, { path: 'created_by', model: userModel }, (err, posts) => {
      if (err) {
        console.log(err);
        res.status(500).json({ 'message': 'Internal server error' });
      }
      postModel.populate(posts, { path: 'category', model: categoryModel }, (err, posts) => {
        if (err) {
          console.log(err);
          res.status(500).json({ 'message': 'Internal server error' });
        } else {
          res.status(200).json(posts);
        }
      })
    })
  })
})

router.get('/get-post/:id', (req, res, next) => {
  let postModel = mongoose.model('Post');
  let userModel = mongoose.model('User');
  let categoryModel = mongoose.model('Category');
  postModel.findById(req.params.id).populate({ path: 'created_by', model: userModel }).populate({ path: 'category', model: categoryModel }).exec((err, post) => {
    if (err) {
      console.log(err);
      res.status(500).json({ 'message': 'Internal server error' });
    } else {
      res.status(200).json(post);
    }
  })
})

router.get('/get-user-permissions', (req, res, next) => {
  if (!req.user) {
    console.log(err);
    res.status(500).json({ 'message': 'Internal server error' });
  } else {
    res.status(200).json(req.user.permissions);
  }
}
)

router.put('/like-dislike-posts', (req, res, next) => {
  let likeDislikeModel = mongoose.model('LikeDislike')
  const postId = req.body.postId
  const created_by = req.user.user_id
  const liked = req.body.isLiked
  likeDislikeModel.findOne({
    created_by,
    postId
  }, (err, likeDislikes) => {
    if(err) {
      console.log(err);
      res.status(500).json({ 'message': 'Internal server error' });
    } else {
      if(!likeDislikes) {
        likeDislikeModel.create({
          postId,
          created_by,
          liked
        }, (err, likeDislikes) => {
          if(err) {
            console.log(err);
            res.status(500).json({ 'message': 'Internal server error' });
          }
          res.status(200).json(likeDislikes)
        })
      } else {
        likeDislikeModel.updateOne({ postId, created_by }, {
          liked,
          updated_date: new Date()
      }, (err, likeDislike) => {
          if (err) {
              console.log(err);
              res.status(500).json({ 'message': 'Internal server error' });
          } else {
              res.status(200).json({ 'message': 'LikeDislike updated' });
          }
      })
      }
    }
  })
  
})

router.post('/create-tracking', (req, res, next) => {
  let trackingModel = mongoose.model('Tracking')
  const postId = req.body.postId
  const created_by = req.user.user_id
  const action = req.body.action
  trackingModel.findOne({
    created_by,
    postId,
    created_date: { $eq: new Date().toISOString().split('T')[0] }
  }, (err, tracking) => {
    if (err) {
      console.log(err);
      res.status(500).json({ 'message': 'Internal server error' });
    } else {
      if (!tracking) {

        trackingModel.create({
          postId,
          created_by,
          created_date: new Date().toISOString().split('T')[0],
          action
        }, (err, tracking) => {
          if (err) {
            console.log(err);
            res.status(500).json({ 'message': 'Internal server error' });
          } else {
            res.status(200).json({ 'message': 'Tracking created' });
          }
        })
      } else {
        res.status(200).json({ 'message': 'Tracking not updated' });
      }
    }
  })
}
)

router.get('/get-trackings', (req, res, next) => {
  let trackingModel = mongoose.model('Tracking')
  let userModel = mongoose.model('User')
  let postModel = mongoose.model('Post')
  trackingModel.find({ }).populate({path:'created_by', model: userModel}).populate({path:'postId', model: postModel}).exec((err, trackings) => {
    if (err) {
      console.log(err);
      res.status(500).json({ 'message': 'Internal server error' });
    } else {
      res.status(200).json(trackings);
    }
  })
}
)

router.use('/admin', adminRoutes);

module.exports = router;