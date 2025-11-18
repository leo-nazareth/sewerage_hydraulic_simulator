import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { AlertCircle, CheckCircle, Calculator, Settings } from 'lucide-react'
import VisualizacaoSecaoTubulacao from '@/components/VisualizacaoSecaoTubulacao.jsx'
import VisualizacaoPerfilRede from '@/components/VisualizacaoPerfilRede.jsx'
import { CalculosHidraulicos } from '@/lib/calculos_hidraulicos.js'
import LanguageSelector from '@/components/LanguageSelector.jsx'
import SewerIcon from '@/components/SewerIcon.jsx'
import { useLanguage } from '@/i18n/LanguageProvider'


function App() {
  const { t } = useLanguage();
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
    // Se o valor está vazio, usar 0 para cálculos mas manter vazio no display
    const numericValue = valor === '' ? 0 : parseFloat(valor)
    setParametros(prev => ({
      ...prev,
      [nome]: isNaN(numericValue) ? 0 : numericValue
    }))
  }

  // Função para exibir valor no input (vazio se for 0 para campos inteiros)
  const exibirValor = (valor, isDecimal = false) => {
    if (valor === 0 && !isDecimal) return ''
    return valor
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-end mb-4">
            <LanguageSelector />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
              <SewerIcon className="w-10 h-10 text-teal-600" />
              {t('app.title')}
            </h1>
            <p className="text-lg text-gray-700">{t('app.subtitle')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Painel de Parâmetros */}
          <div className="lg:col-span-1">
            <Card className="h-fit shadow-md border-teal-100">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50">
                <CardTitle className="flex items-center gap-2 text-teal-800">
                  <Settings className="w-5 h-5 text-teal-600" />
                  {t('parameters.title')}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {t('parameters.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Parâmetros de Consumo */}
                <div>
                  <h3 className="font-semibold text-sm text-teal-700 mb-3">{t('parameters.consumption.title')}</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="consumoPerCapita">{t('parameters.consumption.perCapita')}</Label>
                      <Input
                        id="consumoPerCapita"
                        type="number"
                        value={exibirValor(parametros.consumoPerCapita)}
                        onChange={(e) => atualizarParametro('consumoPerCapita', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="taxaOcupacao">{t('parameters.consumption.occupancyRate')}</Label>
                      <Input
                        id="taxaOcupacao"
                        type="number"
                        value={exibirValor(parametros.taxaOcupacao)}
                        onChange={(e) => atualizarParametro('taxaOcupacao', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="coefRetorno">{t('parameters.consumption.returnCoefficient')}</Label>
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
                        <Label htmlFor="k1">{t('parameters.consumption.k1')}</Label>
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
                        <Label htmlFor="k2">{t('parameters.consumption.k2')}</Label>
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
                      <Label htmlFor="qtdeResidencias">{t('parameters.consumption.residences')}</Label>
                      <Input
                        id="qtdeResidencias"
                        type="number"
                        value={exibirValor(parametros.qtdeResidencias)}
                        onChange={(e) => atualizarParametro('qtdeResidencias', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Parâmetros Hidráulicos */}
                <div>
                  <h3 className="font-semibold text-sm text-teal-700 mb-3">{t('parameters.hydraulic.title')}</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="diametro">{t('parameters.hydraulic.diameter')}</Label>
                      <Input
                        id="diametro"
                        type="number"
                        value={exibirValor(parametros.diametro)}
                        onChange={(e) => atualizarParametro('diametro', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="declividade">{t('parameters.hydraulic.slope')}</Label>
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
                      <Label htmlFor="coefManning">{t('parameters.hydraulic.manning')}</Label>
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
                  <h3 className="font-semibold text-sm text-teal-700 mb-3">{t('parameters.verification.title')}</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="laminaMaxima">{t('parameters.verification.maxDepth')}</Label>
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
                      <Label htmlFor="forcaTrativaMin">{t('parameters.verification.minTractive')}</Label>
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
                      <Label htmlFor="vazaoMinima">{t('parameters.verification.minFlow')}</Label>
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
              <Card className="shadow-md border-teal-100">
                <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50">
                  <CardTitle className="text-teal-800">{t('results.title')}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {t('results.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {resultados && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Vazões */}
                      <div className="space-y-3 p-4 border border-teal-200 rounded-lg bg-teal-50/50">
                        <h4 className="font-semibold text-sm text-teal-700">{t('results.flows.title')}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>{t('results.flows.estimated')}</span>
                            <span className="font-mono">{resultados.resultados.vazaoEstimada.toFixed(2)} l/s</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t('results.flows.considered')}</span>
                            <span className="font-mono font-semibold">{resultados.resultados.vazaoCalculada.toFixed(2)} l/s</span>
                          </div>
                        </div>
                      </div>

                      {/* Verificações Hidráulicas */}
                      <div className="space-y-3 p-4 border border-teal-200 rounded-lg bg-teal-50/50">
                        <h4 className="font-semibold text-sm text-teal-700">{t('results.verification.title')}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span>{t('results.verification.depth')}</span>
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
                            <span>{t('results.verification.tractive')}</span>
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
                            <span>{t('results.verification.velocity')}</span>
                            <span className="font-mono">{resultados.resultados.velocidade.toFixed(2)} m/s</span>
                          </div>
                        </div>
                      </div>

                      {/* Elementos Geométricos */}
                      <div className="space-y-3 p-4 border border-teal-200 rounded-lg bg-teal-50/50">
                        <h4 className="font-semibold text-sm text-teal-700">{t('results.geometric.title')}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>{t('results.geometric.area')}</span>
                            <span className="font-mono">{resultados.resultados.areaHidraulica.toFixed(6)} m²</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t('results.geometric.perimeter')}</span>
                            <span className="font-mono">{resultados.resultados.perimetroMolhado.toFixed(4)} m</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t('results.geometric.radius')}</span>
                            <span className="font-mono">{resultados.resultados.raioHidraulico.toFixed(4)} m</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t('results.geometric.height')}</span>
                            <span className="font-mono">{resultados.resultados.alturaMolhada.toFixed(4)} m</span>
                          </div>
                        </div>
                      </div>

                      {/* Parâmetros Técnicos */}
                      <div className="space-y-3 p-4 border border-teal-200 rounded-lg bg-teal-50/50">
                        <h4 className="font-semibold text-sm text-teal-700">{t('results.technical.title')}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>{t('results.technical.angle')}</span>
                            <span className="font-mono">{resultados.resultados.anguloTeta.toFixed(4)} rad</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t('results.technical.diameter')}</span>
                            <span className="font-mono">{parametros.diametro} mm</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t('results.technical.slope')}</span>
                            <span className="font-mono">{parametros.declividade.toFixed(4)} m/m</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Status Geral */}
              <Card className="shadow-md border-teal-100">
                <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50">
                  <CardTitle className="flex items-center gap-2 text-teal-800">
                    <Calculator className="w-5 h-5 text-teal-600" />
                    {t('status.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {resultados && (
                    <div className="flex items-center justify-center">
                      <Badge 
                        variant={resultados.verificacoes.sistemaOK ? "default" : "destructive"}
                        className="text-lg px-4 py-2"
                      >
                        {resultados.verificacoes.sistemaOK ? t('status.ok') : t('status.problem')}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Footer com crédito */}
        <footer className="mt-8 text-center text-xs text-gray-600">
          <p>Sewer icon by Vecteezy</p>
        </footer>
      </div>
    </div>
  )
}

export default App 