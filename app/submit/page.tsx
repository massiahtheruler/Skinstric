import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import Rectangle from "@/components/Rectangle";
import SubmitInput from "@/components/SubmitInput";

export default function SubmitPage() {
  return (
    <div className="submit">
      <Header showCodeButton={true} />
      <p className="submit__eyebrow">TO START YOUR ANALYSIS</p>
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="diamond-stack submit__diamond-stack">
          <Rectangle
            className="diamond-stack__line diamond-stack__line--one"
            dashed
          />
          <Rectangle
            className="diamond-stack__line diamond-stack__line--two"
            dashed
          />
          <Rectangle
            className="diamond-stack__line diamond-stack__line--three"
            dashed
          />
        </div>{" "}
        <div className="submit__input-container">
          <SubmitInput />
        </div>
      </main>
      <BackButton className="submit__back-button" />
    </div>
  );
}
