////////////////////////////////////////
// RegionRLLabel -- Non-clickable label for user Response Line combo when closed.
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/regions/RegionLabel"],
    function (prototypes,
        RegionLabel) {

        // Define constructor function.
        var functionRet = function RegionRLLabel(optionsOverride) {

            var self = this;            // Uber closure.

            // Inherit from RegionLabel.
            self.inherits(RegionLabel, {
            	
                height: 28,
                value: "",
                enabled: true,
                fillStyleEnabled: "#FAF3F3",
            	border: {
            		
            		enabled: true,			// add border
                    strokeStyle: "#D1D1D1",
                    lineWidth: 2
            	},
                label: {

                    font: "18px Arial",
                    fillStyle: "#6D1B3E",
                    lineHeight: 21,
                    text: "",
                    widthGap: 8,
                    heightGap: 5
                },
                change: function () {
            		
            		try {
            			
            			// set label.text = value
            			this.label.text = this.value;
            			
            			// enable next pinched button
            			self.options.configuration.nextBtn.instance.options.enabled = true;
            			
            		} catch (e) {
              
                        alert(e.message);
                    }
            	}           // Event raised when the value changes.

            }.inject(optionsOverride));

            // Generate the boundard path.
            self.generatePath = function () {

                try {

                    // Render the bounding path.
                    self.options.context.beginPath();

                    self.options.context.moveTo(self.options.left,
                        self.options.top - 1);

                    self.options.context.lineTo(self.options.left + self.options.width,
                        self.options.top - 1);

                    self.options.context.lineTo(self.options.left + self.options.width,
                        self.options.top - 1 + self.options.height);

                    self.options.context.lineTo(self.options.left,
                        self.options.top - 1 + self.options.height);

                    self.options.context.lineTo(self.options.left,
                        self.options.top - 1);

                    self.options.context.closePath();

                    return null;
                } catch (e) {

                    return e;
                }
            };
       
            // Process mouse move event.
            // Return "pointer" cursor.
            self.handleMouseMove = function () {

                try {

                    return "deafult";
                } catch (e) {

                    return e;
                }
            };

            // Render out label.
            self.renderInterior = function () {
       
                try {
       
                    // Set the font first.
                    self.options.context.textBaseline = "top";
                    self.options.context.textAlign = "left";
                    self.options.context.font = self.options.label.font;

                    // Color.
                    self.options.context.fillStyle = self.convertColor(self.options.label.fillStyle);

                    // Draw the text.
                    self.options.context.fillText(self.options.label.text,
                        self.options.left + self.options.label.widthGap,
                        self.options.top + self.options.label.heightGap);

                    return null;
                } catch (e) {
       
                    return e;
                }
            };
        };

        // One-time injection.
        functionRet.inherits(RegionLabel);

        // Return constructor function.
        return functionRet;
    });
