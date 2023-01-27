////////////////////////////////////////////////////////////////////
// Global variables.
var MouseEventData = [];
var Down = false;
var context = null;
var HistoryLength = 102;

////////////////////////////////////////////////////////////////////
// Document ready.
$(document).ready(
    function() {

        var canvas = document.getElementById("RenderCanvas");
        context = canvas.getContext("2d");
        var dWidth = canvas.width;
        var dHeight = canvas.height;

        var functionMove = function (e) {

            e.preventDefault();

            if (Down === true) {

                // Set relative mouse position.
                var dMouseX = e.offsetX;
                var dMouseY = e.offsetY;
                if (e.touches) {

                    for (var i = 0; i < e.touches.length; i++) {

                        dMouseX = e.touches[i].clientX - $(canvas).offset().left;
                        dMouseY = e.touches[i].clientY - $(canvas).offset().top;

                        MouseEventData.push({

                            "X":dMouseX,
                            "Y":dMouseY
                        });
                    }
                } else {

                    MouseEventData.push({

                        "X":dMouseX,
                        "Y":dMouseY
                    });
                }

                context.beginPath();

                var iLength = MouseEventData.length;
                var iCount = Math.min(HistoryLength, iLength);
                for (var i = 0; i < iCount; i++) {

                    context.moveTo(dMouseX,
                        dMouseY);
                    context.lineTo(MouseEventData[iLength - 1 - i].X,
                        MouseEventData[iLength - 1 - i].Y);
                }

                var dateNow = new Date();
                var iMSNow = dateNow.getSeconds();

                var dRed = Math.floor(128 + 127 * Math.sin(17.0 * Math.PI * (iMSNow) / 60));
                var dGreen = 255;//Math.floor(128 + 127 * Math.sin(15.0 * Math.PI * (iMSNow + 30) / 60));
                var dBlue = Math.floor(128 + 127 * Math.cos(19.0 * Math.PI * (iMSNow + 45) / 60));
                var dAlpha = 0.07;

                context.strokeStyle = "rgba("+dRed+","+dGreen+","+dBlue+","+dAlpha+")";
                context.stroke();
            }
        };
        $("#RenderCanvas")[0].addEventListener('mousemove',functionMove);
        $("#RenderCanvas")[0].addEventListener('touchmove',functionMove, true);

        var functionDown = function (e) {

            e.preventDefault();
            
            // Set relative mouse position.
            MouseEventData = [];
            Down = true;
        };
        $("#RenderCanvas").bind('mousedown',functionDown);
        $("#RenderCanvas").bind('touchstart',functionDown);

        var functionUp = function (e) {

            e.preventDefault();
            
            Down = false;
        }
        //$("#RenderCanvas").bind('mouseleave',functionUp);
        $("#RenderCanvas").bind('mouseup',functionUp);
        $("#RenderCanvas").bind('touchend',functionUp);
        //$("#RenderCanvas").bind('touchcancel',functionUp);

        var functionResize = function () {

            var dCanvasWidth = $(document.body).width();
            var dCanvasHeight = $(document.body).height();
            $(canvas).attr("width", dCanvasWidth.toString());
            $(canvas).attr("height", dCanvasHeight.toString());
            $(canvas).css({

                width: dCanvasWidth + "px",
                height: dCanvasHeight + "px"
            });
            
            context = canvas.getContext("2d");
            context.fillStyle = "black";
            context.fillRect(0,
                0,
                dCanvasWidth,
                dCanvasHeight);

        };
        $(window).resize(functionResize);
        functionResize();

        // Wire buttons.
        var functionClearButtonClick = function () {

            functionResize(); 
        };
        $("#ClearButton").click(functionClearButtonClick);
    }
);
