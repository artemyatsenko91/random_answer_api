import randomAnswerService from "../controllers/RandomAnswerController";

declare module "express-serve-static-core" {
    interface Request {
        randomAnswerService: randomAnswerService;
    }
}

export const randomAnswerServiceSymbol = Symbol("randomAnswerService");
