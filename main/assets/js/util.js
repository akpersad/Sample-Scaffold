// eslint-disable-line semi
class Util {
	constructor(inputs = "No Arguements Passed") {
		this.inputs = inputs;
	}

	/*
	class manipulation functions
*/
	// Inputs: HTML ELement, String
	hasClass(el, className) {
		if (el == null || className == null) {
			console.warn("Make sure el (HTML Element) and className (string) are passed!");
		} else {
			if (el.classList) {
				return el.classList.contains(className);
			}
			return !!el.className.match(new RegExp(`(\\s|^)${className}(\\s|$)`));
		}
		return true;
	}

	// Inputs: HTML ELement, String
	addClass(el, className) {
		if (el == null || className == null) {
			console.warn("Make sure el (HTML Element) and className (string) are passed!");
		} else {
			const classList = className.split(" ");
			if (el.classList) {
				el.classList.add(classList[0]);
			} else if (!this.hasClass(el, classList[0])) {
				el.className += ` ${classList[0]}`;
			}
			if (classList.length > 1) {
				this.addClass(el, classList.slice(1).join(" "));
			}
		}
	}

	// Inputs: HTML ELement, String
	removeClass(el, className) {
		if (el == null || className == null) {
			console.warn("Make sure el (HTML Element) and className (string) are passed!");
		} else {
			const classList = className.split(" ");
			if (el.classList) {
				el.classList.remove(classList[0]);
			} else if (this.hasClass(el, classList[0])) {
				const reg = new RegExp(`(\\s|^)${classList[0]}(\\s|$)`);
				el.className = el.className.replace(reg, " ");
			}
			if (classList.length > 1) {
				this.removeClass(el, classList.slice(1).join(" "));
			}
		}
	}

	// Inputs: HTML ELement, String, Boolean
	toggleClass(el, className, bool) {
		if (el == null || className == null) {
			console.warn("Make sure el (HTML Element) and className (string) are passed!");
		} else if (bool) {
			this.addClass(el, className);
		} else {
			this.removeClass(el, className);
		}
	}

	swapClasses(el, classNameToAdd, classNameToRemove) {
		if (el == null || classNameToAdd == null || classNameToRemove == null) {
			console.warn(
				"Make sure el (HTML Element) and classNameToAdd / classNameToRemove (string) are passed!"
			);
		} else {
			this.addClass(el, classNameToAdd);
			this.removeClass(el, classNameToRemove);
		}
	}

	// Inputs: HTML ELement, Object
	setAttributes(el, attrs) {
		if (el == null || attrs == null) {
			console.warn("Make sure el (HTML Element) and attrs (Object {} ) are passed!");
		} else {
			for (const key in attrs) {
				if (attrs[key]) {
					el.setAttribute(key, attrs[key]);
				}
			}
		}
	}

	/*
  DOM manipulation
*/
	// Inputs: HTML ELement, String
	getChildrenByClassName(el, className) {
		const childrenByClass = [];
		if (el == null || className == null) {
			console.warn("Make sure el (HTML Element) and className (string) are passed!");
		} else {
			for (let i = 0; i < el.children.length; i++) {
				if (this.hasClass(el.children[i], className)) {
					childrenByClass.push(el.children[i]);
				}
			}
			return childrenByClass;
		}
		return childrenByClass;
	}

	getAllChildrenNodes(element = document.body) {
		return element.querySelectorAll("*");
	}

	/*
	Animate height of an element
*/
	// Inputs: Integer, Integer, HTML ELement, Integer, Function
	setHeight(start, to, element, duration, cb) {
		if (start == null || to == null || element == null || duration == null || cb == null) {
			console.warn("Inputs: Integer, Integer, HTML Element, Integer, Function");
		} else {
			const change = to - start;
			let currentTime;

			const animateHeight = timestamp => {
				if (!currentTime) {
					currentTime = timestamp;
				}
				const progress = timestamp - currentTime;
				const parseIntValue = (progress / duration) * (change + start);
				const val = parseInt(parseIntValue, 10);

				element.setAttribute("style", `height:${val}px;`);
				if (progress < duration) {
					window.requestAnimationFrame(animateHeight);
				} else {
					cb();
				}
			};

			// set the height of the element before starting animation -> fix bug on Safari
			element.setAttribute("style", `height:${start}px;`);
			window.requestAnimationFrame(animateHeight);
		}
	}

	/*
	Smooth Scroll
*/
	// Inputs: Integer, Integer, Function
	scrollTo(final, duration, cb) {
		const start = window.scrollY || document.documentElement.scrollTop;
		let currentTime;

		const animateScroll = timestamp => {
			if (!currentTime) {
				currentTime = timestamp;
			}
			let progress = timestamp - currentTime;
			if (progress > duration) {
				progress = duration;
			}
			const val = Math.easeInOutQuad(progress, start, final - start, duration);

			window.scrollTo(0, val);

			if (progress < duration) {
				window.requestAnimationFrame(animateScroll);
			} else {
				cb();
			}
		};

		window.requestAnimationFrame(animateScroll);
	}

	/*
  Focus utility classes
*/
	// Move focus to an element
	// Inputs: HTML ELement
	moveFocus(element) {
		element.focus();
		if (document.activeElement !== element) {
			element.setAttribute("tabindex", "-1");
			element.focus();
		}
	}

	/*
  Misc
*/
	// Inputs: Array, HTML ELement
	getIndexInArray(array, el) {
		return Array.prototype.indexOf.call(array, el);
	}
}

console.log("done");
