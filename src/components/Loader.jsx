
import './Loader.css'; // Optional: If you prefer to keep CSS in a separate file

function Loader() {
  return (
    <div className="loader-container">
      <div className="sound-wave">
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
      </div>
    </div>
  );
}

export default Loader;
