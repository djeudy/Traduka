import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Project, ProjectStatus } from '@/types';
import { projectService } from '@/services/projectService';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProjectActionsProps {
  project: Project;
  onProjectUpdated: (project: Project) => void;
}

const ProjectActions = ({ project, onProjectUpdated }: ProjectActionsProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<ProjectStatus>(project.status as ProjectStatus);
  const [estimatedDate, setEstimatedDate] = useState(
    project.estimated_completion_date ? 
    new Date(project.estimated_completion_date).toISOString().split('T')[0] : ''
  );
  const { toast } = useToast();
  const { user } = useUser();
  const { t, language } = useLanguage();

  const handleUpdateStatus = async () => {
    if (!user || user.role !== 'admin') return;

    setIsUpdating(true);
    try {
      const result = await projectService.updateProjectStatus(project.id, newStatus);
      
      if (result.error) {
        throw new Error(result.error);
      }

      const updatedProject = { ...project, status: newStatus };
      onProjectUpdated(updatedProject);

      toast({
        title: t('admin.statusUpdated'),
        description: `${t('admin.projectMarkedAs')} ${getStatusLabel(newStatus)}.`,
      });
    } catch (error: any) {
      console.error('Update status error:', error);
      toast({
        title: t('admin.error'),
        description: error.message || t('admin.errorUpdatingStatus'),
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateEstimatedDate = async () => {
    if (!user || user.role !== 'admin') return;

    setIsUpdating(true);
    try {
      const result = await projectService.updateProject(project.id, {
        estimated_completion_date: estimatedDate ? new Date(estimatedDate).toISOString() : null
      });
      
      if (result.error) {
        throw new Error(result.error);
      }

      const updatedProject = { ...project, estimated_completion_date: estimatedDate };
      onProjectUpdated(updatedProject);

      toast({
        title: t('admin.estimatedDateUpdated'),
        description: t('admin.deliveryDateUpdated'),
      });
    } catch (error: any) {
      console.error('Update date error:', error);
      toast({
        title: t('admin.error'),
        description: error.message || t('admin.errorUpdatingDate'),
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkAsCompleted = async () => {
    if (!user || user.role !== 'admin') return;

    setIsUpdating(true);
    try {
      const result = await projectService.updateProject(project.id, {
        status: 'completed',
        completed_at: new Date().toISOString()
      });
      
      if (result.error) {
        throw new Error(result.error);
      }

      const updatedProject = { 
        ...project, 
        status: 'completed', 
        completed_at: new Date().toISOString() 
      };
      onProjectUpdated(updatedProject);

      toast({
        title: t('admin.projectCompleted'),
        description: t('admin.projectMarkedCompleted'),
      });
    } catch (error: any) {
      console.error('Complete project error:', error);
      toast({
        title: t('admin.error'),
        description: error.message || t('admin.errorCompletingProject'),
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'waiting':
        return t('admin.waiting');
      case 'in-progress':
        return t('admin.inProgress');
      case 'review':
        return t('admin.review');
      case 'completed':
        return t('status.completed');
      default:
        return status;
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Status Management */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.statusManagement')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">{t('admin.projectStatus')}</Label>
            <Select value={newStatus} onValueChange={(value: ProjectStatus) => setNewStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('admin.selectStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="waiting">{t('admin.waiting')}</SelectItem>
                <SelectItem value="in-progress">{t('admin.inProgress')}</SelectItem>
                <SelectItem value="review">{t('admin.review')}</SelectItem>
                <SelectItem value="completed">{t('status.completed')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleUpdateStatus} 
            disabled={isUpdating || newStatus === project.status}
          >
            {isUpdating ? t('admin.updating') : t('admin.updateStatus')}
          </Button>
        </CardContent>
      </Card>

      {/* Date Management */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.dateManagement')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="estimatedDate">{t('admin.estimatedDeliveryDate')}</Label>
            <Input
              id="estimatedDate"
              type="date"
              value={estimatedDate}
              onChange={(e) => setEstimatedDate(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={handleUpdateEstimatedDate} 
            disabled={isUpdating}
            variant="outline"
          >
            {isUpdating ? t('admin.updating') : t('admin.updateDate')}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.quickActions')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {project.status !== 'completed' && (
              <Button 
                onClick={handleMarkAsCompleted}
                disabled={isUpdating}
                className="bg-green-600 hover:bg-green-700"
              >
                ✅ {t('admin.markAsCompleted')}
              </Button>
            )}
            
            <Button 
              variant="outline"
              onClick={() => window.open(`/projects/${project.id}/report`, '_blank')}
            >
              📊 {t('admin.generateReport')}
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.print()}
            >
              🖨️ {t('admin.printDetails')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Project Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.projectStatistics')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">{t('admin.sourceDocuments')}</span>
              <span className="ml-2">{project.documents?.length || 0}</span>
            </div>
            <div>
              <span className="font-medium">{t('admin.payments')}</span>
              <span className="ml-2">{project.payments?.length || 0}</span>
            </div>
            <div>
              <span className="font-medium">{t('admin.comments')}</span>
              <span className="ml-2">{project.comments?.length || 0}</span>
            </div>
            <div>
              <span className="font-medium">{t('admin.createdOn')}</span>
              <span className="ml-2">{new Date(project.submitted_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : language === 'ht' ? 'fr-FR' : 'en-US')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectActions;