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
 * <p> A bint 'value' is an array of 8 bit integer (byte) values in
 * big endian order, as compatible with other binary functions.  All
 * arrays in the context of this class are big endian ordered lists of
 * 8 bit integer values. </p>
 * 
 * <p> 
 * </p>
 * 
 * @constructor
 * @param value Optional integer or byte array value
 * @author jdp@syntelos
 */
function bint(value){
    if (this == bint){
        throw new Error('Require "new".');
    }
    else if (value){
        if (value instanceof Number){
            this.add(value);
        }
        else if (value instanceof Array){
            this.copy(value);
        }
        else if (value instanceof String){
            try {
                var num = Number(value);
                if (Number.NaN != num){
                    this.add(num);
                    return;
                }
            }
            catch (number){
            }
            if (null != this.hex){
                num = this.hex.decode(arguments);
                this.copy(num);
            }
        }
        else if (value instanceof bint){
            this.copy(value.value);
        }
        else {
            throw new Error('Unrecognized argument "'+value+'".');
        }
    }
    else {
        this.value = new Array(0);
    }
}

bint.prototype = new Object();
bint.prototype.value = new Array(0);
try {
    bint.prototype.hex = new hex();
}
catch (ignore){
    bint.prototype.hex = null;
}
try {
    bint.prototype.b64 = new b64();
}
catch (ignore){
    bint.prototype.b64 = null;
}

/**
 * @param value An integer number, or an array of numbers to add as a
 * set or series into this value.  Strings will be converted to
 * numbers using the builtin Number function.
 */
bint.prototype.add = function(value){
    if (typeof value == 'number' || value instanceof Number){
        var cc = this.lsbx();
        this.value[cc] = ((this.value[cc] & 0xff) + value);
        var acc;
        var carry = 0;
        while (true){
            carry += this.value[cc];
            acc = 0;
            if (0 > carry){
                acc = -(carry >> 8);
                carry += (acc * 0x100);
            }
            this.value[cc] = (carry & 0xff);
            carry = (carry >> 8) - acc;
            if (0 != carry){
                cc--;
                if (-1 == carry){
                    return;
                }
                else if (0 > cc){
                    cc = 0;
                    if (0 == this.value[0]){
                        this.value.shift();
                        return;
                    }
                    else {
                        this.value.unshift(0);
                    }
                }
            }
            else {
                return;
            }
        }
    }
    else if (value instanceof Array){
        var count = value.length;
        for (var cc = 0; cc < count; cc++){
            this.add(value[cc]);
        }
        return;
    }
    else if (typeof value == 'string' || value instanceof String){
        try {
            var num = Number(value);
            if (Number.NaN != num){
                return this.add(num);
            }
            else {
                throw new Error("Unrecognized value '"+value+"'.");
            }
        }
        catch (number){
            throw new Error("Unrecognized value '"+value+"'.");
        }
    }
    else {
        throw new Error("Unrecognized value '"+value+"'.");
    }
}
bint.prototype.lsbx = function(){
    var ix = (this.value.length-1);
    if (-1 < ix){
        return ix;
    }
    else {
        return 0;
    }
}
/**
 * @return A copy of this object
 */
bint.prototype.clone = function(){
    return new bint(this);
}
/**
 * @param value A value array to overwrite this value.  If value is
 * null, reset this value to an empty list.
 */
bint.prototype.copy = function(value){
    if (value instanceof Array){
        var count = value.length;
        this.value = new Array(count);
        for (var cc = 0; cc < count; cc++){

            this.value[cc] = (value[cc] & 0xff);
        }
    }
    else if (null != value){
        throw new Error('Unrecognized argument "'+value+'".');
    }
    else {
        this.value = new Array(0);
    }
}
/**
 * @param value A hexadecimal string to define the value of this object.
 */
bint.prototype.copyHex = function(value){

}
/**
 * Throws an error if the hex coder has not been included before this
 * class.
 * @return This value as a hexadecimal string
 */
bint.prototype.toHex = function(){
    if (null != this.hex){
        return this.hex.encode(this.value);
    }
    else {
        throw new Error('Hex coder not available.');
    }
}

/**
 * Throws an error if the Base 64 coder has not been included before
 * this class.
 * @return This value as a Base 64 string
 */
bint.prototype.toB64 = function(){
    if (null != this.b64){
        return this.b64.encodeBin(this.value);
    }
    else {
        throw new Error('B64 coder not available.');
    }
}

/**
 * Throws an error if 'md5.js' has not been included.
 * 
 * @return The MD5 object, updated with this value.
 */
bint.prototype.hashMD5 = function(){
    if (null != md5){
        var md = new md5();
        md.updateBin(this.value);
        return md;
    }
    else {
        throw new Error('MD5 coder not available.');
    }
}

/**
 * Throws an error if 'md5.js' has not been included.
 * 
 * @return The MD5 hash of this value as a hexadecimal string
 */
bint.prototype.hashMD5Hex = function(){
    return this.hashMD5().hashHex();
}

/**
 * Throws an error if 'md5.js' has not been included.
 * 
 * @return The MD5 hash of this value as a Base 64 string
 */
bint.prototype.hashMD5B64 = function(){
    return this.hashMD5().hashB64();
}
