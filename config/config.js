const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function mongooseConnect() {
  await mongoose.connect(process.env.MONGO_URL, {
    dbName: 'userDb',
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });
}

module.exports = mongooseConnect