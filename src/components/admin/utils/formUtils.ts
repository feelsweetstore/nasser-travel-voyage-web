
export const getTypeOptions = (page: string) => {
  const baseTypes = [
    { value: "text", label: "Texte" },
    { value: "image", label: "Image (URL)" },
  ];

  switch (page) {
    case 'Accueil':
      return [
        ...baseTypes,
        { value: "logo", label: "Logo (URL)" },
        { value: "background", label: "Image de fond (URL)" },
      ];
    case 'À propos':
      return [
        ...baseTypes,
        { value: "quote", label: "Citation" },
      ];
    case 'FAQ':
      return [
        ...baseTypes,
        { value: "faq-question", label: "Question FAQ" },
        { value: "faq-answer", label: "Réponse FAQ" },
      ];
    case 'Global':
      return [
        ...baseTypes,
        { value: "logo", label: "Logo (URL)" },
        { value: "hours", label: "Heures d'ouverture" },
        { value: "contact", label: "Coordonnées" },
      ];
    case 'Mentions légales':
      return [
        ...baseTypes,
        { value: "legal", label: "Mentions légales" },
      ];
    case 'Politique de confidentialité':
      return [
        ...baseTypes,
        { value: "privacy", label: "Politique de confidentialité" },
      ];
    case 'CGV':
      return [
        ...baseTypes,
        { value: "terms", label: "CGV" },
      ];
    default:
      return baseTypes;
  }
};

export const getCategoryOptions = (page: string) => {
  const baseCategories = [
    { value: "general", label: "Général" },
    { value: "header", label: "En-tête" },
  ];

  switch (page) {
    case 'Accueil':
      return [
        ...baseCategories,
        { value: "hero", label: "Section Hero" },
        { value: "services", label: "Services" },
      ];
    case 'À propos':
      return [
        ...baseCategories,
        { value: "history", label: "Notre Histoire" },
        { value: "team", label: "Notre Équipe" },
        { value: "founder", label: "Fondateur" },
        { value: "values", label: "Nos Valeurs" },
        { value: "trust", label: "Pourquoi nous faire confiance" },
      ];
    case 'Galerie':
      return [
        ...baseCategories,
        { value: "gallery", label: "Galerie d'images" },
      ];
    case 'FAQ':
      return [
        ...baseCategories,
        { value: "general", label: "Questions générales" },
        { value: "payment", label: "Paiement" },
        { value: "cancellation", label: "Annulations" },
        { value: "services", label: "Services additionnels" },
      ];
    case 'Global':
      return [
        ...baseCategories,
        { value: "footer", label: "Pied de page" },
        { value: "legal", label: "Mentions légales" },
      ];
    default:
      return baseCategories;
  }
};

