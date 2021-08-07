///////////////////////////////// SELECT TEXT ////////////////////////////////

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
			console.log('copy text func activated');
			let thetext = getSelectionText();

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
				thetext = ""
			}

		}
	});

}
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////// MODAL & EVENT ///////////////////////////////

if (typeof modal_x === 'undefined') {
	let modal_x = 0;
	let modal_y = 0;

	let styleString = `.chrome-extension-modal-content{background-color:#fcf49d;border-radius:15px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);margin:auto;position:absolute;z-index:999998;padding:5px;border:1px solid #888;width:32rem;justify-content:center;align-items:center;overflow:auto;max-height:40rem}.chrome-extension-modal-content p{padding:30px;font-size:15px;font-family:Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif}.chrome-extension-modal-loading{display:flex;justify-content:center;align-items:center}.chrome-extension-modal-loading .dot{position:relative;width:.5em;height:.5em;margin:.3em;border-radius:50%;padding:0}.chrome-extension-modal-loading .dot::before{position:absolute;content:"";width:100%;height:100%;background:inherit;border-radius:inherit;animation:wave 2s ease-out infinite}.chrome-extension-modal-loading .dot:nth-child(1){background:#7ef9ff}.chrome-extension-modal-loading .dot:nth-child(1)::before{animation-delay:.2s}.chrome-extension-modal-loading .dot:nth-child(2){background:#89cff0}.chrome-extension-modal-loading .dot:nth-child(2)::before{animation-delay:.4s}.chrome-extension-modal-loading .dot:nth-child(3){background:#4682b4}.chrome-extension-modal-loading .dot:nth-child(3)::before{animation-delay:.6s}.chrome-extension-modal-loading .dot:nth-child(4){background:#0f52ba}.chrome-extension-modal-loading .dot:nth-child(4)::before{animation-delay:.8s}.chrome-extension-modal-loading .dot:nth-child(5){background:navy}.chrome-extension-modal-loading .dot:nth-child(5)::before{animation-delay:1s}@keyframes wave{50%,75%{transform:scale(2.5)}100%,80%{opacity:0}}.chrome-extension-close{    background-color: transparent;
        border: 0px;float:right;font-size:28px;font-weight:700;}.chrome-extension-close:hover{ color: red;cursor:pointer }.close:focus,.close:hover{text-decoration:none;}.column { float: left;padding: 5px;}.row{margin-left: 25px;}.row::after { content: ""; clear: both; display: inline;}hr{margin-left: 30px;margin-right: 30px;} figcaption{font-size: 15px} `;
	let modal_inner_html_string = `<button class="chrome-extension-close">&times;</button> <br> `;
	let modal_html_string = `<div class="chrome-extension-modal-content" >` + modal_inner_html_string + ` </div> `;

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
				console.log("null");
				let modal_element = createElementFromHTML(modal_html_string);
				document.body.append(modal_element);
			}

			else {
				modal_content.innerHTML = "<button class='chrome-extension-close'>&times;</button>" + "<p>" + request.content + "</p>";
			}
			var span = document.getElementsByClassName("chrome-extension-close")[0];
			span.onclick = function () {
				chrome.storage.local.set({
					in_progress: false
				}, function () {
				});
				modal_content.style.display = "none";
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











