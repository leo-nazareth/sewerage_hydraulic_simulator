/**
 * Análise detalhada do algoritmo iterativo para ajustar os cálculos
 */

const CalculosHidraulicos = require('../../src/lib/calculos_hidraulicos.js');

function analisarAlgoritmoIterativo() {
    console.log('ANÁLISE DETALHADA DO ALGORITMO ITERATIVO');
    console.log('='.repeat(50));
    
    // Parâmetros da planilha
    const params = {
        consumoPerCapita: 200,
        taxaOcupacao: 5,
        coefRetorno: 0.8,
        k1: 1.2,
        k2: 1.5,
        qtdeResidencias: 2170,
        coefManning: 0.013,
        declividade: 0.005,
        diametro: 150
    };
    
    const calc = new CalculosHidraulicos();
    
    // Calcular passo a passo
    const qcalc = calc.calcularVazaoCalculada(params) / 1000; // m³/s
    console.log(`Vazão calculada: ${qcalc.toFixed(6)} m³/s`);
    
    // Calcular E
    const E = (params.coefManning * qcalc) / 
              (Math.pow(params.declividade, 0.5) * Math.pow(params.diametro / 1000, 8/3));
    console.log(`Fator E: ${E.toFixed(6)}`);
    
    // Calcular E'
    const epsilon = 8 * Math.pow((Math.pow(E, 3) / 4), 0.2);
    console.log(`Fator E' (epsilon): ${epsilon.toFixed(6)}`);
    
    // Testar diferentes valores iniciais para teta
    console.log('\nTeste de diferentes valores iniciais:');
    
    const valoresIniciais = [
        Math.PI / 4,
        Math.PI / 2,
        Math.PI,
        3 * Math.PI / 2,
        epsilon * Math.pow(Math.PI, 0.4) + Math.sin(Math.PI)
    ];
    
    valoresIniciais.forEach((inicial, index) => {
        console.log(`\nTeste ${index + 1}: Valor inicial = ${inicial.toFixed(4)}`);
        
        let teta1 = inicial;
        let teta2;
        
        for (let i = 0; i < 10; i++) {
            teta2 = epsilon * Math.pow(teta1, 0.4) + Math.sin(teta1);
            console.log(`  Iteração ${i + 1}: ${teta2.toFixed(6)} (diff: ${Math.abs(teta1 - teta2).toFixed(8)})`);
            
            if (Math.abs(teta1 - teta2) <= 1e-6) {
                console.log(`  Convergiu em ${i + 1} iterações`);
                break;
            }
            
            teta1 = teta2;
        }
        
        // Calcular resultados com este teta
        if (teta2 > 0 && teta2 <= 2 * Math.PI) {
            const area = Math.pow(params.diametro / 1000, 2) / 8 * (teta2 - Math.sin(teta2));
            const perimetro = teta2 / 2 * params.diametro / 1000;
            const rh = (params.diametro / 1000 / 4) * (teta2 - Math.sin(teta2)) / teta2;
            const y = (1 - Math.cos(teta2 / 2)) * params.diametro / 1000 / 2;
            const lamina = y / (params.diametro / 1000);
            const forcaTraativa = 9800 * rh * params.declividade;
            const velocidade = Math.pow(rh, 2/3) * Math.pow(params.declividade, 0.5) / params.coefManning;
            
            console.log(`  Resultados: Lâmina=${(lamina*100).toFixed(1)}%, Força=${forcaTraativa.toFixed(2)}Pa, V=${velocidade.toFixed(2)}m/s`);
        }
    });
    
    // Tentar resolver usando método de Newton-Raphson
    console.log('\n\nTentativa com método de Newton-Raphson:');
    console.log('-'.repeat(40));
    
    function funcaoObjetivo(teta) {
        // f(θ) = ε - θ^0.4 - sin(θ)/ε = 0
        return epsilon - Math.pow(teta, 0.4) - Math.sin(teta) / epsilon;
    }
    
    function derivada(teta) {
        return -0.4 * Math.pow(teta, -0.6) - Math.cos(teta) / epsilon;
    }
    
    let teta = Math.PI; // Valor inicial
    for (let i = 0; i < 10; i++) {
        const f = funcaoObjetivo(teta);
        const df = derivada(teta);
        const novoTeta = teta - f / df;
        
        console.log(`Iteração ${i + 1}: θ=${teta.toFixed(6)}, f(θ)=${f.toFixed(8)}, θ_novo=${novoTeta.toFixed(6)}`);
        
        if (Math.abs(novoTeta - teta) < 1e-6) {
            console.log(`Newton-Raphson convergiu: θ = ${novoTeta.toFixed(6)}`);
            break;
        }
        
        teta = novoTeta;
    }
}

// Executar análise
analisarAlgoritmoIterativo(); 