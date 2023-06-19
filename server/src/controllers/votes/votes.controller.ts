import {Request, Response} from "express";
import VotesService from "../../services/votes/votes.service";

class VotesController {

    async variants(req: Request, res: Response) {
        try {
            const variants = await VotesService.getVariants();
            return res.status(200).json({
                success: true,
                data: variants
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'No data with variants'
            });
        }
    }

    async stats(req: Request, res: Response) {
        try {
            const stats = await VotesService.getStats();
            return res.status(200).json({
                success: true,
                data: stats
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'No data with stats'
            });
        }
    }

    async vote(req: Request, res: Response) {
        try {
            await VotesService.setVote(req.body.id);
            return res.status(200).json({success: true, id: req.body.id});
        } catch (err: any) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }
}

export default new VotesController();
