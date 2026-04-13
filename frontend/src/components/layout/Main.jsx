import React from 'react';
import { useNavigate } from 'react-router-dom';
import palette from '../common/pallette';

function MainLayout() {
  const navigate = useNavigate();

  const stats = {
    prixTicket: 2.5,
    placesVenduesMetro: 20,
    placesVenduesBus: 5,
    metroEnService: 10,
    busEnService: 15,
    nbMetro: 20,
    revenuHier: 40,
    nbBus: 30,
  };

  const totalRevenueMet = stats.placesVenduesMetro * stats.prixTicket;
  const totalRevenueBus = stats.placesVenduesBus * stats.prixTicket;
  const totalRevenue = totalRevenueMet + totalRevenueBus;
  const totalPlaces = stats.placesVenduesMetro + stats.placesVenduesBus;
  const difference = ((totalRevenue - stats.revenuHier) / stats.revenuHier) * 100;
  const isPositive = difference >= 0;
  const dailyGoal = 500;
  const todayProgress = Math.min((totalRevenue / dailyGoal) * 100, 100);
  const yesterdayProgress = Math.min((stats.revenuHier / dailyGoal) * 100, 100);
  const metroUsage = stats.nbMetro ? (stats.metroEnService / stats.nbMetro) * 100 : 0;
  const busUsage = stats.nbBus ? (stats.busEnService / stats.nbBus) * 100 : 0;
  const todayLabel = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayLabel = yesterday.toLocaleDateString('fr-FR', { weekday: 'long' });

  return (
    <div
      className="relative min-h-screen overflow-hidden px-3 pb-6 pt-22 sm:px-4 sm:pt-24 md:px-8 md:pb-10 md:pt-28"
      style={{
        background: `linear-gradient(180deg, ${palette.iceWhite} 0%, #eef8ff 42%, #f6fbff 100%)`,
      }}
    >
      <div className="pointer-events-none absolute -left-16 top-10 h-44 w-44 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(52,114,156,0.20)' }}></div>
      <div className="pointer-events-none absolute -right-20 top-24 h-52 w-52 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(110,193,209,0.25)' }}></div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-5 sm:gap-6 md:gap-8">
        <section
          className="rounded-[24px] border p-4 shadow-2xl sm:rounded-[28px] sm:p-6 md:p-8"
          style={{
            borderColor: palette.frostBlue,
            background: `linear-gradient(150deg, ${palette.pureWhite} 0%, #f7fcff 60%, #edf8ff 100%)`,
          }}
        >
          <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr] lg:gap-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] sm:text-[11px] text-classicBlue">
                Tableau de bord
              </p>
              <h1 className="mt-2 text-2xl font-black leading-tight sm:text-3xl md:text-5xl text-deepOcean">
                Performance transport
              </h1>

              <div className="mt-5 flex flex-wrap items-end gap-3 sm:gap-4">
                <p className="text-3xl font-black leading-none sm:text-4xl md:text-6xl text-deepOcean">
                  {totalRevenue.toFixed(2)}
                  <span className="ml-1 text-base sm:text-xl md:text-2xl text-softTeal">
                    DT
                  </span>
                </p>
                <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black sm:text-xs ${isPositive ? 'border-green-200 bg-green-100 text-green-800' : 'border-red-200 bg-red-100 text-red-800'}`}>
                  {isPositive ? 'Hausse' : 'Baisse'} {Math.abs(difference).toFixed(1)}%
                </span>
              </div>

              <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-textGray">
                Revenus du {new Date().toLocaleDateString('fr-FR')} | {totalPlaces} transactions
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border p-3 shadow-sm sm:p-4 border-frostBlue bg-pureWhite">
                <p className="mt-1 text-xs font-black uppercase tracking-[0.08em] text-classicBlue">Transactions</p>
                <p className="mt-1 text-xl font-black sm:text-2xl text-deepOcean">{totalPlaces}</p>
              </div>
              <div className="rounded-2xl border p-3 shadow-sm sm:p-4 border-frostBlue bg-pureWhite">
                <p className="mt-1 text-xs font-black uppercase tracking-[0.08em] text-classicBlue">Variation</p>
                <p className="mt-1 text-xl font-black sm:text-2xl" style={{ color: isPositive ? '#166534' : '#b91c1c' }}>
                  {isPositive ? '+' : '-'}{Math.abs(difference).toFixed(1)}%
                </p>
              </div>
              <div className="rounded-2xl border p-3 shadow-sm sm:p-4 border-frostBlue bg-pureWhite">
                <p className="mt-1 text-xs font-black uppercase tracking-[0.08em] text-classicBlue">Revenu metro</p>
                <p className="mt-1 text-xl font-black sm:text-2xl text-deepOcean">{totalRevenueMet.toFixed(2)} DT</p>
              </div>
              <div className="rounded-2xl border p-3 shadow-sm sm:p-4 border-frostBlue bg-pureWhite">
                <p className="mt-1 text-xs font-black uppercase tracking-[0.08em] text-classicBlue">Revenu bus</p>
                <p className="mt-1 text-xl font-black sm:text-2xl text-deepOcean">{totalRevenueBus.toFixed(2)} DT</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-[22px] border bg-white p-4 shadow-xl sm:p-5 md:p-6 border-frostBlue">
            <h2 className="text-[11px] font-black uppercase tracking-[0.18em] sm:text-xs text-deepOcean">
              Tendances revenus
            </h2>

            <div className="mt-4 space-y-4">
              <div>
                <div className="mb-1.5 flex items-center justify-between text-[11px] font-bold sm:text-xs text-deepOcean">
                  <span>{todayLabel} (Aujourd hui)</span>
                  <span>{totalRevenue.toFixed(2)} DT</span>
                </div>
                <div className="h-3.5 overflow-hidden rounded-full" style={{ backgroundColor: '#e8f2f8' }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${todayProgress}%`, background: `linear-gradient(90deg, ${palette.classicBlue} 0%, ${palette.softTeal} 100%)` }}></div>
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between text-[11px] font-bold sm:text-xs text-deepOcean">
                  <span>{yesterdayLabel} (Hier)</span>
                  <span>{stats.revenuHier.toFixed(2)} DT</span>
                </div>
                <div className="h-3.5 overflow-hidden rounded-full" style={{ backgroundColor: '#e8f2f8' }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${yesterdayProgress}%`, backgroundColor: palette.classicBlue }}></div>
                </div>
              </div>
            </div>

            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.1em] text-textGray">
              Objectif: {dailyGoal} DT
            </p>
          </div>

          <div className="rounded-[22px] border bg-white p-4 shadow-xl sm:p-5 md:p-6 border-frostBlue">
            <h2 className="text-[11px] font-black uppercase tracking-[0.18em] sm:text-xs text-deepOcean">
              Actions rapides
            </h2>
            <div className="mt-4 grid gap-3">
              <button
                type="button"
                onClick={() => navigate('/metro')}
                className="rounded-2xl border px-4 py-3 text-left transition-all hover:-translate-y-0.5 border-frostBlue" style={{ backgroundColor: '#f6fbff' }}
              >
                <p className="text-xs font-black uppercase tracking-[0.1em] text-deepOcean">
                  Gestion metro
                </p>
              </button>

              <button
                type="button"
                onClick={() => navigate('/bus')}
                className="rounded-2xl border px-4 py-3 text-left transition-all hover:-translate-y-0.5 border-frostBlue" style={{ backgroundColor: '#f6fbff' }}
              >
                <p className="text-xs font-black uppercase tracking-[0.1em] text-deepOcean">
                  Gestion bus
                </p>
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <article
            onClick={() => navigate('/metro')}
            className="group cursor-pointer rounded-[22px] border bg-white p-4 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl sm:p-5 md:p-6 border-frostBlue"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-textGray">
                  Metro en service
                </p>
                <p className="mt-1 text-3xl font-black sm:text-4xl text-deepOcean">
                  {stats.metroEnService}
                </p>
                <p className="text-xs font-semibold text-textGray">{stats.nbMetro} rames</p>
              </div>
              <span className="text-3xl transition-transform group-hover:scale-110 sm:text-4xl">🚈</span>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full" style={{ backgroundColor: '#e8f2f8' }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${metroUsage}%`, background: `linear-gradient(90deg, ${palette.classicBlue} 0%, ${palette.softTeal} 100%)` }}></div>
            </div>
          </article>

          <article
            onClick={() => navigate('/bus')}
            className="group cursor-pointer rounded-[22px] border bg-white p-4 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl sm:p-5 md:p-6 border-frostBlue"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-textGray">
                  Bus en service
                </p>
                <p className="mt-1 text-3xl font-black sm:text-4xl text-deepOcean">
                  {stats.busEnService}
                </p>
                <p className="text-xs font-semibold text-textGray">{stats.nbBus} bus</p>
              </div>
              <span className="text-3xl transition-transform group-hover:scale-110 sm:text-4xl">🚌</span>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full" style={{ backgroundColor: '#e8f2f8' }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${busUsage}%`, backgroundColor: palette.classicBlue }}></div>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}

export default MainLayout;
