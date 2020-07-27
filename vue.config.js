const BASE_URL = process.env.NODE_ENV === 'productiojn' ? '/real_estate' : '/'

module.exports = {
  devServer: {
    proxy: {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
  },
}


