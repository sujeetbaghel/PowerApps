function generateAutoNumber(executionContext) {
    const formContext = executionContext.getFormContext();
    const prefixChoice = formContext.getAttribute("new_shortname").getValue();
    const prefix = prefixChoice === 1 ? "APR" : prefixChoice === 2 ? "BRP" : null;

    if (!prefix) {
        console.log("Invalid choice");
        return;
    }

    const query = `?$select=new_name&$filter=startswith(new_name,'${prefix}-')&$orderby=new_name desc&$top=1`;

    Xrm.WebApi.retrieveMultipleRecords("new_measure", query).then(
        result => {
            const lastAutoNumber = result.entities[0]?.new_name || `${prefix}-000000`;
            const highestNumber = parseInt(lastAutoNumber.split('-')[1], 10) || 0;
            const newNumber = (highestNumber + 1).toString().padStart(6, '0');
            formContext.getAttribute("new_name").setValue(`${prefix}-${newNumber}`);
        },
        error => console.log("Error: " + error.message)
    );
}
