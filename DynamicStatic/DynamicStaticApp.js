Vue.component('recursive-vue-app',
{
  props: ['dataUrl', 'structureUrl', 'dataObject', 'structureObject'],
  data: function () {
    return {
        structure: null,
		data: null
    }
  },
  mounted: function() { 
	  let me = this;
	if (this.structureObject == null && this.structureUrl != null && this.structureUrl.length > 0) {
		// go get the structure object 
		httpGet(this.structureUrl).then(x => {
			me.structure = JSON.parse(x);
		});
	}
  },
  computed: {
  },
  methods: {
  },
  template: `
  <div>
  	<div v-if="structure != null">
  	 <div v-for="entry in structure.entries">
	 	<a :href="entry.route">{{ entry.title }}</a>
	 </div>
    </div>
  </div>`
});
function httpGet(url) 
{
  return new Promise(function(resolve, reject) 
  {  
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() 
    {
        if (this.readyState === 4 && this.status === 200) 
        {
          resolve(this.responseText);
        }
        else if (this.readyState === 4)
        {
            if (this.status === 204)
            {
              resolve('[No Content Found]');
            }
            else if (this.status === 401) 
            {
              resolve('[NOT AUTHORIZED. LOG IN AS ADMINISTRATOR FIRST]');
            }
            else if (this.status === 401) 
            {
              resolve('[FORBIDDEN. LOG IN AS ADMINISTRATOR FIRST]');
            }
            else if (this.status === 500) 
            {
              resolve('[Internal Server Error.]');
            }
            else 
            {
              resolve('Status calling HttpGet at ' + url + ': ' + this.status.toString());
            }
        }
    };

    xhttp.open('GET', url, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
  });
}


