require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const { Op } = require("sequelize");
const db = require("./db/index.js");
const { ranking } = db;
db.sequelize.sync();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const rankingRouter = require("./routes/ranking");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", rankingRouter);

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

app.listen(port, () => {
  console.log(`API server listening at port: ${port}`);
});

setInterval(myTimer, 24 * 60 * 60 * 1000);

async function myTimer() {
  await ranking.destroy({
    where: {
      updatedAt: { [Op.lte]: Date.now() + 31 * 60 * 60 * 1000 },
    },
  });
}
