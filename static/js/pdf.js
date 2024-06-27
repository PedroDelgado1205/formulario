document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pdfName = urlParams.get('pdf');
    let pdfDoc = null;
    let pageNum = 1;
    let pageRendering = false;
    let pageNumPending = null;
    const scale = 1.5;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    console.log(pdfName);
    
    if (pdfName) {
        loadPDF(`./static/pdf/${pdfName}`);
    } else {
        console.error('No se encontró el archivo PDF');
    }
        // Actualizar el enlace de descarga
        document.getElementById('downloadPDF').href = `./static/pdf/${pdfName}`;
        
        // Ver PDF
        function loadPDF(pdfPath) {
            var pdfjsLib = window['pdfjs-dist/build/pdf'];
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.worker.min.js';
        
            var loadingTask = pdfjsLib.getDocument(pdfPath);
            loadingTask.promise.then(function (pdf) {
                console.log('PDF cargado');
                pdfDoc = pdf;
                document.getElementById('pageCount').textContent = pdf.numPages;
                renderPage(pageNum);
            }, function (reason) {
                console.error(reason);
            });
        }
        
        function renderPage(num) {
            pageRendering = true;
            pdfDoc.getPage(num).then(function (page) {
                var viewport = page.getViewport({ scale: scale });
                canvas.height = viewport.height;
                canvas.width = viewport.width;
        
                var renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                };
                var renderTask = page.render(renderContext);
        
                renderTask.promise.then(function () {
                    pageRendering = false;
                    if (pageNumPending !== null) {
                        renderPage(pageNumPending);
                        pageNumPending = null;
                    }
                });
        
                document.querySelector('.pdf-view').innerHTML = '';
                document.querySelector('.pdf-view').appendChild(canvas);
            });
        
            document.getElementById('pageNum').textContent = num;
        }
    
        function queueRenderPage(num) {
            if (pageRendering) {
                pageNumPending = num;
            } else {
                renderPage(num);
            }
        }
        
        function onPrevPage() {
            if (pageNum <= 1) {
                return;
            }
            pageNum--;
            queueRenderPage(pageNum);
        }
        
        function onNextPage() {
            if (pageNum >= pdfDoc.numPages) {
                return;
            }
            pageNum++;
            queueRenderPage(pageNum);
        }
        
        document.getElementById('prevPage').addEventListener('click', onPrevPage);
        document.getElementById('nextPage').addEventListener('click', onNextPage);
});
