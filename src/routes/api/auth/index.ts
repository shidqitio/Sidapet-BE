import express from "express";
import authorization from "@middleware/authorization";

const routes = express.Router();
const level = {
    admin : "1",
    ppk : "2",
    verifikator : "/3",
    vendor : "5"
}

//Level3 
import vendorRoute from "./level3/vendor-route"
routes.use(level.verifikator + "/vendor", authorization, vendorRoute)


export default routes;