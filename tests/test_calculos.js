const CalculosHidraulicos = require('../../src/lib/calculos_hidraulicos.js');

function testarCalculos() {
    console.log("INICIANDO TESTES DO SIMULADOR HIDRÁULICO");
    console.log("=".repeat(50));

    const calc = new CalculosHidraulicos();

    // Cenário 1: Parâmetros padrão
    console.log("\nCENÁRIO 1: PARÂMETROS PADRÃO");
    let params1 = {}; // Usa os padrões da classe
    let resultado1 = calc.calcularTodos(params1);
    imprimirResultados(resultado1);

    // Cenário 2: Mais residências, declividade menor
    console.log("\nCENÁRIO 2: MAIS RESIDÊNCIAS, DECLIVIDADE MENOR");
    let params2 = {
        qtdeResidencias: 500,
        declividade: 0.003
    };
    let resultado2 = calc.calcularTodos(params2);
    imprimirResultados(resultado2);

    // Cenário 3: Diâmetro maior, manning diferente
    console.log("\nCENÁRIO 3: DIÂMETRO MAIOR, MANNING DIFERENTE");
    let params3 = {
        diametro: 200,
        coefManning: 0.015
    };
    let resultado3 = calc.calcularTodos(params3);
    imprimirResultados(resultado3);

    // Cenário 4: Vazão estimada menor que a mínima
    console.log("\nCENÁRIO 4: VAZÃO ESTIMADA < VAZÃO MÍNIMA");
    let params4 = {
        qtdeResidencias: 10 // Força a vazão estimada a ser baixa
    };
    let resultado4 = calc.calcularTodos(params4);
    imprimirResultados(resultado4);
    console.log(` -> Verificação: Vazão calculada (${resultado4.resultados.vazaoCalculada.toFixed(2)}) == Vazão mínima (${(resultado4.parametros.vazaoMinima).toFixed(2)})? ${resultado4.resultados.vazaoCalculada === resultado4.parametros.vazaoMinima}`);


    // Cenário 5: Lâmina d'água alta (próximo do limite)
    console.log("\nCENÁRIO 5: LÂMINA D'ÁGUA ALTA");
    let params5 = {
        qtdeResidencias: 1000,
        declividade: 0.002,
        diametro: 150
    };
    let resultado5 = calc.calcularTodos(params5);
    imprimirResultados(resultado5);
    console.log(` -> Verificação: Lâmina (${(resultado5.resultados.laminaLiquida * 100).toFixed(1)}%) > Limite (${resultado5.parametros.laminaMaxima * 100}%)? ${!resultado5.verificacoes.laminaOK}`);

    // Cenário 6: Força trativa baixa
    console.log("\nCENÁRIO 6: FORÇA TRATIVA BAIXA");
    let params6 = {
        qtdeResidencias: 50,
        declividade: 0.001
    };
    let resultado6 = calc.calcularTodos(params6);
    imprimirResultados(resultado6);
    console.log(` -> Verificação: Força Trativa (${resultado6.resultados.forcaTraativa.toFixed(2)}) < Mínima (${resultado6.parametros.forcaTrativaMin.toFixed(2)})? ${!resultado6.verificacoes.forcaTraativaOK}`);

    // Cenário 7: Validação de parâmetros
    console.log("\nCENÁRIO 7: VALIDAÇÃO DE PARÂMETROS");
    let paramsInvalidos = {
        coefRetorno: 1.2, // Inválido
        declividade: 0.2 // Aviso
    };
    const validacao = calc.validarParametros(paramsInvalidos);
    console.log("Resultado da validação:", validacao);


    console.log("\n" + "=".repeat(50));
    console.log("TESTES CONCLUÍDOS");
}

function imprimirResultados(resultado) {
    const { parametros, resultados, verificacoes } = resultado;
    console.log("  Parâmetros:");
    console.log(`    - Qtde Residências: ${parametros.qtdeResidencias}`);
    console.log(`    - Diâmetro: ${parametros.diametro} mm`);
    console.log(`    - Declividade: ${parametros.declividade} m/m`);
    console.log("  Resultados:");
    console.log(`    - Vazão Calculada: ${resultados.vazaoCalculada.toFixed(3)} l/s`);
    console.log(`    - Lâmina Líquida (y/D): ${(resultados.laminaLiquida * 100).toFixed(1)} %`);
    console.log(`    - Força Trativa: ${resultados.forcaTraativa.toFixed(3)} Pa`);
    console.log(`    - Velocidade: ${resultados.velocidade.toFixed(3)} m/s`);
    console.log("  Verificações:");
    console.log(`    - Lâmina OK? ${verificacoes.laminaOK}`);
    console.log(`    - Força Trativa OK? ${verificacoes.forcaTraativaOK}`);
    console.log(`    - Sistema OK? ${verificacoes.sistemaOK}`);
}

// Executar os testes
testarCalculos(); 