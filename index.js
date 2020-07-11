require('dotenv').config();
const debug = require('debug');
debug(process.env.NODE_ENV);
console.log(process.env.NODE_ENV);
const express = require('express');
const app = express();
