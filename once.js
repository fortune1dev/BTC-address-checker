const { BIP32Factory } = require('bip32');
const { ECPairFactory } = require('ecpair');
const bip39 = require('bip39');
const ecc = require('tiny-secp256k1');
const bitcoin = require('bitcoinjs-lib');
const fs = require('fs');

const ECPair = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);

console.log('Start');
console.log("===================================================================================================");

const mnemonic = bip39.generateMnemonic();
const seed = bip39.mnemonicToSeedSync(mnemonic);

const root = bip32.fromSeed(seed);
const child = root.derivePath("m/0'/0/0");
const keyPair = ECPair.fromPrivateKey(child.privateKey);

console.log("Mnemonic:", mnemonic);
console.log("WIF address:", child.toWIF());
console.log("Privat key (HEX notation):", child.privateKey.toString('hex'));

console.log("===================================================================================================");

const address1 = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
const address3 = bitcoin.payments.p2sh({
    redeem: bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey }),
});
const addressbc1 = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey });

console.log("address1   address:", address1.address);
console.log("address3   address:", address3.address);
console.log("addressbc1 address:", addressbc1.address);
console.log("===================================================================================================");
console.log("Donce");