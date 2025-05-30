// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.sourceExts.push('cjs');

// Desativa o uso experimental de exports em pacotes (opcional, conforme seu erro)
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;
