class Collection extends Array {
  constructor(...items) {
    super(...items)
  }

  toJSON() {
    let output = this.map(item => {
      return item.toJSON()
    })

    return output
  }
}

module.exports = Collection
