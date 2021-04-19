const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Models
const User = require('./models/user');

dotenv.config();

const app = express();
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if(err)
        console.log(err);
    else
        console.log('Connected to the Database');
});

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// require api
const productRoutes = require('./routes/product');
const categoryRoutes = require('./routes/category');
const ownerRoutes = require('./routes/owner');
const userRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/review');

app.use("/api", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api", ownerRoutes);
app.use("/api", userRoutes);
app.use("/api", reviewRoutes);

app.listen(8000, (err) => {
   if(err)
       console.log(err);
   else
       console.log("Listening on port", 8000);
});
