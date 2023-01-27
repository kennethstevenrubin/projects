////////////////////////////////////////
/*

 CONFIDENTIAL AND PROPRIETARY
 Copyright (c) 2012 Peridrome Corporation
 All rights reserved

 */

// Debug logging facility.
define([], function() {

	var functionDebugLog = function debugLog() {

		// //////////////////////////////////////////
		// Method sends a log message to the listener.
		this.write = function(strLog) {
			try {

				// Compose timestamp.
				var dateTime = new Date();
				var strHours = dateTime.getHours().toString();
				if (strHours.length === 1) {

					strHours = "0" + strHours;

				}
				var strMinutes = dateTime.getMinutes().toString();
				if (strMinutes.length === 1) {

					strMinutes = "0" + strMinutes;

				}
				var strSeconds = dateTime.getSeconds().toString();
				if (strSeconds.length === 1) {

					strSeconds = "0" + strSeconds;

				}
				var strTimestamp = strHours + strMinutes + strSeconds;

				// Send the log message.

				// Old log way:
				// $("#debugLog #log").prepend("<li
				// class='debugLogBackIndentList'>" + strTimestamp + ": " +
				// strLog + "</li>");
				// Allocate a new AJAX client.
				var xhr = new XMLHttpRequest();

				// Configure the request parameters.
				// Note: for HTTP Get, payload is URL encoded. This puts an
				// upper-limit on the log message length (typically around 8K,
				// but varies by server).
				// Also Note: the very insane and very ugly "Random" parameter
				// elliminates request caching.
				xhr.open("GET", "http://localhost:8055/Debug/Log?payload="
						+ strTimestamp + ": " + strLog + "&Random="
						+ Math.random().toString(), true);

				// Send the GET request.
				xhr.send(null);

			} catch (e) {

				// alert(e.Message);

			}
		};
	};

	return new functionDebugLog();
});
