////////////////////////////////////////
// RegionComboRLList -- Clickable list used only in PageComboRLPopup to serve the drop list 
// for the User Response Line combo button.
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/regions/Region"],
    function (prototypes,
        Region) {

        // Define constructor function.
        var functionRet = function RegionComboRLList(optionsOverride) {

            var self = this;            // Uber closure.

            // Inherit from Region.
            self.inherits(Region, {

                select: null,           // Selection event callback.
                width: 300,
                fillStyleEnabled: "#faf3f3",
                fillStyleDisabled: "#808080",
                haveSelection: "",
                list: {
                
                    items: [],          // Collection of items.  Set selected property to show as selected.
                    fillStyle: "#666666",
                    font: "18px Arial",
                    lineHeight: 24,
                    fillStyleSelection: "#EBB8B9",
                    marginLeftRight: 5,
                    marginTop: 2
                }
            }.inject(optionsOverride));

            ////////////////////////////
            // Protected methods.

            // Process click event.
            // Do nothing in base class.
            self.handleClick = function (e) {

                try {

                    // Test the event against the path for this instance.
                    if ($.isFunction(self.options.select)) {
                    	
                        // Figure out the item clicked.
                        var dIndex = Math.floor((e.offsetY - self.options.top) / self.options.list.lineHeight);

                        // For now, just for the heck of it, even though it's
                        // going to disappear in milliseconds, select the item.
//                        for (var i = 0; i < self.options.list.items.length; i++) {
//       
//                            self.options.list.items[i].selected = (i === dIndex);
//                        }
//       
//                        self.render();
       
                        // Raise event.
                        if ($.isFunction(self.options.select)) {
	       
                            self.options.select.call(this,
                                self.options.list.items[dIndex]);
                        }
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Process mouse move event.
            // Return "hand" cursor.
            self.handleMouseMove = function () {

                try {

                    return "pointer";
                } catch (e) {

                    return e;
                }
            };

            // Generate the boundard path.
            self.generatePath = function () {

                try {

                    // This is the trick to the non-clickable label--no path.
                    self.options.context.beginPath();
       
                    var dHeight = self.options.list.items.length * self.options.list.lineHeight;
                    self.options.height = dHeight;
       
                    self.options.context.moveTo(self.options.left,
                        self.options.top);
                    self.options.context.lineTo(self.options.left + self.options.width,
                        self.options.top);
                    self.options.context.lineTo(self.options.left + self.options.width,
                        self.options.top + dHeight);
                    self.options.context.lineTo(self.options.left,
                        self.options.top + dHeight);
       
                    self.options.context.closePath();

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render the interior of the "button".
            self.renderInterior = function () {

                try {

                    // Render item text.
                    self.options.context.fillStyle = self.convertColor(self.options.list.fillStyle);
                    self.options.context.font = self.options.list.font;
                    self.options.context.textBaseline = "top";
                    self.options.context.textAlign = "left";
                    
                    var extraLineHeight = 0;
                    
                    for (var i = 0; i < self.options.list.items.length; i++) {
       
                        // Get the ith item.
                        var itemIth = self.options.list.items[i];
                        if (!itemIth) {
       
                            continue;
                        }

                       	// If this is a selected item, then highlight the background.
                        if (itemIth.text === self.options.haveSelection) {
	       
                            self.options.context.fillStyle = self.convertColor(self.options.list.fillStyleSelection);
                            self.options.context.fillRect(self.options.left,
                                self.options.top + self.options.list.lineHeight * i + extraLineHeight,
                                self.options.width,
                                self.options.list.lineHeight);
                            self.options.context.fillStyle = self.convertColor(self.options.list.fillStyle);
                        }
       
                        self.options.context.fillText(itemIth.text,
                            self.options.left + self.options.list.marginLeftRight,
                            self.options.top + self.options.list.lineHeight * i + self.options.list.marginTop + extraLineHeight);
                    }

                    return null;
                
                } catch (e) {

                    return e;
                }
            };
        };

        // One-time injection.
        functionRet.inherits(Region);

        // Return constructor function.
        return functionRet;
    });
