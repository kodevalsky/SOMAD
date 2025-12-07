// src/components/ToggleInputMode/ToggleInputMode.jsx
import { useState } from "react";
import "./ToggleInputMode.css";

function ToggleInputMode({ onSubmit }) {
  const [mode, setMode] = useState("text"); // "text" | "link"
  const [textValue, setTextValue] = useState("");
  const [links, setLinks] = useState([""]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const handleTextChange = (e) => {
    setTextValue(e.target.value);
  };

  const handleLinkChange = (index, value) => {
    const updated = [...links];
    updated[index] = value;
    setLinks(updated);
  };

  const handleAddLink = () => {
    setLinks((prev) => [...prev, ""]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "text") {
      onSubmit?.({ mode: "text", text: textValue.trim() });
    } else {
      const cleanedLinks = links.map((l) => l.trim()).filter(Boolean);
      onSubmit?.({ mode: "link", links: cleanedLinks });
    }
  };

  return (
    <form className="input-card" onSubmit={handleSubmit}>
      <h1 className="input-card__title">SOMAD — Smart AI Fake News Detector</h1>

      <p className="input-card__subtitle">
        Verify the truth in seconds
      </p>

      <p className="input-card__description">
        Our AI analyzes text to detect misinformation, manipulations, and unreliable sources.
      </p>

      {/* переключатель URL / TEXT */}
      <div className="input-card__mode-switch">
        <button
          type="button"
          className={`mode-btn ${mode === "link" ? "mode-btn--active" : ""}`}
          onClick={() => handleModeChange("link")}
        >
          URL
        </button>
        <button
          type="button"
          className={`mode-btn ${mode === "text" ? "mode-btn--active" : ""}`}
          onClick={() => handleModeChange("text")}
        >
          TEXT
        </button>
      </div>

      {/* зона ввода */}
      {mode === "text" ? (
        <textarea
          className="input-card__textarea"
          placeholder="Enter news text to analyse..."
          value={textValue}
          onChange={handleTextChange}
        />
      ) : (
        <>
          <input
            className="input-card__input"
            type="url"
            placeholder="Paste the link here..."
            value={links[0] ?? ""}
            onChange={(e) => handleLinkChange(0, e.target.value)}
          />

          {/* если есть дополнительные ссылки */}
          {links.slice(1).map((link, index) => (
            <input
              key={index + 1}
              className="input-card__input input-card__input--extra"
              type="url"
              placeholder="Enter another link here..."
              value={link}
              onChange={(e) =>
                handleLinkChange(index + 1, e.target.value)
              }
            />
          ))}

          {/* эта фраза и кнопка ТОЛЬКО в режиме link */}
          <button
            type="button"
            className="input-card__add-link"
            onClick={handleAddLink}
          >
            add another link
          </button>
        </>
      )}

      <button type="submit" className="input-card__submit input-card__submit--pulse">
        Analyse!
      </button>

      <p className="input-card__hint">
        Yep, NASA confirms life on Mars?
      </p>

      <button
        type="button"
        className="input-card__secondary"
        // потом сюда повесим переход на страницу "How it works?"
      >
        How it works?
      </button>
    </form>
  );
}

export default ToggleInputMode;
