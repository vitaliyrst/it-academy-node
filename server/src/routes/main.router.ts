import {Router} from "express";
import votesRouter from "./routers/votes.router";

const mainRouter: Router = Router();

mainRouter.use('/votes', votesRouter);

export default mainRouter;
