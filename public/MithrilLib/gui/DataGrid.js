///////////////////////////////////////
// DataGrid HTML5 canvas control.
//
// Returns function constructor.

"use strict";

// Define module--require MithrilLib-sql for selecting data for in place editing.
define(["/MithrilLib/data/sql.js"],
    function (sql) {

        try {

            // Define constructor function for DataGrid gadget.
            var functionConstructor = function DataGrid(strParentSelector,
                arrayColumns,
                arrayData,
                optionsOverride) {

                var self = this;            // Uber-closure.

                ///////////////////////////////////
                // Public methods.

                // Method de-allocates and de-configures object.
                self.destroy = function () {

                    try {

                        // If the interval has not been set just return--create never completed.
                        if (m_objectInterval === -1) {

                            return null;
                        }

                        // Unwire events.
                        m_jqCanvas.unbind("mousedown",
                            m_functionOnMouseDown);
                        m_jqCanvas.unbind("mousemove",
                            m_functionOnMouseMove);
                        m_jqCanvas.unbind("mouseup",
                            m_functionOnMouseUp);
                        m_jqCanvas.unbind("mouseout",
                            m_functionOnMouseUp);
                        m_jqCanvas.unbind("dblclick",
                            m_functionDoubleClick);
                        m_jqCanvas.unbind("keydown",
                            m_functionOnKeyDown);
                        m_jqCanvas.unbind("keypress",
                            m_functionOnKeyPress);
                        m_jqCanvas.unbind("keyup",
                            m_functionOnKeyUp);

                        // These two are a bit different!?
                        m_canvasRender.onmousewheel = null;
                        $(window).unbind("resize",
                            m_functionResize);

                        // Stop the update timer.
                        clearInterval(m_objectInterval);

                        // Clear GUI.
                        m_jqParent.empty();
                    } catch (e) {

                        return e;
                    }
                };

                // Method called to retrieve the selected rows from the grid.
                self.getSelectedRows = function () {

                    try {

                        var arrayRet = [];

                        // Loop over all selected rows.
                        for (var i = 0; i < m_arraySelectedRows.length; i++) {

                            // Get the index from the collection.
                            var iIndex = m_arraySelectedRows[i];

                            // Selection indicies are relative to the view.
                            var row = m_arrayView[iIndex];

                            // Add to collection to return to called.
                            arrayRet.push(row);
                        }
                        return arrayRet;
                    } catch (e) {

                        return e;
                    }
                };

                // Add or update row in blotter.
                self.mergeRow = function (arrayRow) {

                    try {

                        // If not already in internal format, then convert.
                        if (!Array.isArray(arrayRow)) {

                            // Convert row from public form to internal form.
                            var row = [];
                            for (var j = 0; j < arrayColumns.length; j++) {

                                var columnJth = arrayColumns[j];
                                if (!columnJth) {

                                    continue;
                                }

                                row.push({

                                    index: j,
                                    value: arrayRow[columnJth.mapping]
                                });
                            }
                            arrayRow = row;
                        }

                        // Determine if the row is an add or an update.

                        // Must support UID column to get by UID.
                        var iUIDColumnIndex = m_options.uidColumnIndex;
                        if (iUIDColumnIndex === null ||
                            iUIDColumnIndex === -1 ||
                            iUIDColumnIndex === undefined) {

                            throw { message: "Cannot merge row with no UID column index set." };
                        }

                        var strUID = arrayRow[iUIDColumnIndex].value;

                        var iRowIndex = m_functionGetRowIndexByUID(strUID);
                        if (iRowIndex === -1) {

                            // Mark the vertical scroll bar for "out of sync".
                            m_bVerticalScrollBarEaselDirty = true;
                            m_bVerticalScrollBarDirty = true;

                            // Resort?
                            m_bViewSortDirty = true;

                            // Add.
                            // Note: this row must be complete and is assumed to be in AddRow.
                            return m_functionAddRow(arrayRow);
                        } else {

                            // Update.
                            // Note: this row is assumed to be a row-template in 
                            // UpdateCells--i.e. it is incomplete and cell.index 
                            // indicates where the Ith cell goes into a full row.
                            return m_functionUpdateCells(arrayRow,
                                strUID,
                                iRowIndex);
                        }

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Remove all data from blotter.
                self.clearData = function () {

                    try {

                        m_arrayData = [];
                        m_arrayView = [];

                        m_objectInterval = -1;
                        m_strDownRegion = null;
                        m_pointDown = null;
                        m_sizeDrag = null;
                        m_iInitialFirstVisibleRow = 0;
                        m_dInitialScrollOffsetX = 0;
                        m_arraySelectedRows = [];
                        m_iLastSelectedRow = -1;

                        m_dVerticalScrollBar_PixelsPerRow = 0;
                        m_dHorizontalScrollBar_PixelsPerPixel = 0;
                        m_dThumbLeft = 0;
                        m_dThumbTop = 0;
                        m_dThumbWidth = 0;
                        m_dThumbHeight = 0;
                        m_iFirstVisibleRow = 0;
                        m_dScrollOffsetX = 0;
                        m_iNumberOfVisibleRows = 0;

                        // Mark dirty.
                        m_bColumnHeaderDirty = true;
                        m_bColumnHeaderEaselDirty = true;
                        m_bComponentRectanglesDirty = true;
                        m_bHorizontalScrollBarDirty = true;
                        m_bHorizontalScrollBarEaselDirty = true;
                        m_bVerticalScrollBarDirty = true;
                        m_bVerticalScrollBarEaselDirty = true;
                        m_bNullBottomRightDirty = true;
                        m_bNullTopRightDirty = true;

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Return all data.
                self.getData = function () {

                    return m_arrayData;
                };

                // Method fixes up all total values.
                self.updateTotals = function () {

                    return m_functionComputeTotals();
                };

                // Public helper calls private keydown method.
                self.simulateKeyPress = function (e) {

                    try {

                        m_functionOnKeyDown(e);
                    } catch (e) {

                        return e;
                    }
                };

                // Method called to specify the selected row indicies.
                self.setSelectedRowIndicies = function (arraySelectedRows) {

                    try {

                        m_arraySelectedRows = arraySelectedRows;

                        // Set the last selection to the last element.
                        if (m_arraySelectedRows !== null &&
                            m_arraySelectedRows.length > 0) {

                            m_iLastSelectedRow = m_arraySelectedRows[m_arraySelectedRows.length - 1];
                        } else {

                            // If no selection, then reset.
                            m_iLastSelectedRow = -1;
                        }

                        return m_functionRender();
                    } catch (e) {

                        return e;
                    }
                };

                /////////////////////////////////
                // Private methods.

                // Method allocates and configures object.
                var m_functionCreate = function () {

                    try {

                        // Process options, if specified.
                        var exceptionRet = null;
                        if (optionsOverride) {

                            // merge options override into m_options.
                            exceptionRet = m_functionProcessOptionsOverride();
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        }

                        // Store base class fields in local fields.
                        m_jqParent = $(strParentSelector);
                        m_elementParent = m_jqParent[0];

                        // Map up several properties if rendering as a drop down.
                        if (m_options.renderAsDropDown) {

                            // Row colors don't alternate.
                            m_options.row.backgroundAlternate = m_options.row.background;

                            // Cell colors don't change.
                            m_options.cell.colorUpTick = m_options.cell.colorText;
                            m_options.cell.colorUpTick = m_options.cell.colorText;
                            m_options.cell.colorDownTick = m_options.cell.colorText;
                            m_options.cell.colorChange = m_options.cell.colorText;
                        }

                        // Pre-process columns:
                        // Scan the columns for minimum width compliance.
                        for (var i = 0; i < arrayColumns.length; i++) {

                            // Extract column.
                            var columnIth = arrayColumns[i];

                            // Test for minimum width.
                            if (columnIth.width === undefined ||
                                columnIth.width < m_options.columnHeader.minimumWidth) {

                                columnIth.width = m_options.columnHeader.minimumWidth;
                            }

                            // Check for and update UID column index, if found.
                            if (columnIth.uid !== undefined &&
                                columnIth.uid === true) {

                                m_options.uidColumnIndex = i;
                            }

                            // Also adjust the total bool.
                            if (columnIth.total === undefined) {

                                columnIth.total = false;
                            }

                            // Finally, look for select sql.
                            if (columnIth.inPlaceEdit !== undefined) {

                                columnIth.select = true;

                                if (columnIth.inPlaceEdit.sql) {

                                    // Define method to get data and store in columnSelect.values.
                                    var functionGetSelectData = function (columnSelect) {

                                        try {

                                            // Execute query to get column data.
                                            var exceptionRet = sql.execute(columnSelect.inPlaceEdit.sql,
                                                function (arrayValues) {

                                                    try {

                                                        // Initialize collection.
                                                        columnSelect.values = [];

                                                        // Load all values into column values collection.
                                                        for (var i = 0; i < arrayValues.length; i++) {

                                                            // Extract each value and store in column's values collection.
                                                            var rowIth = arrayValues[i];
                                                            var strValue = rowIth[columnSelect.inPlaceEdit.valueColumn].toString();
                                                            columnSelect.values.push(strValue);
                                                        }
                                                    } catch (e) {

                                                        alert(e.message);
                                                    }
                                                },
                                                function (strError) {

                                                    alert(strError);
                                                },
                                                true);
                                            if (exceptionRet !== null) {

                                                throw exceptionRet;
                                            }

                                            return null;
                                        } catch (e) {

                                            return e;
                                        }
                                    };

                                    // Call select data method.
                                    var exceptionRet = functionGetSelectData(columnIth);
                                    if (exceptionRet !== null) {

                                        throw exceptionRet;
                                    }
                                } else {

                                    // Just move values over.
                                    columnIth.values = columnIth.inPlaceEdit.values;
                                }
                            } else {

                                columnIth.select = false;
                            }
                        }

                        // Update object state.
                        m_arrayColumns = arrayColumns;

                        // Set object state.
                        m_dWidth = m_jqParent.width();
                        m_dHeight = m_jqParent.height();

                        m_strParentSelector = strParentSelector;

                        // Create the render canvas.
                        m_jqCanvas = $("<canvas tabindex='1'></canvas>");
                        m_canvasRender = m_jqCanvas[0];
                        m_canvasRender.id = "Render" + Math.random().toString();
                        m_canvasRender.width = m_dWidth;
                        m_canvasRender.height = m_dHeight;
                        m_canvasRender.style.background = m_options.background;
                        m_canvasRender.style.outline = "none";
                        m_contextRender = m_canvasRender.getContext("2d");
                        m_jqParent.append(m_canvasRender);

                        // Create the column header easel canvas later (at the end of  m_functionCalculateComponentRectangles)....

                        // Create the vertical scrollbar easel canvas.
                        m_canvasVerticalScrollBarEasel = document.createElement("canvas");
                        m_canvasVerticalScrollBarEasel.width = m_options.scrollBar.width;
                        m_canvasVerticalScrollBarEasel.height = m_dHeight;
                        m_canvasVerticalScrollBarEasel.style.background = m_options.background;
                        m_contextVerticalScrollBarEasel = m_canvasVerticalScrollBarEasel.getContext("2d");

                        // Create the vertical draggable element.
                        exceptionRet = m_functionCreateVerticalDragElement();
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }

                        // Create the horizontal scrollbar easel canvas.
                        m_canvasHorizontalScrollBarEasel = document.createElement("canvas");
                        m_canvasHorizontalScrollBarEasel.width = m_dWidth;
                        m_canvasHorizontalScrollBarEasel.height = m_options.scrollBar.height;
                        m_canvasHorizontalScrollBarEasel.style.background = m_options.background;
                        m_contextHorizontalScrollBarEasel = m_canvasHorizontalScrollBarEasel.getContext("2d");

                        // Create the Horizontal draggable element.
                        exceptionRet = m_functionCreateHorizontalDragElement();
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }

                        // Create the work easel canvas.
                        m_canvasWorkEasel = document.createElement("canvas");
                        m_canvasWorkEasel.width = m_dWidth;
                        m_canvasWorkEasel.height = m_options.columnHeader.height;
                        m_canvasWorkEasel.style.background = m_options.background;
                        m_contextWorkEasel = m_canvasWorkEasel.getContext("2d");

                        // Wire events.
                        m_jqCanvas.bind("mousedown",
                            m_functionOnMouseDown);
                        m_jqCanvas.bind("mousemove",
                            m_functionOnMouseMove);
                        m_jqCanvas.bind("mouseup",
                            m_functionOnMouseUp);
                        m_jqCanvas.bind("mouseout",
                            m_functionOnMouseUp);
                        m_jqCanvas.bind("dblclick",
                            m_functionDoubleClick);
                        m_jqCanvas.bind("keydown",
                            m_functionOnKeyDown);
                        m_jqCanvas.bind("keypress",
                            m_functionOnKeyPress);
                        m_jqCanvas.bind("keyup",
                            m_functionOnKeyUp);

                        // Can't use jQuery bind on mousewheel!?
                        m_canvasRender.onmousewheel = m_functionOnScroll;

                        // Resize must be bound to window directly.
                        $(window).bind("resize",
                            m_functionResize);

                        // Merge in data.
                        if (arrayData !== undefined &&
                            arrayData !== null) {

                            // Loop over all rows.
                            for (var i = 0; i < arrayData.length; i++) {

                                // Get ith row.
                                var rowIth = arrayData[i];
                                if (!rowIth) {

                                    continue;
                                }

                                // Merge it in.
                                exceptionRet = self.mergeRow(rowIth);
                                if (exceptionRet !== null) {

                                    throw exceptionRet;
                                }
                            }
                        }

                        // Start up the render "thread".
                        m_objectInterval = setInterval(m_functionRender,
                            m_options.updateFrequency);

                        // And render up front.
                        return m_functionRender();
                    } catch (e) {

                        return e;
                    }
                };

                // Add row to grid.
                var m_functionAddRow = function (arrayRow) {

                    try {

                        // Note: arrayRow must be a complete row.
                        // A partial row can be passed into merge.

                        // Insert the row into the root datastore.
                        m_arrayData.push(arrayRow);

                        // Find out if this new row passes view muster.
                        if (m_functionFilterRow(arrayRow)) {

                            // Push on end.
                            m_arrayView.push(arrayRow);

                            // Mark dirty.
                            m_bColumnHeaderDirty = true;
                            m_bColumnHeaderEaselDirty = true;
                            m_bComponentRectanglesDirty = true;
                            m_bHorizontalScrollBarDirty = true;
                            m_bHorizontalScrollBarEaselDirty = true;
                            m_bVerticalScrollBarDirty = true;
                            m_bVerticalScrollBarEaselDirty = true;
                            m_bNullBottomRightDirty = true;
                            m_bNullTopRightDirty = true;
                            m_bViewDirty = true;

                            // Adjust number of visible rows.
                            m_iNumberOfVisibleRows++;
                        }

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Remove row from blotter.
                // Note: uid passed must match existing UID in grid.
                var m_functionRemoveRow = function (uid) {

                    try {

                        // Get the index of the specified row.
                        var iIndex = m_functionGetRowIndexByUID(uid);
                        if (iIndex === -1) {

                            return null;
                        }

                        // Splice out row.
                        m_arrayData.splice(iIndex,
                            1);

                        // Get the index of the specified row in the view, if present, remove and possibly adjust totals.
                        var iIndexView = m_functionGetViewRowIndexByUID(uid);
                        if (iIndexView !== -1) {

                            // Splice out row.
                            m_arrayView.splice(iIndexView,
                                1);

                            // Adjust number of visible rows.
                            m_iNumberOfVisibleRows--;
                        }

                        // Mark dirty.
                        m_bColumnHeaderDirty = true;
                        m_bColumnHeaderEaselDirty = true;
                        m_bComponentRectanglesDirty = true;
                        m_bHorizontalScrollBarDirty = true;
                        m_bHorizontalScrollBarEaselDirty = true;
                        m_bVerticalScrollBarDirty = true;
                        m_bVerticalScrollBarEaselDirty = true;
                        m_bNullBottomRightDirty = true;
                        m_bNullTopRightDirty = true;

                        // Cause immediate render.
                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Update data in grid.
                // Note: uid passed must match existing UID in grid.
                var m_functionUpdateCells = function (arrayRowTemplate,
                    strUID,
                    iIndex) {

                    try {

                        // Get row by index before...
                        var arrayRow = m_arrayData[iIndex];
                        // ...splicing out row from the data source collection.
                        m_arrayData.splice(iIndex,
                            1);

                        // Get the index of the specified row in the view.
                        var iViewIndex = m_functionGetViewRowIndexByUID(strUID);
                        if (iViewIndex !== -1) {

                            // Splice out row.
                            m_arrayView.splice(iViewIndex,
                                1);

                            // Mark dirty.
                            m_bColumnHeaderDirty = true;
                            m_bColumnHeaderEaselDirty = true;
                            m_bComponentRectanglesDirty = true;
                            m_bHorizontalScrollBarDirty = true;
                            m_bHorizontalScrollBarEaselDirty = true;
                            m_bVerticalScrollBarDirty = true;
                            m_bVerticalScrollBarEaselDirty = true;
                            m_bNullBottomRightDirty = true;
                            m_bNullTopRightDirty = true;

                            // Keep number of rows in sync.
                            m_iNumberOfVisibleRows--;
                        }

                        // Update row--merge into arrayRow.

                        // Loop over each specified cell in the row array template.
                        for (var i = 0; i < arrayRowTemplate.length; i++) {

                            // Get the Ith cell.
                            var cellIth = arrayRowTemplate[i];

                            // Get this cell's new value.
                            var objectValue = cellIth.value;

                            // Update cell.
                            arrayRow[cellIth.index].value = objectValue;
                        }

                        // Add row back.
                        return m_functionAddRow(arrayRow);
                    } catch (e) {

                        return e;
                    }
                };

                // Get the index of the row which matches the specified UID from the data array.
                var m_functionGetRowIndexByUID = function (uid) {

                    try {

                        // Loop over all rows.
                        for (var i = 0; i < m_arrayData.length; i++) {

                            // When found, simply return current index.
                            if (m_arrayData[i][m_options.uidColumnIndex].value === uid) {

                                return i;
                            }
                        }

                        // Return "null".
                        return -1;
                    } catch (e) {

                        return e;
                    }
                };

                // Get the index of the row which matches the specified UID from the view array.
                var m_functionGetViewRowIndexByUID = function (uid) {

                    try {

                        // Loop over all rows.
                        for (var i = 0; i < m_arrayView.length; i++) {

                            // When found, simply return current index.
                            if (m_arrayView[i][m_options.uidColumnIndex].value === uid) {

                                return i;
                            }
                        }

                        // Return "null".
                        return -1;
                    } catch (e) {

                        return e;
                    }
                };

                // Process filter and sort into view collection from data collection.
                var m_functionBuildView = function () {

                    try {

                        // Reset view and selected items.
                        m_arrayView = [];
                        m_arraySelectedRows = [];

                        // Don't blow up!
                        if (m_arrayData === undefined ||
                            m_arrayData === null) {

                            m_arrayData = [];
                        }

                        // Test each row.
                        for (var iRow = 0; iRow < m_arrayData.length; iRow++) {

                            // Get the ith row.
                            var rowIth = m_arrayData[iRow];

                            // Add rows which pass all filters.
                            if (m_functionFilterRow(rowIth)) {

                                m_arrayView.push(rowIth);
                            }
                        }

                        // Calculate object state for use for rendering grid.
                        m_iNumberOfVisibleRows = m_arrayView.length;

                        // Must re-apply sort when filter is applied.
                        m_bViewSortDirty = true;

                        // Recalculate totals from the ground up.
                        return m_functionComputeTotals();
                    } catch (e) {

                        return e;
                    }
                };

                // Allocate and initialze the overlay element that helps with horizontal dragging.
                var m_functionCreateHorizontalDragElement = function () {

                    try {

                        // Create the Horizontal draggable element.
                        m_divHorizontalDraggable = document.createElement("div");
                        $(m_divHorizontalDraggable).css({

                            position: "absolute",
                            left: "0px",
                            top: "0px",
                            width: "0px",
                            height: "0px",
                            "z-index": 100,
                            background: "transparent"
                        });

                        // Add to DOM.
                        m_jqParent.append(m_divHorizontalDraggable);

                        // Make it a draggable.
                        $(m_divHorizontalDraggable).draggable({

                            // Get the start coordinates.
                            start: function (evt, ui) {

                                var x = (evt.pageX - $(m_divHorizontalDraggable).offset().left) + $(window).scrollLeft();
                                var y = (evt.pageY - $(m_divHorizontalDraggable).offset().top) + $(window).scrollTop();

                                m_objectHorizontalDraggableStart = {

                                    x: x,
                                    y: y
                                };
                                m_dInitialScrollOffsetX = m_dScrollOffsetX;
                            },

                            // Scroll.
                            drag: function (evt, ui) {

                                var x = (evt.pageX - $(m_divHorizontalDraggable).offset().left) + $(window).scrollLeft();
                                var y = (evt.pageY - $(m_divHorizontalDraggable).offset().top) + $(window).scrollTop();

                                var dDX = x - m_objectHorizontalDraggableStart.x;
                                var dDY = y - m_objectHorizontalDraggableStart.y;

                                m_sizeDrag = {

                                    width: dDX,
                                    height: dDY
                                };

                                // After setting size drag, just simulate out the mouse move.
                                var exceptionRet = m_functionHorizontalScroll();
                                if (exceptionRet !== null) {

                                    alert(exceptionRet.message);
                                }
                            },

                            // Reset coordinates.
                            stop: function (evt, ui) {

                                m_objectHorizontalDraggableStart = null;
                            },

                            // Ensure the element itself is not dragged.
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

                        // Create it.
                        m_divVerticalDraggable = document.createElement("div");

                        // configure GUI.
                        $(m_divVerticalDraggable).css({

                            position: "absolute",
                            padding: "none",
                            margin: "none",
                            left: "0px",
                            top: "0px",
                            width: "0px",
                            height: "0px",
                            "z-index": 100,
                            background: "transparent"
                        });

                        // Add to DOM.
                        m_jqParent.append(m_divVerticalDraggable);

                        // Make it a draggable.
                        $(m_divVerticalDraggable).draggable({

                            // Get the start coordinates.
                            start: function (evt, ui) {

                                var x = (evt.pageX - $(m_divVerticalDraggable).offset().left) + $(window).scrollLeft();
                                var y = (evt.pageY - $(m_divVerticalDraggable).offset().top) + $(window).scrollTop();

                                m_objectVerticalDraggableStart = {

                                    x: x,
                                    y: y
                                };
                                m_iInitialFirstVisibleRow = m_iFirstVisibleRow;
                            },

                            // Scroll.
                            drag: function (evt, ui) {

                                var x = (evt.pageX - $(m_divVerticalDraggable).offset().left) + $(window).scrollLeft();
                                var y = (evt.pageY - $(m_divVerticalDraggable).offset().top) + $(window).scrollTop();

                                var dDX = x - m_objectVerticalDraggableStart.x;
                                var dDY = y - m_objectVerticalDraggableStart.y;

                                m_sizeDrag = {

                                    width: dDX,
                                    height: dDY
                                };

                                // After setting size drag, just simulate out the mouse move.
                                var exceptionRet = m_functionVerticalScroll();
                                if (exceptionRet !== null) {

                                    alert(exceptionRet.message);
                                }
                            },

                            // Reset coordinates.
                            stop: function (evt, ui) {

                                m_objectVerticalDraggableStart = null;
                            },

                            // Ensure the element itself is not dragged.
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

                    try {

                        // Process each column that has a filter.  Row must pass all filters.
                        var bPass = true;
                        for (var iColumn = 0; iColumn < m_arrayColumns.length; iColumn++) {

                            // Get the ith column.
                            var columnIth = m_arrayColumns[iColumn];

                            // Get the filter.
                            var arrayFilter = columnIth.filter;
                            if (arrayFilter === undefined ||
                                arrayFilter === null) {

                                continue;
                            }

                            // Get the filter target value.
                            var cell = rowIth[iColumn];
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
                    } catch (e) {

                        return false;
                    }
                };

                // Sort filtered view rows.
                var m_functionSortView = function () {

                    try {

                        // Process the columns into sort collection.
                        var arraySortInfo = [];
                        for (var i = 0; i < m_arrayColumns.length; i++) {

                            // Get the Ith column.
                            var columnIth = m_arrayColumns[i];

                            // Check that this column is part of the sort.
                            if (columnIth.sortOrder === undefined ||
                                columnIth.sortOrder === 0) {

                                continue;
                            }

                            // Store the info.
                            arraySortInfo.push({

                                order: columnIth.sortOrder,
                                direction: columnIth.sortDirection,
                                columnIndex: i
                            });
                        }

                        if (arraySortInfo.length === 0) {

                            return null;
                        }

                        // Sort the info.
                        arraySortInfo.sort(function (a, b) {

                            // Implement quick in-line sort function which looks at the row's cell's value.
                            return (a.order > b.order ? 1 : ((a.order < b.order ? -1 : 0)));
                        });

                        // Now, sort the view using the arraySort as the precedence collection.
                        m_arrayView.sort(function (a, b) {

                            var iPrecedence = 0;

                            while (iPrecedence < arraySortInfo.length) {

                                var iIndex = arraySortInfo[iPrecedence].columnIndex;
                                var strDirection = arraySortInfo[iPrecedence].direction;
                                iPrecedence++;

                                var objectA = a[iIndex].value;
                                var objectB = b[iIndex].value;
                                var iRet = (objectA > objectB ? 1 : ((objectA < objectB ? -1 : 0)));
                                if (iRet !== 0) {

                                    return iRet * (strDirection === "Ascending" ? 1 : -1);
                                }
                            }

                            // Since still equal, given all specified sort criteria, return 0.
                            return 0;
                        });

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Method loops over all columns, totalling and which are totalable.
                var m_functionComputeTotals = function () {

                    try {

                        if (m_options.columnHeader.totalable) {

                            // Loop over all columns.
                            for (var iColumn = 0; iColumn < m_arrayColumns.length; iColumn++) {

                                // Get the Ith column.
                                var columnIth = m_arrayColumns[iColumn];

                                // Test for total.
                                if (columnIth.total === false) {

                                    continue;
                                }

                                // Loop over all rows, total row.
                                var dTotal = 0;
                                for (var iRow = 0; iRow < m_arrayView.length; iRow++) {

                                    dTotal += m_arrayView[iRow][iColumn].value;
                                }

                                // Store in column.
                                columnIth.totalValue = dTotal;
                            }
                        }

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Method calculates where all the sub-regions are relative to the render canvas.
                var m_functionCalculateComponentRectangles = function () {

                    try {

                        // Question: which of the scroll bars are visible?

                        // Figure out the total column width.
                        // TODO: Move this when column sizing is in place.
                        m_dTotalColumnWidth = 0;
                        for (var i = 0; i < m_arrayColumns.length; i++) {

                            if (m_arrayColumns[i].visible === false) {

                                continue;
                            }
                            m_dTotalColumnWidth += m_arrayColumns[i].width;
                        }

                        // Calculate required content size.
                        var dContentHeight = m_iNumberOfVisibleRows * m_options.row.height;
                        var dContentWidth = m_dTotalColumnWidth;

                        // Calculate how high the column header is based on actual optional rows.
                        var dTotalColumnHeaderHeight = 0;
                        if (m_options.columnHeader.visible) {

                            dTotalColumnHeaderHeight = m_options.columnHeader.height + ((m_options.columnHeader.filterable) ?
                                m_options.columnHeader.height :
                                0) + ((m_options.columnHeader.totalable) ?
                                m_options.columnHeader.height :
                                0);
                        }

                        // Calculate how wide is the row header.
                        var dRowHeaderWidth = 0;
                        if (m_options.rowHeader.visible) {

                            dRowHeaderWidth = m_options.rowHeader.width;
                        }

                        // Four cases, some with mild recursive tendencies.
                        var dWorkHeight = m_dHeight - dTotalColumnHeaderHeight;
                        var dWorkWidth = m_dWidth - dRowHeaderWidth;

                        if (dWorkWidth >= dContentWidth &&
                            dWorkHeight >= dContentHeight) {

                            // Safely inside bounds.  No scroll bars.
                            m_bVerticalScrollBarVisible = false;
                            m_bHorizontalScrollBarVisible = false;
                        } else if (dWorkWidth < dContentWidth &&
                            dWorkHeight >= dContentHeight) {

                            // Horizontal must be turned on.
                            m_bHorizontalScrollBarVisible = true;

                            // Now re-check vertical:
                            if (dWorkHeight - m_options.scrollBar.height >= dContentHeight) {

                                m_bVerticalScrollBarVisible = false;
                            } else {

                                m_bVerticalScrollBarVisible = true;
                            }
                        } else if (dWorkWidth >= dContentWidth &&
                            dWorkHeight < dContentHeight) {

                            // Vertical must be turned on.
                            m_bVerticalScrollBarVisible = true;

                            // Now re-check horizontal:
                            if (dWorkWidth - m_options.scrollBar.width >= dContentWidth) {

                                m_bHorizontalScrollBarVisible = false;
                            } else {

                                m_bHorizontalScrollBarVisible = true;
                            }
                        } else {

                            // Both scroll bars must be turned on.
                            m_bVerticalScrollBarVisible = true;
                            m_bHorizontalScrollBarVisible = true;
                        }

                        // If the scroll bar is not visible, then it is 0-width or height.
                        var dHorizontalScrollBarHeight = 0;
                        var dVerticalScrollBarWidth = 0;
                        if (m_bHorizontalScrollBarVisible) {

                            dHorizontalScrollBarHeight = m_options.scrollBar.height;
                        }
                        if (m_bVerticalScrollBarVisible) {

                            dVerticalScrollBarWidth = m_options.scrollBar.width;
                        }

                        // Based on what scroll bars are visible, gaps may appear, configure if visible.
                        if (m_bVerticalScrollBarVisible) {

                            m_rectangleNullTopRight = {

                                left: m_dWidth - m_options.scrollBar.width,
                                top: 0,
                                width: m_options.scrollBar.width,
                                height: dTotalColumnHeaderHeight
                            };

                            if (m_bHorizontalScrollBarVisible) {

                                m_rectangleNullBottomRight = {

                                    left: m_dWidth - m_options.scrollBar.width,
                                    top: m_dHeight - m_options.scrollBar.height,
                                    width: m_options.scrollBar.width,
                                    height: m_options.scrollBar.height
                                };
                            }
                        }

                        // Set the region bounds.
                        m_rectangleColumnHeaders = {

                            left: dRowHeaderWidth,
                            top: 0,
                            width: Math.max(m_dWidth - dVerticalScrollBarWidth - dRowHeaderWidth, 0),
                            height: Math.max(dTotalColumnHeaderHeight, 0)
                        };

                        m_rectangleRowHeaders = {

                            left: 0,
                            top: 0,
                            width: dRowHeaderWidth,
                            height: Math.max(dTotalColumnHeaderHeight, 0)
                        };

                        m_rectangleContent = {

                            left: dRowHeaderWidth,
                            top: Math.max(m_rectangleColumnHeaders.height, 0),
                            width: Math.max(m_dWidth - dVerticalScrollBarWidth - dRowHeaderWidth, 0),
                            height: Math.max(m_dHeight - (dTotalColumnHeaderHeight + dHorizontalScrollBarHeight), 0)
                        };

                        m_rectangleVerticalScrollBar = {

                            left: Math.max(m_dWidth - dVerticalScrollBarWidth, 0),
                            top: Math.max(m_rectangleColumnHeaders.height, 0),
                            width: Math.max(dVerticalScrollBarWidth, 0),
                            height: Math.max(m_dHeight - (dTotalColumnHeaderHeight + dHorizontalScrollBarHeight), 0)
                        };

                        m_rectangleHorizontalScrollBar = {

                            left: dRowHeaderWidth,
                            top: Math.max(m_dHeight - dHorizontalScrollBarHeight, 0),
                            width: Math.max(m_dWidth - dVerticalScrollBarWidth - dRowHeaderWidth, 0),
                            height: Math.max(dHorizontalScrollBarHeight, 0)
                        };

                        // Move the vert scroller into position.
                        $(m_divVerticalDraggable).css({

                            left: m_rectangleVerticalScrollBar.left + "px",
                            top: m_rectangleVerticalScrollBar.top + "px",
                            width: m_rectangleVerticalScrollBar.width + "px",
                            height: m_rectangleVerticalScrollBar.height + "px"
                        });

                        // Move the vert scroller into position.
                        $(m_divHorizontalDraggable).css({

                            left: m_rectangleHorizontalScrollBar.left + "px",
                            top: m_rectangleHorizontalScrollBar.top + "px",
                            width: m_rectangleHorizontalScrollBar.width + "px",
                            height: m_rectangleHorizontalScrollBar.height + "px"
                        });

                        // Cause render of regions on next render pass.
                        m_bColumnHeaderDirty = true;
                        m_bRowHeaderDirty = true;
                        m_bContentDirty = true;
                        m_bHorizontalScrollBarDirty = true;
                        m_bVerticalScrollBarDirty = true;
                        m_bNullTopRightDirty = true;
                        m_bNullBottomRightDirty = true;

                        // Calculate the number of visible rows given these region bounds.
                        m_iVisibleRows = Math.floor(m_rectangleContent.height / m_options.row.height) + 1;

                        // Possibly fix up the m_dScrollOffsetX value.
                        if (m_dTotalColumnWidth > m_rectangleColumnHeaders.width) {

                            if (m_rectangleColumnHeaders.width + m_dScrollOffsetX > m_dTotalColumnWidth) {

                                m_dScrollOffsetX = m_dTotalColumnWidth - m_rectangleColumnHeaders.width;
                            }
                        } else {

                            if (m_rectangleColumnHeaders.width > m_dTotalColumnWidth + m_dScrollOffsetX) {

                                m_dScrollOffsetX = 0;
                            }
                        }

                        // Update column header easel size and re-allocate.  Its size is 
                        // based on variables determined on column resize or initial create.
                        m_canvasColumnHeaderEasel = document.createElement("canvas");
                        m_canvasColumnHeaderEasel.width = m_dTotalColumnWidth < m_dWidth ?
                            m_dWidth :
                            m_dTotalColumnWidth;
                        m_canvasColumnHeaderEasel.height = m_options.columnHeader.height * 3;  // Account for all possible header rows.
                        m_canvasColumnHeaderEasel.style.background = "white";//m_options.background;
                        m_contextColumnHeaderEasel = m_canvasColumnHeaderEasel.getContext("2d");

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Render out the column header easel.
                var m_functionRenderColumnHeaderEasel = function () {

                    try {

                        // Set context text state.
                        m_contextColumnHeaderEasel.font = m_options.columnHeader.font;
                        m_contextColumnHeaderEasel.textAlign = "left";
                        m_contextColumnHeaderEasel.textBaseline = "top";

                        // Set work text state.
                        m_contextWorkEasel.font = m_options.columnHeader.font;
                        m_contextWorkEasel.fillStyle = (m_bInPlaceEditing ? m_options.columnHeader.colorFilterTextInPlaceEdit : m_options.columnHeader.colorFilterText);
                        m_contextWorkEasel.textAlign = "left";
                        m_contextWorkEasel.textBaseline = "top";

                        // Loop over columns.
                        var iX = 0;
                        var dTop = 0;
                        var dRowHeight = m_options.columnHeader.height;
                        var dHeight = m_rectangleColumnHeaders.height;

                        // Calculate how tall the font is.
                        var dHeightGap = 2;

                        for (var i = 0; i < m_arrayColumns.length; i++) {

                            // Get the Ith column.
                            var columnIth = m_arrayColumns[i];

                            // Skip if invisible.
                            if (columnIth.visible === false) {

                                continue;
                            }

                            // Compute the bounds for this column header.
                            var dLeft = iX;
                            var dWidth = columnIth.width;

                            // Render background.
                            m_contextColumnHeaderEasel.fillStyle = m_options.columnHeader.background;
                            m_contextColumnHeaderEasel.fillRect(dLeft,
                                dTop,
                                dWidth,
                                dHeight);

                            // Get the text.
                            var strTitle = columnIth.title;

                            var dWidthGap = 0;

                            // Width is another matter.
                            var dTitleWidth = m_contextColumnHeaderEasel.measureText(strTitle).width;

                            var strLineAlignment = columnIth.lineAlignment;
                            if (strLineAlignment === "right") {

                                dWidthGap = dWidth - dTitleWidth - m_options.columnHeader.padding;
                            } else if (strLineAlignment === "center") {

                                dWidthGap = (dWidth - dTitleWidth) / 2;
                            }

                            // Ensure not justified too far.            
                            if (dWidthGap < m_options.columnHeader.padding) {

                                dWidthGap = m_options.columnHeader.padding;
                            }

                            // Render the column title.
                            m_contextColumnHeaderEasel.fillStyle = (m_bInPlaceEditing ? m_options.columnHeader.colorTextInPlaceEdit : m_options.columnHeader.colorText);
                            m_contextColumnHeaderEasel.fillText(strTitle,
                                dLeft + dWidthGap,
                                dTop + dHeightGap);

                            // Draw the title separator line.
                            m_contextColumnHeaderEasel.strokeStyle = m_options.columnHeader.colorSeparator;
                            m_contextColumnHeaderEasel.lineWidth = 1;
                            m_contextColumnHeaderEasel.beginPath();
                            m_contextColumnHeaderEasel.moveTo(0,
                                dTop + dRowHeight - 0.5);
                            m_contextColumnHeaderEasel.lineTo(m_dTotalColumnWidth,
                                dTop + dRowHeight - 0.5);
                            m_contextColumnHeaderEasel.stroke();

                            // Render the filter.
                            if (m_options.columnHeader.filterable &&
                                (columnIth.type === "string" ||
                                 columnIth.type === "date")) {

                                // Compute width and height.
                                var dFilterWidth = dWidth - 2 * m_options.columnHeader.paddingFilter;
                                var dFilterHeight = m_options.columnHeader.height - 2 * m_options.columnHeader.paddingFilter + 2;

                                // Clear the work easel.
                                if (m_bInPlaceEditing) {

                                    m_contextWorkEasel.fillStyle = m_options.columnHeader.backgroundFilterInPlaceEdit;
                                } else {

                                    m_contextWorkEasel.fillStyle = m_options.columnHeader.backgroundFilter;
                                }
                                m_contextWorkEasel.fillRect(0,
                                    0,
                                    dFilterWidth,
                                    dFilterHeight);

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
                                m_contextWorkEasel.fillStyle = (m_bInPlaceEditing ? m_options.columnHeader.colorFilterTextInPlaceEdit : m_options.columnHeader.colorFilterText);
                                m_contextWorkEasel.fillText(strFilter,
                                    m_options.columnHeader.paddingFilter / 2,
                                    0);

                                // Copy over from work canvas to column header easel.
                                var dUseWidth = Math.min(m_canvasWorkEasel.width,
                                    dFilterWidth);
                                var dUseHeight = Math.min(m_canvasWorkEasel.height,
                                    dFilterHeight);
                                if (dUseWidth > 0 &&
                                    dUseHeight > 0) {

                                    m_contextColumnHeaderEasel.drawImage(m_canvasWorkEasel,
                                        0,
                                        0,
                                        dUseWidth,
                                        dUseHeight,
                                        dLeft + m_options.columnHeader.paddingFilter,
                                        m_options.columnHeader.height + m_options.columnHeader.paddingFilter,
                                        dUseWidth,
                                        dUseHeight);
                                }
                            }

                            // Render the total.
                            if (m_options.columnHeader.totalable &&
                                columnIth.total === true) {

                                // Compute width and height.
                                var dFilterWidth = dWidth - 2 * m_options.columnHeader.paddingFilter;
                                var dFilterHeight = m_options.columnHeader.height - 2 * m_options.columnHeader.paddingFilter + 2;

                                // Clear the work easel.
                                if (m_bInPlaceEditing) {

                                    m_contextWorkEasel.fillStyle = m_options.columnHeader.backgroundFilterInPlaceEdit;
                                } else {

                                    m_contextWorkEasel.fillStyle = m_options.columnHeader.backgroundFilter;
                                }
                                m_contextWorkEasel.fillRect(0,
                                    0,
                                    dFilterWidth,
                                    dFilterHeight);

                                // Get the total string from the column.
                                var strTotal = m_functionFormatValue(columnIth.totalValue,
                                    columnIth);

                                // Width is another matter.
                                var dTotalWidth = m_contextWorkEasel.measureText(strTotal).width + 1;

                                var strLineAlignment = columnIth.lineAlignment;
                                var dWidthGap = m_options.columnHeader.paddingFilter / 2;
                                if (strLineAlignment === "right") {

                                    dWidthGap = dFilterWidth - dTotalWidth - m_options.columnHeader.paddingFilter / 2;
                                } else if (strLineAlignment === "center") {

                                    dWidthGap = (dFilterWidth - dTotalWidth) / 2;
                                }

                                // Ensure not justified too far.            
                                if (dWidthGap < m_options.cell.padding) {

                                    dWidthGap = m_options.cell.padding;
                                }

                                // Render the filter text to the work easel.
                                m_contextWorkEasel.fillStyle = (m_bInPlaceEditing ? m_options.columnHeader.colorFilterTextInPlaceEdit : m_options.columnHeader.colorFilterText);
                                m_contextWorkEasel.fillText(strTotal,
                                    dWidthGap,
                                    0);

                                // Copy over from work canvas to column header easel.
                                var dUseWidth = Math.min(m_canvasWorkEasel.width,
                                    dFilterWidth);
                                var dUseHeight = Math.min(m_canvasWorkEasel.height,
                                    dFilterHeight);

                                if (dUseWidth > 0 &&
                                    dUseHeight > 0) {

                                    m_contextColumnHeaderEasel.drawImage(m_canvasWorkEasel,
                                        0,
                                        0,
                                        dUseWidth,
                                        dUseHeight,
                                        dLeft + m_options.columnHeader.paddingFilter,
                                        2 * m_options.columnHeader.height + m_options.columnHeader.paddingFilter,
                                        dUseWidth,
                                        dUseHeight);
                                }
                            }

                            // Draw the sort glyph, if sorting self column.
                            if (columnIth.sortOrder > 0) {

                                var bDirection = (columnIth.sortDirection === "Ascending");

                                // First, fill in background.
                                m_contextColumnHeaderEasel.fillStyle = m_options.columnHeader.backgroundSortArrow;
                                m_contextColumnHeaderEasel.beginPath();

                                var dSizeSortArrow = m_options.columnHeader.height / 2;

                                var dCenterLine = (columnIth.lineAlignment === "right" ?
                                    dSizeSortArrow :
                                    dWidth - dSizeSortArrow);

                                var dArrowExtent = dSizeSortArrow / 2;

                                if (bDirection) {

                                    m_contextColumnHeaderEasel.moveTo(dLeft + dCenterLine,
                                        dTop + m_options.columnHeader.height / 2 - dArrowExtent);
                                    m_contextColumnHeaderEasel.lineTo(dLeft + dCenterLine + dArrowExtent,
                                        dTop + m_options.columnHeader.height / 2 + dArrowExtent);
                                    m_contextColumnHeaderEasel.lineTo(dLeft + dCenterLine - dArrowExtent,
                                        dTop + m_options.columnHeader.height / 2 + dArrowExtent);
                                } else {

                                    m_contextColumnHeaderEasel.moveTo(dLeft + dCenterLine,
                                        dTop + m_options.columnHeader.height / 2 + dArrowExtent);
                                    m_contextColumnHeaderEasel.lineTo(dLeft + dCenterLine + dArrowExtent,
                                        dTop + m_options.columnHeader.height / 2 - dArrowExtent);
                                    m_contextColumnHeaderEasel.lineTo(dLeft + dCenterLine - dArrowExtent,
                                        dTop + m_options.columnHeader.height / 2 - dArrowExtent);
                                }

                                m_contextColumnHeaderEasel.closePath();
                                m_contextColumnHeaderEasel.fill();

                                // Last, draw highlight.
                                m_contextColumnHeaderEasel.strokeStyle = m_options.columnHeader.colorSortArrowHighlight;
                                m_contextColumnHeaderEasel.beginPath();

                                if (bDirection) {

                                    m_contextColumnHeaderEasel.moveTo(dLeft + dCenterLine,
                                        dTop + m_options.columnHeader.height / 2 - dArrowExtent);
                                    m_contextColumnHeaderEasel.lineTo(dLeft + dCenterLine + dArrowExtent,
                                        dTop + m_options.columnHeader.height / 2 + dArrowExtent);
                                } else {

                                    m_contextColumnHeaderEasel.moveTo(dLeft + dCenterLine,
                                        dTop + m_options.columnHeader.height / 2 + dArrowExtent);
                                    m_contextColumnHeaderEasel.lineTo(dLeft + dCenterLine + dArrowExtent,
                                        dTop + m_options.columnHeader.height / 2 - dArrowExtent);
                                }

                                m_contextColumnHeaderEasel.stroke();
                            }

                            // Draw the separator line.
                            m_contextColumnHeaderEasel.strokeStyle = m_options.columnHeader.colorSeparator;
                            m_contextColumnHeaderEasel.beginPath();
                            m_contextColumnHeaderEasel.moveTo(dLeft + dWidth,
                                0);
                            m_contextColumnHeaderEasel.lineTo(dLeft + dWidth,
                                dHeight);
                            m_contextColumnHeaderEasel.stroke();

                            // Update for next pass.
                            iX += dWidth;
                        }

                        // Render what is left of the column header width.
                        if (iX < m_rectangleColumnHeaders.width) {

                            m_contextColumnHeaderEasel.fillStyle = m_options.columnHeader.background;
                            m_contextColumnHeaderEasel.fillRect(iX,
                                0,
                                m_rectangleColumnHeaders.width - iX,
                                dHeight);
                        }

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Render out the column headers.
                var m_functionRenderColumnHeaders = function () {

                    try {

                        // Ensure the easel has been rendered.
                        if (m_bColumnHeaderEaselDirty) {

                            var exceptionRet = m_functionRenderColumnHeaderEasel();
                            if (exceptionRet !== null) {

                                return exceptionRet;
                            }

                            // Reset dirty state.
                            m_bColumnHeaderEaselDirty = false;
                        }

                        // Copy from the easel to the render canvas.
                        if (m_rectangleColumnHeaders.width > 0 &&
                            m_rectangleColumnHeaders.height > 0) {

                            m_contextRender.drawImage(m_canvasColumnHeaderEasel,
                                m_dScrollOffsetX,
                                0,
                                m_rectangleColumnHeaders.width,
                                m_rectangleColumnHeaders.height,
                                m_rectangleColumnHeaders.left,
                                m_rectangleColumnHeaders.top,
                                m_rectangleColumnHeaders.width,
                                m_rectangleColumnHeaders.height);
                        }
                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Render out a single cell.
                var m_functionRenderCell = function (cell,
                    column,
                    iNow,
                    dLeft,
                    dTop,
                    dWidth,
                    dHeight,
                    bInPlaceRowDim,
                    iRow,
                    iColumn) {

                    try {

                        // Get formatted cell value.
                        var value = cell.value;

                        // Test for change.
                        if (value !== cell.lastValue) {

                            // Reset size of cell.
                            cell.sizeRender = undefined;

                            // Double check if self is a date.
                            var bCancel = false;
                            if (value instanceof Date &&
                                cell.lastValue !== undefined) {

                                bCancel = (value.getTime() === cell.lastValue.getTime());
                            }

                            if (bCancel === false) {

                                // Set up a change. 
                                cell.updateExpiration = iNow + m_options.cell.tickDuration;

                                // Color the text, up down for numeric types and white for string.
                                if (column.type === "string") {

                                    cell.updateColor = m_options.cell.colorChange;
                                } else if (value > cell.lastValue) {

                                    cell.updateColor = m_options.cell.colorUpTick;
                                } else {

                                    cell.updateColor = m_options.cell.colorDownTick;
                                }

                                // Reset to same.
                                cell.lastValue = value;

                                // Set formatted value.
                                cell.formattedValue = m_functionFormatValue(value,
                                    column);
                            }
                        }

                        // The output value.
                        var strFormattedValue = cell.formattedValue;

                        // Set context state.
                        if (cell.updateExpiration !== undefined &&
                            cell.updateExpiration > iNow) {

                            m_contextRender.fillStyle = cell.updateColor;
                        } else {

                            m_contextRender.fillStyle = m_options.cell.colorText;
                        }

                        // Size.
                        if (cell.sizeRender === undefined) {

                            cell.sizeRender = m_contextRender.measureText(strFormattedValue);
                        }
                        var dHeightGap = 2;
                        var dWidthGap = 0;

                        // Width is another matter.
                        var dCellWidth = cell.sizeRender.width;

                        var strLineAlignment = column.lineAlignment;
                        if (strLineAlignment === "right") {

                            dWidthGap = dWidth - dCellWidth - m_options.cell.padding;
                        } else if (strLineAlignment === "center") {

                            dWidthGap = (dWidth - dCellWidth) / 2;
                        }

                        // Ensure not justified too far.            
                        if (dWidthGap < m_options.cell.padding) {

                            dWidthGap = m_options.cell.padding;
                        }

                        // In-place trumps other render considerations.
                        if (bInPlaceRowDim) {

                            m_contextRender.fillStyle = m_options.cell.colorInPlace;
                        }

                        // Show the selection.
                        if (m_bInPlaceEditing &&
                            iRow === m_iInPlaceEditRow &&
                            iColumn === m_iInPlaceEditColumn) {

                            var strFillStyle = m_contextRender.fillStyle;

                            var iStart = m_iInPlaceEditSelectionStart;
                            var iLength = m_iInPlaceEditSelectionLength;
                            if (iLength < 0) {

                                iStart += iLength;
                                iLength *= -1;
                            }

                            // Figure out the position of the beginning and end of the selection.
                            var strBefore = strFormattedValue.substr(0, iStart);
                            var strDuring = strFormattedValue.substr(iStart,
                                iLength);

                            var dStartOffset = m_contextRender.measureText(strBefore).width;
                            var dLengthOffset = m_contextRender.measureText(strDuring).width;

                            // If selecting a select cell, then color differently to instruct the user.
                            if (m_columnInPlaceEdit.select) {

                                m_contextRender.fillStyle = m_options.cell.colorInPlaceSelectSelection;
                            } else {

                                m_contextRender.fillStyle = m_options.cell.colorInPlaceSelection;
                            }
                            m_contextRender.fillRect(dLeft + dWidthGap + dStartOffset - 2,
                                dTop,
                                dLengthOffset + 4,
                                dHeight);

                            // Restore color.
                            m_contextRender.fillStyle = strFillStyle;
                        }

                        // Render the cell text.
                        m_contextRender.fillText(strFormattedValue,
                            dLeft + dWidthGap,
                            dTop + dHeightGap);
                    } catch (e) {

                        return e;
                    }
                };

                // Render out the content.
                var m_functionRenderContent = function () {

                    try {

                        // Get now.  This is used to time cell states.
                        var iNow = (new Date()).getTime();

                        // Set context state.
                        m_contextRender.font = m_options.cell.font;
                        m_contextRender.textAlign = "left";
                        m_contextRender.textBaseline = "top";

                        // Loop over columns.
                        var iX = m_rectangleRowHeaders.width;
                        var dTop = m_rectangleContent.top;
                        var dHeight = m_rectangleContent.height;
                        var dRowHeight = m_options.row.height;
                        var dWidth = 0;
                        for (var iColumn = 0; iColumn < m_arrayColumns.length; iColumn++) {

                            try {

                                // Get the Ith column.
                                var columnIth = m_arrayColumns[iColumn];

                                // Skip if invisible.
                                if (columnIth.visible === false) {

                                    // Make sure the width doesn't get used.
                                    dWidth = 0;
                                    continue;
                                }

                                // Compute the bounds for this column.
                                var dLeft = iX - m_dScrollOffsetX;
                                dWidth = columnIth.width;

                                // Only process visible columns.
                                if (dLeft + dWidth < 0 ||
                                    dLeft > m_dWidth) {

                                    continue;
                                }

                                // Render out cells for this column.
                                for (var iRow = 0; iRow < m_iVisibleRows; iRow++) {

                                    // Catch off-end before it happens.
                                    if (iRow + m_iFirstVisibleRow >= m_iNumberOfVisibleRows) {

                                        break;
                                    }

                                    // Calculate the top.
                                    dTop = m_rectangleContent.top + iRow * dRowHeight;

                                    var rowIth = m_arrayView[iRow + m_iFirstVisibleRow];

                                    // Save the position of the row as rendered.
                                    rowIth.top = dTop;

                                    // Get the cell from the row.
                                    var cellIth = rowIth[iColumn];

                                    // Fill in background based on row state.
                                    if ((iRow + m_iFirstVisibleRow) % 2 === 0) {

                                        m_contextRender.fillStyle = m_options.row.background;
                                    } else {

                                        m_contextRender.fillStyle = m_options.row.backgroundAlternate;
                                    }

                                    // Test for in-place editing.
                                    var bInPlaceRowDim = false;
                                    if (m_bInPlaceEditing) {

                                        if (iRow + m_iFirstVisibleRow !== m_iInPlaceEditRow) {

                                            if ((iRow + m_iFirstVisibleRow) % 2 === 0) {

                                                m_contextRender.fillStyle = m_options.row.backgroundInPlace;
                                            } else {

                                                m_contextRender.fillStyle = m_options.row.backgroundInPlaceAlternate;
                                            }

                                            bInPlaceRowDim = true;
                                        }
                                    } else if (m_arraySelectedRows.indexOf(iRow + m_iFirstVisibleRow) !== -1) {

                                        // Handle selected row by coloring background.
                                        m_contextRender.fillStyle = m_options.row.backgroundSelected;
                                    }
                                    m_contextRender.fillRect(dLeft,
                                        dTop,
                                        dWidth,
                                        dRowHeight);

                                    // Render cell.
                                    m_functionRenderCell(cellIth,
                                        columnIth,
                                        iNow,
                                        dLeft,
                                        dTop,
                                        dWidth,
                                        dRowHeight,
                                        bInPlaceRowDim,
                                        iRow + m_iFirstVisibleRow,
                                        iColumn);
                                }

                                // Save off the bottom
                                if (dTop + dRowHeight < m_rectangleContent.top + m_rectangleContent.height) {

                                    m_contextRender.fillStyle = m_options.backgroundNull;
                                    m_contextRender.fillRect(dLeft,
                                        dTop + dRowHeight,
                                        dWidth,
                                        m_rectangleContent.top + m_rectangleContent.height - (dTop + dRowHeight));
                                }

                                // Draw the separator line.
                                if (m_options.cell.drawColumnSeparator) {

                                    m_contextRender.strokeStyle = m_options.cell.colorSeparator;
                                    m_contextRender.beginPath();
                                    m_contextRender.moveTo(dLeft + dWidth,
                                        m_rectangleContent.top);
                                    m_contextRender.lineTo(dLeft + dWidth,
                                        m_rectangleContent.top + m_rectangleContent.height);
                                    m_contextRender.stroke();
                                }
                            } finally {

                                iX += dWidth;
                            }
                        }

                        // Render what is left of the content width.
                        if (iX < m_dWidth &&
                            dHeight > 0) {

                            m_contextRender.fillStyle = m_options.backgroundNull;
                            m_contextRender.fillRect(iX,
                                m_rectangleContent.top,
                                m_dWidth - iX,
                                dHeight);
                        }

                        // If drawing row headers, then draw the row header.
                        if (m_options.rowHeader.visible) {

                            m_contextRender.strokeStyle = m_options.columnHeader.colorSeparator;
                            m_contextRender.fillStyle = m_options.backgroundNull;

                            // Fill in the whole row header right up front.
                            m_contextRender.fillRect(0,
                                0,
                                m_rectangleRowHeaders.width,
                                m_dHeight);

                            // Draw a single separator line.
                            m_contextRender.lineWidth = 0.5;
                            m_contextRender.beginPath();
                            m_contextRender.moveTo(m_rectangleRowHeaders.width - 0.5,
                                0);
                            m_contextRender.lineTo(m_rectangleRowHeaders.width - 0.5,
                                m_dHeight);
                            m_contextRender.stroke();

                            // Set for row header text.
                            m_contextRender.fillStyle = (m_bInPlaceEditing ? m_options.columnHeader.colorTextInPlaceEdit : m_options.columnHeader.colorText);
                            m_contextRender.font = m_options.row.font;

                            // Clear the collection of delete regions.
                            m_arrayDeleteRegions = [];
                            m_arrayNewRegions = [];

                            // Set for drawing delete or remove on the first selected row.
                            m_contextRender.lineWidth = 2.5;

                            // Render out row-indicies for this row header.
                            var dGap = dRowHeight / 4;
                            for (var iRow = 0; iRow < m_iVisibleRows; iRow++) {

                                // Calculate the top.
                                var dTop = m_rectangleContent.top + iRow * dRowHeight + 0.5;

                                // Catch off-end before it happens.
                                if (iRow + m_iFirstVisibleRow >= m_iNumberOfVisibleRows) {

                                    break;
                                }

                                // Render  text.
                                var iRowIndex = iRow + m_iFirstVisibleRow + 1;
                                var strRowIndex = iRowIndex.toString();

                                // Width is another matter.
                                var dIndexWidth = m_contextRender.measureText(strRowIndex).width;
                                var dWidthGap = m_rectangleRowHeaders.width - dIndexWidth - m_options.columnHeader.padding;

                                // Render the index.
                                m_contextRender.fillText(strRowIndex,
                                    dWidthGap,
                                    dTop);

                                // Draw new and delete (if allowed) on the first selected row.
                                if (m_arraySelectedRows.indexOf(iRow + m_iFirstVisibleRow) !== -1 &&
                                    !m_bInPlaceEditing) {

                                    if (m_options.allowDelete &&
                                        m_arrayDeleteRegions.length === 0) {

                                        // Draw the delete glyph.
                                        m_contextRender.beginPath();
                                        m_contextRender.moveTo(2 * dGap,
                                            dTop + dGap);
                                        m_contextRender.lineTo(2 * dGap + dRowHeight - 2 * dGap,
                                            dTop + dGap + dRowHeight - 2 * dGap);
                                        m_contextRender.moveTo(2 * dGap,
                                            dTop + dGap + dRowHeight - 2 * dGap);
                                        m_contextRender.lineTo(2 * dGap + dRowHeight - 2 * dGap,
                                            dTop + dGap);

                                        // Add to collection of delete regions.
                                        m_arrayDeleteRegions.push({

                                            left: 2 * dGap - 2,
                                            top: dTop + dGap - 2,
                                            width: dRowHeight - 2 * dGap + 4,
                                            height: dRowHeight - 2 * dGap + 4,
                                            index: iRow + m_iFirstVisibleRow
                                        });
                                        m_contextRender.strokeStyle = m_options.rowHeader.colorDelete;
                                        m_contextRender.stroke();
                                    }
                                }
                            }

                            // Draw the add, if allowed and column headers visible.
                            if (m_options.allowNew &&
                                m_options.columnHeader.visible &&
                                m_arrayNewRegions.length === 0 &&
                                !m_bInPlaceEditing) {

                                // Draw the new glyph.
                                m_contextRender.beginPath();
                                m_contextRender.moveTo(3 * dGap,
                                    1.5 * dGap + (dRowHeight - 2 * dGap) / 2);
                                m_contextRender.lineTo(3 * dGap + dRowHeight - 2 * dGap,
                                    1.5 * dGap + (dRowHeight - 2 * dGap) / 2);
                                m_contextRender.moveTo(3 * dGap + (dRowHeight - 2 * dGap) / 2,
                                    1.5 * dGap);
                                m_contextRender.lineTo(3 * dGap + (dRowHeight - 2 * dGap) / 2,
                                    1.5 * dGap + dRowHeight - 2 * dGap);

                                // Add to collection of delete regions.
                                m_arrayNewRegions.push({

                                    left: 3 * dGap - 2,
                                    top: 1.5 * dGap - 2,
                                    width: dRowHeight - 2 * dGap + 4,
                                    height: dRowHeight - 2 * dGap + 4
                                });
                                m_contextRender.strokeStyle = m_options.rowHeader.colorNew;
                                m_contextRender.stroke();
                            }


                            // Reset line with for all subsequent calls.
                            m_contextRender.lineWidth = 1;
                        }

                        // Ensure that the scroll bars are redrawn to over-write the overwrite.
                        // Note: this has no effect if the scroll bars are not visible.
                        m_bVerticalScrollBarDirty = true;
                        m_bHorizontalScrollBarDirty = true;
                        m_bNullBottomRightDirty = true;

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Render out the vertical scroll bar easel.
                var m_functionRenderVerticalScrollBarEasel = function () {

                    try {

                        // Fill the whole bar.
                        m_contextVerticalScrollBarEasel.fillStyle = m_options.scrollBar.background;
                        m_contextVerticalScrollBarEasel.fillRect(0,
                            0,
                            m_rectangleVerticalScrollBar.width,
                            m_rectangleVerticalScrollBar.height);

                        // Fill in just the middle part with a blue stripe.

                        var dStripeWidth = m_rectangleVerticalScrollBar.width - 2 * m_options.scrollBar.widthStripeIndent;

                        m_contextVerticalScrollBarEasel.fillStyle = m_options.scrollBar.backgroundStripe;
                        m_contextVerticalScrollBarEasel.fillRect(m_options.scrollBar.widthStripeIndent,
                            4,
                            dStripeWidth,
                            m_rectangleVerticalScrollBar.height - 8);

                        m_contextVerticalScrollBarEasel.beginPath();
                        m_contextVerticalScrollBarEasel.arc(m_rectangleVerticalScrollBar.width / 2,
                            4,
                            dStripeWidth / 2,
                            0,
                            Math.PI,
                            true);
                        m_contextVerticalScrollBarEasel.fill();
                        m_contextVerticalScrollBarEasel.beginPath();
                        m_contextVerticalScrollBarEasel.arc(m_rectangleVerticalScrollBar.width / 2,
                            m_rectangleVerticalScrollBar.height - 4,
                            dStripeWidth / 2,
                            0,
                            Math.PI,
                            false);
                        m_contextVerticalScrollBarEasel.fill();

                        // Calculate thumb height and top.

                        // Find the ratio.
                        var iNumberOfRows = m_iNumberOfVisibleRows;
                        var dContentHeight = m_rectangleContent.height;
                        var dTotalHeight = m_options.row.height * iNumberOfRows;

                        // Now, get the useable height of the scrollbar.
                        var dUseableHeight = m_rectangleVerticalScrollBar.height;

                        // The thumb is a circle as wide as the bar itself.
                        m_dThumbHeight = m_options.scrollBar.width;

                        // The range is the extent of freedom of movement.
                        var dRange = dUseableHeight - m_dThumbHeight;
                        var dRowRange = iNumberOfRows - m_iVisibleRows + 1;

                        m_dVerticalScrollBar_PixelsPerRow = dRange / dRowRange;

                        // And now, the top.
                        m_dThumbTop = m_dVerticalScrollBar_PixelsPerRow * m_iFirstVisibleRow;

                        // Fill in from the top of the bar to the top of the thumb with highlight.
                        m_contextVerticalScrollBarEasel.fillStyle = m_options.scrollBar.backgroundHighlightStripe;
                        m_contextVerticalScrollBarEasel.fillRect(m_options.scrollBar.widthHighlightStripeIndent,
                            0,
                            m_rectangleVerticalScrollBar.width - 2 * m_options.scrollBar.widthHighlightStripeIndent,
                            m_dThumbTop + m_rectangleVerticalScrollBar.width / 2 - 2);

                        // Draw the thumb.
                        m_contextVerticalScrollBarEasel.strokeStyle = m_options.scrollBar.shadowThumb;
                        m_contextVerticalScrollBarEasel.fillStyle = m_options.scrollBar.backgroundThumb;

                        m_contextVerticalScrollBarEasel.beginPath();
                        m_contextVerticalScrollBarEasel.arc(m_rectangleVerticalScrollBar.width / 2,
                            m_dThumbTop + m_rectangleVerticalScrollBar.width / 2,
                            m_rectangleVerticalScrollBar.width / 2 - m_options.scrollBar.paddingThumb,
                            0,
                            2 * Math.PI,
                            false);
                        m_contextVerticalScrollBarEasel.closePath();
                        m_contextVerticalScrollBarEasel.fill();
                        m_contextVerticalScrollBarEasel.stroke();

                        // Now, the highlight
                        m_contextVerticalScrollBarEasel.beginPath();
                        m_contextVerticalScrollBarEasel.strokeStyle = m_options.scrollBar.highlightThumb;
                        m_contextVerticalScrollBarEasel.beginPath();
                        m_contextVerticalScrollBarEasel.arc(m_rectangleVerticalScrollBar.width / 2,
                            m_dThumbTop + m_rectangleVerticalScrollBar.width / 2,
                            m_rectangleVerticalScrollBar.width / 2 - m_options.scrollBar.paddingThumb - 1,
                            Math.PI + Math.PI / 10,
                            2 * Math.PI - Math.PI / 10,
                            false);
                        m_contextVerticalScrollBarEasel.stroke();

                        // The little inner circle:
                        m_contextVerticalScrollBarEasel.beginPath();
                        m_contextVerticalScrollBarEasel.fillStyle = m_options.scrollBar.backgroundThumbCenter;
                        m_contextVerticalScrollBarEasel.arc(m_rectangleVerticalScrollBar.width / 2,
                            m_dThumbTop + m_rectangleVerticalScrollBar.width / 2,
                            m_options.scrollBar.widthThumbHole,
                            0,
                            2 * Math.PI,
                            false);
                        m_contextVerticalScrollBarEasel.closePath();
                        m_contextVerticalScrollBarEasel.fill();

                        // Last, the highlight on the mini-hole
                        m_contextVerticalScrollBarEasel.beginPath();
                        m_contextVerticalScrollBarEasel.strokeStyle = m_options.scrollBar.highlightThumb;
                        m_contextVerticalScrollBarEasel.arc(m_rectangleVerticalScrollBar.width / 2,
                            m_dThumbTop + m_rectangleVerticalScrollBar.width / 2,
                            m_options.scrollBar.widthThumbHole + 0.5,
                            Math.PI - Math.PI / 5,
                            2 * Math.PI + Math.PI / 5,
                            true);
                        m_contextVerticalScrollBarEasel.stroke();

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Render out the vertical scroll bar.
                var m_functionRenderVerticalScrollBar = function () {

                    try {

                        // Ensure the easel has been rendered.
                        if (m_bVerticalScrollBarEaselDirty) {

                            var exceptionRet = m_functionRenderVerticalScrollBarEasel();
                            if (exceptionRet !== null) {

                                return exceptionRet;
                            }

                            // Reset dirty state.
                            m_bVerticalScrollBarEaselDirty = false;
                        }

                        // Copy from the easel to the render canvas.
                        if (m_rectangleVerticalScrollBar.width > 0 &&
                            m_rectangleVerticalScrollBar.height > 0) {

                            if (m_rectangleVerticalScrollBar.width > m_contextRender.canvas.width) {

                                m_rectangleVerticalScrollBar.width = m_contextRender.canvas.width;
                            }
                            if (m_rectangleVerticalScrollBar.height > m_contextRender.canvas.height) {

                                m_rectangleVerticalScrollBar.height = m_contextRender.canvas.height;
                            }
                            try {

                                m_contextRender.drawImage(m_canvasVerticalScrollBarEasel,
                                    0,
                                    0,
                                    m_rectangleVerticalScrollBar.width,
                                    m_rectangleVerticalScrollBar.height,
                                    m_rectangleVerticalScrollBar.left,
                                    m_rectangleVerticalScrollBar.top,
                                    m_rectangleVerticalScrollBar.width,
                                    m_rectangleVerticalScrollBar.height);
                            } catch (e) {

                                // Ignore error--only occurs when grid is invisible.
                            }
                        }
                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Render out the horizontal scroll bar easel.
                var m_functionRenderHorizontalScrollBarEasel = function () {

                    try {

                        // Fill the whole bar.
                        m_contextHorizontalScrollBarEasel.fillStyle = m_options.scrollBar.background;
                        m_contextHorizontalScrollBarEasel.fillRect(0,
                            0,
                            m_rectangleHorizontalScrollBar.width,
                            m_rectangleHorizontalScrollBar.height);

                        // Fill in just the middle part with a blue stripe.
                        var dStripeHeight = m_rectangleHorizontalScrollBar.height - 2 * m_options.scrollBar.widthStripeIndent;
                        m_contextHorizontalScrollBarEasel.fillStyle = m_options.scrollBar.backgroundStripe;
                        m_contextHorizontalScrollBarEasel.fillRect(4,
                            m_options.scrollBar.widthStripeIndent,
                            m_rectangleHorizontalScrollBar.width - 8,
                            dStripeHeight);
                        m_contextHorizontalScrollBarEasel.beginPath();
                        m_contextHorizontalScrollBarEasel.arc(4,
                            m_rectangleHorizontalScrollBar.height / 2,
                            dStripeHeight / 2,
                            Math.PI / 2,
                            3 * Math.PI / 2,
                            false);
                        m_contextHorizontalScrollBarEasel.fill();
                        m_contextHorizontalScrollBarEasel.beginPath();
                        m_contextHorizontalScrollBarEasel.arc(m_rectangleHorizontalScrollBar.width - 4,
                            m_rectangleHorizontalScrollBar.height / 2,
                            dStripeHeight / 2,
                            Math.PI / 2,
                            3 * Math.PI / 2,
                            true);
                        m_contextHorizontalScrollBarEasel.fill();

                        // Calculate thumb width and left.

                        // Find the ratio.
                        var dContentWidth = m_rectangleContent.width;
                        var dTotalWidth = m_dTotalColumnWidth;

                        // Now, get the useable width of the scrollbar.
                        var dUseableWidth = m_rectangleContent.width - m_options.scrollBar.height;

                        // The thumb is a circle as high as the bar itself.
                        m_dThumbWidth = m_options.scrollBar.height;

                        // The range is the extent of freedom of movement.
                        var dRange = dUseableWidth;
                        var dPixelRange = m_dTotalColumnWidth - m_rectangleContent.width;

                        m_dHorizontalScrollBar_PixelsPerPixel = dRange / dPixelRange;

                        // And now, the left.
                        m_dThumbLeft = m_dHorizontalScrollBar_PixelsPerPixel * m_dScrollOffsetX;

                        // Draw the thumb.

                        // Fill in from the left of the bar to the left of the thumb with highlight.
                        var dStripeHeight = m_rectangleHorizontalScrollBar.height - 2 * m_options.scrollBar.widthHighlightStripeIndent;
                        m_contextHorizontalScrollBarEasel.fillStyle = m_options.scrollBar.backgroundHighlightStripe;
                        m_contextHorizontalScrollBarEasel.fillRect(0,
                            m_options.scrollBar.widthHighlightStripeIndent,
                            m_dThumbLeft + m_dThumbWidth / 2,
                            dStripeHeight);

                        // Draw the thumb.
                        m_contextHorizontalScrollBarEasel.strokeStyle = m_options.scrollBar.shadowThumb;
                        m_contextHorizontalScrollBarEasel.fillStyle = m_options.scrollBar.backgroundThumb;

                        m_contextHorizontalScrollBarEasel.beginPath();
                        m_contextHorizontalScrollBarEasel.arc(m_dThumbLeft + m_rectangleHorizontalScrollBar.height / 2,
                            m_rectangleHorizontalScrollBar.height / 2,
                            m_rectangleHorizontalScrollBar.height / 2 - m_options.scrollBar.paddingThumb,
                            0,
                            2 * Math.PI,
                            false);
                        m_contextHorizontalScrollBarEasel.closePath();
                        m_contextHorizontalScrollBarEasel.fill();
                        m_contextHorizontalScrollBarEasel.stroke();

                        // Now, the highlight
                        m_contextHorizontalScrollBarEasel.beginPath();
                        m_contextHorizontalScrollBarEasel.strokeStyle = m_options.scrollBar.highlightThumb;
                        m_contextHorizontalScrollBarEasel.beginPath();
                        m_contextHorizontalScrollBarEasel.arc(m_dThumbLeft + m_rectangleHorizontalScrollBar.height / 2,
                            m_rectangleHorizontalScrollBar.height / 2,
                            m_rectangleHorizontalScrollBar.height / 2 - m_options.scrollBar.paddingThumb - 1,
                            Math.PI + Math.PI / 10,
                            2 * Math.PI - Math.PI / 10,
                            false);
                        m_contextHorizontalScrollBarEasel.stroke();

                        // The little inner circle:
                        m_contextHorizontalScrollBarEasel.beginPath();
                        m_contextHorizontalScrollBarEasel.fillStyle = m_options.scrollBar.backgroundThumbCenter;
                        m_contextHorizontalScrollBarEasel.arc(m_dThumbLeft + m_rectangleHorizontalScrollBar.height / 2,
                            m_rectangleHorizontalScrollBar.height / 2,
                            m_options.scrollBar.widthThumbHole,
                            0,
                            2 * Math.PI,
                            false);
                        m_contextHorizontalScrollBarEasel.closePath();
                        m_contextHorizontalScrollBarEasel.fill();

                        // Last, the highlight on the mini-hole
                        m_contextHorizontalScrollBarEasel.beginPath();
                        m_contextHorizontalScrollBarEasel.strokeStyle = m_options.scrollBar.highlightThumb;
                        m_contextHorizontalScrollBarEasel.arc(m_dThumbLeft + m_rectangleHorizontalScrollBar.height / 2,
                            m_rectangleHorizontalScrollBar.height / 2,
                            m_options.scrollBar.widthThumbHole + 0.5,
                            Math.PI - Math.PI / 5,
                            2 * Math.PI + Math.PI / 5,
                            true);
                        m_contextHorizontalScrollBarEasel.stroke();

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Render out the horizontal scroll bar.
                var m_functionRenderHorizontalScrollBar = function () {

                    try {

                        // Ensure the easel has been rendered.
                        if (m_bHorizontalScrollBarEaselDirty) {

                            var exceptionRet = m_functionRenderHorizontalScrollBarEasel();
                            if (exceptionRet !== null) {

                                return exceptionRet;
                            }

                            // Reset dirty state.
                            m_bHorizontalScrollBarEaselDirty = false;
                        }

                        // Copy from the easel to the render canvas.
                        if (m_rectangleHorizontalScrollBar.width > 0 &&
                            m_rectangleHorizontalScrollBar.height > 0) {

                            m_contextRender.drawImage(m_canvasHorizontalScrollBarEasel,
                                0,
                                0,
                                m_rectangleHorizontalScrollBar.width,
                                m_rectangleHorizontalScrollBar.height,
                                m_rectangleHorizontalScrollBar.left,
                                m_rectangleHorizontalScrollBar.top,
                                m_rectangleHorizontalScrollBar.width,
                                m_rectangleHorizontalScrollBar.height);
                        }
                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Render out the null top right.
                var m_functionRenderNullTopRight = function () {

                    try {
                        m_contextRender.fillStyle = m_options.columnHeader.background;
                        m_contextRender.fillRect(m_rectangleNullTopRight.left,
                            m_rectangleNullTopRight.top,
                            m_rectangleNullTopRight.width,
                            m_rectangleNullTopRight.height);
                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Render out the null bottom right.
                var m_functionRenderNullBottomRight = function () {

                    try {

                        m_contextRender.fillStyle = m_options.columnHeader.background;
                        m_contextRender.fillRect(m_rectangleNullBottomRight.left,
                            m_rectangleNullBottomRight.top,
                            m_rectangleNullBottomRight.width,
                            m_rectangleNullBottomRight.height);

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Render all regions, if dirty and visible.
                var m_functionRender = function () {

                    try {

                        // Ensure the view is build.
                        var exceptionRet = null;
                        if (m_bViewDirty) {

                            exceptionRet = m_functionBuildView();
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }

                            // Must update everything when the view updates.
                            m_bComponentRectanglesDirty = true;

                            m_bViewDirty = false;
                        }

                        // Ensure the view is sorted.
                        if (m_bViewSortDirty) {

                            exceptionRet = m_functionSortView();
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }

                            m_bViewSortDirty = false;
                        }

                        // Ensure the component rectangles are set.
                        if (m_bComponentRectanglesDirty) {

                            exceptionRet = m_functionCalculateComponentRectangles();
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                            m_bComponentRectanglesDirty = false;
                        }

                        // Look at each region, determine if it is dirty and render if so.
                        if (m_bColumnHeaderDirty &&
                            m_options.columnHeader.visible) {

                            exceptionRet = m_functionRenderColumnHeaders();
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }

                            // Reset dirty state.
                            m_bColumnHeaderDirty = false;
                        }

                        if (m_bContentDirty) {

                            exceptionRet = m_functionRenderContent();
                            if (exceptionRet !== null) {

                                exceptionRet = m_functionRenderContent();
                                throw exceptionRet;
                            }

                            // Dont reset dirty state.
                            m_bContentDirty = true;
                        }

                        if (m_bVerticalScrollBarDirty &&
                            m_bVerticalScrollBarVisible) {

                            exceptionRet = m_functionRenderVerticalScrollBar();
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }

                            // Reset dirty state.
                            m_bVerticalScrollBarDirty = false;
                        }

                        if (m_bHorizontalScrollBarDirty &&
                            m_bHorizontalScrollBarVisible) {

                            exceptionRet = m_functionRenderHorizontalScrollBar();
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }

                            // Reset dirty state.
                            m_bHorizontalScrollBarDirty = false;
                        }

                        if (m_bNullTopRightDirty &&
                            m_bVerticalScrollBarVisible) {

                            exceptionRet = m_functionRenderNullTopRight();
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }

                            // Reset dirty state.
                            m_bNullTopRightDirty = false;
                        }

                        if (m_bNullBottomRightDirty &&
                            m_bVerticalScrollBarVisible &&
                            m_bHorizontalScrollBarVisible) {

                            exceptionRet = m_functionRenderNullBottomRight();
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }

                            // Reset dirty state.
                            m_bNullBottomRightDirty = false;
                        }
                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Method called to format the specified value.
                var m_functionFormatValue = function (value,
                    column) {

                    // Note: no exception handling.

                    // If null, or empty, just return empty string.
                    if (value === undefined ||
                        value === null ||
                        value === "") {

                        return "";
                    }

                    // Format based on the type of column.
                    var strType = column.type;
                    var iDecimals = column.decimals;
                    if (iDecimals === undefined) {

                        iDecimals = 0;
                    }

                    if (strType === undefined ||
                        strType === "string") {

                        return value.toString();
                    } else if (strType === "amount") {

                        // Ensure number.
                        if (value.toFixed === undefined) {

                            value = parseFloat(value.replace(/,/g, ''));
                        }

                        // If min or max value, do not format as number.
                        if (isNaN(value) ||
                            value < -1000000000000 ||
                            value > 1000000000000) {

                            return "";
                        }

                        return value.toFixed(iDecimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    } else if (strType === "date") {

                        // Ensure date.
                        if (value.getMonth === undefined) {

                            // String-parts are in known format.
                            var strYear = value.substr(0, 4);
                            var iYear = parseInt(strYear);
                            var strMonth = value.substr(5, 2);
                            var iMonth = parseInt(strMonth);
                            var strDay = value.substr(8, 2);
                            var iDay = parseInt(strDay);

                            value = new Date(iYear,
                                iMonth - 1,
                                iDay);
                        }

                        return value.toString();
                    } else if (strType === "dateTime") {

                        // Ensure date.
                        if (value.getMonth === undefined) {

                            // String-parts are in known format.
                            var strYear = value.substr(0, 4);
                            var iYear = parseInt(strYear);
                            var strMonth = value.substr(5, 2);
                            var iMonth = parseInt(strMonth);
                            var strDay = value.substr(8, 2);
                            var iDay = parseInt(strDay);

                            var iHour = 0;
                            var iMinute = 0;
                            var iSecond = 0;
                            if (value.length > 10) {

                                var strHour = value.substr(11, 2);
                                iHour = parseInt(strHour);
                                var strMinute = value.substr(14, 2);
                                iMinute = parseInt(strMinute);
                                var strSecond = value.substr(17, 2);
                                iSecond = parseInt(strSecond);
                            }

                            value = new Date(iYear,
                                iMonth - 1,
                                iDay,
                                iHour,
                                iMinute,
                                iSecond);

                            // Date format to be applied to this datetime value.
                            var strDateFormat = column.dateFormat;

                            // Convert UTC to local datetime.
                            if (strDateFormat === "local") {

                                var dtLocal = new Date();
                                dtLocal.setTime(value.valueOf() - 60000 * value.getTimezoneOffset());
                                value = dtLocal;
                            }
                        }

                        return value.toString();
                    }
                    return value.toString();
                };

                // Helper method selects and toggles selected rows.
                var m_functionProcessLeftLikeMouseAction = function (e,
                    iSelectedRow) {

                    try {

                        // Not a real selection of the selected row is > m_iNumberOfVisibleRows.
                        if (iSelectedRow >= m_iNumberOfVisibleRows) {

                            return null;
                        }

                        // Based on the keys depressed, either replace add or union.
                        var bChange = false;
                        if (e.shiftKey &&
                            m_iLastSelectedRow !== -1) {

                            // Merge.
                            if (iSelectedRow < m_iLastSelectedRow) {

                                for (var i = iSelectedRow; i < m_iLastSelectedRow; i++) {

                                    // Toggle.
                                    var iIndex = m_arraySelectedRows.indexOf(i);
                                    if (iIndex === -1) {

                                        // Toggle/add.
                                        m_arraySelectedRows.push(i);
                                        bChange = true;
                                    } else {

                                        // Toggle/remove.
                                        m_arraySelectedRows.splice(iIndex, 1);
                                        bChange = true;
                                    }
                                }
                            } else {

                                for (var i = m_iLastSelectedRow + 1; i <= iSelectedRow; i++) {

                                    // Toggle.
                                    var iIndex = m_arraySelectedRows.indexOf(i);
                                    if (iIndex === -1) {

                                        // Toggle/add.
                                        m_arraySelectedRows.push(i);
                                        bChange = true;
                                    } else {

                                        // Toggle/remove.
                                        m_arraySelectedRows.splice(iIndex, 1);
                                        bChange = true;
                                    }
                                }
                            }
                        } else if (e.ctrlKey) {

                            // Add.
                            // Toggle.
                            var iIndex = m_arraySelectedRows.indexOf(iSelectedRow);
                            if (iIndex === -1) {

                                // Toggle/add.
                                m_arraySelectedRows.push(iSelectedRow);
                                bChange = true;
                            } else {

                                // Toggle/remove.
                                m_arraySelectedRows.splice(iIndex, 1);
                                bChange = true;
                            }
                        } else {

                            // Replace.
                            m_arraySelectedRows = [iSelectedRow];
                            bChange = true;
                        }

                        // Raise the event, if set and if there was in fact a change.
                        if (bChange &&
                            $.isFunction(m_options.onSelectionChanged)) {

                            // Call getSelectedRows to return row objects, not their indicies.
                            m_options.onSelectionChanged(self.getSelectedRows());
                        }

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Show filter drop-down, lock down rest of GUI until dismissed.
                // Also, possibly update filter and refresh grid GUI accordingly.
                var m_functionFilter = function (column,
                    iColumnIndex) {

                    try {

                        // Can only filter if there is data.
                        if (m_arrayData === undefined ||
                            m_arrayData === null ||
                            m_arrayData.length === 0) {

                            return null;
                        }

                        // Figure out where the render canvas is relative 
                        // to its parent, self is used to position the 
                        // new divs directly in the correct position.
                        var position = { left: 0, top: 0 };

                        // Create an overlay div and add it to the DOM.
                        // This stops mouse action from updating the underlying grid
                        // and serves as a convienant way to dismiss the popup grid.
                        var divOverlay = document.createElement("div");
                        divOverlay.style.background = "rgba(0,0,0,0.000001)";
                        divOverlay.id = "Overlay";
                        divOverlay.style.position = "absolute";
                        divOverlay.style.top = position.top + "px";
                        divOverlay.style.left = position.left + "px";
                        divOverlay.style.height = m_dHeight + "px";
                        divOverlay.style.width = m_dWidth + "px";
                        m_jqParent.append(divOverlay);

                        // Get the data to show in the drop down.
                        // The mask is provided for easy matching up of text cell values and sorted indicies.
                        // I.e. the mask serves as the inter-exchange between the indicies and the rows.
                        var arrayData = [];
                        var arrayMask = [];

                        // Loop over all rows (NOTE: not view rows--this always gives 
                        // all rows even for filtered grids) to build unique collection.
                        for (var iRow = 0; iRow < m_arrayData.length; iRow++) {

                            // Get the ith row.
                            var rowIth = m_arrayData[iRow];

                            // Get the column data.
                            var cell = rowIth[iColumnIndex];

                            // Must convert date type.
                            var value = cell.value;
                            if (m_arrayColumns[iColumnIndex].type === "date" &&
                                value.getMonth !== undefined) {

                                value = (value.getMonth() + 1).toString() + "/" +
                                    value.getDate().toString() + "/" +
                                    value.getFullYear().toString();
                            }

                            // Must switch out blank so the filter can always be cleared.
                            if (value === "") {

                                value = m_options.blankFilterString;
                            }

                            // Add the value, if unique.
                            if (arrayMask.indexOf(value) === -1) {

                                // Note: must also update mask here.  
                                arrayData.push([{ value: value }]);
                                arrayMask.push(value);
                            }
                        }

                        // Sort the items.
                        // Note: arrayMask is sorted in kind so it may be used 
                        // to look up indicies for selection in the drop down.
                        arrayData.sort(function (a, b) {

                            if (a[0].value === m_options.blankFilterString) {

                                return -1;
                            } else if (b[0].value === m_options.blankFilterString) {

                                return 1;
                            }
                            // Implement quick in-line sort function which looks at the row's cell's value.
                            return (a[0].value > b[0].value ? 1 : ((a[0].value < b[0].value ? -1 : 0)));
                        });

                        // Make an upper-case copy of mask to do case-insensitive 
                        // compares with, when the user is typing into filter text.
                        var arrayMaskUpper = [];
                        arrayMask = [];
                        for (var i = 0; i < arrayData.length; i++) {

                            var strMask = arrayData[i][0].value;
                            arrayMask.push(strMask);
                            arrayMaskUpper.push(strMask.toUpperCase());
                        }

                        // Find the indicies of all this columns filter strings.
                        // This depends on arrayData and arrayMask being in place.
                        var arraySelectedIndicies = [];
                        if (column.filter) {

                            // Loop over all filters for self column.
                            for (var iFilterValue = 0; iFilterValue < column.filter.length; iFilterValue++) {

                                // Get the ith filter value.
                                var strFilterValueIth = column.filter[iFilterValue];

                                if (strFilterValueIth === "") {

                                    strFilterValueIth = m_options.blankFilterString;
                                }

                                // Get the index in the sorted mask collection.
                                var iFilterIndex = arrayMask.indexOf(strFilterValueIth);

                                // Add that index to the list that is used to set the selected indicies.
                                // These are the values that must match up betwixt the data and the mask.
                                if (iFilterIndex !== -1) {

                                    arraySelectedIndicies.push(iFilterIndex);
                                }
                            }
                        }

                        // Calculate just enough height to show all the drop-down data,
                        // unless it is too many rows, in which case, enable scrolling.
                        var bScrollingRequired = (arrayData.length > m_options.filter.maxDropDownRows);
                        var dRecommendedHeight = m_options.row.height *
                            Math.min(arrayData.length,
                                m_options.filter.maxDropDownRows);

                        // Specify where the new filter divs will be positioned.
                        var dDDLeft = m_rectangleContent.left + position.left + column.left;
                        var dDDTop = position.top + m_rectangleColumnHeaders.top + 2 * m_options.columnHeader.height + 1;
                        var dDDWidth = column.width + (bScrollingRequired ? m_options.scrollBar.width : 0);
                        var dDDHeight = dRecommendedHeight;

                        // Create a border div just behind the filter  
                        // div.  This gives a contrast around the popup.
                        var divFilterBorder = document.createElement("div");
                        divFilterBorder.id = "FilterBorder";
                        divFilterBorder.style.background = m_options.filter.backgroundBorder;
                        divFilterBorder.style.position = "absolute";
                        divFilterBorder.style.top = (dDDTop - m_options.filter.paddingBorder + 5) + "px";
                        divFilterBorder.style.left = (dDDLeft - m_options.filter.paddingBorder + 0) + "px";
                        divFilterBorder.style.height = (dDDHeight + 2 * m_options.filter.paddingBorder) + "px";
                        divFilterBorder.style.width = (dDDWidth + 2 * m_options.filter.paddingBorder) + "px";
                        m_jqParent.append(divFilterBorder);

                        // Create the div that holds the popup grid.
                        var divFilterGrid = document.createElement("div");
                        divFilterGrid.id = "FilterDropDown";
                        divFilterGrid.style.position = "absolute";
                        divFilterGrid.style.top = (dDDTop + 5) + "px";
                        divFilterGrid.style.left = (dDDLeft + 0) + "px";
                        divFilterGrid.style.height = (dDDHeight) + "px";
                        divFilterGrid.style.width = (dDDWidth) + "px";
                        m_jqParent.append(divFilterGrid);

                        // Wire up the onSelectionChanged event to 
                        // update the filter text when it does so.
                        var functionOnSelectionChanged = function (arraySelectedRows) {

                            try {

                                // Process each selected row.
                                var strFilterText = "";
                                for (var iSR = 0; iSR < arraySelectedRows.length; iSR++) {

                                    // Get the row.
                                    var rowSelected = arraySelectedRows[iSR];

                                    // There is only one data item (for now, at least).
                                    var value = rowSelected[0].value;

                                    // Add it to the text.
                                    if (strFilterText.length > 0) {

                                        strFilterText += " | ";
                                    }
                                    strFilterText += value;
                                }

                                // Set the text in the filter text and select it.
                                divFilterText.value = strFilterText;
                            } catch (e) {

                                return e;
                            }
                        };

                        // Attach grid to filter grid div.
                        // Allocate a grid that will show filter values.
                        // Customize the options object slightly here.
                        var dgFilter = new DataGrid(m_strParentSelector + " #FilterDropDown",
                            [{

                                title: "",
                                mapping: "",
                                lineAlignment: column.lineAlignment,
                                width: column.width,
                                type: "string",
                                filter: null
                            }],
                            arrayData,
                            {
                                renderAsDropDown: true,
                                onSelectionChanged: functionOnSelectionChanged,
                                inPlaceEditable: false,
                                allowNew: false,
                                allowDelete: false,
                                closeOnEnter: true,        // this is a special tag that causes the keyhandler to send a mousedown 
                                columnHeader: {

                                    visible: false
                                },
                                rowHeader: {

                                    visible: false
                                },
                                scrollBar: m_options.scrollBar,
                                row: m_options.row,
                                cell: m_options.cell,
                                filter: m_options.filter
                            });

                        dgFilter.setSelectedRowIndicies(arraySelectedIndicies);

                        // Before creating an input, figure out where it needs to go.
                        // Note: there are a lot of dinky numbers here.  Necessary to position the cell directly over
                        // the existing text, and also these values vary from IE to Chrome, but these values are OK.
                        var dDDLeft = position.left + m_rectangleColumnHeaders.left + column.left + m_options.columnHeader.padding;
                        var dDDWidth = column.width - 2 * m_options.columnHeader.padding - 4;
                        var dFTTop = position.top + m_rectangleColumnHeaders.top +
                            m_options.columnHeader.height + m_options.columnHeader.padding - 1;
                        var dFTHeight = m_options.columnHeader.height - m_options.columnHeader.padding - 1;

                        // Create a div to hold the input element.
                        var divText = document.createElement("div");
                        divText.id = "FilterTextHolder";
                        divText.style.background = "none";
                        divText.style.border = "none";
                        divText.style.position = "absolute";
                        divText.style.top = (dFTTop) + "px";
                        divText.style.left = (dDDLeft) + "px";
                        divText.style.height = (dFTHeight) + "px";
                        divText.style.width = (dDDWidth) + "px";
                        m_jqParent.append(divText);

                        // Create an input element to allow direct typing.
                        var divFilterText = document.createElement("input");
                        divFilterText.id = "FilterText";
                        divFilterText.type = "text";
                        divFilterText.style.background = m_options.filter.backgroundFilterText;
                        divFilterText.style.color = m_options.columnHeader.colorFilterText;
                        divFilterText.style.border = "none";
                        divFilterText.style.outline = "none";
                        divFilterText.style.spellcheck = "false";
                        divFilterText.style.font = m_options.columnHeader.font;
                        divFilterText.style.width = "100%";
                        divFilterText.style.height = "100%";
                        divFilterText.style["padding-left"] = (2) + "px";
                        divFilterText.style["padding-right"] = (2) + "px";
                        $(divText).append(divFilterText);

                        // Set the text from the column's filter values.
                        var strFilter = "";
                        if (column.filter != null) {

                            for (var iValue = 0; iValue < column.filter.length; iValue++) {

                                if (strFilter.length > 0) {

                                    strFilter += " | ";
                                }
                                strFilter += column.filter[iValue];
                            }
                        }
                        divFilterText.value = strFilter;

                        // Select all text.
                        divFilterText.select();

                        // Set focus.
                        divFilterText.focus();

                        // Wire up the text changed event so that selection 
                        // may be set in the drop down when the user types.
                        divFilterText.onkeyup = function (e) {

                            try {

                                // If command key, pass to command key handler method.
                                if (e.which === 13 ||
                                    e.which === 27 ||
                                    e.which === 38 ||
                                    e.which === 40) {

                                    // Don't update data if escape is pressed.
                                    if (e.which === 27) {

                                        m_bProcessEnter = false;
                                    }

                                    var exceptionRet = dgFilter.simulateKeyPress(e);
                                    if (exceptionRet !== null) {

                                        throw exceptionRet;
                                    }
                                } else {

                                    // Get the text.
                                    var strText = divFilterText.value;

                                    // Split up into '|' separated parts.
                                    var arrayFilters = strText.split("|");

                                    // Loop over filter strings and build the new 
                                    // set of selection indicies for the drop down.
                                    var arraySelectedIndiciesUpdate = [];
                                    for (var i = 0; i < arrayFilters.length; i++) {

                                        // Get the filter.
                                        var strFilter = arrayFilters[i].trim();

                                        // Get the index in the sorted mask collection.
                                        var iFilterIndex = arrayMaskUpper.indexOf(strFilter.toUpperCase());

                                        // Add that index to the list that is used to set the selected indicies.
                                        // These are the values that must match up betwixt the data and the mask.
                                        if (iFilterIndex !== -1) {

                                            arraySelectedIndiciesUpdate.push(iFilterIndex);
                                        }
                                    }

                                    // Set the selected items in the drop down.
                                    dgFilter.setSelectedRowIndicies(arraySelectedIndiciesUpdate);
                                }
                            } catch (e) {

                                return e;
                            }
                        };

                        // Assume enter will be hit (up to escape is hit).
                        m_bProcessEnter = true;

                        // Hook the click of the overlay to dismiss the filter drop down.
                        m_jqParent.children("#Overlay").bind("mousedown",
                            function (e,
                                bProcessEnter) {

                            try {

                                // Update state if passed in.
                                if (bProcessEnter !== undefined) {

                                    m_bProcessEnter = bProcessEnter;
                                }

                                // Only update the data if escape was not pressed.
                                if (m_bProcessEnter) {

                                    // Get the selected rows before destroying the grid.
                                    // self data will become the new column filter values.
                                    var arraySelectedRows = dgFilter.getSelectedRows();

                                    // Set the column's filter from the selected rows.
                                    if (arraySelectedRows === null ||
                                        arraySelectedRows.length === 0) {

                                        // clear out the column filter.
                                        column.filter = null;
                                    } else {

                                        column.filter = [];

                                        // Process each selected row.
                                        for (var iSR = 0; iSR < arraySelectedRows.length; iSR++) {

                                            // Get the row.
                                            var rowSelected = arraySelectedRows[iSR];

                                            // There is only one data item (for now, at least).
                                            var value = rowSelected[0].value;

                                            if (value === m_options.blankFilterString) {

                                                value = "";
                                            }

                                            // Add it to the collection.
                                            column.filter.push(value);
                                        }

                                        // Do not allow filtering if all values are selected.
                                        if (column.filter.length === arrayData.length) {

                                            column.filter = null;
                                        }
                                    }

                                    // Reset render state.
                                    m_bColumnHeaderDirty = true;
                                    m_bColumnHeaderEaselDirty = true;
                                    m_bVerticalScrollBarDirty = true;
                                    m_bVerticalScrollBarEaselDirty = true;
                                    m_bViewDirty = true;
                                    m_iLastSelectedRow = -1;
                                    m_iFirstVisibleRow = 0;
                                    m_arraySelectedRows = [];

                                    // Raise the event, if set.
                                    if (m_options.onSelectionChanged !== null) {

                                        // Call getSelectedRows to return row objects, not their indicies.
                                        m_options.onSelectionChanged(self.getSelectedRows());
                                    }
                                }

                                // Destroy the grid.
                                dgFilter.destroy();

                                // Remove the DOM elements.
                                m_jqParent.children("#Overlay").remove();
                                m_jqParent.children("#FilterDropDown").remove();
                                m_jqParent.children("#FilterBorder").remove();
                                m_jqParent.children("#FilterTextHolder").remove();

                                // Force a render.
                                m_functionRender();
                            } catch (e) {

                                return e;
                            }
                        });

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Modify sort.
                var m_functionSort = function (e,
                    dX) {

                    try {

                        // Get the column sorted.
                        var dTestX = - m_dScrollOffsetX;
                        var iColumnClicked = -1;
                        for (var iColumn = 0; iColumn < m_arrayColumns.length; iColumn++) {

                            // Skip if invisible.
                            if (m_arrayColumns[iColumn].visible === false) {

                                continue;
                            }

                            m_arrayColumns[iColumn].left = dTestX;
                            dTestX += m_arrayColumns[iColumn].width;

                            if (dX < dTestX) {

                                iColumnClicked = iColumn;
                                break;
                            }
                        }

                        // Must have clicked on an actual column.
                        if (iColumnClicked === -1) {

                            return null;
                        }

                        var columnThe = m_arrayColumns[iColumnClicked];
                        var bShift = e.shiftKey;

                        // If no shift key, then clear out all the non-clicked sort informations
                        var iSortOrder = 1;
                        if (bShift === false) {

                            // Loop over columns and clear sort.
                            for (var iColumn = 0; iColumn < m_arrayColumns.length; iColumn++) {

                                if (iColumn === iColumnClicked) {

                                    continue;
                                }

                                // Get Ith column.
                                var columnIth = m_arrayColumns[iColumn];

                                // Clear.
                                columnIth.sortOrder = 0;
                                columnIth.sortDirection = "Descending";
                            }

                            var strSortDirection = "Ascending";
                            if (columnThe.sortOrder !== -1) {

                                if (columnThe.sortDirection === "Ascending") {

                                    strSortDirection = "Descending";
                                }
                            }

                            // Always reset the order on a non-shift.
                            columnThe.sortOrder = 1;
                            columnThe.sortDirection = strSortDirection;

                        } else {

                            // If the columnThe is already in the sort, then do not change its order, just its direction.
                            if (columnThe.sortOrder > 0) {

                                if (columnThe.sortDirection === "Ascending") {

                                    columnThe.sortDirection = "Descending";
                                } else {

                                    columnThe.sortDirection = "Ascending";
                                }
                            } else {

                                // Get the highest sort order and add one to it.
                                var iHighestSortOrder = 0;
                                for (var iColumn = 0; iColumn < m_arrayColumns.length; iColumn++) {

                                    // Get Ith column.
                                    var columnIth = m_arrayColumns[iColumn];

                                    // Clear.
                                    if (iHighestSortOrder < columnIth.sortOrder) {

                                        iHighestSortOrder = columnIth.sortOrder;
                                    }
                                }

                                // Update the column for the right sort.
                                columnThe.sortOrder = iHighestSortOrder + 1;
                                columnThe.sortDirection = "Ascending";
                            }
                        }

                        // Set what is dirty.
                        m_bViewSortDirty = true;
                        m_bColumnHeaderDirty = true;
                        m_bColumnHeaderEaselDirty = true;

                        // Force render.
                        return m_functionRender();
                    } catch (e) {

                        return e;
                    }
                };

                // Helper method Returns the string name of the region the point is in.
                var m_functionRegionFromPoint = function (dX,
                    dY) {

                    // Note: no exception handling.
                    // Determine the region under the cursor.
                    if (dX >= m_rectangleContent.left &&
                        dX < m_rectangleContent.left + m_rectangleContent.width &&
                        dY >= m_rectangleContent.top &&
                        dY < m_rectangleContent.top + m_rectangleContent.height) {

                        // Content.
                        return "Content";
                    } else if (dX >= m_rectangleColumnHeaders.left &&
                        dX < m_rectangleColumnHeaders.left + m_rectangleColumnHeaders.width &&
                        dY >= m_rectangleColumnHeaders.top &&
                        dY < m_rectangleColumnHeaders.top + m_rectangleColumnHeaders.height) {

                        // ColumnHeaders.
                        return "ColumnHeaders";
                    } else if (dX >= m_rectangleVerticalScrollBar.left &&
                        dX < m_rectangleVerticalScrollBar.left + m_rectangleVerticalScrollBar.width &&
                        dY >= m_rectangleVerticalScrollBar.top &&
                        dY < m_rectangleVerticalScrollBar.top + m_rectangleVerticalScrollBar.height) {

                        // VerticalScrollBar.
                        return "VerticalScrollBar";
                    } else if (dX >= m_rectangleHorizontalScrollBar.left &&
                        dX < m_rectangleHorizontalScrollBar.left + m_rectangleHorizontalScrollBar.width &&
                        dY >= m_rectangleHorizontalScrollBar.top &&
                        dY < m_rectangleHorizontalScrollBar.top + m_rectangleHorizontalScrollBar.height) {

                        // HorizontalScrollBar.
                        return "HorizontalScrollBar";
                    } else if (dX < m_rectangleContent.left) {

                        // RowHeaders.
                        return "RowHeaders";
                    }
                    return "none";
                };

                // Helper method merges optionsOverride with m_options.
                var m_functionProcessOptionsOverride = function () {

                    try {

                        // Override high-level options.
                        if (optionsOverride.background !== undefined) {

                            m_options.background = optionsOverride.background;
                        }
                        if (optionsOverride.inPlaceEditable !== undefined) {

                            m_options.inPlaceEditable = optionsOverride.inPlaceEditable;
                        }
                        if (optionsOverride.onInPlaceEdit !== undefined) {

                            m_options.onInPlaceEdit = optionsOverride.onInPlaceEdit;
                        }
                        if (optionsOverride.onDelete !== undefined) {

                            m_options.onDelete = optionsOverride.onDelete;
                        }
                        if (optionsOverride.onNew !== undefined) {

                            m_options.onNew = optionsOverride.onNew;
                        }
                        if (optionsOverride.onSelectionChanged !== undefined) {

                            m_options.onSelectionChanged = optionsOverride.onSelectionChanged;
                        }
                        if (optionsOverride.backgroundNull !== undefined) {

                            m_options.backgroundNull = optionsOverride.backgroundNull;
                        }
                        if (optionsOverride.updateFrequency !== undefined) {

                            m_options.updateFrequency = optionsOverride.updateFrequency;
                        }
                        if (optionsOverride.closeOnEnter !== undefined) {

                            m_options.closeOnEnter = optionsOverride.closeOnEnter;
                        }
                        if (optionsOverride.renderAsDropDown !== undefined) {

                            m_options.renderAsDropDown = optionsOverride.renderAsDropDown;
                        }
                        if (optionsOverride.blankFilterString !== undefined) {

                            m_options.blankFilterString = optionsOverride.blankFilterString;
                        }

                        // Override child objects.
                        if (optionsOverride.columnHeader !== undefined) {

                            // Get keys from columnHeader object.
                            var arrayKeys = Object.keys(optionsOverride.columnHeader);
                            for (var i = 0; i < arrayKeys.length; i++) {

                                var strKeys = arrayKeys[i];
                                m_options.columnHeader[strKeys] = optionsOverride.columnHeader[strKeys];
                            }
                        }
                        if (optionsOverride.rowHeader !== undefined) {

                            // Get keys from columnHeader object.
                            var arrayKeys = Object.keys(optionsOverride.rowHeader);
                            for (var i = 0; i < arrayKeys.length; i++) {

                                var strKeys = arrayKeys[i];
                                m_options.rowHeader[strKeys] = optionsOverride.rowHeader[strKeys];
                            }
                        }
                        if (optionsOverride.scrollBar !== undefined) {

                            // Get keys from columnHeader object.
                            var arrayKeys = Object.keys(optionsOverride.scrollBar);
                            for (var i = 0; i < arrayKeys.length; i++) {

                                var strKeys = arrayKeys[i];
                                m_options.scrollBar[strKeys] = optionsOverride.scrollBar[strKeys];
                            }
                        }
                        if (optionsOverride.row !== undefined) {

                            // Get keys from columnHeader object.
                            var arrayKeys = Object.keys(optionsOverride.row);
                            for (var i = 0; i < arrayKeys.length; i++) {

                                var strKeys = arrayKeys[i];
                                m_options.row[strKeys] = optionsOverride.row[strKeys];
                            }
                        }
                        if (optionsOverride.cell !== undefined) {

                            // Get keys from columnHeader object.
                            var arrayKeys = Object.keys(optionsOverride.cell);
                            for (var i = 0; i < arrayKeys.length; i++) {

                                var strKeys = arrayKeys[i];
                                m_options.cell[strKeys] = optionsOverride.cell[strKeys];
                            }
                        }
                        if (optionsOverride.filter !== undefined) {

                            // Get keys from columnHeader object.
                            var arrayKeys = Object.keys(optionsOverride.filter);
                            for (var i = 0; i < arrayKeys.length; i++) {

                                var strKeys = arrayKeys[i];
                                m_options.filter[strKeys] = optionsOverride.filter[strKeys];
                            }
                        }
                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Handle vertical scroll.
                var m_functionVerticalScroll = function () {

                    try {

                        // Figure out how many rows are scrolled.
                        var dRowsScrolled = m_sizeDrag.height / m_dVerticalScrollBar_PixelsPerRow;

                        m_iFirstVisibleRow = dRowsScrolled + m_iInitialFirstVisibleRow;

                        // Check bounds.
                        if (m_iFirstVisibleRow > m_iNumberOfVisibleRows - m_iVisibleRows + 1) {

                            m_iFirstVisibleRow = m_iNumberOfVisibleRows - m_iVisibleRows + 1;
                        }
                        // Run this second because the above might make it negative too.
                        if (m_iFirstVisibleRow < 0) {

                            m_iFirstVisibleRow = 0;
                        }

                        // Normalize.
                        m_iFirstVisibleRow = Math.floor(m_iFirstVisibleRow);

                        // Invalidate.
                        m_bVerticalScrollBarEaselDirty = true;
                        m_bVerticalScrollBarDirty = true;

                        // Immediately render.
                        return m_functionRender();
                    } catch (e) {

                        return e;
                    }
                };

                // Handle horizontal scroll.
                var m_functionHorizontalScroll = function (e) {

                    try {

                        // Figure out how many pixels are scrolled.
                        var dPixelsScrolled = m_sizeDrag.width / m_dHorizontalScrollBar_PixelsPerPixel;

                        m_dScrollOffsetX = dPixelsScrolled + m_dInitialScrollOffsetX;
                        var iNumberOfPixels = m_dTotalColumnWidth;

                        // Check bounds.
                        if (m_dScrollOffsetX < 0) {

                            m_dScrollOffsetX = 0;
                        } else if (m_dScrollOffsetX > iNumberOfPixels - m_rectangleContent.width) {

                            m_dScrollOffsetX = iNumberOfPixels - m_rectangleContent.width;
                        }

                        // Normalize.
                        m_dScrollOffsetX = Math.floor(m_dScrollOffsetX);

                        // Invalidate.
                        m_bColumnHeaderDirty = true;
                        m_bHorizontalScrollBarEaselDirty = true;
                        m_bHorizontalScrollBarDirty = true;

                        // Immediately render.
                        return m_functionRender();
                    } catch (e) {

                        return e;
                    }
                };

                // Setup grid for in-place editing.
                var m_functionConfigureInPlaceEdit = function (iRow,
                    iColumn) {

                    try {

                        // Store state.
                        m_iInPlaceEditRow = iRow;
                        m_iInPlaceEditColumn = iColumn;
                        m_bInPlaceEditing = true;

                        // Grab the existing row and save off.  This is used for roll-back and
                        // to send to the InPlaceEdited event to update the remove data store.
                        m_arrayInPlaceEditRow = m_arrayView[m_iInPlaceEditRow];

                        // Get and hold on to the in-place edit column as well.
                        m_columnInPlaceEdit = m_arrayColumns[m_iInPlaceEditColumn];

                        // Clone row to save off pre-edit values.
                        m_arrayInPlaceEditRowSave = [];
                        for (var i = 0; i < m_arrayInPlaceEditRow.length; i++) {

                            var cellIth = m_arrayInPlaceEditRow[i];
                            m_arrayInPlaceEditRowSave.push({

                                index: i,
                                value: cellIth.value
                            });
                        }

                        // And the in-place selection.
                        m_iInPlaceEditSelectionStart = 0;
                        m_iInPlaceEditSelectionLength = m_arrayInPlaceEditRow[iColumn].formattedValue.length;

                        // Content is always updated, force column headers as well.
                        m_bColumnHeaderDirty = true;
                        m_bColumnHeaderEaselDirty = true;

                        // Update display immediately.
                        return m_functionRender();
                    } catch (e) {

                        return e;
                    }
                };

                // Comit current in-place edit.
                var m_functionComitInPlaceEdit = function () {

                    // Definte a function that is invoked when the onInplaceEdit call completes (by the callee).
                    var functionCallbackComplete = function () {

                        try {

                            m_bInPlaceEditing = false;

                            // Content is always updated, force column headers as well.
                            m_bViewDirty = true;
                            m_bColumnHeaderDirty = true;
                            m_bColumnHeaderEaselDirty = true;

                            // Recompute totals--the might become too expensive to do for every 
                            // change--might have to track and only compute when strictly needed.
                            var exceptionRet = m_functionComputeTotals();
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }

                            // Immediately update display.
                            exceptionRet = m_functionRender();
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }

                            // Select the just-edited row.
                            m_functionSelectAndEnsureVisible(m_arrayInPlaceEditRow[m_options.uidColumnIndex].value);

                            // Immediately update display.
                            exceptionRet = m_functionRender();
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    try {

                        // Commit the current cell.
                        var exceptionRet = m_functionSaveCurrentInPlaceEditColumnValue();
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }

                        // Raise inplace edit event.
                        if ($.isFunction(m_options.onInPlaceEdit)) {

                            // Convert from internal to external format.
                            var rowOriginal = {};
                            var rowNew = {};
                            for (var i = 0; i < m_arrayColumns.length; i++) {

                                var columnIth = m_arrayColumns[i];
                                rowOriginal[columnIth.mapping] = m_arrayInPlaceEditRowSave[i].value;
                                rowNew[columnIth.mapping] = m_arrayInPlaceEditRow[i].value;
                                
                                // If string, possibly replace single quotes so they pass SQL muster.
                                if (typeof rowNew[columnIth.mapping] === 'string') {

                                    rowNew[columnIth.mapping] = rowNew[columnIth.mapping].replace(/'/g, "''");
                                }
                            }

                            // Invoke the in place event handler.
                            m_options.onInPlaceEdit(rowOriginal,
                                rowNew,
                                functionCallbackComplete);
                        } else {

                            alert("Please implement onDelete event.");

                            // Manually call the callback.
                            functionCallbackComplete();
                        }

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Roll-back current in-place edit.
                var m_functionRollBackInPlaceEdit = function () {

                    try {

                        // Commit the current cell--but only so there is a change and so it gets reverted back....
                        var exceptionRet = m_functionSaveCurrentInPlaceEditColumnValue();
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }

                        // Roll-back changes.
                        var exceptionRet = self.mergeRow(m_arrayInPlaceEditRowSave);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }

                        m_bInPlaceEditing = false;

                        // Content is always updated, force column headers as well.
                        m_bColumnHeaderDirty = true;
                        m_bColumnHeaderEaselDirty = true;

                        // Immediately update display.
                        return m_functionRender();
                    } catch (e) {

                        return e;
                    } finally {

                        // Select the just-edited row.
                        m_functionSelectAndEnsureVisible(m_arrayInPlaceEditRow[m_options.uidColumnIndex].value,
                            true);
                    }
                };

                // Save off the newly typed value for the current in-place edit cell.  Done 
                // here rather than on key press to allow for invalid intermediate states.
                var m_functionSaveCurrentInPlaceEditColumnValue = function () {

                    try {

                        // Get the cell in question.
                        var cellInPlaceEdit = m_arrayInPlaceEditRow[m_iInPlaceEditColumn];
                        // Get the current value.
                        var strFormattedValue = cellInPlaceEdit.formattedValue;

                        // Affect column value based on its column type.
                        if (m_columnInPlaceEdit.type === undefined ||
                            m_columnInPlaceEdit.type === "string") {

                            // Just save the value.
                            m_arrayInPlaceEditRow[m_iInPlaceEditColumn].lastValue = undefined;
                            m_arrayInPlaceEditRow[m_iInPlaceEditColumn].value = strFormattedValue;

                            // And ensure even the partial value is positioned correctly.
                            m_arrayInPlaceEditRow[m_iInPlaceEditColumn].sizeRender = undefined;
                        } else if (m_columnInPlaceEdit.type === "amount") {

                            // Strip off formatting strings.
                            strFormattedValue = strFormattedValue.replace(/,/g, "");

                            // Parse into type.
                            var mValue = parseFloat(strFormattedValue);

                            // Fix if invalid.
                            if (isNaN(mValue) ||
                                mValue === null ||
                                mValue === undefined) {

                                mValue = 0;
                            }

                            // Ensure there is a change.
                            m_arrayInPlaceEditRow[m_iInPlaceEditColumn].lastValue = -1;

                            // Set in cell.
                            m_arrayInPlaceEditRow[m_iInPlaceEditColumn].value = mValue;

                            // And ensure even the partial value is positioned correctly.
                            m_arrayInPlaceEditRow[m_iInPlaceEditColumn].sizeRender = undefined;
                        } else if (m_columnInPlaceEdit.type === "date" ||
                            m_columnInPlaceEdit.type === "dateTime") {

                            // Strip off formatting strings.
                            strFormattedValue = strFormattedValue.replace(/,/g, "");

                            // Parse into type.
                            var dateValue = new Date(strFormattedValue);

                            // Fix if invalid.
                            if (dateValue !== undefined &&
                                dateValue !== null &&
                                Object.prototype.toString.call(dateValue) === "[object Date]") {

                                // It is a date.
                                if (isNaN(dateValue.getTime())) {

                                    // Date is not valid.
                                    dateValue = new Date();
                                }
                            }
                            else {

                                // Not a date.
                                dateValue = new Date();
                            }

                            // Ensure there is a change.
                            m_arrayInPlaceEditRow[m_iInPlaceEditColumn].lastValue = null;

                            // Set in cell.
                            m_arrayInPlaceEditRow[m_iInPlaceEditColumn].value = dateValue;

                            // And ensure even the partial value is positioned correctly.
                            m_arrayInPlaceEditRow[m_iInPlaceEditColumn].sizeRender = undefined;
                        }

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Handle keys for in-place editing.
                var m_functionHandleInPlaceEditKeyPress = function (e) {

                    try {

                        // Save this state.
                        var bShift = (e.shiftKey);
                        var bCtrl = (e.ctrlKey);

                        // Change target columns on tab.
                        if (e.which === 9) {

                            // Save off the current value.
                            var exceptionRet = m_functionSaveCurrentInPlaceEditColumnValue();
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }

                            // Update the column.
                            do {

                                // Scroll left on shift, right not.
                                if (!bShift) {

                                    // Increase column or flip to beginning.
                                    if (m_iInPlaceEditColumn < m_arrayColumns.length - 1) {

                                        m_iInPlaceEditColumn++;
                                    } else {

                                        m_iInPlaceEditColumn = 0;
                                    }
                                } else {

                                    // Decrease column or flup to end.
                                    if (m_iInPlaceEditColumn > 0) {

                                        m_iInPlaceEditColumn--;
                                    } else {

                                        m_iInPlaceEditColumn = m_arrayColumns.length - 1;
                                    }
                                }

                                // Set the column state.
                                m_columnInPlaceEdit = m_arrayColumns[m_iInPlaceEditColumn];
                            } while (m_columnInPlaceEdit.visible === false);

                            // And the in-place selection.
                            m_iInPlaceEditSelectionStart = 0;

                            // Ensure there is a good formatted value for the in-place edit cell--even if it is not visible.
                            if (!m_arrayInPlaceEditRow[m_iInPlaceEditColumn].formattedValue) {

                                m_arrayInPlaceEditRow[m_iInPlaceEditColumn].formattedValue = m_functionFormatValue(m_arrayInPlaceEditRow[m_iInPlaceEditColumn].value,
                                    m_columnInPlaceEdit);
                            }

                            m_iInPlaceEditSelectionLength = m_arrayInPlaceEditRow[m_iInPlaceEditColumn].formattedValue.length;

                            // Cause an immediate redraw so the user can see the new column being edited.
                            return m_functionRender();
                        }

                        // Get the cell in question.
                        var cellInPlaceEdit = m_arrayInPlaceEditRow[m_iInPlaceEditColumn];
                        // Get the current value.
                        var strFormattedValue = cellInPlaceEdit.formattedValue;
                        // Assume, for now, that no value is actually changed.
                        var bModifiedValue = false;

                        // Test column for select--they are handled differently.
                        if (m_columnInPlaceEdit.select === false) {

                            // Process the key typed.
                            if (e.keyCode === 37) {                     // Left arrow.

                                // Resize the selection if shift.
                                if (bShift) {

                                    // Don't allow stretch that can go before the first character.  
                                    // But do, incidentally, allow negative lengths.
                                    if (m_iInPlaceEditSelectionStart + m_iInPlaceEditSelectionLength > 0) {

                                        m_iInPlaceEditSelectionLength--;
                                    }
                                } else {

                                    // No shift means move the selection start.

                                    // Fix up the selection length if negative.
                                    if (m_iInPlaceEditSelectionLength < 0) {

                                        m_iInPlaceEditSelectionStart += m_iInPlaceEditSelectionLength;
                                        m_iInPlaceEditSelectionLength *= -1;
                                    }

                                    // Move the selection start if just a line (0 width).
                                    if (m_iInPlaceEditSelectionLength === 0) {

                                        // Only allow move back if not at the first character.
                                        if (m_iInPlaceEditSelectionStart > 0) {

                                            m_iInPlaceEditSelectionStart--;
                                        }
                                    } else {

                                        // If the selection is wide, then make it narrow before moving selection.
                                        m_iInPlaceEditSelectionLength = 0;
                                    }
                                }

                                // Cause an immediate redraw so the user can see the new selection.
                                return m_functionRender();
                            } else if (e.keyCode === 39) {              // Right arrow.

                                // Resize the selection if shift.
                                if (bShift) {

                                    // Only allow resize to continue if not off the end of the string.
                                    if (m_iInPlaceEditSelectionStart + m_iInPlaceEditSelectionLength < cellInPlaceEdit.formattedValue.length) {

                                        m_iInPlaceEditSelectionLength++;
                                    }
                                } else {

                                    // No shift means move the selection start.

                                    // Fix up the selection length if negative.
                                    if (m_iInPlaceEditSelectionLength < 0) {

                                        m_iInPlaceEditSelectionStart += m_iInPlaceEditSelectionLength;
                                        m_iInPlaceEditSelectionLength *= -1;
                                    }

                                    // Only move the selection if narrow.
                                    if (m_iInPlaceEditSelectionLength === 0) {

                                        // Only set the start if less than the end of the string.
                                        if (m_iInPlaceEditSelectionStart < cellInPlaceEdit.formattedValue.length) {

                                            m_iInPlaceEditSelectionStart++;
                                        }
                                    } else {

                                        // Snap to the right and make narrow.
                                        m_iInPlaceEditSelectionStart += m_iInPlaceEditSelectionLength;
                                        m_iInPlaceEditSelectionLength = 0;
                                    }
                                }

                                // Cause an immediate redraw so the user can see the new selection.
                                return m_functionRender();
                            } else if (e.keyCode === 8) {               // Backspace.

                                // Fix up the selection length if negative.
                                if (m_iInPlaceEditSelectionLength < 0) {

                                    m_iInPlaceEditSelectionStart += m_iInPlaceEditSelectionLength;
                                    m_iInPlaceEditSelectionLength *= -1;
                                }

                                // If there is a selection to clear out, then do so.
                                if (m_iInPlaceEditSelectionLength > 0) {

                                    // Set the cell value to the un-selected ranges before and after the selection.
                                    strFormattedValue = strFormattedValue.substr(0,
                                        m_iInPlaceEditSelectionStart) + strFormattedValue.substr(m_iInPlaceEditSelectionStart + m_iInPlaceEditSelectionLength);

                                    // Indicate the value is modified.
                                    bModifiedValue = true;

                                    // Reset the selection length after delete complete.
                                    m_iInPlaceEditSelectionLength = 0;
                                } else {

                                    // Process normal overwriting backspace: erase the character just before the (narrow) selection start.
                                    if (m_iInPlaceEditSelectionStart > 0) {

                                        // Set the cell value to the range before the selection - 1 and after the selection.
                                        strFormattedValue = strFormattedValue.substr(0,
                                            m_iInPlaceEditSelectionStart - 1) + strFormattedValue.substr(m_iInPlaceEditSelectionStart);

                                        // Indicate the value is modified.
                                        bModifiedValue = true;

                                        // Move the selection back one place.
                                        m_iInPlaceEditSelectionStart--;
                                    }
                                }
                            } else if (e.keyCode === 46) {               // Delete.

                                // Fix up the selection length if negative.
                                if (m_iInPlaceEditSelectionLength < 0) {

                                    m_iInPlaceEditSelectionStart += m_iInPlaceEditSelectionLength;
                                    m_iInPlaceEditSelectionLength *= -1;
                                }

                                // If there is a selection to clear out, then do so.
                                if (m_iInPlaceEditSelectionLength > 0) {

                                    // Set the cell value to the un-selected ranges before and after the selection.
                                    strFormattedValue = strFormattedValue.substr(0,
                                        m_iInPlaceEditSelectionStart) + strFormattedValue.substr(m_iInPlaceEditSelectionStart + m_iInPlaceEditSelectionLength);

                                    // Indicate the value is modified.
                                    bModifiedValue = true;

                                    // Reset the selection length after delete complete.
                                    m_iInPlaceEditSelectionLength = 0;
                                }
                            } else if (e.keyCode >= ' '.charCodeAt(0) &&
                                e.keyCode <= '~'.charCodeAt(0)) {           // Alpha character.

                                // Fix up the selection length if negative.
                                if (m_iInPlaceEditSelectionLength < 0) {

                                    m_iInPlaceEditSelectionStart += m_iInPlaceEditSelectionLength;
                                    m_iInPlaceEditSelectionLength *= -1;
                                }

                                // Check for a few special editing key combinations of ctrl is down.
                                if (bCtrl) {

                                    // Handle the special keys.
                                    if (e.keyCode == 88) {           // Cut.

                                        // Save clipboard.
                                        m_strClipboard = strFormattedValue.substr(m_iInPlaceEditSelectionStart, m_iInPlaceEditSelectionLength);

                                        // Cut.
                                        strFormattedValue = strFormattedValue.substr(0, m_iInPlaceEditSelectionStart) +
                                            strFormattedValue.substr(m_iInPlaceEditSelectionStart + m_iInPlaceEditSelectionLength);

                                        // Indicate the value is modified.
                                        bModifiedValue = true;

                                        // Reset the selection length after delete complete.
                                        m_iInPlaceEditSelectionLength = 0;
                                    } else if (e.keyCode == 67) {    // Copy.

                                        // Save clipboard but don't do anything else.
                                        m_strClipboard = strFormattedValue.substr(m_iInPlaceEditSelectionStart, m_iInPlaceEditSelectionLength);
                                    } else if (e.keyCode == 86) {    // Paste.

                                        // Replace if clipboard has a value.
                                        if (m_strClipboard !== null) {

                                            strFormattedValue = strFormattedValue.substr(0, m_iInPlaceEditSelectionStart) +
                                                m_strClipboard +
                                                strFormattedValue.substr(m_iInPlaceEditSelectionStart + m_iInPlaceEditSelectionLength);

                                            // Indicate the value is modified.
                                            bModifiedValue = true;

                                            // Move the selection over past the pasted length and ensure narrow selection.
                                            m_iInPlaceEditSelectionStart += m_strClipboard.length;
                                            m_iInPlaceEditSelectionLength = 0;
                                        }
                                    }
                                } else {

                                    // Set the value to three parts: the range before the selection, the character typed and the part after the selection.
                                    strFormattedValue = strFormattedValue.substr(0, m_iInPlaceEditSelectionStart) +
                                        String.fromCharCode(e.keyCode) +
                                        strFormattedValue.substr(m_iInPlaceEditSelectionStart + m_iInPlaceEditSelectionLength);

                                    // Indicate the value is modified.
                                    bModifiedValue = true;

                                    // Move the selection over one place and ensure narrow selection.
                                    m_iInPlaceEditSelectionStart++;
                                    m_iInPlaceEditSelectionLength = 0;
                                }
                            }
                        } else {

                            // Get the collection of column values.
                            var arrayColumnValues = m_columnInPlaceEdit.values;

                            // Find the current selection index.
                            var iIndex = 0;
                            for (var i = 0; i < m_columnInPlaceEdit.values.length; i++) {

                                // Extract the ith value.
                                var strIthValue = m_columnInPlaceEdit.values[i];

                                // Compare.
                                if (strIthValue === strFormattedValue) {

                                    iIndex = i;
                                    break;
                                }
                            }

                            // Process up or down arrow keys.
                            if (e.keyCode === 38) {                     // Up arrow.

                                if (iIndex > 0) {

                                    iIndex--;
                                }
                            } else if (e.keyCode === 40) {              // Down arrow.

                                if (iIndex < m_columnInPlaceEdit.values.length - 1) {

                                    iIndex++;
                                }
                            } else if (e.keyCode >= ' '.charCodeAt(0) &&
                                e.keyCode <= '~'.charCodeAt(0)) {           // Alpha character.

                                // Get the string for which to search.
                                var strSearch = String.fromCharCode(e.keyCode).toUpperCase();

                                // Either accumulate or start a new string.
                                var dateNow = new Date();
                                var iMSSince1970 = dateNow.getTime();
                                if (iMSSince1970 - m_iLastTypeTime < 250) {

                                    m_strAutoCompleteString += strSearch;
                                } else {

                                    m_strAutoCompleteString = strSearch;
                                }
                                m_iLastTypeTime = iMSSince1970;

                                // Find the index of the first item whose first character matches the types character.
                                var iIndex = 0;
                                for (var i = 0; i < m_columnInPlaceEdit.values.length; i++) {

                                    // Extract the ith value.
                                    var strIthValue = m_columnInPlaceEdit.values[i];

                                    // Compare.
                                    var strItem = strIthValue.substr(0, Math.min(m_strAutoCompleteString.length, strIthValue.length)).toUpperCase();
                                    if (strItem === m_strAutoCompleteString) {

                                        iIndex = i;
                                        break;
                                    }
                                }
                            }

                            // Indicate the value is about to be modified.
                            bModifiedValue = true;

                            // Set the new value.
                            strFormattedValue = m_columnInPlaceEdit.values[iIndex];

                            // Always select entire string.
                            m_iInPlaceEditSelectionStart = 0;
                            m_iInPlaceEditSelectionLength = strFormattedValue.length;
                        }

                        // Update value if modified.
                        if (bModifiedValue) {

                            // Just save the value.
                            m_arrayInPlaceEditRow[m_iInPlaceEditColumn].formattedValue = strFormattedValue;

                            // And ensure even the partial value is positioned correctly.
                            m_arrayInPlaceEditRow[m_iInPlaceEditColumn].sizeRender = undefined;
                        }

                        // Key pressed -> redraw.
                        return m_functionRender();
                    } catch (e) {

                        return e;
                    }
                };

                // Method selects the row and scrolls view till it is visible.
                var m_functionSelectAndEnsureVisible = function (uid) {

                    try {

                        // Get the index of the row.
                        var iIndex = m_functionGetViewRowIndexByUID(uid);
                        if (iIndex === -1) {

                            // Row is not in view--can't be selected or made visible.
                            return null;
                        }

                        // Set the selection.
                        self.setSelectedRowIndicies([iIndex]);

                        // Determine if the row is visible...
                        var bScroll = false;
                        if (iIndex < m_iFirstVisibleRow) {

                            m_iFirstVisibleRow = iIndex;
                            bScroll = true;
                        } else if (iIndex >= m_iFirstVisibleRow + m_iVisibleRows) {

                            m_iFirstVisibleRow = iIndex + m_iVisibleRows - 1;
                            bScroll = true;
                        }

                        // ...and scroll into view if not so.
                        if (bScroll) {

                            // Check bounds.
                            if (m_iFirstVisibleRow > m_iNumberOfVisibleRows - m_iVisibleRows + 1) {

                                m_iFirstVisibleRow = m_iNumberOfVisibleRows - m_iVisibleRows + 1;
                            }
                            if (m_iFirstVisibleRow < 0) {

                                m_iFirstVisibleRow = 0;
                            }

                            // Invalidate.
                            m_bVerticalScrollBarEaselDirty = true;
                            m_bVerticalScrollBarDirty = true;

                            // Render.
                            return m_functionRender();
                        }
                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                ///////////////////////////////////
                // Private event handlers.

                // Called to resize grid based on new container size.
                var m_functionResize = function (e) {

                    try {

                        // Just return if in process of resizing and get another 
                        // request to resize.  Sometimes, many resize requests 
                        // come in at the same time--this is an attempt to mitigate.
                        if (m_cookieResize !== undefined) {

                            return null;
                        }

                        // Define function which handles the actual resizing.
                        var functionResize = function () {

                            // Set the object state.
                            m_dWidth = m_jqParent.width();
                            m_dHeight = m_jqParent.height();

                            // Don't allow too big or too small.
                            if (m_dWidth > 1920) {

                                m_dWidth = 1920;
                            }
                            if (m_dHeight > 1080) {

                                m_dHeight = 1080;
                            }
                            if (m_dWidth < 100) {

                                m_dWidth = 100;
                            }
                            if (m_dHeight < 100) {

                                m_dHeight = 100;
                            }

                            // Update the size of the canvases.
                            m_canvasRender.width = m_dWidth;
                            m_canvasRender.height = m_dHeight;
                            m_canvasRender.style.width = m_dWidth;
                            m_canvasRender.style.height = m_dHeight;
                            m_canvasVerticalScrollBarEasel.height = m_dHeight;
                            m_canvasVerticalScrollBarEasel.style.height = m_dHeight;
                            m_canvasHorizontalScrollBarEasel.width = m_dWidth;
                            m_canvasHorizontalScrollBarEasel.style.width = m_dWidth;
                            m_canvasWorkEasel.width = m_dWidth;
                            m_canvasWorkEasel.style.width = m_dWidth;

                            // Set dirty.
                            m_bColumnHeaderDirty = true;
                            m_bColumnHeaderEaselDirty = true;
                            m_bComponentRectanglesDirty = true;
                            m_bHorizontalScrollBarDirty = true;
                            m_bHorizontalScrollBarEaselDirty = true;
                            m_bVerticalScrollBarDirty = true;
                            m_bVerticalScrollBarEaselDirty = true;
                            m_bNullBottomRightDirty = true;
                            m_bNullTopRightDirty = true;

                            // Check bounds.
                            if (m_iFirstVisibleRow > m_iNumberOfVisibleRows - m_iVisibleRows + 1) {

                                m_iFirstVisibleRow = m_iNumberOfVisibleRows - m_iVisibleRows + 1;
                            }
                            if (m_iFirstVisibleRow < 0) {

                                m_iFirstVisibleRow = 0;
                            }

                            // Update dislpay immediately.
                            var exceptionRet = m_functionRender();

                            // Reset cookie, now that resize done.
                            m_cookieResize = undefined;

                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        };

                        // Resize in a bit.
                        m_cookieResize = setTimeout(functionResize,
                            10);

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Invoked when a key is depressed.
                var m_functionOnKeyDown = function (e) {

                    try {

                        // Never change pages on a backspace and keep focus on tabs.
                        if (e.which === 8 ||
                            e.which === 9 ||
                            (e.keyCode === 67 && e.ctrlKey) ||  // Ctrl-C
                            (e.keyCode === 86 && e.ctrlKey) ||  // Ctrl-V
                            (e.keyCode === 88 && e.ctrlKey)) {  // Ctrl-X

                            e.preventDefault();
                            e.stopPropagation();

                            // If in place editing, do simulate the keypress.
                            if (m_bInPlaceEditing) {

                                // Just call the helper.
                                var exceptionRet = m_functionOnKeyPress(e);
                                if (exceptionRet !== null) {

                                    throw exceptionRet;
                                }
                            }
                        } else if ((m_bInPlaceEditing) &&
                            (e.which === 37 ||
                            e.which === 38 ||
                            e.which === 39 ||
                            e.which === 40)) {               // Pass arrow keys.

                            var exceptionRet = m_functionOnKeyPress(e);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        }

                        // Handle in-place editing in a different place (keypress).
                        if (m_bInPlaceEditing) {

                            // Don't process below.
                            return true;
                        }

                        // Handle the cursor keys like the mouse down.
                        if (e.which === 38) {                           // Up arrow.

                            var iNewIndex = m_iLastSelectedRow - 1;
                            if (iNewIndex < 0) {

                                iNewIndex = 0;

                            }
                            m_functionProcessLeftLikeMouseAction(e,
                                iNewIndex);

                            // Check for forced scroll.
                            if (iNewIndex < m_iFirstVisibleRow) {

                                // Send a vertical scroll bar up arrow?
                                m_iInitialFirstVisibleRow = m_iFirstVisibleRow;
                                m_sizeDrag = { height: -m_dVerticalScrollBar_PixelsPerRow };

                                // After setting size drag, just simulate out the mouse move.
                                var exceptionRet = m_functionVerticalScroll();
                                if (exceptionRet !== null) {

                                    throw exceptionRet;
                                }
                            }

                            // Update for next call.
                            m_iLastSelectedRow = iNewIndex;

                            // Key pressed -> redraw.
                            return m_functionRender();
                        } else if (e.which === 40) {                    // Down arrow.

                            var iNewIndex = m_iLastSelectedRow + 1;
                            if (iNewIndex === m_iNumberOfVisibleRows) {

                                iNewIndex = m_iNumberOfVisibleRows - 1;
                            }
                            m_functionProcessLeftLikeMouseAction(e,
                                iNewIndex);

                            // Check for forced scroll.
                            if (iNewIndex >= m_iFirstVisibleRow + m_iVisibleRows - 1) {

                                // Send a vertical scroll bar up arrow?
                                m_iInitialFirstVisibleRow = m_iFirstVisibleRow;
                                m_sizeDrag = {

                                    height: m_dVerticalScrollBar_PixelsPerRow * (iNewIndex - m_iFirstVisibleRow - m_iVisibleRows + 2)
                                };

                                // After setting size drag, just simulate out the mouse move.
                                var exceptionRet = m_functionVerticalScroll();
                                if (exceptionRet !== null) {

                                    throw exceptionRet;
                                }
                            }

                            // Update for next call.
                            m_iLastSelectedRow = iNewIndex;
                            
                            // Key pressed -> redraw.
                            return m_functionRender();
                        } else if (e.which === 13) {

                            // Scan for overlay div, if found, this is a filter situation.
                            var jq = $(m_strParentSelector).parent().children("#Overlay");
                            if (jq.length !== 0 &&
                                m_options.closeOnEnter) {

                                // Set a tiny bit of state to indicate to the close handler that this is an enter and not an escape.
                                m_bProcessEnter = true;

                                // Send a click to the overlay.
                                jq.trigger("mousedown",
                                    true);
                            }

                            // Key pressed -> redraw.
                            return m_functionRender();
                        } else if (e.which === 27) {

                            // Scan for overlay div, if found, this is a filter situation.
                            var jq = $(m_strParentSelector).parent().children("#Overlay");
                            if (jq.length !== 0 &&
                                m_options.closeOnEnter) {

                                // Set a tiny bit of state to indicate to the close handler that self is an escape and not an enter.
                                m_bProcessEnter = false;

                                // self causes the overlay object to receive a mouse down which dismisses the filter drop down.
                                jq.trigger("mousedown",
                                    false);
                            }

                            // Key pressed -> redraw.
                            return m_functionRender();
                        }

                        return null;
                    } catch (e) {

                        alert(e.message);
                    }
                };

                // Invoked when a key is depressed and released.
                var m_functionOnKeyPress = function (e) {

                    try {

                        // We'll take it from here....
                        e.preventDefault();
                        e.stopPropagation();

                        // Handle in-place editing in a different place.
                        if (!m_bInPlaceEditing) {

                            return;
                        }

                        // Take care of key presses for in-place editing.
                        return m_functionHandleInPlaceEditKeyPress(e);
                    } catch (e) {

                        alert(e.message);
                    }
                };

                // Invoked when a key is released.
                var m_functionOnKeyUp = function (e) {

                    try {

                        // Handle in-place editing in a different place (keypress).
                        if (m_bInPlaceEditing) {

                            if (e.which === 13) {

                                // We'll take it from here....
                                e.preventDefault();
                                e.stopPropagation();

                                // Commit.
                                return m_functionComitInPlaceEdit();
                            } else if (e.which === 27) {

                                // We'll take it from here....
                                e.preventDefault();
                                e.stopPropagation();

                                // Rollback.
                                return m_functionRollBackInPlaceEdit();
                            }
                        }

                        return null;
                    } catch (e) {

                        alert(e.message);
                    }
                };

                // Invoked when the scroll wheel is scrolled.
                // Implemented to scroll the display.
                var m_functionOnScroll = function (e) {

                    try {

                        // Only scroll if necessary.
                        if (m_bVerticalScrollBarVisible) {

                            // Send a vertical scroll bar up arrow?
                            m_iInitialFirstVisibleRow = m_iFirstVisibleRow;
                            m_sizeDrag = {

                                height: -m_dVerticalScrollBar_PixelsPerRow * (e.wheelDelta / 120)
                            };

                            // After setting size drag, just simulate out the mouse move.
                            var exceptionRet = m_functionVerticalScroll();
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        }

                        return;
                    } catch (e) {

                        alert(e.message);
                    }
                };

                // Invoked when the grid is double-clicked.
                // Implemneted to raise the event to callers.
                var m_functionDoubleClick = function (e) {

                    try {

                        // Determine the row double-clicked.

                        // Just exit if not in-place editable.
                        if (m_options.inPlaceEditable === false ||
                            m_bInPlaceEditing) {

                            // Scan for overlay div, if found, this is a filter situation.
                            var jq = $(m_strParentSelector).parent().children("#Overlay");
                            if (jq.length !== 0 &&
                                m_options.closeOnEnter) {

                                // Set a tiny bit of state to indicate to the close handler that this is an enter and not an escape.
                                m_bProcessEnter = true;

                                // Send a click to the overlay.
                                jq.trigger("mousedown",
                                    true);
                            }

                            return;
                        }

                        // Extract coordinates relative to the upper-
                        // left hand corner of the render canvas.
                        var dX = e.offsetX;
                        var dY = e.offsetY;
                        m_pointDown = {

                            left: dX,
                            top: dY
                        };

                        // Cancel default behavior for mouse down.
                        e.preventDefault();
                        e.stopPropagation();

                        // Get the region of the mouse down.
                        m_strDownRegion = m_functionRegionFromPoint(dX,
                            dY);

                        // If the region is content, then figure out which column.
                        if (m_strDownRegion === "Content") {

                            var dTestX = m_rectangleContent.left - m_dScrollOffsetX;
                            var iColumnClicked = -1;
                            for (var iColumn = 0; iColumn < m_arrayColumns.length; iColumn++) {

                                // Skip if invisible.
                                if (m_arrayColumns[iColumn].visible === false) {

                                    continue;
                                }

                                m_arrayColumns[iColumn].left = dTestX;
                                dTestX += m_arrayColumns[iColumn].width;

                                if (dX < dTestX) {

                                    iColumnClicked = iColumn;
                                    break;
                                }
                            }

                            dY -= (m_rectangleColumnHeaders.height);

                            // Calculate the absolute row.
                            var iRow = m_iFirstVisibleRow + Math.floor(dY / m_options.row.height);

                            // Configure for in-place editing.
                            var exceptionRet = m_functionConfigureInPlaceEdit(iRow,
                                iColumnClicked);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        }
                    } catch (e) {

                        alert(e.message);
                    }
                };

                // Invoked when the mouse is depressed over the render canvas.
                // Implemented to determine the region, and set some state.
                var m_functionOnMouseDown = function (e) {

                    try {

                        // Set focus to canvas so it may receive keyboard events.
                        m_canvasRender.focus();

                        // Extract coordinates relative to the upper left hand corner of the render canvas.
                        var dX = e.offsetX;
                        var dY = e.offsetY;
                        m_pointDown = {

                            left: dX,
                            top: dY
                        };

                        // Cancel default behavior for mouse down.
                        e.preventDefault();
                        e.stopPropagation();

                        // Get the region of the mouse down.
                        m_strDownRegion = m_functionRegionFromPoint(dX,
                            dY);

                        // Determine the region under the cursor.
                        if (m_strDownRegion === "Content") {

                            // Invoke specific handler.
                            var exceptionRet = m_functionOnMouseDown_Content(e);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        } else if (m_strDownRegion === "ColumnHeaders" &&
                            !m_bInPlaceEditing) {

                            // Invoke specific handler.
                            var exceptionRet = m_functionOnMouseDown_ColumnHeaders(e);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        } else if (m_strDownRegion === "RowHeaders" &&
                            !m_bInPlaceEditing) {

                            // RowHeaders.
                            var exceptionRet = m_functionOnMouseDown_RowHeaders(e);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        }
                    } catch (e) {

                        alert(e.message);
                    }
                };

                // Handle mousedown over Content.
                var m_functionOnMouseDown_Content = function (e) {

                    try {

                        // Get the row clicked.
                        // Adjust the down point for the ul of the content.
                        var dY = m_pointDown.top - m_rectangleContent.top;
                        var dX = m_pointDown.left - m_rectangleContent.left;

                        // Get the column clicked.
                        var dTestX = -m_dScrollOffsetX;
                        var iColumnClicked = -1;
                        for (var iColumn = 0; iColumn < m_arrayColumns.length; iColumn++) {

                            // Skip if invisible.
                            if (m_arrayColumns[iColumn].visible === false) {

                                continue;
                            }

                            m_arrayColumns[iColumn].left = dTestX;
                            dTestX += m_arrayColumns[iColumn].width;

                            if (dX < dTestX) {

                                iColumnClicked = iColumn;
                                break;
                            }
                        }

                        // Calculate the absolute row.
                        var iSelectedRow = m_iFirstVisibleRow + Math.floor(dY / m_options.row.height);

                        if (!m_bInPlaceEditing) {

                            m_functionProcessLeftLikeMouseAction(e,
                                iSelectedRow);

                            // Update for next pass.
                            m_iLastSelectedRow = iSelectedRow;
                        } else {

                            // If clicked in the edit row (while editing)...
                            if (iSelectedRow === m_iInPlaceEditRow) {

                                // If in-place editing, then clicking on a different cell changes the current 
                                // focus cell.  Clicking in the current cell and dragging changes the selection.
                                if (iColumnClicked === m_iInPlaceEditColumn) {

                                    // Only allow selection setting for mouse clicks if not on a select cell.
                                    if (m_columnInPlaceEdit.select === false) {

                                        // Get the formatted value from the cell.
                                        var strFormattedCellValue = m_arrayInPlaceEditRow[m_iInPlaceEditColumn].formattedValue;

                                        // Calculate the offset to the start of the text.
                                        var dWidthGap = 0;

                                        // Get the width of the current inplace edit cell's formatted value text.
                                        var dCellWidth = m_arrayInPlaceEditRow[m_iInPlaceEditColumn].sizeRender.width;

                                        // Move across based on line alignment.
                                        var strLineAlignment = m_columnInPlaceEdit.lineAlignment;
                                        if (strLineAlignment === "right") {

                                            dWidthGap = m_columnInPlaceEdit.width - dCellWidth - m_options.cell.padding;
                                        } else if (strLineAlignment === "center") {

                                            dWidthGap = (m_columnInPlaceEdit.width - dCellWidth) / 2;
                                        }

                                        // Ensure not justified too far.     
                                        if (dWidthGap < m_options.cell.padding) {

                                            dWidthGap = m_options.cell.padding;
                                        }

                                        // Figure out where all the characters are in the formatted text.
                                        m_arrayInPlaceEditCellFormatOffsets = [];
                                        for (var i = 0; i < strFormattedCellValue.length; i++) {

                                            // Get the sub-string from the start of the string to the index being measured.
                                            var strCumulative = strFormattedCellValue.substr(0, i);

                                            // Measure how many pixels from the beginning of the string to the character in question.
                                            var iOffsetWidth = m_contextRender.measureText(strCumulative).width;

                                            // Store the offset index.
                                            m_arrayInPlaceEditCellFormatOffsets.push(m_arrayColumns[iColumnClicked].left + m_rectangleContent.left + iOffsetWidth + dWidthGap);
                                        }

                                        // And add in the entire string.
                                        m_arrayInPlaceEditCellFormatOffsets.push(m_arrayColumns[iColumnClicked].left + m_rectangleContent.left + m_contextRender.measureText(strFormattedCellValue).width + dWidthGap);

                                        // Set the starting selection.
                                        var bSet = false;
                                        for (var i = 0; i < m_arrayInPlaceEditCellFormatOffsets.length; i++) {

                                            var iIndex = m_arrayInPlaceEditCellFormatOffsets[i];

                                            if (iIndex > dX + m_rectangleContent.left) {

                                                if (i > 0) {

                                                    i--;
                                                }
                                                m_iInPlaceEditSelectionStart = i;
                                                m_iInPlaceEditSelectionLength = 0;
                                                bSet = true;
                                                break;
                                            }
                                        }

                                        if (bSet === false) {

                                            m_iInPlaceEditSelectionStart = m_arrayInPlaceEditCellFormatOffsets.length;
                                            m_iInPlaceEditSelectionLength = 0;
                                        }
                                    }
                                } else {

                                    // Save off the current value.
                                    var exceptionRet = m_functionSaveCurrentInPlaceEditColumnValue();
                                    if (exceptionRet !== null) {

                                        throw exceptionRet;
                                    }

                                    m_iInPlaceEditColumn = iColumnClicked;

                                    // Set the column state.
                                    m_columnInPlaceEdit = m_arrayColumns[m_iInPlaceEditColumn];
                                    // And the in-place selection.
                                    m_iInPlaceEditSelectionStart = 0;
                                    m_iInPlaceEditSelectionLength = m_arrayInPlaceEditRow[m_iInPlaceEditColumn].formattedValue.length;
                                }
                            }
                        }

                        // Update immediately.
                        return m_functionRender();
                    } catch (e) {

                        return e;
                    }
                };

                // Handle mousedown over ColumnHeaders.
                var m_functionOnMouseDown_ColumnHeaders = function (e) {

                    try {

                        // First, test for re-sizability.
                        if (m_iResizeColumn !== -1) {

                            // Handle resize.
                            m_dResizeColumnInitialWidth = m_arrayColumns[m_iResizeColumn].width;

                            return null;
                        }

                        // Else, if not resizing, then possibly sorting or filtering...:

                        // Adjust the down point for the ul of the content.
                        var dX = m_pointDown.left - m_rectangleColumnHeaders.left;
                        var dY = m_pointDown.top - m_rectangleColumnHeaders.top;
                        if (dY < m_options.columnHeader.height) {

                            // Sorting.
                            m_functionSort(e,
                                dX);

                            return null;
                        }

                        // Filter or no action...
                        if (dY < m_options.columnHeader.height + m_options.columnHeader.paddingFilter ||
                            dY > 2 * m_options.columnHeader.height - m_options.columnHeader.paddingFilter) {

                            return null;
                        }

                        // Figure out a couple of things:
                        // First, is filtering on.
                        if (m_options.columnHeader.filterable === false) {

                            return null;
                        }

                        // Second, is the mouse down over the filter row.

                        // Get the column clicked.
                        var dTestX = -m_dScrollOffsetX;
                        var iColumnClicked = -1;
                        for (var iColumn = 0; iColumn < m_arrayColumns.length; iColumn++) {

                            // Skip if invisible.
                            if (m_arrayColumns[iColumn].visible === false) {

                                continue;
                            }

                            m_arrayColumns[iColumn].left = dTestX;
                            dTestX += m_arrayColumns[iColumn].width;

                            if (dX < dTestX) {

                                iColumnClicked = iColumn;
                                break;
                            }
                        }
                        if (iColumnClicked === -1) {

                            return null;
                        }

                        var column = m_arrayColumns[iColumnClicked];
                        if (column.type !== "string" &&
                            column.type !== "date") {

                            return null;
                        }

                        // OK.  Time to filter.
                        return m_functionFilter(column,
                            iColumnClicked);
                    } catch (e) {

                        return e;
                    }
                };

                // Handle mousedown over RowHeaders.
                var m_functionOnMouseDown_RowHeaders = function (e) {

                    try {

                        // Get coords.
                        var dX = m_pointDown.left;
                        var dY = m_pointDown.top;

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Invoked when the mouse is moved over the render canvas.
                // Implemented to dispatch to various specific handlers.
                var m_functionOnMouseMove = function (e) {

                    try {

                        // Extract coordinates relative to the upper left hand corner of the render canvas.
                        var dX = e.offsetX;
                        var dY = e.offsetY;

                        // Only handle move if down was properly registered.
                        if (m_pointDown !== null) {

                            m_sizeDrag = {

                                width: dX - m_pointDown.left,
                                height: dY - m_pointDown.top
                            };

                            // Only do something if the mouse was let down over a specific region.
                            if (m_strDownRegion === "Content") {

                                // Content.
                                // Invoke specific handler.
                                var exceptionRet = m_functionOnMouseMove_Content(e);
                                if (exceptionRet !== null) {

                                    throw exceptionRet;
                                }
                            } else if (m_strDownRegion === "ColumnHeaders") {

                                // ColumnHeaders.
                                // Invoke specific handler.
                                var exceptionRet = m_functionOnMouseMove_ColumnHeaders(e);
                                if (exceptionRet !== null) {

                                    throw exceptionRet;
                                }
                            } else if (m_strDownRegion === "RowHeaders") {

                                // RowHeaders.
                                var exceptionRet = m_functionOnMouseMove_RowHeaders(e);
                                if (exceptionRet !== null) {

                                    throw exceptionRet;
                                }
                            }
                        } else if (!m_bInPlaceEditing) {

                            // No Button is depressed.  Handle cursor setting here.

                            // Get the region of the mouse move.
                            var strRegion = m_functionRegionFromPoint(dX,
                                dY);

                            // Set cursor based on the region and possibly where in that region....
                            if (strRegion === "Content") {

                                m_canvasRender.style.cursor = "auto";
                            } else if (strRegion === "VerticalScrollBar" ||
                                strRegion === "HorizontalScrollBar") {

                                m_canvasRender.style.cursor = "auto";
                            } else if (strRegion === "ColumnHeaders") {

                                // Figure out where is the cursor in the column.
                                // Get the column clicked.
                                var dTestX = m_rectangleContent.left - m_dScrollOffsetX;
                                var dDistance = 100000;
                                var iResizeColumn = -1;
                                for (var iColumn = 0; iColumn < m_arrayColumns.length; iColumn++) {

                                    // Skip if invisible.
                                    if (m_arrayColumns[iColumn].visible === false) {

                                        continue;
                                    }

                                    dTestX += m_arrayColumns[iColumn].width;

                                    if (dX < dTestX) {

                                        dDistance = dTestX - dX;
                                        iResizeColumn = iColumn;
                                        break;
                                    }
                                }
                                if (dDistance < m_options.columnHeader.extentResize &&
                                    dY < m_options.columnHeader.height) {

                                    m_iResizeColumn = iResizeColumn;
                                    m_canvasRender.style.cursor = "e-resize";
                                } else {

                                    m_iResizeColumn = -1;
                                    m_canvasRender.style.cursor = "auto";
                                }
                            }
                        }
                    } catch (e) {

                        alert(e.message);
                    }
                };

                // Handle mousemove over Content.
                var m_functionOnMouseMove_Content = function (e) {

                    try {

                        // Get the cursor point.
                        var dX = e.offsetX;

                        // Possibly set selection if dragging across an in-place edit cell.
                        if (m_bInPlaceEditing &&
                            m_columnInPlaceEdit.select === false) {

                            // If clicked down in this cell.
                            if (m_arrayInPlaceEditCellFormatOffsets !== null) {

                                // Set the length.
                                var bSet = false;
                                for (var i = 0; i < m_arrayInPlaceEditCellFormatOffsets.length; i++) {

                                    // Extract the offset.
                                    var iIndex = m_arrayInPlaceEditCellFormatOffsets[i];

                                    if (iIndex > dX) {

                                        if (i > 0) {

                                            i--;
                                        }

                                        m_iInPlaceEditSelectionLength = (i - m_iInPlaceEditSelectionStart);
                                        bSet = true;
                                        break;
                                    }
                                }

                                // Cover the end-of-string case.
                                if (bSet === false) {

                                    m_iInPlaceEditSelectionLength = (m_arrayInPlaceEditCellFormatOffsets.length - m_iInPlaceEditSelectionStart);
                                }

                                // Render immediately.
                                return m_functionRender();
                            }
                        }

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Handle mousemove over ColumnHeaders.
                var m_functionOnMouseMove_ColumnHeaders = function (e) {

                    try {

                        // Don't do anything on mouse move if in place editing.
                        if (m_bInPlaceEditing) {

                            return null;
                        }

                        // If resizing, then resize,
                        if (m_iResizeColumn !== -1) {

                            // Compute new column width.
                            var dDistanceDragged = m_sizeDrag.width;
                            var dNewColumnWidth = m_dResizeColumnInitialWidth + dDistanceDragged;
                            if (dNewColumnWidth < m_options.columnHeader.minimumWidth) {

                                dNewColumnWidth = m_options.columnHeader.minimumWidth;
                            }

                            m_arrayColumns[m_iResizeColumn].width = dNewColumnWidth;

                            // Set dirty.
                            m_bColumnHeaderDirty = true;
                            m_bColumnHeaderEaselDirty = true;
                            m_bComponentRectanglesDirty = true;
                            m_bHorizontalScrollBarDirty = true;
                            m_bHorizontalScrollBarEaselDirty = true;
                            m_bVerticalScrollBarDirty = true;
                            m_bVerticalScrollBarEaselDirty = true;
                            m_bNullBottomRightDirty = true;
                            m_bNullTopRightDirty = true;

                            // Force redraw.
                            m_functionRender();
                        }
                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Handle mousedown over RowHeaders.
                var m_functionOnMouseMove_RowHeaders = function (e) {

                    try {

                        // Don't do anything on mouse move if in place editing.
                        if (m_bInPlaceEditing) {

                            return null;
                        }

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Invoked when the mouse is let up over the render canvas.
                var m_functionOnMouseUp = function (e) {

                    try {

                        // Only handle up if down was properly registered.
                        if (m_pointDown !== null) {

                            // Stop mouse click from going to parent.
                            e.preventDefault();
                            e.stopPropagation();

                            // Only do something if the mouse was let down over a specific region.
                            if (m_strDownRegion === "Content") {

                                // Content.
                                // Invoke specific handler.
                                var exceptionRet = m_functionOnMouseUp_Content(e);
                                if (exceptionRet !== null) {

                                    throw exceptionRet;
                                }
                            } else if (m_strDownRegion === "ColumnHeaders") {

                                // ColumnHeaders.
                                // Invoke specific handler.
                                var exceptionRet = m_functionOnMouseUp_ColumnHeaders(e);
                                if (exceptionRet !== null) {

                                    throw exceptionRet;
                                }
                            } else if (m_strDownRegion === "RowHeaders") {

                                // RowHeaders.
                                var exceptionRet = m_functionOnMouseUp_RowHeaders(e);
                                if (exceptionRet !== null) {

                                    throw exceptionRet;
                                }
                            }
                        }
                    } catch (e) {

                        alert(e.message);
                    } finally {

                        // Reset state.
                        m_strDownRegion = null;
                        m_pointDown = null;
                        m_sizeDrag = null;
                        m_arrayInPlaceEditCellFormatOffsets = null;
                    }
                };

                // Handle mouseup over Content.
                var m_functionOnMouseUp_Content = function (e) {

                    try {

                        // Don't do anything on mouse move if in place editing, or otherwise anyway.
                        if (m_bInPlaceEditing) {

                            return null;
                        }

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Handle mouseup over ColumnHeaders.
                var m_functionOnMouseUp_ColumnHeaders = function (e) {

                    try {

                        // Don't do anything on mouse move if in place editing.
                        if (m_bInPlaceEditing) {

                            return null;
                        }

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Handle mouseup over RowHeaders.
                var m_functionOnMouseUp_RowHeaders = function (e) {

                    try {

                        // Don't do anything on mouse move if in place editing.
                        if (m_bInPlaceEditing) {

                            return null;
                        }

                        // Get coords.
                        var dX = e.offsetX;
                        var dY = e.offsetY;

                        // Check against delete regions.
                        for (var i = 0; i < m_arrayDeleteRegions.length; i++) {

                            // Get the region.
                            var regionIth = m_arrayDeleteRegions[i];

                            // Check location of click against region bounds.
                            if (dX > regionIth.left &&
                                dX < regionIth.left + regionIth.width &&
                                dY > regionIth.top &&
                                dY < regionIth.top + regionIth.height) {

                                // Clicked!

                                // Ask confirmation question.
                                var bProceed = confirm("Please confirm delete of specified row.");
                                if (bProceed) {

                                    // Raise delete event.
                                    if ($.isFunction(m_options.onDelete)) {

                                        // Convert from internal to external format.
                                        var row = {};
                                        for (var i = 0; i < m_arrayColumns.length; i++) {

                                            // Get the ith column.
                                            var columnIth = m_arrayColumns[i];

                                            // Set the value
                                            row[columnIth.mapping] = m_arrayView[regionIth.index][i].value;

                                            // If string, possibly replace single quotes so they pass SQL muster.
                                            if (typeof row[columnIth.mapping] === 'string') {

                                                row[columnIth.mapping] = row[columnIth.mapping].replace(/'/g, "''");
                                            }
                                        }

                                        // Invoke the event handler.
                                        m_options.onDelete(row,
                                            function () {

                                                try {

                                                    // Remove the row.
                                                    var uid = m_arrayView[regionIth.index][m_options.uidColumnIndex].value;
                                                    var exceptionRet = m_functionRemoveRow(uid);
                                                    if (exceptionRet !== null) {

                                                        throw exceptionRet;
                                                    }

                                                    // Deselect all (just for simplicity).
                                                    m_arraySelectedRows = [];

                                                    // Update totals.
                                                    exceptionRet = self.updateTotals();
                                                    if (exceptionRet !== null) {

                                                        throw exceptionRet;
                                                    }

                                                    // Cause some to update.
                                                    m_bHorizontalScrollBarDirty = true;
                                                    m_bHorizontalScrollBarEaselDirty = true;
                                                    m_bVerticalScrollBarDirty = true;
                                                    m_bVerticalScrollBarEaselDirty = true;
                                                    m_bNullBottomRightDirty = true;
                                                    m_bNullTopRightDirty = true;
                                                    m_bViewDirty = true;

                                                    // Cause immediate update.
                                                    exceptionRet = m_functionRender();
                                                    if (exceptionRet !== null) {

                                                        throw exceptionRet;
                                                    }
                                                } catch (e) {

                                                    alert(e.message);
                                                }
                                            });
                                    } else {

                                        alert("Please implement onDelete event.");
                                    }
                                }
                            }
                        }

                        // Check against new regions.
                        for (var i = 0; i < m_arrayNewRegions.length; i++) {

                            // Get the region.
                            var regionNewIth = m_arrayNewRegions[i];

                            // Check location of click against region bounds.
                            if (dX > regionNewIth.left &&
                                dX < regionNewIth.left + regionNewIth.width &&
                                dY > regionNewIth.top &&
                                dY < regionNewIth.top + regionNewIth.height) {

                                // Clicked!

                                // Raise new event.
                                if ($.isFunction(m_options.onNew)) {

                                    // Invoke the event handler.
                                    m_options.onNew(function (uid,
                                        rowNew) {

                                        try {

                                            // Merge it in.
                                            exceptionRet = self.mergeRow(rowNew);
                                            if (exceptionRet !== null) {

                                                throw exceptionRet;
                                            }

                                            // Cause some to update.
                                            m_bHorizontalScrollBarDirty = true;
                                            m_bHorizontalScrollBarEaselDirty = true;
                                            m_bVerticalScrollBarDirty = true;
                                            m_bVerticalScrollBarEaselDirty = true;
                                            m_bNullBottomRightDirty = true;
                                            m_bNullTopRightDirty = true;
                                            m_bViewDirty = true;

                                            // Udate just to cause the view to sort.
                                            exceptionRet = m_functionRender();
                                            if (exceptionRet !== null) {

                                                throw exceptionRet;
                                            }

                                            // Select and ensure visible.
                                            exceptionRet = m_functionSelectAndEnsureVisible(uid);
                                            if (exceptionRet !== null) {

                                                throw exceptionRet;
                                            }

                                            // Update totals.
                                            exceptionRet = self.updateTotals();
                                            if (exceptionRet !== null) {

                                                throw exceptionRet;
                                            }

                                            // Update again.
                                            exceptionRet = m_functionRender();
                                            if (exceptionRet !== null) {

                                                throw exceptionRet;
                                            }
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    });
                                } else {

                                    alert("Please implement onNew event.");
                                }
                            }
                        }

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                //////////////////////////////////
                // Private fields.

                // Defines styles.
                var m_options = {

                    background: "#f00",
                    backgroundNull: "#fff",
                    updateFrequency: 1000,
                    inPlaceEditable: true,
                    allowDelete: true,
                    allowNew: true,
                    closeOnEnter: false,
                    uidColumnIndex: 0,
                    uid: Math.random(),
                    blankFilterString: "[EMPTY]",
                    onSelectionChanged: null,
                    onInPlaceEdit: null,
                    onDelete: null,
                    onNew: null,
                    columnHeader: {

                        height: 20,
                        font: "12px Helvetica",
                        background: "#fff",
                        backgroundSortArrow: "#888",
                        colorSortArrowHighlight: "#444",
                        colorText: "#000",
                        colorTextInPlaceEdit: "#ddd",
                        colorFilterText: "#000",
                        colorFilterTextInPlaceEdit: "#000",
                        colorSeparator: "#888",
                        backgroundFilter: "#ff8",
                        backgroundFilterInPlaceEdit: "#dd6",
                        padding: 4,
                        paddingFilter: 4,
                        extentResize: 10,
                        filterable: true,
                        totalable: true,
                        visible: true,
                        minimumWidth: 20
                    },
                    rowHeader: {

                        width: 35,
                        visible: true,
                        colorDelete: "#800",
                        colorNew: "#080"
                    },
                    scrollBar: {

                        width: 16,
                        height: 16,
                        backgroundThumb: "#888",
                        highlightThumb: "#bbb",
                        shadowThumb: "#444",
                        background: "#fff",
                        backgroundStripe: "#bbb",
                        backgroundHighlightStripe: "#b00",
                        backgroundThumbCenter: "#b00",
                        colorThumb: "#000",
                        colorHighlight: "#888",
                        widthStripeIndent: 5.5,
                        widthThumbHole: 2,
                        widthHighlightStripeIndent: 6.5,
                        padding: 5,
                        paddingThumb: 1.5,
                        minimumThumbExtent: 10
                    },
                    row: {

                        height: 16,
                        background: "#fff",
                        backgroundAlternate: "#ff8",
                        backgroundSelected: "#8f8",
                        backgroundInPlace: "#ddd",
                        backgroundInPlaceAlternate: "#dd6"
                    },
                    cell: {

                        colorText: "#000",
                        colorUpTick: "#080",
                        colorDownTick: "#800",
                        colorChange: "#008",
                        colorSeparator: "#888",
                        colorInPlace: "#444",
                        colorInPlaceSelection: "#f8f",
                        colorInPlaceSelectSelection: "#8ff",
                        font: "11px Helvetica",
                        tickDuration: 500,
                        padding: 4,
                        drawColumnSeparator: true
                    },
                    filter: {

                        backgroundBorder: "#444",
                        backgroundFilterText: "#ff8",
                        colorFilterText: "#000",
                        maxDropDownRows: 8,
                        paddingBorder: 1
                    }
                };

                // Number of visible rows.
                var m_iVisibleRows = 0;
                // Height of render canvas.
                var m_dWidth = 0;
                // Width of render canvas.
                var m_dHeight = 0;
                // Total width of all columns in pixels.
                var m_dTotalColumnWidth = 0;
                // Canvas to which grid is rendered.
                var m_canvasRender = null;
                // Context for render canvas.
                var m_contextRender = null;
                // Canvas around for intermittent column header rendering.
                var m_canvasColumnHeaderEasel = null;
                // Context for column header easel canvas.
                var m_contextColumnHeaderEasel = null;
                // Canvas around for intermittent vertical scroll bar rendering.
                var m_canvasVerticalScrollBarEasel = null;
                // Context for Vertical ScrollBar easel canvas.
                var m_contextVerticalScrollBarEasel = null;
                // Canvas around for intermittent Horizontal scroll bar rendering.
                var m_canvasHorizontalScrollBarEasel = null;
                // Context for Horizontal ScrollBar easel canvas.
                var m_contextHorizontalScrollBarEasel = null;
                // Canvas around for intermittent work rendering.
                var m_canvasWorkEasel = null;
                // Context for work canvas.
                var m_contextWorkEasel = null;
                // Parent element.
                var m_elementParent = null;
                // Parent element as jQuery object.
                var m_jqParent = null;
                // Render canvas as jQuery object.
                var m_jqCanvas = null;
                // Selector used to access parent element.
                var m_strParentSelector = null;
                // Defines bounds of column headers.
                var m_rectangleColumnHeaders = null;
                // Defines bounds of row headers.
                var m_rectangleRowHeaders = null;
                // Defines bounds of content area.
                var m_rectangleContent = null;
                // Defines bounds of vertical scrollbar.
                var m_rectangleVerticalScrollBar = null;
                // Defines bounds of horizontal scrollbar.
                var m_rectangleHorizontalScrollBar = null;
                // Defines bounds of null region above the vertical scrollbar.
                var m_rectangleNullTopRight = null;
                // Defines bounds of null region below the vertical scrollbar.
                var m_rectangleNullBottomRight = null;
                // Indicates that the vertical scroll bar is visible.
                var m_bVerticalScrollBarVisible = false;
                // Indicates that the horizontal scroll bar is visible.
                var m_bHorizontalScrollBarVisible = false;
                // Indicates the Column Header region requires rendering.
                var m_bColumnHeaderDirty = false;
                // Indicates the Row Header region requires rendering.
                var m_bRowHeaderDirty = false;
                // Indicates the Content region requires rendering.
                var m_bContentDirty = false;
                // Indicates the Horizontal ScrollBar region requires rendering.
                var m_bHorizontalScrollBarDirty = false;
                // Indicates the Vertical ScrollBar region requires rendering.
                var m_bVerticalScrollBarDirty = false;
                // Indicates the Null Top Right region requires rendering.
                var m_bNullTopRightDirty = false;
                // Indicates the Null Bottom Right region requires rendering.
                var m_bNullBottomRightDirty = false;
                // Indicates the component rectangles require setting.
                var m_bComponentRectanglesDirty = true;
                // Indicates that the column header easel requires rendering.
                var m_bColumnHeaderEaselDirty = true;
                // Indicates that the vertical scrollbar easel requires rendering.
                var m_bVerticalScrollBarEaselDirty = true;
                // Indicates that the horizontal scrollbar easel requires rendering.
                var m_bHorizontalScrollBarEaselDirty = true;
                // Indicates the view needs to be build.
                var m_bViewDirty = true;
                // Indicate the view required re-sorting.
                var m_bViewSortDirty = true;
                // Given all computed factors, the number of pixels of 
                // vertical movement of the scroll bar thumb per row.
                var m_dVerticalScrollBar_PixelsPerRow = 0;
                // Given all computed factors, the number of pixels of 
                // horizontal movement of the scroll bar thumb per pixel.
                var m_dHorizontalScrollBar_PixelsPerPixel = 0;
                // Left coordinate of the horizontal scroll bar's thumb.
                var m_dThumbLeft = 0;
                // Top coordinate of the vertical scroll bar's thumb.
                var m_dThumbTop = 0;
                // Width of the horizontal scroll bar's thumb.
                var m_dThumbWidth = 0;
                // Height coordinate of the vertical scroll bar's thumb.
                var m_dThumbHeight = 0;
                // First visible row.
                var m_iFirstVisibleRow = 0;
                // Number of pixels scrolled horizontally.
                var m_dScrollOffsetX = 0;
                // Number of visible rows.
                var m_iNumberOfVisibleRows = 0;
                // Indicates that the enter key was hit to dismiss the filter grid.
                var m_bProcessEnter = true;
                // Draggable stub allows for scrolling.
                var m_divVerticalDraggable = null;
                // Draggable stub allows for scrolling.
                var m_divHorizontalDraggable = null;
                // Event position on start of drag.
                var m_objectVerticalDraggableStart = null;
                // Event position on start of drag.
                var m_objectHorizontalDraggableStart = null;

                // Content state.

                // The collection of data.
                var m_arrayData = [];
                // The collection of sorted, filtered, displayed data.
                var m_arrayView = [];
                // The collection of schema.
                var m_arrayColumns = [];

                // Code state.

                // Interval cookie for setInterval and clearInterval calls.
                var m_objectInterval = -1;
                // The region over which the mouse was depressed.
                var m_strDownRegion = null;
                // The X and Y coordinates where the mouse was depressed 
                // relative to the upper left corner of the render canvas.
                var m_pointDown = null;
                // Extent of dragging operation.
                var m_sizeDrag = null;
                // Remember the FirstVisibleRow at the time that 
                // dragging commenced in the vertical scroll bar.
                var m_iInitialFirstVisibleRow = 0;
                // Remember the scroll offset X at the time that 
                // dragging commenced in the horizontal scroll bar.
                var m_dInitialScrollOffsetX = 0;
                // Indicates the mouse was depressed over a scrollbar thumb.
                var m_bOverThumb = false;
                // Remember selected rows.
                var m_arraySelectedRows = [];
                // Remember the last selected row for shift functionality.
                var m_iLastSelectedRow = -1;
                // Simple state which determines when an enter or an 
                // escape is presses, which is it, so the overlay knows 
                // to accept or reject the changes to the filter drop down.
                var m_bPressEnter = false;
                // Index of column whose right-edge is near the cursor.
                var m_iResizeColumn = -1;
                // Remember the initial width of the column before sizing begins.
                var m_dResizeColumnInitialWidth = 0;
                // Hold on to the resize cookie to avoid recursive calls.
                var m_cookieResize = undefined;
                // Row in-place editing.
                var m_iInPlaceEditRow = -1;
                // Column in-place editing.
                var m_iInPlaceEditColumn = -1;
                // Indicates in-place editing is in progress.
                var m_bInPlaceEditing = false;
                // Row indexes into view to hold on to row to edit for in-place editing.
                var m_arrayInPlaceEditRow = null;
                // Array holds original row values before editing 
                // for roll-back and to pass to event handler.
                var m_arrayInPlaceEditRowSave = null;
                // Row holds original row values before editing 
                // for roll-back and to pass to event handler.
                var m_arrayInPlaceEditRow = null;
                // Array is the in-place edit column.
                var m_columnInPlaceEdit = null;
                // Selection markers:
                var m_iInPlaceEditSelectionStart = 0;
                var m_iInPlaceEditSelectionLength = 0;
                // Clipboard for inplace edit operations.
                var m_strClipboard = null;
                // Collection of offsets for each character of the cell.
                // Used to select character positions on mouse movement.
                var m_arrayInPlaceEditCellFormatOffsets = null;
                // Collection of active delete regions.
                // For now, only one is active.
                var m_arrayDeleteRegions = [];
                // Collection of active new regions.
                // For now, only one is active.
                var m_arrayNewRegions = [];
                // Auto-complete like state string.
                var m_strAutoCompleteString = "";
                var m_iLastTypeTime = 0;

                // Invoke create method.
                var exceptionRet = m_functionCreate();
                if (exceptionRet !== null) {

                    throw exceptionRet;
                }
            }

            return functionConstructor;
        } catch (e) {

            alert(e.message);
        }
    });
