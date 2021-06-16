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
