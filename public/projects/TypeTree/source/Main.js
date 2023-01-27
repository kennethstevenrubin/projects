///////////////////////////////////////
// Main application module.
//

"use strict";

// The main module requires other modules, it does not define its own, per se.
require(["prototypes",
    "options",
    "TypeTree",
    "Type",
    "TypeSection",
    "Methods",
    "Properties",
    "Events",
    "Meta",
    "SectionPart",
    "Method",
    "Property",
    "Event"],
    function (prototypes, options, TypeTree, Type, TypeSection, Methods, Properties, Events, Meta, SectionPart, Method, Property, Event) {

        try {

            // Some dummy data....
            var arrayTypes = [];
            var iNumberOfTypes = Math.floor(Math.random() * 10);
            for (var i = 0; i < iNumberOfTypes; i++) {

                // Methods.
                var arrayMethods = [];
                var iNumberOfMethods = Math.floor(Math.random() * 10);
                for (var j = 0; j < iNumberOfMethods; j++) {

                    arrayMethods.push(new Method("Method" + (j + 1).toString()));
                }
                var methodsNew = new Methods(arrayMethods);

                // Properties.
                var arrayProperties = [];
                var iNumberOfProperties = Math.floor(Math.random() * 10);
                for (var j = 0; j < iNumberOfProperties; j++) {

                    arrayProperties.push(new Property("Property" + (j + 1).toString()));
                }
                var propertiesNew = new Properties(arrayProperties);

                // Events
                var arrayEvents = [];
                var iNumberOfEvents = Math.floor(Math.random() * 10);
                for (var j = 0; j < iNumberOfEvents; j++) {

                    arrayEvents.push(new Event("Event" + (j + 1).toString()));
                }
                var eventsNew = new Events(arrayEvents);

                arrayTypes.push(new Type("Type" + (i + 1).toString(),
                    [new Meta(), methodsNew, propertiesNew, eventsNew]));
            }

            // Allocate and create the object tree, passing the initialization object.
            var tt = new TypeTree();
            var exceptionRet = tt.create(arrayTypes);
            if (exceptionRet) {

                throw exceptionRet;
            }
        } catch (e) {

            alert(e.message);
        }
    });
