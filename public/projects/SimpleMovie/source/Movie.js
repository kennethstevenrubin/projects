///////////////////////////////////////
// Movie module--implements Movie for Plumvo Dashbaord Wizard.
//
// Return function constructor.

"use strict";

define(["RegionButtonPinched"],
    function (RegionButtonPinched) {

        // Define constructor function.
        //
        // jParent          -- jQuery wrapped parent DOM element.  This is the only required parameter.
        // strTitle         -- Ttitle of dialog.
        // arrayParagraphs  -- The three paragraphs of text displayed in the client.
        // strButtonCaption -- The caption of the button in the lower right.
        // dTop             -- The y-coordinate of the top of the dialog.
        // dOverlayOpacity  -- Opacity of the (black) background of the overlay div.
        // strBackFillColor -- Background fill color.
        // strTextFillColor -- Text fill color.
        // dRequiredWidth   -- Minimum width of Movie.
        // dRequiredHeight  -- Minimum height of Movie.
        // strFontFamily    -- Part of the font.  The Family.
        // dFontSize        -- Part of the font.  The size (in pixels).
        // dTitleFontSize   -- Part of the title font.  The size (in pixels).
        // dButtonFontSize  -- Part of the button font.  The size (in pixels).
        // dLineHeight      -- The number of pixels separating successive rows of text.
        // dParagraphSpacingGap -- The number of pixels separating successive paragraphs of text.
        // dCornerRadius    -- Border gaps and corner radius (in pixels) of background (if drawn).
        //
        // dRightGap        -- The right spacing (in pixles) of the left side of the button.
        // dBottomGap       -- The height (in pixels) from the bottom margin (sort of like padding).
        // dButtonHeight    -- The height of the button (in pixels).
        // dTitleX          -- The x-coordinate of the title left.
        // dTitleY          -- The y-coordinate of the title top.
        // dParagraphStartY -- The starting y-coordinate of the paragraphs.
        // dWidthParagraphPadding -- The padding for the line-splitting paragraph operations.
        // dLineStartX      -- The starting x-coordinate of the paragraph text output.
        var functionRet = function Movie(jParent,     // Required.
            strTitle,
            arrayParagraphs,
            strButtonCaption,
            dTop,
            dOverlayOpacity,
            strBackFillColor,
            strTextFillColor,
            dRequiredWidth,
            dRequiredHeight,
            strFontFamily,
            dFontSize,
            dTitleFontSize,
            dButtonFontSize,
            dLineHeight,
            dParagraphSpacingGap,
            dCornerRadius,
            
            dRightGap,
            dBottomGap,
            dButtonHeight,
            dTitleX,
            dTitleY,
            dParagraphStartY,
            dWidthParagraphPadding,
            dLineStartX) {

            var self = this;

            ///////////////////////////
            // Condition the input parameters and inject DOM elements.
       
            strTitle = strTitle || "A few last hints:";
            arrayParagraphs = arrayParagraphs || ["To create goals, click and drag plum icons from the top of the plan dashboard to the \"Dreams & Goals\" pane.", "Drag the ends of bars on the timeline to make events start sooner or run longer.", "Click the names of the plan objects to view and edit their contents."];
            strButtonCaption = strButtonCaption || "Let's Go!";
            dTop = dTop || 128;
            dOverlayOpacity = dOverlayOpacity || 0.25;
            strBackFillColor = strBackFillColor || "#ffffff";
            strTextFillColor = strTextFillColor || "#404040";
            dRequiredWidth = dRequiredWidth || 480;
            dRequiredHeight = dRequiredHeight || 420;
            strFontFamily = strFontFamily || "Arial";
            dFontSize = dFontSize || 17;
            dTitleFontSize = dTitleFontSize || 27;
            dFontSize = dFontSize || 17;
            dLineHeight = dLineHeight || 20;
            dParagraphSpacingGap = dParagraphSpacingGap || 30;
            dCornerRadius = dCornerRadius || 20;
       
            dRightGap = dRightGap || 150;
            dBottomGap = dBottomGap || 50;
            dButtonHeight = dButtonHeight || 32;
            dTitleX = dTitleX || 20;
            dTitleY = dTitleY || 30;
            dParagraphStartY = dParagraphStartY || 100;
            dWidthParagraphPadding = dWidthParagraphPadding || 50;
            dLineStartX = dLineStartX || 20;

            // Compose font string.
            var strFont = dFontSize.toString() + "px " + strFontFamily;

            // First inject the overlay div.
            var jOverlay = $("<div></div>");
            jOverlay.css({

                "z-index": 1000,
                position:"fixed",
                left: "0px",
                top: "0px",
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0," + dOverlayOpacity.toString() + ")"
            });
            jParent.append(jOverlay);

            // Allocate and configure the canvas.
            var jCanvas = $("<canvas></canvas>");

            // Get the context.
            var jqPlumCanvas = jCanvas;
            var context = jqPlumCanvas[0].getContext("2d");

            // Now the official, complete size of the canvas is known.  Configure the canvas.
            jCanvas.attr("width",
                dRequiredWidth.toString() + "px");
            jCanvas.attr("height",
                dRequiredHeight.toString() + "px");
            jCanvas.css({

                position:"absolute",
                left: "50%",
                "margin-left": (-dRequiredWidth / 2).toString() + "px",
                top: dTop.toString() + "px",
                width: dRequiredWidth.toString() + "px",
                height: dRequiredHeight.toString() + "px",
                background: "transparent"
            });
            jOverlay.append(jCanvas);
       
            // Allocate the button.
            var button = new RegionButtonPinched({
       
                context: context,
                opacity: 1,
                left: dRequiredWidth - dRightGap,
                top: dRequiredHeight - dBottomGap - dCornerRadius,
                height: dButtonHeight,
                click: function () {
                
                    jOverlay.remove();
                },
                label: {

                    text: strButtonCaption
                }
            });
       
            jCanvas.click(function (e) {

                try {
                
                    if (e.offsetX === undefined ||
                        e.offsetY === undefined) {
                        
                        e.offsetX = e.pageX - jCanvas.offset().left;
                        e.offsetY = e.pageY - jCanvas.offset().top;
                    }
                    button.click(e);
                } catch (e) {
                
                    alert(e.message);
                }
            });
            jCanvas.mousemove(function (e) {

                try {
                
                    if (e.offsetX === undefined ||
                        e.offsetY === undefined) {
                        
                        e.offsetX = e.pageX - jCanvas.offset().left;
                        e.offsetY = e.pageY - jCanvas.offset().top;
                    }
                    var strCursor = button.mouseMove(e);
                    if (strCursor) {
                    
                        jCanvas.css("cursor",
                            strCursor);
                    } else {
                    
                        jCanvas.css("cursor",
                            "default");
                    }
                } catch (e) {
                
                    alert(e.message);
                }

            });

            /////////////////////////////
            // Private methods

            // Calculate the collection of lines of a given paragraph.
            var m_functionCalculateLines = function (strParagraph,
                dWidth) {
       
                // The collection of lines returned.
                var arrayRet = [];
                
                // Split the text into "words".
                var arrayWords = strParagraph.split(" ");

                // Maintain left and top cursors.
                var dLeft = 0;
   
                // Ensure the correct font is specified.
                context.font = strFont;

                // Measure the width of a single space.
                var dSpaceWidth = context.measureText(" ").width;

                // Piece the label together, one word at a time and wrap.
                var strLine = "";
                for (var i = 0; i < arrayWords.length; i++) {

                    // Get the next word.
                    var strWord = arrayWords[i];
                    if (!strWord) {

                        continue;
                    }

                    // See if the next word needs to go on a
                    // new line and or simply update the cursor.
                    var sizeWord = context.measureText(strWord);
                    if (sizeWord.width + dLeft >= dWidth) {

                        dLeft = 0;
                        if (strLine.length > 0) {

                            arrayRet.push(strLine);
                        }
                        strLine = "";
                    }

                    // Output word.
                    if (strLine.length > 0) {

                        strLine += " ";
                    }
                    strLine += strWord;

                    // Update cursor
                    dLeft += (sizeWord.width + dSpaceWidth);
                }

                if (strLine.length > 0) {

                    arrayRet.push(strLine);
                }

                return arrayRet;
            };

            // Render function draws the flower--invoke implicitly.
            var functionRender = function () {

                // Calculate the sizes.
                var left = 0;
                var top = 0;
                var width = dRequiredWidth;
                var height = dRequiredHeight;
                var cornerRadius = dCornerRadius;

                // Draw the rounded-rect background.
                context.beginPath();
                context.moveTo(left + cornerRadius,
                    top);
                context.lineTo(left + width - cornerRadius,
                    top);
                context.quadraticCurveTo(left + width,
                    top,
                    left + width,
                    top + cornerRadius);
                context.lineTo(left + width,
                    top + height - cornerRadius);
                context.quadraticCurveTo(left + width,
                    top + height,
                    left + width - cornerRadius,
                    top + height);
                context.lineTo(left + cornerRadius,
                    top + height);
                context.quadraticCurveTo(left,
                    top + height,
                    left,
                    top + height - cornerRadius);
                context.lineTo(left,
                    top + cornerRadius);
                context.quadraticCurveTo(left,
                    top,
                    left + cornerRadius,
                    top);
                context.closePath();
                context.fillStyle = strBackFillColor;
                context.fill();

                // Draw the title.
                context.fillStyle = strTextFillColor;
                context.textBaseline = "top";
                context.textAlign = "left";
                context.font = dTitleFontSize.toString() + "px " + strFontFamily;

                context.fillText(strTitle,
                    dTitleX,
                    dTitleY);
       
                // Draw the paragraphs.
                context.fillStyle = strTextFillColor;
                context.textBaseline = "top";
                context.textAlign = "left";
                context.font = strFont;

                var iCursor = dParagraphStartY;
       
                // Render out the paragraphs.
                for (var j = 0; j < arrayParagraphs.length; j++) {
       
                    // Get the array of lines.
                    var arrayLines = m_functionCalculateLines(arrayParagraphs[j],
                        dRequiredWidth - dWidthParagraphPadding);
       
                    // Loop over each line.
                    for (var i = 0; i < arrayLines.length; i++) {
       
                        // Just output line.
                        context.fillText(arrayLines[i],
                            dLineStartX,
                            iCursor);
                        iCursor += dLineHeight;
                    }
       
                    // Compensate for the paragraph.
                    iCursor += dParagraphSpacingGap;
                }
       
                // Draw the button.
                button.render();
            }();
        };

        // Return constructor function.
        return functionRet;
    });
