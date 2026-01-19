Vue.component('recursive-vue-app',
{
  props: ['dataUrl', 'structureUrl', 'dataObject', 'structureObject', 'levelName', 'router'],
  data: function () {
    return {
        structure: null,
		data: null,
		name: null
    }
  },
  mounted: function() { 
    let me = this;
	let levelName = this.getLevelName();
	if (this.structureObject == null && this.structureUrl != null && this.structureUrl.length > 0) {
		// go get the structure object 
		httpGet(this.structureUrl).then(x => {
			me.structure = JSON.parse(x);
	        me.name = me.structure.name;
			for (let i = 0; i < me.structure.entries.length; i++)
			{
				let templ = me.structure.entries[i].template;
				if (templ == null || templ.length == 0) templ = `<div>Autofilled: ${me.structure.entries[i].title}</div>`;
				if (typeof me.structure.entries[i].target != 'undefined' && me.structure.entries[i].target != null && me.structure.entries[i].target.length > 0)
				{  
					// modify templ     structure-url="./main.json" :router="router_hub"
					templ = templ.replace('{{ recurse }}', `<recursive-vue-app structure-url="${me.structure.entries[i].target}" :router="vue.router_hub" />`);
				}   // how can we pass the router through this way?  Seems not straightforward...
				
					me.router.addRoute({ path: me.structure.entries[i].route, 
					components: { [levelName]: { template: templ } } 
					//components: { default: { template: '<div>Other</div>' }, alt: { template: '<div>Placeholder</div>' } }
				   });
					
				

			}
		});
	}
  },
  computed: {

  },
  methods: {
	  getVueApp: function() {
		  return this.$root;
	  },
	  getLevelName: function() {
		  if (this.levelName != null && this.levelName.length > 0) return this.levelName;
		  else if (this.name != null && this.name.length > 0) return this.name;
		  return 'unnamed';
	  }
  },
  template: `
  <div>
  	<div v-if="structure != null">
  	 <div v-for="entry in structure.entries">
	 	<a :href="location.href + entry.title">{{ entry.title }}</a>
	 </div>
	 <div> 
	     <router-view :name="getLevelName()"></router-view>
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





















































