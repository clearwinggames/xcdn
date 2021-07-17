function GetType(obj){
   var funcNameRegex = /function (.{1,})\(/;
   var results = (funcNameRegex).exec((obj).constructor.toString());
   return (results && results.length > 1) ? results[1] : "";
}
function typeOf(obj){
    var results = (/function (.{1,})\(/).exec((obj).constructor.toString());
   return (results && results.length > 1) ? results[1] : "";
}
