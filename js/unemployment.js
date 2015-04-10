//tabletop

(function(global) {
  "use strict";

  var inNodeJS = false;
  if (typeof module !== 'undefined' && module.exports) {
    inNodeJS = true;
    var request = require('request');
  }

  var supportsCORS = false;
  var inLegacyIE = false;
  try {
    var testXHR = new XMLHttpRequest();
    if (typeof testXHR.withCredentials !== 'undefined') {
      supportsCORS = true;
    } else {
      if ("XDomainRequest" in window) {
        supportsCORS = true;
        inLegacyIE = true;
      }
    }
  } catch (e) { }

  // Create a simple indexOf function for support
  // of older browsers.  Uses native indexOf if 
  // available.  Code similar to underscores.
  // By making a separate function, instead of adding
  // to the prototype, we will not break bad for loops
  // in older browsers
  var indexOfProto = Array.prototype.indexOf;
  var ttIndexOf = function(array, item) {
    var i = 0, l = array.length;
    
    if (indexOfProto && array.indexOf === indexOfProto) return array.indexOf(item);
    for (; i < l; i++) if (array[i] === item) return i;
    return -1;
  };
  
  /*
    Initialize with Tabletop.init( { key: '0AjAPaAU9MeLFdHUxTlJiVVRYNGRJQnRmSnQwTlpoUXc' } )
      OR!
    Initialize with Tabletop.init( { key: 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0AjAPaAU9MeLFdHUxTlJiVVRYNGRJQnRmSnQwTlpoUXc&output=html&widget=true' } )
      OR!
    Initialize with Tabletop.init('0AjAPaAU9MeLFdHUxTlJiVVRYNGRJQnRmSnQwTlpoUXc')
  */

  var Tabletop = function(options) {
    // Make sure Tabletop is being used as a constructor no matter what.
    if(!this || !(this instanceof Tabletop)) {
      return new Tabletop(options);
    }
    
    if(typeof(options) === 'string') {
      options = { key : options };
    }

    this.callback = options.callback;
    this.wanted = options.wanted || [];
    this.key = options.key;
    this.simpleSheet = !!options.simpleSheet;
    this.parseNumbers = !!options.parseNumbers;
    this.wait = !!options.wait;
    this.reverse = !!options.reverse;
    this.postProcess = options.postProcess;
    this.debug = !!options.debug;
    this.query = options.query || '';
    this.orderby = options.orderby;
    this.endpoint = options.endpoint || "https://spreadsheets.google.com";
    this.singleton = !!options.singleton;
    this.simple_url = !!options.simple_url;
    this.callbackContext = options.callbackContext;
    this.prettyColumnNames = typeof(options.prettyColumnNames) == 'undefined' ? true : options.prettyColumnNames
    
    if(typeof(options.proxy) !== 'undefined') {
      // Remove trailing slash, it will break the app
      this.endpoint = options.proxy.replace(/\/$/,'');
      this.simple_url = true;
      this.singleton = true;
      // Let's only use CORS (straight JSON request) when
      // fetching straight from Google
      supportsCORS = false
    }
    
    this.parameterize = options.parameterize || false;
    
    if(this.singleton) {
      if(typeof(Tabletop.singleton) !== 'undefined') {
        this.log("WARNING! Tabletop singleton already defined");
      }
      Tabletop.singleton = this;
    }
    
    /* Be friendly about what you accept */
    if(/key=/.test(this.key)) {
      this.log("You passed an old Google Docs url as the key! Attempting to parse.");
      this.key = this.key.match("key=(.*?)(&|#|$)")[1];
    }

    if(/pubhtml/.test(this.key)) {
      this.log("You passed a new Google Spreadsheets url as the key! Attempting to parse.");
      this.key = this.key.match("d\\/(.*?)\\/pubhtml")[1];
    }

    if(!this.key) {
      this.log("You need to pass Tabletop a key!");
      return;
    }

    this.log("Initializing with key " + this.key);

    this.models = {};
    this.model_names = [];

    this.base_json_path = "/feeds/worksheets/" + this.key + "/public/basic?alt=";

    if (inNodeJS || supportsCORS) {
      this.base_json_path += 'json';
    } else {
      this.base_json_path += 'json-in-script';
    }
    
    if(!this.wait) {
      this.fetch();
    }
  };

  // A global storage for callbacks.
  Tabletop.callbacks = {};

  // Backwards compatibility.
  Tabletop.init = function(options) {
    return new Tabletop(options);
  };

  Tabletop.sheets = function() {
    this.log("Times have changed! You'll want to use var tabletop = Tabletop.init(...); tabletop.sheets(...); instead of Tabletop.sheets(...)");
  };

  Tabletop.prototype = {

    fetch: function(callback) {
      if(typeof(callback) !== "undefined") {
        this.callback = callback;
      }
      this.requestData(this.base_json_path, this.loadSheets);
    },
    
    /*
      This will call the environment appropriate request method.
      
      In browser it will use JSON-P, in node it will use request()
    */
    requestData: function(path, callback) {
      if (inNodeJS) {
        this.serverSideFetch(path, callback);
      } else {
        //CORS only works in IE8/9 across the same protocol
        //You must have your server on HTTPS to talk to Google, or it'll fall back on injection
        var protocol = this.endpoint.split("//").shift() || "http";
        if (supportsCORS && (!inLegacyIE || protocol === location.protocol)) {
          this.xhrFetch(path, callback);
        } else {
          this.injectScript(path, callback);
        }
      }
    },

    /*
      Use Cross-Origin XMLHttpRequest to get the data in browsers that support it.
    */
    xhrFetch: function(path, callback) {
      //support IE8's separate cross-domain object
      var xhr = inLegacyIE ? new XDomainRequest() : new XMLHttpRequest();
      xhr.open("GET", this.endpoint + path);
      var self = this;
      xhr.onload = function() {
        try {
          var json = JSON.parse(xhr.responseText);
        } catch (e) {
          console.error(e);
        }
        callback.call(self, json);
      };
      xhr.send();
    },
    
    /*
      Insert the URL into the page as a script tag. Once it's loaded the spreadsheet data
      it triggers the callback. This helps you avoid cross-domain errors
      http://code.google.com/apis/gdata/samples/spreadsheet_sample.html
      Let's be plain-Jane and not use jQuery or anything.
    */
    injectScript: function(path, callback) {
      var script = document.createElement('script');
      var callbackName;
      
      if(this.singleton) {
        if(callback === this.loadSheets) {
          callbackName = 'Tabletop.singleton.loadSheets';
        } else if (callback === this.loadSheet) {
          callbackName = 'Tabletop.singleton.loadSheet';
        }
      } else {
        var self = this;
        callbackName = 'tt' + (+new Date()) + (Math.floor(Math.random()*100000));
        // Create a temp callback which will get removed once it has executed,
        // this allows multiple instances of Tabletop to coexist.
        Tabletop.callbacks[ callbackName ] = function () {
          var args = Array.prototype.slice.call( arguments, 0 );
          callback.apply(self, args);
          script.parentNode.removeChild(script);
          delete Tabletop.callbacks[callbackName];
        };
        callbackName = 'Tabletop.callbacks.' + callbackName;
      }
      
      var url = path + "&callback=" + callbackName;
      
      if(this.simple_url) {
        // We've gone down a rabbit hole of passing injectScript the path, so let's
        // just pull the sheet_id out of the path like the least efficient worker bees
        if(path.indexOf("/list/") !== -1) {
          script.src = this.endpoint + "/" + this.key + "-" + path.split("/")[4];
        } else {
          script.src = this.endpoint + "/" + this.key;
        }
      } else {
        script.src = this.endpoint + url;
      }
      
      if (this.parameterize) {
        script.src = this.parameterize + encodeURIComponent(script.src);
      }
      
      document.getElementsByTagName('script')[0].parentNode.appendChild(script);
    },
    
    /* 
      This will only run if tabletop is being run in node.js
    */
    serverSideFetch: function(path, callback) {
      var self = this
      request({url: this.endpoint + path, json: true}, function(err, resp, body) {
        if (err) {
          return console.error(err);
        }
        callback.call(self, body);
      });
    },

    /* 
      Is this a sheet you want to pull?
      If { wanted: ["Sheet1"] } has been specified, only Sheet1 is imported
      Pulls all sheets if none are specified
    */
    isWanted: function(sheetName) {
      if(this.wanted.length === 0) {
        return true;
      } else {
        return (ttIndexOf(this.wanted, sheetName) !== -1);
      }
    },
    
    /*
      What gets send to the callback
      if simpleSheet === true, then don't return an array of Tabletop.this.models,
      only return the first one's elements
    */
    data: function() {
      // If the instance is being queried before the data's been fetched
      // then return undefined.
      if(this.model_names.length === 0) {
        return undefined;
      }
      if(this.simpleSheet) {
        if(this.model_names.length > 1 && this.debug) {
          this.log("WARNING You have more than one sheet but are using simple sheet mode! Don't blame me when something goes wrong.");
        }
        return this.models[ this.model_names[0] ].all();
      } else {
        return this.models;
      }
    },

    /*
      Add another sheet to the wanted list
    */
    addWanted: function(sheet) {
      if(ttIndexOf(this.wanted, sheet) === -1) {
        this.wanted.push(sheet);
      }
    },
    
    /*
      Load all worksheets of the spreadsheet, turning each into a Tabletop Model.
      Need to use injectScript because the worksheet view that you're working from
      doesn't actually include the data. The list-based feed (/feeds/list/key..) does, though.
      Calls back to loadSheet in order to get the real work done.
      Used as a callback for the worksheet-based JSON
    */
    loadSheets: function(data) {
      var i, ilen;
      var toLoad = [];
      this.foundSheetNames = [];

      for(i = 0, ilen = data.feed.entry.length; i < ilen ; i++) {
        this.foundSheetNames.push(data.feed.entry[i].title.$t);
        // Only pull in desired sheets to reduce loading
        if( this.isWanted(data.feed.entry[i].content.$t) ) {
          var linkIdx = data.feed.entry[i].link.length-1;
          var sheet_id = data.feed.entry[i].link[linkIdx].href.split('/').pop();
          var json_path = "/feeds/list/" + this.key + "/" + sheet_id + "/public/values?alt="
          if (inNodeJS || supportsCORS) {
            json_path += 'json';
          } else {
            json_path += 'json-in-script';
          }
          if(this.query) {
            json_path += "&sq=" + this.query;
          }
          if(this.orderby) {
            json_path += "&orderby=column:" + this.orderby.toLowerCase();
          }
          if(this.reverse) {
            json_path += "&reverse=true";
          }
          toLoad.push(json_path);
        }
      }

      this.sheetsToLoad = toLoad.length;
      for(i = 0, ilen = toLoad.length; i < ilen; i++) {
        this.requestData(toLoad[i], this.loadSheet);
      }
    },

    /*
      Access layer for the this.models
      .sheets() gets you all of the sheets
      .sheets('Sheet1') gets you the sheet named Sheet1
    */
    sheets: function(sheetName) {
      if(typeof sheetName === "undefined") {
        return this.models;
      } else {
        if(typeof(this.models[ sheetName ]) === "undefined") {
          // alert( "Can't find " + sheetName );
          return;
        } else {
          return this.models[ sheetName ];
        }
      }
    },

    sheetReady: function(model) {
      this.models[ model.name ] = model;
      if(ttIndexOf(this.model_names, model.name) === -1) {
        this.model_names.push(model.name);
      }

      this.sheetsToLoad--;
      if(this.sheetsToLoad === 0)
        this.doCallback();
    },
    
    /*
      Parse a single list-based worksheet, turning it into a Tabletop Model
      Used as a callback for the list-based JSON
    */
    loadSheet: function(data) {
      var that = this;
      var model = new Tabletop.Model( { data: data, 
                                        parseNumbers: this.parseNumbers,
                                        postProcess: this.postProcess,
                                        tabletop: this,
                                        prettyColumnNames: this.prettyColumnNames,
                                        onReady: function() {
                                          that.sheetReady(this);
                                        } } );
    },

    /*
      Execute the callback upon loading! Rely on this.data() because you might
        only request certain pieces of data (i.e. simpleSheet mode)
      Tests this.sheetsToLoad just in case a race condition happens to show up
    */
    doCallback: function() {
      if(this.sheetsToLoad === 0) {
        this.callback.apply(this.callbackContext || this, [this.data(), this]);
      }
    },

    log: function(msg) {
      if(this.debug) {
        if(typeof console !== "undefined" && typeof console.log !== "undefined") {
          Function.prototype.apply.apply(console.log, [console, arguments]);
        }
      }
    }

  };

  /*
    Tabletop.Model stores the attribute names and parses the worksheet data
      to turn it into something worthwhile
    Options should be in the format { data: XXX }, with XXX being the list-based worksheet
  */
  Tabletop.Model = function(options) {
    var i, j, ilen, jlen;
    this.column_names = [];
    this.name = options.data.feed.title.$t;
    this.tabletop = options.tabletop;
    this.elements = [];
    this.onReady = options.onReady;
    this.raw = options.data; // A copy of the sheet's raw data, for accessing minutiae

    if(typeof(options.data.feed.entry) === 'undefined') {
      options.tabletop.log("Missing data for " + this.name + ", make sure you didn't forget column headers");
      this.elements = [];
      return;
    }
    
    for(var key in options.data.feed.entry[0]){
      if(/^gsx/.test(key))
        this.column_names.push( key.replace("gsx$","") );
    }

    this.original_columns = this.column_names;
    
    for(i = 0, ilen =  options.data.feed.entry.length ; i < ilen; i++) {
      var source = options.data.feed.entry[i];
      var element = {};
      for(var j = 0, jlen = this.column_names.length; j < jlen ; j++) {
        var cell = source[ "gsx$" + this.column_names[j] ];
        if (typeof(cell) !== 'undefined') {
          if(options.parseNumbers && cell.$t !== '' && !isNaN(cell.$t))
            element[ this.column_names[j] ] = +cell.$t;
          else
            element[ this.column_names[j] ] = cell.$t;
        } else {
            element[ this.column_names[j] ] = '';
        }
      }
      if(element.rowNumber === undefined)
        element.rowNumber = i + 1;
      if( options.postProcess )
        options.postProcess(element);
      this.elements.push(element);
    }
    
    if(options.prettyColumnNames)
      this.fetchPrettyColumns();
    else
      this.onReady.call(this);
  };

  Tabletop.Model.prototype = {
    /*
      Returns all of the elements (rows) of the worksheet as objects
    */
    all: function() {
      return this.elements;
    },
    
    fetchPrettyColumns: function() {
      if(!this.raw.feed.link[3])
        return this.ready();
      var cellurl = this.raw.feed.link[3].href.replace('/feeds/list/', '/feeds/cells/').replace('https://spreadsheets.google.com', '');
      var that = this;
      this.tabletop.requestData(cellurl, function(data) {
        that.loadPrettyColumns(data)
      });
    },
    
    ready: function() {
      this.onReady.call(this);
    },
    
    /*
     * Store column names as an object
     * with keys of Google-formatted "columnName"
     * and values of human-readable "Column name"
     */
    loadPrettyColumns: function(data) {
      var pretty_columns = {};

      var column_names = this.column_names;

      var i = 0;
      var l = column_names.length;

      for (; i < l; i++) {
        if (typeof data.feed.entry[i].content.$t !== 'undefined') {
          pretty_columns[column_names[i]] = data.feed.entry[i].content.$t;
        } else {
          pretty_columns[column_names[i]] = column_names[i];
        }
      }

      this.pretty_columns = pretty_columns;

      this.prettifyElements();
      this.ready();
    },
    
    /*
     * Go through each row, substitutiting
     * Google-formatted "columnName"
     * with human-readable "Column name"
     */
    prettifyElements: function() {
      var pretty_elements = [],
          ordered_pretty_names = [],
          i, j, ilen, jlen;

      var ordered_pretty_names;
      for(j = 0, jlen = this.column_names.length; j < jlen ; j++) {
        ordered_pretty_names.push(this.pretty_columns[this.column_names[j]]);
      }

      for(i = 0, ilen = this.elements.length; i < ilen; i++) {
        var new_element = {};
        for(j = 0, jlen = this.column_names.length; j < jlen ; j++) {
          var new_column_name = this.pretty_columns[this.column_names[j]];
          new_element[new_column_name] = this.elements[i][this.column_names[j]];
        }
        pretty_elements.push(new_element);
      }
      this.elements = pretty_elements;
      this.column_names = ordered_pretty_names;
    },

    /*
      Return the elements as an array of arrays, instead of an array of objects
    */
    toArray: function() {
      var array = [],
          i, j, ilen, jlen;
      for(i = 0, ilen = this.elements.length; i < ilen; i++) {
        var row = [];
        for(j = 0, jlen = this.column_names.length; j < jlen ; j++) {
          row.push( this.elements[i][ this.column_names[j] ] );
        }
        array.push(row);
      }
      return array;
    }
  };

  if(inNodeJS) {
    module.exports = Tabletop;
  } else if (typeof define === 'function' && define.amd) {
    define(function () {
        return Tabletop;
    });
  } else {
    global.Tabletop = Tabletop;
  }

})(this);


function drawInfographic(metric){
    console.log("it worked");


/*
 *
 *  BEGIN UNEMPLOYMENT METRIC
 *
 */         
        //For formatting as percentage 
            var formatAsPercentage = d3.format("%");
       
            console.log("unemployment Infographic");
            var div = document.createElement("div");
            var idAtt = document.createAttribute("id");
            var classAtt = document.createAttribute("class");
            idAtt.value = "unemployment";
            classAtt.value = "hidden";
            div.setAttributeNode(idAtt);
            div.setAttributeNode(classAtt);
            document.getElementById('content').appendChild(div);
            document.getElementById('unemployment').innerHTML ="<h3 class='panel-title'>Flint Hills Unemployment by County</h3>\
                <svg style='position: relative; top: 0px; left: 400px;' class='unemployment' id='unemployment'></svg>\
                <!-- Following div sets size of infographic. This layer contains the tooltips; the next div is for the map, which is pulled underneath the tooltips with a negative margin -->\
                <div style='width: 400px; height: 500px; margin-top: -500px;'>\
                <div id='tooltip' class='hidden'>\
                <p><strong><span id='name'>100</span></strong></p>\
                <p><span id='unemployed'>100</span></p>\
                <p><span id='rate'>100</span></p>\
                </div></div>\
                <!-- Following div contains the map, which is pulled underneath the tooltips with a negative margin -->\
                <div class='map' style='margin-top: -500px'></div>\
                <datalist id='yearlist'>\
                <option>2007</option>\
                <option>2008</option>\
                <option>2009</option>\
                <option>2010</option>\
                <option>2011</option>\
                <option>2012</option>\
                <option>2013</option>\
                </datalist>\
                <input type='range' id='yearRange' value='2007'  min='2007' max='2013' step='1' list='yearlist' >\
                <div class='btn-toolbar' role='toolbar' aria-label='...'>\
                <div class='btn-group btn-group-sm' role='group' aria-label='...'>\
                  <button type='button' class='btn btn-default' disabled='disabled'> <span class='glyphicon glyphicon-step-backward' aria-hidden='true'></span></button>\
                  <button type='button' class='btn btn-default' disabled='disabled'> <span class='glyphicon glyphicon-play' aria-hidden='true'></span></button>\
                  <button type='button' class='btn btn-default' disabled='disabled'> <span class='glyphicon glyphicon-step-forward' aria-hidden='true'></span></button>\
                </div>\
                <div class='btn-group btn-group-sm' role='group' aria-label='...'>\
                  <span id='range' class='pull-right' style='font-weight: bold; padding-top: 5px; padding-left: 5px;'></span>\
                  </div>";
    
  
            var dataArray = [0,0];
           
            var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=194fY194abaOe9gjopnutM0kBWpnss8-f-wod8YzrjCg&output=html';
            var public_spreadsheet_url2 = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=1JsjyHZt5AgJCmC_42X9veNFw6CSaQqPpQCG4Ej5LVB8&output=html';
            
            var margin = {top: 5, right: 0, bottom: 30, left: 75},
              width = 600 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;
          
            var x = d3.scale.ordinal()
              .rangeRoundBands([0, width], .1);
              
            var y = d3.scale.linear()
              .domain([0,.1])
              .range([0, height]);

 

            var xAxis = d3.svg.axis() 
              .scale(x)
              .orient("bottom");
          
            var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left")
              .tickSize(-width)
              .tickSubdivide(true)
              .tickFormat(formatAsPercentage);
          
            var chart = d3.select(".unemployment")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
              
              //Set Color Scale, Colors taken from colorbrewer.js, included in the D3 download
              var color = d3.scale.quantile()
                  .range(['rgb(26,150,65)','rgb(166,217,106)','rgb(253,174,97)','rgb(215,25,28)'])
                  .domain([0.03, .09]);
              
   
            
  
 

            function drawMap(dataset, tabletop) {
              
              dataArray[0]=dataset;
            
              //Width and height
              var w = 400;
              var h = 500;
              
              //Define Projection and Scale                    
              var projection = d3.geo.albersUsa()
                  .scale([7200])
                  .translate([w/2, h/2.9]);
           
              //Define default path generator
              var path = d3.geo.path()
                  .projection(projection);
                  
              //Create SVG element
              var svg = d3.select(".map")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h);
           
                                                  
                  
              //Set year at bottom of slider
              var year = document.getElementById("yearRange").value;
              document.getElementById("range").innerHTML=year;
          
              /*
               * The following function draws the Flint Hills counties, kansas counties, US state boundaries, and unemployment circles.
               * It also includes the function to update the unemployment circles based on year.  The functions are nested to
               * ensure proper drawing order.
               */
    
   
                d3.json("data/flinthills.geojson", function(json) {
            
                    //Draw Flint Hills Counites
                    svg.selectAll("path")
                        .data(json.features)
                        .enter()
                        .append("path")
                        .attr("d", path)
                        .style("fill","#e7e7e7")
                        .style("stroke","#ddd")
                        .style("stroke-width","0.5");
                        
                        
                    //Labels for Flint Hills Counties
                    svg.selectAll("text")
                        .data(json.features)
                        .enter()
                        .append("text")
                        .text(function(d){
                            return d.properties.NAME10;
                        })
                        .attr("text-anchor", "middle")
                        .attr("x", function(d){
                            return projection([d.properties.INTPTLON10, d.properties.INTPTLAT10])[0];
                        })
                        .attr("y", function(d){
                            return projection([d.properties.INTPTLON10, d.properties.INTPTLAT10])[1];
                        })
                        .style("fill","#000")
                        .attr("text-anchor", "middle")
                        .style("font-size","8.5px")
                        .style("text-transform","uppercase");
            
                  //Draw rest of Kansas Counties
                  d3.json("data/ks-counties.json", function(json) {
            
                      //Bind data and create one path per GeoJSON feature
                      svg.selectAll("path")
                          .data(json.features)
                          .enter()
                          .append("path")
                          .attr("d", path)
                          .style("fill","none")
                          .style("fill-opacity","0")
                          .style("stroke","#ddd")
                          .style("stroke-width","0.5");
                    
                    //Draw US states Boundaries
                    d3.json("data/us-states.geojson", function(json) {
                      //Bind data and create one path per GeoJSON feature
                      svg.selectAll("path")
                          .data(json.features)
                          .enter()
                          .append("path")
                          .attr("d", path)
                          .style("fill","none")
                          .style("stroke","#999");
                     
               
                    //Draw circles for each point
                    svg.selectAll("circle")
                      //Load Data
                      .data(dataset)
                      .enter()
                      .append("circle")
                      //Place circles on centroids of counties
                      .attr("cx", function(d) {
                        return projection([d.lon, d.lat])[0];
                      })
                      .attr("cy", function(d) {
                        return projection([d.lon, d.lat])[1];
                      })
                      //Set the Radius
                      .attr("r", function(d){
                        return Math.sqrt(parseInt(d['unemp'+year.toString()]) * 0.5);    
                      })
                      //Set the Fill Color
                      .style("fill", function(d) {
                         var value = d['unemprate'+year.toString()];			   		
                         if(value) {
                          return color(value);
                         }
                         else {
                         //If value is undefined…
                            return "#333";
                         }
                      })
                      .style("opacity",".75")
                        
                      //Create tooltips
                      .on("mouseover", function(d) {
                        //Get this bar's x/y values, then augment for the tooltip
                        var xPosition = parseFloat(d3.select(this).attr("cx")) +30;
                        var yPosition = parseFloat(d3.select(this).attr("cy")) -15;
                                  
                        //Update the tooltip position and value
                        d3.select("#tooltip")
                          .style("left", xPosition + "px")
                          .style("top", yPosition  + "px")
                          .select("#name")
                          .text(d.name + " County");
                        d3.select("#unemployed")
                          .text("Number of Unemployed: " + numberWithCommas(d['unemp'+year.toString()]));
                        d3.select("#rate")
                          .text("Unemployment Rate: " + Math.round(d['unemprate'+year.toString()] * 1000)/10 + "%");
                      
                        //Show the tooltip
                        d3.select("#tooltip").classed("hidden", false);
                      })
                      
                      //hide tooltip on mouseout
                      .on("mouseout", function() {
                        svg.selectAll("circle").style("opacity",".75");
                        d3.select("#tooltip").classed("hidden", true);
                      }); 
                    });  //End State Layer
                  }); //End Kansas Counties Layer
                }); //End Flint Hills Counties Layer
    
                //Begin section for updating based on year
                
                //Listen for change on scale
                d3.select("#yearRange")
                  .on("change",function(){
                    
                    //Change the year displayed
                    year = document.getElementById("yearRange").value;
                    document.getElementById("range").innerHTML=year;
                    
                    chart.selectAll(".bar")
                            .data(dataArray[1])
                            .transition()
                            .duration(1500)
                            .attr("class", "bar")
                            .attr("x", function(d) { return x(d.area); })
                            .attr("y", function(d){ return height - y(0.1-d[year.toString()]);} )
                            .attr("width", x.rangeBand())
                            .attr("height", function(d) { return y(0.1-d[year.toString()]); })
                            .style("fill", function(d) {
                              var value = d[year.toString()];			   		
                              if(value) {
                                return color(value);
                              }
                              else {
                              //If value is undefined…
                                return "#333";
                              }
                            });
                    
                    //Update Circles
                    svg.selectAll("circle")
                      .data(dataArray[0])
                      .transition()
                      .duration(1000)
                      .attr("cx", function(d) {
                        return projection([d.lon, d.lat])[0];
                      })
                      .attr("cy", function(d) {
                        return projection([d.lon, d.lat])[1];
                      })
                      //Reset the Radius
                      .attr("r", function(d){
                        return Math.sqrt(parseInt(d['unemp'+year.toString()]) * 0.5);    
                      })
                      //Change the Fill Color
                      .style("fill", function(d) {
                        var value = d['unemprate'+year.toString()];			   		
                        if(value) {
                          return color(value);
                        }
                        else {
                          //If value is undefined…
                            return "#333";
                        }
                      })
                      .style("opacity",".75")
                      //Update Tooltips	  
                      .on("mouseover", function(d) {
                        //Get this bar's x/y values, then augment for the tooltip
                        var xPosition = parseFloat(d3.select(this).attr("cx")) +30;
                        var yPosition = parseFloat(d3.select(this).attr("cy")) -15;
                        console.log(xPosition, yPosition);
                                
                        //Update the tooltip position and value
                        d3.select("#tooltip")
                          .style("left", xPosition + "px")
                          .style("top", yPosition  + "px")
                          .select("#name")
                          .text(d.name + " County");
                                  
                        d3.select("#unemployed")
                          .text("Number of Unemployed: " + numberWithCommas(d['unemp'+year.toString()]));
                               
                        d3.select("#rate")
                          .text("Unemployment Rate: " + Math.round(d['unemprate'+year.toString()] * 1000)/10 + "%");
                                
                        //Show the tooltip
                        d3.select("#tooltip").classed("hidden", false);
                      })
                      .on("mouseout", function() {
                        svg.selectAll("circle").style("opacity",".75");
                        //Hide the tooltip
                        d3.select("#tooltip").classed("hidden", true);
                      });
                });
       
                function numberWithCommas(x) {
                    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
            }
            function drawChart(data){

                dataArray[1] = data;
              
                year = document.getElementById("yearRange").value;
               
                y.domain([0, 0.1 ]).range([height, 0]);
                x.domain(data.map(function(d) { return d.area; }));
              
                chart.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);
                    
                    chart.append("g")
                      .attr("class", "y axis")
                      .call(yAxis)
                      .append("text")
                      .attr("transform", "rotate(-90)")
                      .attr("y", -40)
                      .attr("dy", ".71em")
                      .style("text-anchor", "end")
                      .text("Unemployment Rate");
           
                chart.selectAll(".bar")
                    .data(dataArray[1])
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d.area); })
                    .attr("y", function(d){ return height - y(0.1-d[year.toString()]);} )
                    .attr("width", x.rangeBand())
                    .attr("height", function(d) { return y(0.1-d[year.toString()]); } )
                    .style("fill", function(d) {
                        var value = d[year.toString()];			   		
                        if(value) {
                          return color(value);
                        }
                        else {
                          //If value is undefined…
                            return "#333";
                        }
                      });
            }
 function init() {
              Tabletop.init( { key: public_spreadsheet_url,
                               callback: drawMap,
                               simpleSheet: true } )
            }
            function init2() {
              Tabletop.init( { key: public_spreadsheet_url2,
                               callback: drawChart,
                               simpleSheet: true } )
            }
            init();
            init2();
}

drawInfographic();
           
       