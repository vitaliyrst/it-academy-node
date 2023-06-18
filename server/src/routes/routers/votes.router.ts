import {Router} from "express";

const router: Router = Router();

router.get('/variants', (req, res) => {
    res.send('variants');
});

router.get('/stat', (req, res) => {
   res.send('stat')
});

router.post('/vote', (req, res) => {
    res.send(req);
});

export default router;
