function copyConditionsNoDuplicates(fromCapId, toCapId) { 
	var getFromCondResult = aa.capCondition.getCapConditions(fromCapId);
	var getToCondResult = aa.capCondition.getCapConditions(toCapId);
	var fromConds = [];
	var toConds = [];
	
	if (getFromCondResult.getSuccess()) { 
		fromConds = getFromCondResult.getOutput(); 
	} 
	
	if (getToCondResult.getSuccess()) { 
		toConds = getToCondResult.getOutput(); 
	}
		
	for (fc in fromConds) { 
		var addC = true;
		var fromC = fromConds[fc];
		var fromCondDesc = fromC.getConditionDescription();
		
		for (tc in toConds) {
			var toC = toConds[tc];
			var toCondDesc = toC.getConditionDescription();
			
			if (fromCondDesc.toUpperCase() == toCondDesc.toUpperCase()) {
				addC = false;
			}
		}
		
		if (addC == true) {
			var addCapCondResult = aa.capCondition.addCapCondition(toCapId, fromC.getConditionType(), 
				fromC.getConditionDescription(), fromC.getConditionComment(), fromC.getEffectDate(), 
				fromC.getExpireDate(), sysDate, fromC.getRefNumber1(), fromC.getRefNumber2(), 
				fromC.getImpactCode(), fromC.getIssuedByUser(), fromC.getStatusByUser(), fromC.getConditionStatus(), 
				currentUserID, String("A"), null, fromC.getDisplayConditionNotice(), fromC.getIncludeInConditionName(), 
				fromC.getIncludeInShortDescription(), fromC.getInheritable(), fromC.getLongDescripton(), 
				fromC.getPublicDisplayMessage(), fromC.getResolutionAction(), null, null, fromC.getReferenceConditionNumber(), 
				fromC.getConditionGroup(), fromC.getDisplayNoticeOnACA(), fromC.getDisplayNoticeOnACAFee(), 
				fromC.getPriority(), fromC.getConditionOfApproval()); 
		} 
	}
}
