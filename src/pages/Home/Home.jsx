// src/pages/Home/Home.jsx
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import ToggleInputMode from "../../components/ToggleInputMode/ToggleInputMode";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const handleAnalyse = async (payload) => {
    console.log("Analyse payload:", payload);
    // const res = await fetch("https://api.somad.ai/analyze", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
    // const data = await res.json();
    const fakeResponse = {
      sentimentBreakdown: [
        { label: "True", value: 11, className: "pill-true" },
        { label: "Mostly True", value: 15, className: "pill-mostly-true" },
        { label: "Half True", value: 18, className: "pill-half-true" },
        { label: "Mostly False", value: 16, className: "pill-mostly-false" },
        { label: "False", value: 26, className: "pill-false" },
        { label: "Pants of Fire", value: 11, className: "pill-pants" },
      ],
      summary:
        "This post may be misleading.\n" +
        "The wording contains emotional triggers, lacks credible sources,\n" +
        "and contradicts information from verified media outlets.",
      lime: "Radar chart placeholder",
    };

    navigate("/results", { state: { results: fakeResponse } });
  };

  return (
    <div className="home">
      <div className="home__overlay" />

      <div className="home__container">
        <Header />

        <main className="home__main page-enter">
          <ToggleInputMode onSubmit={handleAnalyse} />
        </main>
      </div>
    </div>
  );
}

export default Home;
