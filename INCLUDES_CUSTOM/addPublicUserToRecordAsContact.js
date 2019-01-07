function addPublicUserToRecordAsContact(publicUserId, itemCapId, contactType) {

	var getUserResult = aa.publicUser.getPublicUserByPUser(publicUserId);
	if (!getUserResult.getSuccess()) {
		logDebug("addPublicUserToRecordAsContact: could not get public user " + getUserResult.getErrorMessage);
		return false;
	}
	var userModel = getUserResult.getOutput();
	if (!userModel) {
		logDebug("addPublicUserToRecordAsContact: user Model is empty");
		return false;
	}
	var userSeqNum = userModel.getUserSeqNum();
	var refContact = getRefContactForPublicUser(userSeqNum);
	if (!refContact) {
		logDebug("addPublicUserToRecordAsContact: refContact is empty");
		return false;
	}
	var refContactNum = refContact.getContactSeqNumber();
	refContact.setContactAddressList(getRefAddContactList(refContactNum));
	var capContactModel = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.CapContactModel").getOutput();
	capContactModel.setPeople(refContact);
	capContactModel.setSyncFlag("Y");
	capContactModel.setRefContactNumber(refContactNum);
	capContactModel.setContactType(contactType);
	capContactModel.setCapID(itemCapId);
	var createResult = aa.people.createCapContactWithAttribute(capContactModel);
	if (!createResult.getSuccess()) {
		logDebug("addPublicUserToRecordAsContact: createCapContact Failed " + createResult.getErrorMessage());
		return false;
	}
	return true;
}

function getRefAddContactList(peoId) {
	var conAdd = aa.proxyInvoker.newInstance("com.accela.orm.model.address.ContactAddressModel").getOutput();
	conAdd.setEntityID(parseInt(peoId));
	conAdd.setEntityType("CONTACT");
	var addList = aa.address.getContactAddressList(conAdd).getOutput();
	var tmpList = aa.util.newArrayList();
	var pri = true;
	for (x in addList) {
		if (pri) {
			pri = false;
			addList[x].getContactAddressModel().setPrimary("Y");
		}
		tmpList.add(addList[x].getContactAddressModel());
	}

	return tmpList;
}
