
import { CalendarDays, Award, Users } from "lucide-react";

export default function About() {
  return (
    <section className="about-section" id="about">
      <div className="about-container">

        {/* Left: Company image */}
        <div className="about-image">
          <div className="about-image-overlay">
            <span className="about-image-label">
              MUGUMONEMS PROJECTS
            </span>
          </div>
        </div>

        {/* Right: Company information */}
        <div className="about-content">
          <div className="about-eyebrow">
            <span className="about-eyebrow-line" />
            <span>ABOUT US</span>
          </div>

          <h2>
            Established in <span>2023.</span>
          </h2>

          <p className="about-description">
            MugumoNems Projects is a creative and solutions-driven
            business focused on helping brands bring their ideas to life.
            We offer a wide range of services and products, including
            branding, corporate gifting, graphic design, supply,
            designing, printing and more.
          </p>

          {/* Company credentials */}
          <div className="about-credentials">

            <div className="about-credential">
              <CalendarDays className="about-icon" />
              <h3>2023</h3>
              <p>Year Established</p>
            </div>

            <div className="about-credential">
              <Award className="about-icon" />
              <h3>B-BBEE</h3>
              <p>Level 1</p>
            </div>

            <div className="about-credential">
              <Users className="about-icon" />
              <h3>100%</h3>
              <p>Black-owned</p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
