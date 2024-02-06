
import * as fs from 'fs/promises'

function getFileContent(filePath: string): Promise<string> {

    let data: string = '';
    let fileHandle: fs.FileHandle;
    return new Promise((resolve, reject) =>
        fs.open(filePath)
            .then(fd => {
                fileHandle = fd;
                return fd.createReadStream();
            })
            .then(fileReadStream => {
                fileReadStream.on('data', chunk => data = data + chunk);
                fileReadStream.on('end', () => {
                    fileHandle.close();
                    resolve(data);
                })
            })
    )

}

function writeFileContent(filePath: string, content: string): Promise<string> {

    let fileHandle: fs.FileHandle;
    return new Promise((resolve, reject) =>
        fs.open(filePath, 'w')
            .then(fd => {
                fileHandle = fd;
                return fd.createWriteStream();
            })
            .then(fileWriteStream => {
                fileWriteStream.write(content);
                fileWriteStream.end();
                fileHandle.close();

                resolve(content);

            })
    )

}

export {getFileContent, writeFileContent}
