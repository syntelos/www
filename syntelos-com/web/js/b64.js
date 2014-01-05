/*
 * Copyright (c) 2007, Tyler Akins
 * Copyright (c) 2007, John Pritchard
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
 * <p> This code is based on <a href="http://rumkin.com">Base64 code
 * from Tyler Akins -- http://rumkin.com</a> and placed in the public
 * domain.  Since rewritten for OO style and byte array I/O by
 * 'jdp'. </p>
 * 
 * <h3>General usage</h3>
 * 
 * <h4>Example transcoding string</h4>
 * 
 * <p> Encode 'source' string to 'target' base64 string.
 *
 * <pre>
 * var coder = new b64();
 * var target = coder.encodeString(source);
 * </pre>
 * </p>
 * 
 * <p> Decode base64 'source' string to plain text 'target' string.
 * 
 * <pre>
 * var coder = new b64();
 * var target = coder.decodeString(source);
 * </pre>
 * </p>
 * 
 * <h4>Example transcoding binary</h4>
 * 
 * <p> Encode 'source' array of "crytographically plain text" byte
 * values to 'target' base64 string.
 *
 * <pre>
 * var coder = new b64();
 * var target = coder.encodeBin(source);
 * </pre>
 * </p>
 * 
 * <p> Decode base64 'source' string to 'target' array of
 * "crytographically plain text" byte values.
 * 
 * <pre>
 * var coder = new b64();
 * var target = coder.decodeBin(source);
 * </pre>
 * </p>
 * 
 * <h3>Usage notes</h3>
 * 
 * <p> The 'b64' object instance (product of <code>'new b64()'</code>)
 * is stateless -- it has no user specific fields internally.  So it's
 * perfectly appropriate for other classes to use one instance of this
 * class as a prototype field.
 * 
 * <pre>
 * function other(){
 *   this.something = this.base64.encodeString(arguments);
 * }
 * other.prototype = new Object();
 * other.prototype.base64 = new b64();
 * </pre>
 * </p>
 * 
 * <p> In the case of 'b64', the OO style implemented here (and
 * requiring 'new') is appropriate to maintaining a clean top level
 * JavaScript context as seen in debugging (or possibly intersecting
 * namespace with other JS users). </p>
 * 
 * 
 * 
 * @author Tyler Akins &lt;fidian@rumkin.com&gt;
 * @author jdp@syntelos
 */
function b64(){
    if (this == b64){
        /*
         * not called with 'new', will be broken...
         */
        throw new Error('Usage error requires "new".');
    }
}

b64.prototype = new Object();

b64.prototype.charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

/**
 * For one or more plain text strings, return the Base64 encoding of
 * their concatenation.
 */
b64.prototype.encodeString = function () {
    var output = "";
    for (var argc = 0, arglen = arguments.length; argc < arglen; argc++){
        var input = arguments[argc];

        var chr1;
        var chr2;
        var chr3;
        var enc1;
        var enc2;
        var enc3;
        var enc4;
        var i = 0;

        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            }
            else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +this.charset.charAt(enc1) +this.charset.charAt(enc2) + 
                this.charset.charAt(enc3) +this.charset.charAt(enc4);
        } while (i < input.length);
    }
    return output;
}
/**
 * For one or more arrays of 8 bit integers (bytes), return a base64
 * encoded string of their concatenation.
 */
b64.prototype.encodeBin = function () {
    var output = "";
    for (var argc = 0, arglen = arguments.length; argc < arglen; argc++){
        var input = arguments[argc];

        var chr1;
        var chr2;
        var chr3;
        var enc1;
        var enc2;
        var enc3;
        var enc4;
        var i = 0;

        do {
            chr1 = input[i++];
            chr2 = input[i++];
            chr3 = input[i++];

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            }
            else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +this.charset.charAt(enc1) +this.charset.charAt(enc2) + 
                this.charset.charAt(enc3) +this.charset.charAt(enc4);
        } while (i < input.length);
    }
    return output;
}
/**
 * For one or more strings encoded in base64, return a plain text
 * string (source) of their concatenation.
 */
b64.prototype.decodeString = function(input) {
    var output = "";
    for (var argc = 0, arglen = arguments.length; argc < arglen; argc++){
        var input = arguments[argc];

        var chr1;
        var chr2;
        var chr3;
        var enc1;
        var enc2;
        var enc3;
        var enc4;
        var i = 0;

        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        do {
            enc1 = this.charset.indexOf(input.charAt(i++));
            enc2 = this.charset.indexOf(input.charAt(i++));
            enc3 = this.charset.indexOf(input.charAt(i++));
            enc4 = this.charset.indexOf(input.charAt(i++));
        
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        } while (i < input.length);
    }
    return output;
}
/**
 * For one or more strings encoded in in base64, return an array of
 * decoded 8 bit integer values (bytes).
 */
b64.prototype.decodeBin = function() {
    var output = new Array();
    for (var argc = 0, arglen = arguments.length; argc < arglen; argc++){
        var input = arguments[argc];

        var chr1;
        var chr2;
        var chr3;
        var enc1;
        var enc2;
        var enc3;
        var enc4;
        var i = 0;

        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        do {
            enc1 = this.charset.indexOf(input.charAt(i++));
            enc2 = this.charset.indexOf(input.charAt(i++));
            enc3 = this.charset.indexOf(input.charAt(i++));
            enc4 = this.charset.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output.push(chr1);

            if (enc3 != 64) {
                output.push(chr2);
            }
            if (enc4 != 64) {
                output.push(chr3);
            }
        } while (i < input.length);
    }
    return output;
}
