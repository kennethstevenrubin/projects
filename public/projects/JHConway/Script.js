////////////////////////////////////////////////////////////////////
// Global variables.
var OutputCanvas = null;
var OutputContext = null;
var RenderCanvas = null;
var RenderContext = null;

var DotSize = 5;

var Radius = 0;
var Probability = 0;
var MinimumNeighbor = 0;
var MaximumNeighbor = 0;

var Width = 0;
var Height = 0;

var GridWidth = 0;
var GridHeight = 0;

var OutputImageData = null;
var RenderImageData = null;

////////////////////////////////////////////////////////////////////
// Document ready.
$(document).ready(
    function() {

        // Get the main, DOM canvas.
        OutputCanvas = document.getElementById("RenderCanvas");
        OutputContext = OutputCanvas.getContext("2d");
        Width = OutputCanvas.width;
        Height = OutputCanvas.height;
        GridWidth = Width / DotSize;
        GridHeight = Height / DotSize;

        // Construct an equivalent render canvas.
        RenderCanvas = document.createElement("canvas");
        RenderCanvas.width = Width;
        RenderCanvas.height = Height;
        RenderContext = RenderCanvas.getContext("2d");

        // Wire form change events.
        var sliderRadius = document.getElementById("RadiusSlider");
        var sliderProbability = document.getElementById("ProbabilitySlider");
        var sliderMinimumNeighbor = document.getElementById("MinimumNeighborSlider");
        var sliderMaximumNeighbor = document.getElementById("MaximumNeighborSlider");

        sliderRadius.onchange = RadiusSlider_OnChange;
        sliderProbability.onchange = ProbabilitySlider_OnChange;
        sliderMinimumNeighbor.onchange = MinimumNeighborSlider_OnChange;
        sliderMaximumNeighbor.onchange = MaximumNeighborSlider_OnChange;

        // Initiaize state and GUI.
        RadiusSlider_OnChange(null);
        ProbabilitySlider_OnChange(null);
        MinimumNeighborSlider_OnChange(null);
        MaximumNeighborSlider_OnChange(null);

        // Wire button.
        var buttonStart = document.getElementById("StartButton");
        buttonStart.onclick = function (e) {
             StartLife();
        };
    }
);

function DoIt() {

    var bufferOutput = OutputImageData.data;
    var bufferRender = RenderImageData.data;

    var neighborRed, neighborGreen, neighborBlue;
    for (var dX = 0; dX < GridWidth; dX++) {
        for (var dY = 0; dY < GridHeight; dY++) {
            var bPoison = false;
            var iNeighbors = 0;
            for (var dI = -Radius; dI <= Radius; dI++) {
                if (bPoison === true) {
                    break;
                }
                for (var dJ = -Radius; dJ <= Radius; dJ++) {
                    if (bPoison === true) {
                        break;
                    }
                    if ((   DotSize * (dX + dI) + 1 >= 0 && 
                            DotSize * (dX + dI) + 1 < Width && 
                            DotSize * (dY + dJ) >= 0 && 
                            DotSize * (dY + dJ) < Height) && 
                            (bufferOutput[4 * (DotSize * (dX + dI) + 1 + DotSize * Width * (dY + dJ))] !== 0)) {
                        neighborRed = bufferOutput[4 * (DotSize * (dX + dI) + 1 + DotSize * Width * (dY + dJ))];
                        neighborGreen = bufferOutput[4 * (DotSize * (dX + dI) + 1 + DotSize * Width * (dY + dJ)) + 1];
                        neighborBlue = bufferOutput[4 * (DotSize * (dX + dI) + 1 + DotSize * Width * (dY + dJ)) + 2];
                        iNeighbors++;
                        if (iNeighbors > MaximumNeighbor + 1) {
                            bPoison = true;
                            break;
                        }
                    }
                }
            }
    
            iNeighbors--;
            if (iNeighbors >= MinimumNeighbor && 
                iNeighbors <= MaximumNeighbor) {

                for (var dInnerX = dX * DotSize; dInnerX < (dX + 1) * DotSize; dInnerX++) {
                   for (var dInnerY = dY * DotSize; dInnerY < (dY + 1) * DotSize; dInnerY++) {
                        if (dInnerX == dX * DotSize && dInnerY == dY * DotSize ||
                            dInnerX == dX * DotSize && dInnerY == (dY + 1) * DotSize - 1 ||
                            dInnerX == (dX + 1) * DotSize - 1 && dInnerY == dY * DotSize ||
                            dInnerX == (dX + 1) * DotSize - 1 && dInnerY == (dY + 1) * DotSize - 1) {
                            bufferRender[4 * (dInnerX + dInnerY * Width)] = 0;
                            bufferRender[4 * (dInnerX + dInnerY * Width) + 1] = 0;
                            bufferRender[4 * (dInnerX + dInnerY * Width) + 2] = 0;
                            bufferRender[4 * (dInnerX + dInnerY * Width) + 3] = 255;
                            continue;
                        }
                        bufferRender[4 * (dInnerX + dInnerY * Width)] = neighborRed;
                        bufferRender[4 * (dInnerX + dInnerY * Width) + 1] = neighborGreen;
                        bufferRender[4 * (dInnerX + dInnerY * Width) + 2] = neighborBlue;
                        bufferRender[4 * (dInnerX + dInnerY * Width) + 3] = 255;
                    }
                }
            } else {
                for (var dInnerX = dX * DotSize; dInnerX < (dX + 1) * DotSize; dInnerX++) {
                   for (var dInnerY = dY * DotSize; dInnerY < (dY + 1) * DotSize; dInnerY++) {
                        bufferRender[4 * (dInnerX + dInnerY * Width)] = 0;
                        bufferRender[4 * (dInnerX + dInnerY * Width) + 1] = 0;
                        bufferRender[4 * (dInnerX + dInnerY * Width) + 2] = 0;
                        bufferRender[4 * (dInnerX + dInnerY * Width) + 3] = 255;
                    }
                }
            }
        }
    }

    Swap();

    setTimeout(DoIt,
       50);
}

function StartLife() {

    OutputContext.fillStyle = "black";
    OutputContext.fillRect(0,
        0,
        Width,
        Height);

    OutputImageData = OutputContext.getImageData(0,
        0,
        Width,
        Height);
    var bufferOutput = OutputImageData.data; 

    RenderImageData = RenderContext.getImageData(0,
        0,
        Width,
        Height);
    var bufferRender = RenderImageData.data; 
    
    for (var dX = 0; dX < GridWidth; dX+=1) {
        for (var dY = 0; dY < GridHeight; dY+=1) {
            if (100 * Math.random() > 100 - Probability) {
                
                var iRed = Math.floor(Math.random() * 254) + 1;
                var iGreen = Math.floor(Math.random() * 254) + 1;
                var iBlue = Math.floor(Math.random() * 254) + 1;

                for (var dInnerX = dX * DotSize; dInnerX < (dX + 1) * DotSize; dInnerX++) {
                   for (var dInnerY = dY * DotSize; dInnerY < (dY + 1) * DotSize; dInnerY++) {
                        bufferRender[4 * (dInnerX + dInnerY * Width)] = iRed;
                        bufferRender[4 * (dInnerX + dInnerY * Width) + 1] = iGreen;
                        bufferRender[4 * (dInnerX + dInnerY * Width) + 2] = iBlue;
                        bufferRender[4 * (dInnerX + dInnerY * Width) + 3] = 255;
                    }
                }
            } else {
                for (var dInnerX = dX * DotSize; dInnerX < (dX + 1) * DotSize; dInnerX++) {
                   for (var dInnerY = dY * DotSize; dInnerY < (dY + 1) * DotSize; dInnerY++) {
                        bufferRender[4 * (dInnerX + dInnerY * Width)] = 0;
                        bufferRender[4 * (dInnerX + dInnerY * Width) + 1] = 0;
                        bufferRender[4 * (dInnerX + dInnerY * Width) + 2] = 0;
                        bufferRender[4 * (dInnerX + dInnerY * Width) + 3] = 255;
                    }
                }
            }
        }
    }

    Swap();

    setTimeout(DoIt,
        30);
}

function Swap() {

    OutputContext.putImageData(RenderImageData,
        0, 
        0);
    var idTemp = OutputImageData;
    OutputImageData = RenderImageData;
    RenderImageData = idTemp;
}

function RadiusSlider_OnChange(e) {

    var dValue = $("#RadiusSlider").val();
    Radius = dValue;
    $("#RadiusSliderValue").text(dValue); 
};

function ProbabilitySlider_OnChange(e) {

    var dValue = $("#ProbabilitySlider").val();
    Probability = dValue;
    $("#ProbabiltySliderValue").text(dValue); 
};

function MinimumNeighborSlider_OnChange(e) {

    var dTheOtherOne = $("#MaximumNeighborSlider").val();
    var dThisOne = $("#MinimumNeighborSlider").val();
    if (dThisOne > dTheOtherOne) {
        $("#MinimumNeighborSlider").val(dTheOtherOne);
        dThisOne = dTheOtherOne;
    }
    MinimumNeighbor = dThisOne;
    $("#MinimumNeighborSliderValue").text(dThisOne); 
};

function MaximumNeighborSlider_OnChange(e) {
    var dTheOtherOne = $("#MinimumNeighborSlider").val();
    var dThisOne = $("#MaximumNeighborSlider").val();
    
    if (dThisOne < dTheOtherOne) {
        $("#MaximumNeighborSlider").val(dTheOtherOne);
        dThisOne = dTheOtherOne;
    }
    MaximumNeighbor = dThisOne;
    $("#MaximumNeighborSliderValue").text(dThisOne); 
};

