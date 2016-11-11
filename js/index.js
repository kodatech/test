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
//var server="www.anzor.co.nz";
var server="davis.dev.kodait.com";
var server2;
var ref;

var app;
app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        //document.getElementById('scan').addEventListener('click', this.scan, false);
        //document.getElementById('encode').addEventListener('click', this.encode, false);
    },

    // deviceready Event Handler
    //
    // The scope of `this` is the event. In order to call the `receivedEvent`
    // function, we must explicity call `app.receivedEvent(...);`
    //
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        //window.open = cordova.InAppBrowser.open;
        iniEvents();


    },


    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }


};

var box_counter = 0;
var found = 0;
var items=new Array();
if (server2==undefined){
    /*if (localStorage.getItem("items")!=null){items=localStorage.items.split(",");}
     if (localStorage.box_counter!=null){box_counter=localStorage.box_counter;}
     alert (items);//vacio//vacio
     alert (box_counter);//undefined//undefined*/
}



function iniEvents(){
    //document.getElementById('login').addEventListener('click', validate, false);
    document.addEventListener('offline', checkConnection, false);
    $(document).ajaxSend(function () {
        $("#loading").css("display", "block");
        //alert("ajax");
    })
    $(document).ajaxComplete(function () {
        $("#loading").css("display", "none");
    });
    //noinspection JSUnresolvedFunction
    if (localStorage.name!=""){
        $("#content-inner").css("display", "none");
        $("#usr").val(localStorage.name);
        $("#pass").val(localStorage.pass);
        if($("#usr").val()!=''){
            $("#login").trigger("click");
        }

    }
    //$(".line-item-summary").hide();
    //$("#content-inner").css("display", "none");
    document.addEventListener("resume", function() { localStorage.removeItem("usr"); }, false);
    //document.addEventListener("unload", function() { localStorage.removeItem("usr"); }, false);
    checkConnection();




}



function delVariables(){
    localStorage.removeItem("usr");
}

function keyPressEvent(e, obj, stockcode, box_counter) {
    var evt = e || window.event;
    var keyPressed = evt.which || evt.keyCode;

    checkQty(obj, stockcode ,box_counter);
}

function remove_scan_box(scan_box_id){
    //alert(scan_box_id);
    //alert(items);
    //items.splice(scan_box_id, 1);
    for (var i in items){

        if (scan_box_id==i){
            items[i]="";
        }

    }
    localStorage.items=JSON.stringify(items);
    //alert($("#total"+scan_box_id).text());
    //jQuery('#send_box_'+scan_box_id).fadeOut();
    //$("#total").text(parseFloat($("#total").text())-parseFloat($("#total"+scan_box_id).text()));
    $("#total").text(Number((parseFloat($("#total").text())-parseFloat($("#total"+scan_box_id).text())).toFixed(4)));
    $("#items").text(parseFloat($("#items").text())-1);
    jQuery('#send_box_'+scan_box_id).remove();
    var arraySku=$(".views-field-line-item-label").map(function(){
        return $(this).text();
    }).get();
    if(arraySku.length == 0)
    {
        localStorage.removeItem("st");

    }
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
    jQuery('#price_enquiry').fadeOut();
    jQuery('.scan_box').each(function(){
        var this_id = jQuery(this).attr('this_id');
        send_order(this_id);
    });
}

function handleOpenURL(url) {
    setTimeout(function() {
        $(".afterScanProduct").fadeOut(1500);
    },10000);
    setTimeout(function() {

        var incomingUrl=url.substring(13);
        server2=incomingUrl;
        //alert("el path es: " + incomingUrl);
        //alert("received url: " + url);
        scan();
    }, 0);
}

/*function to recharge the app when the connection is broke*/
function rechargable(){
    window.location.reload();
}


/*User validation*/
function validate(){
    var url = 'http://'+server+'/davis_services/login';
    var usr = $("#usr").val();// btoa atob(encodedData);
    var pass = $("#pass").val();


    return $.ajax({
        type: "GET",
        data: { name: usr, pass : pass} ,
        url: url,
        timeout: 60 * 1000,
        //async:false
    }).done(function (data) {

        if (data){
           openHomePage();

        }else{
            msg("alert-warning", "User or Password are wrong.", "Try again!");
        }
    }).fail(function (a, b, c) {
        console.log(b + '|' + c);
    });



    //openHomePage();

}



/*Product validation*/
function validateProduct(barCode){
    var url = 'http://'+server+'/anzor_services/product';

    $("#to_hide3").css("display","none");
    $("#to_hide2").css("display","none");
    $("#start_scan").removeClass("col-xs-12").addClass( "col-xs-9" );

    //$("#scan").html('<img src="img/search.svg">Add product</a>');
    //<a id="scan" href="#" class="btn btn-default scan"><img src="img/search.svg">Start scanning</a>
    $("#start_scan").html('<a id="scan" href="#" class="btn btn-default scan"><img src="img/search.svg">Add product</a>');

    $('#addimg .col-xs-3').remove();
    $("#addimg").prepend('<div class="logo small col-xs-3"><img onclick="openCurrentPage()" src="img/anzor_logo_s.png"></div>');
    $("#bar_code").addClass("fixed");

    $('#scan').click(scan);

    var uid=$("#uid").val();
    //alert(uid);
    return $.ajax({
        type: "GET",
        data: { barCode: barCode, uid : uid} ,
        url: url,
        timeout: 60 * 1000
    }).done(function (data) {
        if (data){
            //alert($("#prodListId").html().length<1)
            //alert(localStorage.getItem("st")!=null)
            addCartReturningWeb();


            var pos=items.indexOf(data[0]['stockcode']);
            if (pos==-1){
                items.push(data[0]['stockcode']);
                //localStorage.items= JSON.stringify(items);
                if (localStorage.getItem("items")!=null){
                    var aux=JSON.parse(localStorage.getItem("items"));
                    aux.push(data[0]['stockcode']);
                    localStorage.items= JSON.stringify(aux);
                }else{
                    localStorage.items=JSON.stringify(items);
                }

                //alert(items.length)

                load_new_scan(data);
            }else{

                //alert (items);
                changeQty(pos);
                //alert ("llamo a funcion para agregar uno a la linea existente");
            }

        }else{
            addCartReturningWeb();
            msg("alert-warning", "Wrong product.", "Try again!");
            //aca deberia hacer visible el pie
            $("#content-inner").show();

        }


        //$('#edit-actions').click(alert('hi'));
        //openWebCart();
    }).fail(function (a, b, c) {
        console.log(b + '|' + c);
    });
}

function addCartReturningWeb(){
    if($("#prodListId").html().length<1 && localStorage.getItem("st")!=null){
        $("#content-inner").show();
        //alert("cargar #content-inner");
        $("#content-inner").html(localStorage.st);
        //alert("cargar items");
        items=JSON.parse(localStorage.getItem("items"));
        //alert(JSON.parse(localStorage.getItem("items")));

        //alert("box_counter");
        box_counter=localStorage.box;
    }
    return;
}

function load_new_scan(data){
    if (data) {
        found = 1;
        //$(".line-item-summary").show();
        $("#content-inner").show();
        jQuery('#send_all').fadeIn();
        jQuery('#price_enquiry').fadeIn();
        var stockcode = data[0]['stockcode'];
        // || localStorage.items.indexOf(stockcode)==-1
        //if (localStorage.getItem("items")==null ){

        //if (localStorage.getItem("items")==null || items.indexOf(stockcode)==-1){
        //localStorage.items= JSON.stringify(items);
        //alert("items tiene: "+localStorage.getItem("items"));
        /*if(localStorage.getItem("st")!=null){
         jQuery('#content-inner').html(localStorage.st);
         }*/

        var htmlstr = '<div class="views-row views-row-1 views-row-odd views-row-first prodrow out-top" this_id="' + box_counter + '" id="send_box_' + box_counter + '">';
        htmlstr += '<div class="views-field views-field-nothing-1"><span class="field-content">';

        htmlstr += '<div class="cartprodname">';
        htmlstr += '<div class="views-field-line-item-title">' + data[0]['description'] + '</div>';
        htmlstr += '<div class="views-field-line-item-label">' + data[0]['stockcode'] + '</div>';
        htmlstr += '</div></span>';
        htmlstr += '</div>';
        htmlstr += '<div class="views-field views-field-edit-delete"><span class="field-content">';
        htmlstr += '<a href="#" onClick="remove_scan_box(' + box_counter + ')" class="delete-line-item btn btn-default form-submit"><img src="img/delete.svg"></a></span>';
        htmlstr += '</div>';
        htmlstr += '<div class="clearfix"></div>';


        htmlstr += '<div class="views-field views-field-edit-quantity">';
        htmlstr += '<span class="views-label views-label-edit-quantity">Qty:</span>';
        htmlstr += '<span class="views-label views-label-edit-quantity">' +
            '<div class="form-item form-item-edit-quantity-0 form-type-textfield form-group">' +
            '<input title="Qty:  &nbsp;"  class="form-control form-text ajax-processed" type="text" id="qty_' + box_counter + '" onKeyUp="keyPressEvent(event, this,\'' + stockcode + '\',\'' + box_counter + '\')"  value="1" size="4">' +
            '</div>' +
            '</span>' +
            '</div>';

        htmlstr += '<div class="views-field views-field-commerce-unit-price">' +
            '<span class="views-label views-label-commerce-unit-price"> x </span>' +
            '<div id="price' + box_counter + '" class="field-content">' + data[0]['sell_price_1'] + '</div>' +
            '</div>';


        htmlstr += '<div class="views-field views-field-commerce-total"><span class="views-label views-label-commerce-total"> = </span>';

        htmlstr += '<div class="field-content price" id="total' + box_counter + '" class="field-content price">' + data[0]['sell_price_1'] + '</div>';
        htmlstr += '</div>';

        htmlstr += '<div class="clearfix"></div>';
        htmlstr += '</div>';

        //alert(JSON.parse(localStorage.getItem("items")));

        //jQuery('#prodListId').prepend(localStorage.st);


        jQuery('#prodListId').prepend(htmlstr);



        if ($("#total").text() == "") {
            $("#total").text(data[0]['sell_price_1']);
            $("#items").text(1);
        } else {

            var aux = $("#total").text();
            aux = parseFloat(aux) + parseFloat(data[0]['sell_price_1']);
            $("#total").text(aux.toFixed(4));
            var auxItems = parseInt($("#items").text());
            auxItems++;
            $("#items").text(auxItems);
        }

        localStorage.st=$("#content-inner").html();
        box_counter++;
        localStorage.box=box_counter;
        //localStorage.box_counter=box_counter++;
        //}else{
        //    alert("hi");
        //}

    }else{
        //alert("wrong product");
        msg("alert-warning", "Wrong product.", "Try again!");
    }
}


function changeQty(pos){
    var auxLinea=parseFloat($("#total"+pos).text());
    var idaux='qty_'+pos+'';
    var id='qty_'+pos+'';
    var qty=parseInt($("#"+id).val())+1;
    //alert(qty);
    $("#"+id).val(qty);
    id='total'+pos+'';
    var idprice='price'+pos+'';
    var tot=parseFloat($("#"+idprice).text()*qty);
    $("#"+id).text(tot.toFixed(4));
    //alert($("#"+idaux).val());

//alert("idaux: "+idaux);
    $("#"+idaux).attr("value",qty);


    //var auxLinea=parseFloat($("#total"+box_counter).text());
    //$("#total"+box_counter).text(data[0]['price']);
    var aux=$("#total").text();
    aux=parseFloat(aux)+tot-parseFloat(auxLinea);
    aux=aux.toFixed(4);
    $("#total").text(aux);


    localStorage.st=$("#content-inner").html();
}


function openHomePage(){
 /*   var uid = $("#uid").val();// btoa atob(encodedData);
    var url = 'http://'+server+'/anzor_services/home';
    return $.ajax({
        type: "GET",
        data: {uid:uid},
        url: url,
        timeout: 60 * 1000
    }).done(function (data) {
        if (data){
            //if (localStorage.usr!=uid){
            if (server2==undefined){
                localStorage.usr=uid;

                //ref=window.open('http://'+server+'','_system');

//alert('http://'+server+'/anzor_services/redirhome?uid='+uid+'','_blank','location=no');
                //ref=cordova.InAppBrowser.open('http://'+server+'/anzor_services/redirhome?uid='+uid+'','_blank','location=no');//

                ref=window.open('http://'+server+'/anzor_services/redirhome?uid='+uid+'','_system');//





            }else{
                //$("#scan").trigger("click");
                //scan();
                return;
            }
        }else{
            alert("sth goes wrong");
        }
    }).fail(function (a, b, c) {
        console.log(b + '|' + c);
    });

*/

    ref=window.open('http://davis.dev.kodait.com/','_system');

}



function openHomePageFromMobileListProducts(){
    openHomePage();
    //window.open('http://'+server+'','_system');
    //ref.focus();
}
function checkOut(){
    var url = 'http://'+server+'/anzor_services/checkout';
    var uid=$("#uid").val();
    //alert("hello");
    //skuArray=$("#views-field-line-item-label").text();

    var arraySku=$(".views-field-line-item-label").map(function(){
        return $(this).text();
    }).get();
    var arrayQtySku=$(".form-control.form-text.ajax-processed").map(function(){
        return $(this).val();
    }).get();

    if (arraySku.length == 0){
        msg("alert-danger", "The list is empty. No products added to the cart.", "Alert!");
        return;
    }

    //var barcode="9420019451401";
    return $.ajax({
        type: "GET",
        data: { skuQty:arrayQtySku, sku:arraySku, uid : uid} ,
        url: url,
        timeout: 60 * 1000
    }).done(function (data) {



        $('#prodListId').empty();



        $('#items').text("0 ");
        $('#total').text(" 0");
        //alert("products successfuly added to the cart");
        msg("alert-success", "Products successfuly added to the cart", "Success!");


        reinicializar();

    }).fail(function (a, b, c) {
        console.log(b + '|' + c);
    });
}

function _delete(){
    $(this).remove();
}
function logOut(){
    localStorage.clear();
    $("#remember :checkbox").attr('checked', false);
    rechargable();
}
function closeWindow(){
    navigator.app.exitApp();
    navigator.device.exitApp();
    return TRUE;
}

function openCurrentPage(){
    //ref=cordova.InAppBrowser.open(server2,'_blank','location=no');
    ref=window.open(server2,'_system');//
}


function msg(parClass, parMsg, parMsgStrong ){

    var htmlstr='<div class="alert '+parClass+'"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>'+parMsgStrong+'</strong> '+parMsg+'</div>';
    if ($(".alert."+parClass).length){
        $(".alert."+parClass).remove();
    }
    $(".content").prepend(htmlstr);
    $(".alert.alert-warning").click(_delete);
    setTimeout(function() {   //calls click event after a certain time
        if($(".alert."+parClass).length)
        {
            $(".alert." + parClass).remove();
        }
    }, 3000);
}


/*scanning and encoding */
function scan() {
    console.log('scanning');

    //var scanner = cordova.require("cordova/plugin/BarcodeScanner");


    //scanner.scan( function (result) {
    cordova.plugins.barcodeScanner.scan( function (result) {

            validateProduct(result.text);



        }, function (error) {
            console.log("Scanning failed: ", error);
        },
        {
            "prompt": "Place a barcode inside the viewfinder rectangle to scan it. To go back press the return button below.",
            "orientation" : "portrait" // Android only (portrait|landscape), default unset so it rotates with the device
        });
}

function encode() {
    //var scanner = cordova.require("cordova/plugin/BarcodeScanner");

    //scanner.encode(scanner.Encode.TEXT_TYPE, "http://www.nhl.com", function(success) {
    cordova.plugins.barcodeScanner.encode(cordova.plugins.barcodeScanner.Encode.TEXT_TYPE, "http://www.nytimes.com", function(success) {

            alert("encode success: " + success);
        }, function(fail) {
            alert("encoding failed: " + fail);
        }
    );

}


/*Check connection internet*/
function checkConnection() {
    //alert("No Internet Connection");
    // check to see if the network is reachable
    //alert('entro');
    var networkState = navigator.connection.type;
    if (networkState=='none'){
        //alert('No Internet Connection');
        var htmlstr='<div id="msgNoConn">';
        htmlstr+='<p>Cannot establish connection</p>';
        htmlstr+='<p>with the Anzor server.</p>';
        htmlstr+='<br><br>';
        htmlstr+='<p>You need to be</p>';
        htmlstr+='<p>connected to the Internet</p>';
        htmlstr+='<br><br>';
        htmlstr+='<input type="button" id="recharge" value="Try again">';
        htmlstr+='</div>';
        jQuery('.content').html(htmlstr);
        document.getElementById('recharge').addEventListener('click', rechargable, false);
    }

}

/*calculate the price per line*/
function checkQty(obj, stockcode, box_counter){
    //alert($(obj).val());
    //alert(stockcode);
    //alert("checkQty");

    var stock=stockcode;
    var usr = $("#usr").val();// btoa atob(encodedData);
    var pass = $("#pass").val();
    var qty = $(obj).val();
    $(obj).attr('value', qty);
    var url = 'http://'+server+'/anzor_services/price';
    var uid=$("#uid").val();//data[0]['uid'];
    //alert (usr);
    //alert (pass);
    var price=$('#price'+box_counter).text();
    //alert (price);
    return $.ajax({
        type: "GET",
        data: { name: usr, pass : pass, scode:stock, qty: qty, price:price, uid:uid} ,
        url: url,
        timeout: 60 * 1000
    }).success(function (data) {


        if (data){
            //alert(box_counter);
            var auxLinea=parseFloat($("#total"+box_counter).text());
            $("#total"+box_counter).text(data[0]['price']);
            var aux=$("#total").text();
            aux=parseFloat(aux)+parseFloat(data[0]['price'])-parseFloat(auxLinea);
            aux=aux.toFixed(4);
            $("#total").text(aux);
            localStorage.st=$("#content-inner").html();
        }else{
            alert("sth goes wrong");
        }
    }).fail(function (a, b, c) {
        console.log(b + '|' + c);
    });
}

function openWebCart(){
    var uid = $("#uid").val();// btoa atob(encodedData);
    //var ref=window.open('http://'+server+'/anzor_services/cart?uid='+uid+'', '_system');
    //var ref=window.open('http://'+server+'/anzor_services/cart?uid='+uid+'', '_blank');
    //ref=cordova.InAppBrowser.open('http://'+server+'/anzor_services/cart?uid='+uid+'','_blank','location=no');

    ref=window.open('http://'+server+'/anzor_services/cart?uid='+uid+'','_system');
    // ref.addEventListener( "loadstop", function() {
    //ref.executeScript({ code: "alert( 'hello' );" });
    //});

}

function reinicializar(){
    localStorage.removeItem("st");
    box_counter=0;
    localStorage.removeItem("box");
    localStorage.removeItem("items");
    items.length=0;
}
