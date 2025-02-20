import express from "express";
import selectInputController from "@controllers/api/selectInput-controller";


const router = express.Router();

router.get("/domisili", selectInputController.domisiliInput)

router.get("/kbli", selectInputController.kbli)

router.get("/jenis-pengadaan", selectInputController.jenisPengadaan)


export default router

