const button = document.querySelector("button");

button.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen(); 
        button.textContent = "Salir del modo pantalla completa"; 
    } else {
        document.exitFullscreen(); 
        button.textContent = "Activar modo pantalla completa"; 
    }
});
const champions = {
    2023: { name: "Max Verstappen", team: "Red Bull Racing", points: 575, runnerUp: 285 },
    2022: { name: "Max Verstappen", team: "Red Bull Racing", points: 454, runnerUp: 308 },
    2021: { name: "Max Verstappen", team: "Red Bull Racing", points: 395, runnerUp: 387 },
    2020: { name: "Lewis Hamilton", team: "Mercedes", points: 347, runnerUp: 223 },
    2019: { name: "Lewis Hamilton", team: "Mercedes", points: 413, runnerUp: 326 },
    2018: { name: "Lewis Hamilton", team: "Mercedes", points: 408, runnerUp: 320 },
    2017: { name: "Lewis Hamilton", team: "Mercedes", points: 363, runnerUp: 317 },
    2016: { name: "Nico Rosberg", team: "Mercedes", points: 385, runnerUp: 380 },
    2015: { name: "Lewis Hamilton", team: "Mercedes", points: 381, runnerUp: 322 },
    2014: { name: "Lewis Hamilton", team: "Mercedes", points: 384, runnerUp: 317 },
    2013: { name: "Sebastian Vettel", team: "Red Bull Racing", points: 397, runnerUp: 242 },
    2012: { name: "Sebastian Vettel", team: "Red Bull Racing", points: 281, runnerUp: 278 },
    2011: { name: "Sebastian Vettel", team: "Red Bull Racing", points: 392, runnerUp: 270 },
    2010: { name: "Sebastian Vettel", team: "Red Bull Racing", points: 256, runnerUp: 252 },
    2009: { name: "Jenson Button", team: "Brawn GP", points: 95, runnerUp: 84 },
    2008: { name: "Lewis Hamilton", team: "McLaren", points: 98, runnerUp: 97 },
    2007: { name: "Kimi Räikkönen", team: "Ferrari", points: 110, runnerUp: 109 },
    2006: { name: "Fernando Alonso", team: "Renault", points: 134, runnerUp: 121 },
    2005: { name: "Fernando Alonso", team: "Renault", points: 133, runnerUp: 112 },
    2004: { name: "Michael Schumacher", team: "Ferrari", points: 148, runnerUp: 91 },
    2003: { name: "Michael Schumacher", team: "Ferrari", points: 93, runnerUp: 91 },
    2002: { name: "Michael Schumacher", team: "Ferrari", points: 144, runnerUp: 77 },
    2001: { name: "Michael Schumacher", team: "Ferrari", points: 123, runnerUp: 65 },
    2000: { name: "Michael Schumacher", team: "Ferrari", points: 108, runnerUp: 89 }
};

const yearSlider = document.querySelector('input');
const selectedYear = document.querySelector('span');
const championName = document.querySelector('h3');
const championTeam = document.querySelector('h4');
const championPoints = document.querySelector('article > p');
const chart = document.querySelector('svg');

function updateChampionInfo(year) {
    const champion = champions[year];
    selectedYear.textContent = year;
    championName.textContent = champion.name;
    championTeam.textContent = champion.team;
    championPoints.textContent = `Puntos: ${champion.points}`;
    drawChart(champion.points, champion.runnerUp);

    localStorage.setItem('lastSelectedYear', year);
}

function drawChart(points, runnerUpPoints) {
    chart.innerHTML = '';
    const svgWidth = chart.clientWidth;
    const svgHeight = chart.clientHeight;

    const margin = svgWidth * 0.1; 
    const barWidth = (svgWidth - margin * 3) / 2; 
    const maxBarHeight = svgHeight * 0.7; 
    const textHeight = svgHeight * 0.15; 

    const maxPoints = 600;
    const championHeight = (points / maxPoints) * maxBarHeight;
    const runnerUpHeight = (runnerUpPoints / maxPoints) * maxBarHeight;

    const svgApi = 'http://www.w3.org/2000/svg';

    const championBar = document.createElementNS(svgApi, 'rect');
    championBar.setAttribute('x', margin);
    championBar.setAttribute('y', svgHeight - textHeight - championHeight);
    championBar.setAttribute('width', barWidth);
    championBar.setAttribute('height', championHeight);
    championBar.setAttribute('fill', '#b00000');

    const runnerUpBar = document.createElementNS(svgApi, 'rect');
    runnerUpBar.setAttribute('x', margin * 2 + barWidth);
    runnerUpBar.setAttribute('y', svgHeight - textHeight - runnerUpHeight);
    runnerUpBar.setAttribute('width', barWidth);
    runnerUpBar.setAttribute('height', runnerUpHeight);
    runnerUpBar.setAttribute('fill', '#0d09ec');

    const textChampion = document.createElementNS(svgApi, 'text');
    textChampion.setAttribute('x', margin + barWidth / 2);
    textChampion.setAttribute('y', svgHeight - 5); 
    textChampion.setAttribute('text-anchor', 'middle'); 
    textChampion.textContent = 'Campeón';

    const textRunnerUp = document.createElementNS(svgApi, 'text');
    textRunnerUp.setAttribute('x', margin * 2 + barWidth + barWidth / 2);
    textRunnerUp.setAttribute('y', svgHeight - 5);
    textRunnerUp.setAttribute('text-anchor', 'middle');
    textRunnerUp.textContent = 'Subcampeón';

    chart.appendChild(championBar);
    chart.appendChild(runnerUpBar);
    chart.appendChild(textChampion);
    chart.appendChild(textRunnerUp);
}

yearSlider.addEventListener('input', (e) => {
    thisYear = e.target.value; 
    updateChampionInfo(thisYear);
});
window.addEventListener('resize', () => {
    updateChampionInfo(thisYear);
});

const lastYear = localStorage.getItem('lastSelectedYear') || 2023;
yearSlider.value = lastYear;
let thisYear=lastYear;
updateChampionInfo(lastYear);

