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
	  loadLevel(this).then(x => {
		  // here is where you can break up the URL and push levels sequentially

		  // foreach(urlSegment in breakUpPath(path) { router.push(urlSegment); }
		  //let routeSections = me.getCurrentRouteSections();
		  //let nextLevel = 1; // calculate this
		  
		  //console.log('Router push: ' + routeSections[nextLevel]);
		  //me.router.replace(routeSections[nextLevel]);
	  });
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
			  console.log('Comparing ' + path + ' to existing route ' + routes[i].path);
			 if (path == routes[i].path) // exists
			 {
				 console.log('Match found. Skipping add.');
				 return;
			 } // routes[i].path is existing (base) route, path is the new path to add
			 else if (routes[i].path.length > 1 && (path.startsWith(routes[i].path) || path.startsWith(routes[i].path.substring(1)))) // parent-child relationship possibly?
			 {
				 console.log('Adding child relationship: ' + path + '; vs ' + routes[i].path + ' (' +  route.path.replace(routes[i].path, '') + ') ' + JSON.stringify(route.components));

				 if (path.indexOf('/') == 0 && path.lastIndexOf('/') > 0) {

				 }
				 else if (path.indexOf('/') > 0)
				 {
					 // this needs to be recursive and its a bit complex for now
					 // but basically, need to find the parent route and add the child but only the last part of the path.
					 // route.path = route.path.substring
					 // use this.getSections(path)
					 this.assignAsChild(route);
					 return;
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
		  console.log('Adding New Route (' + path +')')
		  this.router.addRoute(route);
	  },
	  getLevelName: function() {
		  if (this.levelName != null && this.levelName.length > 0) return this.levelName;
		  else if (this.name != null && this.name.length > 0) return this.name;
		  return 'unnamed';
	  },
	  assignAsChild: function(route) {
			// we have the full/path here, let's find a suitable parent and add this.
		  let sections = this.getSections(route.path);
		  let routes = this.router.getRoutes();
		  let oldestAncestor = null;
		  for (let j = 0; j < sections.length; j++) {
				// first/part, lets find the root level (parent) route
			  // this is not going to work so well if we're dealing with more than one layer of separation, is it?  Need to make this more recursive somehow.
			  for (let i = 0; i < routes.length; i++) 
			  {
				    if (this.isParent(route, routes[i]) && routes[i].path.length > 1) 
					{
						// directly assign the route to the route
						console.log('IsParent: ' + route.path + '; Parent Is => ' + routes[i].path);
						
						if (!this.hasChild(route, routes[i])) 
						{						
							route.path = route.path.substring(1 + route.path.indexOf('/'));
						
							if (typeof routes[i].children == 'undefined') {
								routes[i].children = [ route ];
							}
							else {
								routes[i].children.push(route);
							}
						}
					}
					else if (this.isOldestAncestor(route, routes[i])) {
						console.log('IsOldestAncestor: ' + route.path + '; ' + routes[i].path);
						oldestAncestor = routes[i];
					}
				    else if (this.isAncestor(route, routes[i])) {
						// call assign as child again somehow?
						console.log('IsAncestor: ' + route.path + '; ' + routes[i].path);
						if (oldestAncestor != null)
							oldestAncestor.descendent = routes[i]; // build out a linked list
					}
				    else {
						console.log('NoRelation: ' + route.path + '; ' + routes[i].path);
					}
			  }
		  }
	  },
	  isParent: function(routeChild, routeOther) {
			if (this.isAncestor(routeChild, routeOther) || this.isOldestAncestor(routeChild, routeOther)) {
				/* inner determination */
				//if (routeChild.path.indexOf(routeOther.path) > 0) { // needs more 
					return true;	
				//}
			}
		  	return false;
	  },
	  isAncestor: function(routeChild, routeOther) {
		 if (routeChild.path.indexOf(routeOther.path) > 0 || routeChild.path.indexOf(routeOther.path.substring(1)) > 0) return true;
		  return false;
	  },
	  isOldestAncestor: function(routeChild, routeOther) {
			// presumably we just match the routes		  
		  if (routeChild.path.startsWith(routeOther.path) || routeChild.path.startsWith(routeOther.path.substring(1))) return true;
		  return false;
	  },
	  hasChild: function(routeChild, routeOther) {
		  if (typeof routeOther.children == 'undefined') return false;
		  
	      let localPath = routeChild.path.substring(1 + routeChild.path.indexOf('/'));
		  
		  for(let i = 0; i < routeOther.children.length; i++) {
				if (routeOther.children[i].path == localPath) return true;					
		  }
		  return false;
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
	  getCurrentTemplate: function() {
			// fetch the template that corresponds to the route
		  let routes = this.router.getRoutes();
		  let routeSections = this.getSections(this.getCurrentRoute());
		  console.log('Looking at current route sections ' + routeSections.toString());
		  // this is going to need to be recursive. figure this out and I think everything else should follow
		  for (let i = 0; i < routes.length; i++)
		  {
			 if (this.getCurrentRoute().startsWith(routes[i].path) && routes[i].path.length > 1) {
				 console.log(this.getCurrentRoute() + ' starts with ' + routes[i].path);
			  return this.findCurrentTemplate(routeSections, routes[i]);
			 }
		  }
		  return 'Not Found';
	  },
	  findCurrentTemplate: function(routeSections, currentObject) {
		  console.log('Looking to find template in ' + routeSections.toString() + ' against ' + currentObject.path);// + ': ' + JSON.stringify(currentObject));
			// for each additional level of the routes, reassign currentObject and recur.  If another level can't be found, return current level
		  let foundNext = false;
		  let template = currentObject.components.default.template;

		  if (typeof currentObject.children == 'undefined') {
			  console.log('Returning template from current object; no children found: ' + JSON.stringify(currentObject));
			  return currentObject.components.default.template;
		  }

		  for (let j = 0; j < currentObject.children.length; j++) 
		  {
			  console.log('Looking at route: ' + currentObject.children[j].path + ' against routeSections ' + routeSections.toString());
			  for (let i = 0; i < routeSections.length; i++) {
				  console.log('Comparing ' + routeSections[i] + ' vs ' + currentObject.children[j].path);
				if (routeSections[i].indexOf(currentObject.children[j].path) == 0 || routeSections[i].indexOf(currentObject.children[j].path) > 0) 
				{
					return this.findCurrentTemplate(routeSections, currentObject.children[j]);
				}
				else {
					console.log('Not a match: ' + routeSections[i] + ' vs ' + currentObject.children[j].path);
				}
				
			  }
		  }

		  // update currentObject and foundNext 

		  if (foundNext == false) {
			  console.log('Returning existing level template ' + template);
			  return template;
		  }
		  return this.findCurrentTemplate(routeSections, currentObject);
	  },
	  getSections: function(path) {
		  let routes = path.split('/');
		  for (let i = 0; i < routes.length; i++){
			  if (i > 0)
				  routes[i] = routes[i - 1] + routes[i] + '/';
			  else 
				  routes[i] = '/' + routes[i];
		  }
		  return routes;
	  },
	  getCurrentRouteSections: function() {
		  return this.getSections(this.$route.path);
	  },
	  singleSlash: function(urlStart, entryUrlEnd)
	  {
		  let urlEnd = entryUrlEnd.title;
		  let fullUrl = entryUrlEnd.route;
		  if ((fullUrl.indexOf('/') > 0 && fullUrl.indexOf('/') == fullUrl.lastIndexOf('/')) || ((fullUrl.indexOf('/') == 0 && fullUrl.lastIndexOf('/') > 0)))
			  urlEnd = fullUrl;		  
		  urlStart = urlStart.replace(this.$route.path, '');
		  if ((urlStart.endsWith('/') && !urlEnd.startsWith('/')) || (!urlStart.endsWith('/') && urlEnd.startsWith('/'))) return urlStart + urlEnd;
		  else if (urlStart.endsWith('/') && urlEnd.startsWith('/')) return urlStart.trimEnd('/') + urlEnd;
		  return urlStart + '/' + urlEnd;  
	  },
	  preprocessEntryTemplate: function(entry) {
			return entry.template.replace('{{ recurse }}', 
	`<div><recursive-vue-app 
	    structure-url="${entry.target}" 
		level-name="${entry.title}" 
		parent-level-name="${this.getLevelName()}" 
		:router="${this.routerPath}" 
		router-path="${this.routerPath}" 
	/></div>`);
	  }
  },
  template: `
  <div>
    <hr />
    <div v-if="debug == true && mounted_plus_delay == true">
	   Debug On
	   <hr />
	   	{{ getCurrentRoute() }} -- {{ getCurrentTemplate() }}
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
  	<div v-if="structure != null && structure.entries != null">
  	 <div v-for="entry in structure.entries">
	 	<div v-show="true">
		    <component :is="{ template: preprocessEntryTemplate(entry) }"></component>
		</div>
	 	<a :href="singleSlash(location.href, entry)">{{ entry.title }}</a>
	 </div>
	 <div v-if="false == true && routeLoaded == true">
	{{ getLevelName() }}
	     <router-view :name="getLevelName()"></router-view>
	 </div>
	 <div v-show="routeLoaded == true">
	 	<router-view></router-view>
	 <div v-if="routeLoaded != true">
	 	Route not loaded
	 </div>
    </div>
  </div>`
});
function loadLevel(rvApp) 
{
	return new Promise(function(resolve, reject) 
	{
		let me = rvApp;
		if (me.structureObject == null && me.structureUrl != null && me.structureUrl.length > 0) 
		{
			// go get the structure object 
			console.log('RVA (' + me.levelName + ') Mounted, getting structure object ' + me.structureUrl);
		
			httpGet(me.structureUrl).then(x => 
			{
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
				
					me.addRouteToRouter(me.structure.entries[i].route,
					{ 
						path: me.structure.entries[i].route, 
						components: { default: { template: templ } } //, [levelName]: { template: templ } } 
						//components: { default: { template: '<div>Other</div>' }, alt: { template: '<div>Placeholder</div>' } }
					});
				
					me.routeLoaded = true;
				
					setTimeout(() => {
						me.mounted_plus_delay = true;
						resolve(me);
					}, 1500);
			  }
			});
		}
	});
}
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
 
