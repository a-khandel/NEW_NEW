import { useState, useRef, useEffect } from "react";
import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import "./SecondPage.css";

function SecondPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [size, setSize] = useState({ width: 80, height: 80 }); // percentage
  const isDraggingRight = useRef(false);
  const isDraggingBottom = useRef(false);
  const isDraggingCorner = useRef(false);
  const previousSize = useRef({ width: 80, height: 80 });

  const toggleFullscreen = () => {
    if (isFullscreen) {
      setSize(previousSize.current);
      setIsFullscreen(false);
    } else {
      previousSize.current = size;
      setSize({ width: 100, height: 100 });
      setIsFullscreen(true);
    }
  };

  const handleRightEdgeStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingRight.current = true;
  };

  const handleBottomEdgeStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingBottom.current = true;
  };

  const handleCornerStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingCorner.current = true;
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRight.current && !isDraggingBottom.current && !isDraggingCorner.current) return;

      let clientX: number, clientY: number;

      if (e instanceof MouseEvent) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }

      let newWidth = size.width;
      let newHeight = size.height;

      if (isDraggingRight.current || isDraggingCorner.current) {
        newWidth = Math.min(100, Math.max(30, (clientX / window.innerWidth) * 100));
      }

      if (isDraggingBottom.current || isDraggingCorner.current) {
        newHeight = Math.min(100, Math.max(30, (clientY / window.innerHeight) * 100));
      }

      setSize({ width: newWidth, height: newHeight });

      // Check if dragged to nearly full screen
      if (newWidth > 98 && newHeight > 98) {
        setIsFullscreen(true);
      } else {
        setIsFullscreen(false);
      }
    };

    const handleEnd = () => {
      isDraggingRight.current = false;
      isDraggingBottom.current = false;
      isDraggingCorner.current = false;
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [size]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      background: 'transparent'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${size.width}vw`,
        height: `${size.height}vh`,
        margin: 0,
        padding: 0,
        transition: (isDraggingRight.current || isDraggingBottom.current || isDraggingCorner.current)
          ? 'none'
          : 'width 0.3s ease, height 0.3s ease',
        background: 'transparent',
        backdropFilter: isFullscreen ? 'none' : 'blur(40px)',
        boxShadow: isFullscreen ? 'none' : '0 8px 32px rgba(0,0,0,0.15)',
        border: isFullscreen ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: isFullscreen ? '0' : '20px',
        overflow: 'hidden',
      }}>
        <Tldraw
          components={{
            HelpMenu: null,
          }}
        />

        {/* Fullscreen Toggle Button */}
        <button
          onClick={toggleFullscreen}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10000,
            width: '48px',
            height: '48px',
            background: isFullscreen
              ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: '3px solid white',
            borderRadius: '50%',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            transition: 'transform 0.1s ease, background 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            touchAction: 'manipulation',
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {isFullscreen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          )}
        </button>

        {/* Safari-style Resize Handles */}
        {!isFullscreen && (
          <>
            {/* Right Edge Handle */}
            <div
              onMouseDown={handleRightEdgeStart}
              onTouchStart={handleRightEdgeStart}
              style={{
                position: 'absolute',
                top: 0,
                right: -6,
                width: '12px',
                height: '100%',
                cursor: 'ew-resize',
                zIndex: 10000,
                touchAction: 'none',
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{
                width: '4px',
                height: '60px',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '2px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              }} />
            </div>

            {/* Bottom Edge Handle */}
            <div
              onMouseDown={handleBottomEdgeStart}
              onTouchStart={handleBottomEdgeStart}
              style={{
                position: 'absolute',
                bottom: -6,
                left: 0,
                width: '100%',
                height: '12px',
                cursor: 'ns-resize',
                zIndex: 10000,
                touchAction: 'none',
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{
                width: '60px',
                height: '4px',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '2px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              }} />
            </div>

            {/* Corner Handle */}
            <div
              onMouseDown={handleCornerStart}
              onTouchStart={handleCornerStart}
              style={{
                position: 'absolute',
                bottom: -6,
                right: -6,
                width: '20px',
                height: '20px',
                cursor: 'nwse-resize',
                zIndex: 10001,
                touchAction: 'none',
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{
                width: '8px',
                height: '8px',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '50%',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SecondPage;
