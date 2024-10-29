import express from "express";
import selectInputController from "@controllers/api/selectInput-controller";


const router = express.Router();

router.get("/domisili", selectInputController.domisiliInput)


export default router

