const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySqlStore = require('express-mysql-session');
const passport = require('passport');

const {database} = require('./keys');

//Inicializaciones
const app = express();
require('./lib/passport');

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname,'views'));
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

//Middlewares
app.use(session({
    secret: 'try',
    resave: false,
    saveUninitialized: false,
    store: new MySqlStore(database)
}));

app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


//Variables Globales
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
})

//Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/consultas', require('./routes/consultas'));
app.use('/rutas', require('./routes/rutas'));
app.use('/tablasdata', require('./routes/tablasdata'));
app.use('/chofer', require('./routes/chofer'));
app.use('/empleado', require('./routes/empleado'));
app.use('/flota', require('./routes/flota'));
app.use('/venta', require('./routes/venta'));
app.use('/novedades', require('./routes/novedades'));

//Public files
app.use(express.static(path.join(__dirname, 'public')));

//Comenzar servidor
app.listen(app.get('port'), () =>{
    console.log('Server on port', app.get('port'))
})
