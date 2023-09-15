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
  
  try {
    const userDoc = await User.findOne({ email }).exec();
  
    if (!userDoc) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    const passOK = bcrypt.compareSync(password, userDoc.password);
  
    if (!passOK) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
  
    const token = jwt.sign({ email: userDoc.email, id: userDoc._id }, process.env.JWT_SECRET);
  
    res.cookie('token', token).json({ token, user: userDoc });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during login' });
  }
};

const profile = async (req, res) => {
  const { token } = req.cookies;
 
  try {
    if (!token) {
      return res.json(null);
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { name, email, _id } = user;
    res.json({ name, email, _id });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching profile' });
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
