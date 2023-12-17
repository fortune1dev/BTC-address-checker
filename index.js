const { BIP32Factory } = require('bip32');
const { ECPairFactory } = require('ecpair');
const bip39 = require('bip39');
const ecc = require('tiny-secp256k1');
const bitcoin = require('bitcoinjs-lib');
const fs = require('fs');

const ECPair = ECPairFactory(ecc);
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
    const mnemonic = bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeedSync(mnemonic);

    const root = bip32.fromSeed(seed);
    const child = root.derivePath("m/0'/0/0");
    const keyPair = ECPair.fromPrivateKey(child.privateKey);

    const address1 = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
    const address3 = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey }),
    });
    const addressbc1 = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey });

    process.stdout.write('Попытка ' + i++ + '\r');

    if (addr1.includes(address1) || addr3.includes(address3) || addrbc1.includes(addressbc1)) {
        console.table([child.toWIF(), address1.address, address3.address, addressbc1.address]);
        try {
            fs.appendFileSync(
                './log.txt',
                child.toWIF() + '\n' + address1.address + '\n' + address3.address + '\n' + addressbc1.address + '\n\n\n'
            );
        } catch (error) {
            console.error('Какая-то хуйня с записью файла!');
        }
    }
}

console.log('Why we are stoped?!?');

// function getAddress(node, network) {
//     return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address;
// }
