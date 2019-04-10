/* eslint-disable func-names */
(function() {
	const allDivs = document.querySelector(".main-container").querySelectorAll("div");
	const loadingContainer = document.querySelector(".loading-container");
	const mainContainer = document.querySelector(".main-container");
	const { length } = allDivs;
	let componentCount = 0;
	let completedCalls = 0;

	for (let i = 0; length > i; i++) {
		if (allDivs[i].getAttribute("data-load-template")) {
			componentCount += 1;
		}
	}

	const loadTemplate = (element, templatePath) => {
		const request = new XMLHttpRequest();
		request.open("GET", templatePath, true);

		request.onload = function() {
			if (request.status >= 200 && request.status < 400) {
				// Success!

				const { responseText } = request;
				element.innerHTML = responseText;
				completedCalls += 1;

				if (completedCalls === componentCount) {
					const displayNone = "d-none";
					loadingContainer.classList.add(displayNone);
					mainContainer.classList.remove(displayNone);
					const bodySelect = document.querySelector("body");
					const scriptMake = document.createElement("script");
					scriptMake.src = "assets/js/combined-scripts/combined-scripts.js";
					bodySelect.appendChild(scriptMake);
				}
			} else {
				// We reached our target server, but it returned an error
			}
		};

		request.onerror = function() {
			// There was a connection error of some sort
		};

		request.send();
	};

	for (let j = 0; length > j; j++) {
		if (allDivs[j].getAttribute("data-load-template")) {
			loadTemplate(allDivs[j], allDivs[j].getAttribute("data-load-template"));
		}
	}
})();
