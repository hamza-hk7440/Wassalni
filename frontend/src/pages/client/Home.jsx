import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/NavbarRa';
import palette from '../../components/common/pallette';
import tokenLogo from '../../assets/token_logo.png';
import { getAllUsers, deleteUser as deleteUserApi, updateUser } from '../../api/admin';
import { registerUser } from '../../api/auth';
import { useAdminLanguage } from '../../components/common/language.jsx';

const EMPTY_FORM = { nom: '', email: '', signupDate: '', role: 'passenger', token: 0 };
const EMPTY_NEW_CLIENT = { first_name: '', last_name: '', email: '', password: '', role: 'passenger' };

function Home() {
	const { t } = useAdminLanguage();
	const [clients, setClients] = useState([]);
	const [query, setQuery] = useState('');
	const [editingId, setEditingId] = useState('');
	const [form, setForm] = useState(EMPTY_FORM);
	const [loading, setLoading] = useState(true);
	
	// New client states
	const [showAddForm, setShowAddForm] = useState(false);
	const [newClient, setNewClient] = useState(EMPTY_NEW_CLIENT);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		fetchClients();
	}, []);

	const fetchClients = async () => {
		setLoading(true);
		try {
			const data = await getAllUsers();
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

	const handleAddClient = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			await registerUser(newClient);
			setShowAddForm(false);
			setNewClient(EMPTY_NEW_CLIENT);
			fetchClients();
			alert(t('clientAddedSuccess', 'Client added successfully!'));
		} catch (error) {
			console.error('Failed to add client:', error);
			alert(error.response?.data?.error || t('clientAddedError', 'Failed to add client.'));
		} finally {
			setIsSubmitting(false);
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

	const saveEdit = async (event) => {
		event.preventDefault();
		setIsSaving(true);
		console.log("Starting saveEdit for:", editingId);
		try {
			const nameParts = form.nom.trim().split(' ');
			const first_name = nameParts[0] || '';
			const last_name = nameParts.slice(1).join(' ') || '';
			const tokenVal = Number(form.token);

			console.log("Data to send:", { first_name, last_name, email: form.email, token_balance: tokenVal });

			const response = await updateUser(editingId, {
				first_name,
				last_name,
				email: form.email,
				token_balance: tokenVal
			});

			console.log("Server response:", response);

			setClients((previous) =>
				previous.map((client) => (client.clientId === editingId ? { ...client, ...form } : client))
			);
			cancelEdit();
			alert(t('clientUpdatedSuccess', 'Client updated successfully!'));
		} catch (error) {
			console.error('Failed to update client:', error);
			alert(error.response?.data?.error || t('clientUpdatedError', 'Failed to update client.'));
		} finally {
			setIsSaving(false);
		}
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
					<header className="rounded-3xl border bg-white/95 shadow-xl p-6 md:p-8 border-frostBlue flex flex-col md:flex-row md:items-center justify-between gap-4">
						<div>
							<p className="text-xs font-bold uppercase tracking-[0.22em] text-skyBlue">
								{t('clientModule', 'Client Module')}
							</p>
							<h1 className="text-2xl md:text-4xl font-black mt-2 text-deepOcean">
								{t('clientControl', 'Client Control')}
							</h1>
							<p className="text-sm mt-2 text-classicBlue">
								{t('clientControlSubtitle', 'Manage clients and their ticket IDs quickly.')}
							</p>
						</div>
						<button
							onClick={() => setShowAddForm(!showAddForm)}
							className="rounded-full px-6 py-3 font-bold text-white transition-all active:scale-95 shadow-lg"
							style={{ backgroundColor: palette.classicBlue }}
						>
							{showAddForm ? t('cancel', 'Cancel') : t('addNewClient', '+ New Client')}
						</button>
					</header>

					{showAddForm && (
						<div className="mt-6 rounded-3xl border bg-white p-6 md:p-8 shadow-lg border-frostBlue animate-in fade-in slide-in-from-top-4 duration-300">
							<h2 className="text-xl font-black text-deepOcean mb-4">{t('addNewClient', 'Add New Client')}</h2>
							<form onSubmit={handleAddClient} className="grid gap-4 md:grid-cols-2">
								<div>
									<label className="text-xs font-bold text-classicBlue mb-1 block">{t('firstName', 'First Name')}</label>
									<input
										required
										type="text"
										value={newClient.first_name}
										onChange={(e) => setNewClient({...newClient, first_name: e.target.value})}
										className="w-full rounded-2xl border px-4 py-3 text-sm outline-none border-frostBlue"
										placeholder={t('firstName', 'First Name')}
									/>
								</div>
								<div>
									<label className="text-xs font-bold text-classicBlue mb-1 block">{t('lastName', 'Last Name')}</label>
									<input
										required
										type="text"
										value={newClient.last_name}
										onChange={(e) => setNewClient({...newClient, last_name: e.target.value})}
										className="w-full rounded-2xl border px-4 py-3 text-sm outline-none border-frostBlue"
										placeholder={t('lastName', 'Last Name')}
									/>
								</div>
								<div>
									<label className="text-xs font-bold text-classicBlue mb-1 block">{t('emailAddress', 'Email Address')}</label>
									<input
										required
										type="email"
										value={newClient.email}
										onChange={(e) => setNewClient({...newClient, email: e.target.value})}
										className="w-full rounded-2xl border px-4 py-3 text-sm outline-none border-frostBlue"
										placeholder="example@mail.com"
									/>
								</div>
								<div>
									<label className="text-xs font-bold text-classicBlue mb-1 block">{t('password', 'Password')}</label>
									<input
										required
										type="password"
										minLength="6"
										value={newClient.password}
										onChange={(e) => setNewClient({...newClient, password: e.target.value})}
										className="w-full rounded-2xl border px-4 py-3 text-sm outline-none border-frostBlue"
										placeholder="••••••••"
									/>
								</div>
								<div className="md:col-span-2 flex justify-end gap-3 mt-2">
									<button
										type="button"
										onClick={() => setShowAddForm(false)}
										className="rounded-full px-6 py-2 text-sm font-bold border border-frostBlue text-deepOcean"
									>
										{t('cancel', 'Cancel')}
									</button>
									<button
										type="submit"
										disabled={isSubmitting}
										className="rounded-full px-8 py-2 text-sm font-bold text-white disabled:opacity-50"
										style={{ backgroundColor: palette.classicBlue }}
									>
										{isSubmitting ? t('adding', 'Adding...') : t('add', 'Add Client')}
									</button>
								</div>
							</form>
						</div>
					)}

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
