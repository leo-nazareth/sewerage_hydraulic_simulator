import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const VisualizacaoSecaoTubulacao = ({ resultados, parametros }) => {
  const diametro = parametros?.diametro || 150;
  const lamina = resultados?.resultados?.laminaLiquida || 0;
  const alturaMolhada = resultados?.resultados?.alturaMolhada * 1000 || 0; // em mm
  const anguloTeta = resultados?.resultados?.anguloTeta || 0;

  const viewBoxSize = 200;
  const center = viewBoxSize / 2;
  const radius = viewBoxSize / 2 - 20; // More space for labels
  const pipeThickness = 3;

  const criarPathAreaMolhada = () => {
    if (lamina <= 0) return "";
    if (lamina >= 1) {
      // Full pipe
      return `M ${center - radius}, ${center} 
              A ${radius},${radius} 0 1,0 ${center + radius},${center} 
              A ${radius},${radius} 0 1,0 ${center - radius},${center}`;
    }
    
    // Calculate the height of water from bottom of pipe
    const waterHeight = lamina * (radius * 2);
    // Y coordinate of water surface (from top of viewBox)
    const waterSurfaceY = center + radius - waterHeight;
    
    // Distance from center to water surface
    const d = waterSurfaceY - center;
    
    // Half-width of water surface using pythagorean theorem
    const halfWidth = Math.sqrt(Math.max(0, radius * radius - d * d));
    
    // Points where water surface intersects the circle
    const x1 = center - halfWidth;
    const x2 = center + halfWidth;
    const y = waterSurfaceY;
    
    // Large arc flag: 1 if more than half circle (lamina > 0.5), 0 otherwise
    const largeArcFlag = lamina > 0.5 ? 1 : 0;
    
    // Create path for wetted area (circular segment)
    // Move to left intersection point, draw arc to right intersection point, close with line
    return `M ${x1},${y} 
            A ${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y} 
            Z`;
  };

  const pathAreaMolhada = criarPathAreaMolhada();
  
  const calcularSuperficieAgua = () => {
    if (lamina <= 0 || lamina >= 1) return { y: 0, width: 0 };
    
    const waterHeight = lamina * (radius * 2);
    const waterSurfaceY = center + radius - waterHeight;
    const d = waterSurfaceY - center;
    const halfWidth = Math.sqrt(Math.max(0, radius * radius - d * d));
    
    return { 
      y: waterSurfaceY, 
      width: halfWidth * 2,
      x1: center - halfWidth,
      x2: center + halfWidth
    };
  };

  const superficie = calcularSuperficieAgua();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seção da Tubulação</CardTitle>
        <CardDescription>Visualização da área molhada</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-square w-full">
          <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="w-full h-full">
            {/* Tubo externo (outline) */}
            <circle 
              cx={center} 
              cy={center} 
              r={radius} 
              fill="none" 
              stroke="#6b7280" 
              strokeWidth={pipeThickness} 
            />
            
            {/* Área molhada (wetted area) */}
            {lamina > 0 && (
              <path 
                d={pathAreaMolhada} 
                fill="#3b82f6" 
                fillOpacity="0.6" 
                stroke="#2563eb"
                strokeWidth="1"
              />
            )}

            {/* Linha da superfície da água (horizontal) */}
            {lamina > 0 && lamina < 1 && superficie.width > 0 && (
              <line 
                x1={superficie.x1} 
                y1={superficie.y} 
                x2={superficie.x2} 
                y2={superficie.y} 
                stroke="#0ea5e9"
                strokeWidth="2"
                strokeDasharray="3,2"
              />
            )}

            {/* Linha central vertical (diâmetro) */}
            <line 
              x1={center} 
              y1={center - radius - 5} 
              x2={center} 
              y2={center + radius + 5} 
              stroke="#374151" 
              strokeWidth="1" 
              strokeDasharray="4,2" 
            />
            
            {/* Cota do diâmetro */}
            <text 
              x={center + radius + 8} 
              y={center} 
              fontSize="10" 
              fill="#374151"
              textAnchor="start"
              dominantBaseline="middle"
            >
              D = {diametro} mm
            </text>
            
            {/* Altura molhada (y) - linha e cota */}
            {lamina > 0 && (
              <>
                {/* Linha indicando altura molhada */}
                <line 
                  x1={center - radius - 10} 
                  y1={center + radius} 
                  x2={center - radius - 10} 
                  y2={superficie.y} 
                  stroke="#dc2626" 
                  strokeWidth="1.5" 
                />
                
                {/* Setas indicativas */}
                <polygon 
                  points={`${center - radius - 10},${center + radius} ${center - radius - 13},${center + radius - 3} ${center - radius - 7},${center + radius - 3}`}
                  fill="#dc2626" 
                />
                <polygon 
                  points={`${center - radius - 10},${superficie.y} ${center - radius - 13},${superficie.y + 3} ${center - radius - 7},${superficie.y + 3}`}
                  fill="#dc2626" 
                />
                
                {/* Texto da altura molhada */}
                <text 
                  x={center - radius - 15} 
                  y={center + radius - (center + radius - superficie.y) / 2} 
                  fontSize="9" 
                  fill="#dc2626"
                  textAnchor="end"
                  dominantBaseline="middle"
                >
                  y = {alturaMolhada.toFixed(1)} mm
                </text>
              </>
            )}
            
            {/* Informações principais */}
            <text x={10} y={15} fontSize="11" fontWeight="bold" fill="#1f2937">
              y/D = {(lamina * 100).toFixed(1)}%
            </text>
            
            {/* Ângulo teta para referência */}
            <text x={10} y={viewBoxSize - 10} fontSize="8" fill="#6b7280">
              θ = {(anguloTeta * 180 / Math.PI).toFixed(1)}°
            </text>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualizacaoSecaoTubulacao; 