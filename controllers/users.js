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
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });

  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    
    if (passOk) {
      jwt.sign({
        email: userDoc.email,
        id: userDoc._id
      }, process.env.JWT_SECRET, { expiresIn: '3h' }, (err, token) => {
        if (err) throw err;
        res.json(token);
        res.cookie('token', token, { secure: true, httpOnly: true }).json(userDoc);
      });
    } else {
      res.status(422).json('Password not ok');
    }
  } else {
    res.json('User not found');
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
