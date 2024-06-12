var id = "";
// Encontrar los componentes necesarios y encerrarlos en variables
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
    const btnPrincipal = document.getElementById('btn-Principal');
    var mostrar = 0;

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
        this.id = codigo;
        if (numero && codigo && fecha == null || ''){
            mostrar = 0;
        } else {
            if (mostrar == 0) {
                mostrar = 1;
        
                // Realiza una solicitud al servidor Express para comparar los datos
                fetch('/comparar-datos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ numero, codigo, fecha })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.match) {
                        // Si hay coincidencia en la base de datos, muestra el formulario 3
                        form3.style.display = 'block';
                        // Actualiza datos en la tabla
                        document.querySelector('.td-cuerpo b').innerText = data.data['titular'];
                        document.querySelectorAll('.td-cuerpo b')[1].innerText = 'Ministerio del Poder Popular para la Educacion Universitaria';
                        document.querySelectorAll('.td-cuerpo b')[2].innerHTML = 'Cartificacion Electronica de Firma de Autoridad para<br>Titulo en Pergamino';
                        document.querySelectorAll('.td-cuerpo b')[3].innerText = 'YOLANDA AURIMAR MELENDEZ MORO';
                    } else {
                        // Si no hay coincidencia, muestra un mensaje al usuario
                        //alert('Los datos ingresados no coinciden con los registros en la base de datos.');
                        $('#exampleModal2').modal('show');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    // Muestra un mensaje de error al usuario
                    alert('Se produjo un error al procesar la solicitud.');
                });
            }else if (mostrar == 1) {
                mostrar = 0;
                form3.style.display = 'none';
            }
        }
    });

    // Consultar en Formulario 2
    // buscar.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     alert('El archivo a cargar debe ser formato PDF y corresponder a un documento de Apostilla Electrónica emitido y firmado electrónicamente desde el Sistema de Legalización y Apostilla Electrónica')
    // });

    // Ver PDF
verPDF.addEventListener('click', (e) => {
    e.preventDefault();
    form3.style.display = 'none';
    form1.style.display = 'none';
    pdfViewer.style.display = 'block';

    // Aquí debes actualizar la ruta del PDF en el iframe, debes ingresarlos dentro de la carpeta llamada pdf
    const pdfDiv = document.querySelector('.pdf-view');
    pdfDiv.innerHTML = '<iframe id="pdfIframe" width="100%" height="600px"></iframe>';
    
    // Mostrar el PDF y el contador de descargas
    showPdf(this.id);
});

function showPdf(recordId) {
    document.getElementById('pdfViewer').style.display = 'block';
    document.getElementById('pdfIframe').src = `/descargas-pdf/${recordId}`;
    
    // Obtener el contador de descargas
    fetch(`/descargas-contador/${recordId}`)
        .then(response => response.json())
        .then(data => {
            //document.getElementById('downloadCount').innerText = data.count;
            console.log("Número de veces consultado el PDF: ", data.count)
        })
        .catch(error => {
            console.error('Error al obtener el contador de descargas:', error);
        });
}


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
