import * as nearAPI from "near-api-js";
import fs from "fs";
import { exec } from "child_process";

const MINT_CONTRACT = "mara-smartcontract.near";

const PRIVATE_KEY = "";

const keyStore = new nearAPI.keyStores.InMemoryKeyStore();
const keyPair = nearAPI.KeyPair.fromString(PRIVATE_KEY);

await keyStore.setKey("mainnet", "6cceb973c45dbe8742b6f177a79589d45630ba56691791097687782198b8e9c8", keyPair);

const config = {
  networkId: "mainnet",
  keyStore,
  nodeUrl: "https://rpc.mainnet.near.org",
  walletUrl: "https://wallet.mainnet.near.org",
  helperUrl: "https://helper.mainnet.near.org",
  explorerUrl: "https://explorer.mainnet.near.org",
};

const near = await nearAPI.connect(config);

const response = await near.connection.provider.query({
    request_type: "view_code",
    finality: "final",
    account_id: MINT_CONTRACT,
});

function asciiToBinary(str) {
    return Buffer.from(str, 'base64').toString('binary');
}

function decode(encoded) {
    var binaryString = asciiToBinary(encoded);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return Buffer.from(bytes.buffer);
}


fs.writeFileSync("contract.wasm", decode(response.code_base64));

exec("wasm2wat.exe -o contract.out contract.wasm", (err) => {
    if (err) {
        console.log(err);
    }
});