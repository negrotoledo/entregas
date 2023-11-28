const express = require('express');
const productManager = require("../src/ProductManager.js");

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

async function getProductByID(req, res) {
    const productID = req.params.id;

    try {
        const product = await productManager.instance.getProductByID(productID);
        if (product) {
            res.send(product);
        } else {
            res.send(`<h1>No se encontró el producto</h1>`);
        }
    } catch (error) {
        console.error('Error para obtener el ID del producto:', error.message);
        res.status(500).send(`Error interno ${error}`);
    }
}

async function getProductsByLimit(req, res) {
    const limit = req.query.limit;

    try {
        const products = await productManager.instance.getProducts(limit);
        res.send(products);
    } catch (error) {
        console.error('Error al obtener producto:', error.message);
        res.status(500).send(`Error Interno ${error}`);
    }
}

async function addProduct(req, res) {
    const data = req.body;
    console.log(data);
    try {
        const product = await productManager.instance.addProduct(data);

        if(product.success) {
            res.send("Producto agregado");
        } else {
            res.send("El producto no se agregó");
        }
    } catch (error) {
        console.error('Error al agregar el producto:', error.message);
        res.status(500).send(`Error Interno ${error}`);
    }
}

async function updateProductByID(req, res) {
    const data = req.body;
    const id = req.params.id;

    try {
        const updateResult = await productManager.instance.updateProduct(id, data);
        if (updateResult.success) {
            res.send(`Item ID ${id} se actualizó, ${data}`);
        } else {
            res.status(404).send(`Producto ID ${id} no se encontró.`);
        }
    } catch (error) {
        console.error('Error de actualización:', error.message);
        res.status(500).send(`Error Interno ${error}`);
    }
}

async function deleteProductByID(req, res) {
    const id = req.params.id;

    try {
        const deletionResult = await productManager.instance.deleteProductByID(id);

        if (deletionResult.success) {
            res.send(`Item  ID ${id} fue removido.`);
        } else {
            res.status(404).send(`Producto ID ${id} no se encontró.`);
        }
    } catch (error) {
        res.status(500).send(`Error interno: ${error.message}`);
    }
}

// Endpoint 
router.get('/api/products/', getProductsByLimit);
// Endpoint GET
router.get('/api/products/:id', getProductByID);
//Endpoint Post
router.post('/api/products/', addProduct);
//Endpoint PUT
router.put('/api/products/:id', updateProductByID);
//Endpoint Delete
router.delete('/api/products/:id', deleteProductByID);

module.exports = router;
