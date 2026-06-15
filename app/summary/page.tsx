import Header from "@/components/Header";
import SummaryDemographics from "@/components/SummaryDemographics";

export default function SummaryPage() {
  return (
    <div className="results summary-page">
      <Header showCodeButton={true} />
      <p className="summary__eyebrow">A.I. ANALYSIS</p>
      <h1 className="summary__title">DEMOGRAPHICS</h1>
      <p className="summary__sub-title">PREDICTED RACE & AGE</p>
      <SummaryDemographics />
    </div>
  );
}
