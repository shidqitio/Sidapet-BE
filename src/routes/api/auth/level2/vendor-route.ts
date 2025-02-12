import express  from "express";
import vendorController from "@controllers/api/vendor-controller";

import {
    querySchema
} from "@schema/api/vendor-schema"

import validate from "@schema/validate";

const router = express.Router()

//get
router.get("/", validate(querySchema) ,vendorController.getPenyediaLimitOffset)

router.get("/all", vendorController.getPenyediaAll)

router.post("/search-vendor", vendorController.getPenyediaByKode)


export default router