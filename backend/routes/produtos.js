var express = require("express");
var router = express.Router();
const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const dbName = "pessoasProdutos";

let db;

async function connectMongo() {
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log("cheguei");
    db = client.db(dbName);
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
  }
}

connectMongo();

function ensureAuth(req, res, next) {
  if (req.session.user) {
    return next();
  }
  return res.sendStatus(401);
}

router.get(
  "/",
  /*ensureAuth,*/ async function (req, res, next) {
    db.collection("produtos")
      .find()
      .toArray()
      .then((produtos) => {
        if (!produtos) {
          res.status(401).send("Produtos não encontrados");
        }
        res.send(produtos);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
);

module.exports = router;
