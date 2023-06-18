import {Router} from "express";

const router: Router = Router();

router.get('/variants', (req, res) => {
    res.status(200).json({success: true, data: 'variants'});
});

router.get('/stat', (req, res) => {
    res.status(200).json({success: true, data: 'stat'});
});

router.post('/vote', (req, res) => {
    res.send(req);
});

export default router;
