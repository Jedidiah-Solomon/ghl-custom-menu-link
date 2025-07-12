import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import favicon from "serve-favicon";
import { fileURLToPath } from "url";
import { initiate, callback } from "./config/auth.js";
import customMenuRoutes from "./routes/customMenuRoutes.js";
import { startCompanyCleanupCronJob } from "./services/alpha-job.js";

dotenv.config();

const app = express();

// Serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.use(favicon(path.join(__dirname, "public", "img", "favicon.ico")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/auth/initiate", initiate);
app.use("/auth/callback", callback);

app.use("/custom-menus", customMenuRoutes);

startCompanyCleanupCronJob();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "initiate.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.get("/createMenuLink", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "createMenuLink.html"));
});

app.get("/updateMenuLink", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "updateMenuLink.html"));
});

app.get("/deleteMenu", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "deleteMenu.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
