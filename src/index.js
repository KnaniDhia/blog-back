const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const postRouter = require('./routes/post.route');

require('dotenv').config();

const app = express();

// CORS options
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the public directory
app.use('/public', express.static('public'));

// Routers 
app.use('/posts', postRouter);

mongoose.set('strictQuery', true);

const mongoOptions = {
    serverSelectionTimeoutMS: 5000,
};

mongoose.connect(process.env.MONGO_URI, mongoOptions)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', reason.stack || reason);
});
