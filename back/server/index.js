import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import express from 'express'
import cors from 'cors'
// import { db } from "../app/models/index.js";
import { subscribeEvents } from "./events.js";

// importing routes
import { drawRouter } from "../app/routes/draw.js";

// defining the Express app
const app = express();

// parse JSON bodies into JS objects
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// enabling CORS from our frontend
var corsOptions = {
    origin: process.env.CORS_ORIGIN || "http://localhost:9000" /* Change http to https if frontend is using https */,
};
app.use(cors(corsOptions));

// db.sequelize.sync({ alter: true }).then(() => {
//     console.log(`\nDb is synced with models.\n`);
// });

// Routing
app.get("/api", (req, res) => {
    res.json({ message: `\nWelcome !\n` });
});

app.use("/api/draw", drawRouter);

// starting the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`\nServer is running on port ${PORT}.\n`);
});

subscribeEvents();