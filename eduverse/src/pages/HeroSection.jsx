import React from 'react';
import styles from './HeroSection.module.css';

function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.stars}></div>
      <div className={styles.heroContent}>
        <div className={styles.textContent}>
          <h1 className={styles.heroTitle}>
            Explore the Educational Universe
          </h1>
          <p className={styles.heroDescription}>
            EduVerse creates an immersive 3D learning experience where each
            subject becomes a planet to explore. Transform education into an
            adventure with interactive lessons, gamified progress, and AI-powered
            assistance.
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.primaryBtn}>
              Start Your Journey
            </button>
            <button className={styles.secondaryBtn}>
              <svg className={styles.playIcon} viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Demo
            </button>
          </div>
        </div>

       
      </div>
    </section>
  );
}

export default HeroSection;
