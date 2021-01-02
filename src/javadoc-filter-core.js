/*
 * JavaDoc Filter v1.5
 * https://junk-box.github.io/javadoc-filter.crx/index.html
 * 
 * Copyright (C) 2012 S.Ishigaki
 * Licensed under the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Date: 2013-11-6
 */
(function() {

var
	version = "1.5",

	defaultStr = "フィルター",

	emptyStr = "",

	defaultColor = "#969696",

	inputColor = "#000000",

	initialChar = [
		"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
		"n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
		"$", "_"
	],

	initialClass,

	classList = {},

	initialFix = {},

	initialName,

	nameList = {},

	filter,

	divAll,

	divList,

	splash = function() {
		$(document.body).append("" +
			"<div style='position: absolute; top: 5px; left: 5px; " +
						"width: 95%; font-weight: bold; " +
						"background-color: #e5ecf9; " +
						"border: 1px solid #000; border-color: #c5d7ef;'>" +
				"<div style='padding: 2px 3px; font-size: 80%'>" +
					"JavaDoc Filter Ver" + version + "<br>Initializing ... " +
				"</div>" +
			"</div>");
		setTimeout(initialize, 500);
	},

	initialize = function() {
		if ($(document.body).find("#filter").length > 0) {
			alert("JavaDoc Filter is already runnning.")
			$(document.body.lastChild).remove();
			location.reload();
			return;
		}

		var aList = $(document.body.innerHTML).find("a");

		var list = [];
		var classes = [];
		var names = [];
		var indexCount = 0;
		var cIndex;
		for (var i = 0; i < aList.length; i++) {
			var a = aList[i];
			if (a.childNodes[0].childNodes.length > 0) a = a.firstChild;

			// for JavaSE7jp
			if (a.innerHTML == "クラス") a.innerHTML = "Class";
			if (a.innerHTML == " ContentHandlerFactory") a.innerHTML = "ContentHandlerFactory";
			if (a.innerHTML == " CookiePolicy") a.innerHTML = "CookiePolicy";
			if (a.innerHTML == "llegalStateException") a.innerHTML = "IllegalStateException";
			if (a.innerHTML == "NamingContextExtStub") a.innerHTML = "_NamingContextExtStub";

			var c = a.innerHTML.toLowerCase().substring(0, 1);
			cIndex = initialChar[indexCount];
			if (c != cIndex) {
				var index = getIndex(c, indexCount);
				if (index < 0) {
					alert("Unexpected initials\n\"" + a.innerHTML + "\" [" + c + "] - [" + cIndex + "] indexCount=" + indexCount);
					break;
				}
				if (classes.length > 0) {
					classList[cIndex] = classes;
					initialFix[cIndex] = classes.join("<br>");
					nameList[cIndex] = names;
				}
				classes = [];
				names = [];
				indexCount = index;
				cIndex = c;
			}

			var aStr = toHtml(aList[i])
			list.push(aStr);
			classes.push(aStr);
			names.push(a.innerHTML.toLowerCase());

		}

		var all = list.join("<br>");
		classList[cIndex] = classes;
		initialFix[cIndex] = classes.join("<br>");
		nameList[cIndex] = names;

		$(document.body.lastChild).remove();
		// ～ java 6
		$(document.body).find("table").css("visibility", "hidden");
		// java 7 ～
		$(document.body).find("ul").css("visibility", "hidden");

		$(document.body).append("" +
			"<div style='position: absolute; top: 5px; left: 5px; width: 95%; " +
						"font-size: 90%; font-family: Helvetica,Arial,sans-serif;'>" +
				"<div>" +
					"<input id='filter' type='text' onclick='this.select()' style='width: 95%;'>" +
				"</div>" +
				"<div>" +
					"<div id='classListAll' style='width: 100%; height: 100%; padding: 8px; position: absolute; top: 0xp;'>" +
						all +
					"</div>" +
					"<div id='classList' style='width: 100%; height: 100%; padding: 8px; position: rerative; top: 0px; visibility: hidden;'>" +
					"</div>" +
				"</div>" +
			"<div>");

		var f = $(document.body).find("#filter");
		f.val(defaultStr).css("color", defaultColor);
		f.focus(function (e) {
			if (this.value == defaultStr) {
				$(this).val(emptyStr).css("color", inputColor);
			}
		});
		f.blur(function () {
			if (this.value == emptyStr) {
				$(this).val(defaultStr).css("color", defaultColor);
			} else if (this.value != defaultStr) {
				$(this).css("color", inputColor);
			}
		});

		f.keyup(function (e) {
			if (this.value == "") {
				divAll.css("visibility", "visible");
				divList.css("visibility", "hidden");
				return;
			}
			divAll.css("visibility", "hidden");
			divList.css("visibility", "visible");
			setTimeout(filtering(this.value.toLowerCase()), 0);
		});

		filter = f;
		divAll = $(document.body).find("#classListAll");
		divList = $(document.body).find("#classList");

		filter.focus();
	},

	filtering = function(filterStr) {
		if (filterStr.length == 1) {
			divList.html(initialFix[filterStr] == undefined ? "" : initialFix[filterStr]);
			return;
		}

		var c = filterStr.substring(0, 1);
		if (classList[c] == undefined) {
			divList.html("");
			return;
		}
		initialClass = classList[c];
		initialName = nameList[c];

		var aList = [];
		for (var i = 0; i < initialClass.length; i++) {
			if (initialName[i].indexOf(filterStr) == 0) aList.push(initialClass[i]);
		}
		if (filterStr == filter[0].value.toLowerCase()) {
			divList.html(aList.join("<br>"));
		}
	},

	getIndex = function(initials, count) {
		for (var i = count; i < initialChar.length; i++) {
			if (initials == initialChar[i]) return i;
		}
		return -1;
	},

	toHtml = function(a) {
		var html = [];
		html.push("<a");
		for (var i = 0; i < a.attributes.length; i++) {
			html.push(" ");
			html.push(a.attributes[i].nodeName);
			html.push("=");
			html.push(a.attributes[i].nodeValue);
		}
		html.push(">");
		html.push(a.innerHTML);
		html.push("</a>");

		return html.join("");
	};

	chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
		splash();
	});

})();
