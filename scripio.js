/*
scripio is a (very) lightweight library written by Kevin Phillips in 2021 containing only one function

loadio('url'); // to load the script

It is provided as-is without warranty and is subject to change
it can be used and copied and modifed without need for permission
*/

function loadio(url, implementationCode, location){

    return new Promise(function(resolve, reject) 
    {
        
        let scriptTag = document.createElement('script');
        scriptTag.src = url;
    
        if (typeof implementationCode != 'undefined') {
        
            scriptTag.onload = implementationCode;
            scriptTag.onreadystatechange = implementationCode;
        }
        else {

        }

        if (typeof location != 'undefined') 
            location.appendChild(scriptTag);
        else
            document.body.appendChild(scriptTag);
        
        resolve(scriptTag);
    });
};
function jsDelivrIO(acct, repo, filePath) 
{
    return loadio(jsDeliverHelper(acct, repo, filePath);    
}
// example:
// let jsToScripio = jsDelivrHelper('clearwinggames', 'xcdn', 'scripio.js'); // returns path to this file
function jsDelivrHelper(acct, repo, filePath)
{
    return "https://cdn.jsdelivr.net/gh/" + acct + "/" + repo + "/" + filePath;
}
