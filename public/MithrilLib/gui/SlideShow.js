///////////////////////////////////////
// Slide-show helper module.
//
// Returns singleton instance.

"use strict";

define([],
    function () {

        // Constructor function.
        var functionRet = function SlideShow(strParentSelector,
            strFolder) {

            var self = this;            // Uber-closure.

            // Define these variables up-front so they may be accessed via closure.
            var strURL = "";
            var divOverlay = null;
            var divLoading = null;
            var divImgageBounds = null;
            var divTT = null;
            var imgPopup = null;
            var divSS = null;
            var divDelete = null;
            var folder = null;
            var cookie = null;
            var thumbCurrent = null;
            var arrayThumbs = [];

            // Remove image and bounds (and the image with the bounds).
            var functionClearImage = function (functionCallback) {

                try {

                    // Animate to hidden.
                    $(divImgageBounds).animate({

                            opacity: 0
                        },
                        250,
                        function () {

                            // Wire up the keypress event.
                            $(document.body).unbind("keyup",
                                functionOverlayKeypress);

                            // Remove elements.
                            $(divOverlay).remove();
                            $(divImgageBounds).remove();

                            // If a callback is specified, then invoke it.
                            if ($.isFunction(functionCallback)) {
                            
                                functionCallback();
                            } else {
                            
                                // Since no callback, then called from the click handler to dismiss.
                                if (cookie !== null) {

                                    clearTimeout(cookie);
                                    cookie = null;
                                }
                            }
                        });
                } catch (e) {

                    alert(e.message);
                }
            };

            // Define a function that calculates the best 
            // offset for the image and moves it to there.
            var functionPositionImage = function () {

                try {

                    // Calculate the offset by the differences in 
                    // size between the image and the bounds object.
                    var dImageWidth = $(imgPopup).width();
                    var dImageHeight = $(imgPopup).height();

                    var dBoundsWidth = $(divImgageBounds).width();
                    var dBoundsHeight = $(divImgageBounds).height();

                    // Set image styles.
                    if (dImageHeight > dBoundsHeight ||
                        dImageWidth > dBoundsWidth) {
       
                        var dHeightRatio = (dBoundsHeight - 10) / dImageHeight;
                        var dWidthRatio = (dBoundsWidth - 10) / dImageWidth;

                        var dRatio = Math.min(dWidthRatio, dHeightRatio);
       
                        $(imgPopup).css({

                            left: ((dBoundsWidth - dImageWidth * dRatio) / 2).toString() + "px",
                            top: ((dBoundsHeight - dImageHeight * dRatio) / 2).toString() + "px",
                            height: (dImageHeight * dRatio).toString() + "px",
                            width: (dImageWidth * dRatio).toString() + "px"
                        });
                    } else {
       
                        $(imgPopup).css({

                            left: ((dBoundsWidth - dImageWidth) / 2).toString() + "px",
                            top: ((dBoundsHeight - dImageHeight) / 2).toString() + "px"
                        });
                    }
       
                } catch (e) {

                    alert(e.message);
                }
            };

            // Method invoked when the popup image is loaded.
            // Positions the image in its parent and animates.
            var functionImagePopupLoad = function () {

                try {
       
                    // Position image.
                    functionPositionImage();

                    // Animate to visible.
                    $(divImgageBounds).animate({

                            opacity: 1
                        },
                        250,
                        function () {

                            // Remove the loading text when done fading in.
                            $(divLoading).remove();
                            
                            // If animating in a slide show, then perpetuate that slide show.
                            if (cookie !== null) {
                            
                                // Slideshow forever.
                                cookie = setTimeout(functionNextSlideShowImage,
                                    4000);
                            }
                        });
                } catch (e) {

                    alert(e.message);
                }
            };

            // Function invoked to update the image displayed with the slide show.
            var functionNextSlideShowImage = function (bPrevious) {

                try {
       
                    // Default value to false.
                    if (bPrevious === undefined) {
       
                        bPrevious = false;
                    }

                    if (!bPrevious) {
       
                        // If asked to move next on the last thumb.
                        if (arrayThumbs[arrayThumbs.length - 1].attr("src") === $(thumbCurrent).attr("src")) {
           
                            // Just stop the timer.
                            clearTimeout(cookie);
                            cookie = null;
                            return;
                        }
                    } else {
       
                        // If asked to move prev on the first thumb.
                        if (arrayThumbs[0].attr("src") === $(thumbCurrent).attr("src")) {
           
                            // Just stop the timer.
                            clearTimeout(cookie);
                            cookie = null;
                            return;
                        }
                    }
       
                    // Call clear with a callback to click the next thumb.
                    functionClearImage(function () {
                    
                        try {
                        
                            for (var i = 0; i < arrayThumbs.length; i++) {
                            
                                var thumbTest = arrayThumbs[i];
                                if ($(thumbTest).attr("src") === $(thumbCurrent).attr("src")) {
                                
                                    if (!bPrevious) {

                                        // Get the next thumb.
                                        i++;
                                        if (i < arrayThumbs.length) {

                                            var thumbNext = arrayThumbs[i];
                                            functionThumbMouseUp.call(thumbNext);
                                        } else {
                                        
                                            clearTimeout(cookie);
                                            cookie = null;
                                        }
                                    } else {
                                    
                                        // Get the next thumb.
                                        i--;
                                        if (i >= 0) {

                                            var thumbNext = arrayThumbs[i];
                                            functionThumbMouseUp.call(thumbNext);
                                        } else {
                                        
                                            clearTimeout(cookie);
                                            cookie = null;
                                        }
                                    }
                                    break;
                                }
                            }
                        } catch (e) {
                        
                            alert(e.message);
                        }
                    });
                } catch (e) {

                    alert(e.message);
                }
            };

            // Function invoked when the slide show text is clicked.
            var functionSlideShowClick = function (e) {

                try {
       
                    $(divSS).remove();
                    $(divDelete).remove();

                    // Slideshow forever.
                    cookie = setTimeout(functionNextSlideShowImage,
                        4000);

                    e.preventDefault();
                    e.stopPropagation();
                } catch (e) {

                    alert(e.message);
                }
            };

            // Function invoked when the delete text is clicked.
            var functionDeleteClick = function (e) {

                try {

                    // Make the user confirm.
                    if (!confirm("Please confirm delete.")) {
       
                        return;
                    }

                    // Create closure for the thumb URL.
                    var strThumbURL = this.thumbURL;
       
                    // Delete thumb and small files.
                    var strAjaxUrl = "/?delete=" + encodeURIComponent(this.smallURL);

                    // Call server to get folders and files at mithrilsoft.
                    $.ajax({

                        url: strAjaxUrl,
                        dataType: "jsonp",
                        error: function (xhr,
                            strStatus,
                            strError) {

                            alert(strError);
                        },
                        success: function () {
                        
                            // Delete thumb and small files.
                            var strAjaxUrl = "/?delete=" + encodeURIComponent(strThumbURL);

                            // Call server to get folders and files at mithrilsoft.
                            $.ajax({

                                url: strAjaxUrl,
                                dataType: "jsonp",
                                error: function (xhr,
                                    strStatus,
                                    strError) {

                                    alert(strError);
                                },
                                success: function () {

                                    // All good.
                                }
                            });
                        }
                    });

                    // Remove thumbCurrent from array of thumbs.
                    for (var i = 0; i < arrayThumbs.length; i++) {
       
                        if ($(arrayThumbs[i]).attr("src") === $(thumbCurrent).attr("src")) {
       
                            arrayThumbs.splice(i, 1);
                            break;
                        }
                    }
       
                    // Remove thumb from DOM.
                    var imgThumb = $("#" + this.thumbId);
                    $(imgThumb).remove();
       
                    // Close the image--stop slide show if it is going.
                    functionClearImage();
       
                    e.preventDefault();
                    e.stopPropagation();
                } catch (e) {

                    alert(e.message);
                }
            };
       
            // Invoked when the user presses a key during the slide show presentation.
            var functionOverlayKeypress = function (e) {
       
                try {

                    // Back.
                    if (e.which === 37) {
       
                        if (cookie !== null) {
       
                            clearTimeout(cookie);
                            cookie = null;
                        }
                        functionNextSlideShowImage(true);
                    } else if (e.which === 39 ||
                        e.which === 13) {  // Next
       
                        if (cookie !== null) {
       
                            clearTimeout(cookie);
                            cookie = null;
                        }
                        functionNextSlideShowImage();
                    } else if (e.which === 27) {    // Stop
       
                        if (cookie !== null) {

                            clearTimeout(cookie);
                            cookie = null;
                        }
                        functionClearImage();
                    }
                } catch (x) {
       
                    alert(x.message);
                }
            };

            // Function invoked when a thumb is mouse up'd.
            var functionThumbMouseUp = function (e) {

                try {

                    // Hide the tool-tip.
                    $(divTT).remove();
       
                    // Get the url.
                    strURL = $(this).attr("src");

                    // Save the original value.
                    var strOriginalURL = strURL;
       
                    // Show the small, not the thumb.
                    strURL = strURL.replace("thumb",
                        "small");

                    // Create the overlay.
                    divOverlay = document.createElement("div");
                    $(divOverlay).css({

                        position: "fixed",
                        left: "0px",
                        right: "0px",
                        top: "0px",
                        bottom: "0px",
                        "z-index": 3,
                        background: "rgba(200,200,100,0.5)"
                    });
       
                    // Add the overlay to the DOM.
                    $(document.body).append(divOverlay);

                    // Wire up the keypress event.
                    $(document.body).bind("keyup",
                        functionOverlayKeypress);

                    // Create the loading text.
                    // Add the loading div to the DOM.
                    if (!cookie) {
       
                        divLoading = document.createElement("div");
                        $(divLoading).css({

                            position: "fixed",
                            left: "0px",
                            right: "0px",
                            top: "40%",
                            "text-align": "center",
                            "z-index": 4,
                            color: "yellow"
                        });

                        // Specify the loading text.
                        $(divLoading).text("Loading image, please wait...");

                        $(divOverlay).append(divLoading);
                    }

                    // Create the img bounds div.
                    divImgageBounds = document.createElement("div");
                    $(divImgageBounds).css({

                        position: "fixed",
                        left: "0px",
                        right: "0px",
                        top: "0px",
                        bottom: "0px",
                        "z-index": 5,
                        overflow: "auto",
                        opacity: 0,
                    });

                    // Create the img.
                    imgPopup = document.createElement("img");
                    $(imgPopup).css({

                        position: "fixed",
                        left: "0px",
                        right: "0px",
                        top: "0px",
                        bottom: "0px",
                        margin: "0px",
                        "z-index": 6
                    });
                    $(imgPopup).bind("click",
                        functionClearImage);
                    $(imgPopup).attr("src",
                        strURL);

                    // Save the current thumb.
                    thumbCurrent = this;

                    // Hook image load.  Resize image and fade in.
                    $(imgPopup).bind("load",
                        functionImagePopupLoad);

                    // Hook the resize of the browser to re-position the image.
                    $(window).bind("resize",
                        functionPositionImage);

                    // Add the image, the image bounds and the popup to the DOM.
                    $(document.body).append(divOverlay);
                    $(divOverlay).append(divImgageBounds);
                    $(divImgageBounds).append(imgPopup);

                    // Hook the clicks to clear the image.
                    $(divOverlay).bind("click",
                        functionClearImage);

                    // Create the slide show text.
                    if (!cookie) {
       
                        divSS = document.createElement("div");
                        $(divSS).css({

                            position: "fixed",
                            right: "5px",
                            bottom: "5px",
                            "text-align": "right",
                            "vertical-align": "bottom",
                            "z-index": 10,
                            "color": "yellow",
                            "cursor": "pointer",
                            "font-size": "20px"
                        });
                        $(divSS).html("Click here to start slide show");

                        $(divSS).bind("click",
                            functionSlideShowClick);

                        // Add the loading div to the DOM.
                        $(divOverlay).append(divSS);
       
                        // Always add the delete div.
                        divDelete = document.createElement("div");
                        divDelete.thumbId = $(this).attr("id");
                        divDelete.smallURL = strURL;
                        divDelete.thumbURL = strOriginalURL;

                        $(divDelete).css({

                            position: "fixed",
                            left: "5px",
                            bottom: "5px",
                            "text-align": "left",
                            "vertical-align": "bottom",
                            "z-index": 10,
                            "color": "yellow",
                            "cursor": "pointer",
                            "font-size": "20px"
                        });
                        $(divDelete).html("Click here to delete image");

                        $(divDelete).bind("click",
                            functionDeleteClick);

                        // Add the loading div to the DOM.
                        $(divOverlay).append(divDelete);
                    }
                } catch (e) {

                    alert(e);
                }
            };

            // Function invoked when the ajax call to get the images completes.
            var functionAjaxSuccess = function (objectData,
                    strStatus,
                    xhr) {

                try {

                    // Check for processing error.
                    if (objectData.success === false) {

                        // On error, throw error.
                        throw {

                            message: objectData.reason
                        };
                    }

                    // Save off the result.
                    folder = objectData.result;

                    // Extract the folder name.
                    var strMediaFolder = folder.Name;

                    // Create all the thumbnails.
                    for (var j = 0; j < folder.Files.length; j++) {

                        // Get the file.
                        var strFile = folder.Files[j];

                        // Ensure it is a thumbnail.
                        if (strFile.toUpperCase().indexOf("THUMB") === -1) {

                            continue;
                        }

                        var strPathName = strMediaFolder + "/" + strFile;
                        var strId = Math.floor(Math.random() * 1000000).toString();
                        var jqImgThumb = $("<img data-file='" +
                            j +
                            "' id='" + strId +
                            "' src='" + strPathName +
                            "' alt='' style='cursor:hand;' />");

                        // Add the image.
                        $(strParentSelector).append(jqImgThumb);
       
                        // Store the thumb.
                        arrayThumbs.push(jqImgThumb);
                    }

                    // Hook up all the thumbs.
                    $(strParentSelector + " img").bind("mouseup",
                        functionThumbMouseUp);

                    // Hook up all the thumbs.
                    $(strParentSelector + " img").mouseenter(function (e) {
                    
                        divTT = document.createElement("div");
                        $(divTT).css({

                            "position": "absolute",
                            "display": "none",
                            "left": (e.pageX - 20) + "px",
                            "top": (e.pageY + 20) + "px",
                            "text-align": "center",
                            "vertical-align": "top",
                            "z-index": 10,
                            "color": "black",
                            "padding": "4px",
                            "white-space": "nowrap",
                            "background": "white",
                            "border": "1px solid black",
                            "border-radius": "4px",
                            "font-size": "20px"
                        });
                        var strSrc = $(this).attr("src");
                        var iIndex = strSrc.indexOf("/thumb");
                        $(divTT).html(strSrc.substring(iIndex + 6));
                        $(document.body).append(divTT);
                        $(divTT).fadeIn(2000);
                    });
                    $(strParentSelector + " img").mousemove(function (e) {
                    
                        $(divTT).css({

                            left: (e.pageX - $(divTT).width() / 2) + "px",
                            top: (e.pageY + 20) + "px"
                        });
                    });
                    $(strParentSelector + " img").mouseleave(function () {
                    
                        $(divTT).remove();
                    });
                } catch (x) {

                    alert(x.message);
                }
            };

            var strAjaxUrl = "/?ls=" + encodeURIComponent(strFolder);

            // Call server to get folders and files at mithrilsoft.
            $.ajax({

                url: strAjaxUrl,
                dataType: "jsonp",
                error: function (xhr,
                    strStatus,
                    strError) {

                    alert(strError);
                },
                success: functionAjaxSuccess
            });
        };

        return functionRet;
    });
