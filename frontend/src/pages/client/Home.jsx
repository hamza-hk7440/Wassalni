import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/NavbarRa';
import palette from '../../components/common/pallette';
import tokenLogo from '../../assets/token_logo.png';
import { getAllUsers, deleteUser as deleteUserApi } from '../../api/admin';
import { useAdminLanguage } from '../../components/common/language.jsx';

const EMPTY_FORM = { nom: '', email: '', signupDate: '', role: 'passenger', token: 0 };

function Home() {
	const { t } = useAdminLanguage();
	const [clients, setClients] = useState([]);
	const [query, setQuery] = useState('');
	const [editingId, setEditingId] = useState('');
	const [form, setForm] = useState(EMPTY_FORM);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchClients();
	}, []);

	const fetchClients = async () => {
		setLoading(true);
		try {
			const data = await getAllUsers();
			// Map backend 'users' rows to frontend expected format
			// Filtering only 'passenger' role as they are the clients
			const formatted = data
				.filter(u => u.role === 'passenger')
				.map(user => ({
					clientId: user.user_id,
					nom: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
					email: user.email || t('unknown', 'Unknown'),
					signupDate: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : t('unknown', 'Unknown'),
					role: user.role,
					token: user.token_balance || 0
				}));
			setClients(formatted);
		} catch (error) {
			console.error('Failed to fetch clients:', error);
		} finally {
			setLoading(false);
		}
	};

	const startEdit = (client) => {
		setEditingId(client.clientId);
		setForm({
			nom: client.nom,
			email: client.email,
			role: client.role,
			token: client.token,
		});
	};

	const cancelEdit = () => {
		setEditingId('');
		setForm(EMPTY_FORM);
	};

	const saveEdit = (event) => {
		event.preventDefault();
		// API UPDATE NOT FULLY IMPLEMENTED ON BACKEND
		setClients((previous) =>
			previous.map((client) => (client.clientId === editingId ? { ...client, ...form } : client))
		);
		cancelEdit();
	};

	const deleteClient = async (clientId) => {
		if (window.confirm(t('deleteClientConfirm', 'Do you really want to delete this client?'))) {
			try {
				await deleteUserApi(clientId);
				setClients((previous) => previous.filter((client) => client.clientId !== clientId));
				if (editingId === clientId) {
					cancelEdit();
				}
			} catch (error) {
				console.error("Erreur de suppression : ", error);
				alert(t('deleteClientError', 'Error while deleting client.'));
			}
		}
	};

	const filteredClients = clients.filter((client) => {
		const text = query.toLowerCase().trim();
		if (!text) {
			return true;
		}

		return (
			String(client.clientId || '').toLowerCase().includes(text) ||
			String(client.nom || '').toLowerCase().includes(text) ||
			String(client.email || '').toLowerCase().includes(text) ||
			String(client.role || '').toLowerCase().includes(text) ||
			String(client.token || '').includes(text)
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
							{t('clientModule', 'Client Module')}
						</p>
						<h1 className="text-2xl md:text-4xl font-black mt-2 text-deepOcean">
							{t('clientControl', 'Client Control')}
						</h1>
						<p className="text-sm mt-2 text-classicBlue">
							{t('clientControlSubtitle', 'Manage clients and their ticket IDs quickly.')}
						</p>
					</header>

					<div className="mt-6 rounded-3xl border bg-white p-6 md:p-8 shadow-lg border-frostBlue">
						<div>
						<label className="mb-2 block text-sm font-bold text-deepOcean">
							{t('clientSearch', 'Client search')}
						</label>
						<input
							type="text"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder={t('clientSearchPlaceholder', 'Client ID, name, email or token')}
							className="w-full rounded-2xl border px-4 py-3 text-sm outline-none border-frostBlue bg-pureWhite text-deepOcean"
						/>
						</div>

						<div className="mt-4 rounded-2xl border px-4 py-3 text-sm font-bold border-frostBlue text-deepOcean bg-iceWhite">
							{loading ? t('loading', 'Loading...') : `${filteredClients.length} ${t('clientsCount', 'client(s)')}`}
						</div>

						<div className="mt-5 grid gap-4">
							{loading ? (
								<div className="rounded-2xl border border-dashed p-6 text-center text-sm border-frostBlue text-textGray bg-iceWhite">
									{t('loadingClients', 'Loading clients...')}
								</div>
							) : filteredClients.length === 0 ? (
								<div className="rounded-2xl border border-dashed p-6 text-center text-sm border-frostBlue text-textGray bg-iceWhite">
									{t('emptyClients', 'No clients found.')}
								</div>
							) : (
								filteredClients.map((client) => (
									<div key={client.clientId} className="rounded-2xl border p-5 shadow-sm border-frostBlue bg-pureWhite">
										<div className="flex flex-wrap items-center justify-between gap-3">
											<div>
												<p className="text-xs font-bold uppercase tracking-[0.2em] text-skyBlue">
													{t('clientLabel', 'Client')}
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
													{client.role.toUpperCase()}
												</div>
											</div>
										</div>

										<p className="mt-3 text-sm font-medium text-classicBlue">
											{client.nom}
										</p>
										<div className="mt-3 grid gap-2 md:grid-cols-2">
											<div className="rounded-xl border px-3 py-2 border-frostBlue bg-iceWhite">
												<p className="text-[11px] font-bold uppercase tracking-wider text-textGray">
													{t('clientEmail', 'Client e-mail')}
												</p>
												<p className="text-base font-black text-deepOcean overflow-hidden text-ellipsis">
													{client.email}
												</p>
											</div>
											<div className="rounded-xl border px-3 py-2 border-frostBlue bg-iceWhite">
												<p className="text-[11px] font-bold uppercase tracking-wider text-textGray">
													{t('signupDate', 'Signup date')}
												</p>
												<p className="text-base font-black text-deepOcean">
													{client.signupDate}
												</p>
											</div>
										</div>

										<div className="mt-4 flex gap-2">
											<button
												type="button"
												onClick={() => startEdit(client)}
												className="rounded-full border px-3 py-1.5 text-xs font-bold border-frostBlue text-deepOcean"
											>
												{t('edit', 'Edit')}
											</button>
											<button
												type="button"
												onClick={() => deleteClient(client.clientId)}
												className="rounded-full border px-3 py-1.5 text-xs font-bold border-dangerSoft text-dangerText"
											>
												{t('delete', 'Delete')}
											</button>
										</div>

										{editingId === client.clientId && (
											<form className="mt-4 rounded-2xl border p-4 border-frostBlue bg-pureWhite" onSubmit={saveEdit}>
												<p className="text-sm font-bold text-deepOcean">
													{t('editClient', 'Edit this client')}
												</p>
												<div className="mt-3 grid gap-3 md:grid-cols-2">
													<div>
														<label className="text-xs font-bold text-classicBlue mb-1 block">{t('fullName', 'Full name')}</label>
														<input
															name="nom"
															value={form.nom}
															onChange={(event) => setForm((previous) => ({ ...previous, nom: event.target.value }))}
															placeholder="Nom"
															className="w-full rounded-2xl border px-4 py-3 text-sm outline-none border-frostBlue"
														/>
													</div>
													<div>
														<label className="text-xs font-bold text-classicBlue mb-1 block">{t('emailAddress', 'Email address')}</label>
														<input
															name="email"
															value={form.email}
															onChange={(event) => setForm((previous) => ({ ...previous, email: event.target.value }))}
															placeholder="Email"
															className="w-full rounded-2xl border px-4 py-3 text-sm outline-none border-frostBlue"
														/>
													</div>
													<div>
														<label className="text-xs font-bold text-classicBlue mb-1 block">{t('userRole', 'User role')}</label>
														<select
															name="role"
															value={form.role}
															disabled
															className="w-full rounded-2xl border px-4 py-3 text-sm outline-none border-frostBlue bg-gray-100 cursor-not-allowed opacity-70"
														>
															<option value="passenger">{t('passenger', 'Passenger')}</option>
															<option value="admin">Administrateur</option>
															<option value="controller">Contrôleur</option>
														</select>
													</div>
													<div>
														<label className="text-xs font-bold text-classicBlue mb-1 block">{t('tokenBalance', 'Token balance')}</label>
														<input
															name="token"
															type="number"
															min="0"
															value={form.token}
															onChange={(event) => setForm((previous) => ({ ...previous, token: Number(event.target.value) || 0 }))}
															placeholder="Solde token"
															className="w-full rounded-2xl border px-4 py-3 text-sm outline-none border-frostBlue"
														/>
													</div>
												</div>

												<div className="mt-3 flex gap-2">
													<button
														type="submit"
														className="rounded-full px-4 py-2 text-xs font-bold bg-classicBlue text-pureWhite"
													>
														{t('save', 'Save')}
													</button>
													<button
														type="button"
														onClick={cancelEdit}
														className="rounded-full border px-4 py-2 text-xs font-bold border-frostBlue text-deepOcean"
													>
														{t('cancel', 'Cancel')}
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
