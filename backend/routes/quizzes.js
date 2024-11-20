var express = require("express");
var router = express.Router();
const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const dbName = "quizzes";

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

router.get("/", ensureAuth, async function (req, res, next) {
  let response = await fetch("https://opentdb.com/api_category.php");
  return res.send(await response.json());
});

router.get("/:id", ensureAuth, async function (req, res, next) {
  const { id } = req.params;
  console.log(id);
  let response = await fetch(
    `https://opentdb.com/api.php?amount=10&category=${id}&difficulty=medium`
  );
  return res.send(await response.json());
});

module.exports = router;
