import React from 'react';
import Tilt from 'react-parallax-tilt';
import styles from './FuturePlanets.module.css';


const planets = [
  {
    title: 'Matematik Planet',
    desc: 'Ədədlər mağarasında tapmacaları həll edin, Cəbr emalatxanasında quruluşlar yaradın və məkanlarla tanış olun.',
    image: '../../public/planets/mathplanet.jpg'
  },
  {
    title: 'Elm Planet',
    desc: 'Virtual laboratoriyada təcrübələr aparın, ekosistemləri öyrənin və elementləri tanıyın.',
    image: '../../public/planets/scince.png'
  },
  {
    title: 'Dil və Ədəbiyyat Planet',
    desc: 'Hekayə Meşəsini ziyarət edin, Qrammatika bağına baş çəkin və Yazı studiyasında yaradıcılığınızı ifadə edin.',
    image: '../../public/planets/language.webp'
  },
  {
    title: 'Tarix Planet',
    desc: 'Xronologiya Muzeyində zamanla səyahət edin, tarixi yerləri və hadisələri kəşf edin.',
    image: '../../public/planets/history.webp'
  },
  {
    title: 'İncəsənət və Musiqi Planet',
    desc: 'Rəqəmsal studiyada yaradın, musiqi bəstələyin və vizual ifadə bacarıqlarınızı inkişaf etdirin.',
    image: '../../public/planets/artplanet.webp'
  },
  {
    title: 'Kodlaşdırma Planet',
    desc: 'Kod laboratoriyasında proqramlar yaradın, alqoritmləri öyrənin və tapşırıqları həll edin.',
    image: '../../public/planets/code.jpg'
  }
];

const FuturePlanets = () => {
  return (
    <section className={styles.futureSection}>
      <h2 className={styles.heading}>🔭 Yaxında: EduVerse Planet Sistemi</h2>
      <p className={styles.subheading}>
        EduVerse-un növbəti mərhələsində hər fənn öz 3D planetinə sahib olacaq. Bu sistem təhsili daha əyləncəli və yadda qalan edəcək.
      </p>
      <div className={styles.grid}>
        {planets.map((planet, idx) => (
          <Tilt
            key={idx}
            tiltMaxAngleX={15}
            tiltMaxAngleY={15}
            glareEnable={true}
            glareColor="#ffffff"
            glareBorderRadius="12px"
            className={styles.card}
          >
            <div className={styles.imageWrapper}>
              <img src={planet.image} alt={planet.title} className={styles.image} />
            </div>
            <h3>{planet.title}</h3>
            <p>{planet.desc}</p>
          </Tilt>
        ))}
      </div>
    </section>
  );
};

export default FuturePlanets;
