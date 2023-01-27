///////////////////////////////////
// VonNeumann life simulator.

"use strict";

// Define require AMD module with no dependencies.
define(["./Acorn", "./Agar", "./BlinkerShip", "./Breeder", "./DiamondRing", "./LightspeedWire"],
    function (Acorn, Agar, BlinkerShip, Breeder, DiamondRing, LightspeedWire) {

        try {

            // Simply reuturn the function constructor.
            return function VonNeumann(optionsOverride) {

                ///////////////////////////////////
                // Public methods.

                // Method allocates and configures object.
                this.create = function () {

                    try {

                        // Get the element references.
                        m_canvasRender = document.querySelector(m_options.selector);

                        // Set the properties from the options object.
                        m_canvasRender.width = m_options.width;
                        m_canvasRender.height = m_options.height;
                        m_canvasRender.style.background = m_options.background;
                        m_contextRender = m_canvasRender.getContext("2d");

                        // Create a 2D matrix of cell data, 0 => dead, 1 => live.
                        for (var iRow = 0; iRow < m_options.numberOfRows; iRow++) {

                            var arrayRow = [];

                            for (var iColumn = 0; iColumn < m_options.numberOfColumns; iColumn++) {

                                arrayRow.push(0);
                            }
                            m_arrayData.push(arrayRow);
                        }

                        for (var i = 1; i < 3; i++) {
       
                            m_functionLIFECallback(100,
                                i * 40 + 20,
                                "BlinkerShip");
                        }

                        //
                        setTimeout(function () {

                            m_functionGosperGliderGun(190 - Math.floor(m_options.gggSlideRadius * Math.random()),
                                20 + Math.floor(m_options.gggSlideRadius * Math.random()),
                                "SouthWest");
                            }, Math.floor(Math.random() * m_options.gggFadeInMS) + 1000);
                        setTimeout(function () {

                            m_functionGosperGliderGun(10 + Math.floor(m_options.gggSlideRadius * Math.random()),
                                20 + Math.floor(m_options.gggSlideRadius * Math.random()),
                                "SouthEast");
                            }, Math.floor(Math.random() * m_options.gggFadeInMS) + 1000);
                        setTimeout(function () {

                            m_functionGosperGliderGun(190 - Math.floor(m_options.gggSlideRadius * Math.random()),
                                180 - Math.floor(m_options.gggSlideRadius * Math.random()),
                                "NorthWest");
                            }, Math.floor(Math.random() * m_options.gggFadeInMS) + 1000);
                        setTimeout(function () {

                            m_functionGosperGliderGun(10 + Math.floor(m_options.gggSlideRadius * Math.random()),
                                180 - Math.floor(m_options.gggSlideRadius * Math.random()),
                                "NorthEast");
                            }, Math.floor(Math.random() * m_options.gggFadeInMS) + 1000);
                        //

                        // Set the context's context.
                        m_contextRender.fillStyle = m_options.fillStyle;
                        m_contextRender.strokeStyle = m_options.strokeStyle;
                        m_contextRender.lineWidth = m_options.lineWidth;

                        // Set live.
                        m_bAlive = true;

                        // Start up the render "thread".
                        m_functionRender();

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Method de-allocates and de-configures object.
                this.destroy = function () {

                    try {

                        // Kill.
                        m_bAlive = false;
                    } catch (e) {

                        alert(e.message);
                    }
                };

                ///////////////////////////////////
                // Private methods.

                var m_functionLIFECallback = function (dLeft, dTop, strType) {

                    require([strType],
                        function (Type) {
                    
                            try {
                            
                                var a = new Type();
                                var arrayData = a.getData();

                                for (var i = 0; i < arrayData.length; i++) {
                            
                                    for (var j = 0; j < arrayData[i].length; j++) {
                            
                                        if (arrayData[i][j] === ".") {
                            
                                            m_arrayData[dTop + i][dLeft + j] = 0
                                        } else {
                            
                                            m_arrayData[dTop + i][dLeft + j] = 1;
                                        }
                                    } 
                                }
                            }
                            catch (e) {
                            
                                alert(e.message);
                            }
                        });
                };


                // Imprint a blinker.
                var m_functionBlinker = function (dLeft,
                    dTop) {

                    try {

                        m_arrayData[dTop + 0][dLeft] = 1;
                        m_arrayData[dTop + 1][dLeft] = 1;
                        m_arrayData[dTop + 2][dLeft] = 1;
                    } catch (e) {

                        alert(e.message);
                    }
                };

                // Imprint a glider.
                var m_functionGlider = function (dLeft,
                    dTop) {

                    try {

                        m_arrayData[dTop + 0][dLeft] = 1;
                        m_arrayData[dTop + 1][dLeft] = 1;
                        m_arrayData[dTop + 2][dLeft] = 1;
                        m_arrayData[dTop + 2][dLeft + 1] = 1;
                        m_arrayData[dTop + 1][dLeft + 2] = 1;
                    } catch (e) {

                        alert(e.message);
                    }
                };

                // Imprint a ggg.
                var m_functionGosperGliderGun = function (dLeft,
                    dTop,
                    strOrientation) {

                    try {

                        var iNorthSouthMultiplier = 1;
                        var iEastWestMultiplier = 1;
                        if (strOrientation === "NorthWest") {

                            iEastWestMultiplier = -1;
                        } else if (strOrientation === "SouthEast") {

                            iNorthSouthMultiplier = -1;
                        } else if (strOrientation === "SouthWest") {

                            iNorthSouthMultiplier = -1;
                            iEastWestMultiplier = -1;
                        }

                        m_arrayData[dTop + iNorthSouthMultiplier * 4][dLeft + iEastWestMultiplier * 1] = 1;
                        m_arrayData[dTop + iNorthSouthMultiplier * 5][dLeft + iEastWestMultiplier * 1] = 1;
                        m_arrayData[dTop + iNorthSouthMultiplier * 4][dLeft + iEastWestMultiplier * 2] = 1;
                        m_arrayData[dTop + iNorthSouthMultiplier * 5][dLeft + iEastWestMultiplier * 2] = 1;

                        m_arrayData[dTop + iNorthSouthMultiplier * 1][dLeft + iEastWestMultiplier * 14] = 1;
                        m_arrayData[dTop + iNorthSouthMultiplier * 1][dLeft + iEastWestMultiplier * 13] = 1;
                        m_arrayData[dTop + iNorthSouthMultiplier * 2][dLeft + iEastWestMultiplier * 12] = 1;
                        m_arrayData[dTop + iNorthSouthMultiplier * 3][dLeft + iEastWestMultiplier * 11] = 1;
                        m_arrayData[dTop + iNorthSouthMultiplier * 4][dLeft + iEastWestMultiplier * 11] = 1;
                        m_arrayData[dTop + iNorthSouthMultiplier * 5][dLeft + iEastWestMultiplier * 11] = 1;
                        m_arrayData[dTop + iNorthSouthMultiplier * 6][dLeft + iEastWestMultiplier * 12] = 1;
                        m_arrayData[dTop + iNorthSouthMultiplier * 7][dLeft + iEastWestMultiplier * 13] = 1;
                        m_arrayData[dTop + iNorthSouthMultiplier * 7][dLeft + iEastWestMultiplier * 14] = 1;

                        m_arrayData[dTop + iNorthSouthMultiplier * 4][dLeft + iEastWestMultiplier * 15] = 1;

                        m_arrayData[dTop + iNorthSouthMultiplier * 2][dLeft + iEastWestMultiplier * 16] = 1;
                        m_arrayData[dTop + iNorthSouthMultiplier * 6][dLeft + iEastWestMultiplier * 16] = 1;

                        m_arrayData[dTop + iNorthSouthMultiplier * 3][dLeft + iEastWestMultiplier * 17] = 1;
                        m_arrayData[dTop + iNorthSouthMultiplier * 4][dLeft + iEastWestMultiplier * 17] = 1;
                        m_arrayData[dTop + iNorthSouthMultiplier * 5][dLeft + iEastWestMultiplier * 17] = 1;

                        m_arrayData[dTop + iNorthSouthMultiplier * 4][dLeft + iEastWestMultiplier * 18] = 1;

                        m_arrayData[dTop + iNorthSouthMultiplier * 5][dLeft + iEastWestMultiplier * 21] = 1;
                        m_arrayData[dTop + iNorthSouthMultiplier * 6][dLeft + iEastWestMultiplier * 21] = 1;
                        m_arrayData[dTop + iNorthSouthMultiplier * 7][dLeft + iEastWestMultiplier * 21] = 1;
                        m_arrayData[dTop + iNorthSouthMultiplier * 5][dLeft + iEastWestMultiplier * 22] = 1;
                        m_arrayData[dTop + iNorthSouthMultiplier * 6][dLeft + iEastWestMultiplier * 22] = 1;
                        m_arrayData[dTop + iNorthSouthMultiplier * 7][dLeft + iEastWestMultiplier * 22] = 1;

                        m_arrayData[dTop + iNorthSouthMultiplier * 4][dLeft + iEastWestMultiplier * 23] = 1;
                        m_arrayData[dTop + iNorthSouthMultiplier * 8][dLeft + iEastWestMultiplier * 23] = 1;

                        m_arrayData[dTop + iNorthSouthMultiplier * 3][dLeft + iEastWestMultiplier * 25] = 1;
                        m_arrayData[dTop + iNorthSouthMultiplier * 4][dLeft + iEastWestMultiplier * 25] = 1;
                        m_arrayData[dTop + iNorthSouthMultiplier * 8][dLeft + iEastWestMultiplier * 25] = 1;
                        m_arrayData[dTop + iNorthSouthMultiplier * 9][dLeft + iEastWestMultiplier * 25] = 1;

                        m_arrayData[dTop + iNorthSouthMultiplier * 6][dLeft + iEastWestMultiplier * 35] = 1;
                        m_arrayData[dTop + iNorthSouthMultiplier * 7][dLeft + iEastWestMultiplier * 35] = 1;
                        m_arrayData[dTop + iNorthSouthMultiplier * 6][dLeft + iEastWestMultiplier * 36] = 1;
                        m_arrayData[dTop + iNorthSouthMultiplier * 7][dLeft + iEastWestMultiplier * 36] = 1;
                    } catch (e) {

                        alert(e.message);
                    }
                };

                // Render and update simulation.
                var m_functionRender = function () {

                    try {

                        // Clear background.
                        m_contextRender.fillRect(0,
                            0,
                            m_options.width,
                            m_options.height);

                        // Calculate cell width and height.
                        var dX = 0;
                        var dY = 0;
                        var dCellWidth = m_options.width / m_options.numberOfColumns;
                        var dCellHeight = m_options.height / m_options.numberOfRows;

                        // Clone array.
                        var arrayData = [];
                        for (var iRow = 0; iRow < m_options.numberOfRows; iRow++) {

                            var arrayRow = [];
                            for (var iColumn = 0; iColumn < m_options.numberOfColumns; iColumn++) {

                                arrayRow.push(0);
                            }
                            arrayData.push(arrayRow);
                        }

                        // Begin a path.  An entire frame of life is presented as one long winding path.
                        m_contextRender.beginPath();

                        // Loop over all inner rows (this avoids range checks).
                        for (var iRow = 1; iRow < m_options.numberOfRows - 1; iRow++) {

                            // Calculate Y up front for whole row.
                            dY = dCellHeight * iRow;

                            // Pre-get the local rows.
                            var arrayRowPrev = m_arrayData[iRow - 1];
                            var arrayRow = m_arrayData[iRow];
                            var arrayRowNext = m_arrayData[iRow + 1];

                            // Loop across the inner columns (this avoids range checks).
                            for (var iColumn = 1; iColumn < m_options.numberOfColumns - 1; iColumn++) {

                                // Calculate x-coordinate for this column.
                                dX = dCellWidth * iColumn;

                                // Get the value of the current cell--alive or dead?
                                var iValue = arrayRow[iColumn];
                                if (iValue === 1) {

                                    // Render out if alive.
                                    m_contextRender.moveTo(dX,
                                        dY);
                                    m_contextRender.lineTo(dX + m_options.lineWidth,
                                        dY);
                                }

                                // Sum neighbor count using cached rows.
                                var iTotal = arrayRowPrev[iColumn - 1] +
                                    arrayRowPrev[iColumn] +
                                    arrayRowPrev[iColumn + 1] +
                                    arrayRow[iColumn - 1] +
                                    arrayRow[iColumn + 1] +
                                    arrayRowNext[iColumn - 1] +
                                    arrayRowNext[iColumn] +
                                    arrayRowNext[iColumn + 1];

                                // If this space is alive.
                                if (iValue === 1) {

                                    // Then it stays so for 2 or 3 neighbors otherwise it dies.
                                    iValue = ((iTotal === 2 || iTotal === 3) ? 1 : 0);
                                } else {

                                    // This is regenerates for 3 neighbors.
                                    iValue = ((iTotal === 3) ? 1 : 0);
                                }

                                // Save the output to the clone.
                                arrayData[iRow][iColumn] = iValue;
                            }
                        }

                        // Draw out the long, winding path.
                        m_contextRender.stroke();

                        // Swap for next iteration.
                        m_arrayData = arrayData;

                        // If still running, schedule the next iteration.
                        if (m_bAlive) {

                            setTimeout(m_functionRender,
                            m_options.timeoutMS);
                        }

                    } catch (e) {

                        alert(e.message);
                    }
                };

                ///////////////////////////////////
                // Private fields.

                // The canvas DOM element.
                var m_canvasRender = null;
                // The canvas DOM element's rendering context.
                var m_contextRender = null;
                // The collection of cells being simulated.
                var m_arrayData = [];
                // Indicates that this instance is created and not stopped.
                var m_bAlive = true;
                // Default configuration settings:
                var m_options = {

                    timeoutMS: 10,                          // Duration of each frame in MS.
                    background: "#000",                     // Background of render canvas.
                    fillStyle: "rgba(0,0,32,0.05)",         // The color that fills in the render canvas.  Use non-0 alpha for fade-out effect.
                    strokeStyle: "rgba(255,255,0,0.3)",     // The color of a live cell.
                    numberOfColumns: 3,                     // The number of cells in an left-right orientation.
                    numberOfRows: 3,                        // The number of cells in an top-bottom orientation.
                    lineWidth: 3,                           // The size of the cell dot.  Does not have to match natural cell size.
                    selector: "#VonNeumannCanvas",          // The CSS selector which uniquely specifies the DOM canvas.
                    width: 800,                             // The width of the simulation in pixels.
                    height: 600,                            // The height of the simulation in pixels.
                    gggFadeInMS: 10000,                     // MS to wait to fade in each GGG.
                    gggSlideRadius: 20                      // Radius of sliding of the GGG.
                };

                // Extend the options object with potential constructor parameters.
                Object.assign(m_options, optionsOverride);

                // Set the uber-closure.
                var self = this;
            };
        } catch (e) {

            alert(e.message);
        }
    });


