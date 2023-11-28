const initialProducts = [
    { title: "Item 1", 
      description: "Producto 1", 
      code: "AD_0001", 
      price: 100, 
      stock: 0, 
      thumbails: [""], 
      category: "aun no la defino",
      id: "", },

];

const fs = require('fs');
const crypto = require('crypto');

class ProductManager {
    constructor(path) {
        console.log("Se actualizo El PM");

        this.path = path;
        
        this.initialize();
    }

    async initialize() {
        
        const data = await this.readProductsFromFile();
        this.productArray = data || [];

      
    }

    generateID(product) {
        const idData = `${product.title}${product.price}${product.code}${product.description}${Math.random()}`;
        const hash = crypto.createHash('md5').update(idData).digest('hex');
        product.id = hash.toUpperCase();
    }

    validateProduct(product) {
      
        this.generateID(product);

       
        if (!product.title || !product.description || !product.code || !product.price || !product.category ||parseInt(product.price) <= 0 || parseInt(product.stock) < 0) {
           
            return false;
        }

        const isCodeDuplicate = this.productArray.some(prod => prod.code === product.code);
        const isIDDuplicate = this.productArray.some(prod => prod.id === product.id);

       
        if (isCodeDuplicate || isIDDuplicate) {
            return false;
        }


        product.status = true;
      
        return true;
    }

    async addProducts(data) {
        for (const product of data) {
            await this.addProduct(product);
        }
    }


    async addProduct(product) {
        console.log("intentando agregar ...");

       
        if (this.validateProduct(product)) {
    
            this.productArray.push(product);

            await this.writeProductsToFile();

            if (product) {
                console.log(`El Producto ${product.title} se agrego correctamente`);
                return { success: true };
            }

        } else {
            console.log(`El Producto "${product.title}" (con este codigo ${product.code}) y con el ID ${product.id} ya exite`);
            return { success: false };
        }
    }

    async readProductsFromFile() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
        
            console.error('no pudo leer el archivo:', error.message);
            return null;
        }
    }

    async writeProductsToFile() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.productArray, null, 2), { encoding: 'utf-8' });
        } catch (error) {
            console.error('no puede leer el archivo de prodctos', error.message);
        }
    }

    async getProducts(limit) {
        try {
            const products = await this.readProductsFromFile() || [];

            if (limit) {
                
                return products.slice(0, limit);
            } else {
               
                return products;
            }
        } catch (error) {
            console.error("No puede obtener el Prod ", error.message);
            return null;
        }
    }

    async updateProduct(id, data) {
        let productIndex = this.productArray.findIndex(prod => prod.id === id);

        if (productIndex !== -1) {
       
            this.productArray[productIndex] = { ...this.productArray[productIndex], ...data, id };
            await this.writeProductsToFile();
            console.log("El prodcuto se actualizo")
            return { success: true };
        } else {
            console.error("no se encontro el producto");
            return { success: false };
        }
    }

    async deleteProductByID(id) {
        const productIndex = this.productArray.findIndex(prod => prod.id === id);

        if (productIndex !== -1) {
           
            this.productArray.splice(productIndex, 1);
            await this.writeProductsToFile(); 
            console.log(`este prodcuto  ${id} fue eliminado `);

            return { success: true };
        } else {
            console.log("no se encontro producto");
            return { success: false };
        }
    }

    async getProductByID(id) {
        try {
            const products = await this.readProductsFromFile() || [];
            const foundProduct = products.find(prod => prod.id === id);

            if (foundProduct) {
                console.log(`El Prodcuto con este ${id} es:(${foundProduct}), nombre: ${foundProduct.title}`);
                return foundProduct;
            } else {
                console.log("Producto no encontrado ");
                return null;
            }
        } catch (error) {
            console.error('Error al leer el archivo de productos:', error.message);
            return null;
        }
    }
}

const instance = new ProductManager('./products.json');

module.exports = { instance, ProductManager };

