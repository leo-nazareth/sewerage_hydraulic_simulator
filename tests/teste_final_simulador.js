const CalculosHidraulicos = require('../../src/lib/calculos_hidraulicos.js');

/**
 * TESTE FINAL - Simula exatamente os valores da planilha para garantir consistência
 */
function executarTesteFinal() {
    console.log("=".repeat(60));
    console.log(" EXECUTANDO TESTE FINAL DE CONSISTÊNCIA COM A PLANILHA");
    console.log("=".repeat(60));

    const calc = new CalculosHidraulicos();

    const params = {
        consumoPerCapita: 200,
        taxaOcupacao: 5,
        coefRetorno: 0.8,
        k1: 1.2,
        k2: 1.5,
        qtdeResidencias: 2170,
        coefManning: 0.013,
        forcaTrativaMin: 1,
        laminaMaxima: 0.75,
        vazaoMinima: 1.5,
        declividade: 0.005,
        diametro: 150
    };

    console.log("Parâmetros de Entrada:");
    console.table(params);

    const resultado = calc.calcularTodos(params);
    const { resultados, verificacoes } = resultado;

    console.log("\nResultados Calculados:");
    console.log(`- Vazão Estimada: ${resultados.vazaoEstimada.toFixed(10)} l/s`);
    console.log(`- Vazão Calculada: ${resultados.vazaoCalculada.toFixed(10)} l/s`);
    console.log(`- Ângulo Teta: ${resultados.anguloTeta.toFixed(10)} rad`);
    console.log(`- Área Hidráulica: ${resultados.areaHidraulica.toFixed(10)} m²`);
    console.log(`- Perímetro Molhado: ${resultados.perimetroMolhado.toFixed(10)} m`);
    console.log(`- Raio Hidráulico: ${resultados.raioHidraulico.toFixed(10)} m`);
    console.log(`- Altura Molhada: ${resultados.alturaMolhada.toFixed(10)} m`);
    console.log(`- Lâmina Líquida (y/D): ${resultados.laminaLiquida.toFixed(10)}`);
    console.log(`- Força Trativa: ${resultados.forcaTraativa.toFixed(10)} Pa`);
    console.log(`- Velocidade: ${resultados.velocidade.toFixed(10)} m/s`);

    console.log("\nVerificações:");
    console.log(`- Lâmina OK? ${verificacoes.laminaOK}`);
    console.log(`- Força Trativa OK? ${verificacoes.forcaTraativaOK}`);
    console.log(`- Sistema OK? ${verificacoes.sistemaOK}`);

    console.log("\n" + "=".repeat(60));

    // VALORES ESPERADOS (da planilha)
    const esperados = {
        vazaoCalculada: 30.1388888888889,
        anguloTeta: 2.766861053,
        areaHidraulica: 0.017124233,
        perimetroMolhado: 0.207514579,
        raioHidraulico: 0.046187728,
        alturaMolhada: 0.117281206,
        laminaLiquida: 0.781874706,
        forcaTraativa: 23.09386381,
        velocidade: 0.967812239
    };

    console.log("Comparação com Valores Esperados da Planilha:");
    let todosOK = true;
    for (const key in esperados) {
        const calculado = resultados[key] || resultado.resultados[key];
        const esperado = esperados[key];
        const diff = Math.abs(calculado - esperado);
        const ok = diff < 1e-6; // Tolerância
        if (!ok) todosOK = false;
        console.log(`- ${key}: Calculado=${calculado.toFixed(8)}, Esperado=${esperado.toFixed(8)} -> ${ok ? 'OK' : `FALHOU (diff: ${diff.toExponential(2)})`}`);
    }
    
    console.log("\nResultado Final do Teste: " + (todosOK ? "APROVADO" : "REPROVADO"));
    console.log("=".repeat(60));
}

// Executar
executarTesteFinal(); 