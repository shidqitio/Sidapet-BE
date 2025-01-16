import express  from "express";
import itemTanyaTplController from "@controllers/api/itemTanyaTpl-controller";
import {
    payloadItemTanyaTplSchema,
    payloadUpdateItemTanyaTplSchema,
    parameterSchema
} from "@schema/api/itemTanyaTpl-schema"

import validate from "@schema/validate";

const router = express.Router()

//get
router.get("/tpl/get-all", itemTanyaTplController.getItemTanyaTplAll)
router.get("/tpl/get-id/:id", validate(parameterSchema), itemTanyaTplController.getItemTanyaTplById)


export default router