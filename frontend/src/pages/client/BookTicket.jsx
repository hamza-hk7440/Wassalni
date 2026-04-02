import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import palette from '../../components/common/pallette';

const initialTickets = [
	{ id: 'TK-1023', trajet: 'Tunis -> Sfax', date: '2026-04-05', statut: 'Vendu', transport: 'bus' },
	{ id: 'TK-1024', trajet: 'Sousse -> Tunis', date: '2026-04-06', statut: 'Vendu', transport: 'metro' },
	{ id: 'TK-1025', trajet: 'Nabeul -> Tunis', date: '2026-04-09', statut: 'Vendu', transport: 'bus' },
	{ id: 'TK-1026', trajet: 'Bizerte -> Tunis', date: '2026-04-10', statut: 'Vendu', transport: 'metro' },
	{ id: 'TK-1027', trajet: 'Sfax -> Gabes', date: '2026-04-12', statut: 'Vendu', transport: 'bus' },
];

const EMPTY_EDIT_FORM = { trajet: '', date: '', statut: 'Vendu' };

function BookTicket() {
	const [tickets, setTickets] = useState(initialTickets);
	const [searchQuery, setSearchQuery] = useState('');
	const [searchField, setSearchField] = useState('trajet');
	const [transportFilter, setTransportFilter] = useState('all');
	const [editingId, setEditingId] = useState('');
	const isEditing = Boolean(editingId);
	const [editForm, setEditForm] = useState(EMPTY_EDIT_FORM);

	const searchInputStyle = { borderColor: palette.frostBlue, backgroundColor: palette.pureWhite, color: palette.deepOcean };
	const ticketCardStyle = { borderColor: palette.frostBlue, background: palette.pureWhite };
	const deleteButtonStyle = { borderColor: palette.dangerSoft, color: palette.dangerText };
	const badgeStyle = {
		backgroundColor: palette.deepOcean,
		color: palette.pureWhite,
	};

	const getTransportFilterStyle = (value) => {
		const isActive = transportFilter === value;
		return {
			borderColor: isActive ? palette.deepOcean : palette.frostBlue,
			color: isActive ? palette.pureWhite : palette.deepOcean,
			backgroundColor: isActive ? palette.deepOcean : palette.pureWhite,
		};
	};

	const filteredTickets = tickets.filter((ticket) => {
		const matchesTransport = transportFilter === 'all' || ticket.transport === transportFilter;
		if (!matchesTransport) {
			return false;
		}

		const query = searchQuery.toLowerCase().trim();
		if (!query) {
			return true;
		}

		const value = ticket[searchField].toLowerCase();
		return value.includes(query);
	});

	const startEdit = (ticket) => {
		setEditingId(ticket.id);
		setEditForm({ trajet: ticket.trajet, date: ticket.date, statut: ticket.statut });
	};

	const cancelEdit = () => {
		setEditingId('');
		setEditForm(EMPTY_EDIT_FORM);
	};

	const handleEditChange = (event) => {
		const { name, value } = event.target;
		setEditForm((previous) => ({ ...previous, [name]: value }));
	};

	const saveEdit = (event) => {
		event.preventDefault();
		setTickets((previous) => previous.map((ticket) => (ticket.id === editingId ? { ...ticket, ...editForm } : ticket)));
		cancelEdit();
	};

	const deleteTicket = (ticketId) => {
		setTickets((previous) => previous.filter((ticket) => ticket.id !== ticketId));
		if (editingId === ticketId) {
			cancelEdit();
		}
	};

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
					<header className="rounded-3xl border bg-white/95 shadow-xl p-6 md:p-8" style={{ borderColor: palette.frostBlue }}>
						<p className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: palette.skyBlue }}>
							Module Ticket
						</p>
						<h1 className="text-2xl md:text-4xl font-black mt-2" style={{ color: palette.deepOcean }}>
							Tickets vendus
						</h1>
						<p className="text-sm mt-2" style={{ color: palette.classicBlue }}>
							Affichez les tickets vendus et filtrez-les selon vos critères.
						</p>
					</header>

					<div className="mt-6 rounded-3xl border bg-white p-6 md:p-8 shadow-lg" style={{ borderColor: palette.frostBlue }}>
						<div>
							<label className="mb-2 block text-sm font-bold" style={{ color: palette.deepOcean }}>
								Recherche simple
							</label>
							<div className="mb-3 flex flex-wrap gap-2">
								<button
									type="button"
									onClick={() => setTransportFilter('all')}
									className="rounded-full border px-3 py-1.5 text-xs font-bold"
									style={getTransportFilterStyle('all')}
								>
									Tous
								</button>
								<button
									type="button"
									onClick={() => setTransportFilter('bus')}
									className="rounded-full border px-3 py-1.5 text-xs font-bold"
									style={getTransportFilterStyle('bus')}
								>
									Bus
								</button>
								<button
									type="button"
									onClick={() => setTransportFilter('metro')}
									className="rounded-full border px-3 py-1.5 text-xs font-bold"
									style={getTransportFilterStyle('metro')}
								>
									Metro
								</button>
							</div>
							<div className="grid gap-3 md:grid-cols-[220px_1fr]">
								<select
									value={searchField}
									onChange={(event) => setSearchField(event.target.value)}
									className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-2"
									style={searchInputStyle}
								>
									<option value="trajet">Par trajet</option>
									<option value="id">Par ID</option>
									<option value="date">Par date</option>
									<option value="statut">Par statut</option>
									<option value="transport">Par type</option>
								</select>

								<input
									type="text"
									value={searchQuery}
									onChange={(event) => setSearchQuery(event.target.value)}
									placeholder="Tapez votre recherche"
									className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-2"
									style={searchInputStyle}
								/>
							</div>
						</div>

						<div className="mt-4 rounded-2xl border px-4 py-3 text-sm font-bold" style={{ borderColor: palette.frostBlue, color: palette.deepOcean, backgroundColor: palette.iceWhite }}>
							{filteredTickets.length} ticket(s)
						</div>

						<div className="mt-5 grid gap-4">
							{filteredTickets.length === 0 ? (
								<div className="rounded-2xl border border-dashed p-6 text-center text-sm" style={{ borderColor: palette.frostBlue, color: palette.textGray, backgroundColor: palette.iceWhite }}>
									Aucun ticket trouve.
								</div>
							) : (
								filteredTickets.map((ticket) => (
									<div key={ticket.id} className="rounded-2xl border p-5 shadow-sm" style={ticketCardStyle}>
										<div className="flex flex-wrap items-center justify-between gap-3">
											<div>
												<p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: palette.skyBlue }}>
													Ticket vendu
												</p>
												<h2 className="mt-2 text-xl font-black" style={{ color: palette.deepOcean }}>
													{ticket.id}
												</h2>
												<p className="mt-1 text-xs font-bold uppercase" style={{ color: palette.textGray }}>
													Type: {ticket.transport === 'metro' ? 'Metro' : 'Bus'}
												</p>
											</div>
											<div className="inline-flex rounded-full px-3 py-1 text-xs font-bold" style={badgeStyle}>
												{ticket.statut}
											</div>
										</div>

										<p className="mt-3 text-sm font-medium" style={{ color: palette.classicBlue }}>
											{ticket.trajet}
										</p>
										<p className="mt-2 text-xs" style={{ color: palette.textGray }}>
											Date de voyage: {ticket.date}
										</p>

										<div className="mt-4 flex gap-2">
											<button
												type="button"
												onClick={() => startEdit(ticket)}
												className="rounded-full border px-3 py-1.5 text-xs font-bold"
												style={{ borderColor: palette.frostBlue, color: palette.deepOcean }}
											>
												Modifier
											</button>
											<button
												type="button"
												onClick={() => deleteTicket(ticket.id)}
												className="rounded-full border px-3 py-1.5 text-xs font-bold"
												style={deleteButtonStyle}
											>
												Supprimer
											</button>
										</div>

										{isEditing && editingId === ticket.id && (
											<form className="mt-4 rounded-2xl border p-4" onSubmit={saveEdit} style={{ borderColor: palette.frostBlue, backgroundColor: palette.pureWhite }}>
												<p className="text-sm font-bold" style={{ color: palette.deepOcean }}>
													Modifier ce ticket
												</p>
												<div className="mt-3 grid gap-3 md:grid-cols-2">
													<input
														name="trajet"
														value={editForm.trajet}
														onChange={handleEditChange}
														className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
														style={{ borderColor: palette.frostBlue }}
													/>
													<input
														name="date"
														type="date"
														value={editForm.date}
														onChange={handleEditChange}
														className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
														style={{ borderColor: palette.frostBlue }}
													/>
													<select
														name="statut"
														value={editForm.statut}
														onChange={handleEditChange}
														className="w-full rounded-2xl border px-4 py-3 text-sm outline-none md:col-span-2"
														style={{ borderColor: palette.frostBlue }}
													>
														<option value="Vendu">Vendu</option>
													</select>
												</div>

												<div className="mt-3 flex gap-2">
													<button
														type="submit"
														className="rounded-full px-4 py-2 text-xs font-bold"
														style={{ backgroundColor: palette.classicBlue, color: palette.pureWhite }}
													>
														Enregistrer
													</button>
													<button
														type="button"
														onClick={cancelEdit}
														className="rounded-full border px-4 py-2 text-xs font-bold"
														style={{ borderColor: palette.frostBlue, color: palette.deepOcean }}
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

export default BookTicket;
