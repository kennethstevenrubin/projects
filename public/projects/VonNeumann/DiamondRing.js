﻿

"use strict";

define([],
    function () {

        return function DiamondRing() {

            this.getData = function () {

                try {

                    return [".......*...........",
                            "......*.*.....",
                            ".....*.*.*....",
                            ".....*...*....",
                            "...**..*..**..",
                            "..*....*....*.",
                            ".*.*.**.**.*.*",
                            "..*....*....*.",
                            "...**..*..**..",
                            ".....*...*....",
                            ".....*.*.*....",
                            "......*.*.....",
                            ".......*......"];
                } catch (e) {

                    alert(e.message);
                }
            };
        };
    });