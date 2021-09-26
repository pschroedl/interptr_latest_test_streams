const plugins = [
  [
    'babel-plugin-direct-import',
    { modules: ['@material-ui/core', '@material-ui/icons'] },
  ],
];

module.exports = { plugins, presets: ["@babel/env", "@babel/preset-react"] };
