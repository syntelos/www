function toolCancelByName(did){

    var tel = document.getElementById(did);
    if (tel)
        tel.style.visibility = 'hidden';

}
/*
 */
function callToolCreate(){
    toolCancel();

    var tel = document.getElementById('toolCreate');
    if (tel)
        tel.style.visibility = 'visible';

    var fel = document.forms['tool'];
    if (fel){
        var inp = fel.elements['tool_op'];
        if (!inp)
            inp = fel.elements['op'];

        if (inp)
            inp.value = 'Create';
    }
    return false;
}

function toolCreateCancel(){

    var tel = document.getElementById('toolCreate');
    if (tel)
        tel.style.visibility = 'hidden';

    return false;
}

function toolCreateClose(){

    var tel = document.getElementById('toolCreate');
    if (tel)
        tel.style.visibility = 'hidden';

    return false;
}
/*
 */
function callToolDelete(){
    toolCancel();

    var tel = document.getElementById('toolDelete');
    if (tel)
        tel.style.visibility = 'visible';

    var fel = document.forms['tool'];
    if (fel){
        var inp = fel.elements['tool_op'];
        if (!inp)
            inp = fel.elements['op'];

        if (inp)
            inp.value = 'Delete';
    }
    return false;
}

function toolDeleteCancel(){

    var tel = document.getElementById('toolDelete');
    if (tel)
        tel.style.visibility = 'hidden';

    return false;
}

function toolDeleteClose(){

    var tel = document.getElementById('toolDelete');
    if (tel)
        tel.style.visibility = 'hidden';

    return false;
}
/*
 */
function callToolExport(){
    toolCancel();

    var tel = document.getElementById('toolExport');
    if (tel)
        tel.style.visibility = 'visible';

    var fel = document.forms['tool'];
    if (fel){
        var inp = fel.elements['tool_op'];
        if (!inp)
            inp = fel.elements['op'];

        if (inp)
            inp.value = 'Export';
    }
    return false;
}

function toolExportCancel(){

    var tel = document.getElementById('toolExport');
    if (tel)
        tel.style.visibility = 'hidden';

    return false;
}

function toolExportClose(){

    var tel = document.getElementById('toolExport');
    if (tel)
        tel.style.visibility = 'hidden';

    return false;
}
/*
 */
function callToolGoto(){
    toolCancel();

    var tel = document.getElementById('toolGoto');
    if (tel)
        tel.style.visibility = 'visible';

    var fel = document.forms['tool'];
    if (fel){
        var inp = fel.elements['tool_op'];
        if (!inp)
            inp = fel.elements['op'];

        if (inp)
            inp.value = 'Goto';
    }
    return false;
}

function toolGotoCancel(){

    var tel = document.getElementById('toolGoto');
    if (tel)
        tel.style.visibility = 'hidden';

    return false;
}

function toolGotoClose(){

    var tel = document.getElementById('toolGoto');
    if (tel)
        tel.style.visibility = 'hidden';

    return false;
}
/*
 */
function callToolImport(){
    toolCancel();

    var tel = document.getElementById('toolImport');
    if (tel)
        tel.style.visibility = 'visible';

    var fel = document.forms['tool'];
    if (fel){
        var inp = fel.elements['tool_op'];
        if (!inp)
            inp = fel.elements['op'];

        if (inp)
            inp.value = 'Import';
    }
    return false;
}

function toolImportCancel(){

    var tel = document.getElementById('toolImport');
    if (tel)
        tel.style.visibility = 'hidden';

    return false;
}

function toolImportClose(){

    var tel = document.getElementById('toolImport');
    if (tel)
        tel.style.visibility = 'hidden';

    return false;
}
/*
 */
function callToolUpdate(){
    toolCancel();

    var tel = document.getElementById('toolUpdate');
    if (tel)
        tel.style.visibility = 'visible';

    var fel = document.forms['tool'];
    if (fel){
        var inp = fel.elements['tool_op'];
        if (!inp)
            inp = fel.elements['op'];

        if (inp)
            inp.value = 'Update';
    }
    return false;
}
function toolUpdateCancel(){

    var tel = document.getElementById('toolUpdate');
    if (tel)
        tel.style.visibility = 'hidden';

    return false;
}

function toolUpdateClose(){

    var tel = document.getElementById('toolUpdate');
    if (tel)
        tel.style.visibility = 'hidden';

    return false;
}
