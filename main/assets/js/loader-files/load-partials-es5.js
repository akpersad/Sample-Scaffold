"use strict";

(function () {
	var allDivs = document.querySelector(".main-container").querySelectorAll("div");
	var loadingContainer = document.querySelector(".loading-container");
	var mainContainer = document.querySelector(".main-container");
	var length = allDivs.length;

	var componentCount = 0;
	var completedCalls = 0;

	for (var i = 0; length > i; i++) {
		if (allDivs[i].getAttribute("data-load-template")) {
			componentCount += 1;
		}
	}

	var loadTemplate = function loadTemplate(element, templatePath) {
		var request = new XMLHttpRequest();
		request.open("GET", templatePath, true);

		request.onload = function () {
			if (request.status >= 200 && request.status < 400) {
				// Success!

				var responseText = request.responseText;

				element.innerHTML = responseText;
				completedCalls += 1;

				if (completedCalls === componentCount) {
					var displayNone = "d-none";
					loadingContainer.classList.add(displayNone);
					mainContainer.classList.remove(displayNone);
					var bodySelect = document.querySelector("body");
					var scriptMake = document.createElement("script");
					scriptMake.src = "assets/js/combined-scripts/combined-scripts.js";
					bodySelect.appendChild(scriptMake);
				}
			} else {
				// We reached our target server, but it returned an error
			}
		};

		request.onerror = function () {
			// There was a connection error of some sort
		};

		request.send();
	};

	for (var j = 0; length > j; j++) {
		if (allDivs[j].getAttribute("data-load-template")) {
			loadTemplate(allDivs[j], allDivs[j].getAttribute("data-load-template"));
		}
	}
})();