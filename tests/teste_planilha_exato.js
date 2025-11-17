const CalculosHidraulicos = require('../../src/lib/calculos_hidraulicos.js');

/**
 * Este teste usa EXATAMENTE os mesmos parâmetros da primeira linha da aba "CH" da planilha.
 * O objetivo é validar se a implementação em JS produz o mesmo resultado do Excel.
 */
function testeComValoresDaPlanilha() {
    console.log("=".repeat(60));
    console.log("   TESTE DE COMPATIBILIDADE COM A PLANILHA (ABA 'CH')   ");
    console.log("=".repeat(60));

    const calc = new CalculosHidraulicos();

    // Parâmetros extraídos da Linha 6 da aba 'CH'
    const params = {
        // Coluna A e B não são usadas diretamente no cálculo do trecho
        qtdeResidencias: 1, // Assumindo 1 para que a vazão de cálculo seja a mínima
        vazaoMinima: 1.5,   // C6: Qcalc (l/s)
        diametro: 150,      // D6: Diâmetro (mm)
        declividade: 0.005, // E6: Declividade (m/m)
        coefManning: 0.013, // F6: Coeficiente de Manning
        // G6 (TETA) é o que queremos calcular
        // Outros parâmetros de consumo não são relevantes pois Qcalc é fixo
    };

    // Forçar a vazão de cálculo para ser exatamente a da planilha
    // A classe `CalculosHidraulicos` tem a lógica de `max(estimada, minima)`,
    // então ajustamos os parâmetros para que a mínima prevaleça.
    params.consumoPerCapita = 0.001; // Irrelevante
    params.taxaOcupacao = 1;
    params.coefRetorno = 0.1;
    
    console.log("Parâmetros de Entrada (baseado na planilha):");
    console.log(`- Vazão de Cálculo (Qcalc): ${params.vazaoMinima} l/s`);
    console.log(`- Diâmetro: ${params.diametro} mm`);
    console.log(`- Declividade: ${params.declividade} m/m`);
    console.log(`- Coef. Manning: ${params.coefManning}`);

    // Calculando todos os valores
    const { resultados } = calc.calcularTodos(params);

    console.log("\nResultados da Implementação JS:");
    console.log(`- Ângulo Teta: ${resultados.anguloTeta.toFixed(10)} rad`);
    console.log(`- Velocidade: ${resultados.velocidade.toFixed(10)} m/s`);
    console.log(`- Área Hidráulica: ${resultados.areaHidraulica.toFixed(10)} m²`);
    console.log(`- Perímetro Molhado: ${resultados.perimetroMolhado.toFixed(10)} m`);
    console.log(`- Altura Molhada (y): ${resultados.alturaMolhada.toFixed(10)} m`);
    console.log(`- Raio Hidráulico: ${resultados.raioHidraulico.toFixed(10)} m`);
    console.log(`- Lâmina (y/D): ${resultados.laminaLiquida.toFixed(10)}`);
    console.log(`- Força Trativa: ${resultados.forcaTraativa.toFixed(10)} Pa`);
    
    // Valores de referência da planilha (extraídos manualmente da aba 'CH', linha 6)
    const esperados = {
        anguloTeta: 1.7610196856,
        velocidade: 0.6133221975,
        areaHidraulica: 0.0069006901,
        perimetroMolhado: 0.1320764764,
        alturaMolhada: 0.0631388656,
        raioHidraulico: 0.0298379434,
        laminaLiquida: 0.4209257708,
        forcaTraativa: 14.9189717122
    };

    console.log("\n" + "-".repeat(60));
    console.log("Comparação com Valores Esperados da Planilha:");
    let todosOK = true;
    for (const key in esperados) {
        const calculado = resultados[key];
        const esperado = esperados[key];
        const diff = Math.abs(calculado - esperado);
        const ok = diff < 1e-7; // Usando uma tolerância pequena
        if (!ok) todosOK = false;
        console.log(`- ${key.padEnd(18)}: Calculado=${calculado.toFixed(8)}, Esperado=${esperado.toFixed(8)} -> ${ok ? 'OK' : `FALHOU (diff: ${diff.toExponential(2)})`}`);
    }

    console.log("=".repeat(60));
    console.log("Resultado Final do Teste de Compatibilidade: " + (todosOK ? "APROVADO" : "REPROVADO"));
    console.log("=".repeat(60));
}

// Executar o teste
testeComValoresDaPlanilha(); 