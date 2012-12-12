/*
 * javadoc-filter-core.js
 * http://junk-box.appspot.com/appdocs/java/index.html
 * Copyright (C) 2012 S.Ishigaki
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */
Filter = function () {};
Filter.defaultStr = "フィルター";
Filter.emptyStr = "";
Filter.defaultColor = "#969696";
Filter.inputColor = "#000000";
Filter.all;
Filter.index;
Filter.indexChar = [
	"a", "b", "c", "d", "e", "f", "g", "h", "i",
	"j", "k", "l", "m", "n", "o", "p", "q", "r",
	"s", "t", "u", "v", "w", "x", "y", "z", "_"];
Filter.inner;
Filter.innerList;
Filter.innerObj;
Filter.compare;
Filter.compareObj;
Filter.splash = "JavaDoc Filter Ver1.2<br>Initializing ... ";
Filter.filter;
Filter.package;

function splash() {
	$(document.body).append("" +
		"<div style='position: absolute; top: 5px; left: 5px; " +
					"width: 95%; font-weight: bold; " +
					"background-color: #e5ecf9; " +
					"border: 1px solid #000; border-color: #c5d7ef;'>" +
			"<div style='padding: 2px 3px; font-size: 80%'>" +
				Filter.splash +
			"</div>" +
		"</div>");
	setTimeout("initialize()", 500);
}

function initialize() {
	if ($(document.body).find("#filter").length > 0) {
		alert("JavaDoc Filter is already runnning.")
		$(document.body.lastChild).remove();
		location.reload();
		return;

	}

	Filter.innerList = new Object();
	Filter.innerObj = new Object();
	Filter.compareObj = new Object();

	var aList = $(document.body.innerHTML).find("a");

	var list = new Array();
	var innerList = new Array();
	var compareList = new Array();
	var indexCount = 0;
	var cIndex;
	for (Filter.index = 0; Filter.index < aList.length; Filter.index++) {
		var a = aList[Filter.index];
//		if (a.childElementCount > 0) {	// Reason : ie8 not support 'childElementCount'
		if (a.childNodes[0].childNodes.length > 0) {
			a = a.firstChild;
		}

		var c = a.innerHTML.toLowerCase().substring(0, 1);
		cIndex = Filter.indexChar[indexCount];
		if (c != cIndex) {
			var index = getIndex(c, indexCount);
			if (index < 0) {
				alert("Unexpected initials [" + c + "] maybe [" + cIndex + "] indexCount=" + indexCount);
				alert(a.innerHTML.toLowerCase());
				break;
			}
			if (innerList.length > 0) {
				Filter.innerList[cIndex] = innerList;
				Filter.innerObj[cIndex] = innerList.join("<br>");
				Filter.compareObj[cIndex] = compareList;
			}
			innerList = new Array();
			compareList = new Array();
			indexCount = index;
		}

		var aStr = toHtml(aList[Filter.index])
		list.push(aStr);
		innerList.push(aStr);
		compareList.push(a.innerHTML.toLowerCase());

	}

	Filter.all = list.join("<br>");
	Filter.innerList[cIndex] = innerList;
	Filter.innerObj[cIndex] = innerList.join("<br>");
	Filter.compareObj[cIndex] = compareList;

	$(document.body.lastChild).remove();
	// ～ java SE 6
	$(document.body).find("table").css("visibility", "hidden");
	// java SE 7 ～
	$(document.body).find("ul").css("visibility", "hidden");

	$(document.body).append("" +
		"<div style='position: absolute; top: 5px; left: 5px; width: 95%; " +
					"font-size: 90%; font-family: Helvetica,Arial,sans-serif;'>" +
			"<div>" +
				"<input id='filter' type='text' style='width: 95%;'>" +
			"</div>" +
			"<div id='package' style='width: 100%; height: 100%; padding: 8px;'>" +
				Filter.all +
			"<div>" +
		"<div>");

	var filter = $(document.body).find("#filter");
	filter.val(Filter.defaultStr).css("color", Filter.defaultColor);
	filter.focus(function (e) {
		if (this.value == Filter.defaultStr) {
			$(this).val(Filter.emptyStr).css("color", Filter.inputColor);
		}
	});
	filter.blur(function () {
		if (this.value == Filter.emptyStr) {
			$(this).val(Filter.defaultStr).css("color", Filter.defaultColor);
		} else if (this.value != Filter.defaultStr) {
			$(this).css("color", Filter.inputColor);
		}
	});

	filter.keyup(function (e) {
		if (this.value == "") {
			Filter.package.html(Filter.all);
			return;
		}
		setTimeout("filtering('" + this.value.toLowerCase() + "')", 0);
	});

	Filter.filter = filter;
	Filter.package = $(document.body).find("#package");

};

function filtering(filterStr) {
	if (filterStr.length == 1) {
		Filter.package.html(Filter.innerObj[filterStr] == undefined ? "" : Filter.innerObj[filterStr]);
		return;
	}

	var c = filterStr.substring(0, 1);
	if (Filter.innerList[c] == undefined) {
		Filter.package.html("");
		return;
	}
	Filter.inner = Filter.innerList[c];
	Filter.compare = Filter.compareObj[c];

	var aList = new Array();
	for (var i = 0; i < Filter.inner.length; i++) {
		if (Filter.compare[i].indexOf(filterStr) == 0) {
			aList.push(Filter.inner[i]);
		}
	}
	if (filterStr == Filter.filter[0].value.toLowerCase()) {
		Filter.package.html(aList.join("<br>"));
	}
}

function getIndex(initials, count) {
	for (var i = count; i < Filter.indexChar.length; i++) {
		if (initials == Filter.indexChar[i]) {
			return i;
		}
	}
	return -1;
}

function toHtml(a) {
	var html = new Array();
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
}

chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		splash();
	}
);

