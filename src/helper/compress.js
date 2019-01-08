const {createGzip, createDeflate} = require('zlib');

module.exports = (rs, req, res) => {
  const acceptEncoding = req.headers['accept-encoding'];
  // 精确匹配单词边界 gzip5也不支持
  if(!acceptEncoding || !acceptEncoding.match(/\b(gzip|defalte)\b/)) {
    return rs;
  } else if(acceptEncoding.match(/\bgzip\b/)){
    res.setHeader('Content-Encoding', 'gzip');
    return rs.pipe(createGzip());
  }  else if(acceptEncoding.match(/\bdefalte\b/)){
    res.setHeader('Content-Encoding', 'defalte');
    return rs.pipe(createDeflate());
  } 

}