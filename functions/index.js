// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');
// const collection = require('firebase/firestore/collection');
// const doc = require('firebase/firestore/doc');
// const setDoc = require('firebase/firestore/setDoc');
const fs = require('fs').promises;
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");
const Web3 = require("web3");
const ethers = require("ethers");

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');


admin.initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await admin.firestore().collection('messages').add({original: original, adding: original});
  // Send back a message that we've successfully written the message
  res.json({result: `Message with ID: ${writeResult.id} added.`});
});

// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
    .onCreate((snap, context) => {
      // Grab the current value of what was written to Firestore.
      const original = snap.data().original;
      console.log(original);

      // Access the parameter `{documentId}` with `context.params`
      functions.logger.log('Uppercasing', context.params.documentId, original);
      
      const uppercase = original.toUpperCase();
      
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to Firestore.
      // Setting an 'uppercase' field in Firestore document returns a Promise.
      return snap.ref.set({uppercase}, {merge: true});
    });

exports.addAddress = functions.https.onRequest(async (req, res) => {
    const original = req.query.text;
    const writeResult = await admin.firestore().collection("ProofForAddress").add({address_hash: original});
    res.json({result: `Message with ID: ${writeResult.id}, containing address: ${original} added.`});
})

exports.generateHackerProof = functions.https.onRequest(async (req, res) => {
    const original = req.query.text;
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

    const merkleTreeHacker = new MerkleTree(getLeafNodes(addressesHacker), hash, { sortPairs: true });
    let hackerProof = merkleTreeHacker.getHexProof(ethers.utils.solidityKeccak256(["address"], [original]));

    
    res.writeResult = await admin.firestore().collection("HackerProof").add({address: original, hacker_proof: hackerProof});
    res.json({result: `Address: ${original} gives the corresponding ${hackerProof}`});
})

exports.generateGeneralProof = functions.https.onRequest(async (req, res) => {
    const original = req.query.text;
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

    const merkleTreeGeneral = new MerkleTree(getLeafNodes(addressesGeneral), hash, { sortPairs: true });
    let generalProof = merkleTreeGeneral.getHexProof(ethers.utils.solidityKeccak256(["address"], [original]));

    
    res.writeResult = await admin.firestore().collection("GeneralProof").add({address: original, genereal_proof: generalProof});
    res.json({result: `Address: ${original} gives the corresponding ${generalProof}`});
})

exports.generateTeamProof = functions.https.onRequest(async (req, res) => {
    const original = req.query.text;
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

    const merkleTreeTeam = new MerkleTree(getLeafNodes(addressesTeam), hash, { sortPairs: true });
    let TeamProof = merkleTreeTeam.getHexProof(ethers.utils.solidityKeccak256(["address"], [original]));

    
    res.writeResult = await admin.firestore().collection("TeamProof").add({address: original, team_proof: teamProof});
    res.json({result: `Address: ${original} gives the corresponding ${teamProof}`});
})

exports.generateSpeakerProof = functions.https.onRequest(async (req, res) => {
    const original = req.query.text;
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

    const merkleTreeSpeaker = new MerkleTree(getLeafNodes(addressesSpeaker), hash, { sortPairs: true });
    let speakerProof = merkleTreeSpeaker.getHexProof(ethers.utils.solidityKeccak256(["address"], [original]));

    
    res.writeResult = await admin.firestore().collection("SpeakerProof").add({address: original, speaker_proof: speakerProof});
    res.json({result: `Address: ${original} gives the corresponding ${speakerProof}}`});
})

exports.generateProof = functions.firestore.document('/ProofForAddress/{documentId}')
    .onCreate((snap, context) => {
        const original = snap.data().address_hash;
        console.log(original);

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

        const merkleTreeHacker = new MerkleTree(getLeafNodes(addressesHacker), hash, { sortPairs: true });
        const merkleTreeGeneral = new MerkleTree(getLeafNodes(addressesGeneral), hash, { sortPairs: true });
        const merkleTreeTeam = new MerkleTree(getLeafNodes(addressesTeam), hash, { sortPairs: true });
        const merkleTreeSpeaker = new MerkleTree(getLeafNodes(addressesSpeaker), hash, { sortPairs: true });
        

        // const hackerRoot =  '0xc86420832ca89919dc2fd63fe0378bbc38949879ad9eff30e13468bcc63d7082';
        // const generalRoot = '0x1bde607e02ccf93380f2be87114d306ae1b38d2f771a4ac726f9296458af8780';
        // const teamRoot = '0x0645de9393e0594c5d27e7cda1e49ffde941f44d29673da65dfedaa4830b9597';
        // const speakerRoot = '0xba15643deba89feec17edc1ddde3038f13a7b39444f4a9205d2ff954d8d9fa39'

        let hackerProof = merkleTreeHacker.getHexProof(ethers.utils.solidityKeccak256(["address"], [original]));
        let generalProof = merkleTreeGeneral.getHexProof(ethers.utils.solidityKeccak256(["address"], [original]));
        let teamProof = merkleTreeTeam.getHexProof(ethers.utils.solidityKeccak256(["address"], [original]));
        let speakerProof = merkleTreeSpeaker.getHexProof(ethers.utils.solidityKeccak256(["address"], [original]));
        
        console.log(hackerProof);
        console.log("verify: " + tree.verify(proof, leaf, root)) 

        functions.logger.log('Hacker Proof', context.params.documentId, original);
        return snap.ref.set({hackerProof}, {merge: true});
    })


function hash(x) {
    return ethers.utils.solidityKeccak256(["address"], [x]);
}

function getLeafNodes(addresses) {
    return addresses.map((addr) =>
        hash(addr)
    );
}