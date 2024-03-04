const express = require('express');
const Pool = require('mysql/lib/Pool');
const router = express.Router();

const pool = require('../database');

const passport = require('passport');
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');

router.get('/tablacliente', async (req,res) => {
    const cliente = await pool.query('SELECT *FROM cliente');
    res.render('auth/cliente', {cliente});
});

router.get('/signup', isNotLoggedIn, (req, res)=>{
    res.render('auth/signup');
});

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
})) 

router.get('/signin', isNotLoggedIn, (req, res)=>{
    res.render('auth/login');
})

router.post('/signin', isNotLoggedIn, (req, res, next)=>{

    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
})

router.get('/profile', isLoggedIn, (req, res)=>{
    res.render('profile');
});

router.get('/logout', isLoggedIn,(req,res) => {
    req.logOut();
    res.redirect('/signin');
});

module.exports = router; 