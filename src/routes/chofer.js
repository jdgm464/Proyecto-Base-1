const express = require('express');
const Pool = require('mysql/lib/Pool');
const router = express.Router();

const pool = require('../database');

router.get('/addchofer', (req,res)=>{
    res.render('chofer/add');
});

router.post('/addchofer', async (req,res) =>{
    const {ci_chofer, nombre, apellido, sexo, edad}= req.body;

    const newChofer = {
        ci_chofer,
        nombre, 
        apellido, 
        sexo, 
        edad
    }

    await pool.query('INSERT INTO chofer set ?', [newChofer]);
    req.flash('success','Chofer Guardado de forma Exitosa');
    res.redirect('/chofer');
});

router.get('/', async (req,res) => {
    const chofer = await pool.query('SELECT *FROM chofer');
    res.render('chofer/listachofer', {chofer});
});

router.get('/tablachofer', async (req,res) => {
    const chofer = await pool.query('SELECT *FROM chofer');
    res.render('chofer/tablachofer', {chofer});
});

router.get('/delete/:id', async(req,res)=>{
    const {id} = req.params;
    await pool.query('DELETE FROM chofer WHERE ci_chofer = ?', [id], (err, rows)=>{
        if(err){
            req.flash('message', 'Chofer no puede ser eliminado ahora mismo se encuentra actualmente asignado a una ruta Operativa');
            res.redirect('/chofer');
        }else{
            req.flash('success', 'Chofer Eliminado de manera Exitosa');
            res.redirect('/chofer');
        }
    });
    
});

router.get('/edit_chofer/:id', async(req, res) =>{
    const {id} = req.params;
    const chofer = await pool.query('SELECT * FROM chofer WHERE ci_chofer = ?', [id])
    res.render('chofer/edit_chofer', {chofer: chofer[0]});
});

router.post('/edit_chofer/:id', async(req, res) =>{
    const {id} = req.params;
    const {ci_chofer, nombre, apellido, sexo, edad} = req.body;
    const newChofer = {
        ci_chofer,
        nombre, 
        apellido, 
        sexo, 
        edad      
    }
    await pool.query('UPDATE chofer set ? WHERE ci_chofer = ?', [newChofer, id], (err, rows)=>{
        if(err){
            req.flash('message', 'Chofer no puede ser eliminado ahora mismo se encuentra actualmente asignado a otra tabla');
            res.redirect('/chofer');
        }else{
            req.flash('success', 'Chofer Actualizado de manera Exitosa');
            res.redirect('/chofer');
        }
    });
     
    
});

module.exports = router; 