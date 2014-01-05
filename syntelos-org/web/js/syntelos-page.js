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
 * @param target_id Required overlay target has this id.
 * @param layer_id Required overlay div has this id.
 */
function Syntelos_page_overlay_show( target_id, layer_id){
    if (target_id && layer_id){
        var target = document.getElementById(target_id);
        var layer = document.getElementById(layer_id);
        if (target && layer){

            if (Syntelos.page.contains(target,layer)){
                /*
                 * Display strategy 'into'
                 */
                var target_left = 0;
                var target_top = 0;
                var target_width_2 = (target.offsetWidth/2);
                var target_height_2 = (target.offsetHeight/2);
                
                var layer_width_2 = (layer.offsetWidth/2);
                var layer_height_2 = (layer.offsetHeight/2);
                /*
                 * Note that this works when layer dimensions are
                 * greater, less than, or equal to target
                 * dimensions.
                 */
                var l_x = target_left + (target_width_2 - layer_width_2);
                var l_y = target_top + (target_height_2 - layer_height_2);
                
                layer.style.left = l_x + 'px';
                layer.style.top = l_y + 'px';
            }
            else {
                /*
                 * Display strategy 'over'
                 */
                var target_left = 0;
                var target_top = 0;
                layer.style.top = target_left + 'px';
                layer.style.left = target_top + 'px';
                layer.style.width = target.offsetWidth + 'px';
                layer.style.height = target.offsetHeight + 'px';
            }
            /*
             * Show
             */
            layer.style.visibility = 'visible';
        }
        else
            throw new Bug("One of 'target' or 'layer' not found.");
    }
    else
        throw new Bug("Require arguments 'target_id' and 'layer_id'.");
}
Syntelos.add("Syntelos.page.overlay.show",Syntelos_page_overlay_show);

/**
 * @param target_id Required overlay target has this id.
 * @param layer_id Required overlay div has this id.
 * @param focus_id In hiding the overlay, focus the element with this
 * id.
 */
function Syntelos_page_overlay_hide( target_id, layer_id, focus_id){
    if (target_id && layer_id){
        var target = document.getElementById(target_id);
        var layer = document.getElementById(layer_id);
        if (target && layer){
            layer.style.visibility = 'hidden';

            if (focus_id){
                var el = document.getElementById(focus_id);
                if (el && typeof el.focus == 'function')
                    el.focus();
            }
            else if (typeof target.focus == 'function'){
                target.focus();
            }
        }
        else
            throw new Bug("One of 'target' or 'layer' not found.");
    }
    else
        throw new Bug("Require arguments 'target_id' and 'layer_id'.");
}
Syntelos.add("Syntelos.page.overlay.hide",Syntelos_page_overlay_hide);

/**
 * Show alert presumes overlay is visible
 */
function Syntelos_page_alert(target_id, layer_id, focus_id, alert_id, msg_id, ok_id, msg){
    var alert_elem = document.getElementById(msg_id);
    if (alert_elem){
        alert_elem.innerHTML = msg;
        var alert_form = Syntelos.page.form(alert_elem);
        if (alert_form){
            /*
             * Setup info for alert response 
             */
            alert_form.alert_info = new Object();
            alert_form.alert_info.target_id = target_id;
            alert_form.alert_info.layer_id = layer_id;
            alert_form.alert_info.focus_id = focus_id;
            alert_form.alert_info.alert_id = alert_id;
            /*
             * Show overlay
             */
            Syntelos.page.overlay.show(target_id,layer_id);
            /*
             * Show alert
             */
            Syntelos.page.overlay.show(layer_id,alert_id);
            /*
             * Focus alert 'ok' button
             */
            var el = document.getElementById(ok_id);
            if (el && typeof el.focus == 'function')
                el.focus();
        }
        else
            throw new Bug('Parent FORM not found.');
    }
    else
        throw new Bug('Message element id="'+msg_id+'" not found.');
}
Syntelos.add("Syntelos.page.alert",Syntelos_page_alert);

function Syntelos_page_alert_onclick_ok(input){
    if (input){
        var alert_form = input.form;
        if (alert_form){
            var info = alert_form.alert_info;
            if (info){
                var target_id = info.target_id;
                var layer_id = info.layer_id;
                var focus_id = info.focus_id;
                var alert_id = info.alert_id;
                /*
                 * Hide alert
                 */
                Syntelos.page.overlay.hide(layer_id,alert_id,focus_id);
                /*
                 * Hide overlay
                 */
                Syntelos.page.overlay.hide(target_id, layer_id, focus_id);
            }
            else
                throw new Bug('Form alert info not found.');
        }
        else
            throw new Bug('Argument "form" field not found.');
    }
    else
        throw new Bug('Require form element argument.');
}
Syntelos.add("Syntelos.page.alert.onclick.ok",Syntelos_page_alert_onclick_ok);

function Syntelos_page_form(elem){
    while (elem){
        if (elem instanceof HTMLFormElement)
            return elem;
        else
            elem = elem.parentNode;
    }
    return null;
}
Syntelos.add("Syntelos.page.form",Syntelos_page_form);

function Syntelos_page_contains(parent,child){
    if (parent && child){
        var p = child.parentNode;
        while (p){
            if (p == parent){
                return true;
            }
            else {
                p = p.parentNode;
            }  
        }
        return false;
    }
    else
        throw new Bug("(Syntelos.page.contains) requires parent and child arguments.");
}
Syntelos.add("Syntelos.page.contains",Syntelos_page_contains);
