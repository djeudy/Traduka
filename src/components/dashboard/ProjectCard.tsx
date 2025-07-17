
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ApiProject, ProjectStatus } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProjectCardProps {
  project: ApiProject;
  getStatusBadgeClass: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

const ProjectCard = ({ project, getStatusBadgeClass, getStatusLabel }: ProjectCardProps) => {
  const { t } = useLanguage();

  const handlePaymentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/projects/${project.id}/payment`;
  };

  // Check payment status
  const hasCompletedPayment = project.payments?.some(payment => payment.status === 'completed');
  const hasPendingPayment = project.payments?.some(payment => payment.status === 'processing');
  
  const getPaymentStatus = () => {
    if (hasCompletedPayment) return { text: 'Payé', color: 'text-green-600' };
    if (hasPendingPayment) return { text: 'En cours', color: 'text-yellow-600' };
    return { text: 'En attente', color: 'text-red-600' };
  };
  
  const paymentStatus = getPaymentStatus();

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-0">
        <Link to={`/projects/${project.id}`}>
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
        </Link>
        
        {/* Payment section - outside of the Link to avoid nested links */}
        <div className="bg-gray-50 p-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Statut du paiement: <span className={`font-medium ${paymentStatus.color}`}>{paymentStatus.text}</span>
            </span>
            {!hasCompletedPayment && (
              <Button 
                size="sm" 
                onClick={handlePaymentClick}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                💳 {hasPendingPayment ? 'Voir paiement' : 'Payer maintenant'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
