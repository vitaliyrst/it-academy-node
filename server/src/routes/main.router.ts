import {Router} from "express";
import votesRouter from "./routers/votes.router";
import formRouter from "./routers/form.router";

const mainRouter: Router = Router();

mainRouter.use('/votes', votesRouter);
mainRouter.use('/form', formRouter)
export default mainRouter;
