module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@/': './src/',
            '@/components': './src/components',
            '@/stores': './src/stores',
            '@/services': './src/services',
            '@/theme': './src/theme',
            '@/hooks': './src/hooks',
            '@/types': './src/types',
            '@/utils': './src/utils',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
