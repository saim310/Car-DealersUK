"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "react-toastify";

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────
const IconTrash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);

const IconCrop = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2v14a2 2 0 0 0 2 2h14"/>
    <path d="M18 22V8a2 2 0 0 0-2-2H2"/>
  </svg>
);

const IconX = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ─── Crop Modal ───────────────────────────────────────────────────────────────
function CropModal({ imageUrl, onApply, onCancel }) {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [imgNaturalSize, setImgNaturalSize] = useState({ w: 1, h: 1 });
  const dragState = useRef(null);

  const onImgLoad = () => {
    const img = imgRef.current;
    setImgNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
  };

  const clampOffset = useCallback(
    (ox, oy, z) => {
      const container = containerRef.current;
      if (!container) return { x: ox, y: oy };
      const cw = container.offsetWidth;
      const ch = container.offsetHeight;
      const { w, h } = imgNaturalSize;
      const scale = Math.min(cw / w, ch / h);
      const renderedW = w * scale * z;
      const renderedH = h * scale * z;
      const maxX = Math.max(0, (renderedW - cw) / 2);
      const maxY = Math.max(0, (renderedH - ch) / 2);
      return {
        x: Math.max(-maxX, Math.min(maxX, ox)),
        y: Math.max(-maxY, Math.min(maxY, oy)),
      };
    },
    [imgNaturalSize]
  );

  const handleZoom = (e) => {
    const z = parseFloat(e.target.value);
    setZoom(z);
    setOffset((prev) => clampOffset(prev.x, prev.y, z));
  };

  const onMouseDown = (e) => {
    e.preventDefault();
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      ox: offset.x,
      oy: offset.y,
    };
  };

  const onTouchStart = (e) => {
    const t = e.touches[0];
    dragState.current = {
      startX: t.clientX,
      startY: t.clientY,
      ox: offset.x,
      oy: offset.y,
    };
  };

  const onMouseMove = useCallback(
    (e) => {
      if (!dragState.current) return;
      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;
      setOffset(clampOffset(dragState.current.ox + dx, dragState.current.oy + dy, zoom));
    },
    [zoom, clampOffset]
  );

  const onTouchMove = useCallback(
    (e) => {
      if (!dragState.current) return;
      e.preventDefault();
      const t = e.touches[0];
      const dx = t.clientX - dragState.current.startX;
      const dy = t.clientY - dragState.current.startY;
      setOffset(clampOffset(dragState.current.ox + dx, dragState.current.oy + dy, zoom));
    },
    [zoom, clampOffset]
  );

  const onPointerUp = () => {
    dragState.current = null;
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onPointerUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onPointerUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onPointerUp);
    };
  }, [onMouseMove, onTouchMove]);

  // ── FIX: prevent this button click from bubbling to any parent form
  const handleApplyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const container = containerRef.current;
    const img = imgRef.current;
    const cw = container.offsetWidth;
    const ch = container.offsetHeight;
    const { w, h } = imgNaturalSize;
    const scale = Math.min(cw / w, ch / h);
    const pxPerContainerPx = 1 / (scale * zoom);
    const imgCenterX = cw / 2 + offset.x;
    const imgCenterY = ch / 2 + offset.y;
    const srcW = cw * pxPerContainerPx;
    const srcH = ch * pxPerContainerPx;
    const imgOriginX = imgCenterX - (w * scale * zoom) / 2;
    const imgOriginY = imgCenterY - (h * scale * zoom) / 2;
    const srcX = (0 - imgOriginX) * pxPerContainerPx;
    const srcY = (0 - imgOriginY) * pxPerContainerPx;

    const canvas = document.createElement("canvas");
    canvas.width = 1800;
    canvas.height = 1800;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, 1800, 1800);

    canvas.toBlob(
      (blob) => {
        const croppedUrl = canvas.toDataURL("image/jpeg", 0.92);
        const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
        onApply(croppedUrl, file);
      },
      "image/jpeg",
      0.92
    );
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onCancel();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      // ── FIX: stop any click inside modal from reaching the form below
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          width: 520,
          maxWidth: "95vw",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h4 style={{ fontSize: 17, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
            Crop Photo — 1800 × 1800 px
          </h4>
          <button
            type="button"
            onClick={handleCancelClick}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#374151" }}
          >
            <IconX />
          </button>
        </div>

        {/* Crop Viewport */}
        <div
          ref={containerRef}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          style={{
            width: "100%",
            aspectRatio: "1 / 1",
            overflow: "hidden",
            borderRadius: 10,
            background: "#111",
            position: "relative",
            cursor: "grab",
            userSelect: "none",
          }}
        >
          <img
            ref={imgRef}
            src={imageUrl}
            alt="crop"
            onLoad={onImgLoad}
            style={{
              position: "absolute",
              maxWidth: "100%",
              maxHeight: "100%",
              width: "auto",
              height: "auto",
              top: "50%",
              left: "50%",
              pointerEvents: "none",
              transformOrigin: "center center",
              transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${zoom})`,
              willChange: "transform",
            }}
          />
          {/* Crop frame */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "2px solid rgba(255,255,255,0.8)",
              borderRadius: 4,
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.45)",
              pointerEvents: "none",
            }}
          />
          {/* Rule-of-thirds grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
              `,
              backgroundSize: "33.33% 33.33%",
            }}
          />
        </div>

        {/* Zoom Slider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
          <span style={{ fontSize: 13, color: "#555", fontWeight: 500 }}>Zoom</span>
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            onChange={handleZoom}
            style={{ flex: 1, accentColor: "#4f46e5" }}
          />
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#4f46e5",
              minWidth: 44,
              textAlign: "right",
            }}
          >
            {zoom.toFixed(2)}×
          </span>
        </div>
        <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>
          Output: 1800 × 1800 px · Drag to reposition · Slider to zoom
        </p>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 18, justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={handleCancelClick}
            style={{
              background: "#f3f4f6",
              color: "#374151",
              border: "none",
              borderRadius: 8,
              padding: "9px 20px",
              fontSize: 14,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplyClick}
            style={{
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "9px 20px",
              fontSize: 14,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ImageUploadManager({
  images,
  setImages,
  maxImages = 30,
  isDragging,
  setIsDragging,
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [cropTarget, setCropTarget] = useState(null);

  const makeClientId = () =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  const createImageItem = (file) => ({
    id: makeClientId(),
    file,
    previewUrl: URL.createObjectURL(file),
    croppedUrl: null,
    isExisting: false,
    storagePath: "",
  });

  const appendImageFiles = (fileList) => {
    const onlyImages = fileList.filter((f) => f.type.startsWith("image/"));
    if (!onlyImages.length) {
      toast.error("Please select valid image files");
      return;
    }
    setImages((prev) => {
      const slots = maxImages - prev.length;
      if (slots <= 0) {
        toast.error(`You can upload up to ${maxImages} photos`);
        return prev;
      }
      return [...prev, ...onlyImages.slice(0, slots).map(createImageItem)];
    });
  };

  const handleImageChange = (e) => {
    appendImageFiles(Array.from(e.target.files || []));
    e.target.value = "";
  };

  const handleDropFiles = (e) => {
    e.preventDefault();
    setIsDragging(false);
    appendImageFiles(Array.from(e.dataTransfer.files || []));
  };

  const handleDeleteImage = (id) => {
    setImages((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.previewUrl?.startsWith("blob:"))
        URL.revokeObjectURL(target.previewUrl);
      if (target?.croppedUrl?.startsWith("blob:"))
        URL.revokeObjectURL(target.croppedUrl);
      return prev.filter((item) => item.id !== id);
    });
  };

  // ── FIX: use item.id instead of index to avoid stale closure mismatch
  const handleCropOpen = async (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();
    const item = images.find((img) => img.id === itemId);
    if (!item) return;
    let imageUrl = item.previewUrl;
    if (item.isExisting) {
      const normalizedUrl = item.previewUrl?.replace(/^http:\/\//i, "https://");
      try {
        const response = await fetch(normalizedUrl);
        const blob = await response.blob();
        imageUrl = URL.createObjectURL(blob);
      } catch (error) {
        toast.error("Failed to load image for cropping");
        return;
      }
    }
    setCropTarget({ itemId, imageUrl });
  };

  const handleCropApply = (croppedUrl, croppedFile) => {
    setImages((prev) =>
      prev.map((item) =>
        item.id === cropTarget.itemId
          ? { ...item, croppedUrl, file: croppedFile }
          : item
      )
    );
    if (cropTarget.imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(cropTarget.imageUrl);
    }
    setCropTarget(null);
  };

  const onDragStart = (index) => setDraggedIndex(index);

  const onDropReorder = (index) => {
    if (draggedIndex === null) return;
    const updated = [...images];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, moved);
    setImages(updated);
    setDraggedIndex(null);
  };

  return (
    <>
      <div className="tfcl-add-listing upload-photo mt-40">
        <h3>Upload Photos</h3>
        <div
          className="upload-media enhanced-upload-media"
          style={
            isDragging
              ? { borderStyle: "solid", backgroundColor: "#f7f7f8" }
              : {}
          }
          onDrop={handleDropFiles}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
        >
          <div className="inner">
            <label className="relative add-listing-upload-button">
              Select photos
              <input
                type="file"
                className="ip-file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
            </label>
            <div className="desc">
              or drag photos here <br />
              <span>(Up to {maxImages} photos)</span>
            </div>
          </div>
        </div>

        <div className="thumbnail-media">
          {images.map((imageItem, index) => (
            <div
              key={imageItem.id}
              className="item enhanced-thumb-item"
              draggable
              onDragStart={() => onDragStart(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDropReorder(index)}
              style={{ position: "relative", width: "200px" }}
            >
              {/* ── FIX: always show croppedUrl if available ── */}
              <img
                alt="listing preview"
                src={imageItem.croppedUrl || imageItem.previewUrl}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />

              {/* Delete button */}
              <button
              style={{left:6}}
                type="button"
                className="delete-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDeleteImage(imageItem.id);
                }}
              >
                <IconTrash />
              </button>

              {/* Crop button */}
              <button
                type="button"
                onClick={(e) => handleCropOpen(e, imageItem.id)}
                style={{
                  position: "absolute",
                  bottom: 4,
                  right: 4,
                  background: "rgba(79,70,229,0.85)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "3px 8px",
                  fontSize: 11,
                  cursor: "pointer",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <IconCrop /> Crop
              </button>

              {index === 0 && (
                <span className="featured-badge">Main Cover</span>
              )}

              {imageItem.croppedUrl && (
                <span
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 28,
                    background: "#10b981",
                    color: "#fff",
                    fontSize: 9,
                    padding: "2px 5px",
                    borderRadius: 3,
                    fontWeight: 700,
                  }}
                >
                  Cropped
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {cropTarget && (
        <CropModal
          imageUrl={cropTarget.imageUrl}
          onApply={handleCropApply}
          onCancel={() => {
            if (cropTarget.imageUrl.startsWith('blob:')) {
              URL.revokeObjectURL(cropTarget.imageUrl);
            }
            setCropTarget(null);
          }}
        />
      )}
    </>
  );
}