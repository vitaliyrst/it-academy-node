import fs from "fs/promises";
import path from "path";
import cheerio from 'cheerio';
import {FormData} from "../../interfaces/form-data.interface";

class FormService {

    getHtmlForm = async () => {
        const directory = path.join(process.cwd(), 'src', 'views', 'form-with-validation');
        return await fs.readFile(directory + '/form.html', 'utf-8');
    }

    validateForm = async (formData: FormData) => {
        const errors: { [key: string]: string } = {};

        if (!formData.firstname) {
            errors.firstName = 'First Name is required';
        }

        if (!formData.lastname) {
            errors.lastName = 'Last Name is required';
        }

        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Invalid email address';
        }

        if (Object.keys(errors).length) {
            return this.formatForm(formData, errors);
        } else {
            return this.formatForm(formData, {});
        }
    };

    formatForm = async (formData: FormData, errors: { [key: string | number]: string } = {}) => {
        const file = cheerio.load(await this.getHtmlForm());

        if (Object.keys(errors).length) {
            file('input[name="firstname"]').attr('value', formData.firstname);
            file('input[name="lastname"]').attr('value', formData.lastname);
            file('input[name="email"]').attr('value', formData.email);

            Object.keys(errors).forEach(key => {
                const div = file(`<div>${errors[key]}</div>`);
                file('body').append(div);
            });

            return file.html();
        } else {
            file('input[name="firstname"]').attr('value', formData.firstname);
            file('input[name="lastname"]').attr('value', formData.lastname);
            file('input[name="email"]').attr('value', formData.email);

            Object.keys(formData).forEach(key => {
                const div = file(`<div>${formData[key]}</div>`);
                file('body').append(div);
            });

            return file.html();
        }
    }
}

export default new FormService();
