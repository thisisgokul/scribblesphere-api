const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieparser=require('cookie-parser');
const mongooseConnect=require("./config/config")
const userRoutes = require('./routes/routes');
const dotenv = require('dotenv');
const port = 5000;
dotenv.config();

const app = express();

// Middleware

app.use(cors({
  credentials: true,
  origin: 'https://scribblesphere.onrender.com'
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieparser())



// Connect to MongoDB
mongooseConnect();
// Routes
app.use('/', userRoutes);

if (process.env.NODE_ENV === 'production') {
 
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Start the server

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
