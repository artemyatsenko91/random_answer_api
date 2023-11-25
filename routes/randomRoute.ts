import { Router, Response, Request } from "express";
import { NotFoundError, ServerError } from "../services/errorsHandling";
import { RandomAnswer } from "../controllers/RandomAnswerController";
import { randomAnswerServiceSymbol } from "./types";

const router = Router();

const randomRouter = async (req: Request, res: Response) => {
    try {
        const randomAnswer =
            await req[randomAnswerServiceSymbol].getRandomAnswer();

        if (randomAnswer === RandomAnswer.MAYBE) {
            res.status(500).json({ message: "Fail" });
        } else {
            res.status(200).json({ answer: randomAnswer });
        }
    } catch (error) {
        if (error instanceof ServerError) {
            res.status(error.status).json({
                message: error.message,
            });
        } else if (error instanceof NotFoundError) {
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

router.get("/", randomRouter);

export default router;
