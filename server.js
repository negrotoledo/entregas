const express = require("express");
const productRouter = require("./routes/product.routes.js");
const cartRouter = require("./routes/cart.routes.js");


const port = 8080;
const app = express();

app.use(productRouter);
app.use(cartRouter);

app.listen(port, () => console.log(`Servidor arranco en el  ${port}`));

