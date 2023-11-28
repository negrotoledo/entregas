const fs = require('fs');
const crypto = require('crypto');
const productManager = require("./ProductManager")

class Cart {
    constructor(id) {
        this.id = id;
        this.products = [];
    }

    async validateProduct(productID) {
       
        const itemExistsOnDatabase = await productManager.instance.getProductByID(productID);

        
        if (itemExistsOnDatabase && itemExistsOnDatabase.id === productID) {
            return true;
        }
        return false;
    }
    async addProduct(productID) {

        const status = await this.validateProduct(productID);
        console.log(status);

        if (status) {
            const existingProduct = this.products.find(entry => entry.id === productID);

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                this.products.push({ product: productID, quantity: 1 });
            }
        }
    }
}

class CartManager {
    constructor(path) {
        console.log("Se Inicializo el CM");

        this.path = path;
        this.cartArray = [];

      
        this.initialize();
    }

    async initialize() {
        
        const data = await this.readCartsFromFile();
        this.cartArray = data || [];
    }

    
    generateID() {
        const idData = `${Math.random()}`;
        const hash = crypto.createHash('md5').update(idData).digest('hex');
        return hash.toUpperCase();
    }

    
    async validateCart(id) {
        const isIDDuplicate = this.cartArray.some(cart => cart.id === id);

        if (isIDDuplicate) {
            return false;
        }

        return true;
    }

    
    async readCartsFromFile() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
           
            console.error('no puede leer el archivo:', error.message);
            return null;
        }
    }

 
    async writeCartsToFile() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.cartArray, null, 2), { encoding: 'utf-8' });
        } catch (error) {
            console.error('no puede escribir el archivo:', error.message);
        }
    }

   
    async getCart(id) {
        const cart = this.cartArray.find(cart => cart.id === id);
        return cart || null;
    }

 
    async addToCart(cartID, productID) {
        const cart = await this.getCart(cartID);

        if (cart) {
            const existingProduct = cart.products.find(entry => entry.product === productID);
           
            const itemExistsOnDatabase = await productManager.instance.getProductByID(productID);

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                if (itemExistsOnDatabase) {
                    cart.products.push({ product: productID, quantity: 1 });
                }
            }

            await this.writeCartsToFile();
            return cart || null;
        }
    }

  
    async createCart(products) {
        const cartID = this.generateID();

       
        if (await this.validateCart(cartID)) {
            const newCart = new Cart(cartID);
            await Promise.all(products.map(productID => newCart.addProduct(productID)));
            this.cartArray.push(newCart);
            await this.writeCartsToFile();
            console.log(`se creo correctamente el carrito con su ID  ${cartID}`)
            return newCart;
        }

        return null;
    }
}

const instance = new CartManager('./cart.json');

module.exports = { instance, CartManager };