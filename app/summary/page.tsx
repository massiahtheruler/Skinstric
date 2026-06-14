import BackButton from "@/components/BackButton";
import Header from "@/components/Header";

export default function SummaryPage() {
  return (
    <div className="results">
      <Header showCodeButton={true} />
      <main className="results-placeholder">
        <p>SUMMARY</p>
        <h1>Your skin analysis summary</h1>
      </main>
      <BackButton className="results__back-button" />
    </div>
  );
}
