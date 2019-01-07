var ENVIRON = "DEV";
var EMAILREPLIES = "noreply@dca.ca.gov";
var SENDEMAILS = true;
var ACAURL = "https://acasupp5.accela.com/BCC";

showMessage = false;
//set Debug
var vDebugUsers = ['EWYLAM','JSCHILLO','EVONTRAPP'];
if (exists(currentUserID,vDebugUsers)) {
	showDebug = 3;
	showMessage = true;

}
