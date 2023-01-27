////////////////////////////////////////
// Color object wraps up RGBA values and 
// outputs formatted JavaScript rgba function.
////////////////////////////////////////
function Color(dRed,
    dGreen,
    dBlue,
    dAlpha) {

    this.red = dRed || Math.floor(Math.random() * 255);        // Red component of Color.
    this.green = dGreen || Math.floor(Math.random() * 255);    // Green component of Color.
    this.blue = dBlue || Math.floor(Math.random() * 255);      // Blue component of Color.
    this.alpha = dAlpha || Math.random() * 0.75 + 0.25;        // Alpha component of Color.

    // Function returns formatted rgba function.
    this.fromRGB = function (strRGB) {
        
        // Strip off everything outside of the parameter list.
        var astrParameters = /\((.+)\)/.exec(strRGB);
        var strParameters = astrParameters[1];
        
        // Split on the commas.
        var astrParts = strParameters.split(/,/);

        // Set object state.
        this.red = parseFloat(astrParts[0]);
        this.green = parseFloat(astrParts[1]);
        this.blue = parseFloat(astrParts[2]);
        this.alpha = astrParts.length > 3 ? parseFloat(astrParts[3]) : 1;
    }

    // Function returns formatted rgba function.
    this.toString = function () {
        return "rgba(" +
            Math.floor(this.red) + "," +
            Math.floor(this.green) + "," +
            Math.floor(this.blue) + "," +
            this.alpha + ")";
    }
}

