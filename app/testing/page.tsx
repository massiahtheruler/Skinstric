import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import ThankYouPanel from "@/components/ThankYouPanel";

export default function TestingPage() {
  return (
    <div className="testing">
      <Header showCodeButton={true} />
      <p className="testing__eyebrow">TO START ANALYSIS</p>
      <ThankYouPanel />
      <BackButton className="testing__back-button" />
    </div>
  );
}
