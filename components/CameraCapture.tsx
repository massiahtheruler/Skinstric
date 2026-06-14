"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ANALYSIS_STORAGE_KEY,
  dataUrlToBase64,
} from "@/lib/skinstricAnalysis";
import Rectangle from "./Rectangle";

type CameraStatus = "setting-up" | "ready" | "captured" | "error";

const SETUP_DELAY = 700;

export default function CameraCapture() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyzeTimerRef = useRef<number | null>(null);
  const [status, setStatus] = useState<CameraStatus>("setting-up");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    let isMounted = true;
    let setupTimer: number | undefined;

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus("error");
        setErrorMessage("Camera access is not available in this browser.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setupTimer = window.setTimeout(() => {
          if (isMounted) setStatus("ready");
        }, SETUP_DELAY);
      } catch {
        if (!isMounted) return;
        setStatus("error");
        setErrorMessage("Camera permission was blocked. Go back and try again.");
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (setupTimer) window.clearTimeout(setupTimer);
      if (analyzeTimerRef.current) {
        window.clearTimeout(analyzeTimerRef.current);
      }
      stopCamera();
    };
  }, []);

  const handleTakePicture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    setPhotoUrl(canvas.toDataURL("image/png"));
    setStatus("captured");
  };

  const handleRetake = () => {
    if (isAnalyzing) return;
    setPhotoUrl(null);
    setIsAnalyzing(false);
    setStatus("ready");
  };

  const handleUsePhoto = async () => {
    if (isAnalyzing) return;
    if (!photoUrl) return;

    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/skin-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Image: dataUrlToBase64(photoUrl) }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error ?? "Image analysis failed.");
      }

      localStorage.setItem(
        ANALYSIS_STORAGE_KEY,
        JSON.stringify(data.normalizedData),
      );

      stopCamera();
      analyzeTimerRef.current = window.setTimeout(() => {
        router.push("/results");
      }, 900);
    } catch (error) {
      setIsAnalyzing(false);
      setErrorMessage(
        error instanceof Error ? error.message : "Image analysis failed.",
      );
    }
  };

  return (
    <main className="camera__stage">
      {(status === "setting-up" || status === "error") && (
        <div className="camera__setup" aria-live="polite">
          <span className="camera__setup-diamond" aria-hidden="true">
            <Rectangle
              className="camera__setup-line camera__setup-line--one"
              dashed
              dashPattern="4 8"
            />
            <Rectangle
              className="camera__setup-line camera__setup-line--two"
              dashed
              dashPattern="4 8"
            />
            <Rectangle
              className="camera__setup-line camera__setup-line--three"
              dashed
              dashPattern="4 8"
            />
          </span>
          <p>{status === "error" ? errorMessage : "SETTING UP CAMERA ..."}</p>
        </div>
      )}

      <video
        ref={videoRef}
        className={`camera__media ${
          status === "ready" ? "camera__media--visible" : ""
        }`}
        autoPlay
        muted
        playsInline
        aria-label="Live camera preview"
      />

      {status === "captured" && photoUrl && (
        // The captured frame is a temporary camera data URL, so Next image
        // optimization does not apply here.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="camera__media camera__media--visible"
          src={photoUrl}
          alt="Captured face preview"
        />
      )}

      {status === "ready" && (
        <button
          className="camera__take-action"
          type="button"
          onClick={handleTakePicture}
        >
          <span>TAKE PICTURE</span>
          <span className="camera__shutter" aria-hidden="true">
            <Image
              className="camera__shutter-icon"
              src="/skinstric-assets/Group 40037.svg"
              alt=""
              width={62}
              height={62}
            />
          </span>
        </button>
      )}

      {status === "captured" && (
        <>
          <p className="camera__shot-message">GREAT SHOT!</p>
          {isAnalyzing && (
            <div className="camera__analyzing" aria-live="polite">
              <p>ANALYZING IMAGE...</p>
              <div className="submit__processing-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
          {!isAnalyzing && errorMessage && (
            <p className="camera__capture-error" role="alert">
              {errorMessage}
            </p>
          )}
          <div className="camera__review">
            <p>Preview</p>
            <div className="camera__review-actions">
              <button type="button" onClick={handleRetake} disabled={isAnalyzing}>
                Retake
              </button>
              <button type="button" onClick={handleUsePhoto} disabled={isAnalyzing}>
                {isAnalyzing ? "Uploading..." : "Use This Photo"}
              </button>
            </div>
          </div>
        </>
      )}

      {status === "ready" && (
        <div className="camera__tips">
          <p>TO GET BETTER RESULTS MAKE SURE TO HAVE</p>
          <ul>
            <li>NEUTRAL EXPRESSION</li>
            <li>FRONTAL POSE</li>
            <li>ADEQUATE LIGHTING</li>
          </ul>
        </div>
      )}

      <canvas ref={canvasRef} className="camera__canvas" aria-hidden="true" />
    </main>
  );
}
