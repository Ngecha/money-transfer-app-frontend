import React, { useEffect } from "react";
import "./LandingPage.css"; // Ensure CSS is included
import AOS from 'aos';
import 'aos/dist/aos.css';

const LandingPage = () => {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });

    // Image loading debug
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      img.onerror = function () {
        console.error("Failed to load image:", img.src);
        img.style.background = "#ff000033";
        img.style.padding = "1rem";
        img.style.border = "2px solid red";
      };
      img.onload = function () {
        console.log("Successfully loaded image:", img.src);
        img.style.border = "2px solid green";
      };
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const navLinks = document.querySelector(".nav-links");
    const authButtons = document.querySelector(".auth-buttons");

    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", function () {
        this.classList.toggle("active");
        navLinks.classList.toggle("active");
        authButtons.classList.toggle("active");
      });
    }

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".navbar")) {
        mobileMenuBtn?.classList.remove("active");
        navLinks?.classList.remove("active");
        authButtons?.classList.remove("active");
      }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          // Close mobile menu after clicking a link
          mobileMenuBtn?.classList.remove("active");
          navLinks?.classList.remove("active");
          authButtons?.classList.remove("active");
        }
      });
    });

    // Scroll to top button
    const scrollTopBtn = document.createElement("button");
    scrollTopBtn.classList.add("scroll-top-btn");
    scrollTopBtn.innerHTML = "↑";
    document.body.appendChild(scrollTopBtn);

    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 100) {
        scrollTopBtn.classList.add("show");
      } else {
        scrollTopBtn.classList.remove("show");
      }
    });

    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    // Clean up AOS when the component unmounts
    return () => {
      AOS.refresh();
    };
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="container hero-content">
          <h1 data-aos="fade-up">Send Money Globally With Confidence</h1>
          <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="300">
            Fast, secure, and affordable international money transfers to over
            100+ countries.
          </p>
          <div className="hero-features">
            <div className="feature" data-aos="zoom-in">
              <img
                src="https://via.placeholder.com/64"
                alt="Quick Transfers"
              />
              <span>Quick Transfers</span>
            </div>
            <div className="feature" data-aos="zoom-in">
              <img
                src="https://via.placeholder.com/64"
                alt="Bank-Level Security"
              />
              <span>Bank-Level Security</span>
            </div>
            <div className="feature" data-aos="zoom-in">
              <img src="https://via.placeholder.com/64" alt="Low Fees" />
              <span>Low Fees</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h2 data-aos="fade-up">Why Choose VisaPay</h2>
          <p className="section-subtitle" data-aos="fade-up" data-aos-delay="300">
            Experience the best in international money transfers
          </p>
          <div className="features-grid">
            <div className="feature-card" data-aos="fade-up">
              <img src="https://via.placeholder.com/64" alt="Lightning fast" />
              <h3>Lightning Fast</h3>
              <p>Transfer money within minutes to any supported country.</p>
            </div>
            <div className="feature-card" data-aos="fade-up" data-aos-delay="400">
              <img src="public/security.png" alt="Highly secure" />
              <h3>Highly Secure</h3>
              <p>Bank-grade encryption and security for your peace of mind.</p>
            </div>
            <div className="feature-card" data-aos="fade-up" data-aos-delay="600">
              <img src="public/low-fees.png" alt="Low fees" />
              <h3>Low Fees</h3>
              <p>Competitive rates and transparent fee structure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 VisaPay. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
