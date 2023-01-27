////////////////////////////////////////
// RegionCombo -- Combo control.
//
// Return constructor function.
// 

"use strict";

define(["../prototypes",
    "./RegionLabel",
    "./RegionButtonCombo",
    "./RegionComboList"],
    function (prototypes,
        RegionLabel,
        RegionButtonCombo,
        RegionComboList) {

        // Define constructor function.
        var functionRet = function RegionCombo(optionsOverride) {

            var self = this;            // Uber closure.

            // Inherit from RegionButton.
            self.inherits(Region, {

                top: 32,
                left: 200,
                width: 100,
                height: 30,
                enabled: true,
                open: false,
                opacity: 1
            }.inject(optionsOverride));

            ////////////////////////////
            // Protected methods.

            // Generate the boundard path.
            self.generatePath = function () {

                try {

                    // If not created...no time like the present to do so....
                    if (!m_bCreated) {

                        // Perform one-time creation.
                        var exceptionRet = m_functionCreate();
                        if (exceptionRet !== null) {
       
                            return exceptionRet;
                        }
                    }

                    // Render the bounding path.
                    self.options.context.beginPath();

                    self.options.context.moveTo(self.options.left,
                        self.options.top);
                    self.options.context.lineTo(self.options.left + self.options.width,
                        self.options.top);
                    self.options.context.lineTo(self.options.left + self.options.width,
                        self.options.top + self.options.width);
                    self.options.context.lineTo(self.options.left,
                        self.options.top + self.options.width);

                    self.options.context.closePath();

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ///////////////////////////////////
            // Private methods.

            // Perform one-time creation functions.
            var m_functionCreate = function () {
       
                try {

                    // Success or failure, do not re-enter this method again.
                    m_bCreated = true;

                    // Add the combo button.
                    var rbc = new RegionButtonCombo({

                        left:100,
                        top:10,
                        click: function () {

                            alert("drop down");
                        }
                    });
                    var exceptionRet = self.addRegion(rbc);
                    if (exceptionRet) {

                        throw exceptionRet;
                    }

                    // Add the label.
                    var rl = new RegionLabel({

                        left:10,
                        top:10
                    });
                    exceptionRet = self.addRegion(rl);
                    if (exceptionRet) {

                        throw exceptionRet;
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ///////////////////////////////////
            // Private fields.
       
            // Indicates that the control has been previously initialized.
            var m_bCreated = false;
        };

        // One-time injection.
        functionRet.inherits(Region);

        // Return constructor function.
        return functionRet;
    });
