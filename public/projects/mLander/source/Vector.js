///////////////////////////////////////
// TheUberThing module.
//

"use strict";

define([],
    function () {

        try {

            // Define Vector constructor function.
            var functionRet = function Vector(dTheta, dMagnitude) {

                var self = this;

                self.theta = dTheta;
                self.magnitude = dMagnitude;
                self.x = dMagnitude * Math.cos(dTheta);
                self.y = dMagnitude * Math.sin(dTheta);

                self.setTheta = function (dTheta) {

                    self.theta = dTheta;
                    self.x = self.magnitude * Math.cos(dTheta);
                    self.y = self.magnitude * Math.sin(dTheta);
                }

                self.setMagnitude = function (dMagnitude) {

                    self.magnitude = dMagnitude;
                    self.x = dMagnitude * Math.cos(self.theta);
                    self.y = dMagnitude * Math.sin(self.theta);
                }

                self.multiplyScalar = function (dScalar) {

                    self.x *= dScalar;
                    self.y *= dScalar;

                    self.magnitude = Math.sqrt(Math.pow(self.x, 2) + Math.pow(self.y, 2));
                };

                self.addVector = function (vectorAdd) {

                    self.x += vectorAdd.x;
                    self.y += vectorAdd.y;

                    self.magnitude = Math.sqrt(Math.pow(self.x, 2) + Math.pow(self.y, 2));
                    self.theta = Math.atan2(self.y, self.x);
                };
            };

            // Return constructor function as require module object.
            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
