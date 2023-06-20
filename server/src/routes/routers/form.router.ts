import {Router} from "express";
import FormController from "../../controllers/form/form.controller";

const router: Router = Router();

router.get('/', FormController.form);
router.post('/submit', FormController.submit);

export default router;
