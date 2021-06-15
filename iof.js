Object.prototype.isInstanceOf = function( type ) {
    return this instanceof type;
};

HTMLDivElement.prototype.divAction = function() {
    console.log('Div Action Here');
};
HTMLSpanElement.prototype.spanAction = function() {
    console.log('Span Action Here');
};
