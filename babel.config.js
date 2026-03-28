module.exports = function (api) {
  const isTest = process.env.NODE_ENV === 'test';
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@stores': './src/stores',
            '@services': './src/services',
            '@theme': './src/theme',
            '@hooks': './src/hooks',
            '@types': './src/types',
          },
        },
      ],
    ],
  };
};
