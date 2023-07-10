const PostmanService = require('../services/postman-service');

module.exports = new class PostmanController {
    requests = async (req, res) => {
        try {
            const variants = await PostmanService.getRequests();

            return res.status(200).json({
                success: true,
                data: variants
            });
        } catch (err) {
            return res.status(200).json({
                success: false,
                message: 'No data with requests'
            });
        }
    }
}
