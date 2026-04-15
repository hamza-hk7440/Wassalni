import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/NavbarRa';
import palette from '../../components/common/pallette';
import tokenLogo from '../../assets/token_logo.png';

const initialClients = [
	{ clientId: 'CL-001', nom: 'Ali Ben Salah', ticketId: 'TK-1023', ticketDate: '2026-04-05', transport: 'Bus', statut: 'Actif', token: 120 },
	{ clientId: 'CL-002', nom: 'Nour Trabelsi', ticketId: 'TK-1024', ticketDate: '2026-04-06', transport: 'Metro', statut: 'Actif', token: 85 },
	{ clientId: 'CL-003', nom: 'Sami Jebali', ticketId: 'TK-1025', ticketDate: '2026-04-09', transport: 'Bus', statut: 'Inactif', token: 40 },
];

const EMPTY_FORM = { nom: '', ticketId: '', ticketDate: '', transport: 'Bus', statut: 'Actif', token: 0 };

function Home() {
	const [clients, setClients] = useState(initialClients);
	const [query, setQuery] = useState('');
	const [editingId, setEditingId] = useState('');
	const [form, setForm] = useState(EMPTY_FORM);

	const startEdit = (client) => {
		setEditingId(client.clientId);
		setForm({
			nom: client.nom,
			ticketId: client.ticketId,
			ticketDate: client.ticketDate,
			transport: client.transport,
			statut: client.statut,
			token: client.token,
		});
	};

	const cancelEdit = () => {
		setEditingId('');
		setForm(EMPTY_FORM);
	};

	const saveEdit = (event) => {
		event.preventDefault();
		setClients((previous) =>
			previous.map((client) => (client.clientId === editingId ? { ...client, ...form } : client))
		);
		cancelEdit();
	};

	const deleteClient = (clientId) => {
		setClients((previous) => previous.filter((client) => client.clientId !== clientId));
		if (editingId === clientId) {
			cancelEdit();
		}
	};

	const filteredClients = clients.filter((client) => {
		const text = query.toLowerCase().trim();
		if (!text) {
			return true;
		}

		return (
			client.clientId.toLowerCase().includes(text) ||
			client.nom.toLowerCase().includes(text) ||
			client.ticketId.toLowerCase().includes(text) ||
			client.ticketDate.toLowerCase().includes(text) ||
			client.transport.toLowerCase().includes(text) ||
			String(client.token).includes(text)
		);
	});

	const totalTokens = filteredClients.reduce((sum, client) => sum + Number(client.token || 0), 0);

	return (
		<div>
			<Navbar />
			<section
				className="min-h-screen pt-24 pb-10 px-4 md:px-8"
				style={{
					background: `linear-gradient(180deg, ${palette.iceWhite} 0%, ${palette.frostBlue} 35%, ${palette.pureWhite} 100%)`,
				}}
			>
				<div className="max-w-5xl mx-auto">
					<header className="rounded-3xl border bg-white/95 shadow-xl p-6 md:p-8 border-frostBlue">
						<p className="text-xs font-bold uppercase tracking-[0.22em] text-skyBlue">
							Module Client
						</p>
						<h1 className="text-2xl md:text-4xl font-black mt-2 text-deepOcean">
							Contrôle des clients
						</h1>
						<p className="text-sm mt-2 text-classicBlue">
							Gérer les clients et leurs IDs ticket rapidement.
						</p>
					</header>

					<div className="mt-6 rounded-3xl border bg-white p-6 md:p-8 shadow-lg border-frostBlue">
						<div>
						<label className="mb-2 block text-sm font-bold text-deepOcean">
							Recherche client
						</label>
						<input
							type="text"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="ID client, nom, ID ticket, type ou token"
							className="w-full rounded-2xl border px-4 py-3 text-sm outline-none border-frostBlue bg-pureWhite text-deepOcean"
						/>
						</div>

						<div className="mt-4 rounded-2xl border px-4 py-3 text-sm font-bold border-frostBlue text-deepOcean bg-iceWhite">
							{filteredClients.length} client(s)
						</div>

						<div className="mt-5 grid gap-4">
							{filteredClients.length === 0 ? (
								<div className="rounded-2xl border border-dashed p-6 text-center text-sm border-frostBlue text-textGray bg-iceWhite">
									Aucun client trouvé.
								</div>
							) : (
								filteredClients.map((client) => (
									<div key={client.clientId} className="rounded-2xl border p-5 shadow-sm border-frostBlue bg-pureWhite">
										<div className="flex flex-wrap items-center justify-between gap-3">
											<div>
												<p className="text-xs font-bold uppercase tracking-[0.2em] text-skyBlue">
													Client
												</p>
												<h2 className="mt-2 text-xl font-black text-deepOcean">
													{client.clientId}
												</h2>
											</div>
											<div className="flex items-center gap-2">
												<div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold text-deepOcean" style={{ borderColor: '#fde68a', backgroundColor: '#fef9c3' }}>
													<img src={tokenLogo} alt="Token logo" className="h-4 w-4 object-contain" />
													{client.token}
												</div>
												<div className="inline-flex rounded-full px-3 py-1 text-xs font-bold bg-deepOcean text-pureWhite">
													{client.statut}
												</div>
											</div>
										</div>

										<p className="mt-3 text-sm font-medium text-classicBlue">
											{client.nom}
										</p>
										<div className="mt-3 grid gap-2 md:grid-cols-2">
											<div className="rounded-xl border px-3 py-2 border-frostBlue bg-iceWhite">
												<p className="text-[11px] font-bold uppercase tracking-wider text-textGray">
													ID Ticket
												</p>
												<p className="text-base font-black text-deepOcean">
													{client.ticketId}
												</p>
											</div>
											<div className="rounded-xl border px-3 py-2 border-frostBlue bg-iceWhite">
												<p className="text-[11px] font-bold uppercase tracking-wider text-textGray">
													Date Ticket
												</p>
												<p className="text-base font-black text-deepOcean">
													{client.ticketDate}
												</p>
											</div>
										</div>

										<p className="mt-2 text-xs text-textGray">
											Type: {client.transport}
										</p>

										<div className="mt-4 flex gap-2">
											<Link
												to={`/BookTicket?ticketId=${encodeURIComponent(client.ticketId)}`}
												className="rounded-full border px-3 py-1.5 text-xs font-bold border-classicBlue text-classicBlue"
											>
												Voir ticket
											</Link>
											<button
												type="button"
												onClick={() => startEdit(client)}
												className="rounded-full border px-3 py-1.5 text-xs font-bold border-frostBlue text-deepOcean"
											>
												Modifier
											</button>
											<button
												type="button"
												onClick={() => deleteClient(client.clientId)}
												className="rounded-full border px-3 py-1.5 text-xs font-bold border-dangerSoft text-dangerText"
											>
												Supprimer
											</button>
										</div>

										{editingId === client.clientId && (
											<form className="mt-4 rounded-2xl border p-4 border-frostBlue bg-pureWhite" onSubmit={saveEdit}>
												<p className="text-sm font-bold text-deepOcean">
													Modifier ce client
												</p>
												<div className="mt-3 grid gap-3 md:grid-cols-2">
													<input
														name="nom"
														value={form.nom}
														onChange={(event) => setForm((previous) => ({ ...previous, nom: event.target.value }))}
														placeholder="Nom"
														className="w-full rounded-2xl border px-4 py-3 text-sm outline-none border-frostBlue"
													/>
													<input
														name="ticketId"
														value={form.ticketId}
														onChange={(event) => setForm((previous) => ({ ...previous, ticketId: event.target.value }))}
														placeholder="ID ticket"
														className="w-full rounded-2xl border px-4 py-3 text-sm outline-none border-frostBlue"
													/>
													<input
														name="ticketDate"
														type="date"
														value={form.ticketDate}
														onChange={(event) => setForm((previous) => ({ ...previous, ticketDate: event.target.value }))}
														className="w-full rounded-2xl border px-4 py-3 text-sm outline-none border-frostBlue"
													/>
													<select
														name="transport"
														value={form.transport}
														onChange={(event) => setForm((previous) => ({ ...previous, transport: event.target.value }))}
														className="w-full rounded-2xl border px-4 py-3 text-sm outline-none border-frostBlue"
													>
														<option value="Bus">Bus</option>
														<option value="Metro">Metro</option>
													</select>
													<select
														name="statut"
														value={form.statut}
														onChange={(event) => setForm((previous) => ({ ...previous, statut: event.target.value }))}
														className="w-full rounded-2xl border px-4 py-3 text-sm outline-none border-frostBlue"
													>
														<option value="Actif">Actif</option>
														<option value="Inactif">Inactif</option>
													</select>
													<input
														name="token"
														type="number"
														min="0"
														value={form.token}
														onChange={(event) => setForm((previous) => ({ ...previous, token: Number(event.target.value) || 0 }))}
														placeholder="Solde token"
														className="w-full rounded-2xl border px-4 py-3 text-sm outline-none md:col-span-2 border-frostBlue"
													/>
												</div>

												<div className="mt-3 flex gap-2">
													<button
														type="submit"
														className="rounded-full px-4 py-2 text-xs font-bold bg-classicBlue text-pureWhite"
													>
														Enregistrer
													</button>
													<button
														type="button"
														onClick={cancelEdit}
														className="rounded-full border px-4 py-2 text-xs font-bold border-frostBlue text-deepOcean"
													>
														Annuler
													</button>
												</div>
											</form>
										)}
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

export default Home;
