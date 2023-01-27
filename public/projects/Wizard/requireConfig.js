////////////////////////////////////////////////
// Main is invoked when require is down-loaded.

"use strict";

var planchangelastnewval = null;

/*requirejs.config({
	urlArgs: "bust=" + (new Date()).getTime()
});*/

// Execute when DOM is ready.
$(document).ready(function () {

    require(["Wizard/Wizard",
        "DateTimeParser"],
        function(Wizard,
            DateTimeParser) {
        
            try {
            
                var pp = $.parseJSON('{ "plumPalette":{"visible":true,"plans": [{"selectedPlan" : false,"showMovie" : false,"planId" : 1,"planName" : "Jerry\u0027s plansw","windowStart" : "2013-11-05","windowDuration" : 1477612799000,"msDuration" : 1477612799000},{"selectedPlan" : false,"showMovie" : false,"planId" : 2,"planName" : "Realistic Plan","windowStart" : "2013-11-05","windowDuration" : 1172534399000,"msDuration" : 1172534399000},{"selectedPlan" : false,"showMovie" : false,"planId" : 3,"planName" : "Another Plan","windowStart" : "2013-11-05","windowDuration" : 1172534399000,"msDuration" : 1172534399000},{"selectedPlan" : false,"showMovie" : false,"planId" : 351,"planName" : "Evil Plan","windowStart" : "2020-01-12","windowDuration" : 641397817609,"msDuration" : 1172534399000},{"selectedPlan" : false,"showMovie" : false,"planId" : 452,"planName" : "Gib\u0027s test","windowStart" : "2014-04-05","windowDuration" : 1118823646008,"msDuration" : 1172534399000},{"selectedPlan" : false,"showMovie" : false,"planId" : 851,"planName" : "Is primary plan - Copy","windowStart" : "2013-11-05","windowDuration" : 844278760168,"msDuration" : 1156636799000},{"selectedPlan" : false,"showMovie" : false,"planId" : 852,"planName" : "Is primary plan - Copy (2)","windowStart" : "2013-11-05","windowDuration" : 1156636799000,"msDuration" : 1156636799000},{"selectedPlan" : false,"showMovie" : false,"planId" : 1451,"planName" : "Jerry\u0027s plan - Copy","windowStart" : "2034-10-06","windowDuration" : 496488866939,"msDuration" : 1156636799000},{"selectedPlan" : true,"showMovie" : false,"planId" : 1551,"planName" : "hhh","windowStart" : "2013-11-05","windowDuration" : 1459209599000,"msDuration" : 1459209599000},{"selectedPlan" : false,"showMovie" : false,"planId" : 1851,"planName" : "Hhhss","windowStart" : "2013-11-05","windowDuration" : 1553903999000,"msDuration" : 1553903999000},{"selectedPlan" : false,"showMovie" : false,"planId" : 1951,"planName" : "WizTest","windowStart" : "2013-11-05","windowDuration" : 1556323199000,"msDuration" : 1556323199000},{"selectedPlan" : false,"showMovie" : false,"planId" : 1952,"planName" : "NewWizTest","windowStart" : "2013-11-05","windowDuration" : 1556323199000,"msDuration" : 1556323199000},{"selectedPlan" : false,"showMovie" : false,"planId" : 3053,"planName" : "Empty Plan","windowStart" : "2013-11-05","windowDuration" : 1559001599000,"msDuration" : 1559001599000},{"selectedPlan" : false,"showMovie" : false,"planId" : 3451,"planName" : "Wiz Demo 1","windowStart" : "2013-11-05","windowDuration" : 1580083199000,"msDuration" : 1580083199000},{"selectedPlan" : false,"showMovie" : false,"planId" : 3452,"planName" : "Wiz Demo 2","windowStart" : "2013-11-05","windowDuration" : 1580083199000,"msDuration" : 1580083199000},{"selectedPlan" : false,"showMovie" : false,"planId" : 3551,"planName" : "Wiz Demo 3","windowStart" : "2013-11-05","windowDuration" : 1580083199000,"msDuration" : 1580083199000}]}}',
                    true);
            
                // Allocate the wizard.
                var wizard = new Wizard({
            
                    plumPalette: pp.plumPalette,
                    host: {
                    
                        selector: "#HostDiv"
                    },
                    wizData: {"lastQuestionPage":"PageWelcome","household":{"self":{"dob":"","gender":"","maritalStatus":"","selfIsComplete":false},"sectionButtonEnabled":false,"dbDataExists":false},"assets":{"retirementAccounts":{"accountsSelf":[],"accountsSpouse":[],"dbDataExists":false,"userMayGoThruSection":true},"collegeAccounts":{"accounts":[],"dbDataExists":false,"userMayGoThruSection":true},"otherInvestmentAccounts":{"accounts":[],"dbDataExists":false,"userMayGoThruSection":true},"otherBankAccounts":{"accounts":[],"userMayGoThruSection":true,"dbDataExists":false},"sectionButtonEnabled":false},"everydayLife":{"income":{"selfIncome":{"employment":"","salary":"$","period":""},"spouseIncome":{"employment":"","salary":"$","period":""},"otherIncomes":[]},"expenses":{"monthlyAggregate":"$","monthlyHousing":"$","monthlyUtilities":"$","monthlyFood":"$","monthlyTransportation":"$","monthlyHealth":"$","discretionaryExpenses":[],"aggregateBeingUsed":false,"haveAskedTheQuestion":false},"savings":{"savingsRetirementSelf":{"monthlyOwnContribution":"$","monthlyEmplContribution":"$","annualIRAContribution":"$"},"savingsRetirementSpouse":{"monthlyOwnContribution":"$","monthlyEmplContribution":"$","annualIRAContribution":"$"},"savingsNonretirement":"$"},"sectionButtonEnabled":false},"index":0,"selfName":"","spouse":{"gender":"","name":"","dob":""},"children":[],"retirementRiskModel":"","collegeRiskModel":"","investmentRiskModel":"","savingsRiskModel":"Cash","answer3_0":"","beenHere3_3":false,"answer4_2":"","beenHere4_6":false,"answer4_7":"","beenHere4_11":false,"answer4_13":"","beenHere4_19":false,"answer5_2":"","beenHere5_6":false,"answer5_8":"","beenHere5_12":false,"answer5a_5":"","beenHere5a_8":false,"answer6_6":"","beenHere6_9":false}

                });
            
                wizard.onQuestionCompleted = function () {
            
                };

                // Create the wizard.
                var exceptionRet = wizard.create();
                if (exceptionRet !== null) {
            
                    throw exceptionRet;
                }
            
            } catch (e) {
            
                alert(e.message);
            }
        });
});

