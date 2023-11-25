import { Request, Response, Router } from "express";

const router = Router();

const outHelloMessage = (req: Request, res: Response) => {
    res.status(200).json("Hello from rootRoute");
};

router.get("/", outHelloMessage);

export default router;
