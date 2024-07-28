function copyPriceFromMeasure(executionContext) {
    var formContext = executionContext.getFormContext();
    var measureLookup = formContext.getAttribute("new_measureid").getValue();

    if (measureLookup != null) {
        var measureId = measureLookup[0].id.replace(/[{}]/g, ""); // Remove braces from GUID if present

        Xrm.WebApi.retrieveRecord("new_measure", measureId, "?$select=new_price").then(
            function (result) {
                formContext.getAttribute("new_price").setValue(result.new_price);
            },
            function (error) {
                console.log(error.message);
            }
        );
    }else{
        formContext.getAttribute("new_price").setValue(null);
    }
}
