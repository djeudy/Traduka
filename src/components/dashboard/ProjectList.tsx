
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Project,ApiProject } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import ProjectCard from './ProjectCard';

interface ProjectListProps {
  projects: ApiProject[];
  loading: boolean;
  searchQuery: string;
  statusFilter: string;
  getStatusBadgeClass: (status: string) => string;
  getStatusLabel: (status: string) => string;
  isCompleted?: boolean;
}

const ProjectList = ({ 
  projects,
  loading,
  searchQuery,
  statusFilter,
  getStatusBadgeClass,
  getStatusLabel,
  isCompleted = false
}: ProjectListProps) => {
  const { t } = useLanguage();
  
  const filteredProjects = isCompleted
    ? projects.filter(p => p.status === 'completed')
    : projects.filter(p => p.status !== 'completed');
    
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-customBlue"></div>
      </div>
    );
  }
  
  if (filteredProjects.length === 0) {
    if (searchQuery) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">{t('dashboard.noSearchResults')}</p>
        </div>
      );
    }
    
    if (isCompleted) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">{t('dashboard.noCompletedProjects')}</p>
        </div>
      );
    }
    
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t('dashboard.noActiveProjects')}</p>
        <Link to="/submit-project" className="mt-4 inline-block">
          <Button className="bg-customBlue hover:bg-customBlue/90">{t('dashboard.createNew')}</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="grid gap-4">
      {filteredProjects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          getStatusBadgeClass={getStatusBadgeClass}
          getStatusLabel={getStatusLabel}
        />
      ))}
    </div>
  );
};

export default ProjectList;
