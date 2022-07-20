require('dotenv').config()
var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require('../config');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, 'uploads')
  },
  filename: (req, file, callBack) => {
    callBack(null, `${file.originalname}`)
  }
})
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
});
let mailOptions = {
  from:  'admin@cms.com',
  to:  'razaanis123@gmail.com',
  subject:  'Zepcom CMS App',
  text:  ''
};

let upload = multer({ dest: 'uploads/', storage }).single('image');
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
          email
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
            email
          };

          res.status(200).json(loggedInUser);
        }
      });
    }
  });
});

router.use(auth);

router.post('/add-post', (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      console.log(err)
    } else {
      let fileName = req?.file?.filename ? req.file.filename : '';
      let body = req.body;
      console.log(req.body.category, fileName);

      let postModel = mongoose.model('Post');
      postModel.create({
        name: body.title,
        description: body.description,
        image_url: fileName,
        slug: body.slug,
        created_by: req.user.user_id,
        category: body.category,
        status: body.status,
      }, (err, post) => {
        if (err) {
          console.log(err);
          res.status(500).json({ 'message': 'Internal server error' });
        } else {
          mailOptions.text = `A new post named ${body.title} has been added to the CMS react app`
          transporter.sendMail(mailOptions, function(err, data) {
            if (err) {
              console.log("Error " + err);
            } else {
              console.log("Email sent successfully");
              res.status(200).json({ 'message': 'Post added' });
            }
          });
        }
      });
    }
  })
})

router.post('/add-category', (req, res, next) => {
  let categoryModel = mongoose.model('Category');
  console.log(req.body);
  categoryModel.create({
    name: req.body.name,
    created_by: req.user.user_id,
  }, (err, category) => {
    if (err) {
      console.log(err);
      res.status(500).json({ 'message': 'Internal server error' });
    } else {
      res.status(200).json({ 'message': 'Category added' });
    }
  })
})

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
  let categoryModel = mongoose.model('Category');
  postModel.find({}).populate({ path: 'created_by', model: userModel }).populate({ path: 'category', model: categoryModel }).exec((err, posts) => {
    if (err) {
      console.log(err);
      res.status(500).json({ 'message': 'Internal server error' });
    } else {
      res.status(200).json(posts);
    }
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

router.put('/update-post/:id', (req, res, next) => {
  let postModel = mongoose.model('Post');
  upload(req, res, function (err) {
    if (err) {
      console.log(err)
    } else {
      let body = req.body;
      let fileName = ''

      let options = {
        name: body.title,
        description: body.description,
        slug: body.slug,
        category: body.category,
        status: body.status === 'true' ? true : false,
      }
      if(req.file && req.file.filename) {
        fileName = req.file.filename
        options['image_url'] = fileName
      }
      
      postModel.updateOne({ _id: req.params.id }, options, (err, post) => {
        if (err) {
          console.log(err);
          res.status(500).json({ 'message': 'Internal server error' });
        } else {
          mailOptions.text = `An old post has been updated named ${options.name} to the CMS react app`
          transporter.sendMail(mailOptions, function(err, data) {
            if (err) {
              console.log("Error " + err);
            } else {
              console.log("Email sent successfully");
              res.status(200).json({ 'message': 'Post updated' });
            }
          });
        }
      })

    }
  })

})

router.put('/update-category/:id', (req, res, next) => {
  let categoryModel = mongoose.model('Category');
  categoryModel.updateOne({ _id: req.params.id }, {
    name: req.body.name,
  }, (err, category) => {
    if (err) {
      console.log(err);
      res.status(500).json({ 'message': 'Internal server error' });
    } else {
      res.status(200).json({ 'message': 'Category updated' });
    }
  })
})

router.delete('/delete-post/:id', (req, res, next) => {
  let postModel = mongoose.model('Post');
  postModel.deleteOne({ _id: req.params.id }, (err, post) => {
    if (err) {
      console.log(err);
      res.status(500).json({ 'message': 'Internal server error' });
    } else {
      res.status(200).json({ 'message': 'Post deleted' });
    }
  })
})

router.delete('/delete-category/:id', (req, res, next) => {
  let categoryModel = mongoose.model('Category');
  categoryModel.deleteOne({ _id: req.params.id }, (err, category) => {
    if (err) {
      console.log(err);
      res.status(500).json({ 'message': 'Internal server error' });
    } else {
      let postModel = mongoose.model('Post');
      postModel.deleteMany({ category: req.params.id }, (err, post) => {
        if (err) {
          console.log(err);
          res.status(500).json({ 'message': 'Internal server error' });
        } else {
          res.status(200).json({ 'message': 'Category deleted' });
        }
      })
    }
  })
})

router.put('/change-status/:id', (req, res, next) => {
  let postModel = mongoose.model('Post');
  postModel.updateOne({ _id: req.params.id }, {
    status: req.body.status === 'true' ? false : true,
  }, (err, post) => {
    if (err) {
      console.log(err);
      res.status(500).json({ 'message': 'Internal server error' });
    } else {
      res.status(200).json({ 'message': 'Status updated' });
    }
  })
})


module.exports = router;