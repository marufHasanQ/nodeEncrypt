import {encryptFile, decryptFile} from './util/util';


if (process.argv.length < 4) {
    throw ('missing arguments : ' + process.argv);
}

const CLI_OPTION = process.argv[2];
const FILE_NAME_ARRAY = process.argv.slice(3);


const password = prompt('password: ')
    .then((password: string) => {

        nodeEncrypt(password, FILE_NAME_ARRAY)
    });



function nodeEncrypt(password: string, FILE_NAME_ARRAY: string[]) {

    FILE_NAME_ARRAY.forEach(v => nodeEncryptSingleFile(v, password));
}

function nodeEncryptSingleFile(filePath: string, password: string) {


    if (CLI_OPTION == '-en') {
        encryptFile(filePath, password)

    }
    else if (CLI_OPTION == '-de') {
        decryptFile(filePath, password)
    }

}


function prompt(question: string): Promise<string> {
    let data = '';
    return new Promise((resolve, reject) => {
        process.stdin.resume();
        process.stdout.write(question);

        //process.stdin.on('data', chunk => data = data + chunk);
        process.stdin.on('data', (data) => {process.stdin.pause(); resolve(data.toString().trim())})
        process.stdin.on('error', err => reject(err));
    });
}

/*
function hexToBuffer(hexString: string): ArrayBuffer {
    // return new Uint8Array('AA5504B10000B5'.match(/../g).map(h => parseInt(h, IV_BYTE_SIZE))).buffer;
}
*/

