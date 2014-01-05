/*
 * File 'open.js' generated from 'client' script.
 * Do not edit.
 */


/**
 * Syntelos.client.open.page.init
 */
function Syntelos_client_open_page_init( page_id){
    if (page_id){
        Syntelos.add('Syntelos.client.open.page.id',page_id);
    }
    else {
        var page_id = Syntelos.client.open.page.id;
    }
    var elem = document.getElementById(page_id);
    if (elem){
        /*
         * RESTful DOM state
         */
        var doc = Syntelos.client.open.open;
        /*
         * RESTful DOM state binding
         */
        var input_doc = Syntelos.valueOf(doc,'input_doc');
        var input_entry = Syntelos.valueOf(doc,'input_entry');
        //
        var client_id = 'open';
        var css_class = 'tools';
        var css_class_overlay = 'client_overlay';
        var css_class_overlay_alert = 'client_overlay_alert';
        var css_style = '';
        var css_width = '';
        var css_height = '';
        var count_inputs = 2;
        var count_submits = 3;
        var sb = '';
        /*
         * Begin body
         */
        var sb = '';
        sb += '<div id="'+client_id+'_form_container" class="'+css_class+'" style="'+css_style+'">';
        sb += '<form id="'+client_id+'_form" name="'+client_id+'_form" onsubmit="javascript:return false;">';
        sb += '<table id="form_table" border="0">';
        sb += '<tr>';
        sb += '<td>';
        sb += '<label for="input_doc" class="tools" name="input_doc">input_doc</label>';
        sb += '</td>';
        sb += '<td colspan="'+count_submits+'">';
        sb += '<input type="text"  class="tools" id="input_doc" name="input_doc" value="'+input_doc+'"/>';
        sb += '</td>';
        sb += '</tr>';
        sb += '<tr>';
        sb += '<td>';
        sb += '<label for="input_entry" class="tools" name="input_entry">input_entry</label>';
        sb += '</td>';
        sb += '<td colspan="'+count_submits+'">';
        sb += '<input type="text"  class="tools" id="input_entry" name="input_entry" value="'+input_entry+'"/>';
        sb += '</td>';
        sb += '</tr>';
        sb += '<tr>';
        sb += '<td />';
        sb += '<td>';
        sb += '<input type="submit"  class="tools" id="doc" name="op" value="doc" onclick="javascript:return Syntelos.client.open.page.init.onclick.doc(this);"/>';
        sb += '</td>';
        sb += '<td>';
        sb += '<input type="submit"  class="tools" id="app" name="op" value="app" onclick="javascript:return Syntelos.client.open.page.init.onclick.app(this);"/>';
        sb += '</td>';
        sb += '<td>';
        sb += '<input type="submit"  class="tools" id="external" name="op" value="external" onclick="javascript:return Syntelos.client.open.page.init.onclick.external(this);"/>';
        sb += '</td>';
        sb += '</tr>';
        sb += '</table>';
        sb += '</form>';
        sb += '</div>';
        sb += '<div id="'+client_id+'_form_container_overlay" class="'+css_class_overlay+'">';
        sb += '<div id="'+client_id+'_form_container_overlay_alert" class="'+css_class_overlay_alert+'">';
        sb += '<form id="'+client_id+'_form_alert" name="'+client_id+'_form_alert" onsubmit="javascript:return false;">';
        sb += '<table class="'+css_class_overlay_alert+'" id="form_table_alert" border="0">';
        sb += '<tr>';
        sb += '<td class="'+css_class_overlay_alert+'" id="'+client_id+'_alert_msg" />';
        sb += '</tr>';
        sb += '<tr>';
        sb += '<td class="'+css_class_overlay_alert+'" align="center">';
        sb += '<input id="'+client_id+'_alert_ok" class="'+css_class_overlay_alert+'" type="submit" name="alert" value="ok" onclick="javascript: return Syntelos.page.alert.onclick.ok(this);" />';
        sb += '</td>';
        sb += '</tr>';
        sb += '</table>';
        sb += '</form>';
        sb += '</div>';
        sb += '</div>';
        /*
         * End body
         */
        elem.innerHTML = sb;
        //
        var input = document.getElementById('input_doc');
        if (input && typeof input.focus == 'function'){
            input.focus()
        }
    }
    else {
        Syntelos.page.alert('open_form_container','open_form_container_overlay','input_doc','open_form_container_overlay_alert','open_alert_msg','open_alert_ok','Missing or invalid page id.');
    }
}
Syntelos.add('Syntelos.client.open.page.init',Syntelos_client_open_page_init);

/**
 * Syntelos.client.open.page.init.onclick.doc
 */
function Syntelos_client_open_page_init_onclick_doc( input){
    if (input){
        var form = input.form;
        if (form){
            var doc = Syntelos.client.open.open;
            /*
             * Form bindings
             */
            var input_doc = form.elements['input_doc'].value;
            var input_entry = form.elements['input_entry'].value;
            //
            Syntelos.page.overlay.show('open_form_container','open_form_container_overlay');
            //
            var xhr = new Syntelos.net(Syntelos.client.open.page.init.response.doc);
            xhr.open("GET",Syntelos.fcat("/atom/"+input_doc)+"?entry"+escape(input_entry));
            /*
             * Form bindings
             */
            Syntelos.setValue(doc,'input_doc',input_doc);
            Syntelos.setValue(doc,'input_entry',input_entry);
            xhr.send(null);
        }
        else {
            Syntelos.page.alert('open_form_container','open_form_container_overlay','input_doc','open_form_container_overlay_alert','open_alert_msg','open_alert_ok',"Bug missing 'input.form'.");
        }
    }
    else {
        Syntelos.page.alert('open_form_container','open_form_container_overlay','input_doc','open_form_container_overlay_alert','open_alert_msg','open_alert_ok',"Bug missing 'form-input'.");
    }
}
Syntelos.add('Syntelos.client.open.page.init.onclick.doc',Syntelos_client_open_page_init_onclick_doc);

/**
 * Syntelos.client.open.page.init.response.doc
 */
function Syntelos_client_open_page_init_response_doc( xhr){
    //
    //
    if (4 == xhr.readyState){
        var doc = xhr.responseXML;
        if (doc){
            var test = doc.documentElement.localName;
            if ('open' == test){
                Syntelos.client.open.open = doc;
                Syntelos.client.open.page.doc();
                Syntelos.page.overlay.hide('open_form_container','open_form_container_overlay','input_doc');
                return;
            }
            else if ('error' == test){
                var msg = doc.getElementsByTagNameNS("http://www.syntelos.org/edit","message").item(0).firstChild.nodeValue;
                if (msg){
                    Syntelos.page.alert('open_form_container','open_form_container_overlay','input_doc','open_form_container_overlay_alert','open_alert_msg','open_alert_ok',msg);
                }
                else {
                    Syntelos.page.alert('open_form_container','open_form_container_overlay','input_doc','open_form_container_overlay_alert','open_alert_msg','open_alert_ok','Error, request not OK.');
                }
                return;
            }
            else if ('success' == test){
                var msg = doc.getElementsByTagNameNS("http://www.syntelos.org/edit","message").item(0).firstChild.nodeValue;
                if (msg){
                    Syntelos.page.alert('open_form_container','open_form_container_overlay','input_doc','open_form_container_overlay_alert','open_alert_msg','open_alert_ok',msg);
                }
                else {
                    Syntelos.page.alert('open_form_container','open_form_container_overlay','input_doc','open_form_container_overlay_alert','open_alert_msg','open_alert_ok','Success, request OK.');
                }
                return;
            }
        }
        Syntelos.page.alert('open_form_container','open_form_container_overlay','input_doc','open_form_container_overlay_alert','open_alert_msg','open_alert_ok','Error unresponsive.');
    }
}
Syntelos.add('Syntelos.client.open.page.init.response.doc',Syntelos_client_open_page_init_response_doc);

/**
 * Syntelos.client.open.page.init.onclick.app
 */
function Syntelos_client_open_page_init_onclick_app( input){
    if (input){
        var form = input.form;
        if (form){
            var doc = Syntelos.client.open.open;
            /*
             * Form bindings
             */
            var input_doc = form.elements['input_doc'].value;
            var input_entry = form.elements['input_entry'].value;
            //
            Syntelos.page.overlay.show('open_form_container','open_form_container_overlay');
            //
            /*
             * Begin script
             */
            input.blur();
            /*
             * End script
             */
        }
        else {
            Syntelos.page.alert('open_form_container','open_form_container_overlay','input_doc','open_form_container_overlay_alert','open_alert_msg','open_alert_ok',"Bug missing 'input.form'.");
        }
    }
    else {
        Syntelos.page.alert('open_form_container','open_form_container_overlay','input_doc','open_form_container_overlay_alert','open_alert_msg','open_alert_ok',"Bug missing 'form-input'.");
    }
}
Syntelos.add('Syntelos.client.open.page.init.onclick.app',Syntelos_client_open_page_init_onclick_app);

/**
 * Syntelos.client.open.page.init.onclick.external
 */
function Syntelos_client_open_page_init_onclick_external( input){
    if (input){
        var form = input.form;
        if (form){
            var doc = Syntelos.client.open.open;
            /*
             * Form bindings
             */
            var input_doc = form.elements['input_doc'].value;
            var input_entry = form.elements['input_entry'].value;
            //
            Syntelos.page.overlay.show('open_form_container','open_form_container_overlay');
            //
            /*
             * Begin script
             */
            input.blur();
            /*
             * End script
             */
        }
        else {
            Syntelos.page.alert('open_form_container','open_form_container_overlay','input_doc','open_form_container_overlay_alert','open_alert_msg','open_alert_ok',"Bug missing 'input.form'.");
        }
    }
    else {
        Syntelos.page.alert('open_form_container','open_form_container_overlay','input_doc','open_form_container_overlay_alert','open_alert_msg','open_alert_ok',"Bug missing 'form-input'.");
    }
}
Syntelos.add('Syntelos.client.open.page.init.onclick.external',Syntelos_client_open_page_init_onclick_external);

/**
 * Syntelos.client.open.page.doc
 */
function Syntelos_client_open_page_doc(){
    var page_id = Syntelos.client.open.page.id;
    var elem = document.getElementById(page_id);
    if (elem){
        /*
         * RESTful DOM state
         */
        var doc = Syntelos.client.open.open;
        /*
         * RESTful DOM state binding
         */
        var name = Syntelos.valueOf(doc,'name');
        var email = Syntelos.valueOf(doc,'email');
        var summary = Syntelos.valueOf(doc,'summary');
        var content = Syntelos.valueOf(doc,'content');
        //
        var client_id = 'open';
        var css_class = 'tools';
        var css_class_overlay = 'client_overlay';
        var css_class_overlay_alert = 'client_overlay_alert';
        var css_style = '';
        var css_width = '';
        var css_height = '';
        var count_inputs = 4;
        var count_submits = 1;
        var sb = '';
        /*
         * Begin body
         */
        var sb = '';
        sb += '<div id="'+client_id+'_form_container" class="'+css_class+'" style="'+css_style+'">';
        sb += '<form id="'+client_id+'_form" name="'+client_id+'_form" onsubmit="javascript:return false;">';
        sb += '<table id="form_table" border="0">';
        sb += '<tr>';
        sb += '<td>';
        sb += '<label for="name" class="tools" name="name">name</label>';
        sb += '</td>';
        sb += '<td colspan="'+count_submits+'">';
        sb += '<input type="text"  class="tools" id="name" name="name" value="'+name+'"/>';
        sb += '</td>';
        sb += '</tr>';
        sb += '<tr>';
        sb += '<td>';
        sb += '<label for="email" class="tools" name="email">email</label>';
        sb += '</td>';
        sb += '<td colspan="'+count_submits+'">';
        sb += '<input type="text"  class="tools" id="email" name="email" value="'+email+'"/>';
        sb += '</td>';
        sb += '</tr>';
        sb += '<tr>';
        sb += '<td>';
        sb += '<label for="summary" class="tools" name="summary">summary</label>';
        sb += '</td>';
        sb += '<td colspan="'+count_submits+'">';
        sb += '<input type="text"  class="tools" id="summary" name="summary" value="'+summary+'"/>';
        sb += '</td>';
        sb += '</tr>';
        sb += '<tr>';
        sb += '<td>';
        sb += '<label for="content" class="tools" name="content">content</label>';
        sb += '</td>';
        sb += '<td colspan="'+count_submits+'">';
        sb += '<input type="text"  class="tools" id="content" name="content" value="'+content+'"/>';
        sb += '</td>';
        sb += '</tr>';
        sb += '<tr>';
        sb += '<td />';
        sb += '<td>';
        sb += '<input type="submit"  class="tools" id="save" name="op" value="save" onclick="javascript:return Syntelos.client.open.page.doc.onclick.save(this);"/>';
        sb += '</td>';
        sb += '</tr>';
        sb += '</table>';
        sb += '</form>';
        sb += '</div>';
        sb += '<div id="'+client_id+'_form_container_overlay" class="'+css_class_overlay+'">';
        sb += '<div id="'+client_id+'_form_container_overlay_alert" class="'+css_class_overlay_alert+'">';
        sb += '<form id="'+client_id+'_form_alert" name="'+client_id+'_form_alert" onsubmit="javascript:return false;">';
        sb += '<table class="'+css_class_overlay_alert+'" id="form_table_alert" border="0">';
        sb += '<tr>';
        sb += '<td class="'+css_class_overlay_alert+'" id="'+client_id+'_alert_msg" />';
        sb += '</tr>';
        sb += '<tr>';
        sb += '<td class="'+css_class_overlay_alert+'" align="center">';
        sb += '<input id="'+client_id+'_alert_ok" class="'+css_class_overlay_alert+'" type="submit" name="alert" value="ok" onclick="javascript: return Syntelos.page.alert.onclick.ok(this);" />';
        sb += '</td>';
        sb += '</tr>';
        sb += '</table>';
        sb += '</form>';
        sb += '</div>';
        sb += '</div>';
        /*
         * End body
         */
        elem.innerHTML = sb;
        //
        var input = document.getElementById('name');
        if (input && typeof input.focus == 'function'){
            input.focus()
        }
    }
    else {
        Syntelos.page.alert('open_form_container','open_form_container_overlay','name','open_form_container_overlay_alert','open_alert_msg','open_alert_ok','Missing or invalid page id.');
    }
}
Syntelos.add('Syntelos.client.open.page.doc',Syntelos_client_open_page_doc);

/**
 * Syntelos.client.open.page.doc.onclick.save
 */
function Syntelos_client_open_page_doc_onclick_save( input){
    if (input){
        var form = input.form;
        if (form){
            var doc = Syntelos.client.open.open;
            /*
             * Form bindings
             */
            var name = form.elements['name'].value;
            var email = form.elements['email'].value;
            var summary = form.elements['summary'].value;
            var content = form.elements['content'].value;
            //
            Syntelos.page.overlay.show('open_form_container','open_form_container_overlay');
            //
            /*
             * Begin script
             */
            input.blur();
            /*
             * End script
             */
        }
        else {
            Syntelos.page.alert('open_form_container','open_form_container_overlay','name','open_form_container_overlay_alert','open_alert_msg','open_alert_ok',"Bug missing 'input.form'.");
        }
    }
    else {
        Syntelos.page.alert('open_form_container','open_form_container_overlay','name','open_form_container_overlay_alert','open_alert_msg','open_alert_ok',"Bug missing 'form-input'.");
    }
}
Syntelos.add('Syntelos.client.open.page.doc.onclick.save',Syntelos_client_open_page_doc_onclick_save);
