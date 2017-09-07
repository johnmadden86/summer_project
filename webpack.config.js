module.exports = {
  entry: './models/trainer-store.js',
  node: {
    fs: 'empty',
  },
  output: {
    filename: './public/scripts/bundle.js',
  },
};
