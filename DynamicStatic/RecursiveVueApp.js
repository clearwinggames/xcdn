Vue.component('recursive-vue-app',
{
  props: ['dataUrl', 'structureUrl', 'dataObject', 'structureObject', 'levelName', 'router', 'routerPath', 'parentLevelName', 'debug'],
  data: function () {
    return {
        structure: null,
		data: null,
		name: null,
		routeLoaded: false,
		mounted_plus_delay: false,
    }
  },
  mounted: function() { 
    let me = this;
	if (this.structureObject == null && this.structureUrl != null && this.structureUrl.length > 0) {
		// go get the structure object 
		httpGet(this.structureUrl).then(x => {
			me.structure = JSON.parse(x);
	        me.name = me.structure.name;
			let levelName = me.getLevelName();
			
			console.log('Got: Level name - ' + levelName);
			
			for (let i = 0; i < me.structure.entries.length; i++)
			{
				let templ = me.structure.entries[i].template;
				if (templ == null || templ.length == 0) templ = `<div>Autofilled: ${me.structure.entries[i].title}</div>`;
				if (typeof me.structure.entries[i].target != 'undefined' && me.structure.entries[i].target != null && me.structure.entries[i].target.length > 0)
				{  					
					// modify templ     structure-url="./main.json" :router="router_hub"
					templ = templ.replace('{{ recurse }}', `<recursive-vue-app structure-url="${me.structure.entries[i].target}" level-name="${me.structure.entries[i].title}" parent-level-name="${levelName}" :router="${me.routerPath}" router-path="${me.routerPath}" />`);
					
				}   // how can we pass the router through this way?  Seems not straightforward...
				console.log('Adding route to router: ' + me.structure.entries[i].route + '; ' + templ);		
								
					/*if (levelName == 'LevelTwo') {
						me.addRouteToRouter('/Alt', { path: '/Alt', components: { [levelName]: { template: '<div>Alternate</div>' } } });
					}*/
				
					me.addRouteToRouter(me.structure.entries[i].route,
					{ 
						path: me.structure.entries[i].route, 
						components: { default: { template: templ } } //, [levelName]: { template: templ } } 
						//components: { default: { template: '<div>Other</div>' }, alt: { template: '<div>Placeholder</div>' } }
					});
				
				me.routeLoaded = true;
				
				setTimeout(() => {
					me.mounted_plus_delay = true;
				}, 1500);
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
	  addRouteToRouter: function(path, route) {
		  // use path to look at all routes in this.router.getRoutes();
		  let routes = this.router.getRoutes();

		  for (let i = 0; i < routes.length; i++)
		  {
			 if (path == routes[i].path) // exists
			 {
				 return;
			 }
			 else if ((path.startsWith(routes[i].path) || path.startsWith(routes[i].path.trimStart('/'))) && routes[i].path.length > 1) // parent-child relationship possibly?
			 {
				 console.log('Adding child relationship: ' + path + '; vs ' + routes[i].path + ' (' +  route.path.replace(routes[i].path, '') + ') ' + JSON.stringify(route.components));

				 if (path.indexOf('/') == 0 && path.lastIndexOf('/') > 0) {

				 }
				 else {
				 	route.path = route.path.replace(routes[i].path, '');
				 	if (route.path.startsWith('/')) route.path = route.path.substring(1);
				 }
				 
				 if (typeof routes[i].children == 'undefined')
					 routes[i].children = [ route ];
				 else if (routes[i].children.filter(c => c.path == route.path).length == 0)
					 routes[i].children.push(route);
				 else 
					 console.log('Conflict, not adding route ' + route.path);
				 return;
			 }
		  }
		  // and either add this route straight in or, potentially, add it as a child to an existing root
		  this.router.addRoute(route);
	  },
	  getLevelName: function() {
		  if (this.levelName != null && this.levelName.length > 0) return this.levelName;
		  else if (this.name != null && this.name.length > 0) return this.name;
		  return 'unnamed';
	  },
	  getParentRoute: function(parentLevelName, router) {
		 let routes = router.getRoutes();
		 for (let i = 0; i < routes.length; i++){
			console.log(routes[i].path);
		 }
		  return routes[routes.length - 1];
	  },
	  getCurrentRoute: function() {
			return this.$route.path;
	  },
	  singleSlash: function(urlStart, entryUrlEnd)
	  {
		  let urlEnd = entryUrlEnd.title;
		  let fullUrl = entryUrlEnd.route;
		  if (fullUrl.indexOf('/') == 0 && fullUrl.lastIndexOf('/') > 0)
			  urlEnd = fullUrl;
		  urlStart = urlStart.replace(this.$route.path, '');
		  if ((urlStart.endsWith('/') && !urlEnd.startsWith('/')) || (!urlStart.endsWith('/') && urlEnd.startsWith('/'))) return urlStart + urlEnd;
		  else if (urlStart.endsWith('/') && urlEnd.startsWith('/')) return urlStart.trimEnd('/') + urlEnd;
		  return urlStart + '/' + urlEnd;  
	  }
  },
  template: `
  <div>
    <hr />
    <div v-if="debug == true && mounted_plus_delay == true">
	   Debug On
	   <hr />
	   	{{ getCurrentRoute() }}
    	<hr />
	   <div v-for="route in router.getRoutes()">
	       {{ route.path }}
		   <div v-if="typeof route.children != 'undefined'">
		      <div v-for="child in route.children">
			  	 -- {{ child.path }}  ( {{ JSON.stringify(child.components) }} )
			  </div>
		   </div>
	   </div>
	</div>
	<div v-if="debug != true">
	   Debug Off
	</div>
	<hr />
  	<div v-if="structure != null">
  	 <div v-for="entry in structure.entries">
	 	<a :href="singleSlash(location.href, entry)">{{ entry.title }}</a>
	 </div>
	 <div v-if="false == true && routeLoaded == true">
	{{ getLevelName() }}
	     <router-view :name="getLevelName()"></router-view>
	 </div>
	 <div v-if="routeLoaded == true">
	 	<router-view></router-view>
	 <div v-if="routeLoaded != true">
	 	Route not loaded
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
