/* 
oncejs is a framework supporting an alternate promise syntax
created by Kevin Phillips in 2021 (not in afiliation with any particular organization)
It is provided without warranty and subject to change
it can be copied and modified and used by someone else for free

CODE EXPLANATION 

"once() syntax":

(function) // runs once done.
.once() // wait for promise to finish
.once() // also wait for this promise to finish

(() => alert('abcdefghi'))
.once(burnTime(1000))
.once(burnTime(6000))
.once(burnTime(2000)) // these would run concurrently and take a total of 6 seconds for all three to finish (alert fires after six seconds once all three finish).

*/

function burnTime(milliseconds){
    return new Promise(function(resolve, reject) {
        setTimeout(() => {
            resolve("Time Burnt.");
        }, milliseconds);        
    });
};

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
