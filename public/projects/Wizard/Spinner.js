///////////////////////////////////////
// Spinner module--implements spinner-like wait
// dialog with and without background and text.
//
// Return function constructor.

"use strict";

define([],
    function () {

        // Define constructor function.
        //
        // jParent          -- jQuery wrapped parent DOM element.  This is the only required parameter.
        // strText          -- Text parameter.  If specified, Spinner is rendered with a rounded background.
        // dTop             -- Top of Spinner (in pixels) relative to the browser window.
		// pctLeft			-- Left of center point as a percentage relative to browser window.
        // dOverlayOpacity  -- Opacity of the (black) background of the overlay div.
        // arrarPedalColors -- Array of the pedal colors.  Also, incidentally, determines the number of pedals to render as part of the flower and correspondingly, their relative radial offsets.
        // strBackFillColor -- Background fill color.
        // strTextFillColor -- Text fill color.
        // dRequiredWidth   -- Minimum width of Spinner.  Will be expanded if text is too wide.
        // dRequiredHeight  -- Minimum height of Spinner.  Will be expanded if text is non-empty.
        // strFontFamily    -- Part of the font.  The Family.
        // dFontSize        -- Part of the font.  The size (in pixels).
        // dTextSpacingGap  -- Extra distance (in pixels) with which to move the text down from the flower.
        // dCornerRadius    -- Border gaps and corner radius (in pixels) of background (if drawn).
        // iSpinSteps       -- Number of steps to a full 2 * Pi radians rotation of the flower.
        // iShortSpinDelay  -- The delay (in ms) between individual steps of the spinning of the flower.
        // iLongSpinDelay   -- The delay (in ms) of the pause in spinning of the flower.
        // dBobDistance     -- The distance (in pixels) that the petals of the flower bob in and out during a quarter turn.
        // dFlowerCenterY   -- The distance down in the y-coordinate (in pixels) specifying the center of the flower.
        // dPedalOffsetY    -- The distance to offset the pedal in the y-direction (in pixels) so that the rotation works by placing the pedals such that they rotate about the point, not the center (of each).
        // dPedalRadius     -- The radius (in pixels) of the "bulb"-part of the pedal.
        // dPedalTipDrop    -- The length (in radius modulated pixels) of the tapering tip of each pedal.
        // dPedalCSM        -- The length (in radius modulated pixels) of each control segment for each pedal.
        // dPedalHalfTipGap -- Half the width (in radius modulated pixels) of the tip of each pedal.
        var functionRet = function Spinner(jParent,     // Required.
            strText,
            dTop,
            pctLeft,
            dOverlayOpacity,
            arrayPedalColors,
            strBackFillColor,
            strTextFillColor,
            dRequiredWidth,
            dRequiredHeight,
            strFontFamily,
            dFontSize,
            dTextSpacingGap,
            dCornerRadius,
            iSpinSteps,
            iShortSpinDelay,
            iLongSpinDelay,
            dBobDistance,
            dFlowerCenterY,
            dPedalOffsetY,
            dPedalRadius,
            dPedalTopDrop,
            dPedalCSM,
            dPedalHalfTipGap) {

            var self = this;

            ///////////////////////////
            // Condition the input parameters and inject DOM elements.
       
            strText = strText || "";
            dTop = dTop || 128;
            pctLeft = pctLeft || 50;
            dOverlayOpacity = dOverlayOpacity || 0.25;
            arrayPedalColors = arrayPedalColors || ["rgba(193,109,144,1)",
                "rgba(193,109,144,0.75)",
                "rgba(193,109,144,0.6)",
                "rgba(193,109,144,0.45)"];
            strBackFillColor = strBackFillColor || "#000000";
            strTextFillColor = strTextFillColor || "#aaaaaa";
            dRequiredWidth = dRequiredWidth || 150;
            dRequiredHeight = dRequiredHeight || 110;
            strFontFamily = strFontFamily || "Arial";
            dFontSize = dFontSize || 17;
            dTextSpacingGap = dTextSpacingGap || 15;
            dCornerRadius = dCornerRadius || 20;
            iSpinSteps = iSpinSteps || 200;
            iShortSpinDelay = iShortSpinDelay || 10;
            iLongSpinDelay = iLongSpinDelay || 310;
            dBobDistance = dBobDistance || 10;
            dFlowerCenterY = dFlowerCenterY || 54;
            dPedalOffsetY = dPedalOffsetY || -23;
            dPedalRadius = dPedalRadius || 17.5;
            dPedalTopDrop = dPedalTopDrop || 1.4;
            dPedalCSM = dPedalCSM || 0.6;
            dPedalHalfTipGap = dPedalHalfTipGap || 0.04;

            // If there is text, then render a background for that text (and render the text).
            var bRenderBackground = strText.length > 0 ? true : false;
            // Compose font string.
            var strFontSize = dFontSize.toString() + "px " + strFontFamily;
            // Calculate the number of steps for one Pi / 2 radians turn.
            var iQuarterSpinSteps = Math.floor(iSpinSteps / 4);
            // Loop counter determines angle at which to draw the flower.
            var iCount = 0;

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

            // If rendering the background then rendering the text--add some room for the text.
            if (bRenderBackground) {

                // Make room for text.
                dRequiredHeight += (dFontSize + dTextSpacingGap);
            }

            // Allocate and configure the canvas.
            var jCanvas = $("<canvas></canvas>");

            // Get the context.
            var jqPlumCanvas = jCanvas;
            var context = jqPlumCanvas[0].getContext("2d");

            // Calculate width of text.
            context.font = strFontSize;
            var dTextWidth = context.measureText(strText).width;

            // Add in borders.
            var dProvisionalWidth = dTextWidth +
                2 * dCornerRadius;

            // If the provisional is greater than the required...
            if (dProvisionalWidth > dRequiredWidth) {

                // ...update the required.
                dRequiredWidth = dProvisionalWidth;
            }

            // Now the official, complete size of the canvas is known.  Configure the canvas.
            jCanvas.attr("width",
                dRequiredWidth.toString() + "px");
            jCanvas.attr("height",
                dRequiredHeight.toString() + "px");

            jCanvas.css({

                position:"absolute",
                left: pctLeft.toString() + "%",
                "margin-left": (-dRequiredWidth / 2).toString() + "px",
                top: dTop.toString() + "px",
                width: dRequiredWidth.toString() + "px",
                height: dRequiredHeight.toString() + "px",
                background: "transparent"
            });
            jOverlay.append(jCanvas);

            /////////////////////////////
            // Private methods

            // The generate plum function.
            var m_functionGeneratePlumPath = function (context,
                dCenterY,
                dRadius,
                strFillStyle) {

                try {

                    // Define some helper fields up front.
                    var dHalfTipGap = dPedalHalfTipGap;
                    var dTipDrop = dPedalTopDrop;
                    var dControlSegmentMagnitude = dPedalCSM;
                    var bFill = true;
                    var dCenterX = 0;

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

            // Render function draws the flower.
            var functionRender = function () {

                // Render background if rendering the background.
                if (bRenderBackground) {

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

                    // Now draw the text.
                    context.fillStyle = strTextFillColor;
                    context.textBaseline = "bottom";
                    context.textAlign = "center";
                    context.font = strFontSize;
                    context.fillText(strText,
                        dRequiredWidth / 2,
                        dRequiredHeight - dCornerRadius);
                } else {

                    // No background or text, just clear.
                    context.clearRect(0,
                        0,
                        dRequiredWidth,
                        dRequiredHeight);
                }

                // Calculate the offset angle for the spinning.
                var dAngle = 2 * Math.PI * iCount / iSpinSteps;

                // Calculate how much the pedal bobs in and out during a quarter turn--based on abs (2 * the angle) to just get the positive point of a sinusoidal curve one complete hump per quarter turn.
                var dIn = Math.abs(Math.sin(2 * dAngle)) * dBobDistance;

                // Save the orientation of the canvas for later.
                context.save();

                // Trasnlate the center point--also this is the center of where the flower will be drawn.
                context.translate(dRequiredWidth / 2,
                    dFlowerCenterY);

                // Rotate by the offset angle.
                context.rotate(dAngle);

                // Draw the pedals.  The number of pedals to draw is determined by the number of colors specified.
                // Note that each is always equally spaced radially about 2 * Pi radians, for our viewing pleasure.
                for (var i = 0; i < arrayPedalColors.length; i++) {

                    // Draw each pedal.
                    var exceptionRet = m_functionGeneratePlumPath(context,
                        dPedalOffsetY + dIn, // center y
                        dPedalRadius, // radius,
                        arrayPedalColors[i]); // fill
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Rotate for the next pedal.
                    context.rotate(2 * Math.PI / arrayPedalColors.length);
                }
                context.restore();

                // Pause every Pi / 2 angle.
                iCount++;
                if (iCount % iQuarterSpinSteps == 0) {

                    // Continue rendering.
                    setTimeout(functionRender,
                        iLongSpinDelay);
                } else {

                    // Continue rendering.
                    setTimeout(functionRender,
                        iShortSpinDelay);
                }
            };

            //////////////////////////
            // Start the rendering.
            setTimeout(functionRender,
                iShortSpinDelay);
        };

        // Return constructor function.
        return functionRet;
    });
