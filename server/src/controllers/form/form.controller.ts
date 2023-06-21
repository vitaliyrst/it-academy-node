import {Request, Response} from "express";
import FormService from "../../services/form/form.service";

class FormController {
    newForm!: string;
    form = async (req: Request, res: Response) => {
        try {
            const form = await FormService.getHtmlForm();
            return res.status(200).send(form);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Form doesn\'t exist'
            });
        }
    }

    submit = async (req: Request, res: Response) => {
        try {
            this.newForm = await FormService.validateForm(req.body);
            return res.status(200).send(this.newForm);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Form doesn\'t exist'
            });
        }
    }
}

export default new FormController();
