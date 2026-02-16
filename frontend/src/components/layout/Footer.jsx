import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  const palette = {
    primary: "#00ACC1",
    secondary: "#FF6B6B",
    accent: "#4ECDC4",
    bgDark: "#1A202C",
    textLight: "#E2E8F0",
    textGray: "#A0AEC0",
  };

  return (
    <footer className="mt-auto" style={{ backgroundColor: palette.bgDark, borderTop: `2px solid ${palette.primary}40` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-black mb-3" style={{ color: palette.primary }}>
              TRANSPORT<span style={{ color: palette.accent, fontWeight: 300 }}>PRO</span>
            </h3>
            <p style={{ color: palette.textGray }} className="text-sm mb-4">
              Solution complète de gestion de transport urbain pour métros et bus.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-xl hover:scale-110 transition-transform" title="Facebook">📘</a>
              <a href="#" className="text-xl hover:scale-110 transition-transform" title="Twitter">𝕏</a>
              <a href="#" className="text-xl hover:scale-110 transition-transform" title="LinkedIn">💼</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4" style={{ color: palette.textLight }}>Accès Rapide</h4>
            <ul className="space-y-2">
              <li><a href="/metro" className="text-sm hover:text-white transition-colors" style={{ color: palette.textGray }}>🚈 Métro</a></li>
              <li><a href="/bus" className="text-sm hover:text-white transition-colors" style={{ color: palette.textGray }}>🚌 Bus</a></li>
              <li><a href="/agents" className="text-sm hover:text-white transition-colors" style={{ color: palette.textGray }}>👨‍💼 Agents</a></li>
              <li><a href="/ticket" className="text-sm hover:text-white transition-colors" style={{ color: palette.textGray }}>🎫 Tickets</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-4" style={{ color: palette.textLight }}>Support</h4>
            <ul className="space-y-2 text-sm" style={{ color: palette.textGray }}>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <span>📧</span> support@transportpro.tn
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <span>📱</span> +216 71 123 456
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <span>📍</span> Tunis, Tunisie
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <span>⏰</span> 24/7 Disponible
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTopColor: palette.primary + '40', borderTopWidth: '1px' }} className="my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p style={{ color: palette.textGray }} className="text-sm">
            © {currentYear} TransportPRO. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" style={{ color: palette.textGray }} className="hover:text-white transition-colors">
              Politique de confidentialité
            </a>
            <a href="#" style={{ color: palette.textGray }} className="hover:text-white transition-colors">
              Conditions d'utilisation
            </a>
            <a href="#" style={{ color: palette.textGray }} className="hover:text-white transition-colors">
              Mentions légales
            </a>
          </div>
        </div>

        {/* Version Info */}
        <div className="mt-6 pt-6" style={{ borderTopColor: palette.primary + '20', borderTopWidth: '1px' }}>
          <p style={{ color: palette.textGray }} className="text-xs text-center">
            Version 1.0.0 • Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
