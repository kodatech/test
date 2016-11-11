/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('scan').addEventListener('click', this.scan, false);
        document.getElementById('encode').addEventListener('click', this.encode, false);
    },

    // deviceready Event Handler
    //
    // The scope of `this` is the event. In order to call the `receivedEvent`
    // function, we must explicity call `app.receivedEvent(...);`
    // 
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
	document.addEventListener('offline', checkConnection, false);
	checkConnection();
	window.open('http://anzor.benjamin.sky/', '_blank', 'location=yes');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    scan: function() {
        console.log('scanning');
        
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan( function (result) { 
			load_new_scan(result.text);
			/*
            alert("We got a barcode\n" + 
            "Result: " + result.text + "\n" + 
            "Format: " + result.format + "\n" + 
            "Cancelled: " + result.cancelled);  

           console.log("Scanner result: \n" +
                "text: " + result.text + "\n" +
                "format: " + result.format + "\n" +
                "cancelled: " + result.cancelled + "\n");
			
			
            document.getElementById("info").innerHTML = result.text;
            console.log(result);
            */
			/*
            if (args.format == "QR_CODE") {
                window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
            }
            */

        }, function (error) { 
            console.log("Scanning failed: ", error); 
        } );
    },

    encode: function() {
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.encode(scanner.Encode.TEXT_TYPE, "http://www.nhl.com", function(success) {
            alert("encode success: " + success);
          }, function(fail) {
            alert("encoding failed: " + fail);
          }
        );

    }

};

var box_counter = 1;
var found = 0;
function load_new_scan(result_text){
	found = 1;
	jQuery('#send_all').fadeIn();
	var htmlstr = '<div class="scan_box" this_id="'+box_counter+'" id="send_box_'+box_counter+'">';
	htmlstr += '<div class="scan_box_remove" onClick="remove_scan_box('+box_counter+')"><img src="img/Remove.png" /></div>';
	htmlstr += '	<div class="scan_box_content">';
	htmlstr += '		<div class="scan_box_img col-xs-3"><img src="img/product_image.png" /></div>';
	htmlstr += '		<div class="scan_box_details col-xs-6">';
	htmlstr += '		<div class="scan_box_title">Some awesome screws</div>';
	htmlstr += '		<div class="scan_box_code"><span>Code: </span>'+result_text+'</div>';
	htmlstr += '	</div>';
	htmlstr += '	<div class="scan_box_actions col-xs-3">';
	htmlstr += '		<div>Amount:</div>';
	htmlstr += '		<select><option>10</option><option>20</option><option>30</option><option>40</option><option>50</option><option>60</option></select>';
	htmlstr += '		<button class="topcoat-button event send" onClick="send_order('+box_counter+')">SEND ORDER</button>';
	htmlstr += '	</div>';
	htmlstr += '</div>';
	htmlstr += '</div>';
	jQuery('#content-inner').prepend(htmlstr);
	
	box_counter++;
}
function remove_scan_box(scan_box_id){
	jQuery('#send_box_'+scan_box_id).fadeOut();
}
function send_order(scan_box_id){
	jQuery('#send_box_'+scan_box_id).animate({
		opacity: 0,
		left: "+=2000"
	}, 1000, function() {
		jQuery('#send_box_'+scan_box_id).remove();
	});
}

function send_all(){
	found = 0;
	
	jQuery('#send_all').fadeOut();
	jQuery('.scan_box').each(function(){
		var this_id = jQuery(this).attr('this_id');
		send_order(this_id);
	});
}

/*Check connection*/
function checkConnection() {
	//alert("No Internet Connection");
	// check to see if the network is reachable
	//alert('entro');
	var networkState = navigator.connection.type;
	if (networkState=='none'){alert('No Internet Connection');}
	//alert('paso');
	//alert(networkState);
	//document.addEventListener("offline", function(){ navigator.notification.alert("No connection found") }, false);
	//connectionStatus = navigator.connection;
	//alert(connectionStatus[0]);

	
        /*var networkState = navigator.network.connection.type;
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.NONE]     = 'No network connection';
        alert('Connection type: ' + states[networkState]);*/
    }
