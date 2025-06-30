import React from 'react';
import styles from './EduVerseFeatures.module.css';

const features = [
  {
    title: 'Müəllim Paneli',
    desc: 'Müəllimlər dərsləri və şagirdləri effektiv şəkildə idarə edir. Rəqəmsal jurnallar üzərindən iştirak, qiymətləndirmə və tapşırıqları izləyir. Hər şey vahid idarəetmə panelində cəmlənir.',
    icon: '🧑‍🏫'
  },
  {
    title: 'Şagirdlər Arasında Canlı Ünsiyyət',
    desc: 'Şagirdlər öz sinif yoldaşları ilə çat vasitəsilə canlı ünsiyyət qura bilir. Bu, əməkdaşlıq və sosial bacarıqları gücləndirir. Sinifdə interaktiv öyrənmə mühiti yaradır.',
    icon: '💬'
  },
  {
    title: 'Rəqəmsal Jurnal Sistemi',
    desc: 'Hər dərs üçün iştirak, qiymətlər, tapşırıqlar və summativlər qeydə alınır. Avtomatik illik nəticə hesablanır. Həm müəllimlər, həm də şagirdlər üçün şəffaf izləmə imkanı yaranır.',
    icon: '📔'
  },
  {
    title: 'Onlayn Test və Quizlər',
    desc: 'Şagirdlər dərslərə uyğun testləri sistem üzərindən həll edir. Müəllimlər nəticələri izləyir və dərhal geribildirim verir. Bu, real vaxtda qiymətləndirmə imkanı yaradır.',
    icon: '📝'
  },
  {
    title: 'Fənn üzrə Statistik Təhlil',
    desc: 'Platforma hər şagirdin iştirak səviyyəsi, qiymətləri və inkişafını təhlil edir. Müəllimlər və valideynlər üçün vizual statistikalar təqdim olunur. Bu, fərdi inkişafı izləməyə imkan verir.',
    icon: '📊'
  },
  {
    title: 'Ev Tapşırıqları və Qiymətləndirmə',
    desc: 'Müəllimlər tapşırıqları sistemə yükləyir, şagirdlər cavablarını geri göndərir. Qiymətləndirmə və geribildirim birbaşa platforma üzərindən aparılır. Bu proses vaxta qənaət və aydınlıq təmin edir.',
    icon: '📚'
  }
];

const EduVerseFeatures = () => {
  return (
    <section className={styles.featuresSection}>
      <h2 className={styles.heading}>EduVerse Xüsusiyyətləri</h2>
      <p className={styles.subheading}>Təhsili daha əlçatan, effektiv və interaktiv edən funksiyalarımızla tanış olun.</p>
      <div className={styles.grid}>
        {features.map((item, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.icon}>{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EduVerseFeatures;
