type HeaderProps = {
  showCodeButton?: boolean;
};

export default function Header({ showCodeButton = true }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header__brand">
        <span className="site-header__logo">SKINSTRIC</span>
        <span className="site-header__intro">[ INTRO ]</span>
      </div>

      {showCodeButton && (
        <button className="site-header__code-button" id="code__button">
          ENTER CODE
        </button>
      )}
    </header>
  );
}
