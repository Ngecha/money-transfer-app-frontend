import React, { useEffect } from "react";
import "./LandingPage.css";
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
        // img.style.border = "2px solid red";
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
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <h1 data-aos="fade-up">Send Money Globally With Confidence</h1>
          <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="300">
            Fast, secure, and affordable international money transfers.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h2 data-aos="fade-up">Why Choose VisaPay</h2>
          <p
            className="section-subtitle"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Experience the best in international money transfers
          </p>
          <div className="features-grid">
            <div className="feature-card" data-aos="fade-up">
              <img src="/speed.png" alt="Lightning fast" />
              <h3>Lightning Fast</h3>
              <p>Transfer money within minutes to any supported country.</p>
            </div>
            <div
              className="feature-card"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <img src="/security.png" alt="Highly secure" />
              <h3>Highly Secure</h3>
              <p>Bank-grade encryption and security for your peace of mind.</p>
            </div>
            <div
              className="feature-card"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <img src="/low-fees.png" alt="Low fees" />
              <h3>Low Fees</h3>
              <p>Competitive rates and transparent fee structure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Wallet Features Section */}
      <section id="wallet-features" className="wallet-features py-10 bg-gray-100">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-6" data-aos="fade-up">
            Empower Your Transactions with VisaPay Wallet
          </h2>
          <p
            className="text-center text-lg text-gray-700 mb-10"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Your all-in-one solution for managing money. Load, send, receive, and withdraw funds seamlessly.
          </p>
          <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="feature-card bg-white p-6 rounded-lg shadow-md" data-aos="fade-up">
              <img src="/add-money.png" alt="Load Money" className="mb-4" />
              <h3 className="text-xl font-semibold mb-2">Load Money</h3>
              <p>Easily load your wallet with funds using your preferred payment methods.</p>
            </div>
            <div
              className="feature-card bg-white p-6 rounded-lg shadow-md"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <img src="/send-money.png" alt="Send Money" className="mb-4" />
              <h3 className="text-xl font-semibold mb-2">Send Money</h3>
              <p>Send money to anyone, anywhere in the world, in just a few clicks.</p>
            </div>
            <div
              className="feature-card bg-white p-6 rounded-lg shadow-md"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <img src="/download.png" alt="Receive Money" />
              <h3 className="text-xl font-semibold mb-2">Receive Money</h3>
              <p>Get payments instantly into your wallet with no extra hassle.</p>
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
