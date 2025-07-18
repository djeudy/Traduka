import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Project, UserRole, Comment, ProjectStatus, Quote } from '@/types';
import { projectService } from '@/services/projectService';
import { quoteService } from '@/services/quoteService';
import { ApiResponse } from '@/services/apiUtils';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { FolderX } from 'lucide-react';
import DocumentList from '@/components/projects/DocumentList';
import { TranslatorAssignment } from '@/components/projects/TranslatorAssignment';
import StatusChanger from '@/components/projects/StatusChanger';
import { useLanguage } from '@/contexts/LanguageContext';
import QuoteCreator from '@/components/admin/QuoteCreator';
import QuoteList from '@/components/admin/QuoteList';
import PaymentManager from '@/components/admin/PaymentManager';
import ProjectActions from '@/components/admin/ProjectActions';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const { t } = useLanguage();
  const [deletingProject, setDeletingProject] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useUser();
  
  // Define a variable to determine if the current user can change the status of the project
  const canChangeStatus = user && project && (
    user.role === 'admin' || 
    (user.role === 'translator' && project.translator === user.id)
  );
  
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        if (id) {
          const response: ApiResponse<Project> = await projectService.getProject(id);
          if (response.data) {
            setProject(response.data);
          } else {
            toast({
              title: t('generic.error'),
              description: response.error || t('dashboard.errorLoadProject'),
              variant: "destructive",
            });
            setProject(null);
          }
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        toast({
          title: t('generic.error'),
          description: t('dashboard.errorLoadProject'),
          variant: "destructive",
        });
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchQuotes = async () => {
      if (!id) return;
      setLoadingQuotes(true);
      try {
        const response = await quoteService.getQuotesByProject(id);
        if (response.data) {
          setQuotes(response.data);
        }
      } catch (error) {
        console.error('Error fetching quotes:', error);
      } finally {
        setLoadingQuotes(false);
      }
    };

    if (id) {
      fetchProject();
      fetchQuotes();
    }
  }, [id, toast]);
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'review':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'waiting': return t('status.waiting');
      case 'in-progress': return t('status.inProgress');
      case 'review': return t('status.review');
      case 'completed': return t('status.completed');
      default: return status;
    }
  };
  
  const handleSendComment = async () => {
    if (!newComment.trim() || !project || !id) return;
    
    try {
      const response = await projectService.createComment(id, newComment.trim());
      
      if (response.data) {
        // Adapter le nouveau commentaire au format Comment
        const newCommentObj: Comment = {
          id: response.data.id,
          text: response.data.text,
          created_at: response.data.created_at,
          user_id: user?.id?.toString() || '',
          project_id: id,
          user: {
            name: user?.name || 'User',
            email: user?.email || '',
            role: user?.role
          }
        };
        
        setProject(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            comments: [...prev.comments, newCommentObj]
          };
        });
        
        toast({
          title:       t('generic.success'),
          description: t('project.recentMessages.sendSuccess'),
        });
        
        setNewComment('');
      } else {
        toast({
          title:       t('generic.error'),
          description: response.error || t('project.recentMessages.sendError'),
          variant:     'destructive',
        });
      }
    } catch (error) {
      toast({
        title:       t('generic.error'),
        description: t('project.recentMessages.sendError'),
        variant:     'destructive',
      });
    }
  };
  
  const handleDeleteProject = async () => {
    if (!id) return;
    
    try {
      setDeletingProject(true);
      const response = await projectService.deleteProject(id);
      
      if (!response.error) {
        toast({
          title:       t('generic.success'),
          description: t('project.delete.success'),
        });
        navigate('/dashboard');
      } else {
        toast({
          title:       t('generic.error'),
          description: response.error || t('project.delete.error'),
          variant:     'destructive',
        });
      }
    } catch (error) {
      toast({
        title:       t('generic.error'),
        description: t('project.delete.error'),
        variant:     'destructive',
      });
    } finally {
      setDeletingProject(false);
    }
  };
  
  const handleDocumentDeleted = (documentId: string) => {
    if (!project) return;
    
    setProject({
      ...project,
      documents: project.documents.filter(doc => doc.id !== documentId)
    });
  };
  
  const handleTranslatorAssigned = (translatorId: number | null) => {
    if (project) {
      setProject({
        ...project,
        translator: translatorId
      });
    }
  };

  const handleStatusChanged = (newStatus: ProjectStatus) => {
    if (project) {
      setProject({
        ...project,
        status: newStatus
      });
    }
  };

  const handleQuoteCreated = (newQuote: Quote) => {
    setQuotes(prev => [newQuote, ...prev]);
  };

  const handleQuoteUpdated = (updatedQuote: Quote) => {
    setQuotes(prev => prev.map(quote => 
      quote.id === updatedQuote.id ? updatedQuote : quote
    ));
  };

  const handlePaymentCreated = (newPayment: any) => {
    if (project) {
      setProject({
        ...project,
        payments: [...project.payments, newPayment]
      });
    }
  };

  const handlePaymentUpdated = (updatedPayment: any) => {
    if (project) {
      setProject({
        ...project,
        payments: project.payments.map(payment => 
          payment.id === updatedPayment.id ? updatedPayment : payment
        )
      });
    }
  };

  const handleProjectUpdated = (updatedProject: Project) => {
    setProject(updatedProject);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-translation-700"></div>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('project.notFound.title')}</h2>
        <p className="text-gray-600 mb-8">{t('project.notFound.description')}</p>
        <Button asChild>
          <a href="/dashboard">{t('navigation.dashboard')}</a>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="animate-fadeIn">
      {/* Project header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
            <Badge variant="outline" className={getStatusBadgeClass(project.status)}>
              {getStatusLabel(project.status)}
            </Badge>
          </div>
          
          <div className="text-gray-600">
            <span className="inline-block mr-4">
              <span className="font-medium">{t('project.header.languages')}</span> {project.source_language} → {project.target_language}
            </span>
            <span className="inline-block">
              <span className="font-medium">{t('project.header.submittedOn')}</span> {new Date(project.submitted_at).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          {/* Ajout du StatusChanger pour les traducteurs et admins */}
          {canChangeStatus && (
            <div className="mr-4">
              <StatusChanger
                projectId={project.id}
                currentStatus={project.status as ProjectStatus}
                onStatusChanged={handleStatusChanged}
              />
            </div>
          )}
          
          {/* Bouton de paiement pour les clients */}
          {user?.role === 'client' && project.client === user.id && (
            <Button 
              onClick={() => navigate(`/projects/${project.id}/payment`)}
              className="bg-green-600 hover:bg-green-700"
            >
              💳 {t('project.paymentsTab.payNow')}
            </Button>
          )}
          
          {(user?.role === 'admin' || (user?.role === 'client' && project.client === user.id)) && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <FolderX className="h-4 w-4 mr-2" />
                  {t('project.delete.button')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('project.delete.title')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('project.delete.description')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('generic.cancel')}</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteProject}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={deletingProject}
                  >
                    {deletingProject ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : t('project.delete.confirm')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="mb-2">
          <TabsTrigger value="overview">{t('project.overview')}</TabsTrigger>
          <TabsTrigger value="documents">{t('project.documents')}</TabsTrigger>
          <TabsTrigger value="messages">{t('project.messages')}</TabsTrigger>
          <TabsTrigger value="quotes">{t('project.quotes')}</TabsTrigger>
          <TabsTrigger value="payments">{t('project.payments')}</TabsTrigger>
          {user?.role === 'admin' && <TabsTrigger value="admin">{t('project.admin')}</TabsTrigger>}
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Project Info */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{t('project.projectInformation')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">{t('project.infoCard.currentStatus')}</div>
                  <div className="mt-1 flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      project.status === 'waiting' ? 'bg-yellow-400' :
                      project.status === 'in-progress' ? 'bg-blue-400' :
                      project.status === 'review' ? 'bg-purple-400' : 'bg-green-400'
                    }`}></div>
                    <p className="font-medium">{getStatusLabel(project.status)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">{t('project.infoCard.sourceLanguage')}</div>
                    <div className="mt-1 font-medium">{project.source_language}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">{t('project.infoCard.targetLanguage')}</div>
                    <div className="mt-1 font-medium">{project.target_language}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">{t('project.infoCard.submittedAt')}</div>
                    <div className="mt-1 font-medium">{new Date(project.submitted_at).toLocaleDateString('fr-FR')}</div>
                  </div>
                  
                  {project.started_at && (
                    <div>
                      <div className="text-sm text-gray-500">{t('project.infoCard.startedAt')}</div>
                      <div className="mt-1 font-medium">{new Date(project.started_at).toLocaleDateString('fr-FR')}</div>
                    </div>
                  )}

                  {project.instructions && (
                  <div>
                    <div className="text-sm text-gray-500">{t('project.specificInstructions')}</div>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm whitespace-pre-wrap">{project.instructions}</p>
                    </div>
                  </div>
                  )}
                  
                  {project.estimated_completion_date && (
                    <div>
                      <div className="text-sm text-gray-500">{t('project.infoCard.estimatedDelivery')}</div>
                      <div className="mt-1 font-medium">{new Date(project.estimated_completion_date).toLocaleDateString('fr-FR')}</div>
                    </div>
                  )}
                  
                  {project.completed_at && (
                    <div>
                      <div className="text-sm text-gray-500">{t('project.infoCard.completedAt')}</div>
                      <div className="mt-1 font-medium">{new Date(project.completed_at).toLocaleDateString('fr-FR')}</div>
                    </div>
                  )}
                </div>
                
                {project.translator && (
                  <>
                    <Separator />
                    <div>
                      <div className="text-sm text-gray-500 mb-2">{t('project.infoCard.assignedTranslator')}</div>
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarFallback className="bg-translation-100 text-translation-800">SM</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium"></div>
                          <div className="text-sm text-gray-500"></div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            {/* Project Stats */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('project.documents')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{project.documents.length}</div>
                  <p className="text-sm text-gray-500 mt-1">
                    {project.status === 'completed' ? t('project.infoCard.allDocumentsTranslated') : t('project.infoCard.documentsToTranslate')}
                  </p>
                </CardContent>
              </Card>
              
              {project.payments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('project.payments')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-bold ${project.payments[0].status ? 'text-green-600' : 'text-yellow-600'}`}>
                      {project.payments[0].amount} €
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {project.payments[0].status === 'completed' ? t('project.paymentsTab.paid') + ' ' + new Date(project.payments[0].created_at).toLocaleDateString('fr-FR') : t('project.paymentsTab.pending')}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Recent Messages */}
            {project.comments.length > 0 && (
              <Card className="md:col-span-3">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{t('project.recentMessages.title')}</CardTitle>
                  <Button variant="ghost" asChild>
                    <a href="#messages">{t('project.recentMessages.seeAll')}</a>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.comments.slice(0, 2).map(comment => (
                      <div key={comment.id} className="flex gap-4">
                        <Avatar className="h-9 w-9">
                          c
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{comment.user?.name}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(comment.created_at).toLocaleString('fr-FR', { 
                                day: '2-digit', 
                                month: '2-digit', 
                                year: '2-digit',
                                hour: '2-digit', 
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                          <p className="text-sm mt-1">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        {/* Documents Tab */}
        <TabsContent value="documents">
           <Card>
            <CardHeader>
              <CardTitle>{t('project.documentsTab.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentList 
                projectId={project.id}
                documents={project.documents}
                status={project.status}
                onDocumentDelete={handleDocumentDeleted}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Messages Tab */}
        <TabsContent value="messages" id="messages">
          <Card>
            <CardHeader>
              <CardTitle>{t('project.exchangesAndComments')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {project.comments.length > 0 ? (
                  <div className="space-y-6">
                    {project.comments.map(comment => (
                      <div key={comment.id} className="flex gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className={comment.user?.role === 'translator' ? 'bg-translation-100 text-translation-800' : 'bg-gray-100'}>
                            {comment.user?.name? comment.user?.name.split(' ').map(n => n[0]).join(''): ""}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">{comment.user?.name}</span>
                              {/* <span className="text-xs text-gray-500 ml-2">
                                {comment.user?.role === 'translator' ? 'Traducteur' : 'Client'}
                              </span> */}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(comment.created_at).toLocaleString('fr-FR', { 
                                day: '2-digit', 
                                month: '2-digit', 
                                year: '2-digit',
                                hour: '2-digit', 
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                          <p className="text-sm mt-2">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">{t('project.recentMessages.none')}</p>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{user?.name?.split(' ').map(n => n[0]).join('') || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex border rounded-md overflow-hidden">
                      <Input
                        placeholder={t('project.recentMessages.sendPlaceholder')}
                        className="border-0 focus-visible:ring-0"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                      />
                      <Button 
                        className="rounded-none bg-translation-600 hover:bg-translation-700"
                        onClick={handleSendComment}
                      >
                        {t('project.recentMessages.send')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Quotes Tab */}
        <TabsContent value="quotes">
          <div className="space-y-6">
            {user?.role === 'admin' && (
              <QuoteCreator 
                projectId={project.id} 
                onQuoteCreated={handleQuoteCreated}
              />
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>{t('project.projectQuotes')}</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingQuotes ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  <QuoteList 
                    projectId={project.id}
                    quotes={quotes}
                    onQuoteUpdated={handleQuoteUpdated}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Payments Tab */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.paymentManagement')}</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentManager
                projectId={project.id}
                payments={project.payments}
                onPaymentCreated={handlePaymentCreated}
                onPaymentUpdated={handlePaymentUpdated}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Tab - Only for admins */}
        {user?.role === 'admin' && (
          <TabsContent value="admin">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.projectActions')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Translator Assignment Section */}
                  <TranslatorAssignment 
                    projectId={project.id}
                    currentTranslatorId={project.translator}
                    onAssignSuccess={handleTranslatorAssigned}
                  />
                </CardContent>
              </Card>
              
              <div>
                <ProjectActions 
                  project={project}
                  onProjectUpdated={handleProjectUpdated}
                />
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ProjectDetail;
