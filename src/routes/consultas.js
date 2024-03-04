const express = require('express');
const Pool = require('mysql/lib/Pool');
const router = express.Router();

const pool = require('../database');

router.get('/', (req, res) =>{
    res.render('consultas/consultas')
});

router.get('/consulta_debito', (req, res) =>{
    res.render('consultas/consultadebito')
});

router.post('/consulta_debito', async (req, res) =>{
    
    const {fecha_salida}= req.body;
    const newConsulta = {
        fecha_salida
    }

    if (newConsulta.fecha_salida.length == 0){
        req.flash('message', 'Ingrese una fecha valida...');
        res.redirect('/consultas/consulta_debito');
    }else{  
    newConsulta.metodo_pago = 'Debito';
    const sum = await pool.query ('SELECT SUM(precio) FROM venta WHERE metodo_pago = ? AND fecha_venta = ?', [newConsulta.metodo_pago, newConsulta.fecha_salida]);
    x = (Object.values(sum[0]));
    req.flash('success','Precio de las sumas según la fecha indicada es:', x);
    res.redirect('/consultas/consulta_debito'); 
    }
});

router.get('/consulta_ventasperiodo', (req, res) =>{
    res.render('consultas/consultaventaperiodo')
});

router.post('/consulta_ventasperiodo', async (req, res) =>{
    
    const {fecha_venta}= req.body;
    const newConsulta = {
        fecha_venta
    }

    if (newConsulta.fecha_venta.length == 0){
        req.flash('message', 'Ingrese una fecha valida no nula...');
        res.redirect('/consultas/consulta_ventasperiodo');
    }else{  
    const sum = await pool.query ('SELECT COUNT(*) FROM venta WHERE fecha_venta = ?', [newConsulta.fecha_venta]);
    x = (Object.values(sum[0]));
    req.flash('success','Precio de las sumas según la fecha indicada es:', x);
    res.redirect('/consultas/consulta_ventasperiodo'); 
    }
});


router.get('/consulta_recaudacion_tasa', (req, res) =>{
    res.render('consultas/consultarecaudacion')
});

router.post('/consulta_recaudacion_tasa', async (req, res) =>{
    
    const {fecha}= req.body;
    const newConsulta = {
        fecha
    }
    if (newConsulta.fecha.length == 0){
        req.flash('message', 'Ingrese una fecha valida no nula...');
        res.redirect('/consultas/consulta_ventasperiodo');
    }else{  
    const sum = await pool.query ('SELECT SUM(tasa_salida) FROM venta WHERE fecha_venta = ?', [newConsulta.fecha]);
    const sumbf = await pool.query ('SELECT SUM(tasa_salidabf) FROM venta WHERE fecha_venta = ?', [newConsulta.fecha]);
    x = (Object.values(sum[0]));
    aux = (Object.values(sumbf[0]));
    req.flash('success','Recaudacion Dolares:', x, 'Recaudacion Bolivares:', aux);
    res.redirect('/consultas/consulta_recaudacion_tasa'); 
    }
});


router.get('/consulta_boletos', async (req,res) => {
    const boleto = await pool.query('SELECT *FROM boleto');
    res.render('consultas/consultaboletos', {boleto});
});


router.get('/consulta_chofer', async (req,res) => {
    res.send('Mantenimiento');
});

router.get('/consulta_listado', async (req,res) => {
    res.send('Mantenimiento');
});










module.exports = router; 