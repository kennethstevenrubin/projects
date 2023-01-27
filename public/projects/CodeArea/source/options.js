///////////////////////////////////////
// Options module.
//
// Return instance.
//

"use strict";

// Require-AMD, and dependencies.
define(["./prototypes",
    "./Size"],
    function (prototypes, Size) {

        try {

            // Constructor function.
        	var functionRet = function Options() {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    self.cornerRadiusFactor = 20;
                    self.minBorderRadius = 10;
                    self.statementHeight = 60;
                    self.host = {

                        selector: "#CodeArea"           // The host selector.
                    };
                    self.backgroundFill = "#333333";          // Background fill color.
                    self.nameFill = "#999933";                // Name fill color.
                    self.nameStroke = "#FFFF00";              // Name stroke color.
                    self.textFill = "#FFFF00";                // Name stroke color.
                    self.textFont = "40px Monospace";     // Name stroke color.
                    self.textDataFill = "#222200";
                    self.textDataFont = "30px Monospace"; // Name stroke color.
                    self.textDataBorder = new Size(5,3);      //
                    self.textExpressionFill = "#002222";
                    self.textExpressionFont = "20px Monospace";
                    self.textHeight = 40;                     // Height of font.
                    self.nameTextWidth = 100;                 // Width of the label of the name text.
                    self.parametersOpenTextWidth = 15;        // Width of the '(' text for the parameters.
                    self.parametersCloseTextWidth = 15;
                    self.parametersFill = "#993399";
                    self.parametersStroke = "#FFFF00";
                    self.parametersLines = 2.5;
                    self.statementsOpenTextWidth = 15;        // Width of the '(' text for the parameters.
                    self.statementsCloseTextWidth = 15;
                    self.statementFill = "#999999";
                    self.statementsFill = "#339999";
                    self.statementStroke = "#330033";
                    self.statementsStroke = "#FFFF00";
                    self.statementGap = 10;
                    self.scrollGlyphWidth = 15;
                    self.scrollGlyphHeight = 15;
                    self.scrollGlyphFill = "#333399";
                    self.scrollGlyphStroke = "#FFFF00";
                    self.defaultWidth = 800;                  // Arbitrary default width.
                    self.defaultHeight = 600;                 // Arbitrary default height.
                    self.borderPadding = 15;                   // Spacing around objects.
                    self.statementForBlockHeight = 55;
                    self.mouseRepeatDelay = 10; 
                    self.expressionOffset = 300;
                    self.expressionGap = 10;
                    self.expressionFill = "#339999";
                    self.plusWidth = 20;
                    self.statementNewStatementForOffset = 30;
                    self.statementNewStatementForWidth = 60;
                    self.textStatementFont = "25px Monospace"; // Name stroke color.
                    self.statementInvokeOffset = 30;
                    self.statementInvokeWidth = 60;
                    self.statementNewStatementInvokeOffset = 100;
                    self.statementNewStatementInvokeWidth = 105;
                    self.blockBorder = new Size(26, 10);
                } catch (e) {

                    alert(e.message);
                }
        	};

            // Allocate and return instance, not constructor.
        	return new functionRet();
        } catch (e) {

            alert(e.message);
        }
    });
