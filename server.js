import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import favicon from "serve-favicon";
import { fileURLToPath } from "url";
import customMenuRoutes from "./routes/customMenuRoutes.js";

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

app.use("/custom-menus", customMenuRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Custom Menu Link Server",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
