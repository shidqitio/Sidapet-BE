import express from "express";

const routes = express.Router();
const level = {
    admin : "1",
    ppk : "2",
    verifikator : "3",
    vendor : "5"
}

//PUBLIC
import vendorRegisterRoute from "./vendorRegister-route"
routes.use( "/vendor",  vendorRegisterRoute)

export default routes;