///////////////////////////////////////
// Main application module.
// Tests OOP imeplementation.

"use strict";

define(["Movie"],
    function (Movie) {

        try {
            // Wire the Movie button to create the Movie object.
            $("#MovieButton").click(function () {
            
                try {
                
                    var arrayParagraphs = [$("#Paragraph0Input").val(),
                        $("#Paragraph1Input").val(),
                        $("#Paragraph2Input").val()];
                    
                    // Allocate new Movie.
                    new Movie($(document.body),
                        $("#TitleInput").val(),
                        arrayParagraphs,
                        $("#ButtonCaptionInput").val(),
                        parseFloat($("#TopInput").val()),
                        parseFloat($("#OverlayOpacityInput").val()),
                        "rgb(" + $("#BackColorInput").val() + ")",
                        "rgb(" + $("#TextColorInput").val() + ")",
                        parseFloat($("#RequiredWidthInput").val()),
                        parseFloat($("#RequiredHeightInput").val()),
                        $("#FontFamilyInput").val(),
                        parseFloat($("#FontSizeInput").val()),
                        parseFloat($("#TitleFontSizeInput").val()),
                        parseFloat($("#ButtonFontSizeInput").val()),
                        parseFloat($("#LineHeightInput").val()),
                        parseFloat($("#ParagraphSpacingGapInput").val()),
                        parseFloat($("#CornerRadiusInput").val()),
                        parseFloat($("#RightGapInput").val()),
                        parseFloat($("#BottomGapInput").val()),
                        parseFloat($("#ButtonHeightInput").val()),
                        parseFloat($("#TitleXInput").val()),
                        parseFloat($("#TitleYInput").val()),
                        parseFloat($("#ParagraphStartYInput").val()),
                        parseFloat($("#WidthParagraphPaddingInput").val()),
                        parseFloat($("#LineStartXInput").val()));
                } catch (e) {
                
                    alert(e.message);
                }
            });

        } catch (e) {

            alert(e.message);
        }
    });
