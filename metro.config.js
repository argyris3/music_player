const path = require('node:path')
const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)
const nodeVibrantBrowserEntry = path.resolve(
	path.dirname(require.resolve('node-vibrant/package.json')),
	'dist/esm/browser.js',
)

config.resolver.resolveRequest = (context, moduleName, platform) => {
	if (platform === 'web' && moduleName === 'node-vibrant/browser') {
		return context.resolveRequest(context, nodeVibrantBrowserEntry, platform)
	}

	return context.resolveRequest(context, moduleName, platform)
}

module.exports = config
