// src/pages/About/About.jsx
import Header from "../../components/Header/Header";
import "./About.css";

function About() {
  const team = [
    {
      name: "Jeremi Kowalski",
      role: "Software Engineering",
      location: "SCRUM Master",
    },
    {
      name: "Daria Siliverstova",
      role: "Web Design",
      location: "UX/UI",
    },
    {
      name: "Madina Shamsutdinova",
      role: "Frontend Development",
      location: "UX/UI",
    },
    {
      name: "Tarik Anafarta",
      role: "ML Development",
      location: "Web Development",
    },
    {
      name: "Selin Tuna",
      role: "Web Design",
      location: "Data Analysis",
    },
  ];

  return (
    <div className="about">
      <div className="about__overlay" />

      <div className="about__container">
        <Header />

        <main className="about__main page-enter">
          <section className="about__hero">
            <h1 className="about__title">Our Vision &amp; Team</h1>

            <p className="about__text">
              We believe in transparency, objectivity, and media literacy.
              <br />
              Our mission is to build a more informed and resilient
              society by providing accessible tools to verify information.
            </p>
          </section>

          <section className="about__team">
            {team.map((member) => (
              <article key={member.name} className="about__member">
                <div className="about__avatar-wrapper">
                  <div className="about__avatar" />
                </div>
                <h3 className="about__member-name">{member.name}</h3>
                <p className="about__member-role">{member.role}</p>
                <p className="about__member-location">{member.location}</p>
              </article>
            ))}
          </section>
        </main>

        <footer className="about__footer">
          <div className="about__footer-inner">
            <div className="about__footer-logo">SOMAD</div>
            <div className="about__footer-contact">
              <span>+7 0000000</span>
              <span>jshtwsldfj@gmail.com</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default About;
