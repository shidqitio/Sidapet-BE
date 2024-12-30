import express from "express";
import authorization from "@middleware/authorization";

const routes = express.Router();
const level = {
    admin : "/1",
    ppk : "/2",
    verifikator : "/3",
    vendor : "/5"
}

//Level1 
import itemTanyaRoute from "@routes/api/auth/level1/itemTanya-route"
import itemTanyaTplRoute from "@routes/api/auth/level1/itemTanyaTpl-route"

routes.use(level.admin + "/master", authorization, itemTanyaRoute)
routes.use(level.admin + "/master-tpl", authorization, itemTanyaTplRoute)

//Level 2
import kategoriRoute2 from "./level2/kategori-route"
import trxKategoriRoute from "./level2/trxKategori-route"

routes.use(level.ppk + "/kategori", authorization, kategoriRoute2)
routes.use(level.ppk + "/trx-kategori", authorization, trxKategoriRoute)

//Level3 
import vendorRoute from "./level3/vendor-route"
import kategoriRoute3 from "./level3/kategori-route"

routes.use(level.verifikator + "/vendor", authorization, vendorRoute)
routes.use(level.verifikator + "/kategori", authorization, kategoriRoute3)

//Level 5 Vendor
import jawabProfilRoute from "./level5/profilVendor-route"
routes.use(level.vendor + "/profil", authorization, jawabProfilRoute)

export default routes;