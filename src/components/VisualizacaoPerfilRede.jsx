import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const VisualizacaoPerfilRede = ({ resultados, parametros }) => {
  const declividade = parametros?.declividade || 0.005;
  const diametro = parametros?.diametro || 150;
  const lamina = resultados?.resultados?.laminaLiquida || 0;
  const alturaMolhada = resultados?.resultados?.alturaMolhada * 1000 || 0; // em mm

  const viewBoxWidth = 500;
  const viewBoxHeight = 200;
  const pipeLength = 400;
  const startX = 50;
  const endX = startX + pipeLength;
  
  // Center the pipe vertically
  const pipeCenterY = viewBoxHeight / 2;
  
  // Exaggerate slope for visibility (multiply by 1000)
  const exaggeratedSlope = declividade * 1000;
  const slopeRise = pipeLength * exaggeratedSlope;
  
  // Pipe dimensions in the visualization
  const pipeRadius = Math.max(8, diametro / 20); // Proportional to actual diameter
  
  // Start and end Y coordinates of pipe center
  const startCenterY = pipeCenterY - slopeRise / 2;
  const endCenterY = pipeCenterY + slopeRise / 2;
  
  // Water height inside the pipe
  const waterThickness = lamina * (pipeRadius * 2);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil da Rede</CardTitle>
        <CardDescription>Vista longitudinal com declividade</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full">
          <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="w-full h-full">
            <defs>
              {/* Gradient for pipe walls */}
              <linearGradient id="pipeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9ca3af" />
                <stop offset="50%" stopColor="#d1d5db" />
                <stop offset="100%" stopColor="#9ca3af" />
              </linearGradient>
              
              {/* Pattern for water flow */}
              <pattern id="waterFlow" patternUnits="userSpaceOnUse" width="20" height="8">
                <rect width="20" height="8" fill="#3b82f6" fillOpacity="0.3"/>
                <path d="M0 4 Q5 2 10 4 T20 4" stroke="#1d4ed8" strokeWidth="1" fill="none" opacity="0.8"/>
              </pattern>
            </defs>

            {/* Ground line */}
            <line 
              x1="0" 
              y1={startCenterY - pipeRadius - 15} 
              x2={viewBoxWidth} 
              y2={endCenterY - pipeRadius - 15} 
              stroke="#92400e" 
              strokeWidth="2" 
              strokeDasharray="5,5"
            />
            <text x="10" y={startCenterY - pipeRadius - 20} fontSize="10" fill="#92400e">
              Superfície do terreno
            </text>

            {/* Pipe outline - top */}
            <line 
              x1={startX} 
              y1={startCenterY - pipeRadius} 
              x2={endX} 
              y2={endCenterY - pipeRadius} 
              stroke="#4b5563" 
              strokeWidth="3" 
              strokeLinecap="round"
            />
            
            {/* Pipe outline - bottom */}
            <line 
              x1={startX} 
              y1={startCenterY + pipeRadius} 
              x2={endX} 
              y2={endCenterY + pipeRadius} 
              stroke="#4b5563" 
              strokeWidth="3" 
              strokeLinecap="round"
            />

            {/* Water flow inside pipe */}
            {lamina > 0 && (
              <>
                {/* Water area */}
                <polygon 
                  points={`${startX},${startCenterY + pipeRadius} 
                           ${endX},${endCenterY + pipeRadius} 
                           ${endX},${endCenterY + pipeRadius - waterThickness} 
                           ${startX},${startCenterY + pipeRadius - waterThickness}`}
                  fill="url(#waterFlow)"
                  stroke="#2563eb"
                  strokeWidth="1"
                />
                
                {/* Water surface line */}
                <line 
                  x1={startX} 
                  y1={startCenterY + pipeRadius - waterThickness} 
                  x2={endX} 
                  y2={endCenterY + pipeRadius - waterThickness} 
                  stroke="#0ea5e9" 
                  strokeWidth="2" 
                  strokeDasharray="4,2"
                />
              </>
            )}

            {/* Pipe center line (hydraulic gradient) */}
            <line 
              x1={startX} 
              y1={startCenterY} 
              x2={endX} 
              y2={endCenterY} 
              stroke="#6b7280" 
              strokeWidth="1" 
              strokeDasharray="3,3"
            />

            {/* Dimension lines and labels */}
            
            {/* Slope indicator */}
            <g>
              {/* Slope triangle */}
              <polygon 
                points={`${endX - 80},${endCenterY} ${endX - 80},${startCenterY} ${endX - 20},${endCenterY}`}
                fill="none" 
                stroke="#7c2d12" 
                strokeWidth="1.5"
              />
              <text 
                x={endX - 50} 
                y={endCenterY - 5} 
                fontSize="9" 
                fill="#7c2d12" 
                textAnchor="middle"
              >
                i = {(declividade * 100).toFixed(2)}%
              </text>
            </g>

            {/* Diameter indicator */}
            <g>
              <line 
                x1={startX - 15} 
                y1={startCenterY - pipeRadius} 
                x2={startX - 15} 
                y2={startCenterY + pipeRadius} 
                stroke="#374151" 
                strokeWidth="1.5"
              />
              <polygon 
                points={`${startX - 15},${startCenterY - pipeRadius} ${startX - 18},${startCenterY - pipeRadius + 3} ${startX - 12},${startCenterY - pipeRadius + 3}`}
                fill="#374151" 
              />
              <polygon 
                points={`${startX - 15},${startCenterY + pipeRadius} ${startX - 18},${startCenterY + pipeRadius - 3} ${startX - 12},${startCenterY + pipeRadius - 3}`}
                fill="#374151" 
              />
              <text 
                x={startX - 25} 
                y={startCenterY} 
                fontSize="9" 
                fill="#374151" 
                textAnchor="end" 
                dominantBaseline="middle" 
                transform={`rotate(-90, ${startX - 25}, ${startCenterY})`}
              >
                D = {diametro} mm
              </text>
            </g>

            {/* Water height indicator */}
            {lamina > 0 && (
              <g>
                <line 
                  x1={endX + 10} 
                  y1={endCenterY + pipeRadius} 
                  x2={endX + 10} 
                  y2={endCenterY + pipeRadius - waterThickness} 
                  stroke="#dc2626" 
                  strokeWidth="1.5"
                />
                <polygon 
                  points={`${endX + 10},${endCenterY + pipeRadius} ${endX + 7},${endCenterY + pipeRadius - 3} ${endX + 13},${endCenterY + pipeRadius - 3}`}
                  fill="#dc2626" 
                />
                <polygon 
                  points={`${endX + 10},${endCenterY + pipeRadius - waterThickness} ${endX + 7},${endCenterY + pipeRadius - waterThickness + 3} ${endX + 13},${endCenterY + pipeRadius - waterThickness + 3}`}
                  fill="#dc2626" 
                />
                <text 
                  x={endX + 20} 
                  y={endCenterY + pipeRadius - waterThickness/2} 
                  fontSize="9" 
                  fill="#dc2626" 
                  textAnchor="start" 
                  dominantBaseline="middle"
                >
                  y = {alturaMolhada.toFixed(1)} mm
                </text>
              </g>
            )}

            {/* Flow direction arrow */}
            <g>
              <path 
                d={`M ${startX + 50} ${startCenterY - 25} L ${startX + 80} ${endCenterY - 25} L ${startX + 75} ${endCenterY - 30} M ${startX + 80} ${endCenterY - 25} L ${startX + 75} ${endCenterY - 20}`}
                stroke="#059669" 
                strokeWidth="2" 
                fill="none"
              />
              <text 
                x={startX + 65} 
                y={startCenterY - 30} 
                fontSize="9" 
                fill="#059669" 
                textAnchor="middle"
              >
                Fluxo
              </text>
            </g>

            {/* Information text */}
            <text 
              x={viewBoxWidth / 2} 
              y={viewBoxHeight - 10} 
              textAnchor="middle" 
              fontSize="10" 
              fill="#4b5563"
            >
              Lâmina: {(lamina * 100).toFixed(1)}% | Declividade: {(declividade * 100).toFixed(3)}% | L = {pipeLength/4}m (escala aproximada)
            </text>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualizacaoPerfilRede; 