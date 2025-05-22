
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProjectStatus } from '@/types';
import { Dispatch, SetStateAction } from 'react';

interface SearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: ProjectStatus | 'all';
  setStatusFilter: Dispatch<SetStateAction<ProjectStatus | 'all'>>;
  getStatusBadgeClass: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

const SearchFilter = ({ 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter,
  getStatusBadgeClass,
  getStatusLabel 
}: SearchFilterProps) => {
  const { t } = useLanguage();
  
  return (
    <>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="search"
            placeholder={t('dashboard.search')}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            className="pl-10"
          />
        </div>
      </div>
      
      {/* Filter indicator */}
      {statusFilter !== 'all' && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-500">Filtré par:</span>
          <Badge variant="outline" className={getStatusBadgeClass(statusFilter)}>
            {getStatusLabel(statusFilter)}
          </Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs text-gray-500"
            onClick={() => setStatusFilter('all')}
          >
            Effacer le filtre
          </Button>
        </div>
      )}
    </>
  );
};

export default SearchFilter;
