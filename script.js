/* =========================================================
   CONTAOBRA PERÚ
   SCRIPT PRINCIPAL
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTOS PRINCIPALES
       ===================================================== */

    const pantallaRegistro = document.getElementById("pantallaRegistro");
    const pantallaBienvenida = document.getElementById("pantallaBienvenida");
    const panelPrincipal = document.getElementById("panelPrincipal");
    const pantallaModulo = document.getElementById("pantallaModulo");

    const btnRegistrar = document.getElementById("btnRegistrar");
    const btnComenzar = document.getElementById("btnComenzar");
    const btnVolver = document.getElementById("btnVolver");
    const btnListo = document.getElementById("btnListo");

    const formularioModulo = document.getElementById("formularioModulo");
    const cabeceraFormulario = document.getElementById("cabeceraFormulario");

    const vistaFormulario = document.getElementById("vistaFormulario");
    const vistaDocumento = document.getElementById("vistaDocumento");

    const documentoGenerado = document.getElementById("documentoGenerado");

    const btnVolverFormulario =
        document.getElementById("btnVolverFormulario");

    const btnGuardarDocumento =
        document.getElementById("btnGuardarDocumento");

    const btnGenerarPDF =
        document.getElementById("btnGenerarPDF");

    const btnExportarExcel =
        document.getElementById("btnExportarExcel");

    const mensajeRegistro =
        document.getElementById("mensajeRegistro");

    const nombreUsuario =
        document.getElementById("nombreUsuario");

    const fechaActual =
        document.getElementById("fechaActual");


    /* =====================================================
       DATOS
       ===================================================== */

    let moduloActual = null;

    let operaciones = [];

    let datosUsuario = null;


    /* =====================================================
       CONFIGURACIÓN DE MÓDULOS
       ===================================================== */

    const modulos = {

        ingresos: {
            titulo: "Registro de Ingresos",
            subtitulo: "Formato Caja y Bancos 1.1",
            tipo: "INGRESOS"
        },

        egresos: {
            titulo: "Registro de Egresos",
            subtitulo: "Formato Caja y Bancos 1.2",
            tipo: "EGRESOS"
        },

        compras: {
            titulo: "Registro de Compras",
            subtitulo: "Formato SUNAT 8.1",
            tipo: "COMPRAS"
        },

        ventas: {
            titulo: "Registro de Ventas e Ingresos",
            subtitulo: "Formato SUNAT 14.1",
            tipo: "VENTAS"
        },

        diario: {
            titulo: "Libro Diario",
            subtitulo: "Formatos SUNAT 5.1 / 5.2",
            tipo: "DIARIO"
        },

        mayor: {
            titulo: "Libro Mayor",
            subtitulo: "Movimientos por cuenta",
            tipo: "MAYOR"
        },

        inventario: {
            titulo: "Inventario y Balances",
            subtitulo: "Formatos 3.1 al 3.20",
            tipo: "INVENTARIO"
        },

        planilla: {
            titulo: "Planilla de Remuneraciones",
            subtitulo: "T-Registro / PLAME",
            tipo: "PLANILLA"
        },

        obras: {
            titulo: "Gestión de Obras Civiles",
            subtitulo: "Control de proyectos",
            tipo: "OBRAS"
        },

        reportes: {
            titulo: "Reportes Contables",
            subtitulo: "Información financiera",
            tipo: "REPORTES"
        },

        nova: {
            titulo: "Nova IA",
            subtitulo: "Asistente contable de CONTAOBRA",
            tipo: "NOVA"
        },

        configuracion: {
            titulo: "Configuración",
            subtitulo: "Preferencias y seguridad",
            tipo: "CONFIGURACION"
        },

        empresa: {
            titulo: "Datos de la Empresa",
            subtitulo: "Información empresarial",
            tipo: "EMPRESA"
        }

    };


    /* =====================================================
       FUNCIONES DE PANTALLAS
       ===================================================== */

    function mostrarPantalla(pantalla) {

        [
            pantallaRegistro,
            pantallaBienvenida,
            panelPrincipal,
            pantallaModulo
        ].forEach(p => {

            if (p) {
                p.classList.add("oculto");
            }

        });

        if (pantalla) {
            pantalla.classList.remove("oculto");
        }
    }


    /* =====================================================
       INICIO
       ===================================================== */

    // FORZAMOS EL REGISTRO AL ENTRAR
    mostrarPantalla(pantallaRegistro);


    /* =====================================================
       REGISTRO
       ===================================================== */

    if (btnRegistrar) {

        btnRegistrar.addEventListener("click", () => {

            const nombre =
                document.getElementById("registroNombre").value.trim();

            const correo =
                document.getElementById("registroCorreo").value.trim();

            const tipoDocumento =
                document.getElementById("registroTipoDocumento").value;

            const documento =
                document.getElementById("registroDocumento").value.trim();

            const usuario =
                document.getElementById("registroUsuario").value.trim();

            const password =
                document.getElementById("registroPassword").value;

            const confirmar =
                document.getElementById("registroConfirmar").value;


            if (
                !nombre ||
                !correo ||
                !documento ||
                !usuario ||
                !password ||
                !confirmar
            ) {

                mostrarMensaje(
                    "Completa todos los campos para continuar."
                );

                return;
            }


            if (password.length < 6) {

                mostrarMensaje(
                    "La contraseña debe tener mínimo 6 caracteres."
                );

                return;
            }


            if (password !== confirmar) {

                mostrarMensaje(
                    "Las contraseñas no coinciden."
                );

                return;
            }


            if (!validarDocumento(tipoDocumento, documento)) {

                mostrarMensaje(
                    tipoDocumento === "DNI"
                        ? "El DNI debe tener 8 números."
                        : "El RUC debe tener 11 números."
                );

                return;
            }


            datosUsuario = {

                nombre,
                correo,
                tipoDocumento,
                documento,
                usuario

            };


            // Guardamos solamente datos básicos.
            // NO guardamos la contraseña.

            localStorage.setItem(
                "contaobra_usuario",
                JSON.stringify(datosUsuario)
            );


            nombreUsuario.textContent = nombre;


            // Limpiar formulario

            document.getElementById("registroNombre").value = "";
            document.getElementById("registroCorreo").value = "";
            document.getElementById("registroDocumento").value = "";
            document.getElementById("registroUsuario").value = "";
            document.getElementById("registroPassword").value = "";
            document.getElementById("registroConfirmar").value = "";


            ocultarMensaje();


            // Después del registro
            mostrarPantalla(pantallaBienvenida);

        });

    }


    /* =====================================================
       VALIDAR DNI / RUC
       ===================================================== */

    function validarDocumento(tipo, numero) {

        const soloNumeros = numero.replace(/\D/g, "");

        if (tipo === "DNI") {
            return soloNumeros.length === 8;
        }

        if (tipo === "RUC") {
            return soloNumeros.length === 11;
        }

        return false;
    }


    /* =====================================================
       MENSAJES
       ===================================================== */

    function mostrarMensaje(texto) {

        if (!mensajeRegistro) return;

        mensajeRegistro.textContent = texto;
        mensajeRegistro.classList.remove("oculto");
        mensajeRegistro.classList.add("mensaje-error");

    }


    function ocultarMensaje() {

        if (!mensajeRegistro) return;

        mensajeRegistro.textContent = "";
        mensajeRegistro.classList.add("oculto");

    }


    /* =====================================================
       COMENZAR
       ===================================================== */

    if (btnComenzar) {

        btnComenzar.addEventListener("click", () => {

            mostrarPantalla(panelPrincipal);

            actualizarFecha();

        });

    }


    /* =====================================================
       FECHA
       ===================================================== */

    function actualizarFecha() {

        if (!fechaActual) return;

        const fecha = new Date();

        fechaActual.textContent =
            fecha.toLocaleDateString("es-PE", {

                day: "2-digit",
                month: "2-digit",
                year: "numeric"

            });

    }


    /* =====================================================
       ABRIR MÓDULOS
       ===================================================== */

    const tarjetasModulo =
        document.querySelectorAll("[data-modulo]");


    tarjetasModulo.forEach(tarjeta => {

        tarjeta.addEventListener("click", () => {

            const modulo =
                tarjeta.getAttribute("data-modulo");

            abrirModulo(modulo);

        });

    });


    /* =====================================================
       ABRIR MÓDULO
       ===================================================== */

    function abrirModulo(modulo) {

        moduloActual = modulo;

        operaciones = [];

        const configuracion = modulos[modulo];

        if (!configuracion) return;


        mostrarPantalla(pantallaModulo);


        vistaFormulario.classList.remove("oculto");
        vistaDocumento.classList.add("oculto");


        cabeceraFormulario.innerHTML = `

            <div class="titulo-modulo">

                <p class="etiqueta">
                    ${configuracion.tipo}
                </p>

                <h1>
                    ${configuracion.titulo}
                </h1>

                <p>
                    ${configuracion.subtitulo}
                </p>

            </div>

        `;


        generarFormulario();

    }


    /* =====================================================
       FORMULARIO DE OPERACIÓN
       ===================================================== */

    function generarFormulario() {

        formularioModulo.innerHTML = "";


        const contenedor =
            document.createElement("div");

        contenedor.className =
            "contenedor-operaciones";


        const titulo =
            document.createElement("div");

        titulo.className =
            "titulo-operacion";

        titulo.innerHTML = `

            <span>📋</span>

            <div>

                <h2>
                    Datos de la operación
                </h2>

                <p>
                    Completa todos los datos correspondientes.
                </p>

            </div>

        `;


        contenedor.appendChild(titulo);


        const primeraOperacion =
            crearCuadroOperacion(1);


        contenedor.appendChild(
            primeraOperacion
        );


        const botonAgregar =
            document.createElement("button");

        botonAgregar.type = "button";

        botonAgregar.className =
            "btn-anadir-operacion";

        botonAgregar.textContent =
            "+ Añadir más operaciones";


        botonAgregar.addEventListener(
            "click",
            () => {

                const numero =
                    contenedor.querySelectorAll(
                        ".cuadro-operacion"
                    ).length + 1;


                const nueva =
                    crearCuadroOperacion(numero);


                contenedor.insertBefore(
                    nueva,
                    botonAgregar
                );

            }
        );


        contenedor.appendChild(
            botonAgregar
        );


        formularioModulo.appendChild(
            contenedor
        );

    }


    /* =====================================================
       CREAR CUADRO DE OPERACIÓN
       ===================================================== */

    function crearCuadroOperacion(numero) {

        const cuadro =
            document.createElement("div");

        cuadro.className =
            "cuadro-operacion";


        cuadro.innerHTML = `

            <div class="encabezado-operacion">

                <div>

                    <span class="numero-operacion">
                        ${numero}
                    </span>

                    <strong>
                        Operación ${numero}
                    </strong>

                </div>

            </div>


            <div class="grid-formulario">


                <!-- FECHA -->

                <div class="campo-formulario">

                    <label>
                        Fecha
                    </label>

                    <input
                        class="op-fecha"
                        type="date"
                    >

                </div>


                <!-- TIPO DOCUMENTO -->

                <div class="campo-formulario">

                    <label>
                        Tipo de documento
                    </label>

                    <select class="op-tipo-documento">

                        <option value="DNI">
                            DNI
                        </option>

                        <option value="RUC">
                            RUC
                        </option>

                    </select>

                </div>


                <!-- NUMERO DOCUMENTO -->

                <div class="campo-formulario">

                    <label>
                        DNI / RUC
                    </label>

                    <input
                        class="op-documento"
                        type="text"
                        inputmode="numeric"
                        placeholder="Número de DNI o RUC"
                    >

                </div>


                <!-- NOMBRE -->

                <div class="campo-formulario campo-completo">

                    <label>
                        Nombre / Razón social
                    </label>

                    <input
                        class="op-nombre"
                        type="text"
                        placeholder="Nombre de la persona o empresa"
                    >

                </div>


                <!-- TIPO COMPROBANTE -->

                <div class="campo-formulario">

                    <label>
                        Tipo de comprobante
                    </label>

                    <select class="op-comprobante">

                        <option value="">
                            Seleccionar
                        </option>

                        <option>
                            Factura
                        </option>

                        <option>
                            Boleta de venta
                        </option>

                        <option>
                            Recibo por honorarios
                        </option>

                        <option>
                            Nota de crédito
                        </option>

                        <option>
                            Nota de débito
                        </option>

                        <option>
                            Otro documento
                        </option>

                    </select>

                </div>


                <!-- SERIE -->

                <div class="campo-formulario">

                    <label>
                        Serie
                    </label>

                    <input
                        class="op-serie"
                        type="text"
                        placeholder="Ej. F001"
                    >

                </div>


                <!-- NUMERO -->

                <div class="campo-formulario">

                    <label>
                        Número
                    </label>

                    <input
                        class="op-numero"
                        type="text"
                        placeholder="Número"
                    >

                </div>


                <!-- DESCRIPCIÓN -->

                <div class="campo-formulario campo-completo">

                    <label>
                        Descripción de la operación
                    </label>

                    <input
                        class="op-descripcion"
                        type="text"
                        placeholder="Describe la operación realizada"
                    >

                </div>


                <!-- MONTO -->

                <div class="campo-formulario campo-monto">

                    <label>
                        Monto de la operación
                    </label>

                    <div class="input-moneda">

                        <span>
                            S/
                        </span>

                        <input
                            class="op-monto"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                        >

                    </div>

                </div>


                <!-- IGV -->

                <div class="campo-formulario">

                    <label>
                        IGV
                    </label>

                    <div class="input-calculado">

                        <span>
                            S/
                        </span>

                        <input
                            class="op-igv"
                            type="text"
                            value="0.00"
                            readonly
                        >

                    </div>

                </div>


                <!-- TOTAL -->

                <div class="campo-formulario">

                    <label>
                        Total
                    </label>

                    <div class="input-calculado total">

                        <span>
                            S/
                        </span>

                        <input
                            class="op-total"
                            type="text"
                            value="0.00"
                            readonly
                        >

                    </div>

                </div>


            </div>

        `;


        /* =================================================
           CALCULAR IGV
           ================================================= */

        const monto =
            cuadro.querySelector(".op-monto");

        const igv =
            cuadro.querySelector(".op-igv");

        const total =
            cuadro.querySelector(".op-total");


        monto.addEventListener(
            "input",
            () => {

                const valor =
                    parseFloat(monto.value) || 0;


                // IGV 18%

                const impuesto =
                    valor * 0.18;


                const totalOperacion =
                    valor + impuesto;


                igv.value =
                    impuesto.toFixed(2);


                total.value =
                    totalOperacion.toFixed(2);

            }
        );


        /* =================================================
           FECHA ACTUAL
           ================================================= */

        const fecha =
            cuadro.querySelector(".op-fecha");


        const hoy =
            new Date();


        const año =
            hoy.getFullYear();


        const mes =
            String(
                hoy.getMonth() + 1
            ).padStart(2, "0");


        const dia =
            String(
                hoy.getDate()
            ).padStart(2, "0");


        fecha.value =
            `${año}-${mes}-${dia}`;


        return cuadro;

    }


    /* =====================================================
       BOTÓN LISTO
       ===================================================== */

    if (btnListo) {

        btnListo.addEventListener(
            "click",
            () => {

                const cuadros =
                    document.querySelectorAll(
                        ".cuadro-operacion"
                    );


                operaciones = [];


                let correcto = true;


                cuadros.forEach(
                    (cuadro, indice) => {

                        const monto =
                            parseFloat(
                                cuadro.querySelector(
                                    ".op-monto"
                                ).value
                            ) || 0;


                        if (monto <= 0) {

                            correcto = false;

                            alert(
                                `Ingresa el monto de la operación ${indice + 1}.`
                            );

                            return;

                        }


                        const operacion = {

                            fecha:
                                cuadro.querySelector(
                                    ".op-fecha"
                                ).value,

                            tipoDocumento:
                                cuadro.querySelector(
                                    ".op-tipo-documento"
                                ).value,

                            documento:
                                cuadro.querySelector(
                                    ".op-documento"
                                ).value,

                            nombre:
                                cuadro.querySelector(
                                    ".op-nombre"
                                ).value,

                            comprobante:
                                cuadro.querySelector(
                                    ".op-comprobante"
                                ).value,

                            serie:
                                cuadro.querySelector(
                                    ".op-serie"
                                ).value,

                            numero:
                                cuadro.querySelector(
                                    ".op-numero"
                                ).value,

                            descripcion:
                                cuadro.querySelector(
                                    ".op-descripcion"
                                ).value,

                            monto: monto,

                            igv:
                                monto * 0.18,

                            total:
                                monto * 1.18

                        };


                        operaciones.push(
                            operacion
                        );

                    }
                );


                if (!correcto) return;


                generarDocumento();


                vistaFormulario.classList.add(
                    "oculto"
                );

                vistaDocumento.classList.remove(
                    "oculto"
                );

            }
        );

    }


    /* =====================================================
       GENERAR DOCUMENTO CONTABLE
       ===================================================== */

    function generarDocumento() {

        const config =
            modulos[moduloActual];


        const nombreEmpresa =
            datosUsuario
                ? datosUsuario.nombre
                : "CONTAOBRA PERÚ";


        let subtotal = 0;
        let igvTotal = 0;
        let totalGeneral = 0;


        operaciones.forEach(op => {

            subtotal += op.monto;
            igvTotal += op.igv;
            totalGeneral += op.total;

        });


        const filas =
            operaciones.map(
                (op, index) => `

                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${formatearFecha(op.fecha)}
                    </td>

                    <td>
                        ${op.tipoDocumento}
                    </td>

                    <td>
                        ${op.documento || "-"}
                    </td>

                    <td>
                        ${op.nombre || "-"}
                    </td>

                    <td>
                        ${op.comprobante || "-"}
                    </td>

                    <td>
                        ${op.serie || "-"}
                    </td>

                    <td>
                        ${op.numero || "-"}
                    </td>

                    <td>
                        ${op.descripcion || "-"}
                    </td>

                    <td class="numero">
                        S/ ${op.monto.toFixed(2)}
                    </td>

                    <td class="numero">
                        S/ ${op.igv.toFixed(2)}
                    </td>

                    <td class="numero">
                        S/ ${op.total.toFixed(2)}
                    </td>

                </tr>

            `
            ).join("");


        documentoGenerado.innerHTML = `

            <div class="documento-contable">


                <!-- CABECERA EMPRESA -->

                <div class="documento-cabecera">

                    <div>

                        <div class="documento-marca">
                            🏗️ CONTAOBRA PERÚ
                        </div>

                        <strong>
                            ${escaparHTML(nombreEmpresa)}
                        </strong>

                        <p>
                            Registro contable empresarial
                        </p>

                    </div>

                    <div class="documento-tipo">

                        <strong>
                            ${config.tipo}
                        </strong>

                        <span>
                            ${config.subtitulo}
                        </span>

                    </div>

                </div>


                <!-- INFORMACIÓN -->

                <table class="tabla-datos">

                    <tr>

                        <td>
                            <strong>
                                Titular / Empresa
                            </strong>
                        </td>

                        <td>
                            ${escaparHTML(nombreEmpresa)}
                        </td>

                        <td>
                            <strong>
                                Periodo
                            </strong>
                        </td>

                        <td>
                            ${new Date().getFullYear()}
                        </td>

                    </tr>

                    <tr>

                        <td>
                            <strong>
                                Documento
                            </strong>
                        </td>

                        <td>
                            ${datosUsuario
                                ? datosUsuario.tipoDocumento
                                : "-"}
                        </td>

                        <td>
                            <strong>
                                N.º
                            </strong>
                        </td>

                        <td>
                            ${datosUsuario
                                ? datosUsuario.documento
                                : "-"}
                        </td>

                    </tr>

                </table>


                <!-- TABLA PRINCIPAL -->

                <div class="tabla-scroll">

                    <table class="tabla-contable">

                        <thead>

                            <tr>

                                <th>
                                    N.º
                                </th>

                                <th>
                                    Fecha
                                </th>

                                <th>
                                    Tipo
                                </th>

                                <th>
                                    DNI/RUC
                                </th>

                                <th>
                                    Nombre / Razón social
                                </th>

                                <th>
                                    Comprobante
                                </th>

                                <th>
                                    Serie
                                </th>

                                <th>
                                    Número
                                </th>

                                <th>
                                    Descripción
                                </th>

                                <th>
                                    Monto
                                </th>

                                <th>
                                    IGV
                                </th>

                                <th>
                                    Total
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            ${filas}

                        </tbody>


                        <tfoot>

                            <tr>

                                <td
                                    colspan="9"
                                    class="texto-total"
                                >
                                    SUBTOTAL
                                </td>

                                <td class="numero">
                                    S/
                                    ${subtotal.toFixed(2)}
                                </td>

                                <td></td>

                                <td></td>

                            </tr>


                            <tr>

                                <td
                                    colspan="10"
                                    class="texto-total"
                                >
                                    IGV
                                </td>

                                <td class="numero">
                                    S/
                                    ${igvTotal.toFixed(2)}
                                </td>

                                <td></td>

                            </tr>


                            <tr class="fila-total">

                                <td
                                    colspan="10"
                                    class="texto-total"
                                >
                                    TOTAL
                                </td>

                                <td></td>

                                <td class="numero">
                                    S/
                                    ${totalGeneral.toFixed(2)}
                                </td>

                            </tr>

                        </tfoot>

                    </table>

                </div>


                <!-- PIE -->

                <div class="documento-pie">

                    <span>
                        Documento generado por
                        CONTAOBRA Perú
                    </span>

                    <span>
                        ${new Date().toLocaleDateString(
                            "es-PE"
                        )}
                    </span>

                </div>


            </div>

        `;


        document.getElementById(
            "tituloDocumento"
        ).textContent =
            config.titulo;


        document.getElementById(
            "descripcionDocumento"
        ).textContent =
            config.subtitulo;

    }


    /* =====================================================
       VOLVER AL PANEL
       ===================================================== */

    if (btnVolver) {

        btnVolver.addEventListener(
            "click",
            () => {

                mostrarPantalla(
                    panelPrincipal
                );

            }
        );

    }


    /* =====================================================
       MODIFICAR DATOS
       ===================================================== */

    if (btnVolverFormulario) {

        btnVolverFormulario.addEventListener(
            "click",
            () => {

                vistaDocumento.classList.add(
                    "oculto"
                );

                vistaFormulario.classList.remove(
                    "oculto"
                );

            }
        );

    }


    /* =====================================================
       GUARDAR DOCUMENTO
       ===================================================== */

    if (btnGuardarDocumento) {

        btnGuardarDocumento.addEventListener(
            "click",
            () => {

                const documentosGuardados =
                    JSON.parse(
                        localStorage.getItem(
                            "contaobra_documentos"
                        ) || "[]"
                    );


                documentosGuardados.push({

                    modulo: moduloActual,

                    fecha:
                        new Date().toISOString(),

                    operaciones

                });


                localStorage.setItem(
                    "contaobra_documentos",
                    JSON.stringify(
                        documentosGuardados
                    )
                );


                alert(
                    "Documento guardado correctamente."
                );

            }
        );

    }


    /* =====================================================
       PDF
       ===================================================== */

    if (btnGenerarPDF) {

        btnGenerarPDF.addEventListener(
            "click",
            () => {

                window.print();

            }
        );

    }


    /* =====================================================
       EXCEL
       ===================================================== */

    if (btnExportarExcel) {

        btnExportarExcel.addEventListener(
            "click",
            () => {

                exportarCSV();

            }
        );

    }


    /* =====================================================
       EXPORTAR CSV
       ===================================================== */

    function exportarCSV() {

        if (!operaciones.length) return;


        const encabezados = [

            "N°",
            "Fecha",
            "Tipo documento",
            "DNI/RUC",
            "Nombre/Razón social",
            "Comprobante",
            "Serie",
            "Número",
            "Descripción",
            "Monto",
            "IGV",
            "Total"

        ];


        const filas =
            operaciones.map(
                (op, index) => [

                    index + 1,
                    op.fecha,
                    op.tipoDocumento,
                    op.documento,
                    op.nombre,
                    op.comprobante,
                    op.serie,
                    op.numero,
                    op.descripcion,
                    op.monto.toFixed(2),
                    op.igv.toFixed(2),
                    op.total.toFixed(2)

                ]
            );


        let csv =
            encabezados.join(";") +
            "\n";


        filas.forEach(fila => {

            csv +=
                fila
                    .map(valor =>
                        `"${String(valor)
                            .replace(/"/g, '""')}"`
                    )
                    .join(";") +
                "\n";

        });


        const blob =
            new Blob(
                [csv],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const enlace =
            document.createElement("a");


        enlace.href = url;

        enlace.download =
            `CONTAOBRA_${moduloActual}.csv`;


        enlace.click();


        URL.revokeObjectURL(url);

    }


    /* =====================================================
       FORMATEAR FECHA
       ===================================================== */

    function formatearFecha(fecha) {

        if (!fecha) return "-";

        const partes =
            fecha.split("-");

        if (partes.length !== 3) {
            return fecha;
        }

        return `${partes[2]}/${partes[1]}/${partes[0]}`;

    }


    /* =====================================================
       SEGURIDAD HTML
       ===================================================== */

    function escaparHTML(texto) {

        return String(texto || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =====================================================
       CAMBIO DNI / RUC EN LOS FORMULARIOS
       ===================================================== */

    document.addEventListener(
        "change",
        event => {

            if (
                event.target.classList.contains(
                    "op-tipo-documento"
                )
            ) {

                const tipo =
                    event.target.value;


                const cuadro =
                    event.target.closest(
                        ".cuadro-operacion"
                    );


                const input =
                    cuadro.querySelector(
                        ".op-documento"
                    );


                if (tipo === "DNI") {

                    input.maxLength = 8;

                    input.placeholder =
                        "DNI de 8 dígitos";

                } else {

                    input.maxLength = 11;

                    input.placeholder =
                        "RUC de 11 dígitos";

                }

            }

        }
    );


    /* =====================================================
       FIN
       ===================================================== */

    console.log(
        "CONTAOBRA Perú iniciado correctamente."
    );

});