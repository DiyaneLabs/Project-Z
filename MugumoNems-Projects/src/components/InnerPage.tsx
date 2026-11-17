import { Link } from "react-router-dom";

type InnerPageProps = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
};

export default function InnerPage({
  number,
  eyebrow,
  title,
  description,
  buttonText,
  buttonLink,
}: InnerPageProps) {
  return (
    <section className="inner-page">
      <div className="inner-page-content">
        <p className="eyebrow">{eyebrow}</p>

        <h1>{title}</h1>

        <p className="inner-page-description">{description}</p>

        {buttonText && buttonLink && (
          <Link to={buttonLink} className="primary-btn">
            {buttonText} ↗
          </Link>
        )}
      </div>

      <div className="inner-page-number">
        {number} / 06
      </div>

      <div className="inner-page-bottom">
        MUGUMONEMS PROJECTS · PRETORIA, SOUTH AFRICA
      </div>
    </section>
  );
}