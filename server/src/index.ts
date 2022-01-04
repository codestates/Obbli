import express from "express";
const indexRouter = require("./router/index");
const morgan = require("morgan");

const app = express();
const port = 3000;
app.use(morgan("dev"));
import "reflect-metadata";
import { createConnection } from "typeorm";

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, resp) => {
  console.log("Hello, world!");
  return resp.status(200).send("Hello, world!");
});

app.use("/person", indexRouter.Person);
app.use("/org", indexRouter.Org);
app.use("/advert", indexRouter.Advert);
app.use("/application", indexRouter.Application);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
