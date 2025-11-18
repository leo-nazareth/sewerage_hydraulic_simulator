import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/i18n/LanguageProvider";

const VisualizacaoSecaoTubulacao = ({ resultados, parametros }) => {
  const { t } = useLanguage();
  
  if (!resultados) return null

  const { laminaLiquida, forcaTraativa } = resultados.resultados
  const { diametro, laminaMaxima, forcaTrativaMin } = parametros
  
  // Verificar se há risco de sedimentação
  const temSedimentacao = forcaTraativa < forcaTrativaMin

  // Configurações do SVG
  const svgSize = 300
  const center = svgSize / 2
  const radius = 120
  
  // Verificar se lâmina excede critério
  const laminaExcedeCriterio = laminaLiquida > laminaMaxima
  
  // Calcular a altura da água baseada na lâmina líquida
  // A água preenche de baixo para cima
  const alturaAguaRelativa = laminaLiquida // fração do diâmetro
  
  // Função para criar o path da área molhada (preenchimento de baixo para cima)
  const criarPathAreaMolhada = () => {
    if (alturaAguaRelativa <= 0) return ""
    if (alturaAguaRelativa >= 1) {
      // Tubulação completamente cheia
      return `M ${center} ${center} m -${radius} 0 a ${radius} ${radius} 0 1 1 ${radius * 2} 0 a ${radius} ${radius} 0 1 1 -${radius * 2} 0`
    }
    
    // Calcular a altura da água em pixels
    const alturaAguaPixels = alturaAguaRelativa * (radius * 2)
    const ySuperficie = center + radius - alturaAguaPixels
    
    // Calcular os pontos onde a superfície da água intersecta o círculo
    const h = radius - alturaAguaPixels // distância do centro até a superfície
    const w = Math.sqrt(radius * radius - h * h) // meia largura da superfície
    
    const x1 = center - w
    const x2 = center + w
    const y = ySuperficie
    
    // Criar o path: arco da parte inferior + linha reta da superfície
    const largeArcFlag = alturaAguaRelativa > 0.5 ? 1 : 0
    
    return `M ${x1} ${y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${x2} ${y} Z`
  }

  // Calcular posição Y da superfície da água
  const calcularSuperficieAgua = () => {
    if (alturaAguaRelativa <= 0) return center + radius
    if (alturaAguaRelativa >= 1) return center - radius
    
    const alturaAguaPixels = alturaAguaRelativa * (radius * 2)
    return center + radius - alturaAguaPixels
  }

  const superficieY = calcularSuperficieAgua()
  
  // Calcular largura da superfície da água
  const calcularLarguraSuperficie = () => {
    if (alturaAguaRelativa <= 0 || alturaAguaRelativa >= 1) return 0
    
    const h = radius - (alturaAguaRelativa * radius * 2)
    const w = Math.sqrt(radius * radius - h * h)
    return w * 2
  }

  const larguraSuperficie = calcularLarguraSuperficie()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('visualization.section.title')}</CardTitle>
        <CardDescription>{t('visualization.section.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <svg width={svgSize} height={svgSize} className="border border-gray-200 rounded">
            {/* Círculo da tubulação */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#374151"
              strokeWidth="3"
            />
            
            {/* Área molhada (água) - preenchimento de baixo para cima */}
            {alturaAguaRelativa > 0 && (
              <path
                d={criarPathAreaMolhada()}
                fill="#3B82F6"
                fillOpacity="0.6"
                stroke="#1D4ED8"
                strokeWidth="1"
              />
            )}
            
            {/* Linha da superfície da água */}
            {alturaAguaRelativa > 0 && alturaAguaRelativa < 1 && larguraSuperficie > 0 && (
              <line
                x1={center - larguraSuperficie / 2}
                y1={superficieY}
                x2={center + larguraSuperficie / 2}
                y2={superficieY}
                stroke="#1D4ED8"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            )}
            
            {/* Partículas de sedimento (se força trativa insuficiente) */}
            {temSedimentacao && alturaAguaRelativa > 0 && (() => {
              const alturaAguaPixels = alturaAguaRelativa * (radius * 2);
              const ySuperficie = center + radius - alturaAguaPixels;
              
              // Verificar se um ponto (x, y) está dentro da área molhada
              const estaDentroAreaMolhada = (x, y) => {
                // Verificar se está abaixo da superfície da água
                if (y < ySuperficie) return false;
                
                // Verificar se está dentro do círculo
                const dx = x - center;
                const dy = y - center;
                const distanciaDoCenter = Math.sqrt(dx * dx + dy * dy);
                return distanciaDoCenter <= radius;
              };
              
              // Lista de sedimentos com suas posições
              const sedimentos = [
                { x: center, y: center + radius - 3, r: 2.5 },
                { x: center - 7, y: center + radius - 4, r: 2 },
                { x: center + 4, y: center + radius - 3.5, r: 2 },
                { x: center - 3, y: center + radius - 6, r: 1.8 },
                { x: center + 6, y: center + radius - 5, r: 1.5 },
                { x: center - 10, y: center + radius - 5, r: 1.5 },
                { x: center + 9, y: center + radius - 7, r: 1.3 },
                { x: center - 5, y: center + radius - 8, r: 1.5 },
                { x: center + 2, y: center + radius - 9, r: 1.2 },
                { x: center - 8, y: center + radius - 7, r: 1.4 },
                { x: center + 11, y: center + radius - 6, r: 1.3 },
                { x: center - 2, y: center + radius - 10, r: 1 },
              ];
              
              // Sedimentos adicionais se houver água suficiente
              if (alturaAguaRelativa > 0.15) {
                sedimentos.push(
                  { x: center - 15, y: center + radius - 10, r: 1.2 },
                  { x: center + 13, y: center + radius - 11, r: 1 }
                );
              }
              
              if (alturaAguaRelativa > 0.2) {
                sedimentos.push(
                  { x: center - 18, y: center + radius - 13, r: 1 },
                  { x: center + 16, y: center + radius - 14, r: 0.9 },
                  { x: center - 12, y: center + radius - 12, r: 1.1 }
                );
              }
              
              // Renderizar apenas sedimentos que estão dentro da área molhada
              return (
                <>
                  {sedimentos.map((sed, idx) => 
                    estaDentroAreaMolhada(sed.x, sed.y) && (
                      <circle 
                        key={idx}
                        cx={sed.x} 
                        cy={sed.y} 
                        r={sed.r} 
                        fill="#8B5CF6" 
                      />
                    )
                  )}
                </>
              );
            })()}
            
            {/* Linha do diâmetro */}
            <line
              x1={center - radius}
              y1={center}
              x2={center + radius}
              y2={center}
              stroke="#6B7280"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
            
            {/* Linha da altura molhada */}
            {alturaAguaRelativa > 0 && (
              <line
                x1={center}
                y1={center + radius}
                x2={center}
                y2={superficieY}
                stroke="#EF4444"
                strokeWidth="2"
              />
            )}
            
            {/* Setas e dimensões */}
            {/* Diâmetro */}
            <g>
              <text
                x={center}
                y={center - radius - 15}
                textAnchor="middle"
                className="text-sm font-medium fill-gray-700"
              >
                Ø {diametro} mm
              </text>
              <line
                x1={center - radius - 10}
                y1={center - radius - 5}
                x2={center + radius + 10}
                y2={center - radius - 5}
                stroke="#374151"
                strokeWidth="1"
                markerEnd="url(#arrowhead)"
                markerStart="url(#arrowhead)"
              />
            </g>
            
            {/* Altura molhada */}
            {alturaAguaRelativa > 0 && (
              <g>
                <text
                  x={center + 10}
                  y={(center + radius + superficieY) / 2}
                  textAnchor="start"
                  className={`text-sm font-medium ${laminaExcedeCriterio ? 'fill-red-600' : 'fill-blue-600'}`}
                >
                  y
                </text>
              </g>
            )}
            
            {/* Definir marcadores de seta */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#374151"
                />
              </marker>
            </defs>
          </svg>
        </div>
        
        {/* Legenda */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 bg-opacity-60 border border-blue-700 rounded"></div>
            <span>{t('visualization.section.wettedArea')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-red-500"></div>
            <span>{t('visualization.section.wettedHeight')}</span>
          </div>
        </div>
        
        {/* Informações simplificadas */}
        <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
          <div className="flex justify-center">
            <div className={`font-medium ${laminaExcedeCriterio ? 'text-red-600' : 'text-blue-600'}`}>
              {t('visualization.section.depthLabel')} {(laminaLiquida * 100).toFixed(1)}%
              {laminaExcedeCriterio && (
                <span className="ml-2 text-red-600 font-bold">⚠ {t('visualization.section.exceedsCriteria')}</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default VisualizacaoSecaoTubulacao 