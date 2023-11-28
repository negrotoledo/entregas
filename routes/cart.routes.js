const express = require('express');
const cartManager = require("../src/CartManager.js");

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

async function createCart(req, res) {
    const data = req.body;


 if (!Array.isArray(data)) {
    return res.status(200).send('El cuerpo de la solicitud debe ser un array de productos.');
}


    const cart = await cartManager.instance.createCart(data);

    try {
        if (cart) {
            res.send(cart);
        } else {
            res.send("el carrito no se creó");
        }
    } catch (error) {
        console.error('Error al crear el carrito:', error.message);
        res.status(500).send(`Error interno ${error}`);
    }
}

async function getCartInfo(req, res) {
    const id = req.params.cid;
    const cart = await cartManager.instance.getCart(id);

    try {
        if (cart) {
            res.send(cart);
        } else {
            res.send("No se encontró carrito");
        }
    } catch (error) {
        console.error('Error al recuperar el carrito:', error.message);
        res.status(500).send(`Error Interno ${error}`);
    }
}

async function addToCart(req, res) {
    const cartID = req.params.cid;
    const data = req.params.id;

    const cart = await cartManager.instance.addToCart(cartID, data);

    try {
        if (cart) {
            res.send(cart);
        } else {
            res.send("Carrito no actualizado");
        }
    } catch (error) {
        console.error('no se pudo crear el carrito:', error.message);
        res.status(500).send(`Error interno ${error}`);
    }
}

// Definicion de los EndPoint 
router.post('/api/carts/', createCart);
router.get('/api/carts/:cid', getCartInfo);
router.post('/api/carts/:cid/product/:id', addToCart);

module.exports = router;
