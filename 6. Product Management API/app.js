const express = require("express");

const app = express();
const productsRouter = express.Router();

let products = [
  { id: 1, name: "iPhone 12 Pro", price: 1099.99 },
  { id: 2, name: "Samsung Galaxy S21", price: 999.99 },
  { id: 3, name: "Sony PlayStation 5", price: 499.99 },
  { id: 4, name: "MacBook Pro 16", price: 2399.99 },
  { id: 5, name: "DJI Mavic Air 2", price: 799.99 },
];

app.use("/products", productsRouter);

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
  const id = Number(req.params.id);
  const productIndex = products.findIndex((product) => product.id === id);

  if (productIndex === -1) {
    res.status(404).send("Product not found");
  } else {
    res.status(200).send(products[productIndex]);
  }
});

productsRouter.post("/", (req, res) => {
  const id = Number(req.params.id);
  const product = { id, ...req.query.product };

  if (product) {
    products.push(product);
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
  const id = Number(req.params.id);
  const productIndex = products.findIndex((product) => product.id === id);

  if (productIndex === -1) {
    const err = Error(
      "Product not found, please select a product from the list"
    );
    err.status = 404;
    res.send(err);
  } else {
    products[productIndex] = req.query.product;
    res.status(204).send();
  }
});

productsRouter.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const productIndex = products.findIndex((product) => product.id === id);

  if (productIndex === -1) {
    const err = Error(
      "Product not found, please select a product from the list"
    );
    err.status = 404;
    res.send(err);
  } else {
    products.splice(productIndex, 1);
    res.status(204).send(newProducts);
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
