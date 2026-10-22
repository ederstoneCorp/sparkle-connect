import React, { useState, useRef, useEffect } from 'react';
import { useSparkle } from '../../context/SparkleContext';
import { X, Upload, Camera, ZoomIn, ZoomOut, RotateCcw, Check, Trash2, AlertCircle } from 'lucide-react';
import { formatFileSize } from '../../utils/imageCompression';

interface AvatarEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AvatarEditModal: React.FC<AvatarEditModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateAvatar } = useSparkle();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [estimatedSize, setEstimatedSize] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setImageSrc(null);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setPreviewDataUrl(null);
      setErrorMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 15 MB limit. Please select a smaller photo.');
      return;
    }

    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  // Re-generate square crop and circular preview
  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      renderCroppedCanvas();
    };
    img.src = imageSrc;
  }, [imageSrc, zoom, pan]);

  const renderCroppedCanvas = () => {
    const img = imageRef.current;
    if (!img) return;

    const canvas = document.createElement('canvas');
    const size = 512; // output resolution 512x512
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    // Compute base scale to cover square
    const minDim = Math.min(img.naturalWidth, img.naturalHeight);
    const baseScale = size / minDim;
    const currentScale = baseScale * zoom;

    const drawW = img.naturalWidth * currentScale;
    const drawH = img.naturalHeight * currentScale;

    // Center offset + pan
    const centerX = (size - drawW) / 2 + pan.x;
    const centerY = (size - drawH) / 2 + pan.y;

    ctx.drawImage(img, centerX, centerY, drawW, drawH);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setPreviewDataUrl(dataUrl);
    setEstimatedSize(Math.round((dataUrl.length * 3) / 4));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleResetCrop = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleSaveAvatar = () => {
    if (!previewDataUrl) return;
    updateAvatar(previewDataUrl);
    onClose();
  };

  const handleRemovePhoto = () => {
    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      currentUser?.displayName || 'Sparkle'
    )}`;
    updateAvatar(defaultAvatar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-sparkle-darkSurface rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-700 overflow-hidden my-6">
        
        {/* Header with 'X' button */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
              Manage Profile Photo
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Crop, reposition, and preview your campus avatar
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="user"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!imageSrc ? (
            /* Upload & Photo Source Options */
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center justify-center">
                <img
                  src={currentUser?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=sparkle'}
                  alt="Current Avatar"
                  className="w-28 h-28 rounded-full border-4 border-sparkle-purple/30 shadow-md object-cover mb-3"
                />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Current Profile Picture
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Visible in posts, comments, student discovery &amp; messaging
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-sparkle-purple/40 hover:border-sparkle-purple bg-sparkle-purple/5 dark:bg-sparkle-purple/10 text-sparkle-purple hover:bg-sparkle-purple/15 transition-all text-center"
                >
                  <Upload className="w-6 h-6" />
                  <span className="text-xs font-bold">Choose from Gallery</span>
                  <span className="text-[10px] text-slate-500">JPG, PNG, WebP</span>
                </button>

                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-emerald-400 hover:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 transition-all text-center"
                >
                  <Camera className="w-6 h-6" />
                  <span className="text-xs font-bold">Use Camera</span>
                  <span className="text-[10px] text-slate-500">Take instant selfie</span>
                </button>
              </div>

              {currentUser?.avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="w-full py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove Current Photo (Restore Default Avatar)</span>
                </button>
              )}
            </div>
          ) : (
            /* Cropping, Repositioning & Circular Avatar Preview */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                
                {/* Crop & Pan Canvas Area */}
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Drag to reposition
                  </p>
                  <div
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleMouseUp}
                    className="relative w-full aspect-square rounded-2xl bg-slate-900 overflow-hidden cursor-grab active:cursor-grabbing select-none border border-slate-300 dark:border-slate-700 shadow-inner flex items-center justify-center"
                  >
                    {/* Visual square boundary */}
                    {previewDataUrl && (
                      <img
                        src={previewDataUrl}
                        alt="Crop area"
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    )}

                    {/* Circular Mask Guide */}
                    <div className="absolute inset-2 rounded-full border-2 border-white/80 pointer-events-none shadow-sm" />
                  </div>
                </div>

                {/* Final Circular Avatar Live Preview */}
                <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-center space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Live Avatar Preview
                  </p>
                  <div className="relative">
                    <img
                      src={previewDataUrl || ''}
                      alt="Circular Avatar"
                      className="w-28 h-28 rounded-full border-4 border-sparkle-purple shadow-lg object-cover bg-white"
                    />
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {currentUser?.displayName}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Optimized: 512×512 • ~{formatFileSize(estimatedSize)}
                  </p>
                </div>
              </div>

              {/* Zoom & Adjustment Controls */}
              <div className="space-y-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <ZoomIn className="w-4 h-4 text-sparkle-purple" /> Zoom &amp; Scale
                  </span>
                  <span className="text-[11px] text-slate-500">{zoom.toFixed(1)}x</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.max(1, z - 0.2))}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 accent-sparkle-purple cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleResetCrop}
                    title="Reset Crop Position"
                    className="p-1.5 ml-1 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 text-xs flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Reset</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Choose Different Image
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setImageSrc(null)}
                    className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAvatar}
                    className="px-5 py-2 text-xs font-extrabold rounded-xl bg-sparkle-purple hover:bg-sparkle-purple-dark text-white flex items-center gap-1.5 shadow-md shadow-sparkle-purple/20 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Photo</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
