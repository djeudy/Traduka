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
import { Project, UserRole, Comment } from '@/types';
import { projectService } from '@/services/api';
import { ApiResponse } from '@/services/apiUtils';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';
import { FolderX } from 'lucide-react';
import DocumentManager from '@/components/projects/DocumentManager';
import { adaptCommentFromAPI } from '@/utils/commentAdapter';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [deletingProject, setDeletingProject] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useUser();
  
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
              title: "Erreur",
              description: response.error || "Impossible de charger le projet",
              variant: "destructive",
            });
            setProject(null);
          }
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement du projet",
          variant: "destructive",
        });
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
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
      case 'waiting': return 'En attente';
      case 'in-progress': return 'En cours';
      case 'review': return 'En révision';
      case 'completed': return 'Terminé';
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
            name: user?.name || 'Utilisateur',
            email: user?.email || '',
            role: user?.role || 'client',
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
          title: "Commentaire envoyé",
          description: "Votre commentaire a été ajouté avec succès",
        });
        
        setNewComment('');
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Impossible d'envoyer le commentaire",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du commentaire",
        variant: "destructive",
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
          title: "Projet supprimé",
          description: "Le projet a été supprimé avec succès",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Impossible de supprimer le projet",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du projet",
        variant: "destructive",
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Projet non trouvé</h2>
        <p className="text-gray-600 mb-8">Le projet que vous recherchez n'existe pas ou a été supprimé.</p>
        <Button asChild>
          <a href="/dashboard">Retour au tableau de bord</a>
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
              <span className="font-medium">Langues:</span> {project.source_language} → {project.target_language}
            </span>
            <span className="inline-block">
              <span className="font-medium">Soumis le:</span> {new Date(project.submitted_at).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <Button variant="outline" className="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            Dupliquer
          </Button>
          
          {project.status !== 'completed' && (
            <Button className="bg-translation-600 hover:bg-translation-700">Ajouter un document</Button>
          )}
          
          {(user?.role === 'admin' || (user?.role === 'client' && project.client === user.id)) && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <FolderX className="h-4 w-4 mr-2" />
                  Supprimer le projet
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce projet ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Toutes les données associées à ce projet seront définitivement supprimées.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteProject}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={deletingProject}
                  >
                    {deletingProject ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : 'Supprimer'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="mb-2">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Project Info */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Informations du projet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Statut actuel</div>
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
                    <div className="text-sm text-gray-500">Langue source</div>
                    <div className="mt-1 font-medium">{project.source_language}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Langue cible</div>
                    <div className="mt-1 font-medium">{project.target_language}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Date de soumission</div>
                    <div className="mt-1 font-medium">{new Date(project.submitted_at).toLocaleDateString('fr-FR')}</div>
                  </div>
                  
                  {project.started_at && (
                    <div>
                      <div className="text-sm text-gray-500">Date de début</div>
                      <div className="mt-1 font-medium">{new Date(project.started_at).toLocaleDateString('fr-FR')}</div>
                    </div>
                  )}
                  
                  {project.estimated_completion_date && (
                    <div>
                      <div className="text-sm text-gray-500">Livraison estimée</div>
                      <div className="mt-1 font-medium">{new Date(project.estimated_completion_date).toLocaleDateString('fr-FR')}</div>
                    </div>
                  )}
                  
                  {project.completed_at && (
                    <div>
                      <div className="text-sm text-gray-500">Date de livraison</div>
                      <div className="mt-1 font-medium">{new Date(project.completed_at).toLocaleDateString('fr-FR')}</div>
                    </div>
                  )}
                </div>
                
                {project.translator && (
                  <>
                    <Separator />
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Traducteur assigné</div>
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarFallback className="bg-translation-100 text-translation-800">SM</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Sophie Martin</div>
                          <div className="text-sm text-gray-500">Traductrice professionnelle</div>
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
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{project.documents.length}</div>
                  <p className="text-sm text-gray-500 mt-1">
                    {project.status === 'completed' ? 'Tous les documents sont traduits' : 'Document(s) à traduire'}
                  </p>
                </CardContent>
              </Card>
              
              {project.payments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Paiement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-bold ${project.payments[0].status ? 'text-green-600' : 'text-yellow-600'}`}>
                      {project.payments[0].amount} €
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {project.payments[0].status === 'completed' ? 'Payé le ' + new Date(project.payments[0].created_at).toLocaleDateString('fr-FR') : 'En attente de paiement'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Recent Messages */}
            {project.comments.length > 0 && (
              <Card className="md:col-span-3">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Messages récents</CardTitle>
                  <Button variant="ghost" asChild>
                    <a href="#messages">Voir tous les messages</a>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.comments.slice(0, 2).map(comment => (
                      <div key={comment.id} className="flex gap-4">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className={comment.user?.role === 'translator' ? 'bg-translation-100 text-translation-800' : 'bg-gray-100'}>
                            {comment.user?.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
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
          <DocumentManager 
            projectId={id || ''} 
            documents={project.documents}
            onDocumentDeleted={handleDocumentDeleted}
          />
        </TabsContent>
        
        {/* Messages Tab */}
        <TabsContent value="messages" id="messages">
          <Card>
            <CardHeader>
              <CardTitle>Échanges et commentaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {project.comments.length > 0 ? (
                  <div className="space-y-6">
                    {project.comments.map(comment => (
                      <div key={comment.id} className="flex gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className={comment.user?.role === 'translator' ? 'bg-translation-100 text-translation-800' : 'bg-gray-100'}>
                            {comment.user?.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">{comment.user?.name}</span>
                              <span className="text-xs text-gray-500 ml-2">
                                {comment.user?.role === 'translator' ? 'Traducteur' : 'Client'}
                              </span>
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
                    <p className="text-gray-500">Aucun message pour le moment.</p>
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
                        placeholder="Écrivez un message..."
                        className="border-0 focus-visible:ring-0"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                      />
                      <Button 
                        className="rounded-none bg-translation-600 hover:bg-translation-700"
                        onClick={handleSendComment}
                      >
                        Envoyer
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Payments Tab */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Paiements</CardTitle>
            </CardHeader>
            <CardContent>
              {project.payments.length > 0 ? (
                <div className="space-y-6">
                  {project.payments.map(payment => (
                    <div key={payment.id} className="bg-white border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded flex items-center justify-center mr-3 ${
                            payment.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                          }`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${
                              payment.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                            </svg>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h4 className="font-medium">Paiement du projet</h4>
                              <Badge 
                                variant="outline" 
                                className={payment.status === 'completed' ? 
                                  'ml-2 bg-green-100 text-green-800 border-green-200' : 
                                  'ml-2 bg-yellow-100 text-yellow-800 border-yellow-200'
                                }
                              >
                                {payment.status === 'completed' ? 'Payé' : 'En attente'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(payment.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-xl font-bold">
                          {payment.amount} {payment.currency}
                        </div>
                      </div>
                      
                      {payment.status !== 'completed' && (
                        <div className="mt-4 flex justify-end">
                          <Button className="bg-translation-600 hover:bg-translation-700">
                            Procéder au paiement
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Aucun paiement pour le moment.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetail;
