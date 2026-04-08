import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/NavbarRa';
import palette from '../../components/common/pallette';

function Transport() {
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
          <header className="rounded-3xl border bg-white/95 shadow-xl p-6 md:p-8" style={{ borderColor: palette.frostBlue }}>
            <p className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: palette.skyBlue }}>
              Module Transport
            </p>
            <h1 className="text-2xl md:text-4xl font-black mt-2" style={{ color: palette.deepOcean }}>
              Choisir le type de transport
            </h1>
            <p className="text-sm mt-2" style={{ color: palette.classicBlue }}>
              Accédez à la gestion des bus ou à la gestion du métro.
            </p>
          </header>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <Link
              to="/bus"
              className="group rounded-3xl border bg-white p-6 md:p-7 shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl"
              style={{ borderColor: palette.frostBlue }}
            >
              <div className="text-5xl">🚌</div>
              <h2 className="mt-4 text-2xl font-black" style={{ color: palette.deepOcean }}>
                Bus
              </h2>
              <p className="mt-2 text-sm" style={{ color: palette.classicBlue }}>
                Parc, lignes, chauffeurs et statut opérationnel des bus.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold" style={{ color: palette.softTeal }}>
                Ouvrir la gestion bus <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>

            <Link
              to="/metro"
              className="group rounded-3xl border bg-white p-6 md:p-7 shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl"
              style={{ borderColor: palette.frostBlue }}
            >
              <div className="text-5xl">🚈</div>
              <h2 className="mt-4 text-2xl font-black" style={{ color: palette.deepOcean }}>
                Métro
              </h2>
              <p className="mt-2 text-sm" style={{ color: palette.classicBlue }}>
                Lignes, conducteurs et suivi des rames métro en service.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold" style={{ color: palette.warmAccent }}>
                Ouvrir la gestion métro <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Transport;
