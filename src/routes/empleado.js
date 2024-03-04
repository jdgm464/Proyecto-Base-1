const express = require('express');
const Pool = require('mysql/lib/Pool');
const router = express.Router();

const pool = require('../database');

router.get('/addempleado', (req,res)=>{
    res.render('empleado/addempleado');
});

router.post('/addempleado', async (req,res) =>{
    const {ci_empleado, nombre, apellido, sexo, edad}= req.body;
    const newEmpleado = {
        ci_empleado,
        nombre, 
        apellido, 
        sexo, 
        edad
    }
    await pool.query('INSERT INTO empleado set ?', [newEmpleado]);
    req.flash('success','Empleado Guardado de forma Exitosa');
    res.redirect('/empleado');
});

router.get('/', async (req,res) => {
    const empleado = await pool.query('SELECT *FROM empleado');
    res.render('empleado/listaempleado', {empleado});
});

router.get('/tablaempleado', async (req,res) => {
    const empleado = await pool.query('SELECT *FROM empleado');
    res.render('empleado/tablaempleado', {empleado});
});

router.get('/delete/:id', async(req,res)=>{
    const {id} = req.params;
    await pool.query('DELETE FROM empleado WHERE ci_empleado = ?', [id]);
    req.flash('success', 'Empleado Eliminado de manera Exitosa');
    res.redirect('/empleado');
});

router.get('/edit_empleado/:id', async(req, res) =>{
    const {id} = req.params;
    const empleado = await pool.query('SELECT * FROM empleado WHERE ci_empleado = ?', [id])
    res.render('empleado/edit_empleado', {empleado: empleado[0]});
});

router.post('/edit_empleado/:id', async(req, res) =>{
    const {id} = req.params;
    const {ci_empleado, nombre, apellido, sexo, edad} = req.body;
    const newEmpleado = {
        ci_empleado,
        nombre, 
        apellido, 
        sexo, 
        edad      
    } 
    await pool.query('UPDATE empleado set ? WHERE ci_empleado = ?', [newEmpleado, id]);
    req.flash('success', 'Empleado Actualizado de manera Exitosa');
    res.redirect('/empleado');
});

module.exports = router; 