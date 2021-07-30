async function doThings()
{
  await doOneThing(3500);
  await doAnotherThing(3500);
}

async function doOneThing(ms)
{
    return new Promise(function(resolve,reject) 
    {
      alert('starting one');
        setTimeout(() => {
          alert('success');
          resolve('success'); 
        }, ms);
    });
//    (resolve => setTimeout(resolve, ms));
}
async function doAnotherThing(ms)
{
    return new Promise(function(resolve,reject) 
    {
      alert('starting two');
        setTimeout(() => {
          alert('success two');
          resolve('success two'); 
        }, ms);
    });
}
