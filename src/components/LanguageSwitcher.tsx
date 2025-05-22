
import React from 'react';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Languages size={16} />
            <span className="hidden sm:inline">{language.toUpperCase()}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setLanguage('en')}>
            🇬🇧 English
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage('fr')}>
            🇫🇷 Français
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage('es')}>
            🇪🇸 Español
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage('ht')}>
            🇭🇹 Créole Haïtien
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSwitcher;
