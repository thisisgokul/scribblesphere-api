const dotenv = require('dotenv');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
dotenv.config();

const getAll = (req, res) => {
  console.log('success');
  res.send('test');
};

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userDoc = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.json(userDoc);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during signup' });
  }
};

const login = async (req, res) => {
  

  const {email,password} = req.body;
  const userDoc = await User.findOne({email});
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({
        email: userDoc.email,
        id: userDoc._id
      }, process.env.JWT_SECRET, {}, (err, token) => {
        if (err) {
          console.error(err);
          throw err; 
        }
        res.cookie('token', token).json(userDoc);
      });
    } else {
      res.status(422).json('pass not ok');
    }
  } else {
    res.json('not found');
  }
};


const profile = async (req, res) => {
 

  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
      if (err) throw err;
      const {name,email,_id} = await User.findById(userData.id);
      res.json({name,email,_id});
    });
  } else {
    res.json(null);
  }
};

const logout = (req, res) => {
  res.clearCookie('token').json(true);
};

module.exports = {
  getAll,
  login,
  signup,
  profile,
  logout
};
