

function EndpointLink(controllerName, endpointName) 
{
    this.ControllerName = controllerName;
    this.EndpointName = endpointName;

    this.tryGet = function(actorName) {
      if (typeof actorName == 'undefined') actorName = this.EndpointName;
      return new Promise((resolve, reject) => 
      (() => resolve(vue[actorName]))
      .once(vue.tryGetObject(actorName, this.ControllerName, this.EndpointName)));      
    };   
}
function PassiveBinding(nameOf, vueComponent, endpointLink) 
{
    this.BindingsName = nameOf;
    this.VueComponent = vueComponent;
    this.EndpointLink = endpointLink;
    this.hasCached = false;

    this.invalidateCache = function() {

      this.hasCached = false;

    };

    this.isSetup = function() {
        return this.cached() != null;
    };

    this.forEach = function() {
        let payload = null;
        let output = ""; // html
        payload = this.cached();

        if (payload != null) {
          for(let i = 0; i < payload.problems.length; i++) {
              output += "<div>" + JSON.stringify(payload.problems[i]) + "</div>";
          }
        }
        return output;
    };

    this.cached = function() 
    {              

      if (typeof this.VueComponent.app()[this.BindingsName] == 'undefined'){
  
          this.EndpointLink.tryGet(this.BindingsName);

          let me = this;

          setTimeout(() => 
          {
            me.cached();
          }, 100);

          return null;
      }
      else if (this.hasCached == false) 
      {
        let me = this;

        setTimeout(() => 
        {
          me.VueComponent.$forceUpdate();
          me.hasCached = true;

        }, 0);
      }

      return this.VueComponent.app()[this.BindingsName];
    };
    this.InvalidateCache = function() 
    {
      throw "Not Implemented Yet.";
    };
}

Promise.prototype.chk = function() {
    return this.analyzed();
};
Promise.prototype.analyzed = function() {

    let promise = this;

    if (typeof promise.attempted == 'undefined') {

      promise.attempted = true;

    // Set initial state
    var isPending = true;
    var isRejected = false;
    var isFulfilled = false;

    this.Fulfilled = function() {
        if (typeof this.isFulfilled == 'undefined') return false;
        else
        return this.isFulfilled;
    }

    promise.then(
        function(v) {

            isFulfilled = true;
            isPending = false;

            promise.isFulfilled = isFulfilled; 
            promise.isPending = isPending; 
            promise.isRejected = isRejected; 

            return promise; 
        }, 
        function(e) {

            isRejected = true;
            isPending = false;

            
            promise.isFulfilled = isFulfilled;
            promise.isPending = isPending;
            promise.isRejected = isRejected;
            throw e; 
        }
    );


      return promise;
      }
      else{
        return this;
      }
};
Function.prototype.when = function(prom) {
    return this.once(prom);
};
Function.prototype.once = function(prom) {

  this.promise = prom;

  this.promises.push(prom);

  this.promises[this.promises.length - 1].then(() => { this.onceExec() });
  
  return this;//.onceExec;
};

Function.prototype.begin = function() {
   this.onceExec();
}
Function.prototype.onceExec = function() {

    let allFinished = true;
    
    for(let i = 0; i < this.promises.length; i++) 
    {
        // if any aren't finished set allFinished to false
        this.promises[i] = this.promises[i].chk();
        let aProm = this.promises[i];//.analyzed();
        if (aProm.Fulfilled()==false) {
            
            console.log('Not fulfilled (' + i.toString() + '): ' + JSON.stringify(aProm));

            this.promises[i].then(() => { this.onceExec() });

            allFinished = false;
        }
    }
    if (allFinished == true && this.promise != null && typeof this.promise.then != 'undefined') 
    {
       this.promise.then(this); // should theoretically just work.
       this.promises = [];
       this.promise = null;
    }
};

Function.prototype.promise = null;
Function.prototype.promises = [];

Promise.prototype.run = function(vApp)
{
    alert('Running the then function now but whatever');

    this.then(() => { vApp.userReport() });
};

/* CODE EXPLANATION 

"once() syntax":

(function) // runs once done.
.once() // wait for promise to finish
.once() // also wait for this promise to finish

(() => alert('abcdefghi'))
.once(vue.slowGetUser(5000))
.once(vue.slowGetUser(10000))
.once(vue.slowGetUser(15000))

*/
