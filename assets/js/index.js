//Rotas
const rotaPrincipal = 'https://api.covid19api.com/';

const rotaSumary = 'summary';

let sumarioGlobal = {};
let totalPorPais = {};

//Função Pra buscar dados.
async function carregaDados() {
    let rotaFinal = "";

    rotaFinal = rotaPrincipal + rotaSumary;

    let response = await axios.get(rotaFinal);
    console.log('Resposta: ', response.data.Global);
    return response.data;
};

carregaDados().then((response) => {
    sumarioGlobal = response.Global;
    totalPorPais = response.Countries;
    console.log(sumarioGlobal);
    atualizaHome();
})


function atualizaHome() {
    let totalConfirmado = document.getElementById('confirmed');
    totalConfirmado.innerHTML = sumarioGlobal.TotalConfirmed.toLocaleString('pt-BR');

    let totalMortesConfirmado = document.getElementById('death');
    totalMortesConfirmado.innerHTML = sumarioGlobal.TotalDeaths.toLocaleString('pt-BR');

    let totalRecuperados = document.getElementById('recovered');
    totalRecuperados.innerHTML = sumarioGlobal.TotalRecovered.toLocaleString('pt-BR');

    let dataAtualizacao = document.getElementById('date');
    let data = new Date(sumarioGlobal.Date);
    dataAtualizacao.innerHTML += `    ${data.toLocaleDateString('pt-BR', {timeZone: 'UTC'})} `;

    montaPizza();
    montaBarras();
}

function montaPizza() {
    let itensPizza = [
        sumarioGlobal.TotalConfirmed,
        sumarioGlobal.TotalRecovered,
        sumarioGlobal.TotalDeaths
    ]


    const data = {
        labels: [
            'Confirmados',
            'Recuperados',
            'Mortes'
        ],
        datasets: [{
            label: 'Visão Geral Mundo',
            data: itensPizza,
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
        }]
    };

    const config = {
        type: 'pie',
        data: data,
    };

    console.log(itensPizza);

    const myChart = new Chart(
        document.getElementById('pizza'),
        config
    );
}

function montaBarras() {
    let topTen = [];
    let labels = [];
    let dados = [];

    totalPorPais.sort(function(a, b) {
        if (a.TotalConfirmed < b.TotalConfirmed) {
            return 1;
        }
        if (a.TotalConfirmed > b.TotalConfirmed) {
            return -1;
        }
        return 0;
    });

    topTen = totalPorPais.slice(0, 10);

    topTen.map((index) => {
        labels.push(index.Country);
        dados.push(index.TotalConfirmed);
    });

    const dataBarra = {
        labels: labels,
        datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: dados,
        }]
    };

    const configBarra = {
        type: 'bar',
        data: dataBarra,
        options: {}
    };

    const myChartBar = new Chart(
        document.getElementById('barras'),
        configBarra
    );

    console.log(topTen);
}

// carregaDados();