/*
 * file 'syntelos-xc.js': Syntelos community library
 * 
 * Copyright (C) 2006 The Syntelos Project.  All rights reserved.
 * 
 * This file licensed under the terms of the BSD License.  As
 * according to the terms of the BSD License: copying is only
 * permitted with this copyright, license, author and version
 * statement intact (included and not modified).
 * 
 * @see http://www.syntelos.com/js/docs/
 * @author jdp@syntelos.com
 * @version 20060712
 */
/*
 * Portions (snarfed from 'yui:connection.js' for lib/doc visibility
 * structure)
 * 
 * Copyright (c) 2006, Yahoo! Inc. All rights reserved.
 * Code licensed under the BSD License:
 * http://developer.yahoo.net/yui/license.txt
 */

function Syntelos_XC(){

    this._msxml_progid = ['MSXML2.XMLHTTP.5.0',
			  'MSXML2.XMLHTTP.4.0',
			  'MSXML2.XMLHTTP.3.0',
			  'MSXML2.XMLHTTP',
			  'Microsoft.XMLHTTP'];
    this._http_header = {};
    this._has_http_headers = false;
    this._isFormSubmit = false;
    this._sFormData = null;
    this._poll = [];
    this._polling_interval = 50;
    this._transaction_id = 0;

    /*
     * public
     */
    this.setProgId = _XC_setProgId;
    this.setPollingInterval = _XC_setPollingInterval;
    this.asyncRequest = _XC_asyncRequest;
    this.initHeader = _XC_initHeader;
    this.setForm = _XC_setForm;
    this.abort = _XC_abort;
    this.isCallInProgress = _XC_isCallInProgress;
    this.getXML = _XC_getXML;

    /*
     * private
     */
    this.newXHR = _p_newXHR;
    this.createXhrObject = _p_createXhrObject;
    this.getConnectionObject = _p_getConnectionObject;
    this.handleReadyState = _p_handleReadyState;
    this.handleTransactionResponse = _p_handleTransactionResponse;
    this.createResponseObject = _p_createResponseObject;
    this.createExceptionObject = _p_createExceptionObject;
    this.setHeader = _p_setHeader;
    this.releaseObject = _p_releaseObject;

}
Syntelos.add("Syntelos.XC",Syntelos_XC);

function _XC_setProgId(id){
    this.msxml_progid.unshift(id);
}
function _XC_setPollingInterval(i){
    if ( (typeof i) == 'number' && isFinite(i)){
	this._polling_interval = i;
    }
}
function _p_newXHR(){
    try	{
	// non-IE 
	return new XMLHttpRequest();
    }
    catch(exc){
	for (var i=0; i<this._msxml_progid.length; ++i){
	    try {
		// Instantiates XMLHttpRequest for IE and assign to http.
		return new ActiveXObject(this._msxml_progid[i]);
	    }
	    catch(e){
	    }
	}
	throw new URIException("Unable to instantiate 'XMLHttpRequest'.");
    }
}
function _p_createXhrObject(transactionId){
    var http = this.newXHR();
    var obj = { conn:http, tId:transactionId };
    return obj;
}
function _p_getConnectionObject(){

    var tId = this._transaction_id;
    try {
	var o = this.createXhrObject(tId);
	if (o){
	    this._transaction_id++;
	}
	return o;
    }
    catch(e){
	return null;
    }
}

function _XC_asyncRequest(method, uri, callback, postData){
    var o = this.getConnectionObject();

    if (!o){
	return null;
    }
    else{
	if (this._isFormSubmit){
	    //If the specified HTTP method is GET, setForm() will return an
	    //encoded string that is concatenated to the uri to
	    //create a querystring.
	    if (method == 'GET'){
		uri += "?" +  this._sFormData;
	    }
	    else if (method == 'POST'){
		postData =  this._sFormData;
	    }
	    this._sFormData = '';
	    this._isFormSubmit = false;
	}

	o.conn.open(method, uri, true);

	if (postData){
	    this.initHeader('Content-Type','application/x-www-form-urlencoded');
	}

	//Verify whether the transaction has any user-defined HTTP headers
	//and set them.
	if (this._has_http_headers){
	    this.setHeader(o);
	}

	this.handleReadyState(o, callback);
	postData?o.conn.send(postData):o.conn.send(null);

	return o;
    }
}
function _p_handleReadyState(o, callback){
    var oConn = this;
    try	{
	this._poll[o.tId] = window.setInterval(
				         function(){
					     if (o.conn && o.conn.readyState == 4){
						 window.clearInterval(oConn._poll[o.tId]);
						 oConn._poll.splice(o.tId);
						 oConn.handleTransactionResponse(o, callback);
					     }
					 }
					 ,this._polling_interval);
    }
    catch(e){
	window.clearInterval(oConn._poll[o.tId]);
	oConn._poll.splice(o.tId);
	oConn.handleTransactionResponse(o, callback);
    }
}

function _p_handleTransactionResponse(o, callback){
    // If no valid callback is provided, then do not process any callback handling.
    if (!callback){
	this.releaseObject(o);
	return;
    }
    else {
	var httpStatus;
	var responseObject;
	try	{
	    httpStatus = o.conn.status;
	}
	catch(e){
	    // 13030 is the custom code to indicate the condition -- in Mozilla/FF --
	    // when the o object's status and statusText properties are
	    // unavailable, and a query attempt throws an exception.
	    httpStatus = 13030;
	}
	//
	if (httpStatus >= 200 && httpStatus < 300){
	    responseObject = this.createResponseObject(o, callback.argument);
	    if (callback.success){
		if (!callback.scope){
		    callback.success(responseObject);
		}
		else{
		    // If a scope property is defined, the callback will be fired from
		    // the context of the object.
		    callback.success.apply(callback.scope, [responseObject]);
		}
	    }
	}
	else{
	    switch(httpStatus){
		// The following case labels are wininet.dll error codes that may be encountered.
		// Server timeout
	    case 12002:
		// 12029 to 12031 correspond to dropped connections.
	    case 12029:
	    case 12030:
	    case 12031:
		// Connection closed by server.
	    case 12152:
		// See above comments for variable status.
	    case 13030:
		responseObject = this.createExceptionObject(o, callback.argument);
		if (callback.failure){
		    if (!callback.scope){
			callback.failure(responseObject);
		    }
		    else{
			callback.failure.apply(callback.scope,[responseObject]);
		    }
		}
		break;
	    default:
		responseObject = this.createResponseObject(o, callback.argument);
		if (callback.failure){
		    if (!callback.scope){
			callback.failure(responseObject);
		    }
		    else{
			callback.failure.apply(callback.scope,[responseObject]);
		    }
		}
	    }
	}
	this.releaseObject(o);
    }
}
function _p_createResponseObject(o, callbackArg){
    var obj = {};
    var headerObj = {};
    try	{
	var headerStr = o.conn.getAllResponseHeaders();
	var header = headerStr.split("\n");
	for (var i=0; i < header.length; i++){
	    var delimitPos = header[i].indexOf(':');
	    if (delimitPos != -1){
		headerObj[header[i].substring(0,delimitPos)] = header[i].substring(delimitPos+1);
	    }
	}
	obj.tId = o.tId;
	obj.status = o.conn.status;
	obj.statusText = o.conn.statusText;
	obj.getResponseHeader = headerObj;
	obj.getAllResponseHeaders = headerStr;
	obj.responseText = o.conn.responseText;
	obj.responseXML = o.conn.responseXML;
	if (typeof callbackArg !== undefined){
	    obj.argument = callbackArg;
	}
	return obj;
    }
    catch (e){
	return obj;
    }
}
function _p_createExceptionObject(tId, callbackArg){
    var COMM_CODE = 0;
    var COMM_ERROR = 'communication failure';

    var obj = {};

    obj.tId = tId;
    obj.status = COMM_CODE;
    obj.statusText = COMM_ERROR;
    if (callbackArg){
	obj.argument = callbackArg;
    }

    return obj;
}
function _XC_initHeader(label,value){
    if (this._http_header[label] === undefined){
	this._http_header[label] = value;
    }
    else {
	this._http_header[label] =  value + "," + this._http_header[label];
    }
    this._has_http_headers = true;
}
function _p_setHeader(o){
    for (var prop in this._http_header){
	o.conn.setRequestHeader(prop, this._http_header[prop]);
    }
    delete this._http_header;
    this._http_header = {};
    this._has_http_headers = false;
}
function _XC_setForm(formId){
    this._sFormData = '';
    if (typeof formId == 'string'){
	// Determine if the argument is a form id or a form name.
	// Note form name usage is deprecated by supported
	// here for legacy reasons.
	var oForm = (document.getElementById(formId) || document.forms[formId] );
    }
    else if (typeof formId == 'object'){
	var oForm = formId;
    }
    else{
	return;
    }
    var oElement, oName, oValue, oDisabled;
    var hasSubmit = false;

    // Iterate over the form elements collection to construct the
    // label-value pairs.
    for (var i=0; i<oForm.elements.length; i++){
	oDisabled = oForm.elements[i].disabled;
	// If the name attribute is not populated, the form field's
	// value will not be submitted.
	if (oForm.elements[i].name != ""){
	    oElement = oForm.elements[i];
	    oName = oForm.elements[i].name;
	    oValue = oForm.elements[i].value;
	}

	// Do not submit fields that are disabled.
	if (!oDisabled){
	    switch (oElement.type){
	    case 'select-one':
	    case 'select-multiple':
		for (var j=0; j<oElement.options.length; j++){
		    if (oElement.options[j].selected){
			this._sFormData += encodeURIComponent(oName) + '=' + encodeURIComponent(oElement.options[j].value || oElement.options[j].text) + '&';
		    }
		}
		break;
	    case 'radio':
	    case 'checkbox':
		if (oElement.checked){
		    this._sFormData += encodeURIComponent(oName) + '=' + encodeURIComponent(oValue) + '&';
		}
		break;
	    case 'file':
		//	this._sFormData += encodeURIComponent(oName) + '=' + encodeURIComponent(oValue) + '&';
		// stub case as XMLHttpRequest will only send the file path as a string.
	    case undefined:
		// stub case for fieldset element which returns undefined.
	    case 'reset':
		// stub case for input type reset button.
	    case 'button':
		// stub case for input type button elements.
		break;
	    case 'submit':
		if (hasSubmit == false){
		    this._sFormData += encodeURIComponent(oName) + '=' + encodeURIComponent(oValue) + '&';
		    hasSubmit = true;
		}
		break;
	    default:
		this._sFormData += encodeURIComponent(oName) + '=' + encodeURIComponent(oValue) + '&';
		break;
	    }
	}
    }
    this._isFormSubmit = true;
    this._sFormData = this._sFormData.substr(0, this._sFormData.length - 1);
}
function _XC_abort(o){
    if (this.isCallInProgress(o)){
	window.clearInterval(this._poll[o.tId]);
	this._poll.splice(o.tId);
	o.conn.abort();
	this.releaseObject(o);
	return true;
    }
    else {
	return false;
    }
}

function _XC_isCallInProgress(o){
    // if the XHR object assigned to the transaction has not been dereferenced,
    // then check its readyState status.  Otherwise, return false.
    if (o.conn){
	return o.conn.readyState != 4 && o.conn.readyState != 0;
    }
    else{
	//The XHR object has been destroyed.
	return false;
    }
}
function _p_releaseObject(o){
    //dereference the XHR instance.
    o.conn = null;
    //dereference the connection object.
    o = null;
}
function _XC_getXML(uri){
    var xhr = this.newXHR();
    xhr.open('GET',uri,false);
    xhr.send(null);
    try {
	if ( 199 < xhr.status || 300 > xhr.status)
	    return xhr.responseXML;
	else {
	    switch(xhr.status){
	    case 12002:
		throw new State("Timeout");
	    case 12029:
	    case 12030:
	    case 12031:
		throw new State("Dropped");
	    case 12152:
		throw new State("Closed");

	    default:
		return xhr.responseXML;
	    }
	}
    }
    catch (exc){
	if (exc instanceof State)
	    throw exc;
	else
	    throw new State(exc);
    }
}

/*
 * lib public initialisation
 */
Syntelos.add("Syntelos.XC.Instance",new Syntelos_XC());
Syntelos.add("Syntelos.XC.Instance.setPollingInterval",_XC_setPollingInterval);
Syntelos.add("Syntelos.XC.Instance.asyncRequest",_XC_asyncRequest);
Syntelos.add("Syntelos.XC.Instance.initHeader",_XC_initHeader);
Syntelos.add("Syntelos.XC.Instance.setForm",_XC_setForm);
Syntelos.add("Syntelos.XC.Instance.abort",_XC_abort);
Syntelos.add("Syntelos.XC.Instance.isCallInProgress",_XC_isCallInProgress);
Syntelos.add("Syntelos.XC.Instance.setProgId",_XC_setProgId);
Syntelos.add("Syntelos.XC.Instance.getXML",_XC_getXML);
