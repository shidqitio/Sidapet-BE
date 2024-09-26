import fs from "fs"
import path from "path";
import cors from "cors";
import https from "https";
import log4js from "log4js";
import helmet from "helmet";
import bodyParser from "body-parser";
import compression from "compression";
import express, { Application } from "express";

import apiAuthRoutes from "@routes/api/auth";
import apiNoAuthRoutes from "@routes/api/noauth";
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
import cluster from "cluster";
log4js.configure(logger);

if (cluster.isPrimary) {
  const numCPUs = 2
  console.log(`Primary ${process.pid} is running`);


  console.log("cpu", numCPUs);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  })
} else {
  const app: Application = express();
  /**
   * certificate keys
   */
  const key = fs.readFileSync("src/certificate/ut.key", "utf-8");
  const cert = fs.readFileSync("src/certificate/full-bundle.crt", "utf-8");
  
  const options = { key: key, cert: cert };
  
  app.set('trust proxy', 1);
  
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
    "/sidapet/public/image/foto-ktp/",
    express.static(path.join(getConfig('ENCRYPT_SAVE_FOTO')))
  )
  
  /**
   * routes
   */
  app.use("/si-dapet/api-auth/v1/", apiAuthRoutes);
  app.use("/si-dapet/api-noauth/v1/", apiNoAuthRoutes);
  app.use("/si-dapet/web/", webRoutes);
  app.use("/si-dapet/mobile/", mobileRoutes);
  
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
        )} SERVER SI-DAPET ON PORT : ${getConfig(
          "PORT_SERVER"
        )} ${String.fromCodePoint(0x1f525)}`
      );
      initSocketIO(server);
    });
  } catch (error) {
    errorLogger.error(`SERVER ERROR: ${error}`);
  }
}