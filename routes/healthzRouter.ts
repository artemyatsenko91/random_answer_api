import { Request, Response, Router } from "express";
import { NotFoundError, ServerError } from "../services/errorsHandling";
import { randomAnswerServiceSymbol } from "./types";

const router = Router();

const checkHealthController = async (req: Request, res: Response) => {
    try {
        const healthCheckStatus =
            await req[randomAnswerServiceSymbol].checkHealth();

        res.status(200).json({
            status: healthCheckStatus,
        });
    } catch (error) {
        if (error instanceof ServerError) {
            res.status(error.status).json({
                message: error.message,
            });
        }
        if (error instanceof NotFoundError) {
            res.status(error.status).json({
                message: error.message,
                code: error.code,
            });
        } else if (error instanceof Error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }
};

router.get("/", checkHealthController);

export default router;
