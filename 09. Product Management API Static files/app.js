const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
const productsRouter = express.Router();

const products = [
  {
    id: 1,
    imgUrl:
      "https://images.unsplash.com/photo-1611791485440-24e8239a0377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
    name: "iPhone 12 Pro",
    price: 1099.99,
  },
  {
    id: 2,
    imgUrl:
      "https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    name: "Samsung Galaxy S21",
    price: 999.99,
  },
  {
    id: 3,
    imgUrl:
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1827&q=80",
    name: "Sony PlayStation 5",
    price: 499.99,
  },
  {
    id: 4,
    imgUrl:
      "https://images.unsplash.com/photo-1639087595550-e9770a85f8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    name: "MacBook Pro 16",
    price: 2399.99,
  },
  {
    id: 5,
    imgUrl:
      "https://images.unsplash.com/photo-1613682988402-9e2ec510b4cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1625&q=80",
    name: "DJI Mavic Air 2",
    price: 799.99,
  },
];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public", { maxAge: 360 * 24 * 60 * 60, etag: false }));
app.set("view engine", "ejs");

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
  res.render("home", { products: products });
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
        res.render("home", { products: searchedProducts });
      }
    });
  }
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

productsRouter.get("/:id", (req, res) => {
  res.render("productDetails", { product: products[req.productIndex] });
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

// app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
