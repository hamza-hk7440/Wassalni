import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/NavbarRa';
import palette from '../../components/common/pallette';
import busLogo from '../../assets/bus.png';
import metroLogo from '../../assets/metro.png';
import { useAdminLanguage } from '../../components/common/language.jsx';

function Transport() {
	const { t } = useAdminLanguage();
  return (
    <div>
      <Navbar />
      <section
        className="min-h-screen pt-24 pb-10 px-4 md:px-8"
        style={{
          background: `linear-gradient(180deg, ${palette.iceWhite} 0%, #eff8ff 45%, #f8fcff 100%)`,
        }}
      >
        <div className="max-w-5xl mx-auto">
          <header className="rounded-3xl border bg-white/95 shadow-xl p-6 md:p-8 border-frostBlue">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-skyBlue">
            {t('transportModule', 'Transport Module')}
            </p>
            <h1 className="text-2xl md:text-4xl font-black mt-2 text-deepOcean">
            {t('transportChooseTitle', 'Choose transport type')}
            </h1>
            <p className="text-sm mt-2 text-classicBlue">
            {t('transportChooseSubtitle', 'Access bus management or metro management.')}
            </p>
          </header>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <Link
              to="/bus"
              className="group rounded-3xl border bg-white p-6 md:p-7 shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl border-frostBlue"
            >
              <img
                src={busLogo}
                alt="Logo Bus"
                className="h-14 w-14 object-contain md:h-16 md:w-16"
              />
              <h2 className="mt-4 text-2xl font-black text-deepOcean">
                Bus
              </h2>
              <p className="mt-2 text-sm text-classicBlue">
                Parc, lignes, chauffeurs et statut opérationnel des bus.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-softTeal">
              {t('openBusManagement', 'Open bus management')} <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>

            <Link
              to="/metro"
              className="group rounded-3xl border bg-white p-6 md:p-7 shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl border-frostBlue"
            >
              <img
                src={metroLogo}
                alt="Logo Metro"
                className="h-14 w-14 object-contain md:h-16 md:w-16"
              />
              <h2 className="mt-4 text-2xl font-black text-deepOcean">
              {t('metroInService', 'Metro in service').split(' ')[0]}
              </h2>
              <p className="mt-2 text-sm text-classicBlue">
                Lignes, conducteurs et suivi des rames métro en service.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-warmAccent">
              {t('openMetroManagement', 'Open metro management')} <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Transport;
