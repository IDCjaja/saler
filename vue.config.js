const BASE_URL = process.env.NODE_ENV === "productiojn" ? "/real_estates" : "/";

module.exports = {
  devServer: {
    proxy: {
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    }
  }
};
