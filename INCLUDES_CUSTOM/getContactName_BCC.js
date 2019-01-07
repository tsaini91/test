function getContactName_BCC(vConObj) {
	if (vConObj.people.getContactTypeFlag() == "organization") {
		if (vConObj.people.getBusinessName() != null && vConObj.people.getBusinessName() != "") {
			return vConObj.people.getBusinessName();
		}
		//return vConObj.people.getBusinessName2(); comment out for US 2991
		return vConObj.people.getTradeName(); //add for US 2991
	}
	else {
		//First and Last names are the business' legal name. This is first priority per US 2991
		if (vConObj.people.getFirstName() != null && vConObj.people.getLastName() != null) {
			return vConObj.people.getFirstName() + " " + vConObj.people.getLastName();
		}
		//FullName field is the Sole Prop DBA field
		if (vConObj.people.getFullName() != null && vConObj.people.getFullName() != "") {
			return vConObj.people.getFullName();
		}
		//BusinessName field will be blank for contactTypeFlag != "organization", but just in case
		if (vConObj.people.getBusinessName() != null && vConObj.people.getBusinessName() != "")
			return vConObj.people.getBusinessName();
	
		//return vConObj.people.getBusinessName2(); comment out for US 2991
		//TradeName field will be blank for contactTypeFlag != "organization", but just in case
		return vConObj.people.getTradeName(); //add as Sole Prop DBA for US 2991
	}
}