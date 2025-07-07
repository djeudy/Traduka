
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { redirectToAuth } from "supertokens-auth-react";

const Index = () => {
  const session = useSessionContext();
  
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img src="/traduka2.svg" style={{ maxWidth: '15%' }} alt="Traduka" />
              {/* <span className="font-bold text-xl text-translation-900">Traduka</span> */}
            </div>
            <div className="flex items-center space-x-4">
              {session.loading === false && session.doesSessionExist ? (
                <Link to="/dashboard">
                  <Button>Mon compte</Button>
                </Link>
              ) : (
                <>
                  <Button variant="outline" onClick={() => redirectToAuth({ show: "signin" })}>
                    Connexion
                  </Button>
                  <Button onClick={() => redirectToAuth({ show: "signup" })}>
                    S'inscrire
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero */}
      <section className="bg-gradient-to-b from-translation-900 to-translation-700 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Gestion de projets de traduction simplifiée
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Soumettez vos documents, suivez l'avancement et récupérez vos traductions sur une plateforme unique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-translation-900 hover:bg-translation-100"
                onClick={() => redirectToAuth({ show: "signup" })}
              >
                Commencer maintenant
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Nos services</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-translation-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-translation-700">
                  <path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Traduction professionnelle</h3>
              <p className="text-gray-600">
                Des traducteurs experts dans votre domaine pour des traductions précises et adaptées.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-translation-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-translation-700">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line><path d="m9 16 2 2 4-4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Suivi en temps réel</h3>
              <p className="text-gray-600">
                Suivez l'avancement de vos projets et communiquez avec votre traducteur directement depuis la plateforme.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-translation-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-translation-700">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path><path d="m14.5 9-5 5"></path><path d="m9.5 9 5 5"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sécurité garantie</h3>
              <p className="text-gray-600">
                Vos documents sont traités avec la plus grande confidentialité et protégés par des mesures de sécurité avancées.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How it works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-translation-700 text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">Inscription</h3>
              <p className="text-gray-600">Créez votre compte et accédez à votre espace client.</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-translation-700 text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">Soumission</h3>
              <p className="text-gray-600">Téléchargez vos documents et précisez vos besoins.</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-translation-700 text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">Traduction</h3>
              <p className="text-gray-600">Nos experts traduisent votre contenu avec précision.</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-translation-700 text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="text-xl font-semibold mb-2">Livraison</h3>
              <p className="text-gray-600">Recevez vos traductions et téléchargez-les facilement.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 px-4 bg-translation-800 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à démarrer votre projet ?</h2>
          <p className="text-xl mb-8">
            Rejoignez-nous dès aujourd'hui et découvrez comment nous pouvons vous aider à communiquer efficacement à l'international.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-translation-900 hover:bg-translation-100"
            onClick={() => redirectToAuth({ show: "signup" })}
          >
            Créer un compte gratuitement
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-translation-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Traduka</h3>
              <p className="text-gray-300">
                Solution complète de gestion de projets de traduction pour les entreprises internationales.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">À propos</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Services</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Tarifs</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <address className="not-italic text-gray-300">
                <p>123 Rue de la Traduction</p>
                <p>75000 Paris, France</p>
                <p className="mt-2">contact@Traduka.com</p>
                <p>+33 1 23 45 67 89</p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Traduka. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
