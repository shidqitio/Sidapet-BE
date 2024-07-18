import fs from "fs"
import path from "path";
import cors from "cors";
import https from "https";
import log4js from "log4js";
import helmet from "helmet";
import bodyParser from "body-parser";
import compression from "compression";
import express, { Application } from "express";

import apiRoutes from "@routes/api";
import webRoutes from "@routes/web";
import mobileRoutes from "@routes/mobile";

// import db from "@config/database";
import license from "@utils/promise";
import getConfig from "@config/dotenv";
import { initSocketIO } from "@config/socket";
import limiter from "@middleware/rate-limit";
import logger, { errorLogger } from "@config/logger";
import { notFound } from "@middleware/error-notfound";
import { errorhandler } from "@middleware/error-handler";
import authorization from "@middleware/authorization";

const app: Application = express();
log4js.configure(logger);

/**
 * certificate keys
 */
const key = fs.readFileSync("src/certificate/ut.key", "utf-8");
const cert = fs.readFileSync("src/certificate/full-bundle.crt", "utf-8");

const options = { key: key, cert: cert };

/**
 * body parser
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * helmet
 */
app.use(helmet());

/**
 * cors
 */
app.use(cors());

/**
 * compression
 */
app.use(compression());

/**
 * limiter
 */
app.use(limiter);

/**
 * dokumen path
 */
app.use(
  "/public/dokumen",
  express.static(path.resolve(__dirname, "../public/dokumen"))
);

/**
 * routes
 */
app.use("/si-ppan/api-auth/v1/", authorization, apiRoutes);
app.use("/si-ppan/api-noauth/v1/", apiRoutes);
app.use("/si-ppan/web/", authorization, webRoutes);
app.use("/si-ppan/mobile/", authorization, mobileRoutes);

/**
 * not found
 */
app.use(notFound);

/**
 * error handler
 */
app.use(errorhandler);

/**
 * sync database
 */
// db.sync()
//   .then(() => {
//     const server = https.createServer(options, app);
//     server.listen(getConfig("PORT_SERVER"), () => {
//       console.log(license);
//       console.log(
//         `${String.fromCodePoint(
//           0x1f525
//         )} SERVER SI-PPAN ON PORT : ${getConfig(
//           "PORT_SERVER"
//         )} ${String.fromCodePoint(0x1f525)}`
//       );
//       initSocketIO(server);
//     });
//   })
//   .catch((error) => {
//     errorLogger.error(`SERVER ERROR: ${error}`);
//   });

try {
  const server = https.createServer(options, app);
  server.listen(getConfig("PORT_SERVER"), () => {
    console.log(license);
    console.log(
      `${String.fromCodePoint(
        0x1f525
      )} SERVER SI-PPAN ON PORT : ${getConfig(
        "PORT_SERVER"
      )} ${String.fromCodePoint(0x1f525)}`
    );
    initSocketIO(server);
  });
} catch (error) {
  errorLogger.error(`SERVER ERROR: ${error}`);
}