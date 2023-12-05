/*------------------------------------------------------------------------------------------------------/
| SVN $Id: CapSetDetailCapAddedToAccount.js 4781 2009-10-01 05:55:23Z roland.vonschoech $
| Program : CapSetDetailCapAddedToAccountV1.6.js
| Event   : The Sets Portlet's Execute Script button, which triggers the CapSetDetailUserExecuteAfter
|			event.
|
| Usage   : Master Script by Bill Wayson, modeled after an Accela-provided Master Script
|
| Client  : SBCO
| Action# : N/A
|
| Notes   : This is a generic "Master Script" for use in Sets using the "Execute Script" button in the
|			Sets portlet.  For each script you wish to list under that button, make a copy of this
|			script, rename it, change the value of 'controlString' below to the Standard Choice
|			entry point you use, and save it as an AA script.  Depending on the needs of the Standard
|			Choice script, you may need to add additional functions to your stored Master Script.
|
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START User Configurable Parameters
|
|     Only variables in the following section may be changed.  If any other section is modified, this
|     will no longer be considered a "Master" script and will not be supported in future releases.  If
|     changes are made, please add notes above.
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| SVN $Id: CapSetDetailPreDepositRegister07 4781 2009-10-01 05:55:23Z roland.vonschoech $
| Program : CapSetDetailPreDepositRegisterV1.6.js
| Event   : The Sets Portlet's Execute Script button, which triggers the CapSetDetailUserExecuteAfter
|			event.
|
| Usage   : Master Script by Bill Wayson.  Used for deposit processing for a specific cash register.
|			Change the controlString variable to the Standard Choice entry point for the register and
|			action, which sets up register- and action-specific variables, and then branches to
|			the general Standard Choice for deposit actions.  This script incorporates the generic
|			CapSetDetailDepositProcedures master script, where all of the support for the Standard
|			Choice scripting should go.
|
|			Because of the 30 character length limit of the Script Code field, it should be named
|			similarly to CapSetDetailPreDeposit## or CapSetDetailPostDeposit##
|
| Client  : SBCO
| Action# : N/A
|
| Notes   :	06-05-2013	Bill Wayson, ititial version.
|
/------------------------------------------------------------------------------------------------------*/
emailText = "";
message = "";
br = "<br>";
sysDate = aa.date.getCurrentDate();
var SCRIPT_VERSION = 3.0;
aa.env.setValue("CurrentUserID", "ADMIN");
eval(getScriptTextLocal("INCLUDES_ACCELA_FUNCTIONS", null, true));
eval(getScriptTextLocal("INCLUDES_ACCELA_GLOBALS", null, true));
eval(getScriptTextLocal("INCLUDES_CUSTOM", null, true));

/* Begin Code needed to call master script functions ---------------------------------------------------*/
function getScriptTextLocal(vScriptName, servProvCode, useProductScripts) {
	if (!servProvCode)
		servProvCode = aa.getServiceProviderCode();
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		if (useProductScripts) {
			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		} else {
			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
		}
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}

var setID = aa.env.getValue("SetID"); // Set ID
var capSetScriptID = aa.env.getValue("CapSetScriptID"); // Script ID
var SetMemberArray = aa.env.getValue("SetMemberArray"); // Array of Set members

var sysDate = aa.date.getCurrentDate();
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");

var AInfo = new Array(); // Create array for tokenized variables

logDebug("<B>EMSE Script Results for " + capSetScriptID + "</B>");

logDebug("ServiceProviderCode:        " + aa.env.getValue("ServiceProviderCode"));
logDebug("ServiceProviderCode class:  " + aa.env.getValue("ServiceProviderCode").getClass());
logDebug("CurrentUserID:              " + aa.env.getValue("CurrentUserID"));
logDebug("CurrentUserID class:        " + aa.env.getValue("CurrentUserID").getClass());
logDebug("SetID:                      " + aa.env.getValue("SetID"));
logDebug("SetID class:                " + aa.env.getValue("SetID").getClass());
logDebug("CapSetScriptID:             " + aa.env.getValue("CapSetScriptID"));
logDebug("CapSetScriptID class:       " + aa.env.getValue("CapSetScriptID").getClass());

logDebug(SetMemberArray[0].getClass());

for (var i = 0; i < SetMemberArray.length; i++)
{
	logDebug("SetMemberArray[ " + i + " ] is:  " + SetMemberArray[i]);
}

/*
Script Name: .js
Converted from Std Choice: CapSetDetailCapAddedToAccount
*/


include('GET_CURRENT_ACCELA_EXECUTION_ENVIRONMENT_INFO'); /* replaced branch(EMSE:GetCurrentAccelaExecutionEnvironmentInfo) */
if (!cCurrentExecutionEnvironment.equals(cProdEnv) && currentUserID == 'BWAYSON') {
	showDebug = true;
	showMessage = true;
	} else {
	showDebug = false;
	showMessage = false;
	}

include('CREATE_LABOR_CHARGES'); /* replaced branch(CSD:CreateLaborCharges) */



/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

if (debug.indexOf("**ERROR") > 0)
{
	aa.env.setValue("ScriptReturnCode", "1");
	aa.env.setValue("ScriptReturnMessage", debug);
}
else
{
	aa.env.setValue("ScriptReturnCode", "0");
	if (showMessage)
		aa.env.setValue("ScriptReturnMessage", message);
	if (showDebug)
		aa.env.setValue("ScriptReturnMessage", debug);
}

/*------------------------------------------------------------------------------------------------------/
| <===========External Functions (used by Action entries)
/------------------------------------------------------------------------------------------------------*/

function appMatch(ats) // optional capId or CapID string
{
	var matchArray = appTypeArray //default to current app
		if (arguments.length == 2)
		{
			matchCapParm = arguments[1];
			if (typeof(matchCapParm) == "string")
				matchCapId = aa.cap.getCapID(matchCapParm).getOutput(); // Cap ID to check
			else
				matchCapId = matchCapParm;
			if (!matchCapId)
			{
				logDebug("**WARNING: CapId passed to appMatch was not valid: " + arguments[1]);
				return false;
			}
			matchCap = aa.cap.getCap(matchCapId).getOutput();
			matchArray = matchCap.getCapType().toString().split("/");
		}

		var isMatch = true;
	var ata = ats.split("/");
	if (ata.length != 4)
		logDebug("**ERROR in appMatch.  The following Application Type String is incorrectly formatted: " + ats);
	else
		for (xx in ata)
			if (!ata[xx].equals(matchArray[xx]) && !ata[xx].equals("*"))
				isMatch = false;
	return isMatch;
}

function branch(stdChoice)
{
	doStandardChoiceActions(stdChoice, true, 0);
}

function comment(cstr)
{
	if (showDebug)
		logDebug(cstr);
	if (showMessage)
		logMessage(cstr);
}

function convertDate(thisDate)
// convert ScriptDateTime to Javascript Date Object
{
	return new Date(thisDate.getMonth() + "/" + thisDate.getDayOfMonth() + "/" + thisDate.getYear());
}

function dateFormatted(pMonth, pDay, pYear, pFormat)
//returns date string formatted as YYYY-MM-DD or MM/DD/YYYY (default)
{
	var mth = "";
	var day = "";
	var ret = "";
	if (pMonth > 9)
		mth = pMonth.toString();
	else
		mth = "0" + pMonth.toString();

	if (pDay > 9)
		day = pDay.toString();
	else
		day = "0" + pDay.toString();

	if (pFormat == "YYYY-MM-DD")
		ret = pYear.toString() + "-" + mth + "-" + day;
	else
		ret = "" + mth + "/" + day + "/" + pYear.toString();

	return ret;
}

function docWrite(dstr, header, indent)
{
	var istr = "";
	for (i = 0; i < indent; i++)
		istr += "|  ";
	if (header && dstr)
		aa.print(istr + "------------------------------------------------");
	if (dstr)
		aa.print(istr + dstr);
	if (header)
		aa.print(istr + "------------------------------------------------");
}

function doStandardChoiceActions(stdChoiceEntry, doExecution, docIndent)
{
	var thisDate = new Date();
	var thisTime = thisDate.getTime();
	var lastEvalTrue = false;
	stopBranch = false; // must be global scope

	logDebug("Executing: " + stdChoiceEntry + ", Elapsed Time: " + ((thisTime - startTime) / 1000) + " Seconds");

	var pairObjArray = getScriptAction(stdChoiceEntry);
	if (!doExecution)
		docWrite(stdChoiceEntry, true, docIndent);

	for (xx in pairObjArray)
	{
		doObj = pairObjArray[xx];
		if (doExecution)
		{
			if (doObj.enabled)
			{
				if (stopBranch)
				{
					stopBranch = false;
					break;
				}
				logDebug(aa.env.getValue("CurrentUserID") + " : " + stdChoiceEntry + " : #" + doObj.ID + " : Criteria : " + doObj.cri, 2);

				if (eval(token(doObj.cri)) || (lastEvalTrue && doObj.continuation))
				{
					logDebug(aa.env.getValue("CurrentUserID") + " : " + stdChoiceEntry + " : #" + doObj.ID + " : Action : " + doObj.act, 2);
					eval(token(doObj.act));
					lastEvalTrue = true;
				}
				else
				{
					if (doObj.elseact)
					{
						logDebug(aa.env.getValue("CurrentUserID") + " : " + stdChoiceEntry + " : #" + doObj.ID + " : Else : " + doObj.elseact, 2);
						eval(token(doObj.elseact));
					}
					lastEvalTrue = false;
				}
			}
		}
		else // just document
		{
			docWrite("|  ", false, docIndent);
			var disableString = "";
			if (!doObj.enabled)
				disableString = "<DISABLED>";

			if (doObj.elseact)
				docWrite("|  " + doObj.ID + " " + disableString + " " + doObj.cri + " ^ " + doObj.act + " ^ " + doObj.elseact, false, docIndent);
			else
				docWrite("|  " + doObj.ID + " " + disableString + " " + doObj.cri + " ^ " + doObj.act, false, docIndent);

			for (yy in doObj.branch)
			{
				doStandardChoiceActions(doObj.branch[yy], false, docIndent + 1);
			}
		}
	} // next sAction
	if (!doExecution)
		docWrite(null, true, docIndent);
	var thisDate = new Date();
	var thisTime = thisDate.getTime();
	logDebug("Finished: " + stdChoiceEntry + ", Elapsed Time: " + ((thisTime - startTime) / 1000) + " Seconds");
}

function endBranch()
{
	// stop execution of the current std choice
	stopBranch = true;
}

function getAppSpecific(itemName) // optional: itemCap
{
	var updated = false;
	var i = 0;
	var itemCap = capId;
	if (arguments.length == 2)
		itemCap = arguments[1]; // use cap ID specified in args

	if (useAppSpecificGroupName)
	{
		if (itemName.indexOf(".") < 0)
		{
			logDebug("**WARNING: editAppSpecific requires group name prefix when useAppSpecificGroupName is true");
			return false;
		}

		var itemGroup = itemName.substr(0, itemName.indexOf("."));
		var itemName = itemName.substr(itemName.indexOf(".") + 1);
	}

	var appSpecInfoResult = aa.appSpecificInfo.getByCapID(itemCap);
	if (appSpecInfoResult.getSuccess())
	{
		var appspecObj = appSpecInfoResult.getOutput();

		if (itemName != "")
		{
			for (i in appspecObj)
				if (appspecObj[i].getCheckboxDesc() == itemName && (!useAppSpecificGroupName || appspecObj[i].getCheckboxType() == itemGroup))
				{
					return appspecObj[i].getChecklistComment();
					break;
				}
		} // item name blank
	}
	else
	{
		logDebug("**ERROR: getting app specific info for Cap : " + appSpecInfoResult.getErrorMessage());
	}
}

//
// Get the standard choices domain for this application type
//
function getScriptAction(strControl)
{
	var actArray = new Array();
	var maxLength = String("" + maxEntries).length;

	for (var count = 1; count <= maxEntries; count++) // Must be sequential from 01 up to maxEntries
	{
		var countstr = "000000" + count;
		countstr = String(countstr).substring(countstr.length, countstr.length - maxLength);
		var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(strControl, countstr);

		if (bizDomScriptResult.getSuccess())
		{
			bizDomScriptObj = bizDomScriptResult.getOutput();
			var myObj = new pairObj(bizDomScriptObj.getBizdomainValue());
			myObj.load(bizDomScriptObj.getDescription());
			if (bizDomScriptObj.getAuditStatus() == 'I')
				myObj.enabled = false;
			actArray.push(myObj);
		}
		else
		{
			break;
		}
	}
	return actArray;
}

function logDebug(dstr)
{

	if (!aa.calendar.getNextWorkDay)
	{
		vLevel = 1;
		if (arguments.length > 1)
			vLevel = arguments[1];

		if ((showDebug & vLevel) == vLevel || vLevel == 1)
			debug += dstr + br;

		if ((showDebug & vLevel) == vLevel)
			aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"), dstr);
	}
	else
	{
		debug += dstr + br;
	}
}

function logMessage(dstr)
{
	message += dstr + br;
}

function lookup(stdChoice, stdValue)
{
	var strControl;
	var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice, stdValue);

	if (bizDomScriptResult.getSuccess())
	{
		var bizDomScriptObj = bizDomScriptResult.getOutput();
		var strControl = "" + bizDomScriptObj.getDescription(); // had to do this or it bombs.  who knows why?
		logDebug("lookup(" + stdChoice + "," + stdValue + ") = " + strControl);
	}
	else
	{
		logDebug("lookup(" + stdChoice + "," + stdValue + ") does not exist");
	}
	return strControl;
}

function pairObj(actID)
{
	this.ID = actID;
	this.cri = null;
	this.act = null;
	this.elseact = null;
	this.enabled = true;
	this.continuation = false;
	this.branch = new Array();

	this.load = function (loadStr)
	{
		//
		// load() : tokenizes and loades the criteria and action
		//
		loadArr = loadStr.split("\\^");
		if (loadArr.length < 2 || loadArr.length > 3)
		{
			logMessage("**ERROR: The following Criteria/Action pair is incorrectly formatted.  Two or three elements separated by a caret (\"^\") are required. " + br + br + loadStr);
		}
		else
		{
			this.cri = loadArr[0];
			this.act = loadArr[1];
			this.elseact = loadArr[2];

			if (this.cri.length() == 0) // if format is like ("^action...") then it's a continuation of previous line
				this.continuation = true;

			var a = loadArr[1];
			var bb = a.indexOf("branch");
			while (!enableVariableBranching && bb >= 0)
			{
				var cc = a.substring(bb);
				var dd = cc.indexOf("\")");
				this.branch.push(cc.substring(8, dd));
				a = cc.substring(dd);
				bb = a.indexOf("branch");
			}
		}
	}
}

function token(tstr)
{
	if (!disableTokens)
	{
		re = new RegExp("\\{", "g");
		tstr = String(tstr).replace(re, "AInfo[\"");
		re = new RegExp("\\}", "g");
		tstr = String(tstr).replace(re, "\"]");
	}
	return String(tstr);
}

/* =================================================================================================
 *	This function is cloned from and works similarly to the addFeeWithExtraData() built-in function.
 *	It differs by accepting a fee schedule version parameter to give the caller control over that.
 * ---------------------------------------------------------------------------------------------- */
function sbcoAddFeeWithExtraData(fcode, fsched, fsversion, fperiod, fqty, finvoice, feeCap, feeComment, UDF1, UDF2)
{
	var feeCapMessage = "";
	var feeSeq_L = new Array(); // invoicing fee for CAP in args
	var paymentPeriod_L = new Array(); // invoicing pay periods for CAP in args

	assessFeeResult = aa.finance.createFeeItem(feeCap, fsched, fsversion, fcode, fperiod, fqty);
	if (assessFeeResult.getSuccess())
	{
		feeSeq = assessFeeResult.getOutput();
		logMessage("Successfully added Fee " + fcode + ", Qty " + fqty + feeCapMessage);
		logDebug("The assessed fee Sequence Number " + feeSeq + feeCapMessage);

		fsm = aa.finance.getFeeItemByPK(feeCap, feeSeq).getOutput().getF4FeeItem();

		if (feeComment)
			fsm.setFeeNotes(feeComment);
		if (UDF1)
			fsm.setUdf1(UDF1);
		if (UDF2)
			fsm.setUdf2(UDF2);

		aa.finance.editFeeItem(fsm);

		if (finvoice == "Y" && arguments.length == 6) // use current CAP
		{
			feeSeqList.push(feeSeq);
			paymentPeriodList.push(fperiod);
		}
		if (finvoice == "Y" && arguments.length > 6) // use CAP in args
		{
			feeSeq_L.push(feeSeq);
			paymentPeriod_L.push(fperiod);
			var invoiceResult_L = aa.finance.createInvoice(feeCap, feeSeq_L, paymentPeriod_L);
			if (invoiceResult_L.getSuccess())
				logMessage("Invoicing assessed fee items is successful.");
			else
				logDebug("**ERROR: Invoicing the fee items assessed was not successful.  Reason: " + invoiceResult.getErrorMessage());
		}
	}
	else
	{
		logDebug("**ERROR: assessing fee (" + fcode + "): " + assessFeeResult.getErrorMessage());
		return null;
	}

	return feeSeq;
}

/* --------------------------------------------------------------------
/	For a labor entry, should return 1 if the entry yas been charged in
/	any way, 0 if it has not.  Parameters are string, string, string,
/	int, and string.  servProvCode is an environmental variable.
/------------------------------------------------------------------- */
function sbcoCheckIfLaborActivityHasBeenCharged(pId1, pId2, pId3, pSeqNbr, pSource)
{
	var cSql = "select\
		count(*) as vCount\
		from (SELECT \
				SERV_PROV_CODE, \
				B1_PER_ID1, \
				B1_PER_ID2, \
				B1_PER_ID3, \
				CAST(F4FEEITEM_UDF1 AS INT) AS SEQ_NBR, \
				F4FEEITEM_UDF2 AS SOURCE \
			FROM \
				dbo.F4FEEITEM \
			WHERE \
				SERV_PROV_CODE = 'SBCO' AND \
				B1_PER_ID1 NOT LIKE '__POS' AND	\
				ISNUMERIC( F4FEEITEM_UDF1 + '.e0' ) = 1 \
		)\
		where\
		serv_prov_code = ? and\
		b1_per_id1 = ? and\
		b1_per_id2 = ? and\
		b1_per_id3 = ? and\
		seq_nbr = ? and\
		source = ?";

	var vConn = aa.db.getConnection();
	var vQuery = vConn.prepareStatement(cSql);

	vQuery.setString(1, servProvCode);
	vQuery.setString(2, pId1);
	vQuery.setString(3, pId2);
	vQuery.setString(4, pId3);
	vQuery.setInt(5, pSeqNbr);
	vQuery.setString(6, pSource);

	var vResultSet = vQuery.executeQuery();

	var vReturnValue = 0;

	if (vResultSet.next())
		vReturnValue = vResultSet.getInt("vCount");

	vResultSet.close();
	vQuery.close();
	vConn.close();
	vInitialContext.close();

	return vReturnValue;
}

function sbcoConvertDate(pMilliseconds)
// Creates a Java date object from a parameter of type long
// of the number of milliseconds since the epoch.
{
	return new java.util.Date(pMilliseconds);
}

/* --------------------------------------------------------------------
/	For a CAP, return the number of inspection labor activities that
/	have not been charged through any system.  servProvCode is an
/	environmental variable.
/------------------------------------------------------------------- */
function sbcoCountOfInspectionLaborActivityNotCharged(pId1, pId2, pId3)
{
	var cSql = "with vsbcACTIVITY_HISTORY as ( \
			SELECT W.SERV_PROV_CODE, W.B1_PER_ID1, W.B1_PER_ID2, W.B1_PER_ID3, W.GPROCESS_HISTORY_SEQ_NBR[SEQ_NBR], 'GPROCESS_HISTORY' [SOURCE], W.SD_PRO_DES[ACTIVITY], W.SD_APP_DES[STATUS],  \
			W.SD_APP_DD[STATUS_DD], W.G6_ISS_FNAME[FNAME], W.G6_ISS_MNAME[MNAME], W.G6_ISS_LNAME[LNAME], W.SD_AGENCY_CODE[AGENCY_CODE], W.SD_BUREAU_CODE[BUREAU_CODE], W.SD_COMMENT[COMMENT], \
			W.SD_HOURS_SPENT[HOURS_SPENT], LEFT(W.SD_NOTE, 20) [LABOR_RATE], W.REC_DATE, W.REC_FUL_NAM, W.REC_STATUS  \
		FROM     GPROCESS_HISTORY W \
		WHERE  W.SERV_PROV_CODE = 'SBCO'  \
		UNION ALL \
		SELECT I.SERV_PROV_CODE, I.B1_PER_ID1, I.B1_PER_ID2, I.B1_PER_ID3, I.G6_ACT_NUM, 'G6ACTION', I.G6_ACT_TYP, I.G6_STATUS, I.G6_COMPL_DD, I.GA_FNAME, I.GA_MNAME, I.GA_LNAME, I.R3_AGENCY_CODE, I.R3_BUREAU_CODE, \
			C.[TEXT], I.G6_ACT_TT, I.G6_ACT_JVAL, I.REC_DATE, I.REC_FUL_NAM, I.REC_STATUS \
		FROM G6ACTION I LEFT JOIN \
			BACTIVITY_COMMENT C ON I.SERV_PROV_CODE = C.SERV_PROV_CODE AND I.B1_PER_ID1 = C.B1_PER_ID1 AND I.B1_PER_ID2 = C.B1_PER_ID2 AND I.B1_PER_ID3 = C.B1_PER_ID3 AND  \
			C.COMMENT_TYPE = 'Inspection Result Comment' AND I.G6_ACT_NUM = C.G6_ACT_NUM \
		) \
		, vsbcLABOR_ACTIVITY_CHARGED as (SELECT SERV_PROV_CODE, B1_PER_ID1, B1_PER_ID2, B1_PER_ID3, CAST(F4FEEITEM_UDF1 AS INT) AS SEQ_NBR, F4FEEITEM_UDF2 AS SOURCE \
		FROM dbo.F4FEEITEM \
		WHERE SERV_PROV_CODE = 'SBCO' AND B1_PER_ID1 NOT LIKE '__POS' AND ISNUMERIC(F4FEEITEM_UDF1 + '.e0') = 1 \
		) \
		, sbcIMPORTED_WORKFLOW AS ( \
			SELECT L.SERV_PROV_CODE, L.B1_PER_ID1, L.B1_PER_ID2, L.B1_PER_ID3, CAST(L.SEQ_NBR AS int) AS SEQ_NBR, L.SOURCE, L.ACTIVITY, L.STATUS, L.STATUS_DD, L.FNAME, L.MNAME, L.LNAME, L.AGENCY_CODE, L.BUREAU_CODE, \
			L.HOURS_SPENT, L.REC_DATE, L.REC_FUL_NAM \
			FROM     vsbcACTIVITY_HISTORY AS L LEFT OUTER JOIN \
			vsbcLABOR_ACTIVITY_CHARGED AS R ON L.SOURCE = R.SOURCE AND L.SEQ_NBR = R.SEQ_NBR AND L.B1_PER_ID3 = R.B1_PER_ID3 AND L.B1_PER_ID2 = R.B1_PER_ID2 AND L.B1_PER_ID1 = R.B1_PER_ID1 AND \
			L.SERV_PROV_CODE = R.SERV_PROV_CODE \
		WHERE  (L.SERV_PROV_CODE = 'SBCO') AND (R.SERV_PROV_CODE IS NULL) AND (L.REC_STATUS = 'A') \
		) \
	SELECT * FROM \
	G6ACTION L LEFT JOIN \
		(SELECT SERV_PROV_CODE, B1_PER_ID1, B1_PER_ID2, B1_PER_ID3, SEQ_NBR, SOURCE \
		FROM     vsbcLABOR_ACTIVITY_CHARGED \
		UNION \
		SELECT SERV_PROV_CODE, B1_PER_ID1, B1_PER_ID2, B1_PER_ID3, SEQ_NBR, SOURCE \
		FROM   sbcIMPORTED_WORKFLOW \
		WHERE  SERV_PROV_CODE = 'SBCO' \
		) R \
	ON l.serv_prov_code = r.serv_prov_code and \
		l.b1_per_id1 = r.b1_per_id1 and \
		l.b1_per_id2 = r.b1_per_id2 and \
		l.b1_per_id3 = r.b1_per_id3 and \
		l.g6_act_num = r.seq_nbr and \
		r.source = 'G6ACTION' \
	WHERE \
					l.serv_prov_code = ? and\
					l.b1_per_id1 = ? and\
					l.b1_per_id2 = ? and\
					l.b1_per_id3 = ? and\
					l.g6_act_tt <> 0 and\
					r.serv_prov_code is null";

	var vConn = aa.db.getConnection();
	var vQuery = vConn.prepareStatement(cSql);

	vQuery.setString(1, servProvCode);
	vQuery.setString(2, pId1);
	vQuery.setString(3, pId2);
	vQuery.setString(4, pId3);

	var vResultSet = vQuery.executeQuery();

	var vReturnValue = 0;

	if (vResultSet.next())
		vReturnValue = vResultSet.getInt("vCount");

	vResultSet.close();
	vQuery.close();
	vConn.close();

	return vReturnValue;
}

/* --------------------------------------------------------------------
/	For a CAP, return the number of workflow labor activities that
/	have not been charged through any system.  servProvCode is an
/	environmental variable.
/------------------------------------------------------------------- */
function sbcoCountOfWorkflowLaborActivityNotCharged(pId1, pId2, pId3)
{
	var cSql = "with vsbcACTIVITY_HISTORY as ( \
				SELECT W.SERV_PROV_CODE, W.B1_PER_ID1, W.B1_PER_ID2, W.B1_PER_ID3, W.GPROCESS_HISTORY_SEQ_NBR[SEQ_NBR], 'GPROCESS_HISTORY' [SOURCE], W.SD_PRO_DES[ACTIVITY], W.SD_APP_DES[STATUS],  \
				W.SD_APP_DD[STATUS_DD], W.G6_ISS_FNAME[FNAME], W.G6_ISS_MNAME[MNAME], W.G6_ISS_LNAME[LNAME], W.SD_AGENCY_CODE[AGENCY_CODE], W.SD_BUREAU_CODE[BUREAU_CODE], W.SD_COMMENT[COMMENT], \
				W.SD_HOURS_SPENT[HOURS_SPENT], LEFT(W.SD_NOTE, 20) [LABOR_RATE], W.REC_DATE, W.REC_FUL_NAM, W.REC_STATUS  \
			FROM     GPROCESS_HISTORY W \
			WHERE  W.SERV_PROV_CODE = 'SBCO'  \
			UNION ALL \
			SELECT I.SERV_PROV_CODE, I.B1_PER_ID1, I.B1_PER_ID2, I.B1_PER_ID3, I.G6_ACT_NUM, 'G6ACTION', I.G6_ACT_TYP, I.G6_STATUS, I.G6_COMPL_DD, I.GA_FNAME, I.GA_MNAME, I.GA_LNAME, I.R3_AGENCY_CODE, I.R3_BUREAU_CODE, \
				C.[TEXT], I.G6_ACT_TT, I.G6_ACT_JVAL, I.REC_DATE, I.REC_FUL_NAM, I.REC_STATUS \
			FROM G6ACTION I LEFT JOIN \
				BACTIVITY_COMMENT C ON I.SERV_PROV_CODE = C.SERV_PROV_CODE AND I.B1_PER_ID1 = C.B1_PER_ID1 AND I.B1_PER_ID2 = C.B1_PER_ID2 AND I.B1_PER_ID3 = C.B1_PER_ID3 AND  \
				C.COMMENT_TYPE = 'Inspection Result Comment' AND I.G6_ACT_NUM = C.G6_ACT_NUM \
			) \
			, vsbclabor_activity_charged as (SELECT SERV_PROV_CODE, B1_PER_ID1, B1_PER_ID2, B1_PER_ID3, CAST(F4FEEITEM_UDF1 AS INT) AS SEQ_NBR, F4FEEITEM_UDF2 AS SOURCE \
			FROM dbo.F4FEEITEM \
			WHERE SERV_PROV_CODE = 'SBCO' AND B1_PER_ID1 NOT LIKE '__POS' AND ISNUMERIC(F4FEEITEM_UDF1 + '.e0') = 1 \
			) \
		select top 1\
					count(*) as vCount\
				from GPROCESS_HISTORY l\
				left join vsbcLABOR_ACTIVITY_CHARGED r on\
					l.serv_prov_code = r.serv_prov_code and\
					l.b1_per_id1 = r.b1_per_id1 and\
					l.b1_per_id2 = r.b1_per_id2 and\
					l.b1_per_id3 = r.b1_per_id3 and\
					l.gprocess_history_seq_nbr = r.seq_nbr and\
					r.source = 'GPROCESS_HISTORY'\
				where\
					l.serv_prov_code = ? and\
					l.b1_per_id1 = ? and\
					l.b1_per_id2 = ? and\
					l.b1_per_id3 = ? and\
					l.sd_hours_spent <> 0 and\
					r.serv_prov_code is null";

	var vConn = aa.db.getConnection();
	var vQuery = vConn.prepareStatement(cSql);
	vQuery.setString(1, servProvCode);
	vQuery.setString(2, pId1);
	vQuery.setString(3, pId2);
	vQuery.setString(4, pId3);

	var vResultSet = vQuery.executeQuery();

	var vReturnValue = 0;

	if (vResultSet.next())
		vReturnValue = vResultSet.getInt("vCount");

	vResultSet.close();
	vQuery.close();
	vConn.close();

	return vReturnValue;
}

/* --------------------------------------------------------------------
/	Retrieve the value if an inspection record's G6_ACT_JVAL field,
/	which is a "User definable field", of type varchar(20).
/	servProvCode is an environmental variable.
/------------------------------------------------------------------- */
function sbcoGetActivityJval(pId1, pId2, pId3, pSeqNbr)
{
	var cSql = "select\
					G6_ACT_JVAL as vData\
				from G6ACTION\
				where\
					serv_prov_code = ? and\
					b1_per_id1 = ? and\
					b1_per_id2 = ? and\
					b1_per_id3 = ? and\
					g6_act_num = ?";

	var vConn = aa.db.getConnection();
	var vQuery = vConn.prepareStatement(cSql);

	vQuery.setString(1, servProvCode);
	vQuery.setString(2, pId1);
	vQuery.setString(3, pId2);
	vQuery.setString(4, pId3);
	vQuery.setInt(5, pSeqNbr);

	var vResultSet = vQuery.executeQuery();

	var vReturnValue = 0;

	if (vResultSet.next())
		vReturnValue = vResultSet.getString("vData");

	vResultSet.close();
	vQuery.close();
	vConn.close();
	vInitialContext.close();

	return vReturnValue;
}

function sbcoGetCapIDModel(pId1, pId2, pId3)
{
	var s_capResult = aa.cap.getCapID(pId1, pId2, pId3);
	if (s_capResult.getSuccess())
		return s_capResult.getOutput();
	else
	{
		logMessage("**ERROR: Failed to get capId: " + s_capResult.getErrorMessage());
		return null;
	}
}

/* ====================================================================
 *	sbcoIsNumber():  Checks a value for being a number.  Returns true
 *	if it is, false otherwise.  Shamelessly lifted from a post in
 *	http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
 * ----------------------------------------------------------------- */
function sbcoIsNumber(n)
{
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function debugObject(object)
{
	var output = '';

	if (object.getClass)
		output = "<font color=green>The object class is</font>: <bold>" + object.getClass() + "</bold>;<br>";

	for (property in object)
	{
		output += "<font color=red>" + property + "</font>" + ': ' + "<bold>" + object[property] + "</bold>" + '; ' + "<BR>";
	}
	logDebug(output);
}
