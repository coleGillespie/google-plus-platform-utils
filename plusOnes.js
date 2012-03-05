//
//
// Created as a temporary work around for the Google+ Platform's
// lack of support for selecting a count of plus ones for a given url.
// Inspired by my team at Zeit Online ( specifically @venohr and @hwy395 )
// and the Google+ Platform team that wrote https://apis.google.com/js/plusone.js
// as well as the source that it embeds.
//
// You can find the google-plus-platform issue #57 at
// http://code.google.com/p/google-plus-platform/issues/detail?id=57
//
// You can find a blog post furter explaining the creation of this script at
// http://blog.colegillespie.com/2012/03/05/number-of-plus-ones-for-any-url/
// 
//
// Instructions to get started ( from a machine with node.js and npm installed ):
//   git clone git://github.com/coleGillespie/google-plus-platform-utils.git
//   npm install jsdom
//   node plusOnes
//
//
var jsdom  = require('jsdom')
  , crypto = require('crypto')
  // see https://apis.google.com/js/plusone.js
  , gPlusOneId = function () {
      // in order to stick with the way
      return ["I1_", (new Date).getTime()].join("")
    }
    // this was node's way of crypto.getRandomValues()
    // based on the src of the script appended by 
    // https://apis.google.com/js/plusone.js
  , gPlusOneRpc = function(){
      // get the base random unsigned int
      var prePreRpc = crypto.randomBytes(32).readUInt32BE(0)
          // prepend "0."
        , preRpc = Number("0." + prePreRpc)
          // make sure it is 9 digits
        , rpc = Math.round(1E9 * (0, preRpc));
      // return
      return rpc
    }
    // build the proper url based on the iframe src
    // that is embded within any page that has
    // a google plus one button
  , gPlusOneUrl = function(url){
      var uri = '';
          uri += "https://plusone.google.com/_/+1/fastbutton?";
          uri += "url=" + url;
          uri += "&size=standard";
          uri += "&hl=en-US";
          // I am not 100% sure if this particular string will remain stable.
          // I am also not sure where to fight the current "ver" and "am" properties.
          uri += "sh=m;/_/apps-static/_/js/gapi/__features__/rt=j/ver=zVTxVnVbJog.en_US./sv=1/am=!FRwcaGMpC1CIJ0aI4g/d=1/#id=" + gPlusOneId();
          uri += "&parent=true";
          uri += "&rpctoken=" + gPlusOneRpc();
          uri += "&_methods=onPlusOne,_ready,_close,_open,_resizeMe,_renderstart";
      return uri;
  };

jsdom.env({
  // pass the correct url of which it is that you would like to get the plus one count
  html: gPlusOneUrl("http://example.com"),
  scripts: [
    'http://code.jquery.com/jquery-1.5.min.js'
  ],
  done: function(errors, window) {
    var $ = window.$;
    // Simply find the proper ID
    // NOTE: This may also break in the future if 
    // the id changes on Google's side
    var count = $('#aggregateCount').text();
    console.log(count);
  }
});