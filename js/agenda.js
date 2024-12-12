class Agenda {
    constructor() {
        this.apiURL = "https://api.jolpi.ca/ergast/f1/current.json";
    }

    obtenerCarreras() {
        $.ajax({
            url: this.apiURL,
            dataType: "json",
            success: (data) => {
                const carreras = data.MRData.RaceTable.Races;
                const lista = document.querySelector("section ul");

                lista.innerHTML = "";

                carreras.forEach(carrera => {
                    const nombre = carrera.raceName;
                    const circuito = carrera.Circuit.circuitName;
                    const coordenadas = `${carrera.Circuit.Location.lat}, ${carrera.Circuit.Location.long}`;
                    const fechaHora = `${carrera.date} ${carrera.time}`;

                    const carreraItem = document.createElement("li");
                    carreraItem.innerHTML = `
                        <strong>${nombre}</strong><br>
                        Circuito: ${circuito}<br>
                        Coordenadas: ${coordenadas}<br>
                        Fecha y Hora: ${fechaHora}
                    `;

                    lista.appendChild(carreraItem);
                });
            },
        });
    }
}

function cargarCarreras() {
    const agenda = new Agenda();
    agenda.obtenerCarreras();
}
