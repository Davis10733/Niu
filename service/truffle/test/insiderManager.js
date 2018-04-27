const InsiderManager = artifacts.require('InsiderManager')
const Writer = artifacts.require('Writer')
const Base58 = require('base-58')

contract('InsiderManager', (accounts) => {
  let insiderManager
  const ipfsHash = 'QmNXnCWPS2szLaQGVA6TFtiUAJB2YnFTJJFTXPGuc4wocQ'
  
  beforeEach(async () => {
    insiderManager = await InsiderManager.new({
      from: accounts[0],
    })
  })

  it('should have an owner', async () => {
    const owner = await insiderManager.owner()
    assert.isTrue(owner !== 0)
  })

  it('it is allowed to create writer', async () => {
    await insiderManager.createNewWriter(accounts[1], { from: accounts[1] })
    const result = await insiderManager.isWriter(accounts[1], { from: accounts[1] })
    assert.isTrue(result)
  })

  it('is writer function is workable', async() => {
    const result = await insiderManager.isWriter(accounts[1], { from: accounts[1] })
    assert.isFalse(result)
  })

  it('throw exception if we try to add article from invalid writer', async() => {
    try {
      await insiderManager.createNewPost(ipfsHash, { from: accounts[1] })
      assert.fail('Should throw an error')
    } catch (error) {
      assert.isAbove(
        error.message.search('revert'),
        -1,
      )
    }
  })

  it('it is allowed to add article', async() => {
    await insiderManager.createNewWriter(accounts[1], { from: accounts[1] })
    const unit8Array = fromIPFShash(ipfsHash)
    const hex = Buffer.from(unit8Array).toString('hex')
    const transaction = await insiderManager.createNewPost(`0x${hex}`, { from: accounts[1] })
    assert.isTrue(transaction.logs[0].event === 'NewPostCreated')
    
    const recoverHash = toIPFShash(transaction.logs[0].args.ipfsHash)
    assert.equal(recoverHash, ipfsHash)
  })

  it('it is allowed to add article by manager', async() => {
    await insiderManager.createNewWriter(accounts[1], { from: accounts[0] })
    const unit8Array = fromIPFShash(ipfsHash)
    const hex = Buffer.from(unit8Array).toString('hex')
    const transaction = await insiderManager.createNewPostByManager(`0x${hex}`, accounts[1],{ from: accounts[0] })
    assert.isTrue(transaction.logs[0].event === 'NewPostCreated')
    
    const recoverHash = toIPFShash(transaction.logs[0].args.ipfsHash)
    assert.equal(recoverHash, ipfsHash)
  })

  it('isValidArticle function is workable', async() => {
    await insiderManager.createNewWriter(accounts[1], { from: accounts[0] })
    const unit8Array = fromIPFShash(ipfsHash)
    const hex = Buffer.from(unit8Array).toString('hex')
    await insiderManager.createNewPostByManager(`0x${hex}`, accounts[1],{ from: accounts[0] })
    
    let result = await insiderManager.isValidArticle(`0x${hex}`)
    assert.isTrue(result)

    result = await insiderManager.isValidArticle(`0x34222`)
    assert.isFalse(result)
  })

  const fromIPFShash = (hash) => {
    const bytes = Base58.decode(hash)
    const multiHashId = 2
    return bytes.slice(multiHashId, bytes.length)
  }

  const toIPFShash = (hex) => {
    const remove0x = hex.slice(2, hex.length)
    const bytes = Buffer.from(`1220${remove0x}`, "hex")
    const hash = Base58.encode(bytes)
    return hash
  }
})
