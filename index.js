const readline = require('readline');
const path = require('path');
const fs = require('fs/promises');
const zlib = require('zlib');
const {createReadStream, createWriteStream} = require('node:fs');
const os = require('os');

const colors = {
    white: '\x1b[0m',
    red: '\x1b[31m',
    magenta: '\x1b[35m',
    green: '\x1b[32m',
    yellow: '\x1b[33m'
}

let activeTasks = 0;
let tasksLimit = 1;
const filesToNeedCompress = [];
const fileList = [];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.write(`${colors.magenta}AutoCompressor${colors.white}\n`);

const ask = (prompt) => {
    return new Promise((resolve, reject) => {
        rl.question(prompt, (answer) => {
            resolve(answer);
        });
    });
}

const askPathToFolder = async () => {
    try {
        const folderPath = await ask(`${colors.yellow}Enter folder path:${colors.white}\n`);
        const stats = await fs.stat(folderPath);
        const isDir = stats.isDirectory();

        if (!isDir) {
            throw new Error(`This is not a folder, ${folderPath}`);
        } else {
            return folderPath;
        }
    } catch (error) {
        rl.write(`${colors.red}${error.message}${colors.white}\n`);
        return await askPathToFolder();
    }
}

const getAllFilesFromAllFolders = async (folderPath) => {
    try {
        const files = await fs.readdir(folderPath);

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const stat = await fs.stat(filePath);
            const isDir = stat.isDirectory()

            if (isDir) {
                await getAllFilesFromAllFolders(filePath, fileList);
            } else {
                fileList.push({
                    path: filePath,
                    stat: stat
                });
            }
        }
    } catch (error) {
        rl.write(`${colors.red}${error.message}${colors.white}\n`);
    }
}

const getFilesToNeedCompress = async (entryFiles) => {
    const nonArchivedFiles = entryFiles.filter(file => !file.path.endsWith('.gz')).map(file => file.path);
    let newFiles = 0;
    let modifiedFiles = 0;

    for (let entryFile of entryFiles) {
        if (entryFile.path.endsWith('.gz')) {
            const clearArchivedFilePath = entryFile.path.substring(0, entryFile.path.length - 3);

            if (nonArchivedFiles.includes(clearArchivedFilePath)) {
                const nonArchivedFile = entryFiles.find(item => item.path === clearArchivedFilePath);

                if (entryFile.stat.mtime < nonArchivedFile.stat.mtime) {
                    await fs.unlink(entryFile.path);
                    filesToNeedCompress.push(nonArchivedFile.path);
                    modifiedFiles++;
                }
            }
        } else {
            const archivedFile = entryFiles.find(item => item.path === entryFile.path + '.gz');

            if (!archivedFile) {
                filesToNeedCompress.push(entryFile.path);
                newFiles++;
            }
        }
    }

    return {newFiles, modifiedFiles};
}

const compressFile = (file) => {
    activeTasks++;
    rl.write(`${colors.yellow} Active tasks ${activeTasks}${colors.white}\n`);
    rl.write(`${colors.green}File ${colors.yellow}(${file})${colors.green} has ${colors.white}started ${colors.green}compressing.${colors.white}\n`);
    const inputFilePath = file;
    const outputFilePath = `${file}.gz`;
    const readStream = createReadStream(inputFilePath);
    const writeStream = createWriteStream(outputFilePath);
    const gzipStream = zlib.createGzip();

    readStream.pipe(gzipStream).pipe(writeStream);

    writeStream.on('finish', () => {
        rl.write(`${colors.green}File ${colors.yellow}(${file})${colors.green} has ${colors.magenta}finished ${colors.green}compressing.${colors.white}\n`);
        activeTasks--;

        if (filesToNeedCompress.length === 0 && activeTasks === 0) {
            readStream.destroy();
            writeStream.destroy();
            rl.write(`${colors.magenta}Compression completed.\n`);
            rl.close();
            process.exit(0);
            return;
        }

        checkTaskQueue();
    });

    writeStream.on('error', error => {
        rl.write(`${colors.red}${error.message}${colors.white}\n`);
        activeTasks--;
        checkTaskQueue();
    });
}

const checkTaskQueue = () => {
    if (filesToNeedCompress.length > 0 && activeTasks < tasksLimit) {
        const file = filesToNeedCompress.shift();
        compressFile(file);
    }
}

const init = async () => {
    const folderPath = await askPathToFolder();

    rl.write(`${colors.green}Directory scanning started...${colors.white}\n`);
    await getAllFilesFromAllFolders(folderPath);
    const {newFiles, modifiedFiles} = await getFilesToNeedCompress(fileList);

    let message = `${colors.green}Found ${colors.yellow}${filesToNeedCompress.length}${colors.green} files: `;
    message += `${colors.yellow}${newFiles}${colors.green} new files, `;
    message += `${colors.yellow}${modifiedFiles}${colors.green} were modified.\n`;
    rl.write(message);

    if (filesToNeedCompress.length) {
        const cores = os.cpus().length;
        rl.write(`${colors.green}You have ${colors.yellow}${cores} cores${colors.green}, set the simultaneous compression.${colors.white}\n`);

        tasksLimit = cores;

        rl.write(`${colors.green}Start compressing...${colors.white}\n`)

        for (let i = 0; i < tasksLimit; i++) {
            await checkTaskQueue();
        }
    } else {
        rl.write(`${colors.magenta}No new files found to compress.\n`);
        rl.close();
        process.exit(0);
    }
}

init();
