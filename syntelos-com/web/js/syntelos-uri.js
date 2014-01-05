/*
 * file 'syntelos-uri.js': Syntelos community library
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

function Syntelos_URI_basename(){
    var string = document.location.pathname;
    //
    if (!(string instanceof String))
	string = new String(string);
    var idx = string.lastIndexOf('/');
    if (-1 < idx){
	string = string.slice(idx+1);
    }
    idx = string.lastIndexOf('.');
    if (-1 < idx){
	string = string.slice(0,idx);
    }
    return string;
}
Syntelos_add("Syntelos.URI.basename",Syntelos_URI_basename);

function Syntelos_URI_dirname(){
    var string = document.location.href;
    //
    if (!(string instanceof String))
	string = new String(string);
    var idx = string.lastIndexOf('/');
    if (0 < idx){
	var hostn = document.location.hostName;
	if (hostn){
	    var test = string.indexOf(hostn);
	    if (test < idx)
		string = string.slice(0,idx);
	}
	else
	    string = string.slice(0,idx);
    }
    return string;
}
Syntelos_add("Syntelos.URI.dirname",Syntelos_URI_dirname);

