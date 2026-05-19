const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project and workspace roots
const projectRoot = __dirname;
// In this case, the workspace root is the parent of 'apps'
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro resolve modules from both the package and the workspace node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Force Metro to resolve (sub)dependencies only from the `node_modules` of their own package.
// This is needed for standard monorepos.
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
