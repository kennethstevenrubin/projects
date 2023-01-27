///////////////////////////////////////
//

"use strict";

define([],
    function() {
    
        return function Acorn() {

            this.getData = function () {

                try {

                    return [".*","...*","**..***"];
                } catch (e) {

                    alert(e.message);
                }
            };
        };
    });