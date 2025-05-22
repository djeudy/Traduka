
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ApiProject, ProjectStatus } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProjectCardProps {
  project: ApiProject;
  getStatusBadgeClass: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

const ProjectCard = ({ project, getStatusBadgeClass, getStatusLabel }: ProjectCardProps) => {
  const { t } = useLanguage();

  return (
    <Link key={project.id} to={`/projects/${project.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-0">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="font-semibold text-lg">{project.name}</h3>
                <div className="text-sm text-gray-500 mt-1">
                  {project.source_document_count} {t('dashboard.documents')} • {project.source_language} → {project.target_language}
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <Badge variant="outline" className={getStatusBadgeClass(project.status)}>
                  {getStatusLabel(project.status)}
                </Badge>
                
                {project.estimated_completion_date && (
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    <span className="hidden md:inline mr-1">{t('dashboard.estimatedDelivery')}</span>
                    {project.estimated_completion_date}
                  </div>
                )}
                
                {project.completed_at && (
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    <span className="hidden md:inline mr-1">{t('dashboard.deliveredOn')}</span>
                    {project.completed_at}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {project.status !== 'waiting' && project.status !== 'completed' && (
            <div className="bg-gray-50 p-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">
                  {project.status === 'in-progress' ? t('dashboard.translationInProgress') : t('dashboard.reviewInProgress')}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProjectCard;
