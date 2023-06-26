const fsSync = require('fs');
const fs = require('fs/promises');
const path = require('path');

module.exports = class VotesService {

    getDirectory = async () => {
        const directory = path.join(process.cwd(), 'files');

        if (!fsSync.existsSync(directory)) {
            await fs.mkdir(directory);
        }

        return directory;
    }

    getFile = async () => {
        const directory = await this.getDirectory();

        if (!fsSync.existsSync(directory + '/votes.json')) {
            const votes = [
                {id: 1, count: 0, name: 'Action'},
                {id: 2, count: 0, name: 'Thriller'},
                {id: 3, count: 0, name: 'Horror'},
                {id: 4, count: 0, name: 'Drama'},
                {id: 5, count: 0, name: 'Comedy'}
            ];

            await this.writeFile(directory + '/votes.json', votes);
        }

        return await fs.readFile(directory + '/votes.json', 'utf-8');
    }

    writeFile = async (path, votes) => {
        await fs.writeFile(path, JSON.stringify(votes));
    }

    getVariants = async () => {
        const data = await this.getFile();
        const variants = JSON.parse(data);

        return variants.map(item => {
            return {
                id: item.id,
                name: item.name
            }
        });
    }

    getStats = async () => {
        const data = await this.getFile();
        const variants = JSON.parse(data);

        return variants.map(item => {
            return {
                id: item.id,
                count: item.count
            }
        });
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
