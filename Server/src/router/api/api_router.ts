import express from "express";
import dataRouter from "./data/data_router";
const apiRouter = express.Router();

apiRouter.use("/data", dataRouter);

export default apiRouter;
