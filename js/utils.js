
    $("#botonTelefono").on("click", function () {
        debugger;
        let nuevo = [
            '<div class="col-md-6">',
            '<input type="text" class="form-control" id="telefonos" placeholder="Telefono">',
            '</div>',
        ]
        $("#contenedorTelefonos").append($(nuevo.join('')));
    })

    $("#botonCrear").on("click", function (event) {
        if (/^(.*[^\s]+.*)$/.test($("#nombreTarea").val())) {
            let tarea = $("#nombreTarea").val();
            tags.forEach(elem => tarea += " @" + elem);
            $("#resultado").val(tarea);
            tags = new Set();
        }
        else {
            alert("La tarea debe tener un nombre");
            event.preventDefault();
        }
    })

    $("#conjuntoTags").on("click", function (event) {
        tags.delete($(event.target).text());
        $(event.target).remove();
    });

    $("#nombreTarea").keyup(function () {
        var value = $(this).val();
        $("#nombreEnTarea").text(value);
    }).keyup();