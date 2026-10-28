import express from "express";
import cors from "cors";
import userRoutes from "./src/interfaces/routes/UserRoutes";
import censoRoutes from "./src/interfaces/routes/CensoRoutes";
import locationRoutes from "./src/interfaces/routes/LocationRoutes";

export const app = express();

app.use(cors({
    origin: "http://localhost:4200",
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use("/api", userRoutes);
app.use("/api/censos", censoRoutes);
app.use("/api/locations", locationRoutes);


app.get("/health", (req, res) => {
    res.send("ok");
});