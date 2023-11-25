import express from "express";
import * as dotenv from "dotenv";
import { Server } from "http";
// import MockAdapter from "axios-mock-adapter";
// import axios from "axios";

import rootRouter from "./routes/rootRoute";
import randomRouter from "./routes/randomRoute";
import healthzRouter from "./routes/healthzRouter";
import RandomAnswerService from "./controllers/RandomAnswerController";
import { randomAnswerServiceSymbol } from "./routes/types";

// const mock = new MockAdapter(axios);

dotenv.config();
const PORT = process.env.PORT;
const URL = `${process.env.URL}/api`;

// mock.onGet(URL).reply(500, { error: "Internal Server Error" });

const randomAnswerService = new RandomAnswerService(URL);

declare module "express-serve-static-core" {
    interface Request {
        [randomAnswerServiceSymbol]: RandomAnswerService;
    }
}

const main = async () => {
    const signals = ["SIGINT", "SIGTERM"];
    const app = express();
    const server = app.listen(PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`Server was run on port - ${PORT}`);
    });

    let shutdownInitiated = false;

    app.use(express.json());

    app.use((req, res, next) => {
        req[randomAnswerServiceSymbol] = randomAnswerService;
        next();
    });

    app.use("/", rootRouter);
    app.use("/random", randomRouter);
    app.use("/healthz", healthzRouter);

    signals.forEach((signal) => {
        process.on(signal, async () => {
            if (!shutdownInitiated) {
                shutdownInitiated = true;

                // eslint-disable-next-line no-console
                console.log("Gracefull shutdown");

                try {
                    await gracefullShutdown(server);

                    // eslint-disable-next-line no-console
                    console.log("Gracefull shutdown success");

                    process.exit(0);
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.log(error);

                    process.exit(1);
                }
            }
        });
    });
};

const gracefullShutdown = async (server: Server) => {
    return new Promise<void>((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
    });
};

main();
