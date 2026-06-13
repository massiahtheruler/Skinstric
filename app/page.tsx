import Image from "next/image";

export default function Home() {
  return (
    <div>
      <main className="home">
        <div className="devOverlay" aria-hidden="true" />

        {/* <header className="home__header flex flex-row h-[16] w-full justify-between py-3 mb-3 relative z-1000"> */}
        <div className="home__brand">
          <span className="home__logo">SKINSTRIC</span>
          <span className="home__intro">
            <Image
              width={61}
              height={17}
              src="/skinstric-assets/home/assets/location.svg"
              alt="Intro"
            />
          </span>
        </div>

        <button className="home__code-button">ENTER CODE</button>
        {/* </header> */}

        <section className="home__hero">
          <h1 className="home__title">Sophisticated skincare</h1>
        </section>
      </main>
    </div>
  );
}
