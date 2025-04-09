
import React from 'react';
import { 
  Accordion,
  AccordionContent, 
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';

const FAQ = () => {
  const generalFaqs = [
    {
      question: "Comment réserver un billet d'avion avec NASSER TRAVEL HORIZON ?",
      answer: "Vous pouvez réserver un billet de plusieurs façons : en remplissant notre formulaire de réservation en ligne, en nous contactant directement via WhatsApp au +235 66 00 00 00, par téléphone, ou en visitant notre agence à N'Djamena. Prochainement, vous pourrez également réserver directement en ligne via notre plateforme."
    },
    {
      question: "Quels documents dois-je fournir pour une réservation ?",
      answer: "Pour toute réservation, nous avons besoin d'une copie de votre passeport valide, de vos coordonnées (téléphone et email), et des détails de votre voyage (dates, destination). Pour certaines destinations, des documents supplémentaires peuvent être nécessaires."
    },
    {
      question: "Combien de temps faut-il pour recevoir mon billet après réservation ?",
      answer: "Après confirmation de votre paiement, vous recevrez généralement votre billet électronique dans un délai de 1 à 24 heures, selon la compagnie aérienne et la destination. Pour les réservations urgentes, nous pouvons accélérer le processus."
    }
  ];

  const paymentFaqs = [
    {
      question: "Quels sont les moyens de paiement acceptés ?",
      answer: "Nous acceptons plusieurs méthodes de paiement : espèces (à notre agence), virement bancaire, Mobile Money (Orange Money, MoMo), et prochainement le paiement en ligne par carte bancaire."
    },
    {
      question: "Puis-je payer en plusieurs fois ?",
      answer: "Oui, pour certaines réservations, nous proposons des facilités de paiement en plusieurs fois. Contactez-nous pour discuter des options disponibles selon votre situation."
    },
    {
      question: "Comment fonctionne le paiement en ligne (à venir) ?",
      answer: "Notre futur système de paiement en ligne vous permettra de régler votre billet directement sur notre site web de manière sécurisée, par carte bancaire ou portefeuille électronique. Toutes les transactions seront protégées par un système de cryptage avancé."
    }
  ];

  const cancellationFaqs = [
    {
      question: "Puis-je annuler ou modifier ma réservation ?",
      answer: "Oui, la plupart des réservations peuvent être modifiées ou annulées, mais les conditions varient selon la compagnie aérienne et le type de billet. Certains billets sont non remboursables ou des frais peuvent s'appliquer. Nous vous recommandons de nous contacter dès que possible si vous devez apporter des changements."
    },
    {
      question: "Quels sont les frais d'annulation ?",
      answer: "Les frais d'annulation dépendent de la politique de la compagnie aérienne, du type de billet et du délai avant le départ. Ils peuvent varier de frais minimes à une non-possibilité de remboursement. Nous vous communiquerons toujours ces informations avant votre achat."
    },
    {
      question: "Que se passe-t-il si mon vol est annulé par la compagnie aérienne ?",
      answer: "Si votre vol est annulé par la compagnie aérienne, nous vous assisterons pour obtenir un remboursement ou un réacheminement selon les options disponibles. Notre équipe vous contactera immédiatement pour vous proposer les meilleures alternatives."
    }
  ];

  const serviceFaqs = [
    {
      question: "Proposez-vous une assistance pour les demandes de visa ?",
      answer: "Oui, nous offrons un service complet d'accompagnement pour les demandes de visa. Nous vous guidons dans la préparation de votre dossier, la prise de rendez-vous à l'ambassade et le suivi de votre demande. Ce service est disponible pour de nombreuses destinations."
    },
    {
      question: "Peut-on réserver des billets pour un groupe ?",
      answer: "Absolument. Nous avons une expertise particulière dans la gestion des réservations de groupe (famille, amis, entreprises, écoles). Nous négocions les meilleurs tarifs et conditions pour vous offrir une solution adaptée à vos besoins spécifiques."
    },
    {
      question: "Quels services additionnels proposez-vous ?",
      answer: "En plus de la réservation de billets, nous proposons des services de réservation d'hôtel, de transfert aéroport, d'assurance voyage, de conseils personnalisés pour votre destination, et d'assistance administrative pour toutes vos démarches de voyage."
    }
  ];

  const accountFaqs = [
    {
      question: "Comment fonctionne l'espace client (à venir) ?",
      answer: "Notre futur espace client vous permettra de créer un compte personnel pour gérer vos réservations, accéder à l'historique de vos voyages, télécharger vos billets et documents, et profiter d'offres personnalisées. Vous pourrez également suivre vos demandes en cours et communiquer directement avec notre équipe."
    },
    {
      question: "Mes informations sont-elles sécurisées ?",
      answer: "Absolument. La sécurité de vos données est notre priorité. Nous utilisons des systèmes de cryptage avancés pour protéger toutes vos informations personnelles et financières. Notre politique de confidentialité stricte garantit que vos données ne sont jamais partagées avec des tiers sans votre consentement."
    }
  ];

  return (
    <main className="bg-nasser-light py-16">
      <div className="container-custom">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Foire Aux Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Retrouvez les réponses aux questions les plus fréquemment posées
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Rechercher une question..." 
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Button className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-nasser-primary hover:bg-nasser-primary/90 h-8">
              Rechercher
            </Button>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <a href="#general" className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-nasser-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-nasser-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-heading font-semibold">Questions générales</h3>
            <p className="text-gray-600 mt-2">Réservation, documents, délais...</p>
          </a>
          
          <a href="#payment" className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-nasser-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-nasser-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-heading font-semibold">Paiement</h3>
            <p className="text-gray-600 mt-2">Méthodes, facilités, sécurité...</p>
          </a>
          
          <a href="#cancellation" className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-nasser-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-nasser-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-xl font-heading font-semibold">Annulations et modifications</h3>
            <p className="text-gray-600 mt-2">Conditions, remboursements, changements...</p>
          </a>
          
          <a href="#services" className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-nasser-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-nasser-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-heading font-semibold">Services additionnels</h3>
            <p className="text-gray-600 mt-2">Visa, groupes, assistance...</p>
          </a>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {/* General Questions */}
          <section id="general" className="scroll-mt-24">
            <h2 className="text-2xl font-heading font-bold mb-6 border-b pb-2">Questions générales</h2>
            <Accordion type="single" collapsible className="w-full">
              {generalFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`general-item-${index}`}>
                  <AccordionTrigger className="text-lg font-medium text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
          
          {/* Payment Questions */}
          <section id="payment" className="scroll-mt-24">
            <h2 className="text-2xl font-heading font-bold mb-6 border-b pb-2">Paiement</h2>
            <Accordion type="single" collapsible className="w-full">
              {paymentFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`payment-item-${index}`}>
                  <AccordionTrigger className="text-lg font-medium text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
          
          {/* Cancellation Questions */}
          <section id="cancellation" className="scroll-mt-24">
            <h2 className="text-2xl font-heading font-bold mb-6 border-b pb-2">Annulations et modifications</h2>
            <Accordion type="single" collapsible className="w-full">
              {cancellationFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`cancel-item-${index}`}>
                  <AccordionTrigger className="text-lg font-medium text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
          
          {/* Services Questions */}
          <section id="services" className="scroll-mt-24">
            <h2 className="text-2xl font-heading font-bold mb-6 border-b pb-2">Services additionnels</h2>
            <Accordion type="single" collapsible className="w-full">
              {serviceFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`service-item-${index}`}>
                  <AccordionTrigger className="text-lg font-medium text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
          
          {/* Account Questions */}
          <section id="account" className="scroll-mt-24">
            <h2 className="text-2xl font-heading font-bold mb-6 border-b pb-2">Espace client</h2>
            <Accordion type="single" collapsible className="w-full">
              {accountFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`account-item-${index}`}>
                  <AccordionTrigger className="text-lg font-medium text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>

        {/* Still Have Questions */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-heading font-bold mb-4">
            Vous n'avez pas trouvé votre réponse ?
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Notre équipe est disponible pour répondre à toutes vos questions. N'hésitez pas à nous contacter.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/contact" 
              className="bg-nasser-primary hover:bg-nasser-primary/90 text-white font-medium py-3 px-6 rounded-md transition-colors"
            >
              Nous contacter
            </a>
            <a 
              href="https://wa.me/23566000000" 
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FAQ;
