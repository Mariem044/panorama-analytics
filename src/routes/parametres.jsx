import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/parametres")({
  component: ParametresPage,
});

function ParametresPage() {
  return (
    <div className="space-y-6">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-6">Paramètres</h1>

        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Préférences Générales</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Langue</label>
                <select className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground focus:border-primary outline-none">
                  <option>Français</option>
                  <option>English</option>
                  <option>العربية</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Devise</label>
                <select className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground focus:border-primary outline-none">
                  <option>TND - Dinar Tunisien</option>
                  <option>EUR - Euro</option>
                  <option>USD - Dollar</option>
                </select>
              </div>
            </div>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Notifications</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-foreground">Alertes impayés</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-foreground">Rapports quotidiens</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-foreground">Mises à jour système</span>
              </label>
            </div>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Sécurité</h2>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Changer le mot de passe
            </button>
          </section>

          <div className="flex justify-end gap-3 pt-4">
            <button className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-secondary transition-colors">
              Annuler
            </button>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
