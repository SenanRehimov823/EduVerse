import React, { useState } from 'react';
import styles from './Header.module.css';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, setUser } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
      window.location.href = "/";
    } catch (err) {
      alert("Çıxış zamanı xəta baş verdi");
    }
  };

  let panelLink = "";
  if (user?.role === "student") {
    panelLink = "/student/panel";
  } else if (user?.role === "teacher") {
    panelLink = "/teacher/panel";
     
  }else if (user?.role === "admin") {
  panelLink = "/admin"; 
}

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <h1 className={styles.logoText}>EduVerse</h1>
          </div>

          <div className={styles.authButtons}>
            {user ? (
              <div className={styles.profileWrapper}>
                <FaUserCircle
                  size={30}
                  className={styles.profileIcon}
                  onClick={toggleDropdown}
                />
                {isDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <a href={panelLink} className={styles.dropdownItem}>
                      <FaUserCircle className={styles.dropdownIcon} /> Panel
                    </a>
                    <button onClick={handleLogout} className={styles.dropdownItem}>
                      Çıxış
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <a href="/login"><button className={styles.loginBtn}>Giriş</button></a>
                <a href="/register-student"><button className={styles.signupBtn}>Şagird qeydiyyatı</button></a>
                <a href="/register-teacher"><button className={styles.signupBtn}>Müəllim qeydiyyatı</button></a>
              </>
            )}
          </div>

          <div className={styles.mobileMenuBtn}>
            <button onClick={toggleMenu} className={styles.hamburger}>
              <span className={styles.hamburgerLine}></span>
              <span className={styles.hamburgerLine}></span>
              <span className={styles.hamburgerLine}></span>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className={styles.mobileMenu}>
            {user ? (
              <>
                <a href={panelLink} className={styles.mobileLink}>
                  <FaUserCircle className={styles.mobileIcon} /> Panel
                </a>
                <button onClick={handleLogout} className={styles.mobileLink}>
                  Çıxış
                </button>
              </>
            ) : (
              <>
                <a href="/login" className={styles.mobileLink}>Giriş</a>
                <a href="/register-student" className={styles.mobileLink}>Şagird qeydiyyatı</a>
                <a href="/register-teacher" className={styles.mobileLink}>Müəllim qeydiyyatı</a>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;