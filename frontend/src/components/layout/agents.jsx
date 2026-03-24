import { useMemo, useState } from 'react';
import palette from '../common/pallette';
function AgentsLayout() {
	const [agents, setAgents] = useState([
		{
			id: 1,
			nom: 'Sami Ben Ali',
			email: 'sami.benali@wassalni.tn',
			role: 'Contrôleur',
			statut: 'Actif',
		},
		{
			id: 2,
			nom: 'Nour Trabelsi',
			email: 'nour.trabelsi@wassalni.tn',
			role: 'Agent Station',
			statut: 'Actif',
		},
		{
			id: 3,
			nom: 'Yassine Gharbi',
			email: 'yassine.gharbi@wassalni.tn',
			role: 'Superviseur',
			statut: 'Suspendu',
		},
	]);

	const [search, setSearch] = useState('');
	const [roleFilter, setRoleFilter] = useState('Tous');
	const [form, setForm] = useState({ nom: '', email: '', role: 'Contrôleur', statut: 'Actif' });
	const [editingId, setEditingId] = useState(null);
	const [feedback, setFeedback] = useState('');
	const [error, setError] = useState('');

	const filteredAgents = useMemo(() => {
		return agents.filter((agent) => {
			const matchesSearch =
				agent.nom.toLowerCase().includes(search.toLowerCase()) ||
				agent.email.toLowerCase().includes(search.toLowerCase());
			const matchesRole = roleFilter === 'Tous' || agent.role === roleFilter;
			return matchesSearch && matchesRole;
		});
	}, [agents, search, roleFilter]);

	const resetForm = () => {
		setForm({ nom: '', email: '', role: 'Contrôleur', statut: 'Actif' });
		setEditingId(null);
	};

	const handleFormChange = (event) => {
		const { name, value } = event.target;
		setForm((previous) => ({ ...previous, [name]: value }));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setError('');
		setFeedback('');

		if (!form.nom.trim() || !form.email.trim()) {
			setError('Le nom et l\'email sont obligatoires.');
			return;
		}

		if (!form.email.includes('@')) {
			setError('Veuillez saisir un email valide.');
			return;
		}

		if (editingId) {
			setAgents((previous) =>
				previous.map((agent) => (agent.id === editingId ? { ...agent, ...form, nom: form.nom.trim() } : agent))
			);
			setFeedback('Agent mis à jour avec succès.');
			resetForm();
			return;
		}

		const newAgent = {
			id: Date.now(),
			...form,
			nom: form.nom.trim(),
		};

		setAgents((previous) => [newAgent, ...previous]);
		setFeedback('Nouvel agent ajouté avec succès.');
		resetForm();
	};

	const handleEdit = (agent) => {
		setError('');
		setFeedback('');
		setEditingId(agent.id);
		setForm({
			nom: agent.nom,
			email: agent.email,
			role: agent.role,
			statut: agent.statut,
		});
	};

	const handleDelete = (agentId) => {
		setAgents((previous) => previous.filter((agent) => agent.id !== agentId));
		if (editingId === agentId) {
			resetForm();
		}
		setFeedback('Agent supprimé avec succès.');
		setError('');
	};

	const totalAgents = agents.length;
	const activeAgents = agents.filter((agent) => agent.statut === 'Actif').length;
	const suspendedAgents = totalAgents - activeAgents;

	return (
		<div
			className="min-h-screen pt-24 pb-10 px-4 md:px-8"
			style={{
				background: `radial-gradient(circle at 0% 0%, ${palette.iceWhite} 0%, #f4fbff 45%, #ffffff 100%)`,
			}}
		>
			<div className="max-w-7xl mx-auto space-y-6">
				<section
					className="rounded-3xl p-6 md:p-8 border bg-white/95 shadow-xl"
					style={{ borderColor: palette.frostBlue }}
				>
					<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
						<div>
							<p className="text-xs uppercase tracking-[0.25em] font-bold" style={{ color: palette.skyBlue }}>
								Ressources Humaines
							</p>
							<h1 className="text-2xl md:text-4xl font-black mt-1" style={{ color: palette.deepOcean }}>
								Gestion du personnel
							</h1>
							<p className="mt-2 text-sm font-medium" style={{ color: palette.classicBlue }}>
								Ajoutez, modifiez et suivez les agents actifs de votre réseau.
							</p>
						</div>

						<div className="grid grid-cols-3 gap-3 w-full md:w-auto">
							<div className="rounded-2xl px-4 py-3 text-center border bg-blue-50" style={{ borderColor: palette.frostBlue }}>
								<p className="text-xs font-bold uppercase" style={{ color: palette.classicBlue }}>
									Total
								</p>
								<p className="text-2xl font-black" style={{ color: palette.deepOcean }}>{totalAgents}</p>
							</div>
							<div className="rounded-2xl px-4 py-3 text-center border bg-emerald-50" style={{ borderColor: '#b7e6d2' }}>
								<p className="text-xs font-bold uppercase" style={{ color: '#1b8d66' }}>
									Actifs
								</p>
								<p className="text-2xl font-black" style={{ color: '#0d7a55' }}>{activeAgents}</p>
							</div>
							<div className="rounded-2xl px-4 py-3 text-center border bg-amber-50" style={{ borderColor: '#f1d8ac' }}>
								<p className="text-xs font-bold uppercase" style={{ color: '#b77813' }}>
									Suspendus
								</p>
								<p className="text-2xl font-black" style={{ color: '#9d6611' }}>{suspendedAgents}</p>
							</div>
						</div>
					</div>
				</section>

				<section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
					<article
						className="xl:col-span-1 rounded-3xl border bg-white p-6 md:p-7 shadow-lg"
						style={{ borderColor: palette.frostBlue }}
					>
						<h2 className="text-lg font-black mb-5" style={{ color: palette.deepOcean }}>
							{editingId ? 'Modifier un agent' : 'Ajouter un agent'}
						</h2>

						{error && (
							<div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-semibold">
								{error}
							</div>
						)}
						{feedback && (
							<div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 font-semibold">
								{feedback}
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-sm font-bold mb-1" style={{ color: palette.deepOcean }}>
									Nom complet
								</label>
								<input
									type="text"
									name="nom"
									value={form.nom}
									onChange={handleFormChange}
									placeholder="Ex: Amine Triki"
									className="w-full rounded-xl border px-3 py-2.5 outline-none"
									style={{ borderColor: palette.frostBlue }}
								/>
							</div>

							<div>
								<label className="block text-sm font-bold mb-1" style={{ color: palette.deepOcean }}>
									Email professionnel
								</label>
								<input
									type="email"
									name="email"
									value={form.email}
									onChange={handleFormChange}
									placeholder="agent@wassalni.tn"
									className="w-full rounded-xl border px-3 py-2.5 outline-none"
									style={{ borderColor: palette.frostBlue }}
								/>
							</div>

							<div>
								<label className="block text-sm font-bold mb-1" style={{ color: palette.deepOcean }}>
									Rôle
								</label>
								<select
									name="role"
									value={form.role}
									onChange={handleFormChange}
									className="w-full rounded-xl border px-3 py-2.5 outline-none"
									style={{ borderColor: palette.frostBlue }}
								>
									<option>Contrôleur</option>
									<option>Agent Station</option>
									<option>Superviseur</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-bold mb-1" style={{ color: palette.deepOcean }}>
									Statut
								</label>
								<select
									name="statut"
									value={form.statut}
									onChange={handleFormChange}
									className="w-full rounded-xl border px-3 py-2.5 outline-none"
									style={{ borderColor: palette.frostBlue }}
								>
									<option>Actif</option>
									<option>Suspendu</option>
								</select>
							</div>

							<div className="flex gap-2 pt-2">
								<button
									type="submit"
									className="flex-1 rounded-xl py-2.5 font-bold text-white"
									style={{ background: `linear-gradient(90deg, ${palette.deepOcean}, ${palette.classicBlue})` }}
								>
									{editingId ? 'Enregistrer' : 'Ajouter'}
								</button>
								{editingId && (
									<button
										type="button"
										onClick={resetForm}
										className="rounded-xl py-2.5 px-4 font-bold border"
										style={{ borderColor: palette.frostBlue, color: palette.deepOcean }}
									>
										Annuler
									</button>
								)}
							</div>
						</form>
					</article>

					<article
						className="xl:col-span-2 rounded-3xl border bg-white p-6 md:p-7 shadow-lg"
						style={{ borderColor: palette.frostBlue }}
					>
						<div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-5">
							<h2 className="text-lg font-black" style={{ color: palette.deepOcean }}>
								Liste du personnel
							</h2>
							<div className="flex flex-col sm:flex-row gap-2">
								<input
									type="text"
									value={search}
									onChange={(event) => setSearch(event.target.value)}
									placeholder="Rechercher nom ou email"
									className="rounded-xl border px-3 py-2.5 outline-none"
									style={{ borderColor: palette.frostBlue }}
								/>
								<select
									value={roleFilter}
									onChange={(event) => setRoleFilter(event.target.value)}
									className="rounded-xl border px-3 py-2.5 outline-none"
									style={{ borderColor: palette.frostBlue }}
								>
									<option>Tous</option>
									<option>Contrôleur</option>
									<option>Agent Station</option>
									<option>Superviseur</option>
								</select>
							</div>
						</div>

						<div className="overflow-x-auto">
							<table className="min-w-full">
								<thead>
									<tr className="border-b" style={{ borderColor: palette.frostBlue }}>
										<th className="text-left py-3 px-2 text-xs uppercase tracking-wider" style={{ color: palette.skyBlue }}>Nom</th>
										<th className="text-left py-3 px-2 text-xs uppercase tracking-wider" style={{ color: palette.skyBlue }}>Email</th>
										<th className="text-left py-3 px-2 text-xs uppercase tracking-wider" style={{ color: palette.skyBlue }}>Rôle</th>
										<th className="text-left py-3 px-2 text-xs uppercase tracking-wider" style={{ color: palette.skyBlue }}>Statut</th>
										<th className="text-right py-3 px-2 text-xs uppercase tracking-wider" style={{ color: palette.skyBlue }}>Actions</th>
									</tr>
								</thead>
								<tbody>
									{filteredAgents.length === 0 && (
										<tr>
											<td colSpan="5" className="py-8 text-center text-sm font-semibold" style={{ color: palette.classicBlue }}>
												Aucun agent trouvé pour ce filtre.
											</td>
										</tr>
									)}

									{filteredAgents.map((agent) => (
										<tr key={agent.id} className="border-b last:border-b-0" style={{ borderColor: palette.frostBlue }}>
											<td className="px-2 py-3 font-semibold" style={{ color: palette.deepOcean }}>{agent.nom}</td>
											<td className="px-2 py-3 text-sm" style={{ color: palette.classicBlue }}>{agent.email}</td>
											<td className="px-2 py-3 text-sm" style={{ color: palette.classicBlue }}>{agent.role}</td>
											<td className="px-2 py-3">
												<span
													className="px-3 py-1 rounded-full text-xs font-bold"
													style={{
														color: agent.statut === 'Actif' ? '#0d7a55' : '#9d6611',
														backgroundColor: agent.statut === 'Actif' ? '#e7f8f1' : '#fff4df',
													}}
												>
													{agent.statut}
												</span>
											</td>
											<td className="px-2 py-3 text-right space-x-2">
												<button
													type="button"
													onClick={() => handleEdit(agent)}
													className="px-3 py-1.5 rounded-lg text-xs font-bold border"
													style={{ borderColor: palette.frostBlue, color: palette.deepOcean }}
												>
													Modifier
												</button>
												<button
													type="button"
													onClick={() => handleDelete(agent.id)}
													className="px-3 py-1.5 rounded-lg text-xs font-bold border border-red-600 text-red-600"
												>
													Supprimer
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</article>
				</section>
			</div>
		</div>
	);
}

export default AgentsLayout;
