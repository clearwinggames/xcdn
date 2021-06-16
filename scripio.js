function loadio(url, implementationCode, location){

    let scriptTag = document.createElement('script');
    scriptTag.src = url;
    
    if (typeof implementationCode != 'undefined') {
        
        scriptTag.onload = implementationCode;
        scriptTag.onreadystatechange = implementationCode;
    }

    if (typeof location != 'undefined')
        location.appendChild(scriptTag);
    else
        document.body.appendChild(scriptTag);
};
