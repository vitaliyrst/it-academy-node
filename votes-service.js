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

    parseFile = async () => {
        const data = await this.getFile();
        return JSON.parse(data);
    }

    writeFile = async (path, votes) => {
        await fs.writeFile(path, JSON.stringify(votes));
    }

    getVariants = async () => {
        const variants = await this.parseFile();

        return variants.map(item => {
            return {
                id: item.id,
                name: item.name
            }
        });
    }

    getStats = async () => {
        const variants = await this.parseFile();

        return variants.map(item => {
            return {
                id: item.id,
                count: item.count
            }
        });
    }

    setVote = async (id) => {
        const variants = await this.parseFile();
        const vote = variants.find(item => +item.id === +id);

        if (!vote) {
            throw new Error('This code doesn\'t exist');
        } else {
            vote.count += 1;
        }

        const directory = await this.getDirectory();
        await this.writeFile(directory + '/votes.json', variants);

        return true;
    }

    getJSONReport = async () => {
        return await this.getFile();
    }

    getXMLReport = async () => {
        const variants = await this.parseFile();
        let data = `<?xml version="1.0" encoding="UTF-8"?>`;
        data += `<Variants>`;

        variants.forEach(variant => {
            data += `<Variant>
                        <Id>Id: ${variant.id}</Id>
                        <Name>Name: ${variant.name}</Name>
                        <Count>Count: ${variant.count}</Count>
                     </Variant>`;
        });

        data += `</Variants>`

        return data;
    }

    getHTMLReport = async () => {
        const variants = await this.parseFile();
        let data = `<div style="display: flex; flex-direction: column; gap: 20px">`;

        variants.forEach(variant => {
            data += `<div style="display: flex; gap: 12px">
                        <div>Id: ${variant.id}</div>
                        <div>Name: ${variant.name}</div>
                        <div>Count: ${variant.count}</div>
                     </div>`;
        });

        data += `</div>`

        return data;
    }
}
