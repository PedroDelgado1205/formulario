document.addEventListener('DOMContentLoaded', () => {
    const form1 = document.getElementById('form1');
    const form2 = document.getElementById('form2');
    const form3 = document.getElementById('form3');
    const pdfViewer = document.getElementById('pdfViewer');

    const link1 = document.getElementById('link1');
    const link2 = document.getElementById('link2');
    const verPDF = document.getElementById('verPDF');
    const limpiar = document.getElementById('limpiar');
    const volver = document.getElementById('volver');
    var mostrar = 0;
    let resultado = []
    let datos = [];

    let pdfDoc = null;
    let pageNum = 1;
    let pageRendering = false;
    let pageNumPending = null;
    const scale = 1.5;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');


    // Cargar los datos desde datos.json
    fetch('./static/data/datos.json')
        .then(response => response.json())
        .then(data => {
            datos = data;
        })
        .catch(error => {
            console.error('Error al cargar datos:', error);
        });

    // Cambiar a Formulario 2
    link1.addEventListener('click', (e) => {
        e.preventDefault();
        form1.style.display = 'none';
        form3.style.display = 'none';
        form2.style.display = 'block';
    });

    // Cambiar a Formulario 1
    link2.addEventListener('click', (e) => {
        e.preventDefault();
        form2.style.display = 'none';
        form1.style.display = 'block';
    });

    // Consultar en Formulario 1
    form1.addEventListener('submit', (e) => {
        e.preventDefault();
        const numero = document.getElementById('numero').value;
        const codigo = document.getElementById('codigo').value;
        const fecha = document.getElementById('fecha').value;
        id = codigo;

        if (!numero || !codigo || !fecha) {
            mostrar = 0;
        } else {
            if (mostrar == 0) {
                mostrar = 1;

                // Buscar datos en el archivo datos.json
                resultado = datos.find(dato => dato.numero === numero && dato.codigo === codigo && dato.fecha === fecha);

                if (resultado) {
                    // Si hay coincidencia, muestra el formulario 3 y actualiza los datos en la tabla
                    form3.style.display = 'block';
                    document.querySelector('.td-cuerpo b').innerText = resultado.titular;
                } else {
                    // Si no hay coincidencia, muestra un mensaje al usuario
                    $('#errorBD').modal('show');
                }
            } else if (mostrar == 1) {
                mostrar = 0;
                form3.style.display = 'none';
            }
        }
    });

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
    
    // Evento para ver PDF
verPDF.addEventListener('click', (e) => {
    e.preventDefault();
    form3.style.display = 'none';
    form1.style.display = 'none';
    pdfViewer.style.display = 'block';

    // Aquí debes actualizar la ruta del PDF en el iframe
    loadPDF(`./static/pdf/${resultado['pdf']}`);

    // Actualizar el enlace de descarga
    document.getElementById('downloadPDF').href = `./static/pdf/${resultado['pdf']}`;
});

    
    // Limpiar resultados
    limpiar.addEventListener('click', (e) => {
        e.preventDefault();
        const numero = document.getElementById('numero');
        const codigo = document.getElementById('codigo');
        const fecha = document.getElementById('fecha');
        numero.value = '';
        codigo.value = '';
        fecha.value = '';
        form3.style.display = 'none';
        form1.style.display = 'block';
    });

    // Volver desde PDF
    volver.addEventListener('click', (e) => {
        e.preventDefault();
        pdfViewer.style.display = 'none';
        form3.style.display = 'block';
        form1.style.display = 'block';
    });
});
