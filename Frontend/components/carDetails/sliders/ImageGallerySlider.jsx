"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Navigation, Autoplay, Thumbs, FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import Image from "next/image";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import "photoswipe/dist/photoswipe.css";

export default function ImageGallerySlider({ carItem }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgDims, setImgDims] = useState({});

  const images = useMemo(() => {
    return carItem?.images && carItem.images.length > 0
      ? carItem.images
      : [carItem?.imgSrc || "/assets/images/section/slider-listing1.jpg"];
  }, [carItem]);

  // Preload every image and store its real pixel dimensions
  useEffect(() => {
    images.forEach((src, i) => {
      // Use existing dimensions from carItem.images if available
      if (carItem?.images?.[i]?.width && carItem?.images?.[i]?.height) {
        setImgDims((prev) => ({
          ...prev,
          [i]: {
            w: carItem.images[i].width,
            h: carItem.images[i].height,
          },
        }));
        return;
      }

      // Otherwise measure the image naturally
      const imgEl = new window.Image();
      imgEl.onload = () => {
        setImgDims((prev) => ({
          ...prev,
          [i]: { w: imgEl.naturalWidth, h: imgEl.naturalHeight },
        }));
      };
      imgEl.src = typeof src === "string" ? src : src?.src || "";
    });
  }, [images]);

  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#gallery-lightbox",
      children: ".lightbox-image",
      pswpModule: () => import("photoswipe"),
      initialZoomLevel: "fit",
      secondaryZoomLevel: 1,
      maxZoomLevel: 2,
    });

    lightbox.init();
    return () => lightbox.destroy();
  }, [images]);

  return (
    <>
    <div className="gallery-section-wrapper">
      <div className="gallery-main-content">

        {/* TOP MAIN SLIDER */}
        <div className="main-gallery-card">
          <div className="image-counter">
            <span>{currentIndex + 1} / {images.length}</span>
          </div>

          <Swiper
            modules={[Navigation, Autoplay, Thumbs]}
            spaceBetween={10}
            navigation={{
              nextEl: ".main-btn-next",
              prevEl: ".main-btn-prev",
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
            className="main-gallery-swiper"
            id="gallery-lightbox"
          >
            {images.map((elm, i) => {
              const src = typeof elm === "string" ? elm : elm?.src || "";
              const w = imgDims[i]?.w || 1200;
              const h = imgDims[i]?.h || 800;

              return (
                <SwiperSlide key={i}>
                  <div className="main-image-container">
                    <a
                      href={src}
                      className="lightbox-image"
                      data-pswp-width={w}
                      data-pswp-height={h}
                    >
                      <Image
                        className="main-image"
                        alt={`Car image ${i + 1}`}
                        src={elm}
                        fill
                        style={{ objectFit: "cover" }}
                        priority={i === 0}
                      />
                    </a>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <button className="nav-arrow main-btn-prev">❮</button>
          <button className="nav-arrow main-btn-next">❯</button>
        </div>

        {/* BOTTOM THUMBNAIL SLIDER */}
        <div className="thumbs-container-outer">
          <div className="thumbs-container-inner">
            <Swiper
              onSwiper={setThumbsSwiper}
              modules={[FreeMode, Navigation, Thumbs]}
              spaceBetween={10}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              navigation={{
                nextEl: ".thumb-btn-next",
                prevEl: ".thumb-btn-prev",
              }}
              breakpoints={{
                640: { slidesPerView: 5 },
                1024: { slidesPerView: 6 },
              }}
              className="thumbnail-swiper"
            >
              {images.map((elm, i) => (
                <SwiperSlide key={i}>
                  <div className={`thumb-wrapper ${currentIndex === i ? "active" : ""}`}>
                    <Image className="thumb-img" alt="thumb" src={elm} fill />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <button className="thumb-nav-arrow thumb-btn-prev">❮</button>
          <button className="thumb-nav-arrow thumb-btn-next">❯</button>
        </div>
      </div>

      <style jsx>{`
        .gallery-section-wrapper { width: 100%; margin: 0 auto; }

        .main-gallery-card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          background: #000;
        }

        .main-image-container { height: 650px; position: relative; }
        .main-image { object-fit: cover !important; }

        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          background: white;
          border: none;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }
        .main-btn-prev { left: 20px; }
        .main-btn-next { right: 20px; }

        .thumbs-container-outer {
          margin-top: 15px;
          margin-bottom: 30px;
          position: relative;
          padding: 0 45px;
        }

        .thumb-wrapper {
          position: relative;
          height: 100px;
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          opacity: 0.6;
          transition: 0.3s;
        }
        .thumb-wrapper.active { border-color: #007bff; opacity: 1; }
        .thumb-img { object-fit: cover; }

        .thumb-nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          background: #fff;
          border: 1px solid #ddd;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }
        .thumb-btn-prev { left: 0; }
        .thumb-btn-next { right: 0; }

        :global(.swiper-button-disabled) {
          opacity: 0.2;
          cursor: not-allowed;
          pointer-events: none;
        }

        .image-counter {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 10;
          background: rgba(0,0,0,0.6);
          color: white;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 13px;
        }

        @media (max-width: 768px) {
          .main-image-container { height: 300px; }
          .thumbs-container-outer { padding: 0; }
          .thumb-nav-arrow { display: none; }
        }

        :global(.pswp__img) {
          max-width: none !important;
          max-height: none !important;
          object-fit: contain;
        }
      `}</style>
    </div>
    </>
  );
}