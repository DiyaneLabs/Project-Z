
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Award, Users } from "lucide-react";
import brandingStudioImage from "../assets/images/contact_branding_studio.png";
import slide1Image from "../assets/images/slide1_bg.png";
import slide2Image from "../assets/images/slide2_bg.png";
import slide3Image from "../assets/images/slide3_bg.png";
import brandOne from "../assets/images/brand-one.jpeg";
import brandTwo from "../assets/images/brand-two.jpeg";
import brandThree from "../assets/images/brand-three.jpeg";
import brandFour from "../assets/images/brand-four.jpeg";
import brandFive from "../assets/images/brand-five.jpeg";
import brandSix from "../assets/images/brand-six.jpeg";
import brandSeven from "../assets/images/brand-seven.jpeg";
import aboutImage from "../assets/images/mugumonems-brand-showcase.png";



const slides = [
  {
    image: slide1Image,
    eyebrow: "EST. 2023",
    title: "Bringing Your",
    highlight: "Brand to Life.",
    description:
      "Branding, printing, corporate gifting, design and supply solutions that make a lasting impression.",
  },
  {
    image: slide2Image,
    eyebrow: "PRINT. CREATE. IMPRESS.",
    title: "Ideas Into",
    highlight: "Print.",
    description:
      "From professional stationery to promotional materials, we bring your brand's message to life.",
  },
  {
    image: slide3Image,
    eyebrow: "MAKE YOUR MARK",
    title: "Your Brand.",
    highlight: "Your Identity.",
    description:
      "Custom merchandise and creative branding solutions that make your business memorable.",
  },
];

const brands = [
  { name: "BRAND ONE", image: brandOne },
  { name: "BRAND TWO", image: brandTwo },
  { name: "BRAND THREE", image: brandThree },
  { name: "BRAND FOUR", image: brandFour },
  { name: "BRAND FIVE", image: brandFive },
  { name: "BRAND SIX", image: brandSix },
  { name: "BRAND SEVEN", image: brandSeven },
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);

  const slide = slides[activeSlide];

  // Change hero slide manually.
  const changeSlide = (direction: number) => {
    setActiveSlide(
      (current) =>
        (current + direction + slides.length) % slides.length
    );
  };

  // Automatically advance the hero every five seconds.
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="home-page">

      {/* HERO CAROUSEL */}
      <section
  className="showcase-hero"
  style={{
    backgroundImage: `url(${slide.image})`,
  }}
>
        <div className="showcase-overlay" />

        <div className="showcase-content" key={activeSlide}>
          <p className="showcase-eyebrow">{slide.eyebrow}</p>

          <h1>
            {slide.title}
            <br />
            <span>{slide.highlight}</span>
          </h1>

          <p className="showcase-description">
            {slide.description}
          </p>

          <Link to="/products" className="showcase-button">
            Explore Our Products <span>→</span>
          </Link>

          <div className="showcase-dots">
            {slides.map((item, index) => (
              <button
                key={item.eyebrow}
                className={activeSlide === index ? "active" : ""}
                onClick={() => setActiveSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={
                  activeSlide === index ? "true" : undefined
                }
              />
            ))}
          </div>
        </div>

        {/* PREVIOUS SLIDE */}
        <button
          className="showcase-arrow showcase-arrow-left"
          onClick={() => changeSlide(-1)}
          aria-label="Previous slide"
        >
          ‹
        </button>

        {/* NEXT SLIDE */}
        <button
          className="showcase-arrow showcase-arrow-right"
          onClick={() => changeSlide(1)}
          aria-label="Next slide"
        >
          ›
        </button>

        <div className="showcase-counter">
          0{activeSlide + 1} <span>/</span> 0{slides.length}
        </div>
      </section>

      {/* ABOUT US */}
      <section className="about-section" id="about">
        <div className="about-container">

          {/* LEFT: COMPANY IMAGE */}
          <div className="about-image">
            <div className="about-image">
 <img
  src={aboutImage}
  alt="MugumoNems branded merchandise and corporate gifts"
/>
</div>
          </div>

          {/* RIGHT: COMPANY INFORMATION */}
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

            {/* COMPANY CREDENTIALS */}
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

      {/* BRANDS */}
      <section className="brands-section">
        <div className="brands-heading">

          <div className="brands-eyebrow">
            <span />
            <p>OUR BRANDS</p>
            <span />
          </div>

          <h2>
            Trusted Brands <span>We Work With.</span>
          </h2>

        </div>

        {/* CONTINUOUS BRAND MARQUEE */}
        <div className="brands-slider">
          <div className="brands-track">

            {[...brands, ...brands].map((brand, index) => (
              <div
              className="brand-placeholder"
              key={`${brand.name}-${index}`}
              aria-hidden={index >= brands.length}
            >
            <img
              src={brand.image}
              alt={brand.name}
              className="brand-logo"
          />
      </div>
    ))}

          </div>
        </div>
      </section>

      
{/* CONTACT */}
<section className="contact-section">

  <div className="contact-content">
    <div className="contact-eyebrow">
      <span />
      <p>CONTACT</p>
    </div>

    <h2>
      Let's Work <span>Together.</span>
    </h2>

    <p className="contact-description">
      Have a project, an enquiry or simply want to know more
      about what we offer? Get in touch with us today.
    </p>

    <Link to="/contact" className="contact-btn">
      <span className="contact-send-icon">➤</span>
      Send Us a Message
    </Link>
  </div>

   <div className="contact-image">
    <img
      src={brandingStudioImage}
      alt="MugumoNems Projects embroidery machine, branded apparel and promotional merchandise"
    />
  </div>

</section>


    </div>
  );
}
