module.exports = {
  transform: {
    "\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/(?!(d3-shape|d3-path)).+\\.js$"],
  verbose: true,
};
