import BackButton from "@/components/BackButton";
import CameraCapture from "@/components/CameraCapture";
import Header from "@/components/Header";

export default function CameraPage() {
  return (
    <div className="camera">
      <Header showCodeButton={true} />
      <CameraCapture />
      <BackButton className="camera__back-button" fallbackHref="/analysis" />
    </div>
  );
}
