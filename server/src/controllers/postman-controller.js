const PostmanService = require('../services/postman-service');

module.exports = new class PostmanController {
    requests = async (req, res) => {
        try {
            const requests = await PostmanService.getRequests();
            res.setHeader('Cache-Control', 'no-cache');

            return res.status(200).json({
                success: true,
                data: requests
            });
        } catch (err) {
            return res.status(200).json({
                success: false,
                message: 'No data with requests'
            });
        }
    }

    doRequest = async (req, res) => {
        try {
            const result = await PostmanService.doRequest(req.body);
            return res.status(200).json(result);
        } catch (e) {
            return res.status(e.status || 400).send(e.message);
        }
    }

    createRequest = async (req, res) => {
        try {
            const newRequest = await PostmanService.createRequest(req.body);
            res.status(200).json(newRequest);
        } catch (e) {
            return res.status(400).send({
                success: false,
                message: e.message
            });
        }
    }

    deleteRequest = async (req, res) => {
        try {
            const id = await PostmanService.deleteRequest(req.body.id);
            res.status(200).json({id: id});
        } catch (e) {
            return res.status(400).send({
                success: false,
                message: e.message
            });
        }
    }
}
