import { createFileRoute } from "@tanstack/react-router";
import { HelpCircle, Mail, Phone, Clock } from "lucide-react";
import { useParametres } from "@/store/useParametres";

export const Route = createFileRoute("/aide")({
  component: AidePage,
});

const faqKeys = [
  {
    question_fr: "Comment accéder aux données de mes ventes ?",
    question_en: "How do I access my sales data?",
    question_ar: "كيف أصل إلى بيانات مبيعاتي؟",
    answer_fr: "Cliquez sur 'D1 — CA & Performance Commerciale' dans le menu pour accéder au tableau de bord complet des ventes.",
    answer_en: "Click 'Revenue & Sales Performance' in the menu to access the full sales dashboard.",
    answer_ar: "انقر على 'رقم الأعمال والأداء التجاري' في القائمة للوصول إلى لوحة المبيعات الكاملة.",
  },
  {
    question_fr: "Comment exporter les données ?",
    question_en: "How do I export data?",
    question_ar: "كيف أقوم بتصدير البيانات؟",
    answer_fr: "Les données peuvent être exportées depuis chaque page en utilisant le bouton 'Exporter'. Les formats CSV et Excel sont supportés.",
    answer_en: "Data can be exported from each page using the 'Export' button. CSV and Excel formats are supported.",
    answer_ar: "يمكن تصدير البيانات من كل صفحة باستخدام زر 'تصدير'. يدعم النظام تنسيقات CSV و Excel.",
  },
  {
    question_fr: "Quelle est la fréquence de mise à jour des données ?",
    question_en: "How often is data updated?",
    question_ar: "ما تواتر تحديث البيانات؟",
    answer_fr: "Les données sont synchronisées depuis les bases MAG_2020 et GRT_MAG. Les rapports sont générés quotidiennement.",
    answer_en: "Data is synchronized from the MAG_2020 and GRT_MAG databases. Reports are generated daily.",
    answer_ar: "تتزامن البيانات من قواعد MAG_2020 وGRT_MAG. يتم إنشاء التقارير يومياً.",
  },
  {
    question_fr: "Comment réinitialiser mon mot de passe ?",
    question_en: "How do I reset my password?",
    question_ar: "كيف أعيد تعيين كلمة المرور؟",
    answer_fr: "Allez dans Paramètres > Sécurité et cliquez sur 'Changer le mot de passe'.",
    answer_en: "Go to Settings > Security and click 'Change password'.",
    answer_ar: "انتقل إلى الإعدادات > الأمان وانقر على 'تغيير كلمة المرور'.",
  },
  {
    question_fr: "Comment activer les notifications ?",
    question_en: "How do I enable notifications?",
    question_ar: "كيف أفعّل الإشعارات؟",
    answer_fr: "Rendez-vous dans les Paramètres et cochez les cases de notifications que vous souhaitez recevoir.",
    answer_en: "Go to Settings and check the notification boxes you want to receive.",
    answer_ar: "انتقل إلى الإعدادات وحدد مربعات الإشعارات التي تريد استقبالها.",
  },
  {
    question_fr: "Que signifie le score d'attrition ?",
    question_en: "What does the attrition score mean?",
    question_ar: "ماذا يعني مؤشر التسرب؟",
    answer_fr: "Le score d'attrition (KPI-24) est calculé par un modèle Random Forest. Un score > 0.5 indique un client à risque de départ.",
    answer_en: "The attrition score (KPI-24) is calculated by a Random Forest model. A score > 0.5 indicates a client at risk of churning.",
    answer_ar: "يُحسب مؤشر التسرب (KPI-24) بواسطة نموذج Random Forest. يشير المؤشر > 0.5 إلى عميل معرض لخطر المغادرة.",
  },
];

function AidePage() {
  const { t, langue } = useParametres();

  const qKey = langue === "English" ? "question_en" : langue === "العربية" ? "question_ar" : "question_fr";
  const aKey = langue === "English" ? "answer_en" : langue === "العربية" ? "answer_ar" : "answer_fr";

  const hoursLines = t("aide.hoursDetail").split("\n");

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{t("aide.title")}</h1>
        <p className="text-muted-foreground">{t("aide.subtitle")}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Mail size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{t("aide.emailSupport")}</h3>
              <p className="text-sm text-muted-foreground mb-3">{t("aide.emailDesc")}</p>
              <a href="mailto:support@siad.tn" className="text-primary hover:underline text-sm font-medium">
                support@siad.tn
              </a>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Phone size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{t("aide.phoneSupport")}</h3>
              <p className="text-sm text-muted-foreground mb-3">{t("aide.phoneDesc")}</p>
              <a href="tel:+21671123456" className="text-primary hover:underline text-sm font-medium">
                +216 71 123 456
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <HelpCircle size={24} />
          {t("aide.faq")}
        </h2>
        <div className="space-y-3">
          {faqKeys.map((item, index) => (
            <details key={index} className="border border-border rounded-lg overflow-hidden">
              <summary className="px-4 py-3 cursor-pointer hover:bg-secondary/50 font-medium text-foreground">
                {item[qKey]}
              </summary>
              <div className="px-4 py-3 border-t border-border bg-secondary/30 text-sm text-muted-foreground">
                {item[aKey]}
              </div>
            </details>
          ))}
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Clock size={20} className="text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-foreground mb-2">{t("aide.hours")}</h3>
            <p className="text-sm text-muted-foreground">
              {hoursLines.map((line, i) => (
                <span key={i}>{line}{i < hoursLines.length - 1 && <br />}</span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}