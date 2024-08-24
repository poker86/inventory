function showMessage(message) {
    const debugMessage = document.getElementById('debug-message');
    if (debugMessage) {
        debugMessage.style.display = 'block';
        debugMessage.textContent = message;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.getElementById('barcode-scanner');
    const startScanBtn = document.getElementById('startScanBtn');
    const scannerContainer = document.getElementById('scanner-container');

    startScanBtn.addEventListener('click', () => {
        showMessage("Start Scan button clicked.");

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            Quagga.init({
                inputStream: {
                    type: "LiveStream",
                    target: videoElement,
                    constraints: {
                        facingMode: "environment" // Use the back camera
                    }
                },
                decoder: {
                    readers: ["code_128_reader", "ean_reader", "ean_8_reader"]
                }
            }, (err) => {
                if (err) {
                    showMessage("Error initializing QuaggaJS: " + err);
                    console.error("Error initializing QuaggaJS:", err);
                    return;
                }
                showMessage("QuaggaJS initialized, starting video stream.");
                Quagga.start();
                startScanBtn.style.display = 'none';
                scannerContainer.classList.remove('is-hidden');
            });

            Quagga.onDetected((result) => {
                const barcode = result.codeResult.code;
                showMessage('Barcode detected: ' + barcode);
                console.log('Barcode detected:', barcode);

                // Automatically focus the input field associated with the detected barcode
                const matchedRow = document.querySelector(`tr[data-barcode="${barcode}"]`);
                if (matchedRow) {
                    const input = matchedRow.querySelector('input');
                    if (input) {
                        input.focus();
                        showMessage('Focused on input field for barcode: ' + barcode);
                    }
                }
            });
        } else {
            showMessage("getUserMedia not supported or HTTPS required.");
            console.error("getUserMedia not supported in this browser.");
        }
    });
});
