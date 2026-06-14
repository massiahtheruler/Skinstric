import BackButton from "@/components/BackButton";
import Header from "@/components/Header";

export default function DemographicsPage() {
  return (
    <div className="results">
      <Header showCodeButton={true} />
      <main className="results-placeholder">
        <p>DEMOGRAPHICS</p>
        <h1>Demographic analysis</h1>
      </main>
      <BackButton className="results__back-button" />
    </div>
  );
}
