const path = require('path');
const fsSync = require('fs');
const fs = require('fs/promises');
const axios = require('axios');

module.exports = new class PostmanService {

    log = async (data, url = '') => {
        const directory = path.join(process.cwd(), 'src', 'files');
        const date = new Date().toUTCString();
        const urlInfo = url ? 'URL ' + url + ' ||' : '';
        await fs.appendFile(
            directory + '/log.txt',
            date + ' || ' + urlInfo + ' ' + data + '\n'
        );
    }

    getFile = async (name) => {
        const directory = path.join(process.cwd(), 'src', 'files');

        try {
            return JSON.parse(await fs.readFile(directory + `/${name}`, 'utf-8'));
        } catch (e) {
            if (!fsSync.existsSync(directory)) {
                await fs.mkdir(directory);
                await this.writeFile(directory + `/${name}`, []);
            }

            return JSON.parse(await fs.readFile(directory + `/${name}`, 'utf-8'));
        }
    }

    writeFile = async (path, requests) => {
        await fs.writeFile(path, JSON.stringify(requests));
    }

    getRequests = () => {
        return this.getFile('requests.json');
    }

    doRequest = async (data) => {
        const {url, method, headers, body} = data;

        try {
            const response = await axios.request({
                method: method,
                url: url,
                headers: headers,
                body: body
            });

            return {
                data: response.data,
                headers: response.headers,
                status: response.status,
                statusText: response.statusText,
                config: response.config
            };
        } catch (e) {
            await this.log(e, url);

            if (e.code === 'ECONNREFUSED') {
                throw new Error('Could not send request');
            }

            if (e.response) {
                return {
                    status: e.response.status,
                    headers: e.response.headers,
                    data: e.response.data,
                    body: e.response.body
                };
            }

            throw new Error('Could not send request');
        }
    }

    createRequest = async (data) => {
        const requests = await this.getFile('requests.json');
        const request = requests.find(req => req.id === data.id);

        if (request) {
            const index = requests.findIndex(req => req.id === data.id);
            requests.splice(index, 1, data);
        } else {
            const lastIndex = requests.length;
            data.id = lastIndex + 1;
            requests.push(data);
        }

        const directory = path.join(process.cwd(), 'src', 'files');
        await this.writeFile(directory + '/requests.json', requests);

        return data;
    }

    deleteRequest = async (id) => {
        const requests = await this.getFile('requests.json');
        const newRequests = requests.filter(req => req.id !== id);

        const directory = path.join(process.cwd(), 'src', 'files');
        await this.writeFile(directory + '/requests.json', newRequests);

        return id;
    }
}
