/*
 * Copyright (c) 2007, John Pritchard
 * Copyright (c) 2007, Syntelos Software Community Organization
 * 
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or
 * without modification, are permitted provided that the
 * following conditions are met:
 * 
 *     * Redistributions of source code must retain the above
 *       copyright notice, this list of conditions and the
 *       following disclaimer.
 * 
 *     * Redistributions in binary form must reproduce the above
 *       copyright notice, this list of conditions and the
 *       following disclaimer in the documentation and/or other
 *       materials provided with the distribution.
 * 
 *     * Neither the name "Syntelos" nor the names of its
 *       contributors may be used to endorse or promote products
 *       derived from this software without specific prior
 *       written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND
 * CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 * NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 */


/**
 * @constructor
 * @param a Optional "source" DOM node or Syntelos annotated Class or
 * Function
 * @param b Message string 
 */
function Exception(a,b){
    if (b){
        this.source = a;
        this.message = b;
        this.superc(b);
    }
    else {
        this.source = null;
        this.message = a;
        this.superc(a);
    }
}
Exception.prototype = new Error();
Exception.prototype.superc = Error;
Exception.prototype.getMessage = function(){
    return this.message;
}
Exception.prototype.getSource = function(){
    return this.source;
}

/**
 * @constructor
 * @param a Optional "source" DOM node or Syntelos annotated Class or
 * Function
 * @param b Message string 
 */
function Argument(a,b){
    this.superc(a,b);
}
Argument.prototype = new Exception();
Argument.prototype.superc = Exception;

/**
 * @constructor
 * @param a Optional "source" DOM node or Syntelos annotated Class or
 * Function
 * @param b Message string 
 */
function State(a,b){
    this.superc(a,b);
}
State.prototype = new Exception()
State.prototype.superc = Exception;

/**
 * @constructor
 * @param a Optional "source" DOM node or Syntelos annotated Class or
 * Function
 * @param b Message string 
 */
function Bug(a,b){
    this.superc(a,b);
}
Bug.prototype = new Exception();
Bug.prototype.superc = Exception;

/**
 * Concatenate the elements of 'ary' with the infix separator 'sep'
 */
function Syntelos_cat(ary, sep){
    if (ary && ary.length){
        if (!sep)
            sep = '';
        var re = '', el;
        for (var idx = 0, len = (ary.length); idx < len; idx++){
            el = ary[idx];
            if (el){
                if (0 < idx)
                    re = re.concat(sep,el);
                else
                    re = el;
            }
        }
        if (0 < re.length)
            return re;
    }
    return null;
}
/**
 * Concatenate 'a' and 'b' ensuring one and only one '/' infixed
 * between them.
 */
function Syntelos_fcat(a,b){
    if (a){
        if (b){
            if ('/' == a.charAt(a.length-1)){
                if ('/' == b.charAt(0)){

                    return a+b.substring(1);
                }
                else
                    return a+b;
            }
            else if ('/' == b.charAt(0)){

                return a+b;
            }
            else
                return a+'/'+b;
        }
        else
            return a;
    }
    else
        return b;
}
/**
 * @param string XML source text string
 * @return XML string as safe for textarea content
 */
function Syntelos_edit(string){
    if (string){
        var re = '';
        var count = string.length;
        var ch;
        for (var cc = 0; cc < count; cc++){
            ch = string.charAt(cc);
            switch (ch){
            case '<':
                re += '&lt;';
                break;
            case '>':
                re += '&gt;\n';
                break;
            case '&':
                re += '&amp;';
                break;
            default:
                re += ch;
                break;
            }
        }
        return re;
    }
    else
        return '';
}
/**
 * 
 */
function Syntelos_lookup(qname){
    if (qname == "Syntelos")
        return Syntelos;
    else if (qname && (0 == qname.indexOf("Syntelos."))){
        var namespace = qname.split('.');
        var member = Syntelos, lname;
        for (var idx = 1, len = namespace.length; member && idx < len; idx++){
            lname = namespace[idx];
            member = member[lname];
        }
        return member;
    }
    else
        return null;
}

/**
 * Define prototype (class) of 'sub' extending super class 'sup' for
 * using 'new' operator.  As for example, 'new sub()'.
 * 
 * @param sub Future subclass of 'sup' is a function
 * @param sup Optional superclass of 'sub' is a function (otherwise return 'sub' as input)
 * 
 * @return Sub modified with 'sup' when input.
 */
function Syntelos_extend(sub, sup){
    if (sub instanceof Function){
        /*
         * Define prototype (class) using a typical pattern (as in
         * 'yahoo.js' for built-in 'new' operator, but not
         * 'prototype.js' for 'Class.create' usage).
         */
        var inn = function(){};
        if (sup)
            inn.prototype = sup.prototype;
        else
            inn.prototype = Object.prototype;

        sub.prototype = new inn();
        /*
         * Define prototype constructor
         */
        sub.prototype.constructor = sub;

        if (sup instanceof Function){
            /*
             * Define 'superclass' in prototype so it persists after
             * 'new'.  Differs from 'YAHOO.extend()' in maintaining
             * 'superclass' in instances created by 'new'.
             *
             * Permits chaining constructors with
             * 
             *  function ctor(a,b){
             *    if (this.prototype.constructor != this.superclass.constructor)
             *      this.superclass.constructor.call(this,a,b);
             *  }
             */
            sub.prototype.superclass = sup.prototype;
        }
        else
            sub.prototype.superclass = Object.prototype;
    }
    return sub;
}
/**
 * 
 */
function Syntelos_isFunction(fun){
    return (fun instanceof Function);
}
/**
 * 
 */
function Syntelos_isNotFunction(fun){
    return (!(fun instanceof Function));
}
/**
 * 
 */
function Syntelos_isClass(fun){
    return (fun instanceof Function && fun.isClass);// && fun.prototype && fun.prototype != Object.prototype
}
/**
 * 
 */
function Syntelos_isNotClass(fun){
    return (!Syntelos_isClass(fun));
}
/**
 * 
 */
function Syntelos_addClass(qname, fun, superf){
    if (fun instanceof Function){
        fun = Syntelos_extend(fun,superf);
        fun.isClass = true;
        fun.prototype.fromClass = true;
        return Syntelos_add(qname,fun);
    }
    else
        throw new Bug("Arg 'fun' is not a function.");
}
/**
 * 
 */
function Syntelos_add(qname, fconst, superf){
    if (qname){
        var namespace = qname.split('.');
        var namespace_len = namespace.length;
        var namespace_trm = (namespace_len - 1);
        var localName = namespace[namespace_trm];
        var canonicalName = Syntelos_cat(namespace,'.');
        var collectionName = Syntelos_cat(namespace.slice(0,namespace_trm),'.');
        var collection = Syntelos_lookup(collectionName);
        if (null == collection){
            Syntelos_add(collectionName, new Object());
            collection = Syntelos_lookup(collectionName);
            if (null == collection){
                /*
                 * Error (bug)
                 */
                throw new Bug("Librarian collection error adding '"+qname+"'.");
            }
            else {
                /*
                 * Init collection 
                 */
                var collection_namespace = collectionName.split('.');
                var collection_namespace_len = collection_namespace.length;
                var collection_namespace_trm = (collection_namespace_len - 1);
                var collection_localName = collection_namespace[collection_namespace_trm];
                var collection_canonicalName = Syntelos_cat(collection_namespace,'.');
                var collection_collectionName = Syntelos_cat(collection_namespace.slice(0,collection_namespace_trm),'.');
                collection.localName = collection_localName;
                collection.canonicalName = collection_canonicalName;
                collection.collectionName = collection_collectionName;
            }
        }
        //
        collection.collectionLeaf = false;
        //
        if (!(fconst instanceof Object)){
            switch (typeof(fconst)){
            //case bool//(#spl@t!)

            case 'string':
                fconst = new String(fconst);
                break;
            case 'number':
                fconst = new Number(fconst);
                break;
            default:
                break;
            }
        }
        /*
         * Install
         */
        if (Syntelos_isClass(collection)){

            collection.prototype[localName] = fconst;
        }
        else {
            collection[localName] = fconst;
        }
        /*
         * Init collection member
         */
        if (fconst instanceof Object){
            fconst.collectionLeaf = true;
            fconst.localName = localName;
            fconst.canonicalName = canonicalName;
            fconst.collectionName = collectionName;
        }
        /*
         * Installed (ok)
         */
        return fconst;
    }
    else
        throw new Exception("Librarian error adding '"+qname+"' with bad argument.");
}

function Syntelos_valueOf(dom,name){
    if (dom && name){
        var lln = dom.localName;
        if (lln == name){
            var value = dom.firstChild;
            if (value){
                value = value.nodeValue;
                if (value)
                    return value;
            }
        }
        else if (0 < dom.childNodes.length){
            var children = dom.childNodes;
            for (var cc = 0, len = children.length; cc < len; cc++){
                var child = children.item(cc);
                var value = Syntelos_valueOf(child,name);
                if ('' != value)
                    return value;
            }
        }
    }
    return '';
}
function Syntelos_setValue(dom,name,value){
    if (dom && name && value){
        var lln = dom.localName;
        if (lln == name){
            if (dom.firstChild){
                dom.firstChild.nodeValue = value;
                return true;
            }
            else {
                var doc = dom.ownerDocument;
                var node = doc.createTextNode(value);
                dom.appendChild(node);
                return true;
            }
        }
        else if (0 < dom.childNodes.length){
            var children = dom.childNodes;
            for (var cc = 0, len = children.length; cc < len; cc++){
                var child = children.item(cc);
                if (Syntelos_setValue(child,name,value))
                    return true;
            }
        }
    }
    return false;
}

/*
 * Bootstrap "Syntelos" community library.  Note the special case of the
 * first 'add' for lib function 'add'.
 */
var Syntelos = window.Syntelos || { localName : "Syntelos",
                                    canonicalName : "Syntelos",
                                    collectionName : '.',
                                    collectionLeaf : false };

Syntelos_add("Syntelos.add",Syntelos_add);

Syntelos.add("Syntelos.addClass",Syntelos_addClass);

Syntelos.add("Syntelos.isFunction",Syntelos_isFunction);

Syntelos.add("Syntelos.isNotFunction",Syntelos_isNotFunction);

Syntelos.add("Syntelos.isClass",Syntelos_isClass);

Syntelos.add("Syntelos.isNotClass",Syntelos_isNotClass);

Syntelos.add("Syntelos.extend",Syntelos_extend);

Syntelos.add("Syntelos.lookup",Syntelos_lookup);

Syntelos.add("Syntelos.cat",Syntelos_cat);

Syntelos.add("Syntelos.fcat",Syntelos_fcat);

Syntelos.add("Syntelos.edit",Syntelos_edit);

Syntelos.add("Syntelos.XLink.xmlns","http://www.w3.org/1999/xlink");

Syntelos.add("Syntelos.valueOf",Syntelos_valueOf);

Syntelos.add("Syntelos.setValue",Syntelos_setValue);

/**
 * This error handler called from a (try) catch block is a stub
 * intended to be replaced by the client graphical environment.  For
 * one, see 'syntelos-tabs.js' function 'Syntelos_tabs_tool_error'.
 * This method defined here just rethrows the argument error.
 * 
 * @param e Error caught by catch statement.
 */
function Syntelos_error(e){
    throw e;
}
Syntelos.add('Syntelos.error',Syntelos_error);

/**
 * 
 */
function Syntelos_net(response){
    if (response instanceof Function){
        this.response = response;
        this.xhr = new XMLHttpRequest();
        this.xhr.onreadystatechange = function(){
            var nn = Syntelos.net.client.pop();
            if (nn){
                var xhr = nn.xhr;
                if (xhr){
                    if (4 == nn.xhr.readyState){
                        nn.response.call(nn,xhr);
                    }
                    else {
                        Syntelos.net.client.push(nn);
                    }
                }
                else {
                    throw new Bug("Missing 'net.xhr'.");
                }
            }
            else {
                throw new Bug("Missing 'net' instance.");
            }
        };
    }
}
Syntelos_addClass("Syntelos.net", Syntelos_net);

Syntelos_add("Syntelos.net.ua", "Syntelos.net/1.0");

Syntelos.net.client = new Array();

/**
 * 
 */
function Syntelos_net_open(method,url){
    if (method && url){
        this.method = method;
        this.source = url;
        this.xhr.method = method;
        this.xhr.source = url;
        Syntelos.net.client.push(this);
        this.xhr.open(method,url);
        this.xhr.setRequestHeader("Client",Syntelos.net.ua);
        this.xhr.setRequestHeader("If-Modified-Since", '0');
        this.xhr.setRequestHeader("If-Unmodified-Since", '0');
    }
    else
        throw new Bug("(Syntelos.net.open) missing 'method' or 'url'.");
}
Syntelos_add("Syntelos.net.open", Syntelos_net_open);

/**
 * 
 */
function Syntelos_net_send(){
    if (this.xhr){

        this.xhr.send.apply(this.xhr,arguments);
    }
    else
        throw new Bug("(Syntelos.net.send) missing xhr");
}
Syntelos_add("Syntelos.net.send", Syntelos_net_send);

/**
 * <p> Evaluate script at a later time inteded to permit the calling
 * thread to load new DOM into the window document.
 * </p>
 * 
 * @param script Optional JavaScript source code for subsequent
 * execution in the global (window) context
 */
function Syntelos_ps_exec(script){
    if (script){
        window.setTimeout(script,Syntelos.ps.delay);
    }
}
Syntelos.add('Syntelos.ps.exec',Syntelos_ps_exec);
Syntelos.add('Syntelos.ps.delay',333);

/**
 * <p> Load and then evaluate script from 'ref', and then subsequently
 * evaluate 'post'.  </p>
 * 
 * @param ref Relative or absolute URL for JS source code that 'post'
 * depends on.
 * @param post Optional JS source code string to evaluate after 'ref'
 * loads.
 */
function Syntelos_load(ref,post){
    if (ref instanceof Array){
        for (var rc = 0; rc < ref.length; rc++){
            var src = ref[rc];
            var id = escape(src);
            var script = document.getElementById(id);
            if (null == script){
                script = document.createElement('script');
                script.setAttribute('id',id);
                script.type = 'text/javascript';
                script.src = src;
                window.document.head.appendChild(script);
            }
        }
    }
    else {
        var id = escape(src);
        var script = document.getElementById(id);
        if (null == script){
            script = document.createElement('script');
            script.setAttribute('id',id);
            script.type = 'text/javascript';
            script.src = ref;
            window.document.head.appendChild(script);
        }
    }
    if (post){
        window.setTimeout(post,Syntelos.ps.delay);
    }
}
Syntelos.add('Syntelos.load',Syntelos_load);

/**
 * <p> This function is a stub intended to be replaced by top level
 * code as in 'tabs' to initialize the presentation environment.
 * </p>
 * 
 * @return Boolean from <code>Syntelos.compatible()</code>
 */
function Syntelos_init(){
    return Syntelos.compatible();
}
Syntelos.add('Syntelos.init',Syntelos_init);

/**
 * <p> This is called once by <code>Syntelos.init</code> page builder.
 * All other code employs the fields of this object directly.  </p>
 * 
 * <p> Classifier for expectation of compatibility defines
 * <code>Syntelos.compatible.class</code> and
 * <code>Syntelos.compatible.version</code> in most cases.  In a
 * multi- product class exemplified by 'Gecko', the field
 * <code>Syntelos.compatible.name</code> may be set to the user space
 * product name, eg, "Netscape" or "Firefox".
 * </p>
 * 
 * <p> Compatible classes produced by this function
 * <table>
 * <tr><th>class</th><th>found in products</th><th>notes</th></tr>
 * <tr><td>Gecko</td><td>Netscape, Mozilla, Firefox</td><td>This class is tested using JavaScript <code>'window.navigator.product'</code>.</td></tr>
 * <tr><td>MSIE</td><td>MS Internet Explorer</td><td></td></tr>
 * <tr><td>Opera</td><td>Opera</td><td></td></tr>
 * <tr><td>Webkit</td><td>Apple Safari</td><td>Open source 'WebKit' is a branch of 'KHTML'.</td></tr>
 * <tr><td>KHTML</td><td>Konqueror</td><td></td></tr>
 * </table>
 * </p>
 * 
 * @return Boolean for expectation of browser compatibility 
 */
function Syntelos_compatible(){
    var nav = window.navigator;
    if (nav){
        var usea = nav.userAgent;
        var product = nav.product;
        if (product){
            Syntelos.compatible.class = product;//('Gecko')
            Syntelos.compatible.name = nav.appName;
            var productSub = nav.productSub;
            if (productSub){
                Syntelos.compatible.version = productSub;
                try {
                    var date = productSub.split(/([0-9]{4})([0-9]{2})([0-9]{2})/);
                    if ( '' == date[0])
                        date.shift();
                    if ('' == date[date.length-1])
                        date.pop();
                    date[0] = Number(date[0]);
                    date[1] = Number(date[1]);
                    date[2] = Number(date[2]);
                    Syntelos.add('Syntelos.compatible.version',new Date(date[0],date[1],date[2]));
                }
                catch (ignore){
                }
                if ('Gecko' == product && Syntelos.compatible.version && Syntelos.compatible.gecko.base <= Syntelos.compatible.version){
                    /*
                     * Narrow compatibility limited to "Firefox/2" 
                     */
                    return Syntelos.compatible.tool.true();
                }
            }
        }
        /*
         * sequence of linear string scans (less than ideal)
         */
        else if (-1 < usea.indexOf('MSIE ')){
            Syntelos.compatible.class = 'MSIE';
            try {
                Syntelos.compatible.version = Number(usea.match(/MSIE ([0-9.]+)/)[1]);
            }
            catch (test){
            }
        }
        else if (-1 < usea.indexOf('Opera')){
            Syntelos.compatible.class = 'Opera';
            try {
                Syntelos.compatible.version = Number(usea.match(/Opera.([0-9.]+)/)[1]);
            }
            catch (test){
            }
        }
        else if (-1 < usea.indexOf('WebKit')){
            Syntelos.compatible.class = 'WebKit';
            try {
                Syntelos.compatible.version = Number(usea.match(/WebKit.([0-9])/)[1]);
            }
            catch (test){
            }
        }
        else if (-1 < usea.indexOf('KHTML')){
            Syntelos.compatible.class = 'KHTML';
            try {
                Syntelos.compatible.version = Number(usea.match(/KHTML.([0-9.]+)/)[1]);
            }
            catch (test){
            }
        }
    }
    /*
     * default case permits override for testing
     */
    return Syntelos.compatible.tool.false();
}
Syntelos.add('Syntelos.compatible',Syntelos_compatible);
Syntelos.add('Syntelos.compatible.gecko.base',new Date(2006,12,11));

/**
 * <p> Function used within <code>Syntelos.compatible</code> to permit
 * overriding a 'true' return value for testing purposes.  </p>
 */
function Syntelos_compatible_tool_true(){

    var over = Syntelos.global.get('compatible');
    if (null != over){
        if ('false' == over)
            return false;
        else
            return true;
    }
    else
        return true;
}
Syntelos.add('Syntelos.compatible.tool.true',Syntelos_compatible_tool_true);

/**
 * <p> Function used within <code>Syntelos.compatible</code> to permit
 * overriding a 'false' return value for testing purposes.  </p>
 */
function Syntelos_compatible_tool_false(){

    var over = Syntelos.global.get('compatible');
    if (null != over){
        if ('false' == over)
            return false;
        else
            return true;
    }
    else
        return false;
}
Syntelos.add('Syntelos.compatible.tool.false',Syntelos_compatible_tool_false);

/**
 * 
 */
function Syntelos_global_get(name){
    var loca = document.location.toString();
    var list = loca.split(/[\#|%23]/);
    var count = list.length;
    var search = name+'=';
    for (var cc = 1; cc < count; cc++){
        var nvp = list[cc];
        if (0 == nvp.indexOf(search)){
            return nvp.substring(search.length);
        }
    }
    return null;
}
Syntelos.add('Syntelos.global.get',Syntelos_global_get);

/**
 * 
 */
function Syntelos_global_set(name,value){
    var loca = document.location.toString();
    var list = loca.split(/[\#|%23]/);
    var search = name+'=';
    var count = list.length;
    if (1 < count){
        var sb = list[0];
        var needed = true; 
        for (var cc = 1; cc < count; cc++){
            var nvp = list[cc];
            if (0 == nvp.indexOf(search)){
                sb += '#'+search+value;
                needed = false;
            }
            else if (0 < nvp.length){
                sb += '#'+nvp;
            }
        }
        if (needed){
            sb += '#'+search+value;
        }
        document.location = sb;
    }
    else {
        var sb = list[0]+'#'+search+value;
        document.location = sb;
    }
}
Syntelos.add('Syntelos.global.set',Syntelos_global_set);

