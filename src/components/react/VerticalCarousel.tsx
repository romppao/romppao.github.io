import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";

interface ImageData {
  src: string;
  alt: string;
}

interface VerticalCarouselProps {
  imageCount: number;
  basePath?: string;
  scrollSpeed?: number; // px per step
  interval?: number; // ms per step
}

const VerticalCarousel: React.FC<VerticalCarouselProps> = ({
  imageCount,
  scrollSpeed = 3,
  interval = 50,
}) => {
  const [images, setImages] = useState<ImageData[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const lastTsRef = useRef<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const x = useMotionValue(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detecta si es mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Define las imágenes en el orden especificado
    const availableImages = [
      { src: '/assets/photo_2_2025-10-20_21-32-55.jpg', alt: 'Slider image 1' },
      { src: '/assets/photo_4_2025-10-20_21-32-55.jpg', alt: 'Slider image 2' },
      { src: '/assets/photo_1_2025-10-20_21-32-55.jpg', alt: 'Slider image 3' },
    ];
    
    const count = Math.min(Math.max(0, imageCount), availableImages.length);
    const prepared: ImageData[] = availableImages.slice(0, count);
    setImages(prepared);
  }, [imageCount]);

  useEffect(() => {
    // reinicia posición al cambiar imágenes o velocidad
    y.set(0);
    x.set(0);
    lastTsRef.current = null;
  }, [images, scrollSpeed, interval, y, x]);

  useAnimationFrame((t, delta) => {
    const container = carouselRef.current;
    const content = contentRef.current;
    if (!container || !content || images.length === 0) return;

    const pixelsPerSecond = (scrollSpeed * 1000) / Math.max(1, interval);
    const distance = (pixelsPerSecond * delta) / 1000; // px por frame

    if (isMobile) {
      // Scroll horizontal en mobile
      const maxScroll = Math.max(
        0,
        content.scrollWidth - container.clientWidth
      );
      if (maxScroll <= 0) return;

      let nextX = x.get() - distance; // desplazamiento hacia la izquierda
      if (Math.abs(nextX) >= maxScroll - 1) {
        nextX = 0; // reinicio de bucle
      }
      x.set(nextX);
    } else {
      // Scroll vertical en desktop
      const maxScroll = Math.max(
        0,
        content.scrollHeight - container.clientHeight
      );
      if (maxScroll <= 0) return;

      let nextY = y.get() - distance; // desplazamiento hacia arriba
      if (Math.abs(nextY) >= maxScroll - 1) {
        nextY = 0; // reinicio de bucle
      }
      y.set(nextY);
    }
  });

  if (images.length === 0) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-100 gap-2">
        {["#d991c2", "#9869b8", "#6756cc"].map((color, index) => (
          <div
            key={index}
            className={`w-5 h-5 rounded-full animate-bounce`}
            style={{
              backgroundColor: color,
              animationDelay: `${index * 0.1}s`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden relative" ref={carouselRef}>
      <motion.div
        ref={contentRef}
        style={{ 
          y: isMobile ? 0 : y, 
          x: isMobile ? x : 0, 
          willChange: "transform" 
        }}
        className={`h-full flex gap-10 ${isMobile ? 'flex-row items-center' : 'flex-col'}`}
      >
        {images.map(({ src, alt }, index) => (
          <div key={index} className={`flex justify-center flex-grow ${isMobile ? 'min-w-[90vw]' : ''}`}>
            <img
              src={src}
              alt={alt}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
              fetchPriority={index === 0 ? "high" : "auto"}
              className={`object-contain ${isMobile ? 'max-h-[80vh] max-w-[90vw]' : 'max-w-full max-h-[80vh]'}`}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default VerticalCarousel;
