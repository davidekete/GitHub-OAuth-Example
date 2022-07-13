import axios from "axios";
import express from "express";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();

app.get("/auth", (req, res) => {
  const query = {
    scope: "read:user",
    client_id: process.env.GITHUB_CLIENT_ID,
  };

  const urlEncoded = new URLSearchParams(query).toString();

  res.redirect(`https://github.com/login/oauth/authorize?${urlEncoded}`);
});

app.get("/oauth-callback", (req, res) => {
  const { code } = req.query;

  const body = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_SECRET,
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

app.listen(3000, () => {
  console.log("App listening on port 3000");
});
