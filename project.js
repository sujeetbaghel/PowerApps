function onProjectCreate(executionContext) {
    var formContext = executionContext.getFormContext();
    var projectTemplateLookup = formContext.getAttribute("new_projecttemplate").getValue();

    if (projectTemplateLookup) {
        var projectTemplateId = projectTemplateLookup[0].id.replace("{", "").replace("}", "");

        // Retrieve 'shortname' and 'financial_template_lookup' from 'Project Template'
        Xrm.WebApi.retrieveRecord("new_projecttemplate", projectTemplateId).then(
            function success(result) {
                var shortnameText = result["new_shortname@OData.Community.Display.V1.FormattedValue"];
                var autoNum = formContext.getAttribute("new_autonum").getValue();
                formContext.getAttribute("new_shortname").setValue(result.new_shortname);
                formContext.getAttribute("new_name").setValue(`${shortnameText}-${autoNum}`);

                var financialTemplateLookup = result._new_financialtemplate_value;

                if (financialTemplateLookup) {
                    // console.log('lookup:'+financialTemplateLookup)
                    var financialTemplateId = financialTemplateLookup;

                    // console.log(financialTemplateId)

                    // Retrieve 'Create Financial Record' from 'Financial Template'
                    Xrm.WebApi.retrieveRecord("new_financialtemplate", financialTemplateId).then(
                        function success(result) {
                            console.log(result)
                            var createFinancialRecord = result.new_createfinancialrecord;

                            if (createFinancialRecord) {
                                var projectId = formContext.data.entity.getId().replace("{", "").replace("}", "");
                                console.log(projectId)
                                var financialRecord = {
                                    "new_name": result.new_name,
                                    "new_financialstatus": result.new_financialstatus,
                                     "new_ParentProject1@odata.bind": `/new_projects(${projectId})`
                                };

                                Xrm.WebApi.createRecord("new_financial", financialRecord).then(
                                    function success(result) {
                                        console.log("Financial record created with ID: " + result.id);
                                    },
                                    function(error) {
                                        console.log("Error creating financial record: " + error.message);
                                    }
                                );
                            }
                        },
                        function(error) {
                            console.log("Error retrieving financial template: " + error.message);
                        }
                    );
                }
            },
            function(error) {
                console.log("Error retrieving project template: " + error.message);
            }
        );
    } else {
        console.log("No project template lookup value found.");
    }
}
