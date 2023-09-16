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
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/scribblesphere/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'scribblesphere', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

// Start the server

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
