import "./LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-page">
      <div className="living-room-scene" aria-hidden="true">
        <div className="wall">
          <div className="painting-frame">
            <div className="painting-art">
              <span className="mountain back" />
              <span className="mountain mid" />
              <span className="mountain front" />
            </div>
          </div>

          <div className="tv-stand">
            <div className="television">
              <div className="tv-screen" />
              <div className="tv-base" />
            </div>
            <div className="stand-shelf">
              <div className="book-stack">
                <span />
                <span />
                <span />
              </div>
              <div className="plant">
                <div className="plant-pot" />
                <div className="plant-leaves" />
              </div>
              <div className="media-player" />
            </div>
          </div>
        </div>

        <div className="coffee-table">
          <div className="notebook" />
          <div className="pen" />
        </div>

        <div className="sofa" />
      </div>
    </div>
  );
}

export default LandingPage;
