const JSAsset = require('parcel-bundler/lib/assets/JSAsset')

const riot = require("riot-compiler")

class RiotAsset extends JSAsset {
  async getRiotConfig () {
    if (this.package.riot) return this.package.riot

    return await super.getConfig([ '.riotrc', '.riotrc.js' ])
  }

  async parse(tag) {
    const config = (await this.getRiotConfig()) || { }

    const compiled = riot.compile(tag,
      Object.assign({ sourcemap: this.options.sourceMap }, config),
      this.relativeName
    )

    this.contents = this.options.sourceMap
      ? compiled.code
      : compiled

    if (compiled.sourcemap) {
      this.sourceMap = compiled.sourcemap.generate()
      this.sourceMap.sources = [this.relativeName]
      this.sourceMap.sourcesContent = [this.contents]
    }

    return await super.parse(this.contents)
  }
}

module.exports = RiotAsset
