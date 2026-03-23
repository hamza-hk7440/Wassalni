import React from 'react';
import { Link } from 'react-router-dom';

function BookTicket() {
	return (
		<div className="min-h-screen bg-slate-50 p-6 md:p-10">
			<div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
				<h1 className="text-2xl font-bold text-slate-800">Reservation Ticket</h1>
				<p className="mt-2 text-sm text-slate-600">Page de reservation prete. Tu peux maintenant brancher le formulaire et l'API.</p>

				<div className="mt-6">
					<Link to="/client" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
						Retour client
					</Link>
				</div>
			</div>
		</div>
	);
}

export default BookTicket;
