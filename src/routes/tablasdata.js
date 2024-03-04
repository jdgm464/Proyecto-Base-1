const express = require('express');
const Pool = require('mysql/lib/Pool');
const router = express.Router();

const pool = require('../database');

router.get('/', (req, res) =>{
    res.render('tablas/tablas')
});

router.get('/tablasdata', (req, res) =>{
    res.render('tablas/tablasdata')
});

module.exports = router; 