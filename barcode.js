function showMessage(message) {
    const debugMessage = document.getElementById('debug-message');
    debugMessage.style.display = 'block';
    debugMessage.textContent = message;
}

document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.getElementById('barcode-scanner');
    const startScanBtn = document.getElementById('startScanBtn');
    const scannerContainer = document.getElementById('scanner-container');

    startScanBtn.addEventListener('click', () => {
        showMessage("Start Scan button clicked.");

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
            startScanBtn.classList.add('is-hidden');
            scannerContainer.classList.remove('is-hidden');
        });
    });

    Quagga.onDetected((result) => {
        showMessage('Barcode detected: ' + result.codeResult.code);

        const matchedRow = document.querySelector(`tr[data-barcode="${result.codeResult.code}"]`);
        if (matchedRow) {
            const input = matchedRow.querySelector('input');
            if (input) {
                input.focus();
            }
        }
    });
});
