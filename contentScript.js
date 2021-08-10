let today = new Date().toLocaleString();

//////////////////////////////// SELECT TEXT ////////////////////////////////

function getSelectionText() {
	var text = "";
	if (window.getSelection) {
		text = window.getSelection().toString();
	} else if (document.selection && document.selection.type != "Control") {
		text = document.selection.createRange().text;
	}
	return text;
}
//////////////////////////////////////////////////////////////////////////////

///////////////////////////////// COPY TEXT //////////////////////////////////

function copyText() {
	chrome.storage.sync.get('isRunning', function (data) {
		var isRunning = data.isRunning;
		if (isRunning) {
			var thetext = getSelectionText();

			if (thetext.length > 0) {
				chrome.storage.sync.get('text', function (data) {
					var temp = data.text;
					var newText = temp + thetext + "\n";
					chrome.storage.sync.set({ 'text': newText });
					console.log(newText);
					listener({ 'name': "create_window", 'content': newText });
					listener({ 'name': "create_window", 'content': newText });


				});

			}
			else {
				thetext = "";
			}

		}
	});

}
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////// MODAL & EVENT ///////////////////////////////
let myId = chrome.runtime.id;
if (typeof modal_x === 'undefined') {
	let modal_x = 0;
	let modal_y = 0;

	let styleString = `.chrome-extension-modal-content{background-color:#fcf49d;border-radius:15px;
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		width: 32rem;border:1px solid #888;	position:absolute;overflow:auto; }
		.content{margin:auto;z-index:999998;width: 100%;justify-content:center;align-items:center;overflow:auto;max-height:35rem; }
		.copur-header{background-color: #f7e461;width: 100%;height: 30px;text-align-last: left;padding-top: 5px;font-size: 15px;}
		.title{padding-left: 20px;font-weight: 300;}
	.chrome-extension-modal-content p{padding:30px;font-size:15px;font-family:Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif}
	.chrome-extension-close{background-color: transparent; border: 0px;float:right;font-size:35px;font-weight:700; position: absolute;top:-5px;right: 0px;}
	.chrome-extension-close:hover{ color: red;cursor:pointer }.close:focus,.close:hover{text-decoration:none;}
	.column { float: left;padding: 5px;}
	.row{margin-left: 25px;}.row::after { content: ""; clear: both; display: inline;}
	hr{margin-left: 30px;margin-right: 30px;}
	figcaption{font-size: 15px}
	.copy{background-color: transparent;border: 0px;position: absolute;top: 5px;right: 35px;}
	.copy:hover{cursor: pointer;} 
	.eraser{border: 0px;position: absolute;top: 5px;right: 65px;} .eraser:hover{cursor:pointer}`;
	let modal_inner_html_string = `<button class="chrome-extension-close">&times;</button>`;
	let modal_html_string = `<div class="chrome-extension-modal-content" ><div class="copur-header"> <span class="title">Rupok</span> </div>` + modal_inner_html_string + `<div class="content"></div> </div> `;

	const dragElement = function (elmnt) {
		var pos1 = 0,
			pos2 = 0,
			pos3 = 0,
			pos4 = 0;
		elmnt.onmousedown = dragMouseDown;
		elmnt.style.left = modal_x + "px";
		elmnt.style.top = modal_y + "px";

		function dragMouseDown(e) {
			e = e || window.event;
			e.preventDefault();
			pos3 = e.clientX;
			pos4 = e.clientY;
			document.onmouseup = closeDragElement;
			document.onmousemove = elementDrag;
		}

		function elementDrag(e) {
			e = e || window.event;
			e.preventDefault();
			pos1 = pos3 - e.clientX;
			pos2 = pos4 - e.clientY;
			pos3 = e.clientX;
			pos4 = e.clientY;
			elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
			elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
		}

		function closeDragElement() {
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}

	const createElementFromHTML = function (htmlString) {
		var div = document.createElement('div');
		div.innerHTML = htmlString.trim();
		return div.firstChild;
	}
	const addStyle = function (styleString) {
		const style = document.createElement('style');
		style.textContent = styleString;
		document.head.append(style);
	}
	var listener = function (request, options, sendResponse) {

		if (request.name == "create_window") {

			addStyle(styleString);
			modal_content = document.getElementsByClassName("chrome-extension-modal-content")[0];
			if (modal_content == null) {
				let modal_element = createElementFromHTML(modal_html_string);
				console.log(modal_element);
				document.body.append(modal_element);
			}

			else {
				modal_content.innerHTML = "<div class='copur-header'> <span class='title'>" +
					today + "</span> </div>" + "<img src='chrome-extension://" + myId + "/images/eraser_1.png' class='eraser' style='height: 20px;'>" +
					"<img src='chrome-extension://" + myId + "/images/copy.png' class='copy' style='height: 20px;'><button class='chrome-extension-close'>&times;</button>" +
					"<div class='content'>" + "<p id='copuR'>" + request.content + "</p>" + "</div>";



			}
			var span = document.getElementsByClassName("chrome-extension-close")[0];
			span.onclick = function () {
				modal_content.style.display = "none";
			};

			var copyButton = document.getElementsByClassName("copy")[0];
			copyButton.onclick = function () {
				navigator.clipboard.writeText(request.content);
			};

			var copyButton = document.getElementsByClassName("eraser")[0];
			copyButton.onclick = function () {
				modal_content.innerHTML = "<div class='copur-header'> <span class='title'>" +
					today + "</span> </div>" + "<img src='chrome-extension://" + myId + "/images/eraser_1.png' class='eraser' style='height: 20px;'>" +
					"<img src='chrome-extension://" + myId + "/images/copy.png' class='copy' style='height: 20px;'><button class='chrome-extension-close'>&times;</button>" +
					"<div class='content'>" + "<p id='copuR'>" + " " + "</p>" + "</div>";
				chrome.storage.sync.set({ 'text': " " });
			};

			var modal_content = document.getElementsByClassName("chrome-extension-modal-content")[0];
			modal_content.style.display = "block";
			dragElement(modal_content);
		}
		return true;
	}

	document.addEventListener('pointerup', function (event) {

		modal_x = event.pageX;
		modal_y = event.pageY + 100;
		copyText();

	});
	// document.addEventListener("keydown", function (event) {
	// 	if (event.keyCode == 192) {
	// 		copyText();
	// 	}
	// });



}

////////////////////////////////////////////////////////////////////////////////

