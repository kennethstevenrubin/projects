// Matrix class.
function Matrix(arrayCellData) {

    if (!arrayCellData) {
        throw "Must construct Matrix with valid cell data.";
    }

    this.rows = arrayCellData.length;
    if (this.rows < 1) {
        throw "Must specify at least one row.";
    }

    this.columns = arrayCellData[0].length;
    this.cellData = arrayCellData;

    if (this.rows > 2) {
        this.x = arrayCellData[0][0];
        this.y = arrayCellData[1][0];
        this.z = arrayCellData[2][0];
    }

    this.getCell = function (iRow,
        iColumn) {
        return this.cellData[iRow][iColumn];
    }

    this.setCell = function (iRow,
        iColumn,
        dValue) {
        this.cellData[iRow][iColumn] = dValue;
    }

    this.multiply = function (matrixRHS) {
        // Ensure these matrices can be multiplied.
        if (this.columns !== matrixRHS.rows) {
            throw "Specified matrix can not be multiplied by this instance.";
        }

        var arrayCellData = [];

        // Set cell values.
        for (var i = 0; i < this.rows; i++) {
            arrayCellData.push([]);
            for (var j = 0; j < matrixRHS.columns; j++) {
                var dCell = 0;
                for (var k = 0; k < this.columns; k++) {
                    dCell += (this.getCell(i, k) * matrixRHS.getCell(k, j))
                }
                arrayCellData[i].push(dCell);
            }
        }

        // Construct and return the output matrix.
        return new Matrix(arrayCellData);
    }

    this.multiplyScalar = function (dScalar) {
        var arrayCellData = [];

        // Set cell values.
        for (var i = 0; i < this.rows; i++) {
            arrayCellData.push([]);
            for (var j = 0; j < this.columns; j++) {
                var dCell = dScalar * this.getCell(i,j);
                arrayCellData[i].push(dCell);
            }
        }

        // Construct and return the output matrix.
        return new Matrix(arrayCellData);
    }

    this.add = function (matrixRHS) {
        // Ensure these matrices can be multiplied.
        if (this.rows !== matrixRHS.rows ||
            this.columns !== matrixRHS.columns) {
            throw "Specified matrix can not be added to this instance.";
        }

        var arrayCellData = [];

        // Set cell values.
        for (var i = 0; i < this.rows; i++) {
            arrayCellData.push([]);
            for (var j = 0; j < this.columns; j++) {
                var dCell = this.getCell(i,j) + 
                    matrixRHS.getCell(i,j);
                arrayCellData[i].push(dCell);
            }
        }

        // Construct and return the output matrix.
        return new Matrix(arrayCellData);
    }

    this.toString = function () {
        var strRet = "{\r\n";
        var bFirstRow = true;
        for (var iRow = 0; iRow < this.rows; iRow++) {

            if (bFirstRow === true) {
                strRet += " (";
                bFirstRow = false;
            } else {
                strRet += ",\r\n (";
            }

            var bFirstColumn = true;
            for (var iColumn = 0; iColumn < this.columns; iColumn++) {

                if (bFirstColumn === true) {
                    bFirstColumn = false;
                } else {
                    strRet += ", ";
                }

                strRet += this.getCell(iRow, iColumn);
            }
            strRet += ")";
        }
        strRet += "\r\n}";

        return strRet;
    }
}
