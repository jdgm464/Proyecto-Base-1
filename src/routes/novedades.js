const express = require('express');
const Pool = require('mysql/lib/Pool');
const router = express.Router();

const pool = require('../database');

router.get('/addnovedad', (req,res)=>{
    res.render('novedad/addnovedad');
});

router.post('/addnovedad', async (req,res) =>{
    const {id_ruta, novedad, hora}= req.body;
    const newNovedad = {
        id_ruta,
        novedad,
        hora
    }

    const result = await pool.query('SELECT idruta FROM ruta WHERE idruta = ? ', [newNovedad.id_ruta]);

    if(result.length > 0 ){
        await pool.query('INSERT INTO novedad set ?', [newNovedad]);
        req.flash('success','Novedad Guardada de forma Exitosa');
        res.redirect('/novedades');
    } else {
        req.flash('message', 'ID Ruta no se encuentra registrada');
        res.redirect('/novedades/addnovedad');
    }

});

router.get('/', async (req,res) => {
    const novedad = await pool.query('SELECT *FROM novedad');
    res.render('novedad/listanovedad', {novedad});
});

router.get('/tabla', async (req,res) => {
    const novedad = await pool.query('SELECT *FROM novedad');
    res.render('novedad/tablanovedad', {novedad});
});

router.get('/delete/:id', async(req,res)=>{
    const {id} = req.params;
    await pool.query('DELETE FROM novedad WHERE idnovedad = ?', [id], (err, rows)=>{
        if(err){
            req.flash('message', 'Novedad no puede ser eliminado ahora mismo se encuentra actualmente asignado a otra tabla');
            res.redirect('/novedades');
        }else{
            req.flash('success', 'Novedad Elimina de manera Exitosa');
            res.redirect('/novedades');
        }
    });
    

});

router.get('/edit_novedad/:id',async(req, res) =>{
    const {id} = req.params;
    const novedad = await pool.query('SELECT * FROM novedad WHERE idnovedad = ?', [id])
    res.render('novedad/editnovedad', {novedad: novedad[0]});
});

router.post('/edit_novedad/:id', async(req, res) =>{
    const {id} = req.params;
    const {id_ruta, novedad, hora}= req.body;
    const newNovedad = {
        id_ruta,
        novedad,
        hora
    }

    await pool.query('UPDATE novedad set ? WHERE idnovedad = ?', [newNovedad, id], (err, rows)=>{
        if(err){
            req.flash('message', 'Novedad error id ruta ingresado no es existente o fecha ingresada es invalida o nula');
            res.redirect('/novedades');
        }else{
            req.flash('success', 'Novedad Actualizada de manera Exitosa');
            res.redirect('/novedades');
        }
    });
    
});



module.exports = router; 