import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import UploadPanel from "@/components/UploadPanel";

export default function AnalysisPage() {
  return (
    <div className="analysis">
      <Header showCodeButton={true} />
      <p className="analysis__eyebrow">TO START ANALYSIS</p>
      <main className="analysis__main" aria-labelledby="analysis-title">
        <h1 id="analysis-title" className="sr-only">
          Choose how to upload your image for analysis
        </h1>
        <UploadPanel />
      </main>
      <BackButton className="analysis__back-button" />
    </div>
  );
}
