import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import Rectangle from "@/components/Rectangle";
import SubmitInput from "@/components/SubmitInput";

export default function SubmitPage() {
  return (
    <div className="submit">
      <Header showCodeButton={true} />
      <p className="submit__eyebrow">TO START YOUR ANALYSIS</p>
      <main className="submit__main flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="diamond-stack submit__diamond-stack">
          <Rectangle
            className="diamond-stack__line diamond-stack__line--one"
            dashed
            dashPattern="4 8"
          />
          <Rectangle
            className="diamond-stack__line diamond-stack__line--two"
            dashed
            dashPattern="4 8"
          />
          <Rectangle
            className="diamond-stack__line diamond-stack__line--three"
            dashed
            dashPattern="4 8"
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
