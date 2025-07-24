import express from "express";
import cors from "cors";
import path from "path";
import auth from "../src/routes/auth.route";
import user from "../src/routes/users.route";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api/v1", auth);
app.use("/api/v1", user);

// Phục vụ file tĩnh (index.html nằm trong /public)
app.use(express.static(path.join(__dirname, "../public")));

export default app;
