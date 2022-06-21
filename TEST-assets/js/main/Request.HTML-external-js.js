  Request.HTML = Class.refactor(Request.HTML, {
 	options: {
 		evalExternalScripts: true
 	},
 	success: function(text) {

 		var options = this.options, response = this.response;

 		response.html = text.stripScripts(function(script){
 			response.javascript = script;
 		});

 		var match = response.html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
 		if (match) response.html = match[1];
 		var temp = new Element('div').set('html', response.html);

 		response.tree = temp.childNodes;
 		response.elements = temp.getElements(options.filter || '*');

 		if (options.filter) response.tree = response.elements;
 		if (options.update){
 			var update = document.id(options.update).empty();
 			if (options.filter) update.adopt(response.elements);
 			else update.set('html', response.html);
 		} else if (options.append){
 			var append = document.id(options.append);
 			if (options.filter) response.elements.reverse().inject(append);
 			else append.adopt(temp.getChildren());
 		}
 		if (options.evalScripts) Browser.exec(response.javascript);

 		if (this.options.evalExternalScripts) {
 			var regex = /<script.*src="([^>"\r\n]*)"[^>]*><\/script>/gi;
 			while (matches = regex.exec(text)) {
 				a = new Request({url: matches[1], evalScripts:true}).get();
 			}

 		} else {
 			this.previous(text);
 		}

 		this.onSuccess(response.tree, response.elements, response.html, response.javascript);
 	}
 });