const path = require('path');
const fsSync = require('fs');
const fs = require('fs/promises');

module.exports = new class PostmanService {

    getFile = async () => {
        const directory = path.join(process.cwd(), 'src', 'files');

        try {
            return await fs.readFile(directory + '/requests.json', 'utf-8');
        } catch (e) {
            if (!fsSync.existsSync(directory)) {
                await fs.mkdir(directory);
            }

            if (!fsSync.existsSync(directory + '/requests.json')) {
                await this.writeFile(directory + '/requests.json', []);
            }

            return await fs.readFile(directory + '/requests.json', 'utf-8');
        }
    }

    writeFile = async (path, requests) => {
        await fs.writeFile(path, JSON.stringify(requests));
    }

    getRequests = async () => {
        const data = await this.getFile();
        return JSON.parse(data);
    }

    setVote = async (id) => {
        const data = await this.getFile();
        const votes = JSON.parse(data);
        const vote = votes.find(item => +item.id === +id);

        if (!vote) {
            throw new Error('This code doesn\'t exist');
        } else {
            vote.count += 1;
        }

        const directory = await this.getDirectory();
        await this.writeFile(directory + '/votes.json', votes);

        return true;
    }
}
