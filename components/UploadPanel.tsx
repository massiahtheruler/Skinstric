"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Rectangle from "./Rectangle";

type UploadSource = "camera" | "gallery";
type UploadStatus = "idle" | "confirm-camera" | "preparing" | "error";

const choices: Array<{
  source: UploadSource;
  title: string;
  icon: string;
  iconAlt: string;
}> = [
  {
    source: "camera",
    title: "ALLOW A.I. TO SCAN YOUR FACE",
    icon: "/skinstric-assets/shutter-icon.svg",
    iconAlt: "Camera shutter",
  },
  {
    source: "gallery",
    title: "ALLOW A.I. ACCESS GALLERY",
    icon: "/skinstric-assets/gallery.svg",
    iconAlt: "Gallery",
  },
];

export default function UploadPanel() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<UploadSource | null>(
    null,
  );
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const revokePreview = () => {
    if (!objectUrlRef.current) return;

    URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    return () => {
      stopCamera();
      revokePreview();
    };
  }, []);

  useEffect(() => {
    if (status !== "preparing") return;

    const timer = window.setTimeout(() => {
      router.push("/results");
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [router, status]);

  useEffect(() => {
    if (!videoRef.current || !streamRef.current) return;

    videoRef.current.srcObject = streamRef.current;
  }, [status]);

  const handleCameraClick = () => {
    setSelectedSource("camera");
    setErrorMessage("");
    setStatus("confirm-camera");
  };

  const handleGalleryClick = () => {
    setSelectedSource("gallery");
    setErrorMessage("");
    setStatus("idle");
    fileInputRef.current?.click();
  };

  const handleDenyCamera = () => {
    stopCamera();
    setStatus("idle");
    setSelectedSource(null);
  };

  const handleAllowCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("error");
      setErrorMessage("Camera access is not available in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
        audio: false,
      });

      stopCamera();
      revokePreview();
      streamRef.current = stream;
      setPreviewUrl(null);
      setSelectedSource("camera");
      setStatus("preparing");
    } catch {
      setStatus("error");
      setErrorMessage("Camera permission was blocked. Try gallery instead.");
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedSource(null);
      return;
    }

    stopCamera();
    revokePreview();
    const nextPreviewUrl = URL.createObjectURL(file);
    objectUrlRef.current = nextPreviewUrl;
    setPreviewUrl(nextPreviewUrl);
    setSelectedSource("gallery");
    setStatus("preparing");
    event.target.value = "";
  };

  return (
    <section className="upload" aria-busy={status === "preparing"}>
      <div className="upload__preview" aria-live="polite">
        <p>Preview</p>
        <div className="upload__preview-frame">
          {selectedSource === "camera" && status === "preparing" ? (
            <video
              ref={videoRef}
              className="upload__preview-media"
              autoPlay
              muted
              playsInline
              aria-label="Camera preview"
            />
          ) : previewUrl ? (
            <span
              className="upload__preview-media"
              style={{ backgroundImage: `url(${previewUrl})` }}
              role="img"
              aria-label="Selected upload preview"
            />
          ) : null}
        </div>
      </div>

      {status !== "preparing" && (
        <div
          className={`upload__choices ${
            selectedSource ? "upload__choices--has-selection" : ""
          }`}
        >
          {choices.map((choice) => {
            const isSelected = selectedSource === choice.source;
            const isDimmed = selectedSource !== null && !isSelected;
            const onClick =
              choice.source === "camera"
                ? handleCameraClick
                : handleGalleryClick;

            return (
              <button
                key={choice.source}
                type="button"
                className={`upload__choice upload__choice--${choice.source} ${
                  isSelected ? "upload__choice--selected" : ""
                } ${isDimmed ? "upload__choice--dimmed" : ""}`}
                onClick={onClick}
                aria-pressed={isSelected}
              >
                <span className="upload__diamond-stack" aria-hidden="true">
                  <Rectangle
                    className="upload__diamond-line upload__diamond-line--one"
                    dashed
                    dashPattern="4 8"
                  />
                  <Rectangle
                    className="upload__diamond-line upload__diamond-line--two"
                    dashed
                    dashPattern="4 8"
                  />
                  <Rectangle
                    className="upload__diamond-line upload__diamond-line--three"
                    dashed
                    dashPattern="4 8"
                  />
                </span>
                <span className="upload__icon-wrap">
                  <Image
                    className="upload__icon"
                    src={choice.icon}
                    alt={choice.iconAlt}
                    width={102}
                    height={102}
                  />
                </span>
                <span className="upload__label">
                  <span>{choice.title}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {status === "confirm-camera" && (
        <div className="upload__permission" role="dialog" aria-modal="true">
          <p>ALLOW A.I. TO ACCESS YOUR CAMERA</p>
          <div className="upload__permission-actions">
            <button type="button" onClick={handleDenyCamera}>
              DENY
            </button>
            <button type="button" onClick={handleAllowCamera}>
              ALLOW
            </button>
          </div>
        </div>
      )}

      {status === "preparing" && (
        <div className="upload__preparing" aria-live="polite">
          <span className="upload__preparing-diamond" aria-hidden="true">
            <Rectangle
              className="upload__preparing-line upload__preparing-line--one"
              dashed
              dashPattern="4 8"
            />
            <Rectangle
              className="upload__preparing-line upload__preparing-line--two"
              dashed
              dashPattern="4 8"
            />
            <Rectangle
              className="upload__preparing-line upload__preparing-line--three"
              dashed
              dashPattern="4 8"
            />
          </span>
          <p className="submit__processing-text">PREPARING YOUR ANALYSIS...</p>
          <div className="submit__processing-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      )}

      {status === "error" && (
        <p className="upload__error" role="alert">
          {errorMessage}
        </p>
      )}

      <input
        ref={fileInputRef}
        className="upload__file-input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
    </section>
  );
}
