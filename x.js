var fs = require('fs');
var http = require('http');
var _ = require('underscore');
var express = require('express');
var convert =  require('libxmljs').parseXml;

var template = fs.readFileSync('template.template').toString();

console.log('starting up')


function scrapeData() {
  http.get('http://www.prh.noaa.gov/hnl/xml/Surf.xml', function (res){
    var xml = '';
    res.on('data', function (d) { xml += d})
      .on('end', function () {
        var description = convert(xml).get('channel').childNodes()[19].text();
        var description = description.match(/\d{1,2}( to )\d{1,2}/g).join(', ')

        var html = _.template(template, {data: description});
        console.log(description);
        fs.writeFileSync(__dirname + '/index.html', html);
      });
  });
}




scrapeData();
express()
  .get('/*', function (req, res ) { res.sendfile(__dirname + req.url)})
  .listen(8080);


