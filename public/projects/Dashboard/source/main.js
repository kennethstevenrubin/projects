////////////////////////////////////////////////
// Main is invoked when require is down-loaded.

"use strict";

// Require Function, Object and Dashboard.
require(["App/prototypes",
    "App/Dashboard"],
    function (prototypes,
        Dashboard) {

        try {

            var dashboard = null;

            // Compute detail data for AssetPools.
            var arrayDetail = [];

            var dateStart = new Date(2013, 0, 1);
            var dateEnd = new Date(2023, 0, 1);
            var dTotalDuration = dateEnd.getTime() - dateStart.getTime();

            var dateRunning = new Date(2013, 0, 1);
            while (dateRunning <= dateEnd) {

                var dRunningDuration = dateRunning.getTime() - dateStart.getTime();

                var dPercent = dRunningDuration / dTotalDuration;
                var dAngle = 2 * Math.PI * 10 * dPercent;
                arrayDetail.push({

                    date: dateRunning,
                    value: 1000000 * Math.sin(dAngle) * Math.sin(Math.PI * dPercent)
                });

                // Move on to the next month.
                var iYear = dateRunning.getFullYear();
                var iMonth = dateRunning.getMonth();
                if (iMonth < 11) {

                    dateRunning = new Date(iYear, iMonth + 1, 1);
                } else {

                    dateRunning = new Date(iYear + 1, 0, 1);
                }
            }

            var arrayDetail2 = [];

            dateStart = new Date(2015, 0, 1);
            dateEnd = new Date(2023, 5, 1);
            dTotalDuration = dateEnd.getTime() - dateStart.getTime();

            dateRunning = new Date(2015, 0, 1);
            while (dateRunning <= dateEnd) {

                var dRunningDuration = dateRunning.getTime() - dateStart.getTime();

                var dPercent = dRunningDuration / dTotalDuration;
                arrayDetail2.push({

                    date: dateRunning,
                    value: 100000 - 200000 * Math.sin(Math.PI * dPercent)
                });

                // Move on to the next month.
                var iYear = dateRunning.getFullYear();
                var iMonth = dateRunning.getMonth();
                if (iMonth < 11) {

                    dateRunning = new Date(iYear, iMonth + 1, 1);
                } else {

                    dateRunning = new Date(iYear + 1, 0, 1);
                }
            }

            var arrayDetail3 = [];

            dateStart = new Date(2000, 0, 1);
            dateEnd = new Date(2033, 0, 1);
            dTotalDuration = dateEnd.getTime() - dateStart.getTime();

            dateRunning = new Date(2000, 0, 1);
            while (dateRunning <= dateEnd) {

                var iYear = dateRunning.getFullYear();
                var bEven = ((iYear % 2) === 0);

                arrayDetail3.push({

                    date: dateRunning,
                    value: bEven ? 1000 : -1000
                });

                // Move on to the next month.
                var iMonth = dateRunning.getMonth();
                if (iMonth < 11) {

                    dateRunning = new Date(iYear, iMonth + 1, 1);
                } else {

                    dateRunning = new Date(iYear + 1, 0, 1);
                }
            }

            // Allocate the dashboard.
            dashboard = new Dashboard({

                plumPalette: {

                    plans: [{

                        planName: "Retirement Savings Long Name",
                        planId: 12345,
                        selectedPlan: false,
                        msDuration: new Date(2030, 1, 1).getTime() - new Date().getTime()
                    }, {

                        planName: "Conservative",
                        planId: 1,
                        selectedPlan: false,
                        msDuration: new Date(2040, 1, 1).getTime() - new Date().getTime()
                    }, {

                        planName: "Risky",
                        planId: 22,
                        selectedPlan: false,
                        msDuration: new Date(2050, 1, 1).getTime() - new Date().getTime()
                    }, {

                        planName: "World trip",
                        planId: 333,
                        selectedPlan: false,
                        msDuration: new Date(2060, 1, 1).getTime() - new Date().getTime()
                    }, {

                        planName: "Research",
                        planId: 4444,
                        selectedPlan: true,
                        msDuration: new Date(2070, 1, 1).getTime() - new Date().getTime()
                    }]
                },
                timescaleControl: {

                    visible: true
                },
                everydayLife: {

                    visible: true,
                    showHeader: true,
                    showHeaderName: true,
                    data: [{

                        name: "Income",
                        eventId: 6,
                        startDate: new Date(),
                        msDuration: new Date(2032, 1, 1).getTime() - new Date().getTime(),
                        details: [{

                            name: "Tuition",
                            amount: 20000,
                            description: "anually from Retirement Savings"
                        }, {

                            name: "Rent",
                            amount: 500,
                            description: "monthly from Cash"
                        }, {

                            name: "Rent",
                            amount: 500,
                            description: "monthly from Cash"
                        }, {

                            name: "Rent",
                            amount: 500,
                            description: "monthly from Cash"
                        }, {

                            name: "Groceries",
                            amount: 300,
                            description: "monthly from Cash"
                        }],
                        alerts: [{

                            level: 3
                        }]
                    }, {

                        name: "Off the right",
                        eventId: 7,
                        startDate: new Date(2034, 10, 1),
                        msDuration: new Date(2054, 10, 16).getTime() - new Date(2034, 10, 1).getTime(),
                        details: [{

                            name: "Tuition",
                            amount: 20000,
                            description: "anually from Retirement Savings"
                        }],
                        alerts: [{

                            level: 3
                        }]
                    }, {

                        name: "Leftly",
                        eventId: 8,
                        startDate: new Date(2013, 0, 1),
                        msDuration: new Date(2017, 10, 16).getTime() - new Date(2013, 0, 1).getTime(),
                        details: [{

                            name: "Rent",
                            amount: 500,
                            description: "monthly from Cash"
                        }, {

                            name: "Groceries",
                            amount: 300,
                            description: "monthly from Cash"
                        }],
                        alerts: [{

                            level: 3
                        }]
                    }, {

                        name: "Off the left",
                        eventId: 9,
                        startDate: new Date(2000, 10, 1),
                        msDuration: new Date(2001, 10, 16).getTime() - new Date(2000, 10, 1).getTime(),
                        details: [{

                            name: "Tuition",
                            amount: 20000,
                            description: "anually from Retirement Savings"
                        }],
                        alerts: [{

                            level: 3
                        }]
                    }, {

                        name: "Saving",
                        eventId: 10,
                        startDate: new Date(2014, 10, 1),
                        msDuration: new Date(2024, 10, 16).getTime() - new Date(2014, 10, 1).getTime(),
                        details: [{

                            name: "Tuition",
                            amount: 20000,
                            description: "anually from Retirement Savings"
                        }, {

                            name: "Groceries",
                            amount: 300,
                            description: "monthly from Cash"
                        }, {

                            name: "Groceries",
                            amount: 300,
                            description: "monthly from Cash"
                        }, {

                            name: "Groceries",
                            amount: 300,
                            description: "monthly from Cash"
                        }, {

                            name: "Groceries",
                            amount: 300,
                            description: "monthly from Cash"
                        }, {

                            name: "Groceries",
                            amount: 300,
                            description: "monthly from Cash"
                        }, {

                            name: "Groceries",
                            amount: 300,
                            description: "monthly from Cash"
                        }, {

                            name: "Groceries",
                            amount: 300,
                            description: "monthly from Cash"
                        }],
                        alerts: [{

                            level: 3
                        }]
                    }]
                },
                assetPools: {

                    visible: true,
                    showHeader: true,
                    showHeaderName: true,
                    data: [{

                        name: "Retirement Savings",
                        assetPoolId: 1,
                        startDate: new Date(2013, 0, 1),
                        msDuration: new Date(2023, 0, 1).getTime() - new Date(2013, 0, 1).getTime(),
                        detail: arrayDetail,
                        related: {

                            "dreamsAndGoals": [1],
                            "everydayLife": [],
                            "assetPools": [1]
                        },
                        assetAccounts: [{

                            name: "Bank of America Savings",
                            amount: 20000
                        }, {

                            name: "Fidelity Investments IRA",
                            amount: 300
                        }],
                        alerts: [{

                            level: 3
                        }]
                    }, {

                        name: "Off the left",
                        assetPoolId: 2,
                        startDate: new Date(2000, 10, 1),
                        msDuration: new Date(2001, 10, 16).getTime() - new Date(2000, 10, 1).getTime(),
                        detail: [],
                        assetAccounts: [],
                        alerts: [{

                            level: 3
                        }]
                    }, {

                        name: "Off the right",
                        assetPoolId: 3,
                        startDate: new Date(2034, 10, 1),
                        msDuration: new Date(2054, 10, 16).getTime() - new Date(2034, 10, 1).getTime(),
                        detail: [],
                        assetAccounts: [],
                        alerts: [{

                            level: 3
                        }]
                    }, {

                        name: "Cash",
                        assetPoolId: 4,
                        startDate: new Date(2015, 0, 1),
                        msDuration: new Date(2023, 5, 1).getTime() - new Date(2015, 0, 1).getTime(),
                        detail: arrayDetail2,
                        assetAccounts: [{

                            name: "Tuition",
                            amount: 20000
                        }, {

                            name: "Tuition",
                            amount: 20000
                        }, {

                            name: "Tuition",
                            amount: 20000
                        }, {

                            name: "Tuition",
                            amount: 20000
                        }, {

                            name: "Groceries",
                            amount: 300
                        }],
                        alerts: [{

                            level: 1
                        }, {

                            level: 2
                        }, {

                            level: 1
                        }]
                    }, {

                        name: "Square",
                        assetPoolId: 5,
                        startDate: new Date(2000, 0, 1),
                        msDuration: new Date(2033, 0, 1).getTime() - new Date(2000, 0, 1).getTime(),
                        detail: arrayDetail3,
                        assetAccounts: [],
                        alerts: [{

                            level: 3
                        }]
                    }]
                },
                footer: {

                    visible: true
                },
                host: {

                    selector: "#DashboardDiv"
                }
            });

            dashboard.onHorizontalDrag = function (event) {

                //alert("onHorizontalDrag: " + event.name);
            }

            dashboard.onVerticalDrag = function (event,
                iIndexFrom,
                iIndexTo) {

                //alert("onVerticalDrag: " + event.name + " swap " + iIndexFrom +  " to " + iIndexTo);
            }

            dashboard.onTimescalerChange = function (plan) {

                //alert(plan.planId);
            }

            dashboard.onEditFromFlyout = function (e) {

                alert(JSON.stringify(e));
            }

            // Create the object.
            var exceptionRet = dashboard.create();
            if (exceptionRet !== null) {

                throw exceptionRet;
            }
        } catch (e) {

            alert(e.message);
        }
    }
);
