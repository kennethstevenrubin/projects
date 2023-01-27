////////////////////////////////////////
// RegionInput -- Input region.
//
// Return constructor function.

"use strict";

define(["../prototypes",
    "./Region"],
    function (prototypes,
        Region) {

        // Define constructor function.
        var functionRet = function RegionInput(optionsOverride) {

            var self = this;            // Uber closure.

            // Inherit from Region.
            self.inherits(Region, {

                hasFocus: false,
                height: 27,
                widthCalculationMultiplier: 0.65,
                value: "",
                blinkMS: 1000,          // Rate of blinking of zero-length cursor.
                change: null,           // Event raised when the value changes.
                border: {

                    enabled: true,       	// Add border.
                    strokeStyle: "#D1D1D1", // Style to render the border.
                    lineWidth: 2			// Overrides Region's 1.
                },
                fillStyleEnabled: "#faf3f3",  // White-ish pink for unselected text background.
                label: {

                    maximumCharacters: 20,
                    fillStyle: "#6D1B3E",				// medium purple for unselected text textcolor..
                    fillStyleSelection: "#6D1B3E",		// medium purple for selected text background.
                    fillStyleSelectedText: "#F0F0F0",	// white-ish for selected text textcolor.
                    font: "18px Arial",
                    lineHeight: 21,
                    widthGap: 8,
                    heightGap: 5
                }
            }.inject(optionsOverride));

            ////////////////////////////
            // Protected methods.

            // Generate the boundard path.
            // Do nothing in base class.
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
                        self.options.top + 2);

                    self.options.context.lineTo(self.options.left + self.options.width,
                        self.options.top + 2);

                    self.options.context.lineTo(self.options.left + self.options.width,
                        self.options.top + 2 + self.options.height);

                    self.options.context.lineTo(self.options.left,
                        self.options.top + 2 + self.options.height);

                    self.options.context.lineTo(self.options.left,
                        self.options.top + 2);

                    self.options.context.closePath();

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render the label text and selection cursor.
            self.renderInterior = function () {

                try {

                    // Set the font first.
                    self.options.context.textBaseline = "top";
                    self.options.context.textAlign = "left";
                    self.options.context.font = self.options.label.font;

                    // Do the selection next.
                    var strBefore = null;
                    var strDuring = null;
                    var strAfter = null;
                    var dStartOffset = 0;
                    var dLengthOffset = 0;
                    if (self.options.hasFocus &&
                        (m_bShowCursor ||
                            m_iSelectionLength !== 0)) {
       
                        // Invert the selection if already negative, but don't
                        // update object state as it would cause problems....
                        var iStart = m_iSelectionStart;
                        var iLength = m_iSelectionLength;
                        if (iLength < 0) {

                            iStart += iLength;
                            iLength *= -1;
                        }

                        // Figure out the position of the beginning and end of the selection.
                        strBefore = self.options.value.substr(0,
                            iStart);
                        strDuring = self.options.value.substr(iStart,
                            iLength);
                        strAfter = self.options.value.substr(iStart + iLength);

                        dStartOffset = self.options.context.measureText(strBefore).width;
                        dLengthOffset = self.options.context.measureText(strDuring).width;

                        // If selecting a select cell, then color differently to instruct the user.
                        self.options.context.fillStyle = self.convertColor(self.options.label.fillStyleSelection);
                        self.options.context.fillRect(self.options.left + self.options.label.widthGap + dStartOffset - 1,
                            self.options.top + 2 + self.options.label.heightGap - 1,
                            dLengthOffset + 2,
                            self.options.label.lineHeight);
                    }

                    // Now render the label.
                    self.options.context.fillStyle = self.convertColor(self.options.label.fillStyle);

                    // Render the text.
                    if (m_iSelectionLength == 0) {

                        self.options.context.fillText(self.options.value,
                            self.options.left + self.options.label.widthGap,
                            self.options.top + 2 + self.options.label.heightGap);
                    } else {

                        // Render the normal label.
                        self.options.context.fillText(strBefore,
                            self.options.left + self.options.label.widthGap,
                            self.options.top + 2 + self.options.label.heightGap);
                        self.options.context.fillText(strAfter,
                            self.options.left + self.options.label.widthGap + dStartOffset + dLengthOffset,
                            self.options.top + 2 + self.options.label.heightGap);

                        // Now render the selected label.
                        self.options.context.fillStyle = self.convertColor(self.options.label.fillStyleSelectedText);

                        self.options.context.fillText(strDuring,
                            self.options.left + self.options.label.widthGap + dStartOffset,
                            self.options.top + 2 + self.options.label.heightGap);
                    }
       
                    /* Last render the lines...debug selection click...
                    if (m_arrayInPlaceEditCellFormatOffsets) {
       
                        self.options.context.strokeStyle = "red";
                        for (var i = 0 ; i < m_arrayInPlaceEditCellFormatOffsets.length; i++) {
           
                            var iI = m_arrayInPlaceEditCellFormatOffsets[i];
                            self.options.context.beginPath();
                            self.options.context.moveTo(iI,
                                self.options.top);
                            self.options.context.lineTo(iI,
                                self.options.top + self.options.height);
                            self.options.context.stroke();
                        }
       
                        if (self.options.click) {
       
                            self.options.context.strokeStyle = "blue";
                            self.options.context.beginPath();
                            self.options.context.moveTo(self.options.click,
                                self.options.top);
                            self.options.context.lineTo(self.options.click,
                                self.options.top + self.options.height);
                            self.options.context.stroke();
       
                        }
                    }*/
                    return null;
                } catch (e) {

                    return e;
                }
            };
       
            // Process click event.
            // Activate.
            self.handleClick = function () {

                try {

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Process mouse move event to set the
            // selection length etc....  Return cursor.
            self.handleMouseMove = function (e) {

                try {

                    // If clicked in this region.
                    if (self.options.clickedDownInThisRegion) {

                        // Set the length.
                        var bSet = false;
                        for (var i = 0; i < m_arrayInPlaceEditCellFormatOffsets.length; i++) {

                            // Extract the offset.
                            var iIndex = m_arrayInPlaceEditCellFormatOffsets[i];

                            if (iIndex > e.offsetX) {

                                m_iSelectionLength = (i - m_iSelectionStart);
                                bSet = true;
                                break;
                            }
                        }

                        // Cover the end-of-string case.
                        if (bSet === false) {

                            m_iSelectionLength = (m_arrayInPlaceEditCellFormatOffsets.length - m_iSelectionStart);
                        }

                        // Render immediately.
                        return self.render();
                    }
                    return "text";
                } catch (e) {

                    return e;
                }
            };

            // Record mouse down, set the selection, and initialize dragging state.
            self.handleMouseDown = function (e) {

                try {

                    // Remember clicked in this region.
                    self.options.clickedDownInThisRegion = true;

                    // Get the formatted value from the cell.
                    var strFormattedCellValue = self.options.value;

                    // Calculate the offset to the start of the text.
                    var dWidthGap = self.options.label.widthGap;

                    // Set the width from the number of characters and the font.
                    self.options.context.textBaseline = "top";
                    self.options.context.textAlign = "left";
                    self.options.context.font = self.options.label.font;

                    // Figure out where all the characters are in the formatted text.
                    m_arrayInPlaceEditCellFormatOffsets = [];
                    for (var i = 0; i < strFormattedCellValue.length; i++) {

                        // Get the sub-string from the start of the string to the index being measured.
                        var strCumulative = strFormattedCellValue.substr(0, i);
                        // Also get just this character.
                        var strJustThisCharacter = strFormattedCellValue.substr(i, 1);

                        // Measure how many pixels from the beginning of the string to the character in question.
                        var iOffsetWidth = self.options.context.measureText(strCumulative).width;
                        var iJustThisWidth = self.options.context.measureText(strJustThisCharacter).width;

                        // Store the offset index.
                        m_arrayInPlaceEditCellFormatOffsets.push(iOffsetWidth + self.options.left + dWidthGap + iJustThisWidth / 2);
                    }

                    // And add in the entire string.
                    var iJustThisWidth = self.options.context.measureText(strFormattedCellValue[strFormattedCellValue.length - 1]).width;
                    m_arrayInPlaceEditCellFormatOffsets.push(self.options.context.measureText(strFormattedCellValue).width + self.options.left + dWidthGap + iJustThisWidth / 2);

                    // Set the starting selection.
                    var bSet = false;
                    for (var i = 0; i < m_arrayInPlaceEditCellFormatOffsets.length; i++) {

                        var iIndex = m_arrayInPlaceEditCellFormatOffsets[i];

                        if (iIndex > e.offsetX) {

                            m_iSelectionStart = i;
                            m_iSelectionLength = 0;
                            bSet = true;
                            break;
                        }
                    }

                    if (bSet === false) {

                        m_iSelectionStart = m_arrayInPlaceEditCellFormatOffsets.length - 1;
                        m_iSelectionLength = 0;
                    }

                    // Always want to show the cursor after a character is typed.
                    m_bShowCursor = true;

                    // Render now.
                    return self.render();
                } catch (e) {

                    return e;
                }
            };

            // Reset dragging state.
            self.handleMouseUp = function (e) {

                try {

                    // Revoked clicked in this region.
                    self.options.clickedDownInThisRegion = false;

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // handle the keypress, either backspace, delete, or normal keys.
            self.handleKeyPress = function (e) {

                try {

                    // Always want to show the cursor after a character is typed.
                    m_bShowCursor = true;

                    if (e.which >= " ".charCodeAt(0) &&
                        e.which <= "~".charCodeAt(0)) {

                        // Only update if length less than max.
                        if (self.options.value.length < self.options.label.maximumCharacters) {
       
                            // Fix up the selection length if negative.
                            if (m_iSelectionLength < 0) {

                                m_iSelectionStart += m_iSelectionLength;
                                m_iSelectionLength *= -1;
                            }

                            // Set the value to three parts: the range before the selection, the character typed and the part after the selection.
                            self.options.value = self.options.value.substr(0, m_iSelectionStart) +
                                String.fromCharCode(e.which) +
                                self.options.value.substr(m_iSelectionStart + m_iSelectionLength);
       
                            // Move the selection over one place and ensure narrow selection.
                            m_iSelectionStart++;
                            m_iSelectionLength = 0;
                        }
                    }
                    return self.render();
                } catch (e) {

                    return e;
                }
            };

            // Handle key-down to pre-process for tab and backspace keys.
            // Funnells other requests off to handleKeyPress to process.
            self.handleKeyDown = function (e) {

                try {

                    // Save this state.
                    var bShift = (e.shiftKey);
                    var bCtrl = (e.ctrlKey);

                    // Always want to show the cursor after a character is typed.
                    m_bShowCursor = true;

                    // Never change pages on a backspace and keep focus on tabs.
                    if (e.which === 8) {

                        // Fix up the selection length if negative.
                        if (m_iSelectionLength < 0) {

                            m_iSelectionStart += m_iSelectionLength;
                            m_iSelectionLength *= -1;
                        }

                        // If there is a selection to clear out, then do so.
                        if (m_iSelectionLength > 0) {

                            // Set the cell value to the un-selected ranges before and after the selection.
                            self.options.value = self.options.value.substr(0,
                                m_iSelectionStart) + self.options.value.substr(m_iSelectionStart + m_iSelectionLength);

                            // Reset the selection length after delete complete.
                            m_iSelectionLength = 0;
                        } else {

                            // Process normal overwriting backspace: erase the character just before the (narrow) selection start.
                            if (m_iSelectionStart > 0) {

                                // Set the cell value to the range before the selection - 1 and after the selection.
                                self.options.value = self.options.value.substr(0,
                                    m_iSelectionStart - 1) + self.options.value.substr(m_iSelectionStart);

                                // Move the selection back one place.
                                m_iSelectionStart--;
                            }
                        }

                        // Cause a render since this is a handled key.
                        e.preventDefault();
                        e.stopPropagation();
                        return self.render();
                    } else if (e.which === 46) {                      // Delete.
       
                        // Fix up the selection length if negative.
                        if (m_iSelectionLength < 0) {

                            m_iSelectionStart += m_iSelectionLength;
                            m_iSelectionLength *= -1;
                        }

                        // If there is a selection to clear out, then do so.
                        if (m_iSelectionLength > 0) {

                            // Set the cell value to the un-selected ranges before and after the selection.
                            self.options.value = self.options.value.substr(0,
                                m_iSelectionStart) + self.options.value.substr(m_iSelectionStart + m_iSelectionLength);

                            // Reset the selection length after delete complete.
                            m_iSelectionLength = 0;
                        }

                        // Cause a render since this is a handled key.
                        e.preventDefault();
                        e.stopPropagation();
                        return self.render();
                    } else if (e.which === 37) {                     // Left arrow.

                        // Always want to show the cursor after a character is typed.
                        m_bShowCursor = true;

                        // Resize the selection if shift.
                        if (bShift) {

                            // Don't allow stretch that can go before the first character.  
                            // But do, incidentally, allow negative lengths.
                            if (m_iSelectionStart + m_iSelectionLength > 0) {

                                m_iSelectionLength--;
                            }
                        } else {

                            // No shift means move the selection start.

                            // Fix up the selection length if negative.
                            if (m_iSelectionLength < 0) {

                                m_iSelectionStart += m_iSelectionLength;
                                m_iSelectionLength *= -1;
                            }

                            // Move the selection start if just a line (0 width).
                            if (m_iSelectionLength === 0) {

                                // Only allow move back if not at the first character.
                                if (m_iSelectionStart > 0) {

                                    m_iSelectionStart--;
                                }
                            } else {

                                // If the selection is wide, then make it narrow before moving selection.
                                m_iSelectionLength = 0;
                            }
                        }

                        // Cause a render since this is a handled key.
                        e.preventDefault();
                        e.stopPropagation();
                        return self.render();
                    } else if (e.which === 39) {              // Right arrow.

                        // Always want to show the cursor after a character is typed.
                        m_bShowCursor = true;

                        // Resize the selection if shift.
                        if (bShift) {

                            // Only allow resize to continue if not off the end of the string.
                            if (m_iSelectionStart + m_iSelectionLength < self.options.value.length) {

                                m_iSelectionLength++;
                            }
                        } else {

                            // No shift means move the selection start.

                            // Fix up the selection length if negative.
                            if (m_iSelectionLength < 0) {

                                m_iSelectionStart += m_iSelectionLength;
                                m_iSelectionLength *= -1;
                            }

                            // Only move the selection if narrow.
                            if (m_iSelectionLength === 0) {

                                // Only set the start if less than the end of the string.
                                if (m_iSelectionStart < self.options.value.length) {

                                    m_iSelectionStart++;
                                }
                            } else {

                                // Snap to the right and make narrow.
                                m_iSelectionStart += m_iSelectionLength;
                                m_iSelectionLength = 0;
                            }
                        }

                        // Cause a render since this is a handled key.
                        e.preventDefault();
                        e.stopPropagation();
                        return self.render();
                    } else if (e.which === " ".charCodeAt(0)) {
       
                        // Intercept the dredded space key!

                        // Call manually.
                        self.handleKeyPress(e);

                        // Stop browser from doing what it might other wise so--that is, scroll.
                        e.preventDefault();
                        e.stopPropagation();
                        return self.render();
                    }
                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Handle key up.
            self.handleKeyUp = function (e) {

                try {
       
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
       
                    // First, figure out the selection.
                    // It is based on the current value.
                    if (!self.options.value) {
       
                        // Selection start = 0.
                        m_iSelectionStart = 0;
       
                        // Selection length = 0.
                        m_iSelectionLength = 0;
                    } else if (self.options.value === "$") {
       
                        // Selection start = 1.
                        m_iSelectionStart = 1;
       
                        // Selection length = 0.
                        m_iSelectionLength = 0;
                    } else {
       
                        // Selection start = 0.
                        m_iSelectionStart = 0;
       
                        // Selection length = length of value.
                        m_iSelectionLength = self.options.value.length;
                    }
       
                    // If selection length = 0, then start the blink timer and set the blink state to show.
                    m_bShowCursor = true;
                    m_cookieBlinkTimer = setInterval(m_functionBlinkTimerTick,
                        self.options.blinkMS);

                    // Set the width from the number of characters and the font.
                    self.options.context.textBaseline = "top";
                    self.options.context.textAlign = "left";
                    self.options.context.font = self.options.label.font;

                    // Measure an "M", a.k.a.: an EM.
                    var sizeWord = self.options.context.measureText("M");
                    self.options.width = sizeWord.width * self.options.label.maximumCharacters * self.options.widthCalculationMultiplier;

                    return null;
                } catch (e) {

                    return e;
                }
            };
       
            // Method invoked to change blink state and cause re-draw.
            var m_functionBlinkTimerTick = function () {
       
                try {
       
                    // Invert the cursor.
                    if (m_bShowCursor) {
       
                        m_bShowCursor = false;
                    } else {
       
                        m_bShowCursor = true;
                    }

                    // Render out the control.  This is OK because this
                    var exceptionRet = self.render();
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }
                } catch(e) {
       
                    alert(e.message);
                }
            };

            ///////////////////////////////////
            // Private fields.
       
            // Indicates that the control has been previously initialized.
            // Any public methods that change fundamental characteristics
            // should reset this field so that the region state is reset.
            var m_bCreated = false;
            // Start of the selection.
            var m_iSelectionStart = -1;
            // Selection length.
            var m_iSelectionLength = 0;
            // Indicates that the cursor should be shown.
            var m_bShowCursor = true;
            // The blink timer cookie.
            var m_cookieBlinkTimer = null;
            // Collection of cell positions for mouse handling.
            var m_arrayInPlaceEditCellFormatOffsets = [];
            // Remember if the mouse was clicked down in this region.
            var m_bClickedDownInThisRegion = false;
        };

        // One-time injection.
        functionRet.inherits(Region);

        // Return constructor function.
        return functionRet;
    });

