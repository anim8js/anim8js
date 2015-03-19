
anim8.factories.object = {
	is: function(subject) {
		return anim8.isObject( subject ) && !anim8.isElement( subject ); 
	},
	parseAnimators: function(subject, animators) {
		
	}
}