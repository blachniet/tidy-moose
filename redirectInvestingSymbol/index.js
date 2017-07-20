const https = require('https')
    , querystring = require('querystring');

/**
 * Find the Investing.com URL for an equity/fund from a symbol.
 * 
 * @param {string} symbol Exchange symbol
 * @param {Function} callback Function to be called when complete.
 */
function findURLBySymbol(symbol, callback) {
  symbol = symbol.toLowerCase();
  const postData = querystring.stringify({
    'search_text': symbol,
    'term': symbol,
    'country_id': '5',
    'tab_id': 'All',
  });

  const req = https.request({
      host: 'www.investing.com',
      path: '/search/service/search',
      method: 'post',
      headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData),
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json, text/javascript, */*; q=0.01',
      }
  }, (res) => {
    var found = false;
    res.setEncoding('utf8');

    res.on('data', (chunk) => {
      JSON.parse(chunk).All.forEach(function(element) {
        if (element.symbol.toUpperCase() == symbol.toUpperCase()) {
          found = true;
          callback(null, `https://www.investing.com${element.link}`)
          return;
        }
      }, this);
    });

    res.on('end', () => {
      if (!found) {
        callback(null, null);
      }
    });
  });

  req.on('error', (e) => {
    callback(e, null);
  });

  req.write(postData);
  req.end();
}

/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
exports.redirectInvestingSymbol = function (req, res) {
  var symbol = req.query.symbol;
  if (symbol) {
    findURLBySymbol(symbol, (err, url) => {
      if (err != null) {
        throw err;                // Error occurred while searching
      } else if (url == null) {
        res.sendStatus(404);      // Could not find the URL
      } else {
        res.redirect(url);        // Redirect to the URL
      }
    });
  } else {
    res.send(`
<html>
<body>
    <form action="" method="get">
      <div>
        <label for="symbol">Symbol: </label>
        <input type="text" id="symbol" name="symbol">
      </div>
      <div>
        <button type="submit">Go</button>
      </div>
    </form>
</body>
</html>`)
  }
};
