import axios from "axios";
import express from "express";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT

app.get("/auth", (req, res) => {
  const query = {
    scope: "read:user",
    client_id: process.env.CLIENT_ID,
  };

  const urlEncoded = new URLSearchParams(query).toString();

  res.redirect(`https://github.com/login/oauth/authorize?${urlEncoded}`);
});

app.get("/oauth-callback", (req, res) => {
  const { code } = req.query;

  const body = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code,
  };

  const options = { headers: { accept: "application/json" } };
  axios
    .post("https://github.com/login/oauth/access_token", body, options)
    .then((_res) => _res.data.access_token)
    .then((token) => {
      res.redirect(`/?token=${token}`);
    })
    .catch((err) => res.status(500).json({ err: err.message }));
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});