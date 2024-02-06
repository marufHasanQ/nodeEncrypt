import {encryptFile, decryptFile} from './util/util';


if (process.argv.length < 3) {
    console.error('Us');
}

const CLI_OPTION = process.argv[2];
const FILE_NAME_ARGUMENT = process.argv[3];

const password = prompt('password: ')
    .then((password) => nodeEncrypt(password));



function nodeEncrypt(password) {


    if (CLI_OPTION == '-en') {
        encryptFile(FILE_NAME_ARGUMENT, password)

    }
    else if (CLI_OPTION == '-de') {
        decryptFile(FILE_NAME_ARGUMENT, password)
    }

}


function prompt(question) {
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

