/*
 * File 'user.js' generated from 'client' script.
 * Do not edit.
 */


/**
 * Syntelos.client.user.page.init
 */
function Syntelos_client_user_page_init( page_id){
    if (page_id){
        Syntelos.add('Syntelos.client.user.page.id',page_id);
    }
    else {
        var page_id = Syntelos.client.user.page.id;
    }
    var elem = document.getElementById(page_id);
    if (elem){
        /*
         * RESTful DOM state
         */
        var doc = Syntelos.client.user.user;
        /*
         * RESTful DOM state binding
         */
        var email = Syntelos.valueOf(doc,'email');
        //
        var client_id = 'user';
        var css_class = 'client';
        var css_class_overlay = 'client_overlay';
        var css_class_overlay_alert = 'client_overlay_alert';
        var css_style = '';
        var css_width = '';
        var css_height = '';
        var count_inputs = 1;
        var count_submits = 2;
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
        sb += '<label for="email" class="client" name="email">email</label>';
        sb += '</td>';
        sb += '<td colspan="'+count_submits+'">';
        sb += '<input type="text"  class="client" id="email" name="email" value="'+email+'"/>';
        sb += '</td>';
        sb += '</tr>';
        sb += '<tr>';
        sb += '<td/>';
        sb += '<td>';
        sb += '<input type="submit"  class="client" id="login" name="op" value="login" onclick="javascript:return Syntelos.client.user.page.init.onclick.login(this);"/>';
        sb += '</td>';
        sb += '<td>';
        sb += '<input type="submit"  class="client" id="create" name="op" value="create" onclick="javascript:return Syntelos.client.user.page.init.onclick.create(this);"/>';
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
        sb += '<td class="'+css_class_overlay_alert+'" id="'+client_id+'_alert_msg"/>';
        sb += '</tr>';
        sb += '<tr>';
        sb += '<td class="'+css_class_overlay_alert+'" align="center">';
        sb += '<input id="'+client_id+'_alert_ok" class="'+css_class_overlay_alert+'" type="submit" name="alert" value="ok" onclick="javascript: return Syntelos.page.alert.onclick.ok(this);"/>';
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
        var input = document.getElementById('email');
        if (input && typeof input.focus == 'function'){
            input.focus()
        }
    }
    else {
        Syntelos.page.alert('user_form_container','user_form_container_overlay','email','user_form_container_overlay_alert','user_alert_msg','user_alert_ok','Missing or invalid page id.');
    }
}
Syntelos.add('Syntelos.client.user.page.init',Syntelos_client_user_page_init);
Syntelos.add('Syntelos.client.user.validate.email',new RegExp('^[a-zA-Z0-9._%-]+@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,4}$'));
Syntelos.add('Syntelos.client.user.validate.email.errmessage','Incorrect format for email address.');

/**
 * Syntelos.client.user.page.init.onclick.login
 */
function Syntelos_client_user_page_init_onclick_login( input){
    if (input){
        var form = input.form;
        if (form){
            var doc = Syntelos.client.user.user;
            /*
             * Form bindings
             */
            var email = form.elements['email'].value;
            if (email && email == email.match(Syntelos.client.user.validate.email)){
                //
                Syntelos.page.overlay.show('user_form_container','user_form_container_overlay');
                //
                var xhr = new Syntelos.net(Syntelos.client.user.page.init.response.login);
                xhr.open("GET","/user?op=login?email="+email);
                /*
                 * Form bindings
                 */
                Syntelos.setValue(doc,'email',email);
                xhr.send(null);
            }
            else {
                Syntelos.page.alert('user_form_container','user_form_container_overlay','email','user_form_container_overlay_alert','user_alert_msg','user_alert_ok','Incorrect format for email address.');
            }
        }
        else {
            Syntelos.page.alert('user_form_container','user_form_container_overlay','email','user_form_container_overlay_alert','user_alert_msg','user_alert_ok',"Bug missing 'input.form'.");
        }
    }
    else {
        Syntelos.page.alert('user_form_container','user_form_container_overlay','email','user_form_container_overlay_alert','user_alert_msg','user_alert_ok',"Bug missing 'form-input'.");
    }
}
Syntelos.add('Syntelos.client.user.page.init.onclick.login',Syntelos_client_user_page_init_onclick_login);

/**
 * Syntelos.client.user.page.init.response.login
 */
function Syntelos_client_user_page_init_response_login( xhr){
    //
    //
    if (4 == xhr.readyState){
        var doc = xhr.responseXML;
        if (doc){
            var test = doc.documentElement.localName;
            if ('user' == test){
                Syntelos.client.user.user = doc;
                Syntelos.client.user.page.login();
                Syntelos.page.overlay.hide('user_form_container','user_form_container_overlay','email');
                return;
            }
            else if ('error' == test){
                var msg = doc.getElementsByTagNameNS("http://www.syntelos.org/edit","message").item(0).firstChild.nodeValue;
                if (msg){
                    Syntelos.page.alert('user_form_container','user_form_container_overlay','email','user_form_container_overlay_alert','user_alert_msg','user_alert_ok',msg);
                }
                else {
                    Syntelos.page.alert('user_form_container','user_form_container_overlay','email','user_form_container_overlay_alert','user_alert_msg','user_alert_ok','Error, request not OK.');
                }
                return;
            }
            else if ('success' == test){
                var msg = doc.getElementsByTagNameNS("http://www.syntelos.org/edit","message").item(0).firstChild.nodeValue;
                if (msg){
                    Syntelos.page.alert('user_form_container','user_form_container_overlay','email','user_form_container_overlay_alert','user_alert_msg','user_alert_ok',msg);
                }
                else {
                    Syntelos.page.alert('user_form_container','user_form_container_overlay','email','user_form_container_overlay_alert','user_alert_msg','user_alert_ok','Success, request OK.');
                }
                return;
            }
        }
        Syntelos.page.alert('user_form_container','user_form_container_overlay','email','user_form_container_overlay_alert','user_alert_msg','user_alert_ok','Error unresponsive.');
    }
}
Syntelos.add('Syntelos.client.user.page.init.response.login',Syntelos_client_user_page_init_response_login);

/**
 * Syntelos.client.user.page.init.onclick.create
 */
function Syntelos_client_user_page_init_onclick_create( input){
    if (input){
        var form = input.form;
        if (form){
            var doc = Syntelos.client.user.user;
            /*
             * Form bindings
             */
            var email = form.elements['email'].value;
            if (email && email == email.match(Syntelos.client.user.validate.email)){
                //
                Syntelos.page.overlay.show('user_form_container','user_form_container_overlay');
                //
                var xhr = new Syntelos.net(Syntelos.client.user.page.init.response.create);
                xhr.open("GET","/user?op=create?email="+email);
                /*
                 * Form bindings
                 */
                Syntelos.setValue(doc,'email',email);
                xhr.send(null);
            }
            else {
                Syntelos.page.alert('user_form_container','user_form_container_overlay','email','user_form_container_overlay_alert','user_alert_msg','user_alert_ok','Incorrect format for email address.');
            }
        }
        else {
            Syntelos.page.alert('user_form_container','user_form_container_overlay','email','user_form_container_overlay_alert','user_alert_msg','user_alert_ok',"Bug missing 'input.form'.");
        }
    }
    else {
        Syntelos.page.alert('user_form_container','user_form_container_overlay','email','user_form_container_overlay_alert','user_alert_msg','user_alert_ok',"Bug missing 'form-input'.");
    }
}
Syntelos.add('Syntelos.client.user.page.init.onclick.create',Syntelos_client_user_page_init_onclick_create);

/**
 * Syntelos.client.user.page.init.response.create
 */
function Syntelos_client_user_page_init_response_create( xhr){
    //
    //
    if (4 == xhr.readyState){
        var doc = xhr.responseXML;
        if (doc){
            var test = doc.documentElement.localName;
            if ('user' == test){
                Syntelos.client.user.user = doc;
                Syntelos.client.user.page.create();
                Syntelos.page.overlay.hide('user_form_container','user_form_container_overlay','email');
                return;
            }
            else if ('error' == test){
                var msg = doc.getElementsByTagNameNS("http://www.syntelos.org/edit","message").item(0).firstChild.nodeValue;
                if (msg){
                    Syntelos.page.alert('user_form_container','user_form_container_overlay','email','user_form_container_overlay_alert','user_alert_msg','user_alert_ok',msg);
                }
                else {
                    Syntelos.page.alert('user_form_container','user_form_container_overlay','email','user_form_container_overlay_alert','user_alert_msg','user_alert_ok','Error, request not OK.');
                }
                return;
            }
            else if ('success' == test){
                var msg = doc.getElementsByTagNameNS("http://www.syntelos.org/edit","message").item(0).firstChild.nodeValue;
                if (msg){
                    Syntelos.page.alert('user_form_container','user_form_container_overlay','email','user_form_container_overlay_alert','user_alert_msg','user_alert_ok',msg);
                }
                else {
                    Syntelos.page.alert('user_form_container','user_form_container_overlay','email','user_form_container_overlay_alert','user_alert_msg','user_alert_ok','Success, request OK.');
                }
                return;
            }
        }
        Syntelos.page.alert('user_form_container','user_form_container_overlay','email','user_form_container_overlay_alert','user_alert_msg','user_alert_ok','Error unresponsive.');
    }
}
Syntelos.add('Syntelos.client.user.page.init.response.create',Syntelos_client_user_page_init_response_create);

/**
 * Syntelos.client.user.page.login
 */
function Syntelos_client_user_page_login(){
    var page_id = Syntelos.client.user.page.id;
    var elem = document.getElementById(page_id);
    if (elem){
        /*
         * RESTful DOM state
         */
        var doc = Syntelos.client.user.user;
        /*
         * Declared document bindings
         */
        var pad = Syntelos.valueOf(doc,'pad');
        var nonce = Syntelos.valueOf(doc,'nonce');
        /*
         * RESTful DOM state binding
         */
        var password = Syntelos.valueOf(doc,'password');
        //
        var client_id = 'user';
        var css_class = 'client';
        var css_class_overlay = 'client_overlay';
        var css_class_overlay_alert = 'client_overlay_alert';
        var css_style = '';
        var css_width = '';
        var css_height = '';
        var count_inputs = 1;
        var count_submits = 2;
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
        sb += '<label for="password" class="client" name="password">password</label>';
        sb += '</td>';
        sb += '<td colspan="'+count_submits+'">';
        sb += '<input type="password"  class="client" id="password" name="password" value="'+password+'"/>';
        sb += '</td>';
        sb += '</tr>';
        sb += '<tr>';
        sb += '<td/>';
        sb += '<td>';
        sb += '<input type="submit"  class="client" id="login" name="op" value="login" onclick="javascript:return Syntelos.client.user.page.login.onclick.login(this);"/>';
        sb += '</td>';
        sb += '<td>';
        sb += '<input type="submit"  class="client" id="cancel" name="op" value="cancel" onclick="javascript:return Syntelos.client.user.page.login.onclick.cancel(this);"/>';
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
        sb += '<td class="'+css_class_overlay_alert+'" id="'+client_id+'_alert_msg"/>';
        sb += '</tr>';
        sb += '<tr>';
        sb += '<td class="'+css_class_overlay_alert+'" align="center">';
        sb += '<input id="'+client_id+'_alert_ok" class="'+css_class_overlay_alert+'" type="submit" name="alert" value="ok" onclick="javascript: return Syntelos.page.alert.onclick.ok(this);"/>';
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
        var input = document.getElementById('password');
        if (input && typeof input.focus == 'function'){
            input.focus()
        }
    }
    else {
        Syntelos.page.alert('user_form_container','user_form_container_overlay','password','user_form_container_overlay_alert','user_alert_msg','user_alert_ok','Missing or invalid page id.');
    }
}
Syntelos.add('Syntelos.client.user.page.login',Syntelos_client_user_page_login);

/**
 * Syntelos.client.user.page.login.onclick.login
 */
function Syntelos_client_user_page_login_onclick_login( input){
    if (input){
        var form = input.form;
        if (form){
            var doc = Syntelos.client.user.user;
            /*
             * Declared document bindings
             */
            var pad = Syntelos.valueOf(doc,'pad');
            var nonce = Syntelos.valueOf(doc,'nonce');
            /*
             * Form bindings
             */
            var password = form.elements['password'].value;
            //
            Syntelos.page.overlay.show('user_form_container','user_form_container_overlay');
            //
            var xhr = new Syntelos.net(Syntelos.client.user.page.login.response.login);
            xhr.open("POST","/user?op=login");
            /*
             * Begin script
             */
            var md = new md5();
            md.updateString(password);
            md.updateHex(pad);
            md.updateHex(nonce);
            password = md.hashHex();
            /*
             * End script
             */
            /*
             * Declared document bindings
             */
            Syntelos.setValue(doc,'pad',pad);
            Syntelos.setValue(doc,'nonce',nonce);
            /*
             * Form bindings
             */
            Syntelos.setValue(doc,'password',password);
            xhr.send(doc);
        }
        else {
            Syntelos.page.alert('user_form_container','user_form_container_overlay','password','user_form_container_overlay_alert','user_alert_msg','user_alert_ok',"Bug missing 'input.form'.");
        }
    }
    else {
        Syntelos.page.alert('user_form_container','user_form_container_overlay','password','user_form_container_overlay_alert','user_alert_msg','user_alert_ok',"Bug missing 'form-input'.");
    }
}
Syntelos.add('Syntelos.client.user.page.login.onclick.login',Syntelos_client_user_page_login_onclick_login);

/**
 * Syntelos.client.user.page.login.response.login
 */
function Syntelos_client_user_page_login_response_login( xhr){
    //
    //
    if (4 == xhr.readyState){
        var doc = xhr.responseXML;
        if (doc){
            var test = doc.documentElement.localName;
            if ('success' == test){
                var msg = doc.getElementsByTagNameNS("http://www.syntelos.org/edit","message").item(0).firstChild.nodeValue;
                Syntelos.client.user.page.logout();
                return;
            }
            else if ('error' == test){
                var msg = doc.getElementsByTagNameNS("http://www.syntelos.org/edit","message").item(0).firstChild.nodeValue;
                if (msg){
                    Syntelos.page.alert('user_form_container','user_form_container_overlay','password','user_form_container_overlay_alert','user_alert_msg','user_alert_ok',msg);
                }
                else {
                    Syntelos.page.alert('user_form_container','user_form_container_overlay','password','user_form_container_overlay_alert','user_alert_msg','user_alert_ok','Error, request not OK.');
                }
                return;
            }
        }
        Syntelos.page.alert('user_form_container','user_form_container_overlay','password','user_form_container_overlay_alert','user_alert_msg','user_alert_ok','Error unresponsive.');
    }
}
Syntelos.add('Syntelos.client.user.page.login.response.login',Syntelos_client_user_page_login_response_login);

/**
 * Syntelos.client.user.page.login.onclick.cancel
 */
function Syntelos_client_user_page_login_onclick_cancel( input){
    if (input){
        var form = input.form;
        if (form){
            var doc = Syntelos.client.user.user;
            /*
             * Declared document bindings
             */
            var pad = Syntelos.valueOf(doc,'pad');
            var nonce = Syntelos.valueOf(doc,'nonce');
            /*
             * Form bindings
             */
            var password = form.elements['password'].value;
            //
            Syntelos.page.overlay.show('user_form_container','user_form_container_overlay');
            //
            Syntelos.client.user.page.init();
        }
        else {
            Syntelos.page.alert('user_form_container','user_form_container_overlay','password','user_form_container_overlay_alert','user_alert_msg','user_alert_ok',"Bug missing 'input.form'.");
        }
    }
    else {
        Syntelos.page.alert('user_form_container','user_form_container_overlay','password','user_form_container_overlay_alert','user_alert_msg','user_alert_ok',"Bug missing 'form-input'.");
    }
}
Syntelos.add('Syntelos.client.user.page.login.onclick.cancel',Syntelos_client_user_page_login_onclick_cancel);

/**
 * Syntelos.client.user.page.create
 */
function Syntelos_client_user_page_create(){
    var page_id = Syntelos.client.user.page.id;
    var elem = document.getElementById(page_id);
    if (elem){
        /*
         * RESTful DOM state
         */
        var doc = Syntelos.client.user.user;
        /*
         * Declared document bindings
         */
        var nonce = Syntelos.valueOf(doc,'nonce');
        /*
         * RESTful DOM state binding
         */
        var name = Syntelos.valueOf(doc,'name');
        var password = Syntelos.valueOf(doc,'password');
        //
        var client_id = 'user';
        var css_class = 'client';
        var css_class_overlay = 'client_overlay';
        var css_class_overlay_alert = 'client_overlay_alert';
        var css_style = '';
        var css_width = '';
        var css_height = '';
        var count_inputs = 2;
        var count_submits = 2;
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
        sb += '<label for="name" class="client" name="name">name</label>';
        sb += '</td>';
        sb += '<td colspan="'+count_submits+'">';
        sb += '<input type="text"  class="client" id="name" name="name" value="'+name+'"/>';
        sb += '</td>';
        sb += '</tr>';
        sb += '<tr>';
        sb += '<td>';
        sb += '<label for="password" class="client" name="password">password</label>';
        sb += '</td>';
        sb += '<td colspan="'+count_submits+'">';
        sb += '<input type="password"  class="client" id="password" name="password" value="'+password+'"/>';
        sb += '</td>';
        sb += '</tr>';
        sb += '<tr>';
        sb += '<td/>';
        sb += '<td>';
        sb += '<input type="submit"  class="client" id="create" name="op" value="create" onclick="javascript:return Syntelos.client.user.page.create.onclick.create(this);"/>';
        sb += '</td>';
        sb += '<td>';
        sb += '<input type="submit"  class="client" id="cancel" name="op" value="cancel" onclick="javascript:return Syntelos.client.user.page.create.onclick.cancel(this);"/>';
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
        sb += '<td class="'+css_class_overlay_alert+'" id="'+client_id+'_alert_msg"/>';
        sb += '</tr>';
        sb += '<tr>';
        sb += '<td class="'+css_class_overlay_alert+'" align="center">';
        sb += '<input id="'+client_id+'_alert_ok" class="'+css_class_overlay_alert+'" type="submit" name="alert" value="ok" onclick="javascript: return Syntelos.page.alert.onclick.ok(this);"/>';
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
        Syntelos.page.alert('user_form_container','user_form_container_overlay','name','user_form_container_overlay_alert','user_alert_msg','user_alert_ok','Missing or invalid page id.');
    }
}
Syntelos.add('Syntelos.client.user.page.create',Syntelos_client_user_page_create);
Syntelos.add('Syntelos.client.user.validate.name',new RegExp('^[a-zA-Z0-9 _\',\.%@!+-|~\&]{4,36}$'));
Syntelos.add('Syntelos.client.user.validate.name.errmessage','Please reformat \'name\', require 4 to 36 characters including letters, numbers, \'. , _ % @ ! + - | ~ &\' and space.');
Syntelos.add('Syntelos.client.user.validate.password',new RegExp('^[a-zA-Z0-9 \.,_%@!+-|~\&]{6,16}$'));
Syntelos.add('Syntelos.client.user.validate.password.errmessage','Please choose another \'password\', require 6 to 16 characters including letters, numbers, \'. , _ % @ ! + - | ~ &\' and space.');

/**
 * Syntelos.client.user.page.create.onclick.create
 */
function Syntelos_client_user_page_create_onclick_create( input){
    if (input){
        var form = input.form;
        if (form){
            var doc = Syntelos.client.user.user;
            /*
             * Declared document bindings
             */
            var nonce = Syntelos.valueOf(doc,'nonce');
            /*
             * Form bindings
             */
            var name = form.elements['name'].value;
            if (name && name == name.match(Syntelos.client.user.validate.name)){
                var password = form.elements['password'].value;
                if (password && password == password.match(Syntelos.client.user.validate.password)){
                    //
                    Syntelos.page.overlay.show('user_form_container','user_form_container_overlay');
                    //
                    var xhr = new Syntelos.net(Syntelos.client.user.page.create.response.create);
                    xhr.open("POST","/user?op=create");
                    /*
                     * Begin script
                     */
                    var md = new md5();
                    md.updateString(password);
                    md.updateHex(nonce);
                    password = md.hashHex();
                    /*
                     * End script
                     */
                    /*
                     * Declared document bindings
                     */
                    Syntelos.setValue(doc,'nonce',nonce);
                    /*
                     * Form bindings
                     */
                    Syntelos.setValue(doc,'name',name);
                    Syntelos.setValue(doc,'password',password);
                    xhr.send(doc);
                }
                else {
                    Syntelos.page.alert('user_form_container','user_form_container_overlay','password','user_form_container_overlay_alert','user_alert_msg','user_alert_ok','Please choose another \'password\', require 6 to 16 characters including letters, numbers, \'. , _ % @ ! + - | ~ &\' and space.');
                }
            }
            else {
                Syntelos.page.alert('user_form_container','user_form_container_overlay','name','user_form_container_overlay_alert','user_alert_msg','user_alert_ok','Please reformat \'name\', require 4 to 36 characters including letters, numbers, \'. , _ % @ ! + - | ~ &\' and space.');
            }
        }
        else {
            Syntelos.page.alert('user_form_container','user_form_container_overlay','name','user_form_container_overlay_alert','user_alert_msg','user_alert_ok',"Bug missing 'input.form'.");
        }
    }
    else {
        Syntelos.page.alert('user_form_container','user_form_container_overlay','name','user_form_container_overlay_alert','user_alert_msg','user_alert_ok',"Bug missing 'form-input'.");
    }
}
Syntelos.add('Syntelos.client.user.page.create.onclick.create',Syntelos_client_user_page_create_onclick_create);

/**
 * Syntelos.client.user.page.create.response.create
 */
function Syntelos_client_user_page_create_response_create( xhr){
    //
    //
    if (4 == xhr.readyState){
        var doc = xhr.responseXML;
        if (doc){
            var test = doc.documentElement.localName;
            if ('success' == test){
                var msg = doc.getElementsByTagNameNS("http://www.syntelos.org/edit","message").item(0).firstChild.nodeValue;
                Syntelos.client.user.page.logout();
                return;
            }
            else if ('error' == test){
                var msg = doc.getElementsByTagNameNS("http://www.syntelos.org/edit","message").item(0).firstChild.nodeValue;
                if (msg){
                    Syntelos.page.alert('user_form_container','user_form_container_overlay','name','user_form_container_overlay_alert','user_alert_msg','user_alert_ok',msg);
                }
                else {
                    Syntelos.page.alert('user_form_container','user_form_container_overlay','name','user_form_container_overlay_alert','user_alert_msg','user_alert_ok','Error, request not OK.');
                }
                return;
            }
        }
        Syntelos.page.alert('user_form_container','user_form_container_overlay','name','user_form_container_overlay_alert','user_alert_msg','user_alert_ok','Error unresponsive.');
    }
}
Syntelos.add('Syntelos.client.user.page.create.response.create',Syntelos_client_user_page_create_response_create);

/**
 * Syntelos.client.user.page.create.onclick.cancel
 */
function Syntelos_client_user_page_create_onclick_cancel( input){
    if (input){
        var form = input.form;
        if (form){
            var doc = Syntelos.client.user.user;
            /*
             * Declared document bindings
             */
            var nonce = Syntelos.valueOf(doc,'nonce');
            /*
             * Form bindings
             */
            var name = form.elements['name'].value;
            if (name && name == name.match(Syntelos.client.user.validate.name)){
                var password = form.elements['password'].value;
                if (password && password == password.match(Syntelos.client.user.validate.password)){
                    //
                    Syntelos.page.overlay.show('user_form_container','user_form_container_overlay');
                    //
                    Syntelos.client.user.page.init();
                }
                else {
                    Syntelos.page.alert('user_form_container','user_form_container_overlay','password','user_form_container_overlay_alert','user_alert_msg','user_alert_ok','Please choose another \'password\', require 6 to 16 characters including letters, numbers, \'. , _ % @ ! + - | ~ &\' and space.');
                }
            }
            else {
                Syntelos.page.alert('user_form_container','user_form_container_overlay','name','user_form_container_overlay_alert','user_alert_msg','user_alert_ok','Please reformat \'name\', require 4 to 36 characters including letters, numbers, \'. , _ % @ ! + - | ~ &\' and space.');
            }
        }
        else {
            Syntelos.page.alert('user_form_container','user_form_container_overlay','name','user_form_container_overlay_alert','user_alert_msg','user_alert_ok',"Bug missing 'input.form'.");
        }
    }
    else {
        Syntelos.page.alert('user_form_container','user_form_container_overlay','name','user_form_container_overlay_alert','user_alert_msg','user_alert_ok',"Bug missing 'form-input'.");
    }
}
Syntelos.add('Syntelos.client.user.page.create.onclick.cancel',Syntelos_client_user_page_create_onclick_cancel);

/**
 * Syntelos.client.user.page.logout
 */
function Syntelos_client_user_page_logout(){
    var page_id = Syntelos.client.user.page.id;
    var elem = document.getElementById(page_id);
    if (elem){
        /*
         * RESTful DOM state
         */
        var doc = Syntelos.client.user.user;
        /*
         * RESTful DOM state binding
         */
        var email = Syntelos.valueOf(doc,'email');
        //
        var client_id = 'user';
        var css_class = 'client';
        var css_class_overlay = 'client_overlay';
        var css_class_overlay_alert = 'client_overlay_alert';
        var css_style = '';
        var css_width = '';
        var css_height = '';
        var count_inputs = 1;
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
        sb += '<label for="email" class="client" name="email">email</label>';
        sb += '</td>';
        sb += '<td colspan="'+count_submits+'">';
        sb += '<input type="text" readonly class="client" id="email" name="email" value="'+email+'"/>';
        sb += '</td>';
        sb += '</tr>';
        sb += '<tr>';
        sb += '<td/>';
        sb += '<td>';
        sb += '<input type="submit"  class="client" id="logout" name="op" value="logout" onclick="javascript:return Syntelos.client.user.page.logout.onclick.logout(this);"/>';
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
        sb += '<td class="'+css_class_overlay_alert+'" id="'+client_id+'_alert_msg"/>';
        sb += '</tr>';
        sb += '<tr>';
        sb += '<td class="'+css_class_overlay_alert+'" align="center">';
        sb += '<input id="'+client_id+'_alert_ok" class="'+css_class_overlay_alert+'" type="submit" name="alert" value="ok" onclick="javascript: return Syntelos.page.alert.onclick.ok(this);"/>';
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
        var input = document.getElementById('email');
        if (input && typeof input.focus == 'function'){
            input.focus()
        }
    }
    else {
        Syntelos.page.alert('user_form_container','user_form_container_overlay','email','user_form_container_overlay_alert','user_alert_msg','user_alert_ok','Missing or invalid page id.');
    }
}
Syntelos.add('Syntelos.client.user.page.logout',Syntelos_client_user_page_logout);

/**
 * Syntelos.client.user.page.logout.onclick.logout
 */
function Syntelos_client_user_page_logout_onclick_logout( input){
    if (input){
        var form = input.form;
        if (form){
            var doc = Syntelos.client.user.user;
            /*
             * Form bindings
             */
            var email = form.elements['email'].value;
            //
            Syntelos.page.overlay.show('user_form_container','user_form_container_overlay');
            //
            var xhr = new Syntelos.net(Syntelos.client.user.page.logout.response.logout);
            xhr.open("GET","/user?op=logout");
            /*
             * Begin script
             */
            Syntelos.client.user.user = null;
            /*
             * End script
             */
            /*
             * Form bindings
             */
            Syntelos.setValue(doc,'email',email);
            xhr.send(null);
        }
        else {
            Syntelos.page.alert('user_form_container','user_form_container_overlay','email','user_form_container_overlay_alert','user_alert_msg','user_alert_ok',"Bug missing 'input.form'.");
        }
    }
    else {
        Syntelos.page.alert('user_form_container','user_form_container_overlay','email','user_form_container_overlay_alert','user_alert_msg','user_alert_ok',"Bug missing 'form-input'.");
    }
}
Syntelos.add('Syntelos.client.user.page.logout.onclick.logout',Syntelos_client_user_page_logout_onclick_logout);

/**
 * Syntelos.client.user.page.logout.response.logout
 */
function Syntelos_client_user_page_logout_response_logout( xhr){
    //
    //
    if (4 == xhr.readyState){
        var doc = xhr.responseXML;
        if (doc){
            var test = doc.documentElement.localName;
            if ('success' == test){
                var msg = doc.getElementsByTagNameNS("http://www.syntelos.org/edit","message").item(0).firstChild.nodeValue;
                Syntelos.client.user.page.init();
                return;
            }
            else if ('error' == test){
                var msg = doc.getElementsByTagNameNS("http://www.syntelos.org/edit","message").item(0).firstChild.nodeValue;
                if (msg){
                    Syntelos.page.alert('user_form_container','user_form_container_overlay','email','user_form_container_overlay_alert','user_alert_msg','user_alert_ok',msg);
                }
                else {
                    Syntelos.page.alert('user_form_container','user_form_container_overlay','email','user_form_container_overlay_alert','user_alert_msg','user_alert_ok','Error, request not OK.');
                }
                return;
            }
        }
        Syntelos.page.alert('user_form_container','user_form_container_overlay','email','user_form_container_overlay_alert','user_alert_msg','user_alert_ok','Error unresponsive.');
    }
}
Syntelos.add('Syntelos.client.user.page.logout.response.logout',Syntelos_client_user_page_logout_response_logout);
