const WriterManager = artifacts.require('WriterManager')
const Writer = artifacts.require('Writer')
const Base58 = require('base-58')

contract('WriterManager', (accounts) => {
  let writerManager
  const ipfsHash = 'QmNXnCWPS2szLaQGVA6TFtiUAJB2YnFTJJFTXPGuc4wocQ'
  
  beforeEach(async () => {
    writerManager = await WriterManager.new({
      from: accounts[0],
    })
  })

  it('should have an owner', async () => {
    const owner = await writerManager.owner()
    assert.isTrue(owner !== 0)
  })

  it('it is allowed to create writer', async () => {
    await writerManager.createNewWriter(accounts[1], { from: accounts[1] })
    const result = await writerManager.isWriter(accounts[1], { from: accounts[1] })
    assert.isTrue(result)
  })

  it('is writer function is workable', async() => {
    const result = await writerManager.isWriter(accounts[1], { from: accounts[1] })
    assert.isFalse(result)
  })

  it('throw exception if we try to add article to invalid writer', async() => {
    try {
      await writerManager.createNewPost(ipfsHash, { from: accounts[1] })
      assert.fail('Should throw an error')
    } catch (error) {
      assert.isAbove(
        error.message.search('revert'),
        -1,
      )
    }
  })

  it('it is allowed to add article', async() => {
    await writerManager.createNewWriter(accounts[1], { from: accounts[1] })
    const unit8Array = fromIPFShash(ipfsHash)
    const hex = Buffer.from(unit8Array).toString('hex')
    const transaction = await writerManager.createNewPost(`0x${hex}`, { from: accounts[1] })
    assert.isTrue(transaction.logs[0].event === 'NewPostCreated')
    
    const recoverHash = toIPFShash(transaction.logs[0].args.ipfsHash)
    assert.equal(recoverHash, ipfsHash)
  })

  it('it is allowed to add article by manager', async() => {
    await writerManager.createNewWriter(accounts[1], { from: accounts[0] })
    const unit8Array = fromIPFShash(ipfsHash)
    const hex = Buffer.from(unit8Array).toString('hex')
    const transaction = await writerManager.createNewPostByManager(`0x${hex}`, accounts[1],{ from: accounts[0] })
    assert.isTrue(transaction.logs[0].event === 'NewPostCreated')
    
    const recoverHash = toIPFShash(transaction.logs[0].args.ipfsHash)
    assert.equal(recoverHash, ipfsHash)
  })

  const fromIPFShash = (hash) => {
    const bytes = Base58.decode(hash)
    const multiHashId = 2
    return bytes.slice(multiHashId, bytes.length)
  }

  const toIPFShash = (hex) => {
    const remove0x = hex.slice(2, hex.length)
    const bytes = Buffer.from(`1220${remove0x}`, "hex");
    const hash = Base58.encode(bytes);
    return hash;
  }
})
