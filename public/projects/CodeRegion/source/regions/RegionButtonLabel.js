////////////////////////////////////////
// RegionButtonLabel -- Clickable label.
//
// Return constructor function.

"use strict";

define(["../prototypes",
    "./RegionButton"],
    function (prototypes,
        RegionButton) {

        // Define constructor function.
        var functionRet = function RegionButtonLabel(optionsOverride) {

            var self = this;            // Uber closure.

            // Inherit from RegionButton.
            self.inherits(RegionButton, {

                width: 200,
                height: 40,
                fillStyleEnabled: "transparent",
                fillStyleDisabled: "transparent",
                paragraphJustification: "left",
                label: {
                
                    text: "[label]",
                    fillStyle: "#000000",
                    font: "24px Arial",
                    lineHeight: 24
                }
            }.inject(optionsOverride));

            ////////////////////////////
            // Public methods.

            // Set the text and re-set linesPreprocessed
            // so that lines[] will be re-calculated.
            self.setLabel = function (strText) {
            	
            	try {
            		
            		self.options.label.text = strText;
            		m_options.linesPreprocessed = false;
            		
            	} catch (e) {
            		
            		return e;
            	}
            	
            	return null;
            };
            
            // Return height as calculated by lineHeight and number of lines.
            self.getCalculatedHeight = function () {
       
                try {
       
                    // If not preprocessed, then preprocess.
                    if (!m_options.linesPreprocessed) {

                        // Calculate the lines.
                        var exceptionRet = m_functionCalculateLines();
                        if (exceptionRet != null) {
       
                            return exceptionRet;
                        }
                    }
       
                    // Calculate the px's of the font.
                    var arrayMatch = self.options.label.font.match(/(\d+)px/g);
                    var dPixels = parseFloat(arrayMatch[0]);
                    
                    var lh = (self.options.label.lineHeight === undefined) ? dPixels * 1.2 : self.options.label.lineHeight;
       
                    return Math.round((m_options.lines.length - 1) * lh + dPixels);
                } catch (e) {
       
                    throw e;
                }
            };

            ////////////////////////////
            // Protected methods.

            // Generate the boundard path.
            self.generatePath = function () {

                try {

                    // Generate bounding path.
                    self.options.context.beginPath();

                    self.options.context.moveTo(self.options.left,
                        self.options.top);

                    self.options.context.lineTo(self.options.left + self.options.width,
                        self.options.top);

                    self.options.context.lineTo(self.options.left + self.options.width,
                        self.options.top + self.options.height);

                    self.options.context.lineTo(self.options.left,
                        self.options.top + self.options.height);

                    self.options.context.closePath();

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render the label.
            self.renderInterior = function () {

                try {

                    // Render a background block if the fillStyleEnabled is not "transparent".
                    if (self.options.fillStyleEnabled !== "transparent") {
       
                        self.options.context.fillStyle = self.convertColor(self.options.fillStyleEnabled);
                        self.options.context.fillRect(self.options.left,
                            self.options.top,
                            self.options.width,
                            self.options.height + 1);   // Cover the border of the drop-down.
                    }

                    self.options.context.textBaseline = "top";
                    self.options.context.textAlign = "left";
                    self.options.context.font = self.options.label.font;
                    self.options.context.fillStyle = self.convertColor(self.options.label.fillStyle);

                    // If not preprocessed, then preprocess.
                  if (!m_options.linesPreprocessed) {

                        // Calculate the lines.
                        var exceptionRet = m_functionCalculateLines();
                        if (exceptionRet != null) {
       
                            return exceptionRet;
                        }
                    }
       
                    // Process cached lines.
                    for (var i = 0; i < m_options.lines.length; i++) {
       
                        // Get the ith line.
                        var strLine = m_options.lines[i];
                        if (!strLine) {
       
                            continue;
                        }
       
                        // Calculate where to draw the line.
                        var dLeft = 0;
                        if (self.options.paragraphJustification === "right") {
       
                            dLeft = self.options.width - self.options.context.measureText(strLine).width;
                        } else if (self.options.paragraphJustification === "center") {

                            dLeft = (self.options.width - self.options.context.measureText(strLine).width) / 2;
                        }

                        // Render the text.
                        self.options.context.fillText(strLine,
                            self.options.left + dLeft,
                            self.options.top + i * self.options.label.lineHeight);
                    }
       
                    return null;
                } catch (e) {

                    return e;
                }
            };
       
            /////////////////////////////////
            // Private methods.
       
            // Calculate the collection of lines.
            var m_functionCalculateLines = function () {
       
                try {
       
                	m_options.lines = [];	// in case we're coming through a second time for an error message change.
                	
                    // Split the text into "words".
                    var arrayWords = self.options.label.text.split(" ");
   
                    // Maintain left and top cursors.
                    var dLeft = 0;
       
                    // Ensure the correct font is specified.
                    self.options.context.font = self.options.label.font;

                    // Measure the width of a single space.
                    var dSpaceWidth = self.options.context.measureText(" ").width;

                    // Piece the label together, one word at a time and wrap.
                    var strLine = "";
                    for (var i = 0; i < arrayWords.length; i++) {
   
                        // Get the next word.
                        var strWord = arrayWords[i];
//                        if (!strWord) {
//   
//                            continue;
//                        }

                        // See if the next word needs to go on a
                        // new line and or simply update the cursor.
                        var sizeWord = self.options.context.measureText(strWord);
                        if (sizeWord.width + dLeft >= self.options.width) {

                            dLeft = 0;
                            if (strLine.length > 0) {
   
                                m_options.lines.push(strLine);
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
   
                        m_options.lines.push(strLine);
                    }

                    // Indicate preprocessed.
                    m_options.linesPreprocessed = true;

                    return null;
                } catch (e) {
       
                    return e;
                }
            };
       
            /////////////////////////////////
            // Private fields.
       
            var m_options = {
       
                linesPreprocessed: false,   // Indicates that the lines are pre-processed.
                lines: []                   // Collection of lines.
            };
        };

        // One-time injection.
        functionRet.inherits(RegionButton);

        // Return constructor function.
        return functionRet;
    });
