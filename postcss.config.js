module.exports = {
  plugins: {
    autoprefixer: {
      // browsers: ['Android >= 4.0', 'iOS >= 7']
    },
    // 'postcss-px2rem-exclude': {
    //   remUnit: 37.5
    // }
    'postcss-px-to-viewport': {
      viewportWidth: 375,
      selectorBlackList: ['van-circle__layer'],
      exclude: [/element-ui/, /pc/],
      unitPrecision: 5,
      viewportUnit: 'vw',
      propList: ['*'],
      minPixelValue: 2,
      selectorBlackList:['van'],
      mediaQuery: false
    }

  }
}