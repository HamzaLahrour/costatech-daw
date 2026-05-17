const botonesPestanas = document.querySelectorAll('.btn-pestana');
const panelesPestanas = document.querySelectorAll('.panel-pestana');

if (botonesPestanas.length > 0) {
  botonesPestanas.forEach(boton => {
    boton.addEventListener('click', function () {
      botonesPestanas.forEach(b => {
        b.classList.remove('activo');
        b.setAttribute('aria-selected', 'false');
      });
      panelesPestanas.forEach(p => p.classList.remove('activo'));

      this.classList.add('activo');
      this.setAttribute('aria-selected', 'true');

      const idPanel = this.getAttribute('aria-controls');
      const panel = document.getElementById(idPanel);
      panel.classList.add('activo');

      const iframe = panel.querySelector('iframe[data-src]');
      if (iframe) {
        iframe.src = iframe.dataset.src;
      }
    });
  });
}

const datos = {
  enero: [120, 95, 80, 60, 45],
  febrero: [90, 110, 70, 85, 30],
  marzo: [140, 75, 95, 50, 60],
};

const grafica = new Chart(document.getElementById('graficaVentas'), {
  type: 'bar',
  data: {
    labels: ['Teclado RGB', 'Ratón HyperClick', 'Auriculares', 'Alfombrilla', 'Webcam'],
    datasets: [{
      label: 'Unidades vendidas',
      data: datos.enero,
      backgroundColor: '#1E90FF',
      borderRadius: 6,
    }],
  },
  options: {
    animation: { duration: 800 },
    responsive: true,
    plugins: { legend: { labels: { font: { family: 'Poppins' } } } },
    scales: {
      y: { beginAtZero: true, ticks: { font: { family: 'Poppins' } } },
      x: { ticks: { font: { family: 'Poppins' } } },
    },
  },
});

function cambiarMes(mes) {
  grafica.data.datasets[0].data = datos[mes];
  grafica.update();
}