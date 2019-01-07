function updateIncompleteConditionStatus(fromCapId, toCapId) {
	var getFromCondResult = aa.capCondition.getCapConditions(fromCapId);
	var getToCondResult = aa.capCondition.getCapConditions(toCapId);
	var fromConds = [];
	var toConds = [];
	var updateCapCondResult;
	
	// get child (REN) conditions
	if (getFromCondResult.getSuccess()) { 
		fromConds = getFromCondResult.getOutput();
	} 
	
	// get parent (LIC) conditions
	if (getToCondResult.getSuccess()) { 
		toConds = getToCondResult.getOutput();
	}
	
	for (fc in fromConds) {	// child conditions
		var fromC = fromConds[fc];
		var fromCondDesc = fromC.getConditionDescription();
		var fromCondStatus = fromC.getConditionStatus();
		
		for (tc in toConds) {	// parent conditions
			var updateC = false;
			var toC = toConds[tc];
			var toCondDesc = toC.getConditionDescription();
			var toCondStatus = toC.getConditionStatus();
			
			// does parent condition match child and also is neither Complete nor Met?
			if ((fromCondDesc.toUpperCase() == toCondDesc.toUpperCase()) && (toCondStatus != "Complete" && toCondStatus != "Met")) {
					
				// Update the condition status
				toC.setConditionStatus(fromCondStatus);
				// Save updates
				updateCapCondResult = aa.capCondition.editCapCondition(toC);
				logDebug("Save Result: " + updateCapCondResult.getSuccess());
				logDebug("Editing " + toCondDesc + " from " + toCondStatus + " to Status of: " + fromCondStatus); 
			}
		}	// next parent condition
	}	// next child condition
}