Object.prototype.isInstanceOf = function( type ) {
    return this instanceof type;
};

Object.prototype.instanceType = function () {
    let types = listDOMTypes();
    for(let i = 0; i < types.length; i++) {
        if (this instanceof types[i]) return types[i];   
    }
    return null;
};

HTMLDivElement.prototype.divAction = function() {
    console.log('Div Action Here');
};
HTMLSpanElement.prototype.spanAction = function() {
    console.log('Span Action Here');
};
function listDOMTypes() {
    return [
                HTMLDivElement, HTMLSpanElement
        ];
};
