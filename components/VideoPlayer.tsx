'use client';

import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  title: string;
  src: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoBlobUrl, setVideoBlobUrl] = useState<string>('');

  // Simple obfuscation - in production, use proper encryption
  const decodeUrl = (encodedUrl: string): string => {
    try {
      // Simple base64 decode - replace with proper encryption in production
      return atob(encodedUrl);
    } catch {
      return encodedUrl; // Fallback to original if decoding fails
    }
  };

  useEffect(() => {
    // Decode the URL only when needed
    const actualSrc = decodeUrl(src);

    // Create a blob URL to hide the original URL from DOM inspection
    const createBlobUrl = async (url: string) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        setVideoBlobUrl(blobUrl);
      } catch (error) {
        console.error('Failed to create blob URL:', error);
        // Fallback to original URL if blob creation fails
        setVideoBlobUrl(actualSrc);
      }
    };

    createBlobUrl(actualSrc);

    // Cleanup blob URL on unmount
    return () => {
      if (videoBlobUrl && videoBlobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoBlobUrl);
      }
    };
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoBlobUrl) return;

    if (videoBlobUrl.endsWith('.m3u8') && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoBlobUrl);
      hls.attachMedia(video);
      return () => {
        hls.destroy();
      };
    } else {
      video.src = videoBlobUrl;
    }
  }, [videoBlobUrl]);

  // Prevent right-click context menu
  const handleContextMenu = (e: React.MouseEvent<HTMLVideoElement>) => {
    e.preventDefault();
    return false;
  };

  // Prevent developer tools access and additional protections
  useEffect(() => {
    const preventDevTools = (e: KeyboardEvent) => {
      // Prevent F12, Ctrl+Shift+I, Ctrl+U, Ctrl+Shift+C
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C')
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Prevent console access
    const preventConsole = () => {
      // Override console methods to prevent debugging
      const noop = () => {};
      console.log = noop;
      console.warn = noop;
      console.error = noop;
      console.info = noop;
    };

    // Prevent element inspection
    const preventInspection = () => {
      // Override getElementById to prevent easy access
      const originalGetElementById = document.getElementById;
      document.getElementById = function (id: string) {
        const element = originalGetElementById.call(document, id);
        if (element && element.tagName === 'VIDEO') {
          // Return a proxy that hides sensitive properties
          return new Proxy(element, {
            get(target, prop) {
              if (prop === 'src' || prop === 'currentSrc') {
                return '';
              }
              return target[prop as keyof typeof target];
            },
          });
        }
        return element;
      };
    };

    document.addEventListener('keydown', preventDevTools);
    preventConsole();
    preventInspection();

    return () => {
      document.removeEventListener('keydown', preventDevTools);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      controls
      className='w-full max-h-[500px] object-contain'
      controlsList='nodownload noremoteplayback noplaybackrate'
      onContextMenu={handleContextMenu}
      onCopy={(e: React.ClipboardEvent) => e.preventDefault()}
      onCut={(e: React.ClipboardEvent) => e.preventDefault()}
      onPaste={(e: React.ClipboardEvent) => e.preventDefault()}
      onDragStart={(e: React.DragEvent) => e.preventDefault()}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      // Remove src attribute from DOM to prevent inspection
      {...(videoBlobUrl ? { src: videoBlobUrl } : {})}
    />
  );
};

export default VideoPlayer;
