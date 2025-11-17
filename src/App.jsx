import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { AlertCircle, CheckCircle, Calculator, Droplets, Settings } from 'lucide-react'
import VisualizacaoSecaoTubulacao from '@/components/VisualizacaoSecaoTubulacao.jsx'
import VisualizacaoPerfilRede from '@/components/VisualizacaoPerfilRede.jsx'
import { CalculosHidraulicos } from '@/lib/calculos_hidraulicos.js'


function App() {
  // Estado para os parâmetros de entrada
  const [parametros, setParametros] = useState({
    consumoPerCapita: 200,
    taxaOcupacao: 5,
    coefRetorno: 0.8,
    k1: 1.2,
    k2: 1.5,
    qtdeResidencias: 100,
    coefManning: 0.013,
    forcaTrativaMin: 1.0,
    laminaMaxima: 0.75,
    vazaoMinima: 1.5,
    declividade: 0.0045,
    diametro: 150
  })

  // Estado para os resultados
  const [resultados, setResultados] = useState(null)
  const [calculadora] = useState(new CalculosHidraulicos())

  // Calcular automaticamente quando os parâmetros mudarem
  useEffect(() => {
    try {
      const novosResultados = calculadora.calcularTodos(parametros)
      setResultados(novosResultados)
    } catch (error) {
      console.error('Erro nos cálculos:', error)
    }
  }, [parametros, calculadora])

  // Função para atualizar parâmetros
  const atualizarParametro = (nome, valor) => {
    setParametros(prev => ({
      ...prev,
      [nome]: parseFloat(valor) || 0
    }))
  }

  // Função para obter cor do status
  const obterCorStatus = (valor, limite, tipo) => {
    if (tipo === 'lamina') {
      return valor <= limite ? 'text-green-600' : 'text-red-600'
    } else if (tipo === 'forca') {
      return valor >= limite ? 'text-green-600' : 'text-red-600'
    }
    return 'text-gray-600'
  }

  // Função para obter ícone do status
  const obterIconeStatus = (ok) => {
    return ok ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <Droplets className="w-10 h-10 text-blue-600" />
            Simulador de Cálculos Hidráulicos
          </h1>
          <p className="text-lg text-gray-600">Redes de Esgoto - Sistema Condominial</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Painel de Parâmetros */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Parâmetros de Entrada
                </CardTitle>
                <CardDescription>
                  Configure os parâmetros para o cálculo hidráulico
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Parâmetros de Consumo */}
                <div>
                  <h3 className="font-semibold text-sm text-gray-700 mb-3">Parâmetros de Consumo</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="consumoPerCapita">Consumo per capita (l/hab/dia)</Label>
                      <Input
                        id="consumoPerCapita"
                        type="number"
                        value={parametros.consumoPerCapita}
                        onChange={(e) => atualizarParametro('consumoPerCapita', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="taxaOcupacao">Taxa de ocupação (hab/casa)</Label>
                      <Input
                        id="taxaOcupacao"
                        type="number"
                        value={parametros.taxaOcupacao}
                        onChange={(e) => atualizarParametro('taxaOcupacao', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="coefRetorno">Coeficiente de retorno (C)</Label>
                      <Input
                        id="coefRetorno"
                        type="number"
                        step="0.01"
                        value={parametros.coefRetorno}
                        onChange={(e) => atualizarParametro('coefRetorno', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="k1">K1 (máx. diário)</Label>
                        <Input
                          id="k1"
                          type="number"
                          step="0.1"
                          value={parametros.k1}
                          onChange={(e) => atualizarParametro('k1', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="k2">K2 (máx. horário)</Label>
                        <Input
                          id="k2"
                          type="number"
                          step="0.1"
                          value={parametros.k2}
                          onChange={(e) => atualizarParametro('k2', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="qtdeResidencias">Quantidade de residências</Label>
                      <Input
                        id="qtdeResidencias"
                        type="number"
                        value={parametros.qtdeResidencias}
                        onChange={(e) => atualizarParametro('qtdeResidencias', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Parâmetros Hidráulicos */}
                <div>
                  <h3 className="font-semibold text-sm text-gray-700 mb-3">Informações do Trecho</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="diametro">Diâmetro (mm)</Label>
                      <Input
                        id="diametro"
                        type="number"
                        value={parametros.diametro}
                        onChange={(e) => atualizarParametro('diametro', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="declividade">Declividade (m/m)</Label>
                      <Input
                        id="declividade"
                        type="number"
                        step="0.0001"
                        value={parametros.declividade}
                        onChange={(e) => atualizarParametro('declividade', parseFloat(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="coefManning">Coef. Manning (n)</Label>
                      <Input
                        id="coefManning"
                        type="number"
                        step="0.001"
                        value={parametros.coefManning}
                        onChange={(e) => atualizarParametro('coefManning', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Critérios de Verificação */}
                <div>
                  <h3 className="font-semibold text-sm text-gray-700 mb-3">Critérios de Verificação</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="laminaMaxima">Lâmina máxima (%)</Label>
                      <Input
                        id="laminaMaxima"
                        type="number"
                        step="0.01"
                        value={(parametros.laminaMaxima * 100).toFixed(0)}
                        onChange={(e) => atualizarParametro('laminaMaxima', parseFloat(e.target.value) / 100)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="forcaTrativaMin">Força trativa mín. (Pa)</Label>
                      <Input
                        id="forcaTrativaMin"
                        type="number"
                        step="0.1"
                        value={parametros.forcaTrativaMin}
                        onChange={(e) => atualizarParametro('forcaTrativaMin', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vazaoMinima">Vazão mínima (l/s)</Label>
                      <Input
                        id="vazaoMinima"
                        type="number"
                        step="0.1"
                        value={parametros.vazaoMinima}
                        onChange={(e) => atualizarParametro('vazaoMinima', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Painel de Resultados */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Visualizações */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <VisualizacaoSecaoTubulacao 
                  resultados={resultados} 
                  parametros={parametros} 
                />
                <VisualizacaoPerfilRede 
                  resultados={resultados} 
                  parametros={parametros} 
                />
              </div>

              {/* Resultados dos Cálculos */}
              <Card>
                <CardHeader>
                  <CardTitle>Resultados dos Cálculos</CardTitle>
                  <CardDescription>
                    Valores calculados baseados nos parâmetros informados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {resultados && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Vazões */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-gray-700">Vazões</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Vazão calculada:</span>
                            <span className="font-mono">{resultados.resultados.vazaoEstimada.toFixed(2)} l/s</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Vazão considerada:</span>
                            <span className="font-mono font-semibold">{resultados.resultados.vazaoCalculada.toFixed(2)} l/s</span>
                          </div>
                        </div>
                      </div>

                      {/* Elementos Geométricos */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-gray-700">Elementos Geométricos</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Área hidráulica:</span>
                            <span className="font-mono">{resultados.resultados.areaHidraulica.toFixed(6)} m²</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Perímetro molhado:</span>
                            <span className="font-mono">{resultados.resultados.perimetroMolhado.toFixed(4)} m</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Raio hidráulico:</span>
                            <span className="font-mono">{resultados.resultados.raioHidraulico.toFixed(4)} m</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Altura molhada:</span>
                            <span className="font-mono">{resultados.resultados.alturaMolhada.toFixed(4)} m</span>
                          </div>
                        </div>
                      </div>

                      {/* Verificações Hidráulicas */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-gray-700">Verificações Hidráulicas</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span>Lâmina líquida:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono">{(resultados.resultados.laminaLiquida * 100).toFixed(1)}%</span>
                              {resultados.verificacoes.laminaOK ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Força trativa:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono">{resultados.resultados.forcaTraativa.toFixed(2)} Pa</span>
                              {resultados.verificacoes.forcaTraativaOK ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span>Velocidade:</span>
                            <span className="font-mono">{resultados.resultados.velocidade.toFixed(2)} m/s</span>
                          </div>
                        </div>
                      </div>

                      {/* Parâmetros Técnicos */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-gray-700">Parâmetros Técnicos</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Ângulo θ:</span>
                            <span className="font-mono">{resultados.resultados.anguloTeta.toFixed(4)} rad</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Diâmetro:</span>
                            <span className="font-mono">{parametros.diametro} mm</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Declividade:</span>
                            <span className="font-mono">{parametros.declividade.toFixed(4)} m/m</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Status Geral */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Condições de escoamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {resultados && (
                    <div className="flex items-center justify-center">
                      <Badge 
                        variant={resultados.verificacoes.sistemaOK ? "default" : "destructive"}
                        className="text-lg px-4 py-2"
                      >
                        {resultados.verificacoes.sistemaOK ? "Sistema OK" : "Problema nas condições de escoamento"}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App 