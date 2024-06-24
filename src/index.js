const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const morgan = require('morgan');
const routes = require('./routers');
const dotenv = require('dotenv');
const app = express();
const { connect } = require('./config/db');

// Config
dotenv.config();
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(methodOverride('_method'));
app.use(cookieParser());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Http logger
app.use(morgan('combined'));

// Connect to MongoDB
connect();

// Routes
routes(app);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port http://localhost:${process.env.PORT}`);
});
