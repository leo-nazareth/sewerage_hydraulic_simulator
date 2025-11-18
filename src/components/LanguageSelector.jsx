import { useLanguage } from '@/i18n/LanguageProvider';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  
  const languages = [
    { code: 'pt', label: 'PT' },
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' }
  ];

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-600" />
      {languages.map(lang => (
        <Button
          key={lang.code}
          variant={language === lang.code ? 'default' : 'outline'}
          size="sm"
          onClick={() => setLanguage(lang.code)}
          className="min-w-[50px]"
        >
          {lang.label}
        </Button>
      ))}
    </div>
  );
};

export default LanguageSelector;
