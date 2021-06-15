
(() => 
{

var script = document.createElement('script');

script.onload = function () {
        alert('Load');
};
script.src = '';

document.head.appendChild(script); 
        
}).once(burnTime(100));


