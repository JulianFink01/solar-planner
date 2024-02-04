module.exports = {
  preset: 'react-native',
  setupFiles: ["@shopify/react-native-skia/jestSetup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|react-native.*|@react-native.*|@?react-navigation.*|@shopify/react-native-skia)/)"
  ]
};
