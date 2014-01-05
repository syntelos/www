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
 * Once per second after first calling this method, emit local time
 * and date string into the 'value' property of an element with id
 * 'tabs_clock'.
 */
function Syntelos_tabs_clock(id){
    if (!id)
        id = 'tabs_clock';
    //
    var elem = document.getElementById(id);
    if (elem){
        var time = new Date();
        var sb = ' ';
        sb += time.toLocaleTimeString();
        sb += '  ';
        sb += time.toLocaleDateString();
        sb += ' ';
        //
        elem.value = sb;
        //
        setTimeout("Syntelos.workspace.clock('"+id+"')",1000);
    }
}
Syntelos.add('Syntelos.workspace.clock',Syntelos_tabs_clock);

/**
 * <p> Called from 'show' to fixup the document location for the
 * current tab.  </p>
 */
function Syntelos_tabs_history(id){
    if (id != Syntelos.tabs.current()){
        Syntelos.global.set('tab',id);
    }
}
Syntelos.add('Syntelos.tabs.history',Syntelos_tabs_history);

/**
 * <p> Return the current tab ID number from the document location
 * fragment.  Default '1'.  </p>
 * 
 * @return The current tab ID number
 */
function Syntelos_tabs_current(){
    var loca = document.location.toString();
    var list = loca.split(/[\#\&]/);
    var count = list.length;
    if (1 < count){
        for (var cc = 1; cc < count; cc++){
            var nvp = list[cc];
            if (0 == nvp.indexOf('tab=')){
                var id = nvp.substring('tab='.length);
                return id;
            }
        }
    }
    return '1';
}
Syntelos.add('Syntelos.tabs.current',Syntelos_tabs_current);

/**
 * @param id Optional tab ID number
 * 
 * @return The button input widget in CSS class 'tab' and having
 * 'name' value equal to 'tab' plus the argument or current ID.
 */
function Syntelos_tabs_currentButton(id){
    if (!id){
        id = Syntelos_tabs_current();
    }
    var list = document.getElementsByTagName('input');
    var count = list.length;
    var tab = 'tab'+id;
    for (var cc = 0; cc < count; cc++){
        elem = list.item(cc);
        if ('tab' == elem.getAttribute('class')){
            if (tab == elem.getAttribute('name')){
                return elem;
            }
        }
    }
    return null;
}
Syntelos.add('Syntelos.tabs.currentButton',Syntelos_tabs_currentButton);

/**
 * @param id Optional tab ID number
 * 
 * @return The tab body div with 'id' equal to 'tabs_body'+ID.
 */
function Syntelos_tabs_currentBody(id){
    if (!id){
        id = Syntelos_tabs_current();
    }
    return document.getElementById('tabs_body'+id);
}
Syntelos.add('Syntelos.tabs.currentBody',Syntelos_tabs_currentBody);

/**
 * <p> Through 'arguments' inspection, this method accepts one, two or
 * three parameters.  One parameter is 'css', two are 'css' and 'id',
 * while three are 'input', 'css' and 'id'.  </p>
 * 
 * @param input Optional form input may be null
 * @param css Optional CSS class for body divs defaults to 'tabs_body'
 * @param id Optional ID number for current tab defaults to the value
 * returned by <code>Syntelos.tabs.current()</code>.
 * 
 * @return True for tab found and shown.  When false, all tabs have been hidden.
 */
function Syntelos_tabs_show(input,css,id){
    var stylesheet;
    switch (Syntelos.global.get('style')){

    case 'inverse':
        Syntelos.workspace.fgcolor = '#101010';
        Syntelos.workspace.bgcolor = '#303030';
        stylesheet = document.getElementById('stylesheet_colors');
        stylesheet.href = '/css/inverse.css';
        break;
    default:
    case 'seafoam':
        Syntelos.workspace.fgcolor = '#e0ffe0';
        Syntelos.workspace.bgcolor = '#f0fdf0';
        stylesheet = document.getElementById('stylesheet_colors');
        stylesheet.href = '/css/seafoam.css';
        break;
    }
    switch (arguments.length){
    case 0:
        input = null;
        css = 'tabs_body';
        id = Syntelos.tabs.current();
        break;
    case 1:
        input = null;
        css = arguments[0];
        id = Syntelos.tabs.current();
        break;
    case 2:
        input = null;
        css = arguments[0];
        id = arguments[1];
        break;
    case 3:
        if (null != input){
            input.blur();
        }
        break;
    default:
        throw new Bug('Bad arguments list.');
    }
    //
    var list = document.getElementsByTagName('div');
    var count = list.length;
    var elem;
    for (var cc = 0; cc < count; cc++){
        elem = list.item(cc);
        if (css == elem.getAttribute('class')){
            elem.style.visibility = 'hidden';
        }
    }
    list = document.getElementsByTagName('input');
    count = list.length;
    var tab = 'tab'+id;
    var found = false;
    for (var cc = 0; cc < count; cc++){
        elem = list.item(cc);
        if ('tab' == elem.getAttribute('class')){
            if (tab == elem.getAttribute('name')){
                found = true;
                elem.style.backgroundColor = Syntelos.workspace.fgcolor;
            }
            else {
                elem.style.backgroundColor = Syntelos.workspace.bgcolor;
            }
        }
    }
    elem = document.getElementById('tabs_body'+id);
    if (elem){
        elem.style.visibility = 'visible';
        Syntelos.tabs.history(id);
        return found;
    }
    else {
        Syntelos.tabs.history(id);
        return false;
    }
}
Syntelos.add('Syntelos.tabs.show',Syntelos_tabs_show);

/**
 * Body onload event to fetch workspace and build it.
 */
function Syntelos_tabs_workspace_init(container,debug){
    if (container instanceof Element){
        Syntelos.tabs.container = container;
    }
    else if (container == window || window.document instanceof HTMLDocument){
        container = window.document.body;
        if (container){
            Syntelos.tabs.container = container;
        }
        else {
            //(todo)//container = window.document.getElementByTagName('body');//(etc,etc)
            throw new Bug("Browser window document not in HTML/DOM.");
        }
    }
    else
        throw new Bug("Browser window document not in HTML/DOM.");
    //
    if (debug)
        Syntelos.tabs.debug = true;
    else
        Syntelos.tabs.debug = false;
    //
    var id = '';
    if (container){
        id = container.getAttribute('id');
        if (!id){
            id = container.localName.toLowerCase();
        }
    }
    else {
        id = 'body';
    }
    //
    var xhr = new Syntelos.net(Syntelos.tabs.workspace.build);
    xhr.open("GET","workspace?id="+id);
    xhr.send(null);
}
Syntelos.add('Syntelos.tabs.workspace.init',Syntelos_tabs_workspace_init);

/**
 * Workspace retrieval response event to build workspace.
 */
function Syntelos_tabs_workspace_build(xhr){
    var doc = xhr.responseXML;
    if (doc){
        var workspace = doc.documentElement;
        if ('workspace' == workspace.localName){
            var sb = '';
            var postscript = null;
            var workspaces = workspace.getElementsByTagNameNS('http://www.syntelos.org/workspace','workspace');
            var tools = workspace.getElementsByTagNameNS('http://www.syntelos.org/workspace','tool');
            var scripts = workspace.getElementsByTagNameNS('http://www.syntelos.org/workspace','script');
            for (var section = 0; section < 5; section++){
                switch (section){
                case 0:
                    sb += '<table class="tab" border="0" cellpadding="0" cellspacing="0">';
                    sb += '<tr class="tab">';
                    sb += Syntelos.tabs.workspace.build.generate.tabs(workspaces);
                    break;
                case 1:
                    sb += '<td class="tools">';
                    sb += Syntelos.tabs.workspace.build.generate.toolButtons(tools);
                    sb += '</td>';
                    sb += '</tr>';
                    sb += '</table>';
                    break;
                case 2:
                    sb += Syntelos.tabs.workspace.build.generate.pageBodies(workspaces);
                    break;
                case 3:
                    sb += Syntelos.tabs.workspace.build.generate.toolBodies(tools);
                    break;
                case 4:
                    postscript = Syntelos.tabs.workspace.build.generate.script(scripts);
                    break;
                }
            }
            var container = Syntelos.tabs.container;
            if (!container){
                if (window.document instanceof HTMLDocument){
                    container = window.document.body;
                }
                else
                    throw new Bug("Browser window document not in HTML/DOM.");
            }
            if (Syntelos.tabs.debug){
                container.innerHTML = Syntelos.edit(sb)+'\n\n'+postscript;
            }
            else {
                container.innerHTML = sb;
                Syntelos.ps.exec(postscript);
            }
            return;
        }
    }
    throw new Bug("Workspace not found on server.");
}
Syntelos.add('Syntelos.tabs.workspace.build',Syntelos_tabs_workspace_build);

/**
 * 
 */
function Syntelos_tabs_workspace_build_generate_tabs(workspaces){
    var buf = '';
    for (var cc = 0; cc < workspaces.length; cc++){
        var workspace = workspaces.item(cc);
        var wid = workspace.getAttribute('id');
        var lab = workspace.getAttribute('label');
        if (!lab){
            lab = workspace.getAttribute('name');
            if (!lab){
                lab = wid;
            }
        }
        buf += '<td class="tab"><input type="button" class="tab" name="tab'+wid+'" value="'+lab+'" onclick="javascript:Syntelos.tabs.show(this,\'tabs_body\',\''+wid+'\');"/></td>';
    }
    return buf;
}
Syntelos.add('Syntelos.tabs.workspace.build.generate.tabs',Syntelos_tabs_workspace_build_generate_tabs);

/**
 * 
 */
function Syntelos_tabs_workspace_build_generate_toolButtons(tools){
    var buf = '';
    for (var cc = 0; cc < tools.length; cc++){
        var tool = tools.item(cc);
        var tool_id = tool.getAttribute('id');
        var lab = tool.getAttribute('label');
        var hide = tool.getAttribute('hidden');
        if (hide && 'true' == hide){
            continue;
        }
        else {
            var onclick = tool.getElementsByTagNameNS('http://www.syntelos.org/workspace','tool.select');
            if (onclick){
                if (0 < onclick.length){
                    onclick = onclick.item(0).firstChild;
                    if (onclick instanceof Text){
                        onclick = onclick.nodeValue;
                    }
                    else {
                        onclick = 'this.blur();';
                    }
                }
                else {
                    onclick = 'this.blur();';
                }
            }
            else {
                onclick = 'this.blur();';
            }
            //
            if (lab){
                buf += '<input id="'+tool_id+'" type="button" class="tools button" name="tool_select_'+tool_id+'" value="'+lab+'" onclick="javascript:'+onclick+'"/>';
            }
            else {
                buf += '<input id="'+tool_id+'" type="button" class="tools button" name="tool_select_'+tool_id+'" value="" onclick="javascript:'+onclick+'"/>';
            }
        }
    }
    return buf;
}
Syntelos.add('Syntelos.tabs.workspace.build.generate.toolButtons',Syntelos_tabs_workspace_build_generate_toolButtons);
/**
 * 
 */
function Syntelos_tabs_workspace_build_generate_pageBodies(list){
    var buf = '';
    for (var cc = 0; cc < list.length; cc++){
        var workspace = list[cc];
        var css = workspace.getAttribute('css-body');
        var wid = workspace.getAttribute('id');
        if (wid){
            if (css){
                buf += '<div class="'+css+'" id="'+css+wid+'">';
            }
            else {
                buf += '<div class="tabs_body" id="tabs_body'+wid+'">';
            }
            var clients = workspace.getElementsByTagNameNS('http://www.syntelos.org/workspace','client');
            if (clients && 0 < clients.length){
                for (var ac = 0; ac < clients.length; ac++){
                    buf += Syntelos.tabs.workspace.client.generate(clients.item(ac));
                }
            }
            buf += '</div>';
        }
    }


    return buf;
}
Syntelos.add('Syntelos.tabs.workspace.build.generate.pageBodies',Syntelos_tabs_workspace_build_generate_pageBodies);

/**
 * <p> Given a client, return its fully qualified ID. Side effect to
 * update the client id value with its fully qualified variant as
 * needed. </p>
 * 
 * <p> The definition of this function is shared on both client and
 * server.  </p>
 * 
 * @param client Required workspace client object
 * @param tab_id Optional tab ID number defaults to the current tab (or '1')
 * @return The client container DIV Element 'id' attribute value. 
 */
function Syntelos_tabs_workspace_client_id(client,tab_id){
    if (client instanceof Element && 'client' == client.localName){
        var client_id = client.getAttribute('id');
        if (client_id){
            if (0 == client_id.indexOf('tab_'))
                return client_id;
            else {
                if (!tab_id){
                    tab_id = Syntelos.tabs.current();
                }
                if (client_id && tab_id){
                    client_id = 'tab_'+tab_id+'_client_'+client_id;
                    client.setAttribute('id',client_id);
                    return client_id;
                }
            }
        }
    }
    return null;
}
Syntelos.add('Syntelos.workspace.client.id',Syntelos_tabs_workspace_client_id);

/**
 * <p> Generate client container string.  Accepts multiple "init"
 * script segments from multiple <code>w:client.init</code> children
 * of <code>w:client</code>.  It concatenates these with newlines into
 * one "init" script.  Accepts multiple <code>w:client.load</code>
 * sources which get loaded before all the init scripts run. </p>
 * 
 * <p> For the "init" script it defines the following variables
 * including all the information on hand: <code>tab_id</code>,
 * <code>client_id</code>, <code>client_x</code>,
 * <code>client_y</code>, <code>client_w</code>,
 * <code>client_h</code>.
 * 
 * @param client Required workspace client object
 * @param tabid Optional tab ID number
 * @return Client container HTML DIV string
 */
function Syntelos_tabs_workspace_client_generate(client,tab_id){
    var client_id = Syntelos.workspace.client.id(client,tab_id);
    var buf = '';
    if (client_id){
        var client_x = client.getAttribute('x');
        var client_y = client.getAttribute('y');
        if (client_x && client_y){
            //
            var ps = 'var tab_id = "'+tab_id+'";\nvar client_id = "'+client_id+'";\nvar client_id = "'+client_id+'";\nvar client_x = "'+client_y+'";\n';
            var style = 'top: '+client_y+'; left: '+client_x+';';
            buf += '<div class="client_container" id="'+client_id+'" style="'+style+'">';
            buf += '</div>';
            //
            var initers = client.getElementsByTagNameNS('http://www.syntelos.org/workspace','client.init');
            for (var ic = 0; ic < initers.length; ic++){
                var initer = initers.item(ic);
                var initer_code = initer.firstChild;
                if (initer_code && (initer_code instanceof Text || initer_code instanceof CDATASection)){
                    ps += initer_code.nodeValue + '\n';
                }
            }
            var loads = new Array();
            var loaders = client.getElementsByTagNameNS('http://www.syntelos.org/workspace','client.load');
            for (var lc = 0; lc < loaders.length; lc++){
                var loader = loaders.item(lc);
                var loader_src = loader.firstChild;
                if (loader_src && (loader_src instanceof Text || loader_src instanceof CDATASection)){
                    loads.push(loader_src.nodeValue);
                }
            }
            Syntelos.load(loads,ps);
        }
    }
    return buf;
}
Syntelos.add('Syntelos.tabs.workspace.client.generate',Syntelos_tabs_workspace_client_generate);


/**
 * 
 */
function Syntelos_tabs_workspace_build_generate_toolBodies(list){
    var buf = '';
    for (var cc = 0; cc < list.length; cc++){
        var tool = list[cc];
        var tool_id = tool.getAttribute('id');
        if (tool_id){
            var clients = tool.getElementsByTagNameNS('http://www.syntelos.org/workspace','client');
            if (clients && 0 < clients.length){
                for (var ac = 0; ac < clients.length; ac++){
                    buf += Syntelos.tabs.workspace.client.generate(clients.item(cc));
                }
            }
            else {
                var tool_input = tool.getElementsByTagNameNS('http://www.syntelos.org/workspace','tool.input');
                if (tool_input && 0 < tool_input.length){
                    var css = tool.getAttribute('css-body');
                    if (css){
                        buf += '<div class="'+css+'" id="'+css+tool_id+'">';
                    }
                    else {
                        buf += '<div class="tool" id="tool_'+tool_id+'">';
                    }
                    buf += '<form onsubmit="javascript:return false;">';
                    var tool_button = tool.getElementsByTagNameNS('http://www.syntelos.org/workspace','tool.button');
                    /*
                     * table layout
                     */
                    buf += '<table cellspacing="1" cellpadding="1" border="0">';
                    for (var ic = 0; ic < tool_input.length; ic++){
                        /*
                         * inputs
                         */
                        var input = tool_input.item(ic);
                        var name = input.getAttribute('name');
                        if (!name){
                            name = input.getAttribute('label');
                            if (!name){
                                name = tool_id;
                            }
                        }
                        var css = input.getAttribute('css');
                        if (!css){
                            css = 'tools';
                        }
                        buf += '<tr><td><label class="'+css+'" for="'+name+'">'+name+'</label></td>';
                        var iid = input.getAttribute('id');
                        if (!iid){
                            iid = name;
                        }
                        var rows = input.getAttribute('rows');
                        var cols = input.getAttribute('cols');
                        if (rows || cols){
                            /*
                             * input type text area
                             */
                            if (!rows)
                                rows = '20';
                            if (!cols)
                                cols = '20';
                            buf += '<td><textarea id="'+iid+'" name="'+name+'" class="'+css+'" rows="'+rows+'" cols="'+cols+'"></textarea></td></tr>';
                        }
                        else {
                            /*
                             * input type text field
                             */
                            var iwi = input.getAttribute('width');
                            if (!iwi)
                                iwi = '24';
                            buf += '<td><input id="'+iid+'" name="'+name+'" type="text" class="'+css+'" width="'+iwi+'" /></td></tr>';
                        }
                    }
                    //
                    buf += '<tr><td></td><td>';
                    for (var bc = 0; bc < tool_button.length; bc++){
                        /*
                         * buttons
                         */
                        var button = tool_button.item(bc);
                        var bid = button.getAttribute('id');
                        var label = button.getAttribute('label');
                        if (!label){
                            label = button.getAttribute('name');
                            if (!label){
                                label = bid;
                            }
                        }
                        if (!bid){
                            bid = label;
                        }
                        var css = button.getAttribute('css');
                        if (!css)
                            css = 'tools';
                        var onclick = '';
                        if (button.firstChild instanceof Text){
                            var onclick = button.firstChild.nodeValue;
                        }
                        buf += '<input type="button" id="'+bid+'" name="'+label+'" class="'+css+'" value="'+label+'" onclick="javascript:'+onclick+'" />';
                    }
                    buf += '</td></tr>';
                    buf += '</table>';
                    //
                    buf += '</form></div>';
                }
            }
        }
    }


    return buf;
}
Syntelos.add('Syntelos.tabs.workspace.build.generate.toolBodies',Syntelos_tabs_workspace_build_generate_toolBodies);

/**
 * 
 */
function Syntelos_tabs_workspace_build_generate_script(list){
    var buf = '';
    for (var cc = 0; cc < list.length; cc++){
        var script = list[cc];
        var children = script.childNodes;
        for (var sc = 0; sc < children.length; sc++){
            var child = children[cc];
            if (child instanceof Text){
                var text = child.nodeValue;
                if (text){
                    buf += (text+'\n');
                }
            }
        }
    }
    buf += 'Syntelos.tabs.show();';
    return buf;
}
Syntelos.add('Syntelos.tabs.workspace.build.generate.script',Syntelos_tabs_workspace_build_generate_script);

/**
 * 
 */
function Syntelos_tabs_tool_save(button){
    if (button){
        button.blur();
    }

    ///////////////////////////////////
    //////////////todo/////////////////
    /////////////store/////////////////
    ///////////////////////////////////
}
Syntelos.add('Syntelos.workspace.tool.save',Syntelos_tabs_tool_save);

/**
 * 
 */
function Syntelos_tabs_tool_open(button){
    if (button){
        button.blur();
    }
    var div = document.getElementById('tool_open');
    if (div){
        if ('visible' == div.style.visibility){
            div.style.visibility = 'hidden';
            var input = document.getElementById('tool_open_input');
            if (input){
                input.value = '';
            }
            return;
        }
        else {
            div.style.visibility = 'visible';
            var input = document.getElementById('tool_open_input');
            if (input){
                input.value = '';
                input.focus();
            }
            return;
        }
    }
}
Syntelos.add('Syntelos.workspace.tool.open',Syntelos_tabs_tool_open);

/**
 * 
 */
function Syntelos_tabs_tool_open_onclick_response(button){
    if (button){
        button.blur();
    }
    var input = document.getElementById('tool_open_input');
    if (input){
        input = input.value;
        if (input){
            var tid = Syntelos.tabs.current();
            var body = Syntelos.tabs.currentBody(tid);

            ///////////////////////////////////
            //////////////todo/////////////////
            /////////////store/////////////////
            ///////////////////////////////////
        }
    }
    var div = document.getElementById('tool_open');
    if (div){
        div.style.visibility = 'hidden';
    }
}
Syntelos.add('Syntelos.workspace.tool.open.onclick.response',Syntelos_tabs_tool_open_onclick_response);

/**
 * 
 */
function Syntelos_tabs_tool_close(button){
    if (button){
        button.blur();
    }
    var div = document.getElementById('tool_close');
    div.style.visibility = 'visible';
    var button = document.getElementById('tool_close_ok_button');
    button.focus();
}
Syntelos.add('Syntelos.workspace.tool.close',Syntelos_tabs_tool_close);

/**
 * 
 */
function Syntelos_tabs_tool_close_onclick_ok(button){
    if (button){
        button.blur();
    }

    ///////////////////////////////////
    //////////////todo/////////////////
    ///////////drop tab////////////////
    ///////////////////////////////////

    var div = document.getElementById('tool_close');
    if (div){
        div.style.visibility = 'hidden';
    }
}
Syntelos.add('Syntelos.workspace.tool.close.onclick.ok',Syntelos_tabs_tool_close_onclick_ok);

/**
 * 
 */
function Syntelos_tabs_tool_close_onclick_cancel(button){
    if (button){
        button.blur();
    }
    var div = document.getElementById('tool_close');
    if (div){
        div.style.visibility = 'hidden';
    }
}
Syntelos.add('Syntelos.workspace.tool.close.onclick.cancel',Syntelos_tabs_tool_close_onclick_cancel);

/**
 * 
 */
function Syntelos_tabs_tool_rename(button){
    if (button){
        button.blur();
    }
    var div = document.getElementById('tool_rename');
    if (div){
        if ('visible' == div.style.visibility){
            div.style.visibility = 'hidden';
            var input = document.getElementById('tool_rename_input');
            if (input){
                input.value = '';
            }
            return;
        }
        else {
            div.style.visibility = 'visible';
            var input = document.getElementById('tool_rename_input');
            if (input){
                input.value = '';
                input.focus();
            }
            return;
        }
    }
}
Syntelos.add('Syntelos.workspace.tool.rename',Syntelos_tabs_tool_rename);

/**
 * 
 */
function Syntelos_tabs_tool_rename_onclick_response(button){
    button.blur();
    var input = document.getElementById('tool_rename_input');
    if (input){
        var name = input.value;
        if (name){
            var button = Syntelos.tabs.currentButton();
            if (button){
                button.value = name;


                ///////////////////////////////////
                //////////////todo/////////////////
                /////////////store/////////////////
                ///////////////////////////////////
            }
        }
    }
    var div = document.getElementById('tool_rename');
    if (div){
        div.style.visibility = 'hidden';
    }
}
Syntelos.add('Syntelos.workspace.tool.rename.onclick.response',Syntelos_tabs_tool_rename_onclick_response);

/**
 * This tool registers itself as 'Syntelos.error' on behalf of the
 * 'tabs' environment.
 * 
 * Hidden text area tool popped up by this call
 * 
 * @param err Object having 'message' field.
 */
function Syntelos_tabs_tool_error(err){

    var div = document.getElementById('tool_error');
    if (div){
        var input = document.getElementById('tool_error_input');
        if (input){
            if (err){
                var sb = '';
                if (err.fileName){
                    sb += 'In file "'+err.fileName+'"\n';
                }
                if (err.lineNumber){
                    sb += 'at line number "'+err.lineNumber+'"\n';
                }
                if (err.name){
                    if (err.message){
                        sb += err.name+' "';
                        sb += err.message+'"\n';
                    }
                    else {
                        sb += err.name+'\n';
                    }
                }
                else if (err.message){
                    sb += err.message+'\n';
                }
                if (err.stack){
                    var stack;
                    if (err.stack instanceof Array){
                        stack = err.stack;
                    }
                    else {
                        stack = err.stack.split(/[\r\n]/);
                    }
                    //
                    for (var sc = 0; sc < stack.length; sc++){
                        var line = stack[sc];
                        var idx = line.indexOf(')');
                        if (0 < idx){
                            idx += 1;
                            var func = line.substring(0,idx);
                            var ref = line.substring(idx+1);
                            if (0 == ref.indexOf("http:"))
                                ref = ref.substring(5);
                            sb += '@ '+func+' '+ref+'\n';
                        }
                    }
                }
                input.value = sb;
            }
            else {
                input.value = 'error';
            }
            //(show)
            div.style.visibility = 'visible';
            var button = document.getElementById('tool_error_button');
            if (button)
                button.focus();
            else
                input.focus();
        }
    }
}
Syntelos.add('Syntelos.error',Syntelos_tabs_tool_error);

/**
 * 
 */
function Syntelos_tabs_tool_error_onclick_response(button){
    button.blur();
    var input = document.getElementById('tool_error_input');
    if (input){
        input.value = '';
    }
    var div = document.getElementById('tool_error');
    if (div){
        div.style.visibility = 'hidden';
    }
}
Syntelos.add('Syntelos.workspace.tool.error.onclick.response',Syntelos_tabs_tool_error_onclick_response);

function Syntelos_tabs_init(){
    if (Syntelos.compatible()){
        if (null == Syntelos.global.get('style')){
            Syntelos.global.set('style', 'seafoam');
        }
        Syntelos.tabs.workspace.init();
        return true;
    }
    else
        return false;
}
Syntelos.init = Syntelos_tabs_init;

function Syntelos_tabs_style_inverse(button){
    if (button){
        button.blur();
    }
    var style = Syntelos.global.get('style');
    switch (style){
    case 'inverse':
        Syntelos.global.set('style', 'seafoam');
        break;
    default:
    case 'seafoam':
        Syntelos.global.set('style', 'inverse');
        break;
    }
    if (button){
        Syntelos.tabs.show();
    }
}
Syntelos.add('Syntelos.workspace.style.inverse',Syntelos_tabs_style_inverse);
