(function() {
	
var configValues = {
	authType:'CAS'
}


for (var v in configValues) {
	AD.config.setValue(v, configValues[v]);
}

})();
