import express from "express";
import authorization from "@middleware/authorization";

const routes = express.Router();
const level = {
    admin : "1",
    ppk : "2",
    verifikator : "/3",
    vendor : "/5"
}

//Level3 
import vendorRoute from "./level3/vendor-route"
routes.use(level.verifikator + "/vendor", authorization, vendorRoute)

//Level 5 Vendor
import jawabProfilRoute from "./level5/profilVendor-route"
routes.use(level.vendor + "/profil", authorization, jawabProfilRoute)

export default routes;