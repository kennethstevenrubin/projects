// JScript source code

"use strict";

define([],
    function() {
    
        return function Agar() {

            this.getData = function () {

                try {

                    return ["..*.....","....*...",".**..***"];
                } catch (e) {

                    alert(e.message);
                }
            };
        };
    });
