///////////////////////////////////////
// Movie module--implements Movie for Plumvo Dashbaord Wizard.
//
// Return function constructor.

"use strict";

define(["Wizard/regions/RegionButtonPinched"],
    function (RegionButtonPinched) {

        // Define constructor function.
        //
        // jParent          -- jQuery wrapped parent DOM element.  This is the only required parameter.
        // strTitle         -- Title of dialog.
        // arrayParagraphs  -- The three paragraphs of text displayed in the client.
        // strButtonCaption -- The caption of the button in the lower right.
        // dTop             -- The y-coordinate of the top of the dialog.
        // dOverlayOpacity  -- Opacity of the (black) background of the overlay div.
        // strBackFillColor -- Background fill color.
		// strTitleFillColor -- Title fill color.
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
            strTitleFillColor,
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
       
            strTitle = strTitle || "A few last hints";
            arrayParagraphs = arrayParagraphs || ["To create goals, click and drag plum icons from the top of the plan dashboard to the \"Dreams & Goals\" pane.", "Drag the ends of bars on the timeline to make events start sooner or run longer.", "Click the names of the plan objects to view and edit their contents."];
            strButtonCaption = strButtonCaption || "Let's Go!";
            dTop = dTop || 128;
            dOverlayOpacity = dOverlayOpacity || 0.25;
            strBackFillColor = strBackFillColor || "#ffffff";
            strTitleFillColor = strTitleFillColor || "#7FB062";
            strTextFillColor = strTextFillColor || "#666666";
            dRequiredWidth = dRequiredWidth || 520;
            dRequiredHeight = dRequiredHeight || 420;
            strFontFamily = strFontFamily || "Open Sans";
            dFontSize = dFontSize || 18;
            dTitleFontSize = dTitleFontSize || 32;
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
            var strFont = "300 " + dFontSize.toString() + "px " + strFontFamily;

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
            
            // Allocate the image for the plum drawing.
            var img = new Image();
            
            // Set the call-back which is invoked when the image is down-loaded.
            img.onload = function(){
            	
            	// Render now that image is loaded.
            	var x = dRequiredWidth - dWidthParagraphPadding - 47;
            	var y = dParagraphStartY + 25;
            	
            	// First draw the plum.
            	var exceptionRet = m_functionGeneratePlumPath(context,
            			x,						// center x
                        y,						// center y
                        40,						// radius
                        "rgba(144,71,98,1)",	// fill
                        0.04,					// dPedalHalfTipGap
                        1.4,					// dPedalTopDrop
                        0.6						// dPedalCSM
                );
            	if (exceptionRet !== null)
            		return;
            	
            	// And now draw Retirement.png.
            	context.drawImage(img,x-img.width/2,y-img.height/2);
            	
            };

            // Set the url--this has the effect of causing 
            // the browser to go out and download the image.
            // Then it will be drawn on the onload function.
//            img.src = prefix + "media/RetirementScaled.png";
            img.src = prefix + "media/Retirement.png";
            
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
                context.moveTo(left,
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
                    top);
                context.closePath();
                context.fillStyle = strBackFillColor;
                context.fill();

                // Draw the title.
                context.fillStyle = strTitleFillColor;
                context.textBaseline = "top";
                context.textAlign = "left";
                context.font = "300 " + dTitleFontSize.toString() + "px " + strFontFamily;

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
                        dRequiredWidth - dWidthParagraphPadding - (j === 0 ? 125 : 0));
       
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
            
	        // The generate plum function.
	        var m_functionGeneratePlumPath = function (context,
	        	dCenterX,
	            dCenterY,
	            dRadius,
	            strFillStyle,
	            dPedalHalfTipGap,
	            dPedalTopDrop,
	            dPedalCSM) {
	
	            try {
	
	                // Define some helper fields up front.
	                var dHalfTipGap = dPedalHalfTipGap;
	                var dTipDrop = dPedalTopDrop;
	                var dControlSegmentMagnitude = dPedalCSM;
	                var bFill = true;
	
	                // Fields are actually multipliers.
	                // Calculate out here.
	                dHalfTipGap *= dRadius;
	                dTipDrop *= dRadius;
	                dControlSegmentMagnitude *= dRadius;
	
	                // Set the color.
	                context.fillStyle = strFillStyle;
	
	                // Start the shape.
	                context.beginPath();
	
	                // Start at the right side of the base of the ice-cream cone.
	                context.moveTo(dCenterX + dHalfTipGap,
	                    dCenterY + dTipDrop);
	
	                // Move up the right side to the beginning of the ice-cream.
	                var dStartPointX = dCenterX + Math.cos(-Math.PI / 4) * dRadius;
	                var dStartPointY = dCenterY - Math.sin(-Math.PI / 4) * dRadius;
	                context.lineTo(dStartPointX, dStartPointY);
	
	                // Declare a function that just draws
	                // a part of the bulb of the plum shape.
	                var functionRenderArc = function (dCenterX,
	                    dCenterY,
	                    dRadius,
	                    dControlSegmentMagnitude,
	                    context,
	                    i) {
	
	                    try {
	
	                        // The arc is a bezier which stretches between to 
	                        // spokes of a rotated cross.  "i" indicates the
	                        // index number of the fist stave.  "i + 1" indicates
	                        // the target index and represents the point rotated
	                        // counter-clockwise of the next stave end-point.
	
	                        // -Math.PI / 4 is the rotated cross stave.  
	                        // Math.PI / 2 * i is the iterative component.
	                        var dStartTheta = -Math.PI / 4 + (Math.PI / 2) * i;
	                        var dStartPointX = dCenterX + Math.cos(dStartTheta) * dRadius;
	                        var dStartPointY = dCenterY - Math.sin(dStartTheta) * dRadius;
	
	                        // The first control segment starts at the start 
	                        // point and angles Math.PI / 2 before extending.
	                        var dControlSegment1Theta = dStartTheta + Math.PI / 2;
	                        var dControlSegment1X = dStartPointX +
	                            Math.cos(dControlSegment1Theta) * dControlSegmentMagnitude;
	                        var dControlSegment1Y = dStartPointY -
	                            Math.sin(dControlSegment1Theta) * dControlSegmentMagnitude;
	
	                        // The end point is the next stave of the rotated cross.
	                        var dEndTheta = dStartTheta + Math.PI / 2;
	                        var dEndPointX = dCenterX + Math.cos(dEndTheta) * dRadius;
	                        var dEndPointY = dCenterY - Math.sin(dEndTheta) * dRadius;
	
	                        // The second control segment starts at the end
	                        // point and angles -Math.PI / 2 before extending.
	                        var dControlSegment2Theta = dEndTheta - Math.PI / 2;
	                        var dControlSegment2X = dEndPointX +
	                            Math.cos(dControlSegment2Theta) * dControlSegmentMagnitude;
	                        var dControlSegment2Y = dEndPointY -
	                            Math.sin(dControlSegment2Theta) * dControlSegmentMagnitude;
	
	                        // Draw the curve described above.
	                        context.bezierCurveTo(dControlSegment1X,
	                            dControlSegment1Y,
	                            dControlSegment2X,
	                            dControlSegment2Y,
	                            dEndPointX,
	                            dEndPointY);
	
	                        return null;
	                    } catch (e) {
	
	                        return e;
	                    }
	                };
	
	                // The ice-cream bulb is broken into 3 chunks.
	                // A cross is rotated Pi/4 radians.
	                // Then bezier curves connect the staves, 
	                // attached where the cone touches the ice.
	                for (var i = 0; i < 3; i++) {
	
	                    var exceptionRet = functionRenderArc(dCenterX,
	                        dCenterY,
	                        dRadius,
	                        dControlSegmentMagnitude,
	                        context,
	                        i);
	                    if (exceptionRet !== null) {
	
	                        throw exceptionRet;
	                    }
	                }
	
	                // Now move back down the left hand side of the cone.
	                context.lineTo(dCenterX - dHalfTipGap,
	                    dCenterY + dTipDrop);
	
	                // And close the path.
	                context.lineTo(dCenterX + dHalfTipGap,
	                    dCenterY + dTipDrop);
	
	                // Fill solid.
	                if (bFill) {
	
	                    context.fill();
	                }
	
	                return null;
	            } catch (e) {
	
	                return e;
	            }
	        };
	    };
        // Return constructor function.
        return functionRet;
	}
);
