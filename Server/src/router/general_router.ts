import express from "express";
import apiRouter from "./api/api_router";
const generalRouter = express.Router();


generalRouter.use("/api", apiRouter);


export default generalRouter;
