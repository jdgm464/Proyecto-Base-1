const express = require('express');
const Pool = require('mysql/lib/Pool');
const router = express.Router();

const pool = require('../database');

router.get('/addventa', async (req,res)=>{
    const rutas = await pool.query('SELECT *FROM ruta');
    res.render('venta/add', {rutas});
});

router.post('/addventa', async (req,res) =>{
    const {ci_cliente, ci_empleado, id_ruta, fecha_salida, fecha_venta, puesto_asignado, numero_unidad, metodo_pago, nr_recibo, nr_vaucher, entidad_bancaria ,moneda} = req.body;
    const newVenta = {
        ci_cliente, 
        ci_empleado, 
        id_ruta,
        fecha_salida,
        fecha_venta,
        puesto_asignado,
        numero_unidad,
        metodo_pago,
        nr_recibo,
        nr_vaucher,
        entidad_bancaria,
        moneda
    };

    const newBoleto ={
        ci_cliente,
        id_ruta,
        puesto_asignado,
        numero_unidad,
        metodo_pago
    }

    console.log(newBoleto);
    
    const result = await pool.query('SELECT ci FROM cliente WHERE ci = ? ', [newVenta.ci_cliente]);
    const result1 = await pool.query('SELECT ci_empleado FROM empleado WHERE ci_empleado = ? ', [newVenta.ci_empleado]);
    const result2 = await pool.query('SELECT id_flota FROM flota WHERE id_flota = ? ', [newVenta.numero_unidad]);
    const result3 = await pool.query('SELECT id_flota FROM flota WHERE id_flota = ? ', [newVenta.numero_unidad]);

    console.log("Length")
    console.log(newVenta.fecha_salida.length)
    console.log(newVenta.fecha_venta.length)
    
        if (result.length == 0) {
            req.flash('message', 'CI de cliente ingresado no se encuentra registrado en la base de datos o no coincide con el de la sesion...');
            res.redirect('/venta/addventa');
        } else if (result1.length == 0) {
            req.flash('message', 'CI de empleado ingresado no se encuentra registrado en la base de datos');
            res.redirect('/venta/addventa');
        }else if (result2.length == 0) {
            req.flash('message', 'Nro de flota no se encuentra registrado en la base de datos');
            res.redirect('/venta/addventa');
        }else if (result3.length == 0) {
            req.flash('message', 'ID Ruta ingresada no se encuentra registrado en la base de datos');
            res.redirect('/venta/addventa');
        }else if ((newVenta.fecha_salida.length == 0) && (newVenta.fecha_venta.length == 0)) {
            req.flash('message', 'Campos de Fecha de Salida y Fecha de venta son Obligatorios');
            res.redirect('/venta/addventa');
        }else if (((newVenta.nr_recibo.length > 0)  && (newVenta.nr_vaucher.length > 0)) && (newVenta.entidad_bancaria.length > 0)) {
            req.flash('message', 'Datos ingresados invalidos solo puede ingresar un Nr de recibo selecciono transferencia y un Nr de vaucher y una entidad bancaria si es Efectivo');
            res.redirect('/venta/addventa');
        }else if ((newVenta.nr_recibo.length > 0)  &&  (newVenta.metodo_pago == "Debito")) {
            req.flash('message', 'Metodo seleccionado Debito no puede llenar el campo de Nr Recibo');
            res.redirect('/venta/addventa');
        }else if (((newVenta.entidad_bancaria.length > 0)  && (newVenta.nr_vaucher.length > 0)) && (newVenta.metodo_pago == "Transferencia")) {
            req.flash('message', 'Metodo Seleccionado Transferencia no puede llenar los campos de Nr Vaucher y Entidad Bancaria');
            res.redirect('/venta/addventa');
        }else if ((newVenta.nr_recibo.length == 0) && (newVenta.metodo_pago == "Transferencia")) {
            req.flash('message', 'Metodo Seleccionado Transferencia debe llenar el campo de Nr Recibo');
            res.redirect('/venta/addventa');
        }else if (((newVenta.entidad_bancaria.length == 0)  && (newVenta.nr_vaucher.length == 0)) && (newVenta.metodo_pago == "Debito")) {
            req.flash('message', 'Metodo Seleccionado Debito debe llenar los campos de Nr de Vaucher y Entidad Bancaria');
            res.redirect('/venta/addventa');
        }else if(newVenta.moneda == "Dolares"){
            const result = await pool.query('SELECT precio FROM ruta WHERE idruta = ? ', [newVenta.id_ruta]);
            console.log(result);
            const aux = (Object.values(result[0]));
            newVenta.precio = aux;
            newVenta.iva = (aux + (aux*0.16))/10;
            newVenta.tasa_salida = (aux * 0.01);
            console.log(newVenta.precio);
            console.log(newVenta);
            console.log(newVenta.tasa_salida);
            newBoleto.precio = aux;

            await pool.query('INSERT INTO venta set ?', [newVenta]);
            await pool.query('INSERT INTO boleto set ?', [newBoleto]);
            req.flash('success','Venta guardada de forma Exitosa');
            res.redirect('/profile');
        }else if(newVenta.moneda == "Bolivares"){
            const result = await pool.query('SELECT precio FROM ruta WHERE idruta = ? ', [newVenta.id_ruta]);
            console.log(result);
            const aux = (Object.values(result[0]));
            const aux2 = aux * 4.5;
            newVenta.precio_bolivares = aux2;
            newVenta.iva_bolivares = (aux2 + (aux2*0.16))/10;
            newVenta.tasa_salidabf = (aux2 * 0.01);
            console.log(newVenta.precio);
            console.log(newVenta);
            console.log(newVenta.tasa_salida);
            newBoleto.precio_bolivares = aux2;
            
            await pool.query('INSERT INTO venta set ?', [newVenta]);
            await pool.query('INSERT INTO boleto set ?', [newBoleto]);
            req.flash('success','Venta guardada de forma Exitosa');
            res.redirect('/profile');
        }

});

router.get('/', async (req,res) => {
    const venta = await pool.query('SELECT *FROM venta');
    res.render('venta/listaventa', {venta});
});

router.get('/buscarcliente', async (req,res) => {
    res.render('consultas/consulta_historico');
});

router.post('/buscarcliente', async (req, res) => {
    const {ci_cliente} = req.body;
    const historico = await pool.query('SELECT ci_cliente, id_ruta FROM venta WHERE ci_cliente = ?', [ci_cliente]);
    console.log(historico);
    res.render('venta/tablaventa', {historico});
})

router.get('/delete/:id', async(req,res)=>{
    const {id} = req.params;
    await pool.query('DELETE FROM venta WHERE idventa = ?', [id]);
    req.flash('success', 'Venta Eliminada de manera Exitosa');
    res.redirect('/venta');
});

router.get('/edit_venta/:id', async(req, res) =>{
    const {id} = req.params;
    const venta = await pool.query('SELECT * FROM venta WHERE idventa = ?', [id])
    res.render('venta/edit_venta', {venta: venta[0]});
});

router.post('/edit_flota/:id', async(req, res) =>{
    const {id} = req.params;
    const {ci_cliente, ci_empleado, id_ruta} = req.body;
    const newVenta = {
        ci_cliente, 
        ci_empleado, 
        id_ruta      
    } 
    await pool.query('UPDATE venta set ? WHERE idventa = ?', [newVenta, id]);
    req.flash('success', 'Venta Actualizada de manera Exitosa');
    res.redirect('/Venta');
});

module.exports = router; 