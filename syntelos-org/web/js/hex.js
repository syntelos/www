/*
 *  hex.js
 * 
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
 * <p> Stateless hexadecimal coder.
 * </p>
 * 
 * @author jdp@syntelos 
 */
function hex(){
    if (this == hex){
        /*
         * will be broken...
         */
        throw new Error('Usage error requires "new".');
    }
}

hex.prototype = new Object();


hex.prototype.HEX_CHARS = [ '0', '1', '2', '3',
                            '4', '5', '6', '7',
                            '8', '9', 'a', 'b',
                            'c', 'd', 'e', 'f' ];

/**
 * For one or more hex strings, return a byte array for their
 * concatenated value.
 */
hex.prototype.decode = function(){
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
    return bits;
}

/**
 * For one or more byte arrays, return a hex string for their
 * concatenated value.
 */
hex.prototype.encode = function () {
    var sb = '';
    for (var argc = 0, arglen = arguments.length; argc < arglen; argc++){
        var bary = arguments[argc];
        for (var cc = 0; cc < bary.length; cc++) {
            sb += this.HEX_CHARS[(bary[cc] >>> 4) & 0xf];
            sb += this.HEX_CHARS[bary[cc] & 0xf];
        }
    }
    return sb;
}
