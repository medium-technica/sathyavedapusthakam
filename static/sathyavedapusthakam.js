$(fnInit())

var ListFiles = [];
var ListTitleFiles = [];
var Articles;
var indexVerse = 0;

function fnInit() {
	console.log("init");
	loadFilesList();
}

function loadFilesList() {
	fetch("static/res/doc/text.json")
		.then(response => response.json())
		.then(data => {
			//console.log(data);
			Articles = data;
			indexArray = 0;
			$.each(data, function (key, value) {
				ListTitleFiles.push(key);
				$('#ListMenu').append(`<a href="#top" onclick="loadFile('` + key + `',` + indexArray + `)" class=" mdl-navigation__link ">` + key + `</a>`);
				indexArray++;
				ListFiles.push(value);
			})
			titleFileURL = getURLParam("t");
			//console.log(Articles[titleFileURL]);
			indexFile = Object.keys(Articles).indexOf(titleFileURL);
			//console.log("index from Name:" + indexFile);
			if (indexFile >= 0 && ListFiles.length > 0) {
				//console.log(ListFiles[indexFile]);
				loadFile(ListTitleFiles[indexFile], indexFile);
				return
			}
			loadFile(ListTitleFiles[0], 0);
		});
}

function loadPrev() {
	console.log("Prev");
	titleFileURL = getURLParam("t");
	//console.log(Articles[titleFileURL]);
	indexFile = Object.keys(Articles).indexOf(titleFileURL);
	if (indexFile > 0)
		indexFile--;
	if (ListTitleFiles.length > 0) {
		//console.log(ListFiles[indexFile]);
		loadFile(ListTitleFiles[indexFile], indexFile);
	}
}

function loadNext() {
	console.log("Next");
	titleFileURL = getURLParam("t");
	//console.log(Articles[titleFileURL]);
	indexFile = Object.keys(Articles).indexOf(titleFileURL);
	if (indexFile < ListFiles.length - 1)
		indexFile++;
	if (ListTitleFiles.length > 0) {
		//console.log(ListFiles[indexFile]);
		loadFile(ListTitleFiles[indexFile], indexFile);
	}
}

function getURLParam(strNameParam) {
	const urlSearchParams = new URLSearchParams(window.location.search);
	const params = Object.fromEntries(urlSearchParams.entries());
	return params[strNameParam];
}

function loadFile(titleFile, index, event) {
	if (event) {
		updateevent.preventDefault();
	}
	//console.log(titleFile, index, ListFiles.length);
	$('.mdl-layout__drawer').attr("class", "mdl-layout__drawer");
	$('.mdl-layout__obfuscator').attr("class", "mdl-layout__obfuscator");
	$('.page-title').html(titleFile);
	article = renderArticle(Articles[titleFile]);
	$('.page-content').html(`<i id = 'top' ></i>` + article);
	history.pushState({}, null, "/sathyavedapusthakam/?t=" + titleFile);
	if (index == 0) {
		$('.mdl-paging__prev').css("visibility", "hidden");
	} else {
		$('.mdl-paging__prev').css("visibility", "visible");
	}
	if (index == ListFiles.length - 1) {
		$('.mdl-paging__next').css("visibility", "hidden");
	} else {
		$('.mdl-paging__next').css("visibility", "visible");
	}
}

function renderChapter(indexChapter, objectJSON) {
	chapter = "";
	$.each(objectJSON, function (key, value) {
		if (isNaN(key)) {
			chapter += `<div class="chapterTitle">` + key + `</div>`+renderChapter(indexChapter, value);
		} else if (value != "") {
			indexVerse += 1;
   //console.log(indexChapter, indexVerse);
			chapter += `<tr><td style = 'text-align: right; font-size: small'>` + indexChapter + `.<td style = 'text-align: right;font-size: small'>` + indexVerse + ".</td><td>" + value + "</td></tr>";
		}
	});
	return chapter;
}

function renderArticle(objectJSON) {
	article = "";
	$.each(objectJSON, function (key, value) {
		if (isNaN(key)) {
			article += `<div class="bookTitle">` + key + `</div>` + renderArticle(value);
		} else {
			indexVerse = 0;
			article += `<div class="chapterId">` + `അദ്ധ്യായം ` + key + `</div>` + `<table>`+renderChapter(key, value)+`</table>`;
		}
	});
	return article;
}
