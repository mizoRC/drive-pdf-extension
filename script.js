// This function inserts our generatePDF function into the page's code
function insertScript() {
	// This selects the focused tab for the operation and passes the generatePDF function
	chrome.tabs.query({active: true, currentWindow: true}, tabs => {
		const tabId = tabs[0].id;
		// chrome.scripting.executeScript({target: {tabId: tabId}, files: ['./jspdf.min.js']}, () => {
			chrome.scripting.executeScript({target: {tabId: tabId}, function: generatePDF});
		// });
	});


	// This closes the extension pop-up to select the website search bar
	window.close();
}
	
// This is an event listener that detects clicks on our "Start Random Search" button
document.getElementById('buttonTwo').addEventListener('click', insertScript)
	
// This function selects a random topic from an array and 
function generatePDF() {
	let docName = "";
	try {
		const jsonString = document.getElementById("drive-active-item-info").innerHTML;
		const body = JSON.parse(jsonString);
		if (body?.title !== "") docName = body.title;
		else docName = "download.pdf"
	} catch (error) {
		docName = "download.pdf"
	}
	// console.log('DOCNAME => ', docName);

	let pdf = new jsPDF();
	let elements = document.getElementsByTagName( "img" );
	for ( let i in elements) {
		let img = elements[i];
		if (!/^blob:/.test(img.src)) {
			continue ;
		}
		let canvasElement = document.createElement( 'canvas' );
		let con = canvasElement.getContext( "2d" );
		canvasElement.width = img.width;
		canvasElement.height = img.height;
		con.drawImage(img, 0, 0,img.width, img.height);
		let imgData = canvasElement.toDataURL( "image/jpeg" , 1.0);
		pdf.addImage(imgData, 'JPEG' , 0, 0);
		pdf.addPage();
	}
	pdf.save(docName);

	// chrome.runtime.sendMessage('PDF guardado correctamente como ' + docName + '!');

	/*chrome.notifications.create({
		type: 'basic',
		// iconUrl: './icon128.png',
		title: 'Drive PDF download',
		message: 'PDF guardado correctamente!',
		priority: 0
	});*/
}