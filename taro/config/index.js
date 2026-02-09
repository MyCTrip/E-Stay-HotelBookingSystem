const config = {
  projectName: 'estay-taro',
  date: '2024-12-01',
  designWidth: 375,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [
    ['@tarojs/plugin-platform-weapp']
  ],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: 'react',
  frameworkExts: ['tsx', 'ts', 'jsx', 'js'],
  compiler: {
    type: 'webpack5',
    prebundle: {
      enable: false,
    },
  },
  cache: {
    enable: false,
  },
  defineConstants: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.TARO_ENV': JSON.stringify('weapp'),
  },
  mini: {
    pageCache: {
      enable: true,
    },
    optimizePackageSize: true,
    postcss: {
      pxtransform: {
        // 禁用 pxtransform，避免在当前构建链中出现 NaNpx
        enable: false,
      },
      cssModules: {
        // 禁用 cssModules，以便在小程序中使用全局类名（避免 class 名被哈希导致样式失效）
        enable: false,
        config: {
          namingPattern: 'module_[local]__[hash:base64:5]',
          generateScopedName: '[name]_[local]__[hash:base64:5]',
        },
      },
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: true,
        config: {
          namingPattern: 'module_[local]__[hash:base64:5]',
          generateScopedName: '[name]_[local]__[hash:base64:5]',
        },
      },
    },
  },
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
