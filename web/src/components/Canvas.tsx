import { useEffect, useRef } from "react";

function Canvas ({ width, height }: { width: number, height: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function createGradient(x0: number, y0: number, x1: number, y1: number, colors: string[]) {
      if (!ctx) return;
      let gradient = ctx.createLinearGradient(x0, y0, x1, y1);
      colors.forEach((color: string, index: number) => {
        gradient.addColorStop(index / (colors.length - 1), color);
      });
      return gradient;
    }
    
    let colors1 = ['#B6FBFF', '#ABDCFF', '#FEB692', '#FE90AF', '#DCB0F2', '#8A76FF', '#78FFD6'];
    let colors2 = ['#FF9A8B', '#FFDDE1', '#BEE3F8', '#67B26F', '#4AC29A', '#FFF6B7', '#FFB347'];
        
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = createGradient(0, 0, width, 0, colors1) as CanvasGradient;
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = createGradient(0, 0, width, 0, colors2) as CanvasGradient;
    ctx.fillRect(0, 0, width, height);
    
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = createGradient(0, 0, width, height, colors1) as CanvasGradient;
    ctx.fillRect(0, 0, width, height);
    
    ctx.globalCompositeOperation = 'source-over';
  })

  return <canvas ref={canvasRef} width={width} height={height}></canvas>
}

export default Canvas