module.export = function (bundler) {
  bundler.addAssetType('tag', require.resolve('./riotAssetType'))
}
