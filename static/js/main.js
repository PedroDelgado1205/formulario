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


    
    // Evento para ver PDF
verPDF.addEventListener('click', (e) => {
    e.preventDefault();
    
    e.preventDefault();
    const pdfName = resultado['pdf']; 
    window.location.href = `pdf_view.html?pdf=${pdfName}`;
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
        window.location.href = 'index.html';
    });
});
