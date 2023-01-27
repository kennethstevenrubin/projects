////////////////////////////////////////
// RegionComboList -- Clickable list for combos.
//
// Return constructor function.

"use strict";

define(["../prototypes",
    "./Region"],
    function (prototypes,
        Region) {

        // Define constructor function.
        var functionRet = function RegionComboList(optionsOverride) {

            var self = this;            // Uber closure.

            // Inherit from Region.
            self.inherits(Region, {

                select: null,           // Selection event callback.
                width: 300,
                fillStyleEnabled: "#ffffff",
                fillStyleDisabled: "#808080",
                list: {
                
                    items: [],          // Collection of items.  Set selected property to show as selected.
                    fillStyle: "#000000",
                    font: "18px Helvetica",
                    lineHeight: 26,
                    fillStyleSelection: "#EBB8B9",
                    marginLeftRight: 15
                }
            }.inject(optionsOverride));

            ////////////////////////////
            // Protected methods.

            // Process click event.
            // Do nothing in base class.
            self.handleClick = function (e) {

                try {

                    // If select is wired...
                    if ($.isFunction(self.options.select)) {

                        // ...figure out the item clicked.
                        var dIndex = Math.floor((e.offsetY - self.options.top) / self.options.list.lineHeight);
                        
                        // Raise event.
                        self.options.select.call(this,
                            self.options.list.items[dIndex]);
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

            // Generate the boundary path.
            self.generatePath = function () {

                try {

                    // Start it off.
                    self.options.context.beginPath();
       
                    // Draw a rectangle....
                    self.options.height = self.options.list.items.length * self.options.list.lineHeight;
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

            // Render the interior of the "list".
            self.renderInterior = function () {

                try {

                    // Render item text.
                    self.options.context.fillStyle = self.convertColor(self.options.list.fillStyle);
                    self.options.context.font = self.options.list.font;
                    self.options.context.textBaseline = "top";
                    self.options.context.textAlign = "left";
                    
                    for (var i = 0; i < self.options.list.items.length; i++) {
       
                        // Get the ith item.
                        var itemIth = self.options.list.items[i];
                        if (!itemIth) {
       
                            continue;
                        }

                    	// If this is a selected item, then highlight the background.
                        if (itemIth.selected === true) {
       
                            self.options.context.fillStyle = self.convertColor(self.options.list.fillStyleSelection);
                            self.options.context.fillRect(self.options.left,
                                self.options.top + self.options.list.lineHeight * i,
                                self.options.width,
                                self.options.list.lineHeight);
                        }

                        self.options.context.fillStyle = self.convertColor(self.options.list.fillStyle);
                        
                        self.options.context.fillText(itemIth.text,
                            self.options.left + self.options.list.marginLeftRight,
                            self.options.top + self.options.list.lineHeight * i);
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
