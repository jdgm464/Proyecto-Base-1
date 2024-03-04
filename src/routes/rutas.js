const express = require('express');
const Pool = require('mysql/lib/Pool');
const router = express.Router();

const pool = require('../database');

router.get('/addruta', (req,res)=>{
    res.render('rutas/add');
});

router.post('/addruta', async (req,res) =>{
    const {salida, destino, precio, hora, chofer, chofer2}= req.body;
    const newRuta = {
        salida, 
        destino, 
        precio, 
        hora, 
        chofer,
        chofer2
    }

    const result = await pool.query('SELECT ci_chofer FROM chofer WHERE ci_chofer = ? ', [newRuta.chofer]);
    const result1 = await pool.query('SELECT ci_chofer FROM chofer WHERE ci_chofer = ? ', [newRuta.chofer2]);
    

    if(((result.length > 0) && (result1.length >0)) && (newRuta.chofer !== newRuta.chofer2) ){
        await pool.query('INSERT INTO ruta set ?', [newRuta]);
        req.flash('success','Ruta Guardada de forma Exitosa');
        res.redirect('/rutas');
    } else if(newRuta.chofer === newRuta.chofer2){
        req.flash('message', 'Los choferes registrados deben ser diferentes');
        res.redirect('/rutas/addruta');
    }else {
        req.flash('message', 'Chofer ingresado no se encuentra registrado');
        res.redirect('/rutas/addruta');
    }

});

router.get('/', async (req,res) => {
    const rutas = await pool.query('SELECT *FROM ruta');
    res.render('rutas/listaruta', {rutas});
});

router.get('/tablaprofile', async (req,res) => {
    const rutas = await pool.query('SELECT *FROM ruta');
    res.render('rutas/tablaruta_profile', {rutas});
});

router.get('/tabla', async (req,res) => {
    const rutas = await pool.query('SELECT *FROM ruta');
    res.render('rutas/tablaruta', {rutas});
});

router.get('/delete/:id', async(req,res)=>{
    const {id} = req.params;
    await pool.query('DELETE FROM ruta WHERE idruta = ?', [id], (err, rows)=>{
        if(err){
            req.flash('message', 'Ruta no puede ser eliminado ahora mismo se encuentra actualmente asignado a otra tabla');
            res.redirect('/rutas');
        }else{
            req.flash('success', 'Ruta Elimina de manera Exitosa');
            res.redirect('/rutas');
        }
    });

    
});

router.get('/edit_ruta/:id',async(req, res) =>{
    const {id} = req.params;
    const rutas = await pool.query('SELECT * FROM ruta WHERE idruta = ?', [id])
    res.render('rutas/editruta', {ruta: rutas[0]});
});

router.post('/edit_ruta/:id', async(req, res) =>{
    const {id} = req.params;
    const {salida, destino, precio, hora, chofer, chofer2} = req.body;
    const newRuta = {
        salida, 
        destino, 
        precio, 
        hora,
        chofer,
        chofer2
    } 

    await pool.query('UPDATE ruta set ? WHERE idruta = ?', [newRuta, id], (err, rows)=>{
        if(err){
            req.flash('message', 'Ruta no puede ser eliminado ahora mismo se encuentra actualmente asignado a otra tabla');
            res.redirect('/chofer');
        }else{
            req.flash('success', 'Ruta Actualizada de manera Exitosa');
            res.redirect('/rutas');
        }
    });
    
    await pool.query('UPDATE ruta set ? WHERE idruta = ?', [newRuta, id]);
    
});



module.exports = router; 