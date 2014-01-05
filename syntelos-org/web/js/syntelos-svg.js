/*
 * file 'syntelos-svg.js': Syntelos community library
 * 
 * Copyright (C) 2006 The Syntelos Project.  All rights reserved.
 * 
 * This file licensed under the terms of the BSD License.  As
 * according to the terms of the BSD License: copying is only
 * permitted with this copyright, license, author and version
 * statement intact (included and not modified).
 * 
 * @see http://www.syntelos.com/js/docs/
 * @author jdp@syntelos.com
 * @version 20060712
 */

Syntelos.add("Syntelos.SVG.xmlns","http://www.w3.org/2000/svg");

function Syntelos_SVG_parent(elem){
    while (elem){
	if (elem instanceof SVGSVGElement)
	    return elem;
	else
	    elem = elem.parentNode;
    }
    return null;
}
Syntelos.add("Syntelos.SVG.parent",Syntelos_SVG_parent);

function Syntelos_SVG_viewport(elem){
    while (elem){
	if (elem instanceof SVGSVGElement){
	    if (elem.viewportElement)
		return elem.viewportElement;
	    else
		return elem;
	}
	else
	    elem = elem.parentNode;
    }
    return null;
}
Syntelos.add("Syntelos.SVG.viewport",Syntelos_SVG_viewport);

function Syntelos_SVG_viewbox(svg){
    svg = Syntelos_SVG_parent(svg);
    if (svg){
	if (null == svg.viewportElement){
	    /*
	     * Use viewport's current viewbox
	     */
	    return svg.viewBox.animVal;
	}
	else {
	    /*
	     * Use element's x, y, width and height
	     */
	    var rect = svg.createSVGRect();
	    rect.x = svg.x.animVal.value;
	    rect.y = svg.y.animVal.value;
	    rect.width = svg.width.animVal.value;
	    rect.height = svg.height.animVal.value;
	    return rect;
	}
    }
    return null;
}
Syntelos.add("Syntelos.SVG.viewbox",Syntelos_SVG_viewbox);

function Syntelos_SVG_Menu_init(svg){
    var location_id = Syntelos.URI.basename();
    var location_uri = Syntelos.URI.dirname() + "/menu.xml";
    var source = Syntelos.XC.Instance.getXML(location_uri);
    if (source){
	source = source.documentElement;
	var target = svg;
	var svg_dd = svg.ownerDocument;
	var viewbox = Syntelos_SVG_viewbox(target);
	var svg_ww = viewbox.width-4;
	var svg_hh = viewbox.height-2;
	var svg_fz = svg.getAttribute('font-size');
	if (svg_fz){
	    svg_fz = parseFloat(svg_fz);
	    var svg_cf = svg.getAttribute('fg-color');
	    if (svg_cf){
		var svg_cb = svg.getAttribute('bg-color');
		if (svg_cb){
		    var svg_co = svg.getAttribute('border-color');
		    if (svg_co){
			var svg_bw = svg.getAttribute('box-width');
			if (svg_bw){
			    svg_bw = parseFloat(svg_bw);
			    //
			    var leading = (svg_fz / 5);
			    var dx = (svg_fz - leading);
			    var dy = (svg_fz);// + leading);
			    //
			    var group = svg_dd.createElementNS(Syntelos.SVG.xmlns,'g');
			    group.setAttribute('x','0');
			    group.setAttribute('y','0');
			    group.setAttribute('width',svg_ww);
			    group.setAttribute('height',svg_hh);
			    target.appendChild(group);
			    target = group;
			    //
			    var control = svg_dd.createElementNS(Syntelos.SVG.xmlns,'circle');
			    control.setAttribute('cx','1px');
			    control.setAttribute('cy','1px');
			    control.setAttribute('r','6px');
			    control.setAttribute('fill',svg_co);
			    control.setAttribute('stroke',svg_cf);
			    control.setAttribute('stroke-width','1px');
			    control.setAttribute('pointer-events','all');
			    control.setAttribute('onmousedown','control_mousedown(evt,this.parentNode)');
			    control.setAttribute('onmouseup','control_mouseup(evt,this.parentNode)');
			    control.setAttribute('onmousemove','control_mousemove(evt,this.parentNode)');
			    target.appendChild(control);
			    //
			    var rect = svg_dd.createElementNS(Syntelos.SVG.xmlns,'rect');
			    rect.setAttribute('x','1');
			    rect.setAttribute('rx',leading);
			    rect.setAttribute('y','1');
			    rect.setAttribute('ry',leading);
			    rect.setAttribute('width',svg_ww);
			    rect.setAttribute('height',(dy+(2*leading)));
			    rect.setAttribute('fill','none');
			    rect.setAttribute('stroke',svg_cf);
			    rect.setAttribute('stroke-width','1px');
			    target.appendChild(rect);
			    //			    
			    _menu_display(0, dx, leading, svg_dd,source,target,dx,dy,leading,svg_bw,svg_fz,svg_cf,svg_co,svg_cb,null);
			}
			else
			    throw new State("Missing 'svg' attribute 'box-width'.");
		    }
		    else
			throw new State("Missing 'svg' attribute 'border-color'.");
		}
		else
		    throw new State("Missing 'svg' attribute 'bg-color'.");
	    }
	    else
		throw new State("Missing 'svg' attribute 'fg-color'.");
	}
	else
	    throw new State("Missing 'svg' attribute 'font-size'.");
    }
    else
	throw new URIException("Menu not found '"+location_uri+"'.");
}
Syntelos.add("Syntelos.SVG.Menu.init",Syntelos_SVG_Menu_init);

function _menu_display( level, xx, yy, doc, source, target, dx, dy, leading, bw, fz, cf, co, cb, container){
    if (source){
	var setdirection_hor = (0 == (level & 1));
	//
	var xxx = xx, 
	    yyy = yy, 
	    www = source.getAttribute('w'), 
	    hhh = source.getAttribute('h');
	if (www)
	    www = parseFloat(www);
	else
	    www = bw;
	if (hhh)
	    hhh = parseFloat(hhh);
	else
	    hhh = (dy);
	//
	if (! setdirection_hor){
	    xxx = (xxx + leading);
	    yyy = (yyy + dy + (2 * leading));
	}
	var children = source.childNodes,
	    item, label, link, rect, anchor, text, data, href;
	for (var idx = 0, len = children.length; idx < len; idx++){
	    item = children.item(idx);
	    if ('menu' == item.localName){
		label = item.getAttribute('label');
		link = item.getAttribute('link');
		if (label && link){

		    rect = doc.createElementNS(Syntelos.SVG.xmlns,'rect');
		    rect.setAttribute('id',item.getAttribute('id'));
		    rect.setAttribute('x',xxx);
		    rect.setAttribute('rx',leading);
		    rect.setAttribute('y',yyy);
		    rect.setAttribute('ry',leading);
		    rect.setAttribute('width',www);
		    rect.setAttribute('height',hhh+leading);
		    if (container){
			var container_h = container.getAttribute('height');
			container_h = parseFloat(container_h);
			container.setAttribute('height',(container_h+hhh+(2*leading)));
		    }
		    rect.setAttribute('fill',cb);
		    rect.setAttribute('stroke',co);
		    rect.setAttribute('stroke-width','1px');
		    target.appendChild(rect);
		    //
		    item.setAttribute('x',xxx);
		    item.setAttribute('y',yyy);
		    item.setAttribute('w',www);
		    item.setAttribute('h',hhh);
		    //
 		    anchor = doc.createElementNS(Syntelos.SVG.xmlns,'a');
		    //<href-tricky>
		    href = doc.createAttributeNS(Syntelos.XLink.xmlns,'xlink:href');
  		    anchor.setAttributeNode(href);
   		    href.nodeValue = link;
		    //</href-tricky>
		    anchor.setAttribute('pointer-events','all');
		    //
		    text = doc.createElementNS(Syntelos.SVG.xmlns,'text');
		    text.setAttribute('x',(xxx+leading));
		    text.setAttribute('y',(dy+2));
		    text.setAttribute('fill',cf);
		    //
		    data = doc.createTextNode(label);
		    //
		    text.appendChild(data);
		    anchor.appendChild(text);
		    target.appendChild(anchor);
		    if (setdirection_hor){

			if (item.hasChildNodes()){
			    _menu_display( (level+1), xxx, yyy, doc, item, target, dx, dy, leading, bw, fz, cf, co, cb, rect);
			}
			xxx = (xxx + dx + bw);

		    }
		    else {
			text.setAttribute('y',(yyy+dy-leading+2));

			yyy = (yyy + dy + (2 * leading));
		    }
		}
	    }
	}
    }
}
function Syntelos_SVG_Text_layout(text_elem, height){
    if (text_elem && height){
	if (text_elem.attributes && text_elem.childNodes){
	    var text_x = text_elem.getAttribute('x');
	    var text_y = text_elem.getAttribute('y');
	    var doc = text_elem.ownerDocument;
	    var children = text_elem.childNodes;
	    var idx = 0, len = children.length, child_y, child_x, offset_y, first = true;
	    var child, child_ln;
	    
	    layoutl:
	    for (; idx < len; idx++){
		child = children.item(idx);
		/*
		 * Find 'tspan' or 'text' child for layout work
		 */
		child_ln = child.localName;
		while ("tspan" != child_ln && "text" != child_ln){
		    child = child.firstChild;
		    if (null == child)
			continue layoutl;
		    else
			child_ln = child.localName;
		}
		/*
		 * (text|tspan): Layout vertical (Y)
		 */
		if (first){
		    /*
		     * identify first value as base offset
		     */
		    child_y = child.getAttribute('y');
		    if (child_y){
			offset_y = parseInt(child_y);
			if (!isNaN(offset_y))
			    first = false;
			else 
			    throw new State("Syntelos.SVG.Text.layout: 'svg:text' has unrecognized value '"+child.attributes['y']+"' in 'y' attribute."); 
		    }
		    else if (text_y){
			offset_y = parseInt(text_y);
			if (!isNaN(offset_y))
			    child.setAttribute('y',offset_y+"px");
			else 
			    throw new State("Syntelos.SVG.Text.layout: element 'svg:text' attribute 'y' value ("+text_y+") is not a number."); 
		    }
		    else 
			throw new State("Syntelos.SVG.Text.layout: missing 'y' attribute value from first 'svg:text', or parent 'svg:text'."); 
		}
		else {
		    child_y = child.getAttribute('y');
		    if (child_y){
			/*
			 * pick up new values
			 */
			offset_y = parseInt(child_y);
                    }
		    else {
			/*
			 * emplace missing values
			 */
			offset_y += height;
			child.setAttribute('y',offset_y+"px");
		    }
		}
		/*
		 * (text|tspan): Layout horizontal (X)
		 */
		if (text_x){
		    if (null == child.getAttribute('x'))
			child.setAttribute('x',text_x);
		}
	    }
	}
	else
	    throw new State("Syntelos.SVG.Text.layout: parent 'svg:text' element missing attributes or children.");
    }
}
Syntelos.add("Syntelos.SVG.Text.layout",Syntelos_SVG_Text_layout);

function Syntelos_SVG_Anchor_Text_fill(a_elem, color){
    if (a_elem && a_elem.attributes){
	var children = a_elem.childNodes;
	var child;
	for (var idx = 0, len = children.length; idx < len; idx++){
	    child = children.item(idx);
	    if ('text' == child.localName){
		child.setAttribute('fill',color);
		return;
	    }
	}
    }
}
Syntelos.add("Syntelos.SVG.Anchor.Text.fill",Syntelos_SVG_Anchor_Text_fill);

function Syntelos_SVG_Library_init(target){
    if (target && target.childNodes){
	var doc = target.ownerDocument;
	var source = Syntelos;
	var fg_color = target.getAttribute('fg-color');
	if (null == fg_color)
	    throw new Exception("Missing attribute 'fg-color'.")
	var bg_color = target.getAttribute('bg-color');
	if (null == bg_color)
	    throw new Exception("Missing attribute 'bg-color'.")
	var bo_color = target.getAttribute('border-color');
	if (null == bo_color)
	    throw new Exception("Missing attribute 'border-color'.")

	var x = 0;
	var y = 0;

	var viewbox = Syntelos_SVG_viewbox(target);
	var w = viewbox.width-2;
	var h = viewbox.height-2;

	var z = parseInt( target.getAttribute('font-size'));

	var leading = (z / 5);
	var dx = (z - leading);
	var dy = (z + leading);

	var group = doc.createElementNS(Syntelos.SVG.xmlns,'g');
	group.setAttribute('x','0');
	group.setAttribute('y','0');
	group.setAttribute('width',w);
	group.setAttribute('height',h);
	target.appendChild(group);
	target = group;

	var control = doc.createElementNS(Syntelos.SVG.xmlns,'circle');
	control.setAttribute('cx','1px');
	control.setAttribute('cy','1px');
	control.setAttribute('r','6px');
	control.setAttribute('fill',bo_color);
	control.setAttribute('stroke',fg_color);
	control.setAttribute('stroke-width','1px');
	control.setAttribute('onmousedown','control_mousedown(evt,this.parentNode)');
	control.setAttribute('onmouseup','control_mouseup(evt,this.parentNode)');
	control.setAttribute('onmousemove','control_mousemove(evt,this.parentNode)');
	target.appendChild(control);

	var rect = doc.createElementNS(Syntelos.SVG.xmlns,'rect');
	rect.setAttribute('x',x);
	rect.setAttribute('rx',leading);
	rect.setAttribute('y',y);
	rect.setAttribute('ry',leading);
	rect.setAttribute('width',w);
	rect.setAttribute('height',h);
	rect.setAttribute('fill','none');
	rect.setAttribute('stroke',fg_color);
	rect.setAttribute('stroke-width','1px');
	target.appendChild(rect);

	y = (y + dy);
	x = (x + dx);

	var text = _private_library_display(doc,target,fg_color,bo_color,bg_color,x,dx,dx,y,dy,dy,w,h,leading,source,source.localName);

	var last_y = _private_library_display_children(doc,source,target,fg_color,bo_color,bg_color,(x + dx),dx,dx,(y),dy,dy,w,h,leading);

	h = (last_y + dx);
	rect.setAttribute('height',h);
    }
    else
	return false;
}
Syntelos.add("Syntelos.SVG.Library.init",Syntelos_SVG_Library_init);

function _private_library_display_children(doc, source, target, fg_color, bo_color, bg_color, x, ax, dx, y, ay, dy, w, h, leading){

    var rect = doc.createElementNS(Syntelos.SVG.xmlns,'rect');
    rect.setAttribute('x',(x-(3*leading)));
    rect.setAttribute('rx',leading);
    rect.setAttribute('y',(y+leading+2));
    rect.setAttribute('ry',leading);
    rect.setAttribute('width',(w));
    rect.setAttribute('fill','none');
    rect.setAttribute('stroke',bo_color);
    rect.setAttribute('stroke-width','1px');
    var oy = y, text;
    for (var childIndex in source.collectionNameSet){
	childName = source.collectionNameSet[childIndex];
	if (childName){
	    child = source[childName];
	    if (child){
		y = (y + dy);
		ay = (ay + dy);
		text = _private_library_display(doc, target, fg_color, bo_color, bg_color, x, ax, dx, y, ay, dy, w, h, leading, child, childName);
		if (child.collectionNameSet){
		    y = _private_library_display_children(doc,child,target,fg_color,bo_color,bg_color,(x + dx),(ax + dx),dx,(y),ay,dy,w,h,leading);
		}
	    }
	}
    }
    dy = (y - oy);
    if (0 < dy){
	rect.setAttribute('height',(dy));
	target.appendChild(rect);
    }
    return y;
}
function _private_library_display(doc, target, fg_color, bo_color, bg_color, x, ax, dx, y, ay, dy, w, h, leading, source, name){

    var text = doc.createElementNS(Syntelos.SVG.xmlns,'text');
    text.setAttribute('x',x);
    text.setAttribute('y',y);
    text.setAttribute('fill',fg_color);

    var data = doc.createTextNode(name);
    text.appendChild(data);

    target.appendChild(text);

    return text;
}
function control_mousedown(evt,group){
    if (group instanceof SVGGElement){
	var ix = evt.clientX;
	var iy = evt.clientY;
	group.ix = ix;
	group.iy = iy;
    }
}
function control_mouseup(evt,group){
    if (group instanceof SVGGElement){
	var ix = evt.clientX;
	var iy = evt.clientY;
	var gx = group.ix;
	var gy = group.iy;
	group.ix = null;
	group.iy = null;
	var dx = (ix - gx);
	var dy = (iy - gy);
	_control_move(group,dx,dy);
    }
}
function control_mousemove(evt,group){
    if (group instanceof SVGGElement){
	var ix = evt.clientX;
	var iy = evt.clientY;
	var gx = group.ix;
	if (gx){
	    var gy = group.iy;
	    if (gy){
		var dx = (ix - gx);
		var dy = (iy - gy);
		_control_move(group,dx,dy);
	    }
	}
    }
}
function _control_move(group,dx,dy){
    if (0 != dx && 0 != dy){
 	var svg = group.parentNode;
 	var xx = parseFloat( svg.getAttribute('x'));
 	xx = (xx + dx);
 	var yy = parseFloat( svg.getAttribute('y'));
 	yy = (xx + dy);
	svg.x.baseVal = xx;
	svg.y.baseVal = yy;
    }
}
