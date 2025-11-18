import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/i18n/LanguageProvider";

const VisualizacaoPerfilRede = ({ resultados, parametros }) => {
  const { t } = useLanguage();
  
  if (!resultados) return null

  const { laminaLiquida, velocidade, forcaTraativa } = resultados.resultados
  const { diametro, declividade, forcaTrativaMin } = parametros

  // Configurações do SVG
  const svgWidth = 400
  const svgHeight = 200
  const tuboLength = 300
  const tuboHeight = 40
  
  // Exagerar a inclinação para melhor visualização (multiplicar por fator de escala)
  const fatorEscalaDeclividade = 50 // Exagerar 50x para visualização
  const inclinacaoVisual = declividade * tuboLength * fatorEscalaDeclividade
  
  // Limitar a inclinação visual para não sair da tela
  const inclinacaoLimitada = Math.min(inclinacaoVisual, svgHeight * 0.3)
  
  // Posições do tubo
  const startX = 50
  const startY = svgHeight - 100
  const endX = startX + tuboLength
  const endY = startY - inclinacaoLimitada
  
  // Altura da água no tubo
  const alturaAguaRelativa = laminaLiquida
  const alturaAguaPixels = tuboHeight * alturaAguaRelativa
  
  // Determinar cor baseada na força trativa
  const corAgua = forcaTraativa >= forcaTrativaMin ? '#3B82F6' : '#EF4444'
  const statusFluxo = forcaTraativa >= forcaTrativaMin ? 'normal' : 'sedimentacao'

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('visualization.profile.title')}</CardTitle>
        <CardDescription>{t('visualization.profile.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <svg width={svgWidth} height={svgHeight} className="border border-gray-200 rounded">
            {/* Linha do terreno/referência */}
            <line
              x1={0}
              y1={svgHeight - 20}
              x2={svgWidth}
              y2={svgHeight - 20}
              stroke="#8B5CF6"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            
            {/* Tubulação (contorno superior) */}
            <line
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="#374151"
              strokeWidth="3"
            />
            
            {/* Tubulação (contorno inferior) */}
            <line
              x1={startX}
              y1={startY + tuboHeight}
              x2={endX}
              y2={endY + tuboHeight}
              stroke="#374151"
              strokeWidth="3"
            />
            
            {/* Laterais da tubulação */}
            <line
              x1={startX}
              y1={startY}
              x2={startX}
              y2={startY + tuboHeight}
              stroke="#374151"
              strokeWidth="3"
            />
            <line
              x1={endX}
              y1={endY}
              x2={endX}
              y2={endY + tuboHeight}
              stroke="#374151"
              strokeWidth="3"
            />
            
            {/* Água/esgoto dentro da tubulação */}
            {alturaAguaRelativa > 0 && (
              <polygon
                points={`
                  ${startX},${startY + tuboHeight - alturaAguaPixels}
                  ${endX},${endY + tuboHeight - alturaAguaPixels}
                  ${endX},${endY + tuboHeight}
                  ${startX},${startY + tuboHeight}
                `}
                fill={corAgua}
                fillOpacity="0.7"
                stroke={corAgua}
                strokeWidth="1"
              />
            )}
            
            {/* Superfície da água */}
            {alturaAguaRelativa > 0 && (
              <line
                x1={startX}
                y1={startY + tuboHeight - alturaAguaPixels}
                x2={endX}
                y2={endY + tuboHeight - alturaAguaPixels}
                stroke={corAgua}
                strokeWidth="2"
                strokeDasharray="3,3"
              />
            )}
            
            {/* Setas indicando fluxo */}
            {statusFluxo === 'normal' && (
              <>
                <polygon
                  points={`${startX + 70},${startY + tuboHeight/2 - 5} ${startX + 80},${startY + tuboHeight/2} ${startX + 70},${startY + tuboHeight/2 + 5}`}
                  fill="#10B981"
                />
                <polygon
                  points={`${startX + 130},${(startY + endY)/2 + tuboHeight/2 - 5} ${startX + 140},${(startY + endY)/2 + tuboHeight/2} ${startX + 130},${(startY + endY)/2 + tuboHeight/2 + 5}`}
                  fill="#10B981"
                />
                <polygon
                  points={`${startX + 190},${endY + tuboHeight/2 - 5} ${startX + 200},${endY + tuboHeight/2} ${startX + 190},${endY + tuboHeight/2 + 5}`}
                  fill="#10B981"
                />
              </>
            )}
            
            {/* Partículas de sedimento (se força trativa insuficiente) */}
            {statusFluxo === 'sedimentacao' && (
              <>
                <circle cx={startX + 80} cy={startY + tuboHeight - 5} r="2" fill="#8B5CF6" />
                <circle cx={startX + 100} cy={startY + tuboHeight - 3} r="1.5" fill="#8B5CF6" />
                <circle cx={startX + 150} cy={(startY + endY)/2 + tuboHeight - 4} r="2" fill="#8B5CF6" />
                <circle cx={startX + 170} cy={(startY + endY)/2 + tuboHeight - 2} r="1" fill="#8B5CF6" />
                <circle cx={startX + 220} cy={endY + tuboHeight - 3} r="1.5" fill="#8B5CF6" />
              </>
            )}
            
            {/* Dimensões e anotações */}
            {/* Diâmetro */}
            <g>
              <line
                x1={startX - 20}
                y1={startY}
                x2={startX - 20}
                y2={startY + tuboHeight}
                stroke="#6B7280"
                strokeWidth="1"
              />
              <text
                x={startX - 35}
                y={(startY + startY + tuboHeight) / 2}
                textAnchor="middle"
                className="text-xs font-medium fill-gray-700"
                transform={`rotate(-90, ${startX - 35}, ${(startY + startY + tuboHeight) / 2})`}
              >
                Ø {diametro}mm
              </text>
            </g>
            
            {/* Declividade com escala exagerada */}
            <g>
              <text
                x={startX + tuboLength / 2}
                y={Math.min(startY, endY) - 15}
                textAnchor="middle"
                className="text-xs font-medium fill-gray-700"
              >
                i = {declividade.toFixed(4)} m/m
              </text>
              <text
                x={startX + tuboLength / 2}
                y={Math.min(startY, endY) - 5}
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                ({t('visualization.profile.exaggeratedScale')} {fatorEscalaDeclividade}x)
              </text>
            </g>
            
            {/* Velocidade */}
            <g>
              <text
                x={startX + tuboLength / 2}
                y={Math.max(startY, endY) + tuboHeight + 25}
                textAnchor="middle"
                className="text-xs font-medium fill-blue-700"
              >
                V = {velocidade.toFixed(2)} m/s
              </text>
            </g>
            
            {/* Linha de referência do terreno */}
            <text
              x={svgWidth - 80}
              y={svgHeight - 5}
              className="text-xs fill-purple-600"
            >
              {t('visualization.profile.referenceLevel')}
            </text>
            
            {/* Indicação da direção do fluxo */}
            <text
              x={endX + 10}
              y={endY + tuboHeight/2}
              className="text-xs fill-green-600 font-medium"
            >
              →
            </text>
          </svg>
        </div>
        
        {/* Status e legenda */}
        <div className="mt-4">
          <div className="flex justify-center mb-3">
            <div className={`px-3 py-1 rounded text-sm font-medium ${
              statusFluxo === 'normal' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {statusFluxo === 'normal' 
                ? t('visualization.profile.normalFlow')
                : t('visualization.profile.sedimentationRisk')}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${
                statusFluxo === 'normal' ? 'bg-blue-500' : 'bg-red-500'
              } bg-opacity-70`}></div>
              <span>{t('visualization.profile.wastewater')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-700 rounded"></div>
              <span>{t('visualization.profile.pipe')}</span>
            </div>
            {statusFluxo === 'normal' ? (
              <div className="flex items-center gap-2">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-green-500"></div>
                <span>{t('visualization.profile.flowDirection')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>{t('visualization.profile.sediments')}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-purple-600" style={{borderStyle: 'dashed'}}></div>
              <span>{t('visualization.profile.reference')}</span>
            </div>
          </div>
        </div>
        
        {/* Informações do fluxo */}
        <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium">{t('visualization.profile.tractiveForce')}:</span> {forcaTraativa.toFixed(2)} Pa
            </div>
            <div>
              <span className="font-medium">{t('visualization.profile.minimum')}:</span> {forcaTrativaMin} Pa
            </div>
            <div>
              <span className="font-medium">{t('visualization.profile.velocity')}:</span> {velocidade.toFixed(2)} m/s
            </div>
            <div>
              <span className="font-medium">{t('visualization.profile.depthLabel')}:</span> {(laminaLiquida * 100).toFixed(1)}%
            </div>
          </div>
          
          {statusFluxo === 'sedimentacao' && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700">
              <strong>{t('visualization.profile.warning')}:</strong> {t('visualization.profile.warningMessage')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default VisualizacaoPerfilRede
