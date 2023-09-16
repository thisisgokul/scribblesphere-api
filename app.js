const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieparser=require('cookie-parser');
const mongooseConnect=require("./config/config")
const userRoutes = require('./routes/routes');
const dotenv = require('dotenv');
const path = require('path');
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

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

// Start the server

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
