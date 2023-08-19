const fs = require('fs/promises');
const path = require('path');

const pathToFilesInfo = path.join(__dirname, 'files.json');
const pathToUpload = path.join(__dirname, 'upload');

module.exports = class FilesService {
    getFilePath = async (name) => {
        try {
            return path.join(pathToUpload, name);
        } catch (error) {
            throw error;
        }
    }

    getFilesInfo = async () => {
        try {
            const json = await fs.readFile(pathToFilesInfo, 'utf-8');
            return JSON.parse(json);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
        }
    }

    writeFileInfo = async (data) => {
        try {
            const json = await fs.readFile(pathToFilesInfo, 'utf-8');
            const files = JSON.parse(json);
            const sameIndex = files.findIndex(file => file.path === data.path);

            if (sameIndex !== -1) {
                files.splice(sameIndex, 1);
            }

            files.unshift(data);
            await fs.writeFile(pathToFilesInfo, JSON.stringify(files, null, 4));
        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.writeFile(pathToFilesInfo, JSON.stringify([data], null, 4));
            }
        }
    }
}
