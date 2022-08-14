const presets = [
  [
    "@babel/env",
    {
      include: [
        'routes/**/index.js'
      ],
      targets: {
        node: "8",
      },
      useBuiltIns: "usage",
    },
  ],
];

module.exports = {
    presets: presets,
};