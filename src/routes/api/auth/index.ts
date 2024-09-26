import express from "express";
import authorization from "@middleware/authorization";

const routes = express.Router();
const level = {
    admin : "1",
    ppk : "2",
    verifikator : "3",
    vendor : "5"
}



export default routes;