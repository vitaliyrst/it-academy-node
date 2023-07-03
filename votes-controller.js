const votesService = require('./votes-service');
const VotesService = new votesService();

module.exports = class VotesController {

    variants = async (req, res) => {
        try {
            const variants = await VotesService.getVariants();
            return res.status(200).json({
                success: true,
                data: variants
            });
        } catch (err) {
            return res.status(200).json({
                success: false,
                message: 'No data with variants'
            });
        }
    }

    stats = async (req, res) => {
        try {
            const stats = await VotesService.getStats();
            return res.status(200).json({
                success: true,
                data: stats
            });
        } catch (err) {
            return res.status(200).json({
                success: false,
                message: 'No data with stats'
            });
        }
    }

    vote = async (req, res) => {
        try {
            await VotesService.setVote(req.body.id);
            return res.status(200).json({success: true, id: req.body.id});
        } catch (err) {
            return res.status(200).json({
                success: false,
                message: err.message
            });
        }
    }

    reports = async (req, res) => {
        try {
            const accept = req.headers['accept'];

            if (accept === 'text/html') {
                res.header('Content-Type', 'text/html');
                res.status(200).send(await VotesService.getHTMLReport());
            } else if (accept === 'application/xml') {
                res.header('Content-Type', 'application/xml');
                res.status(200).send(await VotesService.getXMLReport());
            } else {
                res.header('Content-Type', 'application/json');
                res.status(200).send(await VotesService.getJSONReport());
            }
        } catch (err) {
            return res.status(200).json({
                success: false,
                message: err.message
            });
        }
    }
}
