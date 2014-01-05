    /*
     * (include from bottom, edit for "goto")
     */
    function isSkip(){
      var loca = document.location.toString();
      var fidx = loca.lastIndexOf('#');
      if (-1 != fidx){
        var terms = loca.substring(fidx).split(/[&;#]/);
        if (terms){
          for (var cc = 0, count = terms.length; cc < count; cc++){
            var term = terms[cc];
            var np = term.split('=');
            if (np && 2 == np.length){
              var name = np[0];
              var value = np[1];
              if ("skip" == name)
                return (skip = ("true" == value));
            }
          }
        }
      }
      return true;
    }
    function unskip(){
      if (timeout){
        clearTimeout(timeout);
        timeout = 0;
      }
      return true;
    }
    function syntelos_goto(){
      document.location = "http://blog.syntelos.com/";
    }

    /*
     * (main)
     */
    var timeout ;
    var skip = isSkip();

    if (skip){
      timeout = setTimeout(syntelos_goto,8000);
    }
    else {
     if (timeout)
      clearTimeout(timeout);
    }
