import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Trash2, Download, Eraser, Paintbrush } from "lucide-react";

interface PainelMapaDorProps {
  value?: string;
  onChange: (dataUrl: string) => void;
}

export const PainelMapaDor: React.FC<PainelMapaDorProps> = ({ value, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brushColor, setBrushColor] = useState("#4CAF50");
  const [brushSize, setBrushSize] = useState(10);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState<"draw" | "erase">("draw");

  const intensidades = [
    { label: "Leve (1-2)", color: "#4CAF50", value: "leve" },
    { label: "Leve-mod (3-4)", color: "#8BC34A", value: "leve-mod" },
    { label: "Moderada (5-6)", color: "#FFC107", value: "moderada" },
    { label: "Intensa (7-8)", color: "#FF9800", value: "intensa" },
    { label: "Severa (9-10)", color: "#F44336", value: "severa" },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Carregar imagem de fundo
    const img = new Image();
    img.src = "/assets/corpo_humano_mapa_dor.png?v=" + new Date().getTime(); // Adicionado timestamp para evitar cache
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Limpar e desenhar fundo
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Se houver um valor salvo (base64), desenhar por cima
      if (value && value.startsWith("data:image")) {
        const savedImg = new Image();
        savedImg.src = value;
        savedImg.onload = () => {
          ctx.drawImage(savedImg, 0, 0, canvas.width, canvas.height);
        };
      }
    };
  }, [value]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      
      if (mode === "erase") {
        // Para apagar e manter o fundo, precisaríamos de uma lógica mais complexa 
        // ou apenas pintar de branco se o fundo for branco. 
        // Como o fundo é uma imagem, vamos usar 'destination-out' para transparência
        // Mas para simplificar e manter o fundo visível, vamos redesenhar a imagem de fundo após apagar
        // Por enquanto, vamos usar uma cor neutra ou globalCompositeOperation
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      } else {
        ctx.strokeStyle = brushColor;
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      save();
    }
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Retornar o dataURL para o form
      onChange(canvas.toDataURL("image/png"));
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = "/assets/corpo_humano_mapa_dor.png?v=" + new Date().getTime(); // Adicionado timestamp para evitar cache
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      save();
    };
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <div className="flex-1 space-y-6 w-full">
        {/* Intensidade / Cor */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            INTENSIDADE / COR
          </label>
          <div className="flex flex-wrap gap-3">
            {intensidades.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  setBrushColor(item.color);
                  setMode("draw");
                }}
                className={`group relative flex flex-col items-center gap-1 transition-all`}
              >
                <div 
                  className={`h-10 w-10 rounded-full border-2 transition-all ${
                    brushColor === item.color && mode === "draw"
                      ? "border-primary scale-110 shadow-lg" 
                      : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[8px] font-bold uppercase text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.value}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Ferramentas e Tamanho */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              FERRAMENTAS
            </label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={mode === "draw" ? "default" : "outline"}
                size="sm"
                onClick={() => setMode("draw")}
                className="flex-1"
              >
                <Paintbrush className="h-4 w-4 mr-2" />
                Pincel
              </Button>
              <Button
                type="button"
                variant={mode === "erase" ? "default" : "outline"}
                size="sm"
                onClick={() => setMode("erase")}
                className="flex-1"
              >
                <Eraser className="h-4 w-4 mr-2" />
                Apagar
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              TAMANHO: {brushSize}px
            </label>
            <Slider
              value={[brushSize]}
              onValueChange={(val) => setBrushSize(val[0])}
              max={40}
              min={2}
              step={1}
              className="py-4"
            />
          </div>
        </div>

        <div className="pt-6 border-t space-y-4">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="w-full text-[10px] uppercase font-bold"
            onClick={clear}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar Tudo
          </Button>

          <div className="grid grid-cols-2 gap-3 p-4 bg-muted/30 rounded-lg">
            {intensidades.map(i => (
              <div key={i.value} className="flex items-center gap-2 text-[9px] uppercase font-bold">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: i.color }} />
                <span className="text-muted-foreground">{i.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative bg-white border rounded-2xl shadow-xl overflow-hidden group mx-auto md:mx-0">
        <canvas
          ref={canvasRef}
          width={450}
          height={600}
          className="cursor-crosshair touch-none max-w-full h-auto"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
           <div className="bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded">
             {mode === "draw" ? "Pintando" : "Apagando"}
           </div>
        </div>
      </div>
    </div>
  );
};
