
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { user } = useUser();
  const { t } = useLanguage();
  
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
              {user ? (
                <Link to="/dashboard">
                  <Button>{t('homepage.myAccount')}</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline">{t('homepage.login')}</Button>
                  </Link>
                  <Link to="/signup">
                    <Button>{t('homepage.signup')}</Button>
                  </Link>
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
              {t('homepage.heroTitle')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              {t('homepage.heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-translation-900 hover:bg-translation-100">
                  {t('homepage.getStarted')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t('homepage.ourServices')}</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-translation-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-translation-700">
                  <path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('homepage.professionalTranslation')}</h3>
              <p className="text-gray-600">
                {t('homepage.professionalTranslationDesc')}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-translation-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-translation-700">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line><path d="m9 16 2 2 4-4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('homepage.realTimeTracking')}</h3>
              <p className="text-gray-600">
                {t('homepage.realTimeTrackingDesc')}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-translation-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-translation-700">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path><path d="m14.5 9-5 5"></path><path d="m9.5 9 5 5"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('homepage.guaranteedSecurity')}</h3>
              <p className="text-gray-600">
                {t('homepage.guaranteedSecurityDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How it works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t('homepage.howItWorks')}</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-translation-700 text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">{t('homepage.registration')}</h3>
              <p className="text-gray-600">{t('homepage.registrationDesc')}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-translation-700 text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">{t('homepage.submission')}</h3>
              <p className="text-gray-600">{t('homepage.submissionDesc')}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-translation-700 text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">{t('homepage.translation')}</h3>
              <p className="text-gray-600">{t('homepage.translationDesc')}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-translation-700 text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="text-xl font-semibold mb-2">{t('homepage.delivery')}</h3>
              <p className="text-gray-600">{t('homepage.deliveryDesc')}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 px-4 bg-translation-800 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">{t('homepage.ctaTitle')}</h2>
          <p className="text-xl mb-8">
            {t('homepage.ctaSubtitle')}
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-translation-900 hover:bg-translation-100">
              {t('homepage.createAccount')}
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-translation-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Traduka</h3>
              <p className="text-gray-300">
                {t('homepage.heroSubtitle')}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('homepage.quickLinks')}</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">{t('homepage.about')}</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">{t('homepage.services')}</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">{t('homepage.pricing')}</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">{t('homepage.contact')}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('homepage.contactTitle')}</h3>
              <address className="not-italic text-gray-300">
                <p>123 Rue de la Traduction</p>
                <p>75000 Paris, France</p>
                <p className="mt-2">contact@Traduka.com</p>
                <p>+33 1 23 45 67 89</p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Traduka. {t('homepage.allRightsReserved')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
