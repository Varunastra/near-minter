import * as nearAPI from "near-api-js";

const MINT_CONTRACT = "mara-smartcontract.near";

const MINT_METHOD = "add_whitelist_account";

const ACCOUNT = "hailrake.near";

// const MINT_PRICE = 15.01523 * Math.pow(10, 24);

const GAS = 40_000_000_000_000;

const MINT_ARGS = {
  "account": "hailrake.near"
};

const PRIVATE_KEY = "";

const keyStore = new nearAPI.keyStores.InMemoryKeyStore();
const keyPair = nearAPI.KeyPair.fromString(PRIVATE_KEY);

await keyStore.setKey("mainnet", ACCOUNT, keyPair);

const config = {
  networkId: "mainnet",
  keyStore,
  nodeUrl: "https://rpc.mainnet.near.org",
  walletUrl: "https://wallet.mainnet.near.org",
  helperUrl: "https://helper.mainnet.near.org",
  explorerUrl: "https://explorer.mainnet.near.org",
};

const near = await nearAPI.connect(config);

const account = await near.account(ACCOUNT);

const contract = new nearAPI.Contract(
    account, // the account object that is connecting
    MINT_CONTRACT,
    {
      // name of contract you're connecting to
      viewMethods: [], // view methods do not change state but usually return a value
      changeMethods: [MINT_METHOD], // change methods modify state
      sender: account, // account object to initialize and sign transactions.
    },
);

try {
  const result = await contract[MINT_METHOD]({
      args: MINT_ARGS,
      // amount: MINT_PRICE ? MINT_PRICE.toString() : undefined,
      gas: GAS.toString(),
  });
  console.log(result);
} catch(e) {
  console.log(e);
}

// const response = await near.connection.provider.query({
//     request_type: "view_code",
//     finality: "final",
//     account_id: "paras-token-v2.testnet",
// });

// console.log(response);

// function asciiToBinary(str) {
//     return Buffer.from(str, 'base64').toString('binary');
// }

// function decode(encoded) {
//     var binaryString = asciiToBinary(encoded);
//     var bytes = new Uint8Array(binaryString.length);
//     console.log(bytes);
//     for (var i = 0; i < binaryString.length; i++) {
//         bytes[i] = binaryString.charCodeAt(i);
//     }
//     return bytes.buffer;
// }


// fs.writeFileSync("contract.wasm", Buffer.from(decode(response.code_base64)));
