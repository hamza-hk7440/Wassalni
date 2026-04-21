import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import palette from '../common/pallette';
import { getDashboardStats } from '../../api/admin';
import metroLogo from '../../assets/metro.png';
import busLogo from '../../assets/bus.png';
import { useAdminLanguage } from '../common/language.jsx';

function MainLayout() {
	const { language, t } = useAdminLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenuHier: 120, // Retained mock since historical tracking isn't built in DB yet
    total_users: 0,
    total_transactions: 0,
    total_revenue: 0,
    revenue_metro: 0,
    revenue_bus: 0,
    buses_count: 0,
    metros_count: 0,
    places_vendues_metro: 0,
    places_vendues_bus: 0,
    total_places: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(prev => ({
          ...prev,
          total_users: data.total_users || 0,
          total_transactions: data.total_transactions || 0,
          total_revenue: data.total_revenue || 0,
          revenue_metro: data.revenue_metro || 0,
          revenue_bus: data.revenue_bus || 0,
          buses_count: data.buses_count || 0,
          metros_count: data.metros_count || 0,
          places_vendues_metro: data.places_vendues_metro || 0,
          places_vendues_bus: data.places_vendues_bus || 0,
          total_places: data.total_places || 0
        }));
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalRevenue = stats.total_revenue;
  const totalPlaces = stats.total_places;
  const totalFleet = stats.buses_count + stats.metros_count;
  const totalModeRevenue = stats.revenue_bus + stats.revenue_metro;
  const busRevenuePercent = totalModeRevenue ? (stats.revenue_bus / totalModeRevenue) * 100 : 0;
  const metroRevenuePercent = totalModeRevenue ? (stats.revenue_metro / totalModeRevenue) * 100 : 0;
  const metroSeatsPercent = totalPlaces ? (stats.places_vendues_metro / totalPlaces) * 100 : 0;
  const busSeatsPercent = totalPlaces ? (stats.places_vendues_bus / totalPlaces) * 100 : 0;
  
  const difference = stats.revenuHier ? ((totalRevenue - stats.revenuHier) / stats.revenuHier) * 100 : 0;
  const isPositive = difference >= 0;
  
  // Assuming 100% active operational capacity for existing vehicles in db
  const metroUsage = 100;
  const busUsage = 100;
  
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: `linear-gradient(180deg, ${palette.iceWhite} 0%, ${palette.pureWhite} 100%)` }}
      >
        <div
          className="rounded-3xl border px-6 py-5 text-center shadow-xl"
          style={{ borderColor: palette.frostBlue, backgroundColor: palette.pureWhite }}
        >
          <p className="text-sm font-black uppercase tracking-[0.14em]" style={{ color: palette.classicBlue }}>
            {t('dashboardLabel', 'Dashboard')}
          </p>
          <p className="mt-2 text-base font-semibold" style={{ color: palette.deepOcean }}>
            {t('loading', 'Loading...')}
          </p>
        </div>
      </div>
    );
  }

  return (
      <div
      className="relative min-h-screen overflow-hidden px-3 pb-6 pt-22 sm:px-4 sm:pt-24 md:px-8 md:pb-10 md:pt-28"
      style={{
        background: `linear-gradient(180deg, ${palette.iceWhite} 0%, rgba(200, 234, 236, 0.6) 42%, ${palette.pureWhite} 100%)`,
      }}
    >
      <div className="pointer-events-none absolute -left-16 top-10 h-44 w-44 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(52, 114, 156, 0.2)' }}></div>
      <div className="pointer-events-none absolute -right-20 top-24 h-52 w-52 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(110, 193, 209, 0.25)' }}></div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-5 sm:gap-6 md:gap-8">
        <section
          className="rounded-[24px] border p-4 shadow-2xl sm:rounded-[28px] sm:p-6 md:p-8"
          style={{
            borderColor: palette.frostBlue,
            background: `linear-gradient(150deg, ${palette.pureWhite} 0%, rgba(209, 236, 255, 0.42) 60%, rgba(200, 234, 236, 0.5) 100%)`,
          }}
        >
          <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr] lg:gap-6">        
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] sm:text-[11px] text-classicBlue">
                {t('dashboardLabel', 'Dashboard')}
              </p>
              <h1 className="mt-2 text-2xl font-black leading-tight sm:text-3xl md:text-5xl text-deepOcean">
                {t('transportPerformance', 'Transport performance')}
              </h1>

              <div className="mt-5 flex flex-wrap items-end gap-3 sm:gap-4">    
                <p className="text-3xl font-black leading-none sm:text-4xl md:text-6xl text-deepOcean">
                  {totalRevenue.toFixed(2)}
                  <span className="ml-1 text-base sm:text-xl md:text-2xl text-softTeal">
                    DT
                  </span>
                </p>
                <span
                  className="inline-flex rounded-full border px-3 py-1 text-[11px] font-black sm:text-xs"
                  style={{
                    borderColor: isPositive ? palette.softTeal : palette.dangerText,
                    backgroundColor: isPositive ? 'rgba(110, 193, 209, 0.18)' : 'rgba(244, 201, 201, 0.8)',
                    color: isPositive ? palette.deepOcean : palette.dangerText,
                  }}
                >
                  {isPositive ? t('increase', 'Increase') : t('decrease', 'Decrease')} {Math.abs(difference).toFixed(1)}%
                </span>
              </div>

              <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-textGray">
                {t('revenueDateTransactions', 'Revenue on {date} | {count} transactions', {
                  date: new Date().toLocaleDateString(language === 'en' ? 'en-GB' : 'fr-FR'),
                  count: totalPlaces,
                })}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border p-3 shadow-sm sm:p-4 border-frostBlue bg-pureWhite">
                <p className="mt-1 text-xs font-black uppercase tracking-[0.08em] text-classicBlue">{t('transactions', 'Transactions')}</p>
                <p className="mt-1 text-xl font-black sm:text-2xl text-deepOcean">{totalPlaces}</p>
              </div>
              <div className="rounded-2xl border p-3 shadow-sm sm:p-4 border-frostBlue bg-pureWhite">
                <p className="mt-1 text-xs font-black uppercase tracking-[0.08em] text-classicBlue">{t('variation', 'Variation')}</p>
                <p className="mt-1 text-xl font-black sm:text-2xl" style={{ color: isPositive ? palette.deepOcean : palette.dangerText }}>
                  {isPositive ? '+' : '-'}{Math.abs(difference).toFixed(1)}%    
                </p>
              </div>
              <div className="rounded-2xl border p-3 shadow-sm sm:p-4 border-frostBlue bg-pureWhite">
                <p className="mt-1 text-xs font-black uppercase tracking-[0.08em] text-classicBlue">{t('totalUsers', 'Total users')}</p>
                <p className="mt-1 text-xl font-black sm:text-2xl text-deepOcean">{stats.total_users}</p>
              </div>
              <div className="rounded-2xl border p-3 shadow-sm sm:p-4 border-frostBlue bg-pureWhite">
                <p className="mt-1 text-xs font-black uppercase tracking-[0.08em] text-classicBlue">{t('totalRevenueGlobal', 'Total revenue (Global)')}</p>
                <p className="mt-1 text-xl font-black sm:text-2xl text-deepOcean">{stats.total_revenue} DT</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <article className="rounded-[22px] border p-5 shadow-xl border-frostBlue" style={{ backgroundColor: 'rgba(255, 255, 255, 0.92)' }}>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-textGray">{t('totalFleet', 'Total fleet')}</p>
            <p className="mt-1 text-4xl font-black text-deepOcean">{totalFleet}</p>
            <p className="mt-1 text-xs font-semibold text-textGray">{t('metrosAndBuses', '{metros} metros and {buses} buses', { metros: stats.metros_count, buses: stats.buses_count })}</p>
          </article>

          <article className="rounded-[22px] border p-5 shadow-xl border-frostBlue" style={{ backgroundColor: 'rgba(255, 255, 255, 0.92)' }}>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-textGray">{t('metroSeatsSold', 'Metro seats sold')}</p>
            <p className="mt-1 text-4xl font-black text-deepOcean">{stats.places_vendues_metro}</p>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(209, 236, 255, 0.9)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${metroSeatsPercent}%`, background: `linear-gradient(90deg, ${palette.classicBlue} 0%, ${palette.skyBlue} 100%)` }}
              ></div>
            </div>
          </article>

          <article className="rounded-[22px] border p-5 shadow-xl border-frostBlue" style={{ backgroundColor: 'rgba(255, 255, 255, 0.92)' }}>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-textGray">{t('busSeatsSold', 'Bus seats sold')}</p>
            <p className="mt-1 text-4xl font-black text-deepOcean">{stats.places_vendues_bus}</p>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(209, 236, 255, 0.9)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${busSeatsPercent}%`, background: `linear-gradient(90deg, ${palette.softTeal} 0%, ${palette.classicBlue} 100%)` }}
              ></div>
            </div>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_1fr]">
          <article className="rounded-[22px] border p-5 shadow-xl border-frostBlue" style={{ backgroundColor: 'rgba(255, 255, 255, 0.92)' }}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black text-deepOcean">{t('quickActions', 'Quick actions')}</h2>
              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-classicBlue">{t('administration', 'Administration')}</span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={() => navigate('/stations')}
                className="rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ borderColor: palette.frostBlue, backgroundColor: palette.pureWhite }}
              >
                <p className="text-xs font-black uppercase tracking-[0.12em] text-classicBlue">Stations</p>
                <p className="mt-1 text-sm font-semibold text-deepOcean">{t('addOrEditStations', 'Add or edit stations')}</p>
              </button>

              <button
                onClick={() => navigate('/routes')}
                className="rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ borderColor: palette.frostBlue, backgroundColor: palette.pureWhite }}
              >
                <p className="text-xs font-black uppercase tracking-[0.12em] text-classicBlue">Routes</p>
                <p className="mt-1 text-sm font-semibold text-deepOcean">{t('configureRoutes', 'Configure routes')}</p>
              </button>

              <button
                onClick={() => navigate('/schedules')}
                className="rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ borderColor: palette.frostBlue, backgroundColor: palette.pureWhite }}
              >
                <p className="text-xs font-black uppercase tracking-[0.12em] text-classicBlue">Schedules</p>
                <p className="mt-1 text-sm font-semibold text-deepOcean">{t('planDepartures', 'Plan departures')}</p>
              </button>

              <button
                onClick={() => navigate('/transport')}
                className="rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ borderColor: palette.frostBlue, backgroundColor: palette.pureWhite }}
              >
                <p className="text-xs font-black uppercase tracking-[0.12em] text-classicBlue">Transport</p>
                <p className="mt-1 text-sm font-semibold text-deepOcean">{t('manageActiveFleet', 'Manage active fleet')}</p>
              </button>
            </div>
          </article>

          <article className="rounded-[22px] border p-5 shadow-xl border-frostBlue" style={{ backgroundColor: 'rgba(255, 255, 255, 0.92)' }}>
            <h2 className="text-lg font-black text-deepOcean">{t('revenueSplit', 'Revenue split')}</h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-textGray">{t('busVsMetro', 'Bus vs Metro')}</p>

            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between text-sm font-semibold">
                  <span className="text-deepOcean">Bus</span>
                  <span className="text-textGray">{stats.revenue_bus.toFixed(2)} DT ({busRevenuePercent.toFixed(1)}%)</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(209, 236, 255, 0.9)' }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${busRevenuePercent}%`, backgroundColor: palette.classicBlue }}></div>
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between text-sm font-semibold">
                  <span className="text-deepOcean">Metro</span>
                  <span className="text-textGray">{stats.revenue_metro.toFixed(2)} DT ({metroRevenuePercent.toFixed(1)}%)</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(209, 236, 255, 0.9)' }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${metroRevenuePercent}%`, background: `linear-gradient(90deg, ${palette.softTeal} 0%, ${palette.skyBlue} 100%)` }}></div>
                </div>
              </div>
            </div>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <article
            onClick={() => navigate('/metro')}
            className="group cursor-pointer rounded-[22px] border p-4 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl sm:p-5 md:p-6 border-frostBlue"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.94)' }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-textGray">
                  {t('metroInService', 'Metro in service')}
                </p>
                <p className="mt-1 text-3xl font-black sm:text-4xl text-deepOcean">
                  {stats.metros_count}
                </p>
                <p className="text-xs font-semibold text-textGray">{stats.metros_count} {t('trainsets', 'trainsets')}</p>
              </div>
              <img
                src={metroLogo}
                alt="Logo Metro"
                className="h-10 w-10 object-contain transition-transform group-hover:scale-110 sm:h-12 sm:w-12"
              />
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(209, 236, 255, 0.9)' }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${metroUsage}%`, background: `linear-gradient(90deg, ${palette.classicBlue} 0%, ${palette.softTeal} 100%)` }}></div>
            </div>
          </article>

          <article
            onClick={() => navigate('/bus')}
            className="group cursor-pointer rounded-[22px] border p-4 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl sm:p-5 md:p-6 border-frostBlue"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.94)' }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-textGray">
                  {t('busInService', 'Bus in service')}
                </p>
                <p className="mt-1 text-3xl font-black sm:text-4xl text-deepOcean">
                  {stats.buses_count}
                </p>
                <p className="text-xs font-semibold text-textGray">{stats.buses_count} bus</p>
              </div>
              <img
                src={busLogo}
                alt="Logo Bus"
                className="h-10 w-10 object-contain transition-transform group-hover:scale-110 sm:h-12 sm:w-12"
              />
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(209, 236, 255, 0.9)' }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${busUsage}%`, backgroundColor: palette.classicBlue }}></div>   
            </div>
          </article>
        </section>

      </div>
    </div>
  );
}

export default MainLayout;
