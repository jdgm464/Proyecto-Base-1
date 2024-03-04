const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'ci',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, ci, password, done)=>{
    console.log(req.body);
    const rows = await pool.query('SELECT *FROM cliente Where ci = ?', [ci])
   if(rows.length > 0){
       const user = rows[0];
       const validPassword= await helpers.matchPassword(password, user.password);
       if(validPassword){
           done(null, user, req.flash('success','Bienvenido '+ user.ci));
       }else{
           done(null, false, req.flash('message','Contraseña Incorrecta'));
       }         
    }else{ 
        return done(null, false, req.flash('message','El cliente ingresado no existe')); 
    }

}));


passport.use('local.signup', new LocalStrategy({

    usernameField: 'ci',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, ci, password, done) => {
    const{nombre,apellido,sexo,edad}= req.body
    const newUser={
        ci,
        nombre,
        apellido,
        sexo,
        edad,
        password
    };
    newUser.password = await helpers.encryptPassword(password)

    const result = await pool.query('INSERT INTO cliente SET ?', [newUser])
    return done(null, newUser);
}));

passport.serializeUser((user,done)=>{
    done(null, user.ci)

});

passport.deserializeUser(async(ci, done)=>{
    const rows = await pool.query('SELECT * FROM cliente WHERE ci = ?', [ci])
    done(null,rows[0]);
});