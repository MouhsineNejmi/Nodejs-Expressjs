const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const productsRouter = express.Router();

let products = [
  { id: 1, name: "iPhone 12 Pro", price: 1099.99 },
  { id: 2, name: "Samsung Galaxy S21", price: 999.99 },
  { id: 3, name: "Sony PlayStation 5", price: 499.99 },
  { id: 4, name: "MacBook Pro 16", price: 2399.99 },
  { id: 5, name: "DJI Mavic Air 2", price: 799.99 },
];

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/products", productsRouter);

const loggingMiddleware = (req, res, next) => {
  const currentDate = new Date();
  console.log(
    `Request method ${req.method} and the request url is ${req.url} and the date is ${currentDate}`
  );
  next();
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.log("Error handler is called");
  res.status(statusCode).send({ error: message });
  next(err);
};

app.use(loggingMiddleware);

productsRouter.get("/", (req, res) => {
  res.send(products);
});

productsRouter.get("/search", (req, res) => {
  const { q, minPrice, maxPrice } = req.query;
  const searchedProducts = [];

  if (q && minPrice && maxPrice) {
    products.forEach((product) => {
      if (
        product.name.toLowerCase().includes(q.toLowerCase()) &&
        product.price >= minPrice &&
        product.price <= maxPrice
      ) {
        searchedProducts.push(product);
      }
    });
  }

  res.send(searchedProducts);
});

productsRouter.get("/:id", (req, res, next) => {
  res.status(200).send(products[req.productIndex]);
});

// Middleware if product is not available
productsRouter.use("/:id", (req, res, next) => {
  const id = Number(req.params.id);
  const productIndex = products.findIndex((product) => product.id === id);

  if (productIndex === -1) {
    const err = Error("Product not found!");
    err.status = 404;
    res.send(err.message);
    next(err);
  }
  req.productIndex = productIndex;
  next();
});

productsRouter.post("/", (req, res) => {
  const product = {
    id: parseInt(req.body.id),
    name: req.body.name,
    price: parseFloat(req.body.price),
  };

  if (product) {
    products.push(product);
    console.log(products);
    res.status(204).send();
  } else {
    const err = Error(
      "Something went wrong, could not add product to the list"
    );
    err.status = 404;
    res.send(err);
  }
});

productsRouter.put("/:id", (req, res) => {
  const updatedProduct = {
    id: parseInt(req.body.id),
    name: req.body.name,
    price: parseFloat(req.body.price),
  };

  products[req.productIndex] = updatedProduct;
  console.log(products);

  res.status(204).send();
});

productsRouter.delete("/:id", (req, res) => {
  products.splice(req.productIndex, 1);
  res.status(204).send();
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
