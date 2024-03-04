const express = require('express');
const Pool = require('mysql/lib/Pool');
const router = express.Router();

const pool = require('../database');

router.get('/addflota', (req,res)=>{
    res.render('flota/add_flota');
});

router.post('/addflota', async (req,res) =>{
    const {modelo, placa, numero_asientos, ano_autobus}= req.body;
    const newFlota = {
        modelo, 
        placa, 
        numero_asientos, 
        ano_autobus
    }
    await pool.query('INSERT INTO flota set ?', [newFlota]);
    req.flash('success','Flota Guardada de forma Exitosa');
    res.redirect('/flota');
});

router.get('/', async (req,res) => {
    const flota = await pool.query('SELECT *FROM flota');
    res.render('flota/listaflota', {flota});
});

router.get('/tablaflota', async (req,res) => {
    const flota = await pool.query('SELECT *FROM flota');
    res.render('flota/tablaflota', {flota});
});

router.get('/delete/:id', async(req,res)=>{
    const {id} = req.params;
    await pool.query('DELETE FROM flota WHERE id_flota = ?', [id]);
    req.flash('success', 'Flota Eliminada de manera Exitosa');
    res.redirect('/flota');
});

router.get('/edit_flota/:id', async(req, res) =>{
    const {id} = req.params;
    const flota = await pool.query('SELECT * FROM flota WHERE id_flota = ?', [id])
    res.render('flota/edit_flota', {flota: flota[0]});
});

router.post('/edit_flota/:id', async(req, res) =>{
    const {id} = req.params;
    const {modelo, placa, numero_asientos, ano_autobus} = req.body;
    const newFlota = {
        modelo, 
        placa, 
        numero_asientos, 
        ano_autobus      
    } 
    await pool.query('UPDATE flota set ? WHERE id_flota = ?', [newFlota, id]);
    req.flash('success', 'Flota Actualizada de manera Exitosa');
    res.redirect('/flota');
});

module.exports = router; 