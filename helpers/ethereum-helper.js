const keythereum = require('keythereum');
const config = require('../config')
const Web3 = require('web3')
const web3 = new Web3(`ws://${config.ethereum.host}:${config.ethereum.port}`)
const insiderManagerContract = require('../service/truffle/build/contracts/InsiderManager.json')
const insiderManager = new web3.eth.Contract(insiderManagerContract.abi, config.ethereum.contract.address)
const keystore = keythereum.importFromFile(config.ethereum.address, './')
const Base58 = require('base-58')

const callContractMethod = async (ctx, contractMethod, eventName, filter, account) => {

  //estimate gas
  const estimateGas = await contractMethod.estimateGas({
    from: account.address,
  })

  const txHash = {
    from: account.address,
    to: config.ethereum.contract.address,
    gas: estimateGas,
    data: contractMethod.encodeABI(),
    chainId: 15
  }

  // signed transaction
  const signedTxHash = await web3.eth.accounts.signTransaction(txHash, account.privateKey)

  // send transaction
  let transactionHash
  const receipt = await web3.eth
    .sendSignedTransaction(signedTxHash.rawTransaction)
    .on('transactionHash', hash => {
      transactionHash = hash
    })

  // Get event
  let events = []
  if (eventName !== undefined && filter !== undefined) {
    events = await insiderManager.getPastEvents(
      eventName,
      {
        filter: filter,
    })
  }

  events = events || []
  events.filter(event => event.transactionHash === transactionHash)

  if (events.length < 0) {
    return false
  }

  return events
}

const convertIpfsToByte32 = (ipfsHash) => {
  const bytes = Base58.decode(ipfsHash)
  const multiHashId = 2
  const uint8Array = bytes.slice(multiHashId, bytes.length)

  return '0x' + Buffer.from(uint8Array).toString('hex')
}

const convertByte32ToIpfs = (hex) => {
  const remove0x = hex.slice(2, hex.length)
  const bytes = Buffer.from(`1220${remove0x}`, "hex")
  const hash = Base58.encode(bytes)
  return hash
}

module.exports = {
  async registerNewWriter(ctx, address) {
    const createNewWriter = insiderManager.methods.createNewWriter(address)
    return callContractMethod(ctx, createNewWriter, 'NewWriterCreated', { newWriterAddress: address })
  },

  async createNewPost(ctx, ipfsHash, writer) {
    //TODO: solve keystore
    const createNewPost = insiderManager.methods.createNewPostByManager(convertIpfsToByte32(ipfsHash), writer)
    return callContractMethod(ctx, createNewPost, 'NewPostCreated', { ipfsHash: ipfsHash })
  },

  async getAllPost(ctx) {
    const getAllPost = insiderManager.methods.getAllPost(ctx.request.body.address)
    return callContractMethod(ctx, getAllPost, 'GetAllPost', { writerAddress: ctx.request.body.address })
  },

  async filterInvalidArticle(articles) {
    if (!(articles instanceof Array)) {
      if (await insiderManager.methods.isValidArticle(convertIpfsToByte32(articles.ipfs_hash)).call()) {
        return articles
      }

      return undefined
    }
    return articles.filter(async(article) => {
      return await insiderManager.methods.isValidArticle(convertIpfsToByte32(article.ipfs_hash)).call()
    })
  },
}
