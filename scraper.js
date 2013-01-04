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
        parseData(xml);
      });
  });
}

function parseData(xml) {

  //takes the XML file and returns the surf forecast (19th child node)
  var rawData = convert(xml).get('channel').childNodes()[19].text();

  //splits the raw data at every new line
  var splitLines = rawData.split(/\n/)

  //takes the relevant lines
  var northWestEastSouth = splitLines.slice(3,7);

  //taking out all the text except 'nn to nn'
  var parseDirections = _.map(northWestEastSouth, function(line){
    return line.match((/\d{1,2}( to )\d{1,2}/g))
  });

  //returning arrays of just the numbers (but in string format)
  var surfHeightArray = _.map(parseDirections, function(num){return num.toString().match(/\d{1,2}/g)})

  //changing the strings to numbers, now have an array of four arrays (one for each compass direction)
  var surfHeightArrayNum = _.map(surfHeightArray, function(array){return _.map(array, function(str){return parseFloat(str)})})
  //fs.writeFileSync(__dirname + '/index.html', surfHeightArrayNum);
}


scrapeData();
express()
  .get('/*', function (req, res ) { res.sendfile(__dirname + req.url)})
  .listen(8080);


