const fs = require('fs').promises;
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");
const Web3 = require("web3");
const ethers = require("ethers");

const web3 = new Web3();

let addressesHacker = [
    '0x4A54e0624A893915a767401413759f578C40ab3b', //real 
    '0x4f764bdD3CE198418B5e2b500fB31119D59dA64C',
    '0x8DD7AE66082BB8743f5fa802985E764041DC77bC',
    '0x7C3711Fc870193FbbA61cAE71A9d8b36455B4F41',
    '0x5BA3dCf28ea9717C38Db49B3555B6103D7A7638C',
    '0xCDc5D8a8D6Ef6C2AD5C83249bF255746982BE6Cd',
    '0xFc5Ab66c44b8b49AA520FD69270CD340e01C7BcD',
    '0xDCCfCb09b43240974Bb5bd70897AEa41C429C6a2',
    '0x63D4306958aaE12A2a1fE40166B588B94290bd16',
    '0x4caF58b1497d665a5D4f6D364b23E8eD171763b8',
    '0xE4EcAb4E9C19D3C32339348FE2f44AF074Ad2c34'];
let addressesGeneral = [
    '0x0c5e854a30Ca7a8335051E29947486649f85E4e4', //real;
    '0x30AFF134D0460B929b12D498927DcbcF6bb5dCc6',
    '0x05163471D66FA952ec1139451a9554cD5884a311',
    '0x2cE8777aEA3E1C4FfF5df48dd4fBacc363aaf56b',
    '0xf065221A32007F44703951c52656E8be3838b96e',
    '0x73F1201b584D7133646607DA2c358617630e9371',
    '0x866f2212f68b4B6121749AC9a559CB7b2B8Cffb9',
    '0xfa01B253cDE1e3DC78A7D988d6C9F59232513eB5',
    '0xbA6d2a33f5aeC5324bdad7951fdD2bdD9F2ddf5E',
    '0x1FB0eeDAE16F10e1991B25934956809C3ce6686B',
    '0x177Fe44C12Af8865baDC6f6A56fFb1AE6E70172D'];
let addressesTeam = [
    '0x8e666Fe98cF29Ad42065C2632ccF90e54c21DFdc', //real
    '0xCe0daF0b53E0214E5E170fBbDF26cf8529Af08eF',
    '0x05f6519aE20843EaA2FA8882814AE90e446057aB',
    '0x3d0018a7893C5Da21419fca4fBE5619eC5f81617',
    '0x44042115cfd8E955f607753a94c331584ff3404f',
    '0xa46c6bf4F50C1EA2a28afBfB5Ea0800DF385d705',
    '0x1ae34834ef0bC35b5060BaE5bBEC9F3026f786b1',
    '0xFCDa211f0361D7c7014f09b5587042b35e58F8ec',
    '0xaA9e242521375A2509701Bb9FA75bE9Dc2677B05',
    '0x82eE3760530EC461689BbbAa399d20594512b8D9',
    '0xF71fde8Da133854E218177E5fBCa95139f96d323'];
let addressesSpeaker = [
    '0x0C1943158680Ad48cF6009B8A5840386063Db5d4',
    '0x6dCF8DF30C9d332Ba83bb2819EcB6c53a6A5db47',
    '0x32e1F79a7b4F1e2124bc61fC4f45d1bf6b8CBAc7',
    '0x6207f18C1B24bf7e3dbD697674c1E8B0BB2568Cf',
    '0x8351e365c8032Dd6bfC47296ECD2371d172B2272',
    '0xdc2d8A94C8324B92B8E494Fb65e0764446b10163',
    '0x5369faF46dC8663841f01ecb72BE407Ee9bae6f1',
    '0x6cF93FCC30E9db28F1490F491Ae522767948e866',
    '0xD246c157835288f356E624ca5a27f4E92447423c',
    '0xD628C89cdC6a9cB7102Bbb3976f45cD53BE541bc'];

// for (let index = 0; index < 10; index++) {
//     addressesHacker.push(web3.eth.accounts.create().address);
//     addressesGeneral.push(web3.eth.accounts.create().address);
//     addressesTeam.push(web3.eth.accounts.create().address);
//     addressesSpeaker.push(web3.eth.accounts.create().address);
// }

console.log(addressesHacker);
console.log(addressesGeneral);
console.log(addressesTeam);
console.log(addressesSpeaker);

fs.writeFile('addresses.json', JSON.stringify({
    addressesHacker: addressesHacker,
    addressesGeneral: addressesGeneral,
    addressesTeam: addressesTeam,
    addressesSpeaker: addressesSpeaker
}));

const merkleTreeHacker = new MerkleTree(getLeafNodes(addressesHacker), hash, { sortPairs: true });
const merkleTreeGeneral = new MerkleTree(getLeafNodes(addressesGeneral), hash, { sortPairs: true });
const merkleTreeTeam = new MerkleTree(getLeafNodes(addressesTeam), hash, { sortPairs: true });
const merkleTreeSpeaker = new MerkleTree(getLeafNodes(addressesSpeaker), hash, { sortPairs: true });

fs.writeFile('merkletree.json', JSON.stringify({
    treeHacker: merkleTreeHacker, 
    treeGeneral: merkleTreeGeneral,
    treeTeam: merkleTreeTeam, 
    treeSpeaker: merkleTreeSpeaker
}))

fs.writeFile('root.json', JSON.stringify({
    hackerRoot: merkleTreeHacker.getHexRoot(), 
    generalRoot: merkleTreeGeneral.getHexRoot(), 
    teamRoot: merkleTreeTeam.getHexRoot(), 
    speakerRoot: merkleTreeSpeaker.getHexRoot(), 
}));

// async function readAddresses() {
//     let data = await fs.readFile('./addresses.json', 'utf8');
//     data = JSON.parse(data);
//     addressesHacker = data["addressesHacker"];
//     addressesGeneral = data["addressesGeneral"];
//     addressesTeam = data["addressesTeam"];
//     addressesSpeaker = data["addressesSpeaker"];
// }

function callBack() {
    console.log("just a callback function!");
}

function hash(x) {
    return ethers.utils.solidityKeccak256(["address"], [x]);
}

function getLeafNodes(addresses) {
    return addresses.map((addr) =>
        hash(addr)
    );
}

async function main() {
    //await readAddresses();


    console.log("Hacker Merkle Root: " + merkleTreeHacker.getHexRoot());
    console.log("General Merkle Root: " + merkleTreeGeneral.getHexRoot());
    console.log("Team Merkle Root: " + merkleTreeTeam.getHexRoot());
    console.log("Speaker Merkle Root: " + merkleTreeSpeaker.getHexRoot());

    console.log("Hacker1 : " + addressesGeneral[0]);
    console.log("Proof for Hacker1: " + merkleTreeHacker.getHexProof(ethers.utils.solidityKeccak256(["address"], [addressesHacker[0]])));
}

main();