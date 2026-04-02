import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import palette from '../../components/common/pallette';

const initialAgents = [
  { id: 'AG-001', nom: 'Sami Jebali', zone: 'Centre-ville', tickets: 42, statut: 'Actif' },
  { id: 'AG-002', nom: 'Karim Ben Ali', zone: 'Ligne A', tickets: 31, statut: 'Actif' },
  { id: 'AG-003', nom: 'Nour Trabelsi', zone: 'Ligne B', tickets: 18, statut: 'Repos' },
];

function Agent() {
  const [query, setQuery] = useState('');

  const filteredAgents = initialAgents.filter((agent) => {
    const text = query.toLowerCase().trim();
    if (!text) {
      return true;
    }

    return (
      agent.id.toLowerCase().includes(text) ||
      agent.nom.toLowerCase().includes(text) ||
      agent.zone.toLowerCase().includes(text) ||
      agent.statut.toLowerCase().includes(text)
    );
  });

  return (
    <div>
      <Navbar />
      <section
        className="min-h-screen pt-24 pb-10 px-4 md:px-8"
        style={{ background: `linear-gradient(180deg, ${palette.iceWhite} 0%, ${palette.frostBlue} 35%, ${palette.pureWhite} 100%)` }}
      >
        <div className="max-w-5xl mx-auto">
          <header className="rounded-3xl border bg-white/95 shadow-xl p-6 md:p-8" style={{ borderColor: palette.frostBlue }}>
            <p className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: palette.skyBlue }}>
              Module Agent
            </p>
            <h1 className="text-2xl md:text-4xl font-black mt-2" style={{ color: palette.deepOcean }}>
              Gestion des agents
            </h1>
            <p className="text-sm mt-2" style={{ color: palette.classicBlue }}>
              Visualisez les agents de controle et leurs activites.
            </p>
          </header>

          <div className="mt-6 rounded-3xl border bg-white p-6 md:p-8 shadow-lg" style={{ borderColor: palette.frostBlue }}>
            <label className="mb-2 block text-sm font-bold" style={{ color: palette.deepOcean }}>
              Recherche agent
            </label>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ID, nom, zone ou statut"
              className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
              style={{ borderColor: palette.frostBlue, color: palette.deepOcean, backgroundColor: palette.pureWhite }}
            />

            <div className="mt-4 rounded-2xl border px-4 py-3 text-sm font-bold" style={{ borderColor: palette.frostBlue, color: palette.deepOcean, backgroundColor: palette.iceWhite }}>
              {filteredAgents.length} agent(s)
            </div>

            <div className="mt-5 grid gap-4">
              {filteredAgents.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-6 text-center text-sm" style={{ borderColor: palette.frostBlue, color: palette.textGray, backgroundColor: palette.iceWhite }}>
                  Aucun agent trouve.
                </div>
              ) : (
                filteredAgents.map((agent) => (
                  <div key={agent.id} className="rounded-2xl border p-5 shadow-sm" style={{ borderColor: palette.frostBlue, backgroundColor: palette.pureWhite }}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: palette.skyBlue }}>
                          Agent
                        </p>
                        <h2 className="mt-2 text-xl font-black" style={{ color: palette.deepOcean }}>
                          {agent.id}
                        </h2>
                      </div>
                      <div className="inline-flex rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: palette.deepOcean, color: palette.pureWhite }}>
                        {agent.statut}
                      </div>
                    </div>

                    <p className="mt-3 text-sm font-medium" style={{ color: palette.classicBlue }}>
                      {agent.nom}
                    </p>
                    <p className="mt-2 text-xs" style={{ color: palette.textGray }}>
                      Zone: {agent.zone} | Tickets controles: {agent.tickets}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Agent;
