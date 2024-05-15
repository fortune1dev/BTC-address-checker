const { BIP32Factory } = require('bip32');
const bip39 = require('bip39');
const ecc = require('tiny-secp256k1');
const bitcoin = require('bitcoinjs-lib');
const fs = require('fs');

const bip32 = BIP32Factory(ecc);

console.log('Start');
console.log('Read files...');

const addr1 = fs
    .readFileSync('./files/addr1.csv')
    .toString() // convert Buffer to string
    .split('\n') // split string to lines
    .map((e) => e.trim()); // remove white spaces for each line

const addr3 = fs
    .readFileSync('./files/addr3.csv')
    .toString() // convert Buffer to string
    .split('\n') // split string to lines
    .map((e) => e.trim()); // remove white spaces for each line

const addrbc1 = fs
    .readFileSync('./files/addrbc1.csv')
    .toString() // convert Buffer to string
    .split('\n') // split string to lines
    .map((e) => e.trim()); // remove white spaces for each line

console.log('Searching in progress... enjoy!');

let i = 0;
while (true) {
    process.stdout.write('Попытка ' + i++ + '\r');

    const mnemonic = bip39.generateMnemonic();
    // const mnemonic = "ВСТАВИТЬ СЮДА ГОТОВУЮ МНЕМОНИКУ, А ВЕРХНЮЮ СТРОЧКУ ЗАКОММЕНИТТЬ";
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed);

    for (let index = 0; index < 10; index++) {
        {
            const path = root.derivePath("m/0'/0/" + index);
            const address1 = bitcoin.payments.p2pkh({ pubkey: path.publicKey });

            if (addr1.includes(address1.address)) {
                console.table([root.toWIF().toString(), address1.address]);
                try {
                    fs.appendFileSync(
                        './log.txt',
                        mnemonic +
                        '\n' +
                        root.toWIF().toString() +
                        '\n' +
                        address1.address +
                        '\n\n\n'
                    );
                } catch (error) {
                    console.error('Какая-то хуйня с записью файла!');
                }
            }
        }

        {
            const path = root.derivePath("m/44'/0'/0'/0/" + index);

            const address1 = bitcoin.payments.p2pkh({ pubkey: path.publicKey });

            if (addr1.includes(address1.address)) {
                console.table([root.toWIF().toString(), address1.address]);
                try {
                    fs.appendFileSync(
                        './log.txt',
                        mnemonic +
                        '\n' +
                        root.toWIF().toString() +
                        '\n' +
                        address1.address +
                        '\n\n\n'
                    );
                } catch (error) {
                    console.error('Какая-то хуйня с записью файла!');
                }
            }
        }

        {
            const path = root.derivePath("m/49'/0'/0'/0/" + index);

            const address3 = bitcoin.payments.p2sh({
                redeem: bitcoin.payments.p2wpkh({ pubkey: path.publicKey }),
            });

            if (addr3.includes(address3.address)) {
                console.table([root.toWIF().toString(), address3.address]);
                try {
                    fs.appendFileSync(
                        './log.txt',
                        mnemonic +
                        '\n' +
                        root.toWIF().toString() +
                        '\n' +
                        address3.address +
                        '\n\n\n'
                    );
                } catch (error) {
                    console.error('Какая-то хуйня с записью файла!');
                }
            }
        }

        {
            const path = root.derivePath("m/84'/0'/0'/0/" + index);

            const addressbc1 = bitcoin.payments.p2wpkh({ pubkey: path.publicKey });

            if (addrbc1.includes(addressbc1.address)) {
                console.table([root.toWIF().toString(), addressbc1.address]);
                try {
                    fs.appendFileSync(
                        './log.txt',
                        mnemonic +
                        '\n' +
                        root.toWIF().toString() +
                        '\n' +
                        addressbc1.address +
                        '\n\n\n'
                    );
                } catch (error) {
                    console.error('Какая-то хуйня с записью файла!');
                }
            }
        }
    }
}

console.log('Why we are stoped?!?');
