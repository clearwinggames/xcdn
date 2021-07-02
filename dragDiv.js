(function setupDOMRect() {

  DOMRect.prototype.getRight = function() {
    return this.left + this.width;
  };
  DOMRect.prototype.getBottom = function() {
    return this.top + this.height;
  };
  DOMRect.prototype.soundOff = function() {
    alert("(y,x) => " + this.top + ';' + this.left);
    
    alert("(y+h,x+w) => " + this.getBottom() + ';' + this.getRight());
  };
  DOMRect.prototype.checkOverlap = function(domRect) 
  {    
    if (this.top < domRect.getBottom() && domRect.top < this.getBottom())  // overlap Y
    {
      if (this.left < domRect.getRight() && domRect.left < this.getRight()) // overlap X
      {
        return true;
      }
    }
    return false;
  };

})();

function dragElement(elmnt,mouseDown) {

  let callbackObject = {
      runWhenDone: function(element) {
        // this is meant to be overridden externally by whatever called dragElement in the first place
      },
      setCallbackFunction(someFunction) {
        this.runWhenDone = someFunction;
      }
  };

  if (typeof elmnt.innerText != 'undefined')
    console.log('Setting up element drag on element with innerText: ' + elmnt.innerText);

  //if (elmnt.style.position != 'absolute') {
    //elmnt.style.position = 'absolute';
  //}

  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
if(mouseDown != true)
{
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } 
  else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }
}
else {
  var e =  window.event;
  e.preventDefault();
  // get the mouse cursor position at startup:
  pos3 = e.clientX;
  pos4 = e.clientY;
  document.onmouseup = closeDragElement;
  // call a function whenever the cursor moves:
  document.onmousemove = elementDrag;
}

  let me = this;

  this.callbackObject = callbackObject;
  this.draggedElement = elmnt;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;

    me.callbackObject.runWhenDone(me.draggedElement);
  }

  return callbackObject;
}
