function myTableFilter() {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("miBuscador");
    filter = input.value.toUpperCase();
    table = document.getElementById("miTabla");
    tr = table.getElementsByTagName("tr");
    filtro = document.getElementById("filtro").value;

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[parseInt(filtro)];
        console.log("td " + td);
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}