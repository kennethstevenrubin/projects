////////////////////////////////////////
// TreeGrid is a tree with columns, 
// or a grid with hierarchy--whichever!
//
// Returns function constructor.

"use strict";

define([],
    function () {

        // Define constructor function which creates a TreeGrid.
        var functionConstructor = function TreeGrid(optionsOverride) {

            var self = this;            // Uber closure.

            // Define options for object.
            self.options = {

                data: {},               // Raw data.
                uIDs: [],               // Filtered collection of UIDS of each compoennt row.
                masterUIDs: [],         // Unfiltered collection of UIDS of each compoennt row.
                visibleRows: {},        // Collection of visible rows and cells used for change highlighting.
                updateFrequency: 250,   // Render update frequency in MS.
                width: 0,               // Width of control.
                height: 0,              // Height of control.
                virtualWidth: 0,        // Total width of control (irrespective of window size).
                virtualHeight: 0,       // Total height of control (irrespective of window size).
                scrollOffsetLeft: 0,    // How far the control is scrolled horizontally.
                scrollOffsetTop: 0,     // How far the control is scrolled vertically.
                parent: null,           // Parent DOM element.
                canvas: null,           // The output drawing canvas--child DOM element.
                context: null,          // Context with which to render against the canvas.
                canvasBackground: null, // Working canvas, used to initially render, then copied to canvas.
                contextBackground: null,// Context for rendering to the working canvas.
                firstVisibleColumn: -1, // First visible column.
                lastVisibleColumn: -1,  // Last visible column.
                verticalDraggable: null,// Component which helps with vertical dragging.
                horizontalDraggable: null,// Component which helps with vertical dragging.
                renderTimerCookie: null,// Cookie from rendering.
                numberOfOpenRows: 0,    // Number of open rows.
                renderCursor: 0,        // Cursor maintained during rendering.
                selectedRow: null,      // The current selection.
                style: {

                    background: "#FFF", // Background color of control, column headers and detail rows.
                    cellHighlightMS: 1000,// Number of MS to wait before resetting the cell change highlight state.
                    tickColor: "red",   // Color of cell text for up tick.
                    total: true,        // Indicates the total row is visible.
                    filter: true,       // Indicates the filter row is visible.
                    totalColumnHeaderHeight: 0,// Height of the column header.
                    rowHighlight: {

                        start: {

                            red: 200,
                            green: 203,
                            blue: 206
                        },
                        end: {

                            red: 255,
                            green: 255,
                            blue: 255
                        }
                    },                  // Defines the color range for the background color of grouping rows.
                    scrollBar: {

                        backgroundThumb: "#999",
                        highlightThumb: "#ded",
                        shadowThumb: "#888",
                        background: "white",
                        backgroundStripe: "rgb(41,64,89)",
                        backgroundHighlightStripe: "rgb(143,52,2)",
                        backgroundThumbCenter: "rgb(255,88,0)",
                        widthStripeIndent: 5.5,
                        widthThumbHole: 2,
                        horizontalScrollBar_PixelsPerPixel: 0,
                        widthHighlightStripeIndent: 6.5,
                        colorThumb: "#000",
                        colorHighlight: "#888",
                        padding: 5,
                        paddingThumb: 1.5,
                        minimumThumbExtent: 10,
                        renderOutline: false,
                        outlineColor: "rgb(255,255,255)"
                    },                  // Scroll bar styles.
                    columnSeparatorColor: "#666",// Color of line which separates columns.
                    columnHeaderTextColor: "#888",// Color of text in column header.
                    openCloseGlyphStroke: "#222",// Color of the line of the open-close glyph.
                    openCloseGlyphFill: "#F88",// Color of the fill of the open-close glyph.
                    textColor: "rgb(60,78,98)",  // Color of the text.
                    font: "12px Arial", // Font with which to render both column headers and content.
                    rowHeight: 16,      // Height of a single row of data or column header.
                    groupingOffset: 20, // Room reserved for the grouping open/close glyph.
                    groupingWidth: 20,  // Width of the grouping glyph region.
                    groupingLeftPadding: 2,// Padding for left of glyph, relative to cell position.
                    groupingHeight: 16, // Height of the grouping glyph region.
                    scrollBarWidth: 16, // Width of vertical scroll bar.
                    scrollBarHeight: 16, // Height of horizontal scroll bar.
                    verticalCellOffset: 0,// Center cell text.
                    horizontalCellOffset: 5// Cell padding.
                },                      // Holds all style and color related aspects.
                host: {

                    id: "#TreeGrid"
                },                      // Host selection specification.
                columns: [

                ],                      // Collection of columns.
                groupingIndicies: [

                ],                      // Collection of column indicies used to group rows--in order.
                summingIndicies: [

                ],                      // Collection of column indicies used to sum rows--in order.
                allOrNoneIndicies: [

                ],                      // Collection of column indicies used for all-or-none rows--in order.
                dirty: {

                    virtualHeight: true,
                    layout: true,
                    columnHeaders: true,
                    content: true
                },                      // Dirty state--used by render to determine which section must be updated.
                rectangles: {

                    columnHeaders: null,
                    content: null,
                    horizontalScrollBar: null,
                    verticalScrollBar: null,
                    nullTopRight: null,
                    nullBottomRight: null
                },                      // Locations of the sub-components of the control.
                visible: {

                    horizontalScrollBar: false,
                    verticalScrollBar: false,
                    nullTopRight: false,
                    nullBottomRight: false
                },                      // Indicates which sub-components are visible.
                openCloseRegions: [],   // Maintain a collection of regions which open or close groups when clicked.
                rowRegions: []          // Maintain a collection of regions for painted rows.
            };

            // Inject overridden values into the self.options object.
            self.options.inject(optionsOverride);

            ////////////////////////////
            // Public methods

            // Initialize this control.
            self.create = function () {

                try {

                    // Wire parent.
                    self.options.parent = $(self.options.host.id);

                    // Extract size from styled host.
                    self.options.width = self.options.parent.width();
                    self.options.height = self.options.parent.height();

                    // Create the render canvas.
                    self.options.canvas = document.createElement("canvas");
                    self.options.canvas.id = "Render" + Math.random().toString();
                    self.options.canvas.width = self.options.width;
                    self.options.canvas.height = self.options.height;
                    self.options.canvas.style.background = self.options.style.background;
                    self.options.context = self.options.canvas.getContext("2d");
                    $(self.options.parent).append(self.options.canvas);

                    // Create the background canvas.
                    self.options.canvasBackground = document.createElement("canvas");
                    self.options.canvasBackground.id = "Background" + Math.random().toString();
                    self.options.canvasBackground.width = self.options.width;
                    self.options.canvasBackground.height = self.options.height;
                    self.options.canvasBackground.style.background = self.options.style.background;
                    self.options.contextBackground = self.options.canvasBackground.getContext("2d");

                    // Pre-process column collection.
                    var exceptionRet = m_functionPreprocessColumns();
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Create the horizontal draggable element.
                    exceptionRet = m_functionCreateHorizontalDragElement();
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Create the vertical draggable element.
                    exceptionRet = m_functionCreateVerticalDragElement();
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Wire up the mousehandler.
                    $(self.options.canvas).mouseup(m_functionOnMouseUp);
                    // Wire window resize.
                    $(window).resize(function () {

                        // Cause layout to be recalculated and also, components to be re-drawn.
                        self.options.dirty.layout = true;

                        // Update display immediately.
                        m_functionRender();
                    });
                    // Wire up the mouse wheel to scroll.
                    self.options.canvas.onmousewheel = m_functionOnMouseWheel;

                    // Start the lazy render thread.
                    setInterval(m_functionRender,
                        self.options.updateFrequency);

                    // Also perform first render immediately.
                    return m_functionRender();
                } catch (e) {

                    return e;
                }
            };

            // Method merges the array of rows into data.
            self.mergeRows = function (arrayRows) {

                try {

                    // Loop over all rows.
                    for (var i = 0; i < arrayRows.length; i++) {

                        // Get the ith row.
                        var rowIth = arrayRows[i];
                        if (!rowIth) {

                            continue;
                        }

                        // Merge the row.
                        var exceptionRet = m_functionMergeRow(rowIth);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }

                        // Always add to master list (overwrite on edit, but it doesn't matter).
                        self.options.masterUIDs[rowIth[self.options.uIDColumnIndex].value] = rowIth;
                    }

                    // All or nones have to be updated after merging rows.
                    var exceptionRet = m_functionPostProcessAllOrNones();
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // If totalling, then total.
                    if (self.options.style.total) {

                        // Just pass over the top-level, total up aggregate values.
                        exceptionRet = m_functionTotal();
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                    }

                    // Rebuild the content.
                    self.options.dirty.virtualHeight = true;

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Set the filter.  Process all rows presumedly with a new filter?.
            self.reprocessRows = function () {

                try {

                    // Clear out existing data.
                    self.options.data = {};
                    self.options.uIDs = [];
                    self.options.visibleRows = {};

                    // Reprocess from master list.
                    var arrayRows = [];
                    var arrayMasterKeys = Object.keys(self.options.masterUIDs);
                    for (var i = 0; i < arrayMasterKeys.length; i++) {

                        arrayRows.push(self.options.masterUIDs[arrayMasterKeys[i]]);
                    }
                    return self.mergeRows(arrayRows);
                } catch (e) {

                    return e;
                }
            };

            // Method merges the array of rows into data.
            self.spliceRows = function (arrayRows) {

                try {

                    // Loop over all rows.
                    for (var i = 0; i < arrayRows.length; i++) {

                        // Get the ith row.
                        var rowIth = arrayRows[i];
                        if (!rowIth) {

                            continue;
                        }

                        // Ungroup the row.
                        var exceptionRet = m_functionUngroupRow(rowIth);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }

                        // Always remove from master list.
                        delete self.options.masterUIDs[rowIth[self.options.uIDColumnIndex].value];
                    }

                    // All-or-nones have to be updated after ungrouping rows.
                    var exceptionRet = m_functionPostProcessAllOrNones();
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // If totalling, then total.
                    if (self.options.style.total) {

                        // Just pass over the top-level, total up aggregate values.
                        exceptionRet = m_functionTotal();
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                    }

                    // Rebuild the content.
                    self.options.dirty.virtualHeight = true;

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////
            // Private methods

            // Compute the locations of the various regions used by this module.
            var m_functionCalculateLayout = function () {

                try {

                    // Extract size from styled host.
                    self.options.width = self.options.parent.width();
                    self.options.height = self.options.parent.height();

                    // Update the render canvas size.
                    if (self.options.canvas.width !== self.options.width ||
                        self.options.canvas.height !== self.options.height) {

                        self.options.canvas.width = self.options.width;
                        self.options.canvas.height = self.options.height;
                        self.options.context = self.options.canvas.getContext("2d");
                    }

                    // For now, just row height, possibly, this will change with filtering or sorting.
                    self.options.style.totalColumnHeaderHeight = (1 +
                        (self.options.style.total ? 1 : 0) +
                        (self.options.style.filter ? 1 : 0)) *
                        self.options.style.rowHeight;

                    // Four cases, some with mild recursive tendencies.
                    var dWorkHeight = self.options.height - self.options.style.totalColumnHeaderHeight;
                    var dWorkWidth = self.options.width;

                    if (dWorkWidth >= self.options.virtualWidth &&
                        dWorkHeight >= self.options.virtualHeight) {

                        // Safely inside bounds.  No scroll bars.
                        self.options.visible.horizontalScrollBar = false;
                        self.options.visible.verticalScrollBar = false;

                    } else if (dWorkWidth < self.options.virtualWidth &&
                        dWorkHeight >= self.options.virtualHeight) {

                        // Horizontal must be turned on.
                        self.options.visible.horizontalScrollBar = true;

                        // Now re-check vertical:
                        if (dWorkHeight - self.options.style.scrollBarHeight >= self.options.virtualHeight) {

                            self.options.visible.verticalScrollBar = false;
                        } else {

                            self.options.visible.verticalScrollBar = true;
                        }
                    } else if (dWorkWidth >= self.options.virtualWidth &&
                        dWorkHeight < self.options.virtualHeight) {

                        // Vertical must be turned on.
                        self.options.visible.verticalScrollBar = true;

                        // Now re-check horizontal:
                        if (dWorkWidth - self.options.style.scrollBarWidth >= self.options.virtualWidth) {

                            self.options.visible.horizontalScrollBar = false;
                        } else {

                            self.options.visible.horizontalScrollBar = true;
                        }
                    } else {

                        // Both scroll bars must be turned on.
                        self.options.visible.horizontalScrollBar = true;
                        self.options.visible.verticalScrollBar = true;
                    }

                    // There are four possible results:
                    if (self.options.visible.horizontalScrollBar &&
                        self.options.visible.verticalScrollBar) {

                        // Both null regions also visible.
                        self.options.visible.nullTopRight = true;
                        self.options.visible.nullBottomRight = true;

                        // All regions visible.
                        self.options.rectangles.columnHeaders = {

                            left: 0,
                            top: 0,
                            width: self.options.width - self.options.style.scrollBarWidth,
                            height: self.options.style.totalColumnHeaderHeight
                        };
                        self.options.rectangles.content = {

                            left: 0,
                            top: self.options.style.totalColumnHeaderHeight,
                            width: self.options.width - self.options.style.scrollBarWidth,
                            height: self.options.height - self.options.style.rowHeight - self.options.style.scrollBarHeight
                        };
                        self.options.rectangles.nullTopRight = {

                            left: self.options.width - self.options.style.scrollBarWidth,
                            top: 0,
                            width: self.options.style.scrollBarWidth,
                            height: self.options.style.totalColumnHeaderHeight
                        };
                        self.options.rectangles.nullBottomRight = {

                            left: self.options.width - self.options.style.scrollBarWidth,
                            top: self.options.height - self.options.style.scrollBarHeight,
                            width: self.options.style.scrollBarWidth,
                            height: self.options.style.scrollBarHeight
                        };
                        self.options.rectangles.verticalScrollBar = {

                            left: self.options.width - self.options.style.scrollBarWidth,
                            top: self.options.style.totalColumnHeaderHeight,
                            width: self.options.style.scrollBarWidth,
                            height: self.options.height - self.options.style.totalColumnHeaderHeight - self.options.style.scrollBarHeight
                        };
                        self.options.rectangles.horizontalScrollBar = {

                            left: 0,
                            top: self.options.height - self.options.style.scrollBarHeight,
                            width: self.options.width - self.options.style.scrollBarWidth,
                            height: self.options.style.scrollBarHeight
                        };
                    } else if (self.options.visible.horizontalScrollBar) {

                        // Neither null region is visible.
                        self.options.visible.nullTopRight = false;
                        self.options.visible.nullBottomRight = false;

                        // Column headers, content, and horizontal scroll bar are visible.  
                        self.options.rectangles.columnHeaders = {

                            left: 0,
                            top: 0,
                            width: self.options.width,
                            height: self.options.style.totalColumnHeaderHeight
                        };
                        self.options.rectangles.content = {

                            left: 0,
                            top: self.options.style.totalColumnHeaderHeight,
                            width: self.options.width,
                            height: self.options.height - self.options.style.totalColumnHeaderHeight - self.options.style.scrollBarHeight
                        };
                        self.options.rectangles.horizontalScrollBar = {

                            left: 0,
                            top: self.options.height - self.options.style.scrollBarHeight,
                            width: self.options.width,
                            height: self.options.style.scrollBarHeight
                        };
                    } else if (self.options.visible.verticalScrollBar) {

                        // Top null region is visible.
                        self.options.visible.nullTopRight = true;
                        self.options.visible.nullBottomRight = false;

                        // Column headers, content, nullTopRight and vertical scroll bar are visible.  
                        self.options.rectangles.columnHeaders = {

                            left: 0,
                            top: 0,
                            width: self.options.width - self.options.style.scrollBarWidth,
                            height: self.options.style.totalColumnHeaderHeight
                        };
                        self.options.rectangles.content = {

                            left: 0,
                            top: self.options.style.totalColumnHeaderHeight,
                            width: self.options.width - self.options.style.scrollBarWidth,
                            height: self.options.height - self.options.style.totalColumnHeaderHeight
                        };
                        self.options.rectangles.nullTopRight = {

                            left: self.options.width - self.options.style.scrollBarWidth,
                            top: 0,
                            width: self.options.style.scrollBarWidth,
                            height: self.options.style.totalColumnHeaderHeight
                        };
                        self.options.rectangles.verticalScrollBar = {

                            left: self.options.width - self.options.style.scrollBarWidth,
                            top: self.options.style.totalColumnHeaderHeight,
                            width: self.options.style.scrollBarWidth,
                            height: self.options.height - self.options.style.totalColumnHeaderHeight
                        };
                    } else { // Neither is visible.

                        // Neither null region is visible.
                        self.options.visible.nullTopRight = false;
                        self.options.visible.nullBottomRight = false;

                        // Only column headers and content are visible.  
                        self.options.rectangles.columnHeaders = {

                            left: 0,
                            top: 0,
                            width: self.options.width,
                            height: self.options.style.totalColumnHeaderHeight
                        };
                        self.options.rectangles.content = {

                            left: 0,
                            top: self.options.style.totalColumnHeaderHeight,
                            width: self.options.width,
                            height: self.options.height - self.options.style.totalColumnHeaderHeight
                        };
                    }

                    // Update the background canvas size to the size of the content.
                    if (self.options.canvasBackground.width !== self.options.rectangles.content.width ||
                        self.options.canvasBackground.height !== self.options.rectangles.content.height) {

                        self.options.canvasBackground.width = self.options.rectangles.content.width;
                        self.options.canvasBackground.height = self.options.rectangles.content.height;
                        self.options.contextBackground = self.options.canvasBackground.getContext("2d");
                    }

                    // Move the horizontal scroller into position.
                    if (self.options.visible.horizontalScrollBar) {

                        $(self.options.horizontalDraggable).css({

                            left: self.options.rectangles.horizontalScrollBar.left + "px",
                            top: self.options.rectangles.horizontalScrollBar.top + "px",
                            width: self.options.rectangles.horizontalScrollBar.width + "px",
                            height: self.options.rectangles.horizontalScrollBar.height + "px"
                        });
                    } else {

                        $(self.options.horizontalDraggable).css({

                            left: "0px",
                            top: "0px",
                            width: "0px",
                            height: "0px"
                        });
                    }

                    // Move the vertical scroller into position.
                    if (self.options.visible.verticalScrollBar) {

                        $(self.options.verticalDraggable).css({

                            left: self.options.rectangles.verticalScrollBar.left + "px",
                            top: self.options.rectangles.verticalScrollBar.top + "px",
                            width: self.options.rectangles.verticalScrollBar.width + "px",
                            height: self.options.rectangles.verticalScrollBar.height + "px"
                        });
                    } else {

                        $(self.options.verticalDraggable).css({

                            left: "0px",
                            top: "0px",
                            width: "0px",
                            height: "0px"
                        });
                    }

                    // Possibly fix up the self.options.scrollOffsetLeft value.
                    if (self.options.virtualWidth > self.options.rectangles.columnHeaders.width) {

                        if (self.options.rectangles.columnHeaders.width + self.options.scrollOffsetLeft > self.options.virtualWidth) {

                            self.options.scrollOffsetLeft = self.options.virtualWidth - self.options.rectangles.columnHeaders.width;
                        }
                    } else {

                        if (self.options.rectangles.columnHeaders.width > self.options.virtualWidth + self.options.scrollOffsetLeft) {

                            self.options.scrollOffsetLeft = 0;
                        }
                    }

                    // Possibly fix up the self.options.scrollOffsetTop value too.
                    if (self.options.virtualHeight > self.options.rectangles.content.height) {

                        if (self.options.rectangles.content.height + self.options.scrollOffsetTop > self.options.virtualHeight) {

                            self.options.scrollOffsetTop = self.options.virtualHeight - self.options.rectangles.content.height;
                        }
                    } else {

                        if (self.options.rectangles.content.height > self.options.virtualHeight + self.options.scrollOffsetTop) {

                            self.options.scrollOffsetTop = 0;
                        }
                    }

                    // Set everything dirty, some components might not be 
                    // updated because they are invisible, c'est la vie.
                    self.options.dirty.columnHeaders = true;
                    self.options.dirty.content = true;
                    self.options.dirty.horizontalScrollBar = true;
                    self.options.dirty.verticalScrollBar = true;
                    self.options.dirty.nullBottomRight = true;
                    self.options.dirty.nullTopRight = true;

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Helper method to calculate the virtual height of the control 
            var m_functionCalculateVirtualHeight = function () {

                try {

                    // Compute the number of open rows.
                    self.options.numberOfOpenRows = m_functionCountVisibleRows(self.options);

                    // Now compute the virtual size of the control.
                    self.options.virtualHeight = self.options.numberOfOpenRows *
                        self.options.style.rowHeight;

                    // Recaculate layout with this new knowledge.
                    self.options.dirty.layout = true;

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Filter the data into the view.
            var m_functionCountVisibleRows = function (objectGroupingCollection) {

                // This is the accumulator.
                var iCount = 0;

                // Define the "process queue".  This is the unwind container. It enables recurisve reduction to linear refeeding.
                var arrayProcess = [objectGroupingCollection.data];

                // Loop while there are items to process.
                while (arrayProcess.length > 0) {

                    // Remove the next item.
                    var data = arrayProcess.pop()

                    // Determine if at lowest level....
                    if (Array.isArray(data)) {

                        // Account for all elements of the array.
                        iCount += data.length;
                    } else {

                        // Loop over all children of the data property of the specified grouping collection.
                        var arrayKeys = Object.keys(data);
                        for (var i = 0; i < arrayKeys.length; i++) {

                            // Account for this element.
                            iCount++;

                            // Get the value.
                            var objectValue = data[arrayKeys[i]];
                            if (objectValue.meta.open === true) {

                                // Add this, and a whole bunch of other children.
                                //  This is the render unwind step.
                                arrayProcess.push(objectValue.data);
                            }
                        }
                    }
                }

                // Just return the compiles number.
                return iCount;
            };

            // Allocate and initialze the overlay element that helps with horizontal dragging.
            var m_functionCreateHorizontalDragElement = function () {

                try {

                    // Create the Horizontal draggable element.
                    self.options.horizontalDraggable = document.createElement("div");
                    $(self.options.horizontalDraggable).css({

                        position: "absolute",
                        left: "0px",
                        top: "0px",
                        width: "0px",
                        height: "0px",
                        "z-index": 100,
                        background: "rgba(255, 255, 255, 0.00001)"
                    });

                    // Add to DOM.
                    $(self.options.parent).append(self.options.horizontalDraggable);

                    // Define some closures....
                    var dStartLeft;
                    var dInitializeScrollOffsetLeft;

                    // Make it a draggable.
                    $(self.options.horizontalDraggable).draggable({
                        start: function (evt, ui) {

                            var dLeft = (evt.pageX - $(self.options.horizontalDraggable).offset().left) + $(window).scrollLeft();

                            dStartLeft = dLeft;
                            dInitializeScrollOffsetLeft = self.options.scrollOffsetLeft;
                        },
                        drag: function (evt, ui) {

                            // Get the new position of the mouse.
                            var dLeft = (evt.pageX - $(self.options.horizontalDraggable).offset().left) + $(window).scrollLeft();

                            // Figure out how for the cursor moved since clicking down.
                            var dDX = dLeft - dStartLeft;

                            // Figure out the ratio of pixels moved to scroll offset change.
                            var dRange = self.options.virtualWidth - self.options.rectangles.content.width;
                            var dPercentScrolled = self.options.scrollOffsetLeft / dRange;
                            var dUseableWidth = self.options.rectangles.horizontalScrollBar.width - 4 -
                                2 * (self.options.rectangles.horizontalScrollBar.height / 2 - self.options.style.scrollBar.paddingThumb);
                            var dMultiplier = dRange / dUseableWidth;

                            self.options.scrollOffsetLeft = dInitializeScrollOffsetLeft + dDX * dMultiplier;
                            if (self.options.scrollOffsetLeft < 0) {

                                self.options.scrollOffsetLeft = 0;
                            }
                            if (self.options.scrollOffsetLeft > dRange) {

                                self.options.scrollOffsetLeft = dRange;
                            }

                            self.options.dirty.layout = true;

                            m_functionRender();
                        },
                        stop: function (evt, ui) {

                        },
                        helper: function () { return $("<div/>"); },

                        // Make any click start a drag, even if it does nothing with the drag.
                        distance: 0
                    });

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Allocate and initialze the overlay element that helps with vertical dragging.
            var m_functionCreateVerticalDragElement = function () {

                try {

                    // Create the Vertical draggable element.
                    self.options.verticalDraggable = document.createElement("div");
                    $(self.options.verticalDraggable).css({

                        position: "absolute",
                        left: "0px",
                        top: "0px",
                        width: "0px",
                        height: "0px",
                        "z-index": 100,
                        background: "rgba(255, 255, 255, 0.00001)"
                    });

                    // Add to DOM.
                    $(self.options.parent).append(self.options.verticalDraggable);

                    // Define some closures....
                    var dStartTop;
                    var dInitializeScrollOffsetTop;

                    // Make it a draggable.
                    $(self.options.verticalDraggable).draggable({
                        start: function (evt, ui) {

                            var dTop = (evt.pageY - $(self.options.verticalDraggable).offset().top) + $(window).scrollTop();

                            dStartTop = dTop;
                            dInitializeScrollOffsetTop = self.options.scrollOffsetTop;
                        },
                        drag: function (evt, ui) {

                            // Get the new position of the mouse.
                            var dTop = (evt.pageY - $(self.options.verticalDraggable).offset().top) + $(window).scrollTop();

                            // Figure out how for the cursor moved since clicking down.
                            var dDY = dTop - dStartTop;

                            // Figure out the ratio of pixels moved to scroll offset change.
                            var dRange = self.options.virtualHeight - self.options.rectangles.content.height;
                            var dPercentScrolled = self.options.scrollOffsetTop / dRange;
                            var dUseableHeight = self.options.rectangles.verticalScrollBar.height - 4 -
                                2 * (self.options.rectangles.verticalScrollBar.width / 2 - self.options.style.scrollBar.paddingThumb);
                            var dMultiplier = dRange / dUseableHeight;

                            self.options.scrollOffsetTop = dInitializeScrollOffsetTop + dDY * dMultiplier;
                            if (self.options.scrollOffsetTop < 0) {

                                self.options.scrollOffsetTop = 0;
                            }
                            if (self.options.scrollOffsetTop > dRange) {

                                self.options.scrollOffsetTop = dRange;
                            }

                            self.options.dirty.layout = true;

                            m_functionRender();
                        },
                        stop: function (evt, ui) {

                        },
                        helper: function () { return $("<div/>"); },

                        // Make any click start a drag, even if it does nothing with the drag.
                        distance: 0
                    });

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Method tests a single row against all filters 
            // and returns true if all pass otherwise false.
            var m_functionFilterRow = function (rowIth) {

                // Process each column that has a filter.  Row must pass all filters.
                var bPass = true;
                for (var iColumn = 0; iColumn < self.options.columns.length; iColumn++) {

                    // Get the ith column.
                    var columnIth = self.options.columns[iColumn];

                    // Get the filter.
                    var arrayFilter = columnIth.filter;
                    if (arrayFilter === undefined ||
                        arrayFilter === null) {

                        continue;
                    }

                    // Get the filter target value.
                    var cell = rowIth[columnIth.index];
                    var objectValue = cell.value;

                    if (columnIth.type === "date" &&
                        objectValue.getTime !== undefined) {

                        objectValue = (objectValue.getMonth() + 1).toString() + "/" +
                            objectValue.getDate().toString() + "/" +
                            objectValue.getFullYear().toString();
                    }

                    // Only permit row if objectValue is contained in the filter values collection.
                    if (arrayFilter.indexOf(objectValue) === -1) {

                        return false;
                    }
                }

                return true;
            };

            // Helper method merges the row into the nested data structure.
            var m_functionGroupRow = function (row,
                bAdd) {

                try {

                    // Specify default value for missing data.
                    if (bAdd === undefined ||
                        bAdd === null) {

                        bAdd = true;
                    }

                    // Calculate the additive multiplier based on bAdd.
                    var arrayDeleteUnwindContext = null;
                    var iMultiplier = 1;
                    if (bAdd === false) {

                        iMultiplier = -1;
                        arrayDeleteUnwindContext = [];
                    }

                    // See the parent by null (the highest level node has no parent).
                    var objectParent = null;

                    // Get the highest node to start off the "procedurla-recursion".
                    var objectData = self.options.data;

                    // Process each of the grouping columns.
                    for (var i = 0; i < self.options.groupingIndicies.length; i++) {

                        // Get the ith grouping index.
                        var iIthGroupingIndex = self.options.groupingIndicies[i];

                        // Get the value of the grouping index from the row.
                        var objectValue = row[iIthGroupingIndex].value;

                        // If deleting, keep track of parent values so groups may be removed if empty.
                        if (arrayDeleteUnwindContext) {

                            // Remember this value, it will be used later to get the child to remove
                            // whilst "procedurally-recursing" through the list of parents to remove.
                            arrayDeleteUnwindContext.push(objectValue);
                        }

                        // All but the last level of grouping containers are more grouping containers. 
                        // The last grouping container is an array.  In both, meta tags give context.
                        if (i < self.options.groupingIndicies.length - 1) {

                            // Test if this value has been seen for this grouping column yet.
                            if (!objectData[objectValue]) {

                                // Must be an add if get here.
                                if (bAdd === false) {

                                    throw {

                                        message: "Invalid operation remove called for non-grouped row."
                                    };
                                }

                                objectData[objectValue] = {

                                    meta: {

                                        open: false,
                                        parent: objectParent,
                                        level: iIthGroupingIndex
                                    },
                                    summing: {

                                    },
                                    allOrNone: {

                                    },
                                    data: {

                                    }
                                };
                            }

                            // Update summing columns.  Note: Identical code in next code block.
                            for (var j = 0; j < self.options.summingIndicies.length; j++) {

                                // Get the index.
                                var iJthSummingIndex = self.options.summingIndicies[j];

                                // Get the value of the grouping index from the row.
                                var objectSummingValue = row[iJthSummingIndex].value;

                                if (!objectData[objectValue].summing[iJthSummingIndex]) {

                                    objectData[objectValue].summing[iJthSummingIndex] = 0;
                                }
                                objectData[objectValue].summing[iJthSummingIndex] += (iMultiplier * parseFloat(objectSummingValue));
                            }

                            // Extract the next-level grouping collection.  (Save parent info.)
                            objectParent = objectData;
                            objectData = objectData[objectValue].data;
                        } else {

                            // Test if this value has been seen for this grouping column yet.
                            if (!objectData[objectValue]) {

                                // Must be an add if get here.
                                if (bAdd === false) {

                                    throw {

                                        message: "Invalid operation remove called for non-grouped row."
                                    };
                                }

                                objectData[objectValue] = {
                                    meta: {

                                        open: false,
                                        parent: objectParent,
                                        level: iIthGroupingIndex
                                    },
                                    summing: {

                                    },
                                    allOrNone: {

                                    },
                                    data: [

                                    ]
                                };
                            }

                            // Update summing columns.  Note: Identical code in previous code block.
                            for (var j = 0; j < self.options.summingIndicies.length; j++) {

                                // Get the index.
                                var iJthSummingIndex = self.options.summingIndicies[j];

                                // Get the value of the grouping index from the row.
                                var objectSummingValue = row[iJthSummingIndex].value;

                                if (!objectData[objectValue].summing[iJthSummingIndex]) {

                                    objectData[objectValue].summing[iJthSummingIndex] = 0;
                                }

                                objectData[objectValue].summing[iJthSummingIndex] += (iMultiplier * parseFloat(objectSummingValue));
                            }

                            if (bAdd === true) {

                                // Augment the collection.
                                objectData[objectValue].data.push(row);
                            } else {

                                // Diminish the collection.
                                objectData[objectValue].data.splice(objectData[objectValue].data.indexOf(row),
                                    1);

                                // If removed the last item, then scan up 
                                // the parent tree for properties to remove.
                                //
                                // NOTE: I'll be honest.  This code is too complex for me to fully understand.
                                // I tested it well.  However, if in the future we find an issue here, I recommend
                                // that this process be turned into a post-pass where all records are scanned 
                                // for empty children elsewhere.  It is just too complex to comprehend here.
                                if (objectData[objectValue].data.length === 0) {

                                    // But first, just remove the current, known parent.
                                    var objectSomeParent = objectData[objectValue].meta.parent;
                                    delete objectData[objectValue];

                                    // Loop up the parent chain whilst there is a
                                    // defined parent and the data object is good.
                                    while (objectData !== null &&
                                        objectSomeParent !== null) {

                                        // Remove the last as it is no longer necessary.
                                        arrayDeleteUnwindContext.splice(arrayDeleteUnwindContext.length - 1,
                                            1);

                                        // Count how many properties of objectData are still around.
                                        var iCount = 0;
                                        for (var key in objectData) {

                                            if (!objectData.hasOwnProperty(key)) {

                                                continue;
                                            }
                                            iCount++;
                                        }

                                        // If the last property of objectData has been removed, then
                                        // scan up the parent chain one level and count again the children.
                                        if (iCount === 0) {

                                            // Get the last parent.
                                            var objectDataValue = arrayDeleteUnwindContext[arrayDeleteUnwindContext.length - 1];

                                            // Save off the parent of the item about to be deleted.
                                            var objectSomeOtherParent = objectSomeParent[objectDataValue].meta.parent;

                                            // Delete the (parent) item.
                                            delete objectSomeParent[objectDataValue];

                                            // Set the loop parameter up a parent-level.
                                            objectData = objectSomeParent;

                                            // Update the parent from the saved value from before this parent was deleted.
                                            objectSomeParent = objectSomeOtherParent;

                                        } else {

                                            // Once the chain of removals has been broken, no need to look further.
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Method merges a single row into data.
            var m_functionMergeRow = function (row) {

                try {

                    var exceptionRet = null;

                    // Test row against filter.
                    var bPassFilter = m_functionFilterRow(row);
                    if (!bPassFilter) {

                        return null;
                    }

                    // Look up UID in collection.
                    var objectUID = row[self.options.uIDColumnIndex].value;
                    var rowFull = self.options.uIDs[objectUID];
                    if (rowFull) {

                        // Remove rowFull.  (Eventually, check if any group-by columns change first....)
                        exceptionRet = m_functionGroupRow(rowFull,
                            false);
                        if (exceptionRet !== null) {

                            return exceptionRet;
                        }

                        // Augment row by rowFull.
                        row = rowFull.inject(row);
                    } else {

                        // If the full row is not found, then a complete 
                        // row must have been passed in.  Confirm this:
                        for (var i = 0; i < self.options.columns.length; i++) {

                            if (!row[i]) {

                                throw { message: "Invalid row." };
                            }
                        }

                        // Add the uid.
                        self.options.uIDs[objectUID] = row;
                    }

                    // Add the now-full row back into the data.
                    exceptionRet = m_functionGroupRow(row);
                    if (exceptionRet !== null) {

                        return exceptionRet;
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Invoked when the mouse is depressed over the canvas element.
            // Implemented to possibly handle the click to open/close regions.
            var m_functionOnMouseUp = function (e) {

                try {

                    var dX = e.offsetX - self.options.rectangles.content.left;
                    var dY = e.offsetY - self.options.rectangles.content.top;

                    // Process the open-close regions.
                    for (var i = 0; i < self.options.openCloseRegions.length; i++) {

                        // Get the ith region.
                        var regionIth = self.options.openCloseRegions[i];
                        if (!regionIth) {

                            continue;
                        }

                        // See if click inside region.
                        if (dX > regionIth.rectangle.left &&
                            dX <= regionIth.rectangle.left + regionIth.rectangle.width &&
                            dY > regionIth.rectangle.top &&
                            dY <= regionIth.rectangle.top + regionIth.rectangle.height) {

                            // OK, get the meta and toggle the open closeness.
                            regionIth.meta.open = regionIth.meta.open ? false : true;

                            // Mark for update.
                            self.options.dirty.virtualHeight = true;

                            // Force immediate refresh as a result of user click.
                            m_functionRender();
                        }
                    }

                    // Process the row regions.
                    for (var i = 0; i < self.options.rowRegions.length; i++) {

                        // Get the ith region.
                        var regionIth = self.options.rowRegions[i];
                        if (!regionIth) {

                            continue;
                        }

                        // See if click inside region.
                        if (dX > regionIth.rectangle.left &&
                            dX <= regionIth.rectangle.left + regionIth.rectangle.width &&
                            dY > regionIth.rectangle.top &&
                            dY <= regionIth.rectangle.top + regionIth.rectangle.height) {

                            // Set the selection as the origin object.
                            self.options.selectedRow = regionIth.origin;

                            // Mark for redraw.
                            self.options.dirty.content = true;

                            // Force immediate refresh as a result of user click.
                            m_functionRender();

                            // Raise event, if set.
                            if ($.isFunction(self.options.onClick)) {

                                self.options.onClick(regionIth.origin);
                            }
                        }
                    }
                } catch (e) {

                    // What to do...
                    alert(e.message);
                }
            };

            // Invoked when the mouse wheel is affected.
            // Implemented to scroll the content region.
            var m_functionOnMouseWheel = function (e) {

                try {

                    // Only scroll if necessary.
                    if (self.options.visible.verticalScrollBar) {

                        // Figure out how for the cursor moved since clicking down.
                        var dDX = e.wheelDelta / 3;
                        self.options.scrollOffsetTop -= dDX;

                        // Check bounds.
                        if (self.options.scrollOffsetTop < 0) {

                            self.options.scrollOffsetTop = 0;
                        }
                        var dRange = self.options.virtualHeight - self.options.rectangles.content.height;
                        if (self.options.scrollOffsetTop > dRange) {

                            self.options.scrollOffsetTop = dRange;
                        }

                        // Cause the layout (content and scrollbars and such) to be updated.
                        self.options.dirty.layout = true;

                        // Draw!
                        m_functionRender();
                    }

                    return;
                } catch (e) {

                    m_options.meditaor.reportError(e);
                }
            };

            // Method recursively processes a single all-or-none column.
            var m_functionPostProcessAllOrNone = function (objectGroupingCollection,
                iIndex) {

                // Hold on to a value that represents the consistent value across all children.
                var objectConsistentValue = undefined;

                // Extract out data from collection.
                var data = objectGroupingCollection.data;

                // Determine if at lowest level....
                if (Array.isArray(data)) {

                    // Don't blow up if empty collection, should never happen anyway.
                    if (data.length === 0) {

                        return null;
                    }

                    // Get the first value as the prototype value.
                    objectConsistentValue = data[0][iIndex].value;

                    // Test current consistent value against all sibling values.
                    for (var i = 1; i < data.length; i++) {

                        if (data[i][iIndex].value !== objectConsistentValue) {

                            return null;
                        }
                    }
                } else {

                    // Loop over all children of the data property of the specified grouping collection.
                    for (var objectKey in data) {

                        // Ensure this property is owned by this instance.
                        if (!data.hasOwnProperty(objectKey)) {

                            continue;
                        }

                        // Extract child.
                        var objectValue = data[objectKey];

                        // if first child, get the consistent value.
                        if (objectConsistentValue === undefined) {

                            // Recurse.
                            objectConsistentValue = m_functionPostProcessAllOrNone(objectValue,
                                iIndex);
                            objectValue.allOrNone[iIndex] = objectConsistentValue;
                        } else {

                            // Recurse and compare.
                            var objectPossiblyConsistentValue = m_functionPostProcessAllOrNone(objectValue,
                                iIndex);
                            objectValue.allOrNone[iIndex] = objectPossiblyConsistentValue;

                            // Compare.
                            if (objectPossiblyConsistentValue !== objectConsistentValue) {

                                objectConsistentValue = null;
                               // return null;
                            }
                        }
                    }
                }

                return objectConsistentValue;
            };

            // Method recursively processes all-or-none columns.
            var m_functionPostProcessAllOrNones = function () {

                try {

                    // Loop over all all-or-none columns, call 
                    // down recursively one after the other.
                    for (var i = 0; i < self.options.allOrNoneIndicies.length; i++) {

                        // Get the index.
                        var iIthAllOrNoneIndex = self.options.allOrNoneIndicies[i];

                        // Call without exception handling.  This method does
                        // return a value, but that value is not needed here.
                        m_functionPostProcessAllOrNone(self.options,
                            iIthAllOrNoneIndex);
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Scan columns and build of operation-centric collections.
            var m_functionPreprocessColumns = function () {

                try {

                    // Maintain width of all visible columns.
                    self.options.virtualWidth = 0;

                    // Scan the columns, tease out column operations.
                    for (var i = 0; i < self.options.columns.length; i++) {

                        // Get the ith column.
                        var columnIth = self.options.columns[i];
                        if (!columnIth) {

                            continue;
                        }

                        // Column needs to know its ordinal index.
                        columnIth.index = i;

                        // Remember this position before moving over for this column.
                        columnIth.left = self.options.virtualWidth;

                        // Maintain width of all visible columns.
                        self.options.virtualWidth += (columnIth.visible === true ? columnIth.width : 0);

                        // Check if it is the UID column.
                        if (columnIth.operation === "UID") {

                            self.options.uIDColumnIndex = i;
                        } else if (columnIth.operation === "group") {

                            self.options.groupingIndicies.push(i);
                        } else if (columnIth.operation === "sum") {

                            self.options.summingIndicies.push(i);
                        } else if (columnIth.operation === "allOrNone") {

                            self.options.allOrNoneIndicies.push(i);
                        }
                    }
                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render all regions, if dirty and visible.
            var m_functionRender = function () {

                var iS = new Date().getTime();

                try {

                    var exceptionRet = null;

                    // Ensure the height of the control is known.
                    if (self.options.dirty.virtualHeight) {

                        exceptionRet = m_functionCalculateVirtualHeight();
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                        self.options.dirty.virtualHeight = false;
                    }

                    // Ensure the component rectangles are set.
                    if (self.options.dirty.layout) {

                        exceptionRet = m_functionCalculateLayout();
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                        self.options.dirty.layout = false;
                    }

                    // Look at each region, determine if it is dirty and render if so.
                    if (self.options.dirty.columnHeaders) {

                        exceptionRet = m_functionRenderColumnHeaders();
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                        self.options.dirty.columnHeaders = false;
                    }
                    if (self.options.dirty.content) {

                        exceptionRet = m_functionRenderContent();
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                        // It is sad for efficiency, but never reset this.
                        // self.options.dirty.content = false;
                    }
                    if (self.options.dirty.horizontalScrollBar &&
                        self.options.visible.horizontalScrollBar) {

                        exceptionRet = m_functionRenderHorizontalScrollBar();
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                        self.options.dirty.horizontalScrollBar = false;
                    }
                    if (self.options.dirty.verticalScrollBar &&
                        self.options.visible.verticalScrollBar) {

                        exceptionRet = m_functionRenderVerticalScrollBar();
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                        self.options.dirty.verticalScrollBar = false;
                    }
                    if (self.options.dirty.nullBottomRight &&
                        self.options.visible.nullBottomRight) {

                        exceptionRet = m_functionRenderNullBottomRight();
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                        self.options.dirty.nullBottomRight = false;
                    }
                    if (self.options.dirty.nullTopRight &&
                        self.options.visible.nullTopRight) {

                        exceptionRet = m_functionRenderNullTopRight();
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                        self.options.dirty.nullTopRight = false;
                    }

                    return null;
                } catch (e) {

                    return e;
                } finally {

                    document.title = new Date().getTime() - iS;
                }
            };

            // Render the column headers.
            var m_functionRenderColumnHeaders = function () {

                try {

                    // Determine the first and last visible (or partially visible) columns.
                    var dXCursor = 0;
                    var iFirstVisible = -1;
                    var iLastVisible = -1;
                    for (var i = 0; i < self.options.columns.length; i++) {

                        // Get the ith column.
                        var columnIth = self.options.columns[i];
                        if (!columnIth ||
                            !columnIth.visible) {

                            continue;
                        }

                        // If within the virtual realm.
                        if (dXCursor + columnIth.width > self.options.scrollOffsetLeft) {

                            // Break out, once beyond the end of visible.
                            if (dXCursor > self.options.scrollOffsetLeft + self.options.width) {

                                iLastVisible = i - 1;
                                break;
                            }

                            if (iFirstVisible === -1) {

                                iFirstVisible = i;
                            }
                        }

                        dXCursor += columnIth.width;
                    }
                    // Make sure there is a last.
                    if (iLastVisible === -1) {

                        iLastVisible = self.options.columns.length - 1;
                    }

                    // Store in options for use in rendering.
                    self.options.firstVisibleColumn = iFirstVisible;
                    self.options.lastVisibleColumn = iLastVisible;

                    // Calculate how far down to offset the text so 
                    // that it is centered vertically in the cell.
                    self.options.verticalCellOffset = (self.options.style.rowHeight -
                        parseFloat(self.options.style.font)) / 2;

                    // Set the font.
                    self.options.contextBackground.font = self.options.style.font;


                    // Configure context.
                    self.options.contextBackground.textAlign = "left";
                    self.options.contextBackground.textBaseline = "top";

                    self.options.contextBackground.strokeStyle = self.options.style.columnSeparatorColor;

                    // Loop over all visible columns.
                    var dLeftMostFill = 0;
                    for (var i = self.options.firstVisibleColumn; i <= self.options.lastVisibleColumn; i++) {

                        // Get the ith column.
                        var columnIth = self.options.columns[i];
                        if (!columnIth ||
                            columnIth.visible === false) {

                            continue;
                        }

                        // Compute the left for this cell.
                        var dLeft = self.options.columns[i].left - self.options.scrollOffsetLeft;

                        // Fill in the column.
                        self.options.contextBackground.fillStyle = self.options.style.background;
                        self.options.contextBackground.fillRect(dLeft,
                            0,
                            columnIth.width,
                            self.options.rectangles.columnHeaders.height);
                        dLeftMostFill = dLeft + columnIth.width;

                        // Draw column divider.
                        self.options.contextBackground.beginPath();
                        self.options.contextBackground.moveTo(dLeft,
                            0);
                        self.options.contextBackground.lineTo(dLeft,
                            self.options.style.totalColumnHeaderHeight);
                        self.options.contextBackground.stroke();

                        // Set the fill to header text color.
                        self.options.contextBackground.fillStyle = self.options.style.columnHeaderTextColor;
                        if (columnIth.type === "amount") {

                            var dWidth = self.options.contextBackground.measureText(columnIth.name).width;
                            self.options.contextBackground.fillText(columnIth.name,
                                dLeft + columnIth.width - dWidth - self.options.style.horizontalCellOffset,
                                self.options.verticalCellOffset);
                        } else {

                            self.options.contextBackground.fillText(columnIth.name,
                                dLeft + self.options.style.horizontalCellOffset,
                                self.options.verticalCellOffset);
                        }

                        // Draw the total text, if totalling.
                        if (columnIth.total !== undefined) {

                            // Convert to "real" number.
                            var dN = parseFloat(columnIth.total);

                            // Do some temporary comma insertion.
                            var strN = dN.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                            // Right-justify for numbers.
                            var dWidth = self.options.contextBackground.measureText(strN).width;
                            self.options.contextBackground.fillText(strN,
                                dLeft + columnIth.width - dWidth - self.options.style.horizontalCellOffset,
                                self.options.verticalCellOffset + self.options.style.rowHeight);
                        }

                        // Draw the filter text, if filtering.
                        if (columnIth.filter !== undefined) {

                            // Build filter string.
                            var strFilter = "";
                            if (columnIth.filter != null) {

                                for (var iValue = 0; iValue < columnIth.filter.length; iValue++) {

                                    if (strFilter.length > 0) {

                                        strFilter += " | ";
                                    }
                                    strFilter += columnIth.filter[iValue];
                                }
                            }

                            // Render the filter text to the work easel.
                            self.options.contextBackground.fillText(strFilter,
                                dLeft + self.options.style.horizontalCellOffset,
                                self.options.verticalCellOffset +
                                    2 * self.options.style.rowHeight);
                        }
                    }

                    // Fill in the excess width.
                    if (dLeftMostFill < self.options.rectangles.columnHeaders.width) {

                        self.options.contextBackground.fillStyle = self.options.style.background;
                        self.options.contextBackground.fillRect(dLeftMostFill,
                            0,
                            self.options.rectangles.columnHeaders.width - dLeftMostFill,
                            self.options.rectangles.columnHeaders.height);
                    }

                    // Copy to main bitmap.
                    self.options.context.drawImage(self.options.canvasBackground,
                        0,
                        0,
                        self.options.rectangles.columnHeaders.width,
                        self.options.rectangles.columnHeaders.height,
                        0,
                        0,
                        self.options.rectangles.columnHeaders.width,
                        self.options.rectangles.columnHeaders.height);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render the content.
            var m_functionRenderContent = function () {

                try {

                    // Post recurse prepare of visible cells.  Set the delete flag.
                    // If still rendered, the delete flag is cleared.  After the 
                    // recursion is complete, cull those with true delete flag value.
                    var arrayVisibleRowsKeys = Object.keys(self.options.visibleRows);
                    for (var i = 0; i < arrayVisibleRowsKeys.length; i++) {

                        // Get the Ith visible row.
                        var rowIth = self.options.visibleRows[arrayVisibleRowsKeys[i]];
                        rowIth.delete = true;
                    }

                    // Clear the background.
                    self.options.contextBackground.fillStyle = self.options.style.background;
                    self.options.contextBackground.fillRect(0,
                        0,
                        self.options.rectangles.content.width,
                        self.options.rectangles.content.height);

                    // Clear out the collections of click-regions.
                    self.options.openCloseRegions = [];
                    self.options.rowRegions = [];

                    // Recursively scan down all open rows.
                    self.options.renderCursor = 0;
                    var exceptionRet = m_functionRenderRecurse(self.options);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Copy to main bitmap.
                    self.options.context.drawImage(self.options.canvasBackground,
                        0,
                        0,
                        self.options.rectangles.content.width,
                        self.options.rectangles.content.height,
                        0,
                        self.options.style.totalColumnHeaderHeight,
                        self.options.rectangles.content.width,
                        self.options.rectangles.content.height);


                    // Remove any visible rows (from the original key collection--no reason 
                    // to check new keys) which have not been revitalized during this pass.
                    for (var i = 0; i < arrayVisibleRowsKeys.length; i++) {

                        // Get the Ith visible row.
                        var rowIth = self.options.visibleRows[arrayVisibleRowsKeys[i]];
                        if (rowIth.delete) {

                            // Remove it.
                            delete self.options.visibleRows[arrayVisibleRowsKeys[i]];
                        }
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render scroll bar.
            var m_functionRenderHorizontalScrollBar = function () {

                try {

                    var dLeft = self.options.rectangles.horizontalScrollBar.left;
                    var dTop = self.options.rectangles.horizontalScrollBar.top;

                    // Fill the whole bar.
                    self.options.context.fillStyle = self.options.style.scrollBar.background;
                    self.options.context.fillRect(dLeft,
                        dTop,
                        self.options.rectangles.horizontalScrollBar.width,
                        self.options.rectangles.horizontalScrollBar.height);

                    // Fill in just the middle part with a blue stripe.
                    var dStripeHeight = self.options.rectangles.horizontalScrollBar.height - 2 * self.options.style.scrollBar.widthStripeIndent;
                    self.options.context.fillStyle = self.options.style.scrollBar.backgroundStripe;
                    self.options.context.fillRect(dLeft + 4,
                        dTop + self.options.style.scrollBar.widthStripeIndent,
                        self.options.rectangles.horizontalScrollBar.width - 8,
                        dStripeHeight);
                    self.options.context.beginPath();
                    self.options.context.arc(dLeft + 4,
                        dTop + self.options.rectangles.horizontalScrollBar.height / 2,
                        dStripeHeight / 2,
                        Math.PI / 2,
                        3 * Math.PI / 2,
                        false);
                    self.options.context.fill();
                    self.options.context.beginPath();
                    self.options.context.arc(dLeft + self.options.rectangles.horizontalScrollBar.width - 4,
                        dTop + self.options.rectangles.horizontalScrollBar.height / 2,
                        dStripeHeight / 2,
                        Math.PI / 2,
                        3 * Math.PI / 2,
                        true);
                    self.options.context.fill();

                    // Calculate thumb left.
                    var dRange = self.options.virtualWidth - self.options.rectangles.content.width;
                    var dPercentScrolled = self.options.scrollOffsetLeft / dRange;
                    var dUseableWidth = self.options.rectangles.horizontalScrollBar.width - 4 - 
                        2 * (self.options.rectangles.horizontalScrollBar.height / 2 - self.options.style.scrollBar.paddingThumb);
                    var dThumbLeft = dUseableWidth * dPercentScrolled;

                    // Draw the thumb.

                    // Fill in from the left of the bar to the left of the thumb with highlight.
                    var dStripeHeight = self.options.rectangles.horizontalScrollBar.height - 2 * self.options.style.scrollBar.widthHighlightStripeIndent;
                    self.options.context.fillStyle = self.options.style.scrollBar.backgroundHighlightStripe;
                    self.options.context.fillRect(dLeft + 4,
                        dTop + self.options.style.scrollBar.widthHighlightStripeIndent,
                        dThumbLeft,
                        dStripeHeight);
                    self.options.context.beginPath();
                    self.options.context.arc(dLeft + 4,
                        dTop + self.options.rectangles.horizontalScrollBar.height / 2,
                        dStripeHeight / 2,
                        Math.PI / 2,
                        3 * Math.PI / 2,
                        false);
                    self.options.context.fill();

                    // Draw the thumb.
                    self.options.context.strokeStyle = self.options.style.scrollBar.shadowThumb;
                    self.options.context.fillStyle = self.options.style.scrollBar.backgroundThumb;
                    self.options.context.beginPath();

                    self.options.context.arc(dLeft + dThumbLeft + self.options.rectangles.horizontalScrollBar.height / 2,
                        dTop + self.options.rectangles.horizontalScrollBar.height / 2,
                        self.options.rectangles.horizontalScrollBar.height / 2 - self.options.style.scrollBar.paddingThumb,
                        0,
                        2 * Math.PI,
                        false);
                    self.options.context.closePath();
                    self.options.context.fill();
                    self.options.context.stroke();

                    // Now, the highlight
                    self.options.context.beginPath();
                    self.options.context.strokeStyle = self.options.style.scrollBar.highlightThumb;
                    self.options.context.beginPath();
                    self.options.context.arc(dLeft + dThumbLeft + self.options.rectangles.horizontalScrollBar.height / 2,
                        dTop + self.options.rectangles.horizontalScrollBar.height / 2,
                        self.options.rectangles.horizontalScrollBar.height / 2 - self.options.style.scrollBar.paddingThumb - 1,
                        Math.PI + Math.PI / 10,
                        2 * Math.PI - Math.PI / 10,
                        false);
                    self.options.context.stroke();

                    // The little inner circle:
                    self.options.context.beginPath();
                    self.options.context.fillStyle = self.options.style.scrollBar.backgroundThumbCenter;
                    self.options.context.arc(dLeft + dThumbLeft + self.options.rectangles.horizontalScrollBar.height / 2,
                        dTop + self.options.rectangles.horizontalScrollBar.height / 2,
                        self.options.style.scrollBar.widthThumbHole,
                        0,
                        2 * Math.PI,
                        false);
                    self.options.context.closePath();
                    self.options.context.fill();

                    // Last, the highlight on the mini-hole
                    self.options.context.beginPath();
                    self.options.context.strokeStyle = self.options.style.scrollBar.highlightThumb;
                    self.options.context.arc(dLeft + dThumbLeft + self.options.rectangles.horizontalScrollBar.height / 2,
                        dTop + self.options.rectangles.horizontalScrollBar.height / 2,
                        self.options.style.scrollBar.widthThumbHole + 0.5,
                        Math.PI - Math.PI / 5,
                        2 * Math.PI + Math.PI / 5,
                        true);
                    self.options.context.stroke();

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render scroll bar.
            var m_functionRenderVerticalScrollBar = function () {

                try {

                    var dLeft = self.options.rectangles.verticalScrollBar.left;
                    var dTop = self.options.rectangles.verticalScrollBar.top;

                    // Fill the whole bar.
                    self.options.context.fillStyle = self.options.style.scrollBar.background;
                    self.options.context.fillRect(dLeft,
                        dTop,
                        self.options.rectangles.verticalScrollBar.width,
                        self.options.rectangles.verticalScrollBar.height);

                    // Fill in just the middle part with a blue stripe.

                    var dStripeWidth = self.options.rectangles.verticalScrollBar.width -
                        2 * self.options.style.scrollBar.widthStripeIndent;

                    self.options.context.fillStyle = self.options.style.scrollBar.backgroundStripe;
                    if (self.options.style.scrollBar.renderOutline) {

                        self.options.context.strokeStyle = self.options.style.scrollBar.outlineColor;
                        self.options.context.strokeRect(dLeft + self.options.style.scrollBar.widthStripeIndent,
                            dTop + 4,
                            dStripeWidth,
                            self.options.rectangles.verticalScrollBar.height - 8);
                    } else {

                        self.options.context.fillRect(dLeft + self.options.style.scrollBar.widthStripeIndent,
                            dTop + 4,
                            dStripeWidth,
                            self.options.rectangles.verticalScrollBar.height - 8);
                    }

                    self.options.context.beginPath();
                    self.options.context.arc(dLeft + self.options.rectangles.verticalScrollBar.width / 2,
                        dTop + 4,
                        dStripeWidth / 2,
                        0,
                        Math.PI,
                        true);
                    self.options.context.fill();
                    self.options.context.beginPath();
                    self.options.context.arc(dLeft + self.options.rectangles.verticalScrollBar.width / 2,
                        dTop + self.options.rectangles.verticalScrollBar.height - 4,
                        dStripeWidth / 2,
                        0,
                        Math.PI,
                        false);
                    self.options.context.fill();

                    // Calculate thumb top.
                    var dRange = self.options.virtualHeight - self.options.rectangles.content.height;
                    var dPercentScrolled = self.options.scrollOffsetTop / dRange;
                    var dUseableHeight = self.options.rectangles.verticalScrollBar.height - 4 -
                        2 * (self.options.rectangles.verticalScrollBar.width / 2 - self.options.style.scrollBar.paddingThumb);
                    var dThumbTop = dUseableHeight * dPercentScrolled;

                    // Fill in from the top of the bar to the top of the thumb with highlight.
                    self.options.context.fillStyle = self.options.style.scrollBar.backgroundHighlightStripe;
                    self.options.context.fillRect(dLeft + self.options.style.scrollBar.widthHighlightStripeIndent,
                        dTop + 2,
                        self.options.rectangles.verticalScrollBar.width - 2 * self.options.style.scrollBar.widthHighlightStripeIndent,
                        dThumbTop + self.options.rectangles.verticalScrollBar.width / 2 - 2);

                    // Draw the thumb.
                    self.options.context.strokeStyle = self.options.style.scrollBar.shadowThumb;
                    self.options.context.fillStyle = self.options.style.scrollBar.backgroundThumb;
                    self.options.context.beginPath();

                    self.options.context.arc(dLeft + self.options.rectangles.verticalScrollBar.width / 2,
                        dTop + dThumbTop + self.options.rectangles.verticalScrollBar.width / 2,
                        self.options.rectangles.verticalScrollBar.width / 2 - self.options.style.scrollBar.paddingThumb,
                        0,
                        2 * Math.PI,
                        false);
                    self.options.context.closePath();
                    self.options.context.fill();
                    self.options.context.stroke();

                    // Now, the highlight
                    self.options.context.beginPath();
                    self.options.context.strokeStyle = self.options.style.scrollBar.highlightThumb;
                    self.options.context.beginPath();
                    self.options.context.arc(dLeft + self.options.rectangles.verticalScrollBar.width / 2,
                        dTop + dThumbTop + self.options.rectangles.verticalScrollBar.width / 2,
                        self.options.rectangles.verticalScrollBar.width / 2 - self.options.style.scrollBar.paddingThumb - 1,
                        Math.PI + Math.PI / 10,
                        2 * Math.PI - Math.PI / 10,
                        false);
                    self.options.context.stroke();

                    // The little inner circle:
                    self.options.context.beginPath();
                    self.options.context.fillStyle = self.options.style.scrollBar.backgroundThumbCenter;
                    self.options.context.arc(dLeft + self.options.rectangles.verticalScrollBar.width / 2,
                        dTop + dThumbTop + self.options.rectangles.verticalScrollBar.width / 2,
                        self.options.style.scrollBar.widthThumbHole,
                        0,
                        2 * Math.PI,
                        false);
                    self.options.context.closePath();
                    self.options.context.fill();

                    // Last, the highlight on the mini-hole
                    self.options.context.beginPath();
                    self.options.context.strokeStyle = self.options.style.scrollBar.highlightThumb;
                    self.options.context.arc(dLeft + self.options.rectangles.verticalScrollBar.width / 2,
                        dTop + dThumbTop + self.options.rectangles.verticalScrollBar.width / 2,
                        self.options.style.scrollBar.widthThumbHole + 0.5,
                        Math.PI - Math.PI / 5,
                        2 * Math.PI + Math.PI / 5,
                        true);
                    self.options.context.stroke();

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render null region.
            var m_functionRenderNullTopRight = function () {

                try {

                    self.options.context.fillStyle = self.options.style.background;
                    self.options.context.fillRect(self.options.rectangles.nullTopRight.left,
                        self.options.rectangles.nullTopRight.top,
                        self.options.rectangles.nullTopRight.width,
                        self.options.rectangles.nullTopRight.height);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render null region.
            var m_functionRenderNullBottomRight = function () {

                try {

                    self.options.context.fillStyle = self.options.style.background;
                    self.options.context.fillRect(self.options.rectangles.nullBottomRight.left,
                        self.options.rectangles.nullBottomRight.top,
                        self.options.rectangles.nullBottomRight.width,
                        self.options.rectangles.nullBottomRight.height);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Recursively render the content.
            var m_functionRenderRecurse = function (objectGroupingCollection) {

                try {

                    // Extract out data.
                    var data = objectGroupingCollection.data;

                    // Determine if at lowest level....
                    if (Array.isArray(data)) {

                        // Just draw all children, whilst visible.
                        for (var i = 0; i < data.length; i++) {

                            // If within the virtual realm.
                            if (self.options.renderCursor + self.options.style.rowHeight > self.options.scrollOffsetTop) {

                                // Break out, once beyond the end of visible.
                                if (self.options.renderCursor > self.options.scrollOffsetTop + self.options.height) {

                                    return null;
                                }

                                // Get the data row.
                                var rowDetail = data[i];

                                // Get the visible row associated with rowDetail.
                                var visibleRow = self.options.visibleRows[rowDetail[self.options.uIDColumnIndex].value];
                                if (visibleRow) {

                                    // Mark as still visible.
                                    visibleRow.delete = false;
                                } else {

                                    visibleRow = {};
                                    visibleRow.delete = false;
                                    self.options.visibleRows[rowDetail[self.options.uIDColumnIndex].value] = visibleRow;
                                }

                                // Create the render row.
                                var row = [];

                                // Store the origin object.
                                row.origin = rowDetail;

                                // Populate the render row cells.
                                for (var j = self.options.groupingIndicies.length + 1; j < self.options.columns.length; j++) {

                                    row[j] = rowDetail[j].value;
                                }

                                // If rowDetail is the selected row, then show it selected.
                                if (self.options.selectedRow === rowDetail) {

                                    row.selected = true;
                                }

                                // Render out this row.
                                var exceptionRet = m_functionRenderRow(row,
                                    visibleRow,
                                    self.options.renderCursor - self.options.scrollOffsetTop,
                                    -1);
                                if (exceptionRet !== null) {

                                    throw exceptionRet;
                                }
                            }

                            // Move to the next row position.
                            self.options.renderCursor += self.options.style.rowHeight;
                        }
                    } else {

                        // Loop over all children of the data property of the specified grouping collection.
                        for (var objectKey in data) {

                            // Get the value.
                            var objectValue = data[objectKey];

                            // If within the virtual realm.
                            if (self.options.renderCursor + self.options.style.rowHeight > self.options.scrollOffsetTop) {

                                // Break out, once beyond the end of visible.
                                if (self.options.renderCursor > self.options.scrollOffsetTop + self.options.height) {

                                    return null;
                                }

                                // Construct row for this grouping collection.
                                var row = [];

                                // Store the origin object.
                                row.origin = objectValue;

                                // First, set the group key.
                                var iLevel = objectValue.meta.level;
                                row[iLevel] = objectKey;

                                // Get the visible row associated with objectKey.
                                var visibleRow = self.options.visibleRows[objectKey.toString() + iLevel.toString()];
                                if (visibleRow) {

                                    // Mark as still visible.
                                    visibleRow.delete = false;
                                } else {

                                    visibleRow = {};
                                    visibleRow.delete = false;
                                    self.options.visibleRows[objectKey.toString() + iLevel.toString()] = visibleRow;
                                }

                                // Handle summing.
                                for (var i = 0; i < self.options.summingIndicies.length; i++) {

                                    // Get the index.
                                    var ithSummingIndex = self.options.summingIndicies[i];

                                    // Set the data in the row.
                                    row[ithSummingIndex] = objectValue.summing[ithSummingIndex];
                                }

                                // Handle all-or-none.
                                for (var i = 0; i < self.options.allOrNoneIndicies.length; i++) {

                                    // Get the index.
                                    var ithAllOrNoneIndex = self.options.allOrNoneIndicies[i];

                                    // Get the value (may be null or undefined).
                                    var objectAllOrNone = objectValue.allOrNone[ithAllOrNoneIndex];

                                    // Test if value value.
                                    if (objectAllOrNone) {

                                        // Set the data in the row.
                                        row[ithAllOrNoneIndex] = objectAllOrNone;
                                    }
                                }

                                // Attribute the row with the meta data
                                // from the group from which it sprang.
                                row.meta = objectValue.meta;

                                // If rowDetail is the selected row, then show it selected.
                                if (self.options.selectedRow === objectValue) {

                                    row.selected = true;
                                }

                                // Render out this row.
                                var exceptionRet = m_functionRenderRow(row,
                                    visibleRow,
                                    self.options.renderCursor - self.options.scrollOffsetTop,
                                    iLevel);
                                if (exceptionRet !== null) {

                                    throw exceptionRet;
                                }
                            }

                            // Move to the next row position.
                            self.options.renderCursor += self.options.style.rowHeight;

                            // If open, render out children.
                            if (objectValue.meta.open === true) {

                                // Recurse down.
                                var exceptionRet = m_functionRenderRecurse(objectValue);
                                if (exceptionRet !== null) {

                                    throw exceptionRet;
                                }
                            }
                        }
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render a single row at the specified location.
            var m_functionRenderRow = function (row,
                visibleRow,
                dTop,
                iLevel) {

                try {

                    // Get now.
                    var dNow = new Date().getTime();

                    // Loop over visible columns (which were calculated at the top of render content).
                    var bIceBroken = false;
                    for (var i = self.options.firstVisibleColumn; i <= self.options.lastVisibleColumn; i++) {

                        // Get the ith column.
                        var columnIth = self.options.columns[i];
                        if (!columnIth ||
                            columnIth.visible === false) {

                            continue;
                        }

                        // Compute the left for this cell.
                        var dLeft = self.options.columns[i].left - self.options.scrollOffsetLeft;

                        // Draw column divider.
                        self.options.contextBackground.strokeStyle = self.options.style.columnSeparatorColor;
                        self.options.contextBackground.beginPath();
                        self.options.contextBackground.moveTo(dLeft,
                            dTop);
                        self.options.contextBackground.lineTo(dLeft,
                            dTop + self.options.style.rowHeight);
                        self.options.contextBackground.stroke();

                        // Draw the row background in a single call, from 
                        // the position of the first value to end of grid.
                        if (!bIceBroken) {

                            // Don't draw background again.
                            bIceBroken = true;

                            // Now that the ice is broken, generate the row region.
                            self.options.rowRegions.push({

                                origin: row.origin,
                                rectangle: {

                                    left: dLeft,
                                    top: dTop,
                                    width: self.options.width - dLeft - 1,
                                    height: self.options.style.rowHeight
                                }
                            });

                            // If grouping, the background color is non-normative.
                            if (iLevel >= 0) {

                                // Compute color of row.
                                var dPercent = (iLevel - 1) / self.options.groupingIndicies.length;
                                var dNotPercent = 1 - dPercent;
                                var dRed = Math.floor(dNotPercent * self.options.style.rowHighlight.start.red +
                                    dPercent * self.options.style.rowHighlight.end.red);
                                var dGreen = Math.floor(dNotPercent * self.options.style.rowHighlight.start.green +
                                    dPercent * self.options.style.rowHighlight.end.green);
                                var dBlue = Math.floor(dNotPercent * self.options.style.rowHighlight.start.blue +
                                    dPercent * self.options.style.rowHighlight.end.blue);
                                self.options.contextBackground.fillStyle = "rgb(" +
                                    dRed + "," +
                                    dGreen + "," +
                                    dBlue + ")";

                                // Draw the background.
                                self.options.contextBackground.fillRect(dLeft + 1,
                                   dTop,
                                   self.options.width - dLeft - 1,
                                   self.options.style.rowHeight + 1);
                            }

                            // If selected, show as selected.
                            if (row.selected) {

                                self.options.contextBackground.strokeStyle = self.options.style.textColor;
                                self.options.contextBackground.strokeRect(dLeft + 2,
                                   dTop + 1,
                                   self.options.width - dLeft - 3,
                                   self.options.style.rowHeight - 2);
                            }
                        }

                        // Paint cell.
                        var objectCell = row[columnIth.index];
                        if (objectCell) {

                            // Draw the grouping glyph, if this is a grouping column.
                            var iGroupingOffset = 0;
                            if (columnIth.operation === "group") {

                                // Ensure the text is moved over enough so it does not obscure the glyph.
                                iGroupingOffset = self.options.style.groupingOffset;

                                // Get the meta associated with this row and 
                                // draw it based on its open attribute value.
                                var meta = row.meta;
                                if (meta) {

                                    // Since this row has a meta (and for other reasons) 
                                    // this is a grouping row.  Calculate where to draw the 
                                    // open close glyph.  And then go on to draw the thing.
                                    var rectangleGlyph = {

                                        left: dLeft + self.options.style.groupingLeftPadding,
                                        top: dTop + (self.options.style.rowHeight -
                                            self.options.style.groupingHeight) / 2,
                                        width: self.options.style.groupingWidth,
                                        height: self.options.style.groupingHeight
                                    };

                                    // Add to the collection of open close regions.
                                    self.options.openCloseRegions.push({

                                        meta: meta,
                                        rectangle: rectangleGlyph
                                    });

                                    // Compute radius.
                                    var dRadius = rectangleGlyph.width / 5;
                                    var dHalfWidth = rectangleGlyph.width / 2;
                                    var dHalfHeight = rectangleGlyph.height / 2;

                                    // Start off angle.
                                    var dAngle = Math.PI;
                                    if (!meta.open) {

                                        dAngle -= Math.PI / 2;
                                    }

                                    // Compute point positions.
                                    var point0 = {

                                        left: rectangleGlyph.left + dHalfWidth + dRadius * Math.sin(dAngle),
                                        top: rectangleGlyph.top + dHalfHeight - dRadius * Math.cos(dAngle)
                                    };
                                    dAngle += 2 * Math.PI / 3;
                                    var point1 = {

                                        left: rectangleGlyph.left + dHalfWidth + dRadius * Math.sin(dAngle),
                                        top: rectangleGlyph.top + dHalfHeight - dRadius * Math.cos(dAngle)
                                    };
                                    dAngle += 2 * Math.PI / 3;
                                    var point2 = {

                                        left: rectangleGlyph.left + dHalfWidth + dRadius * Math.sin(dAngle),
                                        top: rectangleGlyph.top + dHalfHeight - dRadius * Math.cos(dAngle)
                                    };

                                    // Draw triangle.
                                    self.options.contextBackground.strokeStyle = self.options.style.openCloseGlyphStroke;
                                    self.options.contextBackground.fillStyle = self.options.style.openCloseGlyphFill;
                                    self.options.contextBackground.beginPath();
                                    self.options.contextBackground.moveTo(point0.left,
                                        point0.top);
                                    self.options.contextBackground.lineTo(point1.left,
                                        point1.top);
                                    self.options.contextBackground.lineTo(point2.left,
                                        point2.top);
                                    self.options.contextBackground.closePath();
                                    self.options.contextBackground.stroke();
                                    self.options.contextBackground.fill();
                                }
                            }

                            // Maintain visible cell render state.
                            var visibleCell = visibleRow[i];
                            if (!visibleCell) {

                                visibleCell = {

                                    value: null,
                                    expiration: undefined
                                };
                                visibleRow[i] = visibleCell;
                            }

                            // Render the cell text.
                            self.options.contextBackground.fillStyle = self.options.style.textColor;
                            if (columnIth.type === "amount") {

                                // Convert to "real" number.
                                var dN = parseFloat(objectCell);

                                // Do some temporary comma insertion.
                                var strN = dN.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                                // Set visible cell state.
                                if (visibleCell.value !== strN &&
                                    visibleCell.expiration === undefined) {

                                    self.options.contextBackground.fillStyle = self.options.style.tickColor;
                                    visibleCell.value = strN;
                                    visibleCell.expiration = dNow + self.options.style.cellHighlightMS;
                                } else if (visibleCell.expiration > dNow) {

                                    self.options.contextBackground.fillStyle = self.options.style.tickColor;
                                } else {

                                    visibleCell.expiration = undefined;
                                }

                                // Right-justify for numbers.
                                var dWidth = self.options.contextBackground.measureText(strN).width;
                                self.options.contextBackground.fillText(strN,
                                    dLeft + columnIth.width - dWidth - self.options.style.horizontalCellOffset,
                                    dTop + self.options.verticalCellOffset);
                            } else if (columnIth.type === "date") {

                                // Convert to "real" date.
                                var date = new Date(objectCell.substr(0, 4),
                                    objectCell.substr(4, 2),
                                    objectCell.substr(6, 2));

                                var strDate = date.toDateString().substr(4);

                                // Draw to the left.
                                self.options.contextBackground.fillText(strDate,
                                    dLeft + self.options.style.horizontalCellOffset + iGroupingOffset,
                                    dTop + self.options.verticalCellOffset);
                            } else {

                                // Draw to the left.
                                self.options.contextBackground.fillText(objectCell,
                                    dLeft + self.options.style.horizontalCellOffset + iGroupingOffset,
                                    dTop + self.options.verticalCellOffset);
                            }
                        }
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Total up the top-level aggregate columns.
            var m_functionTotal = function () {

                try {

                    // Get a reference to the high-level grouping object.
                    var objectData = self.options.data;
                    var arrayKeys = Object.keys(objectData);

                    // Update summing columns.  Note: Identical code in previous code block.
                    for (var j = 0; j < self.options.summingIndicies.length; j++) {

                        // Get the index.
                        var iJthSummingIndex = self.options.summingIndicies[j];

                        // The jthSummingIndexth column.
                        var columnIth = self.options.columns[iJthSummingIndex];
                        if (!columnIth) {

                            continue;
                        }

                        // Loop over the high level items for this 
                        // column, sum and place result in column.
                        var dSum = 0;
                        for (var i = 0; i < arrayKeys.length; i++) {

                            // Get the value.
                            var objectValue = objectData[arrayKeys[i]];
                            dSum += objectValue.summing[iJthSummingIndex];
                        }

                        // Save and move to next summing column.
                        columnIth.total = dSum;
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Helper method removes the row from the nested data structure.
            var m_functionUngroupRow = function (row) {

                try {

                    // Look up UID in collection.
                    var objectUID = row[self.options.uIDColumnIndex].value;
                    var rowFull = self.options.uIDs[objectUID];
                    if (rowFull) {

                        // Remove rowFull.  (Eventually, check if any group-by columns change first....)
                        var exceptionRet = m_functionGroupRow(rowFull,
                            false);
                        if (exceptionRet !== null) {

                            return exceptionRet;
                        }

                        // Remove from UID collection.
                        delete self.options.uIDs[objectUID];
                    } else {

                        // Why complain?
                        return null;
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };
        };

        // Return constructor function instead of singleton instance.
        return functionConstructor;
    });

