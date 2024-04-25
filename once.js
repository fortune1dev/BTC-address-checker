const { BIP32Factory } = require('bip32');
const bip39 = require('bip39');
const ecc = require('tiny-secp256k1');
const bitcoin = require('bitcoinjs-lib');

const bip32 = BIP32Factory(ecc);

function getAddress(node) {
    return bitcoin.payments.p2pkh({ pubkey: node.publicKey }).address;
}


console.log('Start');
console.log("===================================================================================================");

// const mnemonic = bip39.generateMnemonic();
const mnemonic = 'impose alert rigid cloud monitor aunt case fancy empty siren stomach record';
const seed = bip39.mnemonicToSeedSync(mnemonic);
const root = bip32.fromSeed(seed);

console.log("Mnemonic:", mnemonic);
console.log("WIF address:", root.toWIF().toString());
console.log("Privat key (HEX notation):", root.privateKey.toString('hex'));

for (let index = 0; index < 10; index++) {
    console.log("===================================================================================================");

    {
        const path = root.derivePath("m/0'/0/" + index);
        const address1 = bitcoin.payments.p2pkh({ pubkey: path.publicKey });

        console.log("BIP32      address:", address1.address);
    }

    {
        const path = root.derivePath("m/44'/0'/0'/0/" + index);

        const address1 = bitcoin.payments.p2pkh({ pubkey: path.publicKey });

        console.log("address1   address:", address1.address);
    }

    {
        const path = root.derivePath("m/49'/0'/0'/0/" + index);

        const address3 = bitcoin.payments.p2sh({
            redeem: bitcoin.payments.p2wpkh({ pubkey: path.publicKey }),
        });

        console.log("address3   address:", address3.address);
    }

    {
        const path = root.derivePath("m/84'/0'/0'/0/" + index);

        const addressbc1 = bitcoin.payments.p2wpkh({ pubkey: path.publicKey });

        console.log("addressbc1 address:", addressbc1.address);
    }

    console.log("===================================================================================================");
}

console.log("Donce");