////////////////////////////////////////
// RegionComboList -- Clickable list for combos.
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/regions/Region"],
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
//                row0WidthWidth: 0,
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

                    // Test the event against the path for this instance.
                    if ($.isFunction(self.options.select)) {

                        // Figure out the item clicked.
                        var dIndex = Math.floor((e.offsetY - self.options.top - 3) / self.options.list.lineHeight);	// 3 was added in when drawing items
                        
                        // When user clicks on top-most list item, we just close the combo list.
                        if (dIndex === 0){
                        	
	                        self.options.select.call(this,
	                        		null);
	                        
                        } else {
       
	                        // For now, just for the heck of it, even though it's going to disappear in milliseconds,
	                        // select the item.
//	                        for (var i = 0; i < self.options.list.items.length; i++) {
//	       
//	                            self.options.list.items[i].selected = (i === dIndex);
//	                        }
//	       
//	                        self.render();
	       
	                        // Raise event.
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

            // Generate the boundary path.
            self.generatePath = function () {

                try {

                    // This is the trick to the non-clickable label--no path.
                    self.options.context.beginPath();
       
                    // The top item will be narrower than all the items below.
                    self.options.height = self.options.list.items.length * self.options.list.lineHeight + 10;	// 10 is for padding
       
                    self.options.context.moveTo(self.options.left,
                        self.options.top);

                    // The top of the list goes to just before the left edge of the combo button.
                    self.options.context.lineTo(self.options.page.options.wizard.options.comboButtonLeft - 3,
                            self.options.top);
                    self.options.context.lineTo(self.options.page.options.wizard.options.comboButtonLeft - 3,
                            self.options.top + self.options.list.lineHeight + 5);
                    
                    self.options.context.lineTo(self.options.left + self.options.width + 5,
                            self.options.top + self.options.list.lineHeight + 5);
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

                        // If this is the 0th item, then possibly ellipsize it and draw it in special text color.
                        // The rectangle for this list has already been specially constructed (above)
                        // to have a first row that just reaches the combo button.
                        if (i === 0) {
                        	
                        	var strEllText = self.options.page.options.wizard.fitStringToWidth(
                        			itemIth.text,
                        			self.options.context.font,
                        			self.options.page.options.wizard.options.comboButtonLeft - 10
                        	);
                        	self.options.context.fillStyle = self.convertColor(self.options.fill0thStyle);
                            
                            self.options.context.fillText(strEllText,
                                self.options.left + self.options.list.marginLeftRight,
                                self.options.top + self.options.list.lineHeight * i + 3);	// 3 is for padding

                        } else {

                        	// If this is a selected item, then highlight the background.
	                        if (itemIth.selected === true) {
	       
	                            self.options.context.fillStyle = self.convertColor(self.options.list.fillStyleSelection);
	                            self.options.context.fillRect(self.options.left,
	                                self.options.top + self.options.list.lineHeight * i + 2,	// padding and a little less
	                                self.options.width,
	                                self.options.list.lineHeight);
	                        }

	                        self.options.context.fillStyle = self.convertColor(self.options.list.fillStyle);
	                        
	                        self.options.context.fillText(itemIth.text,
	                            self.options.left + self.options.list.marginLeftRight,
	                            self.options.top + self.options.list.lineHeight * i + 3);	// 3 is for padding
                        }
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
