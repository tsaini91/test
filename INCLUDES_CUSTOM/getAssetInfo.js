function getAssetInfo(assetKey) {
	var ret = [];
	try {
		var seq = assetKey.getG1AssetSequenceNumber();
		var a = aa.asset.getAssetData(seq).getOutput().getDataAttributes().toArray();
		for (var i in a) {
			var v = a[i];
			var name = a[i].getG1AttributeName();
			var val = a[i].getG1AttributeValue();
			logDebug(name + " = " + val);
			ret[name] = val;
		}
		return ret;

	} catch (err) {
		return false;
	}
}