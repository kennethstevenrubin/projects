///////////////////////////////////////
// Main application module.

"use strict";

// Require prototype first because modules are loaded out-of-order.
require(["./Prototypes",
    "./TreeGrid"],
    function (Prototypes,
        TreeGrid) {

        try {

            var iNumberOfGroupColumns = 3;
            var iNumberOfAllOrNoneColumns = 2;
            var iNumberOfSumColumns = 2;
            var iNumberOfRows = 10000;
            var iNumberOfUniqueValuesPerGroupColumn = 10;

            // Build up collection of unique columns used for generating groups.
            var arrayUniqueGroupValue = [];
            for (var i = 0; i < iNumberOfUniqueValuesPerGroupColumn; i++) {

                var strValue = (1000000 * Math.random()).toFixed(0);
                arrayUniqueGroupValue.push(strValue);
            }

            // Build up collection of columns which specializes the TreeGrid.
            var arrayColumns = [

                { name: "GUID", type: "string", operation: "UID", visible: false }
            ];

            for (var i = 0; i < iNumberOfGroupColumns; i++) {

                var column = {

                    name: "Group" + i.toString(),
                    type: "string",
                    filter: null,
                    operation: "group",
                    width: 100,
                    visible: true
                };
/*                if (i == 0) {

                    column.filter = [arrayUniqueGroupValue[0], arrayUniqueGroupValue[2], arrayUniqueGroupValue[4]];
                } else if (i == 1) {

                    column.filter = [arrayUniqueGroupValue[1], arrayUniqueGroupValue[3], arrayUniqueGroupValue[5]];
                }
  */              arrayColumns.push(column);
            }

            for (var i = 0; i < iNumberOfAllOrNoneColumns; i++) {

                arrayColumns.push({

                    name: "AllOrNone" + i.toString(),
                    type: "amount",
                    operation: "allOrNone",
                    width: 100,
                    visible: true
                });
            }

            for (var i = 0; i < iNumberOfSumColumns; i++) {

                arrayColumns.push({

                    name: "Sum" + i.toString(),
                    type: "amount",
                    operation: "sum",
                    width: 100,
                    visible: true
                });
            }

            // Allocate.
            var tg = new TreeGrid({

                style: {

                    rowHeight: 16
                },
                host: {
                    id: "#CatOutput"
                },
                columns: arrayColumns
            });

            // Create.
            var exceptionRet = tg.create();
            if (exceptionRet !== null) {

                throw exceptionRet;
            }

            // Build up columns.
            var arrayRows = [];
            for (var j = 0; j < iNumberOfRows; j++) {

                var row = {

                    0: { value: j }
                };

                var iCursor = 1;
                for (var i = 0; i < iNumberOfGroupColumns; i++) {

                    row[iCursor++] = { value: arrayUniqueGroupValue[Math.floor(iNumberOfUniqueValuesPerGroupColumn * Math.random())] };
                }

                for (var i = 0; i < iNumberOfAllOrNoneColumns; i++) {

                    row[iCursor++] = { value: 10000 * Math.random() };
                }

                for (var i = 0; i < iNumberOfSumColumns; i++) {

                    row[iCursor++] = { value: 10000 * Math.random() };
                }

                arrayRows.push(row);
            }

            var iGUID = arrayRows.length + 1;

            setInterval(function () {

                var arrayRows = [];
                for (var jh = 0; jh < 20; jh++) {

                    var row = {

                        0: { value: iGUID++ }
                    };

                    var iCursor = 1;
                    for (var i = 0; i < iNumberOfGroupColumns; i++) {

                        row[iCursor++] = { value: arrayUniqueGroupValue[Math.floor(iNumberOfUniqueValuesPerGroupColumn * Math.random())] };
                    }

                    for (var i = 0; i < iNumberOfAllOrNoneColumns; i++) {

                        row[iCursor++] = { value: 10000 * Math.random() };
                    }

                    for (var i = 0; i < iNumberOfSumColumns; i++) {

                        row[iCursor++] = { value: 10000 * Math.random() };
                    }

                    arrayRows.push(row);
                }

                // Merge into TreeGrid.
                var exceptionRet = tg.mergeRows(arrayRows);
                if (exceptionRet !== null) {

                    throw exceptionRet;
                }

            }, 1000);

        } catch (e) {

            alert(e.message);
        }
    });

