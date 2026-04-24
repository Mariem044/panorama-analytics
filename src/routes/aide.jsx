import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute } from "@tanstack/react-router";
import { HelpCircle, Mail, Phone, Clock } from "lucide-react";

export const Route = createFileRoute("/aide")({
  component: AidePage,
});

function AidePage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Centre d'Aide</h1>
        <p className="text-muted-foreground">
          Retrouvez les réponses aux questions fréquemment posées et accédez au support
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact Support */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Mail size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Support Email</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Envoyez-nous vos questions ou rapports d'erreurs
              </p>
              <a
                href="mailto:support@finmag.tn"
                className="text-primary hover:underline text-sm font-medium"
              >
                support@finmag.tn
              </a>
            </div>
          </div>
        </div>

        {/* Phone Support */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Phone size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Support Téléphonique</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Appelez-nous pendant les heures de bureau
              </p>
              <a
                href="tel:+21671123456"
                className="text-primary hover:underline text-sm font-medium"
              >
                +216 71 123 456
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <HelpCircle size={24} />
          Questions Fréquentes
        </h2>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <details key={index} className="border border-border rounded-lg overflow-hidden">
              <summary className="px-4 py-3 cursor-pointer hover:bg-secondary/50 font-medium text-foreground">
                {item.question}
              </summary>
              <div className="px-4 py-3 border-t border-border bg-secondary/30 text-sm text-muted-foreground">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Hours */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Clock size={20} className="text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-foreground mb-2">Heures d'ouverture du Support</h3>
            <p className="text-sm text-muted-foreground">
              Lundi - Vendredi: 8h00 - 18h00 (GMT+1)
              <br />
              Samedi: 9h00 - 14h00
              <br />
              Dimanche: Fermé
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const faqItems = [
  {
    question: "Comment accéder aux données de mes ventes ?",
    answer:
      "Cliquez sur 'Analyse Ventes' dans le menu principal pour accéder au tableau de bord complet de vos ventes avec les graphiques et analyses détaillées.",
  },
  {
    question: "Comment exporter les données ?",
    answer:
      "Les données peuvent être exportées depuis chaque page en utilisant le bouton 'Exporter' situé en haut à droite. Les formats CSV et Excel sont supportés.",
  },
  {
    question: "Comment ajouter un nouveau client ?",
    answer:
      "Allez sur 'Analyse Clients' et cliquez sur le bouton 'Nouveau Client'. Remplissez les informations requises et validez.",
  },
  {
    question: "Quelle est la fréquence de mise à jour des données ?",
    answer:
      "Les données sont mises à jour en temps réel. Les rapports sont générés quotidiennement et peuvent être consultés à tout moment.",
  },
  {
    question: "Comment réinitialiser mon mot de passe ?",
    answer:
      "Allez dans Paramètres > Sécurité et cliquez sur 'Changer le mot de passe'. Suivez les instructions envoyées par email pour confirmer.",
  },
  {
    question: "Comment activer les notifications ?",
    answer:
      "Rendez-vous dans les Paramètres et cochez les cases de notifications que vous souhaitez recevoir. Vous recevrez des alertes par email selon vos préférences.",
  },
];
