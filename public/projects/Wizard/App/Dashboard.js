////////////////////////////////////////////
// Plumvo Dashboard.

"use strict";

// Require each of the sections, which are separate modules.
define(["App/SectionPlumPalette",
        "App/SectionTimescaleControl",
        "App/SectionTabDreamsAndGoals",
        "App/SectionTabEverydayLife",
        "App/SectionTabAssetPools",
        "App/SectionFooter",
        "Movie"],
    function (SectionPlumPalette,
        SectionTimescaleControl,
        SectionTabDreamsAndGoals,
        SectionTabEverydayLife,
        SectionTabAssetPools,
        SectionFooter,
        Movie) {

        // Define the Dashboard constructor function.
        var functionRet = function Dashboard(optionsOverride) {

            // Uber-closure.
            var self = this;

            ////////////////////////////////////////////
            // Public events.

            // Define events raised by self component.
            self.onDeleteClick = null;
            self.onShareClick = null;
            self.onCopyClick = null;
            self.onPropertiesClick = null;
            self.onPrintClick = null;
            self.onAddPlanClick = null;
            self.onNewGoalClick = null;
            self.onDragPlumDrop = null;
            self.onPlanComboSelectionChange = null;
            self.onEditPlum = null;
            self.onDeletePlum = null;
            self.onRenamePlum = null;
            self.onHorizontalDrag = null;
            self.onVerticalDrag = null;
            self.onTimescalerChange = null;

            ////////////////////////////////////////////
            // Public properties.

            self.width = 0;
            self.height = 0;

            ////////////////////////////////////////////
            // Public methods.

            // Calculate e.offsetX and e.offsetY if they are undefined (as in Firefox)
        	self.possibleFirefoxAdjustment = function(e) {

        		try {
        			
        			if (e.offsetX !== undefined && e.offsetY != undefined)
	        			return null;
	        		
	        		var candiv = m_jqParent;
	        		e.offsetX = e.pageX-candiv.offset().left;
	        		e.offsetY = e.pageY-candiv.offset().top;

        		} catch (e) {
        			
        			return e;
        		}
        		
        		return null;
        	};
            
            // Build-up GUI and initialize object.
            self.create = function () {

                try {

                    // Get the parent references.
                    m_jqParent = $(m_options.host.selector);
                    if (m_jqParent.length === 0) {

                        throw { message: "Failed to select parent element." };
                    }

                    // Create the render canvas.
                    m_canvasRender = document.createElement("canvas");
                    m_canvasRender.id = "Render";
                    m_contextRender = m_canvasRender.getContext("2d");
                    m_jqParent.append(m_canvasRender);
                    m_jqCanvas = $(m_canvasRender);

                    // Save copy of canvas for snapshot.
                    m_canvasSnapshot = document.createElement("canvas");
                    m_canvasSnapshot.id = "Snapshot";
                    m_contextSnapshot = m_canvasSnapshot.getContext("2d");

                    // Create the tooltip object.  This is used by the asset pools 
                    // to show graph values, but could be used for any section.
                    var divTooltip = document.createElement("div");
                    m_jqParent.append(divTooltip);
                    m_jqTooltip = $(divTooltip);

                    // Set css attributes.
                    m_jqTooltip.css("position", "absolute");
                    m_jqTooltip.css("display", "none");
                    m_jqTooltip.css("z-index", "10000");
                    m_jqTooltip.css("background", "#ebb8b8");
                    m_jqTooltip.css("color", "#333333");
                    m_jqTooltip.css("text-align", "center");
                    m_jqTooltip.css("left", "4px");
                    m_jqTooltip.css("top", "4px");
                    m_jqTooltip.css("width", "100px");
                    m_jqTooltip.css("height", "17px");
                    m_jqTooltip.css("border", "1px solid #333333");
                    m_jqTooltip.css("font", "11px Arial");
                    m_jqTooltip.css("padding-top", "4px");

                    // Scan the input data for the active plan name.
                    var strPlanName = "";
                    var plan = null;
                    for (var i = 0; i < m_options.plumPalette.plans.length; i++) {

                        var planIth = m_options.plumPalette.plans[i];

                        if (planIth.selectedPlan) {

                            plan = planIth;
                            strPlanName = planIth.planName;
                            
                            if (planIth.showMovie) {
                            	
                            	m_showMovieAfterRendering = true;
                            }
                            break;
                        }
                    }

                    // Pre-process the plan start dates.
                    for (var i = 0; i < m_options.plumPalette.plans.length; i++) {

                        var planIth = m_options.plumPalette.plans[i];
                        planIth.planStartDate = new Date();
                    }

                    // Create the sections:

                    /////////////////////////////////////////////////////////////////////////////////
                    // Create the Plum Palette.
                    m_sectionPlumPalette = new SectionPlumPalette({

                        // Customize some soft-coded properties.
                        planName: strPlanName,
                        addPlanButtonDown: false,
                        comboButtonDown: false,
                        commandDown: false,
                        newGoalDown: false,
                        comboButtonLeft: 180,
                        addPlanButtonLeft: 220,
                        comboSelections: {},
                        dashboard: self,
                        plumPalette: {

                            visible: m_options.plumPalette.visible,
                            height: 118,
                            backgroundFillStyle: "#444",
                            fontPlanCombo: "27px Helvetica",
                            fillPlanComboText: "#DDD",
                            paddingPlanComboTextTop: 30,
                            paddingPlanComboTextLeft: 10,
                            fontFunctions: "11px Arial",
                            fontFunctionsIn: "11px Arial",
                            paddingFunctionTextTop: 75,
                            paddingFunctionTextLeft: 10,
                            paddingFunction: 5,
                            downDeltaY: 0,
                            selectedDelta: 0,
                            selectedDeltaHalf: 0,
                            plumScrollLeft: 300,
                            plumScrollTop: 8,
                            plumScrollHeight: 110,
                            plumScrollSpacer: 110,
                            addPlan: {

                                top: 32,
                                curveWidth: 13,
                                straightWidth: 30,
                                overallWidth: 45,
                                height: 25,
                                fillStyle: "rgb(146,72,99)",
                                plus: {

                                    lineWidth: 2,
                                    strokeStyle: "#FFF",
                                    nearAcross: 17,
                                    middleAcross: 22,
                                    farAcross: 27,
                                    nearDown: 8,
                                    middleDown: 13,
                                    farDown: 18
                                }
                            },
                            comboButton: {

                                top: 32,
                                straightWidth: 17,
                                overallWidth: 40,
                                height: 25,
                                squareBottomRightAdjustment: 2,
                                fillStyle: "rgb(146,72,99)",
                                downArrow: {

                                    strokeStyle: "#FFF",
                                    nearAcross: 13,
                                    middleAcross: 17,
                                    farAcross: 22,
                                    nearDown: 10,
                                    farDown: 17
                                },
                            },
                            combo: {

                                textAdjustment: {

                                    left: 2,
                                    top: 3,
                                    width: 5,
                                    height: 26
                                },
                                lineWidth: 2,
                                strokeDropDown: "#888",
                                fillDropDown: "#FFF",
                                fillSelectedText: "#6d1b3e",
                                fontSelectedText: "20px Helvetica",
                                baselineSelectedText: "top",
                                marginLeftSelectedText: 12,
                                marginTopSelectedText: 4,
                                dropDown: {

                                    adjustmentLeft: 2,
                                    width: 235,
                                    heightRow: 26,
                                    paddingHeight: 10,
                                    fillText: "#333333",
                                    fontText: "18px Helvetica",
                                    fillSelection: "rgb(235,184,185)",
                                    fillHover: "rgba(193,109,143,0.5)",
                                    paddingRegions: {

                                        left: 1,
                                        width: 2,
                                        top: 3,
                                        height: 24
                                    }
                                }
                            },
                            plans: m_options.plumPalette.plans
                        }});

                    // Wire plum palette events.
                    m_sectionPlumPalette.onDeleteClick = function (e) { if ($.isFunction(self.onDeleteClick)) { self.onDeleteClick(e); } };
                    m_sectionPlumPalette.onPropertiesClick = function (e) { if ($.isFunction(self.onPropertiesClick)) { self.onPropertiesClick(e); } };
                    m_sectionPlumPalette.onPrintClick = function (e) { if ($.isFunction(self.onPrintClick)) { self.onPrintClick(e); } };
                    m_sectionPlumPalette.onCopyClick = function (e) { if ($.isFunction(self.onCopyClick)) { self.onCopyClick(e); } };
                    m_sectionPlumPalette.onShareClick = function (e) { if ($.isFunction(self.onShareClick)) { self.onShareClick(e); } };
                    m_sectionPlumPalette.onAddPlanClick = function (e) { if ($.isFunction(self.onAddPlanClick)) { self.onAddPlanClick(e); } };
                    m_sectionPlumPalette.onNewGoalClick = function (e) { if ($.isFunction(self.onNewGoalClick)) { self.onNewGoalClick(e); } };
                    m_sectionPlumPalette.onDragPlumDrop = function (e) { if ($.isFunction(self.onNewGoalClick)) { self.onDragPlumDrop(e); } };
                    m_sectionPlumPalette.onPlanComboSelectionChange = function (e) { if ($.isFunction(self.onPlanComboSelectionChange)) { self.onPlanComboSelectionChange(e); } };

                    /////////////////////////////////////////////////////////////////////////////////
                    // Create the Timescale Control.
                    m_sectionTimescaleControl = new SectionTimescaleControl({

                        dashboard: self,
                        timescaleControl: {

                            visible: m_options.timescaleControl.visible,
                            height: 70,
                            strokeStyleScale: "#888",
                            lengthScaleLong: 20,
                            lengthScaleShort: 3,
                            centerScale: 24,
                            fontDecadeLabel: "20px Helvetica",
                            fillStyleAlternateDecade: "#555",
                            fillStyleAlternateYear: "#555",
                            fillStyleDecadeText: "#AAA",
                            paddingAlternateDecadeTop: 28,
                            paddingAlternateYearTop: 13,
                            heightAlternateDecade: 7,
                            heightAlternateYear: 7,
                            paddingDecadeTextTop: 50,
                            paddingThumb: 0
                        }
                    });

                    // Wire event.
                    m_sectionTimescaleControl.onChange = function (e) { if ($.isFunction(self.onTimescalerChange)) { self.onTimescalerChange(e); } };


                    // Define some constants that are used in multiple places.
                    var dPadding = 3;
                    var dHatchGap = 8;
                    var dLineWidth = 4;
                    var strStrokeStyle = "#edbaba";
                    var strEventFont = "Bold 12px Helvetica";
                    var dEndCapWidth = 20;
                    var dPlumSpacerWidth = 20;
                    var dTopPlumBalance = 2;
                    var dBackgroundGapWidth = 3;
                    var dWidthToRadiusMultiplier = 0.5;
                    var dPaddingAlert = 8;
                    var dWidthAlert = 10;
                    var dGapAlertHeight = -4;
                    var dPaddingAlertNumberX = -4;
                    var dPaddingAlertNumberY = -8;
                    var strFillAlertLevel1 = "#7eaf61";
                    var strFillAlertLevel2 = "#efcb07";
                    var strFillAlertLevel3 = "#ef6f07";
                    var strPlusPlumFillForeground = "#888";
                    var strPlusPlumFillBackground = "#444";
                    var dPlusPlumPaddingLeft = 20;
                    var dPlusPlumPaddingBottom = 25;
                    var dPlusPlumRadius = 12;
                    var dPlusPlumBackgruondGapWidth = 5;

                    /////////////////////////////////////////////////////////////////////////////////
                    // Create the Dreams & Goals.
                    m_sectionTabDreamsAndGoals = new SectionTabDreamsAndGoals({

                        dashboard: self,
                        renderData: m_options.dreamsAndGoals.data,
                        padding: dPadding,
                        hatchGap: dHatchGap,
                        lineWidth: dLineWidth,
                        strokeStyle: strStrokeStyle,
                        eventFont: strEventFont,
                        endCapWidth: dEndCapWidth,
                        endCapFillStyle: "#edbaba",
                        plumSpacerWidth: dPlumSpacerWidth,
                        topPlumBalance: dTopPlumBalance,
                        dragDeltaY: 26,
                        backgroundGapWidth: dBackgroundGapWidth,
                        widthToRadiusMultiplier: dWidthToRadiusMultiplier,
                        renderSplitterPlum: true,
                        showPlusPlum: m_options.dreamsAndGoals.showPlusPlum,
                        paddingAlert: dPaddingAlert,
                        widthAlert: dWidthAlert,
                        gapAlertHeight: dGapAlertHeight,
                        paddingAlertNumberX: dPaddingAlertNumberX,
                        paddingAlertNumberY: dPaddingAlertNumberY,
                        fillAlertLevel1: strFillAlertLevel1,
                        fillAlertLevel2: strFillAlertLevel2,
                        fillAlertLevel3: strFillAlertLevel3,
                        plusPlum: {

                            fillForeground: strPlusPlumFillForeground,
                            fillBackground: strPlusPlumFillBackground,
                            paddingLeft: dPlusPlumPaddingLeft,
                            paddingBottom: dPlusPlumPaddingBottom,
                            radius: dPlusPlumRadius,
                            backgroundGapWidth: dPlusPlumBackgruondGapWidth
                        },
                        dreamsAndGoals: {

                            visible: m_options.dreamsAndGoals.visible,
                            collapsed: false,
                            showHeader: m_options.dreamsAndGoals.showHeader,
                            showHeaderName: m_options.dreamsAndGoals.showHeaderName,	// Jerry
                            rowHeight: 26,
                            headerHeight: 44,
                            paddingHeight: 20
                        },
                        background: {

                            textFont: "20px Helvetica",
                            textFillStyle: "#EEF",
                            textXPadding: 10,
                            textBaseline: "top",

                            tabYearBlockoutPadding: 10,
                            tabFillStyle: "#444",
                            tabWidthPadding: 40,
                            tabHeight: 34,
                            tabPadding: 10,
                            tabRadius: 14,

                            colorTriangle: "#EEE",
                            triangleWidth: 6,

                            strokeStyleTabShadow: "rgba(0,0,0,0.1)"
                        },
                        grid: {

                            strokeStyleYearLines: "#333",
                            strokeStyle: "#666",
                            strokeHighlight: "#666",
                            padding: 10
                        },
                        years: {

                            paddingTop: 22,
                            showDecadeLineTip: false,
                            showDecadeBehindYear: false,
                            decadeLineTopHeight: 5,
                            strokeDecadeLineTip: "#666",
                            textFillStyle: "#666",
                            fillHighlight: "#AAA",
                            font: "12px Helvetica"
                        }
                    });

                    // Wire event.
                    m_sectionTabDreamsAndGoals.onNewGoalClick = function (e) { if ($.isFunction(self.onNewGoalClick)) { self.onNewGoalClick(e); } };
                    m_sectionTabDreamsAndGoals.onHorizontalDrag = function (e) { if ($.isFunction(self.onHorizontalDrag)) { self.onHorizontalDrag(e); } };
                    m_sectionTabDreamsAndGoals.onVerticalDrag = function (e,e2,e3) { if ($.isFunction(self.onVerticalDrag)) { self.onVerticalDrag(e,e2,e3); } };

                    /////////////////////////////////////////////////////////////////////////////////
                    // Create the Everyday Life.
                    m_sectionTabEverydayLife = new SectionTabEverydayLife({

                        dashboard: self,
                        renderData: m_options.everydayLife.data,
                        padding: dPadding,
                        hatchGap: dHatchGap,
                        lineWidth: dLineWidth,
                        strokeStyle: "#c8f0b1",
                        eventFont: strEventFont,
                        endCapWidth: dEndCapWidth,
                        endCapFillStyle: "#c8f0b1",
                        dragDeltaY: 26,
                        plumSpacerWidth: dPlumSpacerWidth,
                        topPlumBalance: dTopPlumBalance,
                        backgroundGapWidth: dBackgroundGapWidth,
                        widthToRadiusMultiplier: dWidthToRadiusMultiplier,
                        renderSplitterPlum: false,
                        showPlusPlum: m_options.everydayLife.showPlusPlum,
                        paddingAlert: dPaddingAlert,
                        widthAlert: dWidthAlert,
                        gapAlertHeight: dGapAlertHeight,
                        paddingAlertNumberX: dPaddingAlertNumberX,
                        paddingAlertNumberY: dPaddingAlertNumberY,
                        fillAlertLevel1: strFillAlertLevel1,
                        fillAlertLevel2: strFillAlertLevel2,
                        fillAlertLevel3: strFillAlertLevel3,
                        plusPlum: {

                            fillForeground: strPlusPlumFillForeground,
                            fillBackground: strPlusPlumFillBackground,
                            paddingLeft: dPlusPlumPaddingLeft,
                            paddingBottom: dPlusPlumPaddingBottom,
                            radius: dPlusPlumRadius,
                            backgroundGapWidth: dPlusPlumBackgruondGapWidth
                        },
                        everydayLife: {

                            visible: m_options.everydayLife.visible,
                            collapsed: false,
                            showHeader: m_options.everydayLife.showHeader,
                            showHeaderName: m_options.everydayLife.showHeaderName,	// Jerry
                            rowHeight: 26,
                            headerHeight: 44,
                            paddingHeight: 20
                        },
                        background: {

                            textFont: "20px Helvetica",
                            textFillStyle: "#EEF",
                            textXPadding: 10,
                            textBaseline: "top",

                            tabYearBlockoutPadding: 10,
                            tabFillStyle: "#444",
                            tabWidthPadding: 40,
                            tabHeight: 34,
                            tabPadding: 10,
                            tabRadius: 14,

                            colorTriangle: "#EEE",
                            triangleWidth: 6,

                            strokeStyleTabShadow: "rgba(0,0,0,0.1)"
                        },
                        grid: {

                            strokeStyleYearLines: "#333",
                            strokeStyle: "#666",
                            strokeHighlight: "#666",
                            padding: 10
                        },
                        years: {

                            showDecadeBehindYear: true,
                            paddingTop: 22,
                            showDecadeLineTip: false,
                            decadeLineTopHeight: 5,
                            strokeDecadeLineTip: "#666",
                            textFillStyle: "#666",
                            fillHighlight: "#AAA",
                            font: "12px Helvetica"
                        }});

                    // Wire event.
                    m_sectionTabEverydayLife.onNewGoalClick = function (e) { if ($.isFunction(self.onNewGoalClick)) { self.onNewGoalClick(e); } };
                    m_sectionTabEverydayLife.onHorizontalDrag = function (e) { if ($.isFunction(self.onHorizontalDrag)) { self.onHorizontalDrag(e); } };
                    m_sectionTabEverydayLife.onVerticalDrag = function (e,e2,e3) { if ($.isFunction(self.onVerticalDrag)) { self.onVerticalDrag(e,e2,e3); } };

                    /////////////////////////////////////////////////////////////////////////////////
                    // Create the Asset Pools.
                    m_sectionTabAssetPools = new SectionTabAssetPools({

                        dashboard: self,
                        renderData: m_options.assetPools.data,
                        padding: dPadding,
                        endCapSpacer: 3,
                        numberGap: 10,
                        hatchGap: dHatchGap,
                        lineWidth: dLineWidth,
                        strokeStyle: "#7eaf61",
                        eventFont: strEventFont,
                        endCapWidth: dEndCapWidth,
                        endCapFillStyle: "#7eaf61",
                        dragDeltaY: 53,
                        plumSpacerWidth: dPlumSpacerWidth,
                        topPlumBalance: dTopPlumBalance,
                        backgroundGapWidth: dBackgroundGapWidth,
                        widthToRadiusMultiplier: dWidthToRadiusMultiplier,
                        paddingAlert: dPaddingAlert,
                        widthAlert: dWidthAlert,
                        showPlusPlum: m_options.assetPools.showPlusPlum,
                        gapAlertHeight: dGapAlertHeight,
                        paddingAlertNumberX: dPaddingAlertNumberX,
                        paddingAlertNumberY: dPaddingAlertNumberY,
                        fillAlertLevel1: strFillAlertLevel1,
                        fillAlertLevel2: strFillAlertLevel2,
                        fillAlertLevel3: strFillAlertLevel3,
                        plusPlum: {

                            fillForeground: strPlusPlumFillForeground,
                            fillBackground: strPlusPlumFillBackground,
                            paddingLeft: dPlusPlumPaddingLeft,
                            paddingBottom: dPlusPlumPaddingBottom,
                            radius: dPlusPlumRadius,
                            backgroundGapWidth: dPlusPlumBackgruondGapWidth
                        },
                        assetPools: {

                            visible: m_options.assetPools.visible,
                            collapsed: false,
                            showHeader: m_options.assetPools.showHeader,
                            showHeaderName: m_options.assetPools.showHeaderName,	// Jerry
                            rowHeight: 53,
                            endCapRowHeight: 20,
                            headerHeight: 44,
                            paddingHeight: 20
                        },
                        background: {

                            textFont: "20px Helvetica",
                            textFillStyle: "#EEF",
                            textXPadding: 10,
                            textBaseline: "top",

                            tabYearBlockoutPadding: 10,
                            tabFillStyle: "#444",
                            tabWidthPadding: 40,
                            tabHeight: 34,
                            tabPadding: 10,
                            tabRadius: 14,

                            colorTriangle: "#EEE",
                            triangleWidth: 6,

                            strokeStyleTabShadow: "rgba(0,0,0,0.1)"
                        },
                        grid: {

                            strokeStyleYearLines: "#333",
                            strokeStyle: "#666",
                            strokeHighlight: "#666",
                            padding: 10
                        },
                        years: {

                            paddingTop: 22,
                            showDecadeBehindYear: true,
                            showDecadeLineTip: false,
                            decadeLineTopHeight: 5,
                            strokeDecadeLineTip: "#666",
                            textFillStyle: "#666",
                            fillHighlight: "#AAA",
                            font: "12px Helvetica"
                        }});

                    // Wire event.
                    m_sectionTabAssetPools.onNewGoalClick = function (e) { if ($.isFunction(self.onNewGoalClick)) { self.onNewGoalClick(e); } };
                    m_sectionTabAssetPools.onHorizontalDrag = function (e) { if ($.isFunction(self.onHorizontalDrag)) { self.onHorizontalDrag(e); } };
                    m_sectionTabAssetPools.onVerticalDrag = function (e,e2,e3) { if ($.isFunction(self.onVerticalDrag)) { self.onVerticalDrag(e,e2,e3); } };

                    /////////////////////////////////////////////////////////////////////////////////
                    // Create the Footer.
                    m_sectionFooter = new SectionFooter({

                        dashboard: self,
                        footer: {

                            visible: m_options.footer.visible,
                            height: 60,
                            renderYearsAntiPadding: 10
                        },
                        years: {

                            paddingTop: 22,
                            textFillStyle: "#666",
                            showDecadeLineTip: true,
                            decadeLineTopHeight: 5,
                            strokeDecadeLineTip: "#666",
                            fillHighlight: "#AAA",
                            font: "12px Helvetica"
                        }});

                    // Update the display start and duration according to the selected plan.
                    var exceptionRet = self.updateDisplayedSegment(plan);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Wire events.

                    // Wire mouse events to handle event and asset manipulations.
                    m_jqCanvas.bind("mousedown",
                        m_functionMouseDown);
                    m_jqCanvas.bind("mousemove",
                        m_functionMouseMove);
                    m_jqCanvas.bind("mouseup",
                        m_functionMouseUp);
                    m_jqCanvas.bind("mouseout",
                        m_functionMouseOut);

                    // Hook the resize to update the size of the dashboard when the browser is resized.
                    $(window).bind("resize",
                        m_functionWindowResize);

                    // Call prime render.
                    var renderRet = m_functionRender();
                    
                    if (m_showMovieAfterRendering) {
                    	
                    	m_showMovieAfterRendering = false;
                    	new Movie(m_jqParent);
                    }
                    
                    return renderRet;
                } catch (e) {

                    return e;
                } finally {

                    // Cause a resize to get all parts lined up.
                    setTimeout(m_functionWindowResize,
                        50);
                }
            };

            // Destroy object.
            self.destroy = function () {

                try {

                    // Un-wire mouse events to handle event and asset manipulations.
                    m_jqCanvas.unbind("mousedown",
                        m_functionMouseDown);
                    m_jqCanvas.unbind("mousemove",
                        m_functionMouseMove);
                    m_jqCanvas.unbind("mouseup",
                        m_functionMouseUp);
                    m_jqCanvas.unbind("mouseout",
                        m_functionMouseOut);

                    // Un-hook the resize to update the size of the dashboard when the browser is resized.
                    $(window).unbind("resize",
                        m_functionWindowResize);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Set the dirty flag so the next time the 
            // dashboard is drawn it is also re-layout-ed.
            self.setDirty = function () {

                try {

                    m_bDirty = true;

                    setTimeout(function () {

                        m_functionWindowResize(null);
                    }, 50);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Section registers a flyout to be rendered 
            // after all the sections so it is "on top".
            self.registerFlyout = function (flyout) {

                try {

                    m_options.renderFlyout = flyout;

                    flyout.onEditPlum = self.onEditPlum;
                    flyout.onDeletePlum = self.onDeletePlum;
                    flyout.onRenamePlum = self.onRenamePlum;
                    flyout.onHorizontalDrag = self.onHorizontalDrag;
                    flyout.onVerticalDrag = self.onVerticalDrag;

                    // Set property.
                    flyout.dashboard = this;

                    // Recalculate height possibly, because the flyout 
                    // might extend beyond the bottom of the flyout.
                    m_bDirty = true;

                    // Cause a render in the near future--to account for the possibility 
                    // that the flyout extended below the bottom of the dashboard.
                    setTimeout(m_functionRender,
                        50);

                    return null;
                } catch (e) {

                    return e;
                }
            }

            // Remove registered flyout.
            self.unregisterFlyout = function (flyout) {

                try {

                    // Only unregister if match, otherwise, this would remove a new flyout.
                    if (m_options.renderFlyout === flyout) {

                        m_options.renderFlyout.onEditPlum = null;
                        m_options.renderFlyout.onDeletePlum = null;
                        m_options.renderFlyout.onRenamePlum = null;
                        m_options.renderFlyout.onHorizontalDrag = null;
                        m_options.renderFlyout.onVerticalDrag = null;

                        m_options.renderFlyout = null;

                        // Recalculate height possibly, because the flyout 
                        // might extend beyond the bottom of the flyout.
                        m_bDirty = true;

                        // Cause a render (again).
                        return m_functionRender();
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Section registers related data for two pass display.
            self.registerRelated = function (related) {

                try {

                    m_options.related = related;

                    // Recalculate height possibly, because the flyout 
                    // might extend beyond the bottom of the flyout.
                    m_bDirty = true;

                    // Cause a render in the near future--to account for the possibility 
                    // that the flyout extended below the bottom of the dashboard.
                    setTimeout(m_functionRender,
                        50);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Remove registered related.
            self.unregisterRelated = function () {

                try {

                    m_options.related = null;

                    // Recalculate height possibly, because the flyout 
                    // might extend beyond the bottom of the flyout.
                    m_bDirty = true;

                    // Cause a render in the near future--to account for the possibility 
                    // that the flyout extended below the bottom of the dashboard.
                    setTimeout(m_functionRender,
                        50);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Indicate that the point is inside the section.
            self.isMouseWithinDreamsAndGoals = function (e) {

                return m_sectionTabDreamsAndGoals.isPointInRectangle(e);
            };

            // Set the cursor for the dashboard.
            self.setCursor = function (strCursor) {

                try {

                    // Normalize cursor.
                    if (strCursor === undefined ||
                        strCursor === null) {

                        strCursor = "default";
                    }

                    // Set the cursor with jQuery.
                    m_jqCanvas.css("cursor",
                        strCursor);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Get the date from the x specified.
            self.getDateFromX = function (x) {

                // Ask the dreams and goals section...
                return m_sectionTabDreamsAndGoals.getDateFromX(m_sectionTabDreamsAndGoals.getRectangle(),
                    x);
            };

            // Cause a render.
            self.forceRender = function () {

                return m_functionRender();
            };
            
            // Method copies the current render canvas into the snapshot canvas.
            self.captureSnapshot = function () {
            	
            	// Save off the current canvas.
            	m_contextSnapshot.drawImage(m_canvasRender, 
            			0, 
            			0);
            	return null;
            };

            // Method copies the current snapshot canvas into the render canvas.
            self.renderSnapshot = function () {
            	
            	// Save off the current canvas.
            	m_contextRender.drawImage(m_canvasSnapshot, 
            			0, 
            			0);
            	return null;
            };

            // Update the display dates and cause a re-render.
            self.updateDisplayedSegment = function (plan) {

                try {

                    // The specified plan is now the current plan.
                    m_sectionTimescaleControl.options.planCurrent = plan;
                    m_sectionPlumPalette.options.planCurrent = plan;
                    m_sectionTabDreamsAndGoals.options.planCurrent = plan;
                    m_sectionTabEverydayLife.options.planCurrent = plan;
                    m_sectionTabAssetPools.options.planCurrent = plan;
                    m_sectionFooter.options.planCurrent = plan;

                    // Get locals from plan.
                    var dateStart = plan.planStartDate;
                    var msDuration = plan.msDuration;

                    // Set start and windowMS in timescale control.
                    m_sectionTimescaleControl.options.startDate = dateStart;
                    m_sectionTimescaleControl.options.displayWindowMS = msDuration;

                    // Get the plan's current window (default to middle third).
                    var dateAdjusted = new Date(dateStart.getTime());
                    var displayWindowMSAdjusted = msDuration;
                    if (plan.windowStart !== undefined) {

                        dateAdjusted = plan.windowStart;
                        displayWindowMSAdjusted = plan.windowDuration;
                    } else {

                        plan.windowStart = dateAdjusted;
                        plan.windowDuration = displayWindowMSAdjusted;
                    }

                    // Put a 5% gap on either side of the display.
                    dateAdjusted = new Date(dateAdjusted.getTime() - displayWindowMSAdjusted * 0.2);
                    displayWindowMSAdjusted *= 1.4;

                    // Set properties in the output sections.
                    m_sectionPlumPalette.options.startDate = dateAdjusted;
                    m_sectionTabDreamsAndGoals.options.startDate = dateAdjusted;
                    m_sectionTabEverydayLife.options.startDate = dateAdjusted;
                    m_sectionTabAssetPools.options.startDate = dateAdjusted;
                    m_sectionFooter.options.startDate = dateAdjusted;

                    m_sectionPlumPalette.options.displayWindowMS = displayWindowMSAdjusted;
                    m_sectionTabDreamsAndGoals.options.displayWindowMS = displayWindowMSAdjusted;
                    m_sectionTabEverydayLife.options.displayWindowMS = displayWindowMSAdjusted;
                    m_sectionTabAssetPools.options.displayWindowMS = displayWindowMSAdjusted;
                    m_sectionFooter.options.displayWindowMS = displayWindowMSAdjusted;

                    // Reset the AP state.
                    var exceptionRet = m_sectionTabAssetPools.resetRenderState();
                    if (exceptionRet !== null) {

                        return exceptionRet;
                    }

                    return self.forceRender();
                } catch (e) {

                    return e;
                }
            };

            // Called when the combo box handles a mouse 
            // down to stop subsequent mouse down handling.
            self.comboMouseDown = function () {

                try {

                    m_options.comboMouseDown = true;
                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Return the currently displayed plan's id.
            self.getDisplayedPlanId = function () {

                // This must be set, so just return it.
                return m_sectionPlumPalette.options.planCurrent.planId;
            };

            // Return the tooltip jQuery object.
            self.setTooltip = function (strTooltip,
                bNumeric) {

                try {

                    if (bNumeric === undefined) {

                        bNumeric = true;
                    }

                    var sizeTooltip = strTooltip.size();
                    m_jqTooltip.html(strTooltip);
                    m_jqTooltip.css("width", (sizeTooltip.width + 10).toString() + "px");
                    m_jqTooltip.css("display", "inherit");

                    // Set the backgound color based on positive or negative, but don't blow up if its not a number.
                    if (bNumeric) {

                        var dValue = parseFloat(strTooltip);
                        if (dValue < 0) {

                            m_jqTooltip.css("background", "#f6b17a");
                        } else {

                            m_jqTooltip.css("background", "#c8f0b1");
                        }
                    } else {

                        m_jqTooltip.css("background", "#ebb8b8");
                    }

                    return null;
                } catch (e) {

                    return e;
                };
            };

            // Return the tooltip jQuery object.
            self.hideTooltip = function () {

                try {

                    m_jqTooltip.css("display", "none");
                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Return the tooltip jQuery object.
            self.moveTooltip = function (dLeft,
                dTop) {

                try {

                    m_jqTooltip.css("left", dLeft.toString() + "px");
                    m_jqTooltip.css("top", dTop.toString() + "px");
                    return null;
                } catch (e) {

                    return e;
                };
            };

            ////////////////////////////////////////////
            // Private methods.

            // Calculate the section rectangles.
            var m_functionCalculateLayout = function () {

                try {

                    // Get the width from the container.
                    var dWidth = m_jqParent.width();
                    if (dWidth === undefined || dWidth === 0) {

//                    	var fullWindowWidth = $(window).width();
                    	
                    	
                    	dWidth = 800;
                    }

                    // Accumulate the required section heights:
                    var dPlumPaletteHeight = m_sectionPlumPalette.getHeight();
                    var dTimescaleControlHeight = m_sectionTimescaleControl.getHeight();
                    var dDreamsAndGoalsHeight = m_sectionTabDreamsAndGoals.getHeight();
                    var dEverydayLifeHeight = m_sectionTabEverydayLife.getHeight();
                    var dAssetPoolsHeight = m_sectionTabAssetPools.getHeight();
                    var dFooterHeight = m_sectionFooter.getHeight();

                    // The required height of the control is the sum of all the sections heights.
                    var dTotal = dPlumPaletteHeight +
                        dTimescaleControlHeight +
                        dDreamsAndGoalsHeight +
                        dEverydayLifeHeight +
                        dAssetPoolsHeight +
                        dFooterHeight;

                    // Posibly account for flyout.
                    if (m_options.renderFlyout !== undefined &&
                        m_options.renderFlyout !== null) {

                        // Ensure the flyout does not extend beyond the bottom of the dashboard.
                        var dBottomOfFlyout = m_options.renderFlyout.rectangle.top +
                            m_options.renderFlyout.rectangle.height;

                        if (dBottomOfFlyout > dTotal) {

                            dTotal = dBottomOfFlyout + m_options.flyoutBottomGap;
                        }
                    }

                    // Resize the parent element height.
                    m_jqParent.height(dTotal);

                    // Update canvas sizes.
                    m_canvasRender.width = dWidth;
                    m_canvasRender.height = dTotal;
                    m_canvasSnapshot.width = dWidth;
                    m_canvasSnapshot.height = dTotal;
                    self.width = dWidth;
                    self.height = dTotal;

                    // Calculate and set the section rectangles.
                    // Each just stacks upon the previous.
                    m_sectionPlumPalette.setRectangle({

                        left: 0,
                        top: 0,
                        width: dWidth,
                        height: dPlumPaletteHeight
                    });
                    m_sectionTimescaleControl.setRectangle({

                        left: 0,
                        top: dPlumPaletteHeight,
                        width: dWidth,
                        height: dTimescaleControlHeight
                    });
                    m_sectionTabDreamsAndGoals.setRectangle({

                        left: 0,
                        top: dPlumPaletteHeight + dTimescaleControlHeight,
                        width: dWidth,
                        height: dDreamsAndGoalsHeight
                    });
                    m_sectionTabEverydayLife.setRectangle({

                        left: 0,
                        top: dPlumPaletteHeight + dTimescaleControlHeight + dDreamsAndGoalsHeight,
                        width: dWidth,
                        height: dEverydayLifeHeight
                    });
                    m_sectionTabAssetPools.setRectangle({

                        left: 0,
                        top: dPlumPaletteHeight + dTimescaleControlHeight + dDreamsAndGoalsHeight + dEverydayLifeHeight,
                        width: dWidth,
                        height: dAssetPoolsHeight
                    });
                    m_sectionFooter.setRectangle({

                        left: 0,
                        top: dPlumPaletteHeight + dTimescaleControlHeight + dDreamsAndGoalsHeight + dEverydayLifeHeight + dAssetPoolsHeight,
                        width: dWidth,
                        height: dFooterHeight
                    });

                    // These pipes are clean.
                    m_bDirty = false;

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render control.  Pay attention to the dirty statuses.
            var m_functionRender = function () {

                try {

                    var exceptionRet = null;

                    // Calculate the layout whenever dirty.
                    if (m_bDirty) {

                        exceptionRet = m_functionCalculateLayout();
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                    }

                    // Configure pass for related or not.
                    m_contextRender.related = m_options.related;
                    m_contextRender.foreground = false;

                    // Render the timescale control.
                    exceptionRet = m_sectionTimescaleControl.render(m_contextRender);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Render the dreams and goals.
                    exceptionRet = m_sectionTabDreamsAndGoals.render(m_contextRender);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Render the Everyday Life.
                    exceptionRet = m_sectionTabEverydayLife.render(m_contextRender);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Render the Asset pools.
                    exceptionRet = m_sectionTabAssetPools.render(m_contextRender);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Render the Footer.
                    exceptionRet = m_sectionFooter.render(m_contextRender);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Render the plum palette.
                    exceptionRet = m_sectionPlumPalette.render(m_contextRender);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // If any section registered for post render flyout, render it now.
                    if (m_options.renderFlyout !== undefined &&
                        m_options.renderFlyout !== null) {

                        exceptionRet = m_options.renderFlyout.render(m_contextRender);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                    }

                    // If related, then shade and show the second layer.
                    if (m_contextRender.related !== undefined &&
                        m_contextRender.related !== null) {

                        m_contextRender.fillStyle = "rgba(0,0,0,0.5)";
                        m_contextRender.fillRect(0,
                            0,
                            self.width,
                            self.height);

                        // Set state for foreground pass.
                        m_contextRender.foreground = true;

                        // Re-render the dreams and goals as foreground.
                        exceptionRet = m_sectionTabDreamsAndGoals.render(m_contextRender);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }

                        // Re-render the Everyday Life as foreground.
                        exceptionRet = m_sectionTabEverydayLife.render(m_contextRender);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }

                        // Re-render the Asset pools as foreground.
                        exceptionRet = m_sectionTabAssetPools.render(m_contextRender);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                    }
                    return null;
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////////////////////
            // Private event handlers.

            // Invoked when the browser is resized.
            // Implemented to recalculate the regions.
            var m_functionWindowResize = function (e) {

                try {

                    m_bDirty = true;

                    // Send the resize down through the sections.

                    // It is known that asset pools are the only one who cares.
                    var exceptionRet = m_sectionTabAssetPools.onResize(m_contextRender);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Cause a render.
                    exceptionRet = m_functionRender();
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }
                } catch (e) {

                    alert(e.message);
                }
            };

            // Invoked when the mouse button is depressed over the control.
            // Implemented to call the region specific handler for the event.
            var m_functionMouseDown = function (e) {

                try {
                	
                    // Stops normal event propgation on mouse down.  Here because chrome tries to 
                    // "select" the element text (of where there is none) and this changes the cursor.
                    e.preventDefault();
                	
                	var exceptionRet = self.possibleFirefoxAdjustment(e);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Always reset this up front.
                    m_options.related = null;

                    // If flyout open, skip handling here.
                    if (m_options.renderFlyout !== undefined &&
                        m_options.renderFlyout !== null) {

                        return null;
                    }

                    // Reset combo mouse down in case it is set later.
                    m_options.comboMouseDown = false;

                    // Pass to the plum palette.
                    exceptionRet = m_sectionPlumPalette.onMouseDown(e);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Test if the combo box handled the mouse down.
                    if (m_options.comboMouseDown) {

                        return null;
                    }

                    // Pass to the timescale control.
                    var exceptionRet = m_sectionTimescaleControl.onMouseDown(e);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Pass to the dreams and goals.
                    exceptionRet = m_sectionTabDreamsAndGoals.onMouseDown(e);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Pass to the Everyday Life.
                    exceptionRet = m_sectionTabEverydayLife.onMouseDown(e);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Pass to the Asset pools.
                    exceptionRet = m_sectionTabAssetPools.onMouseDown(e);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Pass to the Footer.
                    exceptionRet = m_sectionFooter.onMouseDown(e);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Render.
                    exceptionRet = m_functionRender();
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }
                } catch (e) {

                    alert(e.message);
                }
            };

            // Invoked when the mouse is moved over the control.
            // Implemented to call the region specific handler for the event.
            var m_functionMouseMove = function (e) {

                try {

                	var exceptionRet = self.possibleFirefoxAdjustment(e);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Reset cursor here.
                    exceptionRet = self.setCursor();
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // If any section registered for post render flyout, render it now.
                    if (m_options.renderFlyout !== undefined &&
                        m_options.renderFlyout !== null) {

                        return m_options.renderFlyout.onMouseMove(e);
                    }

                    // Pass to the timescale control.
                    if (m_sectionTimescaleControl.isVisible()) {
                        
                        exceptionRet = m_sectionTimescaleControl.onMouseMove(e);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                    }

                    // Pass to the dreams and goals.
                    if (m_sectionTabDreamsAndGoals.isVisible()) {
                        
                        exceptionRet = m_sectionTabDreamsAndGoals.onMouseMove(e);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                    }

                    // Pass to the Everyday Life.
                    if (m_sectionTabEverydayLife.isVisible()) {

                        exceptionRet = m_sectionTabEverydayLife.onMouseMove(e);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                    }

                    // Pass to the Asset pools.
                    if (m_sectionTabAssetPools.isVisible()) {

                        exceptionRet = m_sectionTabAssetPools.onMouseMove(e);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                    }

                    // Pass to the Footer.
                    if (m_sectionFooter.isVisible()) {

                        exceptionRet = m_sectionFooter.onMouseMove(e);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                    }

                    // Pass to the plum palette.
                    if (m_sectionPlumPalette.isVisible()) {

                        exceptionRet = m_sectionPlumPalette.onMouseMove(e);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                    }

                    /* Render.
                    exceptionRet = m_functionRender();
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }*/

                    return null;
                } catch (e) {

                    alert(e.message);
                }
            };

            // Invoked when the mouse button is let up over the control.
            // Implemented to call the region specific handler for the event.
            var m_functionMouseUp = function (e) {

                try {

                	var exceptionRet = self.possibleFirefoxAdjustment(e);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                   // If any section registered for post render flyout, render it now.
                    var bFlyoutHandled = false;
                    if (m_options.renderFlyout !== undefined &&
                        m_options.renderFlyout !== null) {

                        bFlyoutHandled = m_options.renderFlyout.onMouseUp(e);
                    }

                    if (bFlyoutHandled === false) {

                        // Pass to the timescale control.
                        exceptionRet = m_sectionTimescaleControl.onMouseUp(e);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }

                        // Pass to the dreams and goals.
                        exceptionRet = m_sectionTabDreamsAndGoals.onMouseUp(e);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }

                        // Pass to the Everyday Life.
                        exceptionRet = m_sectionTabEverydayLife.onMouseUp(e);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }

                        // Pass to the Asset pools.
                        exceptionRet = m_sectionTabAssetPools.onMouseUp(e);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }

                        // Pass to the Footer.
                        exceptionRet = m_sectionFooter.onMouseUp(e);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }

                        // Pass to the plum palette.
                        exceptionRet = m_sectionPlumPalette.onMouseUp(e);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                    } else {

                        // Close flyout.
                        var exceptionRet = self.unregisterFlyout(m_options.renderFlyout);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                    }

                    // Render.
                    exceptionRet = m_functionRender();
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }
                } catch (e) {

                    alert(e.message);
                }
            };

            // Invoked when the mouse button is moved out from the control.
            // Implemented to call the region specific handler for the event.
            var m_functionMouseOut = function (e) {

                try {

                	var exceptionRet = self.possibleFirefoxAdjustment(e);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Always reset this up front.
                    m_options.related = null;

                    // Pass to the timescale control.
                    exceptionRet = m_sectionTimescaleControl.onMouseOut(e);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Pass to the dreams and goals.
                    exceptionRet = m_sectionTabDreamsAndGoals.onMouseOut(e);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Pass to the Everyday Life.
                    exceptionRet = m_sectionTabEverydayLife.onMouseOut(e);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Pass to the Asset pools.
                    exceptionRet = m_sectionTabAssetPools.onMouseOut(e);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Pass to the Footer.
                    exceptionRet = m_sectionFooter.onMouseOut(e);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Pass to the plum palette.
                    exceptionRet = m_sectionPlumPalette.onMouseOut(e);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Render.
                    exceptionRet = m_functionRender();
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }
                } catch (e) {

                    alert(e.message);
                }
            };

            ////////////////////////////////////////////
            // Private fields.

            // jQuery object wrapping the parent DOM element.
            var m_jqParent = null;
            // jQuery object wrapping the child (render) DOM element.
            var m_jqCanvas = null;
            // The rendering canvas.
            var m_canvasRender = null;
            // The rendering canvas's render context.
            var m_contextRender = null;
            // The snapshot canvas.
            var m_canvasSnapshot = null;
            // The Snapshot canvas's render context.
            var m_contextSnapshot= null;
            // The tooltip object.
            var m_jqTooltip = null;
            // Define the dirty state.
            var m_bDirty = true;
            // Whether to show movie after rendering.
            var m_showMovieAfterRendering = false;

            // The sections:
            var m_sectionPlumPalette = null;
            var m_sectionTimescaleControl = null;
            var m_sectionTabDreamsAndGoals = null;
            var m_sectionTabEverydayLife = null;
            var m_sectionTabAssetPools = null;
            var m_sectionFooter = null;

            // Options configuration.
            var m_options = {

                related: null,                  // Object holding three collections of related indicies to test for before displaying.
                flyoutBottomGap: 10,            // A little space below the flyout.
                host: {

                    selector: "#Host"           // The host selector.
                }
            };

            // Allow constructor parameters to override default settings.
            m_options.inject(optionsOverride);
        };

        // Return constructor.
        return functionRet;
    });
