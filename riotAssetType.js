const {Asset} = require('parcel-bundler');
const JSAssetLib = require('parcel-bundler/lib/assets/JSAsset')
const JSAssetSrc = require('parcel-bundler/src/assets/JSAsset')

const JSAsset = parseInt(process.versions.node, 10) < 8 ? JSAssetLib : JSAssetSrc
const riot = require("riot-compiler")

class RiotAsset extends JSAsset {
  async parse(code) {
    let config = this.package.riot ||
      (await this.getConfig(['.riotrc', '.riotrc.js'])) ||
      {}

    let transpiled = riot.compile(
      code,
      Object.assign({sourcemap: this.options.sourceMap}, config),
      this.relativeName
    )

    transpiled.code = "var riot = require('riot');\n" + transpiled.code

    if (transpiled.sourcemap) {
      this.sourceMap = transpiled.sourcemap.generate()
      this.sourceMap.sources = [this.relativeName]
      this.sourceMap.sourcesContent = [this.contents]
    }

    this.contents = this.options.sourceMaps ? transpiled.code : transpiled;

    return await JSAsset.prototype.parse.call(this, this.contents);
  }
}

module.exports = RiotAsset
