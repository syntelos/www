/*
 *  md5.js
 * 
 *  Copyright (c) 1996 Santeri Paavolainen, Helsinki Finland 
 *  Copyright (C) 2002, 2005 Timothy W Macinta
 *  Copyright (C) 2007 John Pritchard, Syntelos 
 *
 *  This library is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU Lesser General Public
 *  License as published by the Free Software Foundation; either
 *  version 2.1 of the License, or (at your option) any later version.
 *
 *  This library is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *  Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public
 *  License along with this library; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 */


/**
 * <p> Fast implementation of RSA's MD5 hash generator.  This class
 * has been derived from the RSA Data Security, Inc. MD5
 * Message-Digest Algorithm and its reference implementation given in
 * RFC 1321. </p>
 * 
 * <p> Originally written by Santeri Paavolainen, Helsinki Finland
 * 1996.  Many optimizations and some bug fixes by Timothy W Macinta.
 * Cleanup and reorg in Java by <code>jdp@syntelos</code>.  JavaScript
 * by <code>jdp@syntelos</code>.  </p>
 *
 *
 * <h3>Example String</h3>
 * 
 * <pre>
 * 
 *  var md = new md5();
 *  md.updateString('abc');
 *  var hash_16 = md.hashHex();
 *  var hash_64 = md.hashB64(); //(second encoding reuses digest)
 *  md.clear();
 *  if (md.test16['abc'] == hash_16) //('abc' is among the RFC1321 vectors)
 *    .('test passed.').
 *  else
 *    .('test failed.').
 * 
 * </pre>
 * 
 * <h3>Example Hex</h3>
 * 
 * <pre>
 * 
 *  var md = new md5();
 *  md.updateString(password);
 *  md.updateHex(nonce);
 *  var create = md.hashHex();
 * 
 * </pre>
 * 
 * <h3>Example Base64</h3>
 * 
 * <pre>
 * 
 *  var md = new md5();
 *  md.updateString(password);
 *  md.updateB64(nonce);
 *  var create = md.hashB64();
 * 
 * </pre>
 * 
 * <h3>Test suite</h3>
 * 
 * <p> The instance object field named 'test16' is an object
 * containing the RFC1321 test vectors as a map from plain text source
 * strings to target hex hash value.  The instance method
 * <code>'md.test1321()'</code> performs these tests, returning the
 * numeric integer value '7' for success, or any other integer for
 * failure.
 *
 * <pre> 
 *    var md = new md5();
 *    if (7 == md.test1321())
 *      '(test 1321 ok)'
 *    else
 *      '(test 1321 failed)'
 * 
 * </pre> 
 * </p>
 * 
 * 
 * @author Santeri Paavolainen <sjpaavol@cc.helsinki.fi>
 * @author Timothy W Macinta (twm@alum.mit.edu) 
 * @author jdp@syntelos 
 */
function md5(){
    if (this != md5){
        /*
         * called with 'new'..
         */
        this.init();
    }
    else {
        /*
         * otherwise everything else will be broken...
         */
        throw new Error('Usage error requires "new".');
    }
}

md5.prototype = new Object();

/*
 * Public normal test vectors
 */
md5.prototype.test16 = new Object();
md5.prototype.test16[""] = "d41d8cd98f00b204e9800998ecf8427e";
md5.prototype.test16["a"] = "0cc175b9c0f1b6a831c399e269772661";
md5.prototype.test16["abc"] = "900150983cd24fb0d6963f7d28e17f72";
md5.prototype.test16["message digest"] = "f96b697d7cb7938d525a2f31aaf161d0";
md5.prototype.test16["abcdefghijklmnopqrstuvwxyz"] = "c3fcd3d76192e4007dfb496cca67e13b";
md5.prototype.test16["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"] = "d174ab98d277d9f5a5611c2c9f419d9f";
md5.prototype.test16["12345678901234567890123456789012345678901234567890123456789012345678901234567890"] = "57edf4a22be3c955ac49da2e2107b67a";


md5.prototype.HEX_CHARS = [ '0', '1', '2', '3',
                            '4', '5', '6', '7',
                            '8', '9', 'a', 'b',
                            'c', 'd', 'e', 'f' ];

md5.prototype.PADDING =  [
                          0x80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];

try {
    md5.prototype.base64 = new b64();
}
catch (unavailable){
    md5.prototype.base64 = null;
}

/**
 * Reset digest to clean 'init' state (as immediately following
 * construction), ready for update.
 */
md5.prototype.init = function(){
    this.state = new md5state();
    this.finals = null;
}

/**
 * Performs the RFC1321 test suite, returning the number tests passed.
 * This value should be '7' for success.
 */
md5.prototype.test1321 = function(){
    this.init();
    var count = 0;
    for (var source in this.test16){
        var target = this.test16[source];
        this.updateString(source);
        var hash = this.hashHex();
        this.init();
        if (hash != target)
            return count;
        else
            count += 1;
    }
    return count;
}
/**
 * Update internal hash state from one or more byte array arguments
 * with 8 and bit values.
 */
md5.prototype.updateBin = function(){
    for (var argc = 0, arglen = arguments.length; argc < arglen; argc++){
        var bits = arguments[argc];
        var bits_len = bits.length;
        if (bits_len && 0 < bits_len){
            this.state.update(bits,0,bits_len);
        }
    }
}
/**
 * Update internal hash state from one or more argument strings with 8
 * and 16 bit character values.
 */
md5.prototype.updateString = function(){
    var bits = new Array();
    var bb = 0;
    for (var argc = 0, arglen = arguments.length; argc < arglen; argc++){
        var str = arguments[argc];
        var str_len = str.length;
        for (var cc = 0; cc < str_len; cc++){
            var ch = str.charCodeAt(cc);
            if ( 0xff < ch){
                /*
                 * 16 bit 
                 */
                bits[bb++] = ((ch >>> 8) & 0xff);
                bits[bb++] = (ch & 0xff);
            }
            else {
                /*
                 * 8 bit 
                 */
                bits[bb++] = (ch & 0xff);
            }
        }
    }
    this.state.update(bits,0,bits.length);
}

/**
 * Update internal hash state from one or more argument strings
 * encoded in hexadecimal.
 */
md5.prototype.updateHex = function(){
    var bits = new Array();
    var bb = 0;
    for (var argc = 0, arglen = arguments.length; argc < arglen; argc++){
        var str = arguments[argc].toLowerCase();
        var str_len = str.length;
        for (var cc = 0; cc < str_len; cc++){
            var ch = str.charAt(cc++);
            var cv = this.HEX_CHARS.indexOf(ch);
            if (-1 < cv){
                var bv = ((cv & 0xf)<<4);
                if (cc < str_len){
                    ch = str.charAt(cc);
                    cv = this.HEX_CHARS.indexOf(ch);
                    if (-1 < cv){
                        bv |= (cv & 0xf);
                    }
                    else
                        throw new Error('Input string "'+str+'" not hex.');
                }
                bits[bb++] = bv;
            }
            else
                throw new Error('Input string "'+str+'" not hex.');
        }
    }
    this.state.update(bits,0,bits.length);
}

/**
 * Update internal hash state from one or more argument strings
 * encoded in Base64.  Requires file <code>"b64.js"</code> included
 * before this file.
 */
md5.prototype.updateB64 = function(){
    if (null == this.base64){
        throw new Error('Base64 unavailable, include file "b64.js".');
    }
    else {
        var bits = this.base64.decodeBin(arguments);
        this.state.update(bits,0,bits.length);
    }
}

/**
 * Returns array of bytes (16 bytes) representing hash as of the
 * current state of this object. Note: getting a hash does not
 * invalidate the hash object, it only creates a copy of the real
 * state which is finalized. 
 *
 * @return	Array of 16 bytes, the hash of all updated bytes
 */
md5.prototype.hash = function() {
    if (null == this.finals) {

        var fin = new md5state(this.state);
        var count_ints = [ (fin.count << 3), (fin.count >> 29) ];
        var bits = fin.encode(count_ints,8);
    
        var index = (fin.count & 0x3f);
        var padlen = (index < 56) ? (56 - index) : (120 - index);

        fin.update( this.PADDING, 0, padlen);
        fin.update( bits, 0, 8);	

        this.finals = fin;
    } 
    return this.finals.encode(this.finals.state,16);
}
/**
 * Returns hex representation of this hash
 *
 * @return Hex string of this object's hash
 */
md5.prototype.hashHex = function() {
    return this.asHex(this.hash());
}
/**
 * Turns array of bytes into string representing each byte as
 * unsigned hex number.
 * 
 * @param hash	Array of bytes to convert to hex-string
 * @return	Generated hex string
 */
md5.prototype.asHex = function (hash) {
    var sb = '';
    for (var cc = 0; cc < hash.length; cc++) {
        sb += this.HEX_CHARS[(hash[cc] >>> 4) & 0xf];
        sb += this.HEX_CHARS[hash[cc] & 0xf];
    }
    return sb;
}
/**
 * Turns array of bytes into a Base64 encoded string.  Requires file
 * <code>"b64.js"</code> included before this file.
 * 
 * @param hash	Array of bytes
 * @return Base64 encoded string
 */
md5.prototype.asB64 = function (hash) {
    if (null == this.base64){
        throw new Error('Base64 unavailable, include file "b64.js".');
    }
    else {
        return this.base64.encodeBin(hash);
    }
}
/**
 * Returns Base64 representation of this hash.  Requires file
 * <code>"b64.js"</code> included before this file.
 *
 * @return Base64 string of this object's hash
 */
md5.prototype.hashB64 = function() {
    return this.asB64(this.hash());
}


function md5state(){
    if (this != md5state){
        if ( 0 < arguments.length){
            var copy = arguments[0];
            this.state = new Array();

            this.state[0] = copy.state[0];
            this.state[1] = copy.state[1];
            this.state[2] = copy.state[2];
            this.state[3] = copy.state[3];

            this.count = copy.count;

            this.buffer = new Array();
            for (var cc = 0; cc < this.count; cc++){
                this.buffer[cc] = copy.buffer[cc];
            }
        }
        else {
            this.state = new Array(4);

            this.state[0] = 0x67452301;
            this.state[1] = 0xefcdab89;
            this.state[2] = 0x98badcfe;
            this.state[3] = 0x10325476;

            this.count = 0;

            this.buffer = new Array(64);
        }
    }
    else {
        /*
         * otherwise everything else will be broken...
         */
        throw new Error('Usage error requires "new".');
    }
}

md5state.prototype = new Object();

md5state.prototype.decode = function(buffer, offset, out) {
    /*
     * unrolled loop (original loop shown above)
     */
    out[0] = ((buffer[offset] & 0xff)) |
        (((buffer[offset + 1] & 0xff)) << 8) |
        (((buffer[offset + 2] & 0xff)) << 16) |
        (( buffer[offset + 3]) << 24);
    out[1] = ((buffer[offset + 4] & 0xff)) |
        (((buffer[offset + 5] & 0xff)) << 8) |
        (((buffer[offset + 6] & 0xff)) << 16) |
        (( buffer[offset + 7]) << 24);
    out[2] = ((buffer[offset + 8] & 0xff)) |
        (((buffer[offset + 9] & 0xff)) << 8) |
        (((buffer[offset + 10] & 0xff)) << 16) |
        (( buffer[offset + 11]) << 24);
    out[3] = ((buffer[offset + 12] & 0xff)) |
        (((buffer[offset + 13] & 0xff)) << 8) |
        (((buffer[offset + 14] & 0xff)) << 16) |
        (( buffer[offset + 15]) << 24);
    out[4] = ((buffer[offset + 16] & 0xff)) |
        (((buffer[offset + 17] & 0xff)) << 8) |
        (((buffer[offset + 18] & 0xff)) << 16) |
        (( buffer[offset + 19]) << 24);
    out[5] = ((buffer[offset + 20] & 0xff)) |
        (((buffer[offset + 21] & 0xff)) << 8) |
        (((buffer[offset + 22] & 0xff)) << 16) |
        (( buffer[offset + 23]) << 24);
    out[6] = ((buffer[offset + 24] & 0xff)) |
        (((buffer[offset + 25] & 0xff)) << 8) |
        (((buffer[offset + 26] & 0xff)) << 16) |
        (( buffer[offset + 27]) << 24);
    out[7] = ((buffer[offset + 28] & 0xff)) |
        (((buffer[offset + 29] & 0xff)) << 8) |
        (((buffer[offset + 30] & 0xff)) << 16) |
        (( buffer[offset + 31]) << 24);
    out[8] = ((buffer[offset + 32] & 0xff)) |
        (((buffer[offset + 33] & 0xff)) << 8) |
        (((buffer[offset + 34] & 0xff)) << 16) |
        (( buffer[offset + 35]) << 24);
    out[9] = ((buffer[offset + 36] & 0xff)) |
        (((buffer[offset + 37] & 0xff)) << 8) |
        (((buffer[offset + 38] & 0xff)) << 16) |
        (( buffer[offset + 39]) << 24);
    out[10] = ((buffer[offset + 40] & 0xff)) |
        (((buffer[offset + 41] & 0xff)) << 8) |
        (((buffer[offset + 42] & 0xff)) << 16) |
        (( buffer[offset + 43]) << 24);
    out[11] = ((buffer[offset + 44] & 0xff)) |
        (((buffer[offset + 45] & 0xff)) << 8) |
        (((buffer[offset + 46] & 0xff)) << 16) |
        (( buffer[offset + 47]) << 24);
    out[12] = ((buffer[offset + 48] & 0xff)) |
        (((buffer[offset + 49] & 0xff)) << 8) |
        (((buffer[offset + 50] & 0xff)) << 16) |
        (( buffer[offset + 51]) << 24);
    out[13] = ((buffer[offset + 52] & 0xff)) |
        (((buffer[offset + 53] & 0xff)) << 8) |
        (((buffer[offset + 54] & 0xff)) << 16) |
        (( buffer[offset + 55]) << 24);
    out[14] = ((buffer[offset + 56] & 0xff)) |
        (((buffer[offset + 57] & 0xff)) << 8) |
        (((buffer[offset + 58] & 0xff)) << 16) |
        (( buffer[offset + 59]) << 24);
    out[15] = ((buffer[offset + 60] & 0xff)) |
        (((buffer[offset + 61] & 0xff)) << 8) |
        (((buffer[offset + 62] & 0xff)) << 16) |
        (( buffer[offset + 63]) << 24);
}

md5state.prototype.transform = function(buffer, offset, decode_buf) {

    var a = this.state[0];
    var b = this.state[1];
    var c = this.state[2];
    var d = this.state[3];
    var x = decode_buf;

    this.decode(buffer, offset, decode_buf);
    
    /* Round 1
     */
    a += ((b & c) | (~b & d)) + x[ 0] + 0xd76aa478; /* 1 */
    a = ((a << 7) | (a >>> 25)) + b;
    d += ((a & b) | (~a & c)) + x[ 1] + 0xe8c7b756; /* 2 */
    d = ((d << 12) | (d >>> 20)) + a;
    c += ((d & a) | (~d & b)) + x[ 2] + 0x242070db; /* 3 */
    c = ((c << 17) | (c >>> 15)) + d;
    b += ((c & d) | (~c & a)) + x[ 3] + 0xc1bdceee; /* 4 */
    b = ((b << 22) | (b >>> 10)) + c;

    a += ((b & c) | (~b & d)) + x[ 4] + 0xf57c0faf; /* 5 */
    a = ((a << 7) | (a >>> 25)) + b;
    d += ((a & b) | (~a & c)) + x[ 5] + 0x4787c62a; /* 6 */
    d = ((d << 12) | (d >>> 20)) + a;
    c += ((d & a) | (~d & b)) + x[ 6] + 0xa8304613; /* 7 */
    c = ((c << 17) | (c >>> 15)) + d;
    b += ((c & d) | (~c & a)) + x[ 7] + 0xfd469501; /* 8 */
    b = ((b << 22) | (b >>> 10)) + c;

    a += ((b & c) | (~b & d)) + x[ 8] + 0x698098d8; /* 9 */
    a = ((a << 7) | (a >>> 25)) + b;
    d += ((a & b) | (~a & c)) + x[ 9] + 0x8b44f7af; /* 10 */
    d = ((d << 12) | (d >>> 20)) + a;
    c += ((d & a) | (~d & b)) + x[10] + 0xffff5bb1; /* 11 */
    c = ((c << 17) | (c >>> 15)) + d;
    b += ((c & d) | (~c & a)) + x[11] + 0x895cd7be; /* 12 */
    b = ((b << 22) | (b >>> 10)) + c;

    a += ((b & c) | (~b & d)) + x[12] + 0x6b901122; /* 13 */
    a = ((a << 7) | (a >>> 25)) + b;
    d += ((a & b) | (~a & c)) + x[13] + 0xfd987193; /* 14 */
    d = ((d << 12) | (d >>> 20)) + a;
    c += ((d & a) | (~d & b)) + x[14] + 0xa679438e; /* 15 */
    c = ((c << 17) | (c >>> 15)) + d;
    b += ((c & d) | (~c & a)) + x[15] + 0x49b40821; /* 16 */
    b = ((b << 22) | (b >>> 10)) + c;
    
    
    /* Round 2
     */
    a += ((b & d) | (c & ~d)) + x[ 1] + 0xf61e2562; /* 17 */
    a = ((a << 5) | (a >>> 27)) + b;
    d += ((a & c) | (b & ~c)) + x[ 6] + 0xc040b340; /* 18 */
    d = ((d << 9) | (d >>> 23)) + a;
    c += ((d & b) | (a & ~b)) + x[11] + 0x265e5a51; /* 19 */
    c = ((c << 14) | (c >>> 18)) + d;
    b += ((c & a) | (d & ~a)) + x[ 0] + 0xe9b6c7aa; /* 20 */
    b = ((b << 20) | (b >>> 12)) + c;

    a += ((b & d) | (c & ~d)) + x[ 5] + 0xd62f105d; /* 21 */
    a = ((a << 5) | (a >>> 27)) + b;
    d += ((a & c) | (b & ~c)) + x[10] + 0x02441453; /* 22 */
    d = ((d << 9) | (d >>> 23)) + a;
    c += ((d & b) | (a & ~b)) + x[15] + 0xd8a1e681; /* 23 */
    c = ((c << 14) | (c >>> 18)) + d;
    b += ((c & a) | (d & ~a)) + x[ 4] + 0xe7d3fbc8; /* 24 */
    b = ((b << 20) | (b >>> 12)) + c;

    a += ((b & d) | (c & ~d)) + x[ 9] + 0x21e1cde6; /* 25 */
    a = ((a << 5) | (a >>> 27)) + b;
    d += ((a & c) | (b & ~c)) + x[14] + 0xc33707d6; /* 26 */
    d = ((d << 9) | (d >>> 23)) + a;
    c += ((d & b) | (a & ~b)) + x[ 3] + 0xf4d50d87; /* 27 */
    c = ((c << 14) | (c >>> 18)) + d;
    b += ((c & a) | (d & ~a)) + x[ 8] + 0x455a14ed; /* 28 */
    b = ((b << 20) | (b >>> 12)) + c;

    a += ((b & d) | (c & ~d)) + x[13] + 0xa9e3e905; /* 29 */
    a = ((a << 5) | (a >>> 27)) + b;
    d += ((a & c) | (b & ~c)) + x[ 2] + 0xfcefa3f8; /* 30 */
    d = ((d << 9) | (d >>> 23)) + a;
    c += ((d & b) | (a & ~b)) + x[ 7] + 0x676f02d9; /* 31 */
    c = ((c << 14) | (c >>> 18)) + d;
    b += ((c & a) | (d & ~a)) + x[12] + 0x8d2a4c8a; /* 32 */
    b = ((b << 20) | (b >>> 12)) + c;
    
    
    /* Round 3
     */
    a += (b ^ c ^ d) + x[ 5] + 0xfffa3942;      /* 33 */
    a = ((a << 4) | (a >>> 28)) + b;
    d += (a ^ b ^ c) + x[ 8] + 0x8771f681;      /* 34 */
    d = ((d << 11) | (d >>> 21)) + a;
    c += (d ^ a ^ b) + x[11] + 0x6d9d6122;      /* 35 */
    c = ((c << 16) | (c >>> 16)) + d;
    b += (c ^ d ^ a) + x[14] + 0xfde5380c;      /* 36 */
    b = ((b << 23) | (b >>> 9)) + c;
    
    a += (b ^ c ^ d) + x[ 1] + 0xa4beea44;      /* 37 */
    a = ((a << 4) | (a >>> 28)) + b;
    d += (a ^ b ^ c) + x[ 4] + 0x4bdecfa9;      /* 38 */
    d = ((d << 11) | (d >>> 21)) + a;
    c += (d ^ a ^ b) + x[ 7] + 0xf6bb4b60;      /* 39 */
    c = ((c << 16) | (c >>> 16)) + d;
    b += (c ^ d ^ a) + x[10] + 0xbebfbc70;      /* 40 */
    b = ((b << 23) | (b >>> 9)) + c;
    
    a += (b ^ c ^ d) + x[13] + 0x289b7ec6;      /* 41 */
    a = ((a << 4) | (a >>> 28)) + b;
    d += (a ^ b ^ c) + x[ 0] + 0xeaa127fa;      /* 42 */
    d = ((d << 11) | (d >>> 21)) + a;
    c += (d ^ a ^ b) + x[ 3] + 0xd4ef3085;      /* 43 */
    c = ((c << 16) | (c >>> 16)) + d;
    b += (c ^ d ^ a) + x[ 6] + 0x04881d05;      /* 44 */
    b = ((b << 23) | (b >>> 9)) + c;
    
    a += (b ^ c ^ d) + x[ 9] + 0xd9d4d039;      /* 33 */
    a = ((a << 4) | (a >>> 28)) + b;
    d += (a ^ b ^ c) + x[12] + 0xe6db99e5;      /* 34 */
    d = ((d << 11) | (d >>> 21)) + a;
    c += (d ^ a ^ b) + x[15] + 0x1fa27cf8;      /* 35 */
    c = ((c << 16) | (c >>> 16)) + d;
    b += (c ^ d ^ a) + x[ 2] + 0xc4ac5665;      /* 36 */
    b = ((b << 23) | (b >>> 9)) + c;
    

    /* Round 4
     */
    a += (c ^ (b | ~d)) + x[ 0] + 0xf4292244; /* 49 */
    a = ((a << 6) | (a >>> 26)) + b;
    d += (b ^ (a | ~c)) + x[ 7] + 0x432aff97; /* 50 */
    d = ((d << 10) | (d >>> 22)) + a;
    c += (a ^ (d | ~b)) + x[14] + 0xab9423a7; /* 51 */
    c = ((c << 15) | (c >>> 17)) + d;
    b += (d ^ (c | ~a)) + x[ 5] + 0xfc93a039; /* 52 */
    b = ((b << 21) | (b >>> 11)) + c;

    a += (c ^ (b | ~d)) + x[12] + 0x655b59c3; /* 53 */
    a = ((a << 6) | (a >>> 26)) + b;
    d += (b ^ (a | ~c)) + x[ 3] + 0x8f0ccc92; /* 54 */
    d = ((d << 10) | (d >>> 22)) + a;
    c += (a ^ (d | ~b)) + x[10] + 0xffeff47d; /* 55 */
    c = ((c << 15) | (c >>> 17)) + d;
    b += (d ^ (c | ~a)) + x[ 1] + 0x85845dd1; /* 56 */
    b = ((b << 21) | (b >>> 11)) + c;

    a += (c ^ (b | ~d)) + x[ 8] + 0x6fa87e4f; /* 57 */
    a = ((a << 6) | (a >>> 26)) + b;
    d += (b ^ (a | ~c)) + x[15] + 0xfe2ce6e0; /* 58 */
    d = ((d << 10) | (d >>> 22)) + a;
    c += (a ^ (d | ~b)) + x[ 6] + 0xa3014314; /* 59 */
    c = ((c << 15) | (c >>> 17)) + d;
    b += (d ^ (c | ~a)) + x[13] + 0x4e0811a1; /* 60 */
    b = ((b << 21) | (b >>> 11)) + c;

    a += (c ^ (b | ~d)) + x[ 4] + 0xf7537e82; /* 61 */
    a = ((a << 6) | (a >>> 26)) + b;
    d += (b ^ (a | ~c)) + x[11] + 0xbd3af235; /* 62 */
    d = ((d << 10) | (d >>> 22)) + a;
    c += (a ^ (d | ~b)) + x[ 2] + 0x2ad7d2bb; /* 63 */
    c = ((c << 15) | (c >>> 17)) + d;
    b += (d ^ (c | ~a)) + x[ 9] + 0xeb86d391; /* 64 */
    b = ((b << 21) | (b >>> 11)) + c;

    this.state[0] += a;
    this.state[1] += b;
    this.state[2] += c;
    this.state[3] += d;
}


/**	
 * Updates hash with the bytebuffer given (using at maximum length bytes from
 * that buffer)
 *
 * @param inbuf	Array of bytes to be hashed
 * @param offset	Offset to inbuf array
 * @param length	Use at maximum `length' bytes (absolute
 *			maximum is inbuf.length)
 */
md5state.prototype.update = function(inbuf, offset, length) {

    /* Length can be told to be shorter, but not inter 
     */
    if ((length - offset)> inbuf.length)
        length = inbuf.length - offset;

    /*
     * compute number of bytes mod 64 
     */

    var index = (this.count & 0x3f);
    this.count += length;
    
    var partlen = (64 - index);
    var cc;
    if (length >= partlen) {
        decode_buf = new Array(16);
        if (partlen == 64) {
            partlen = 0;
        }
        else {
            for (cc = 0; cc < partlen; cc++)
                this.buffer[cc + index] = inbuf[cc + offset];

            this.transform( this.buffer, 0, decode_buf);
        }
        for (cc = partlen; (cc + 63) < length; cc+= 64) {

            this.transform( inbuf, cc + offset, decode_buf);
        }
        index = 0;
    } 
    else {
        cc = 0;
    }
    /* buffer remaining input 
     */
    if (cc < length) {
        var start = cc;
        for (; cc < length; cc++) {
            this.buffer[index + cc - start] = inbuf[cc + offset];
        }
    }
}


md5state.prototype.encode = function (input, len) {
    var i;
    var j;
    var out = new Array(len);

    for (i = j = 0; j  < len; i++, j += 4) {
        out[j] = (input[i] & 0xff);
        out[j + 1] = ((input[i] >>> 8) & 0xff);
        out[j + 2] = ((input[i] >>> 16) & 0xff);
        out[j + 3] = ((input[i] >>> 24) & 0xff);
    }

    return out;
}
