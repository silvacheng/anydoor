const { cache } = require('../config/defaultConfig');

function refreshRes(stats, res) {
  // 添加各种缓存机制
  const { maxAge, expires, cacheControl, lastModified, etag } = cache;
  if(expires) {
    res.setHeader('Expores', new Date(Date.now() + maxAge * 1000).toUTCString());
  }

  if(cacheControl) {
    res.setHeader('Cache-Control',`public, max-age=${maxAge}`);
  }

  if(lastModified) {
    res.setHeader('Last-Modified', stats.mtime.toUTCString());
  }

  if(etag) {
    res.setHeader('ETag', `${stats.size}-${stats.mtime}`);
  }
}

module.exports = function isFresh(stats, req, res) {
  refreshRes(stats, res);
  const lastModified = req.headers['if-modified-since'];
  const etag = req.hearders['if-none-match'];

  // 是否需要更新
  if(!lastModified && !etag) {
    return false;
  }

  if(lastModified && lastModified !== res.getHeader('Last-Modified')) {
    return false;
  }

  if(etag && etag !== res.getHeader('ETag')) {
    return false;
  }

  return true;
}