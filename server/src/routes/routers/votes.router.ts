import {Router} from "express";
import VotesController from "../../controllers/votes/votes.controller";

const router: Router = Router();

router.get('/variants', VotesController.variants);
router.get('/stats', VotesController.stats);
router.post('/vote', VotesController.vote);

export default router;
