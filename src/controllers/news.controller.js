const http = require('https');

const getGoogleNews = (req, res) => {
  const options = {
    method: 'POST',
    hostname: 'job-search15.p.rapidapi.com',
    port: null,
    path: '/',
    headers: {
      'x-rapidapi-key': 'f9e1578c3dmsh638371d4d0847ebp1de791jsn54dc0793d287',
      'x-rapidapi-host': 'job-search15.p.rapidapi.com',
      'Content-Type': 'application/json'
    }
  };

  const apiReq = http.request(options, function (apiRes) {
    const chunks = [];

    apiRes.on('data', function (chunk) {
      chunks.push(chunk);
    });

    apiRes.on('end', function () {
      const body = Buffer.concat(chunks);
      console.log(body.toString());
      res.send(body.toString());  // Send the response back to the client
    });
  });

  apiReq.write(JSON.stringify({
    api_type: 'fetch_jobs',
    search_terms: '',
    location: 'Tunisia',
    page: '1'
  }));
  apiReq.end();
};


module.exports = {
  getGoogleNews,

};


/* 
    const options = {
        method: 'GET',
        hostname: 'reuters-business-and-financial-news.p.rapidapi.com',
        port: null,
        path: '/market-assets/list',
        headers: {
            'x-rapidapi-key': 'f9e1578c3dmsh638371d4d0847ebp1de791jsn54dc0793d287',
            'x-rapidapi-host': 'reuters-business-and-financial-news.p.rapidapi.com'
        }
    };

  const request = https.request(options, function (response) {
    const chunks = [];

    response.on('data', function (chunk) {
      chunks.push(chunk);
    });

    response.on('end', function () {
      const body = Buffer.concat(chunks);
      res.send(body.toString());
    });
  });

  request.on('error', (e) => {
    console.error(e);
    res.status(500).send('An error occurred');
  });

  request.end();
   */