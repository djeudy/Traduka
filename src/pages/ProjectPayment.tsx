
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Payment, Project } from '@/types';
import { useUser } from '@/contexts/UserContext';
import PaymentForm from '@/components/payment/PaymentForm';
import PaymentOptions from '@/components/payment/PaymentOptions';
import PaymentHistory from '@/components/payment/PaymentHistory';

const ProjectPayment = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        toast({
          title: "Erreur",
          description: "ID de projet manquant",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      try {
        // Mock project data for now
        setTimeout(() => {
          const mockProject: Project = {
            id: projectId,
            name: "Sample Project",
            client: 1,
            source_language: "French",
            target_language: "English",
            status: "in-progress",
            source_documents: [],
            comments: [],
            submitted_at: '2002-10-20',
            payments: [],
            started_at: '',
            estimated_completion_date: '',
            completed_at: '',
            private_project: false,
            translator: 0,
            translated_documents: []
          };
          
          setProject(mockProject);
          setLoading(false);
        }, 1000);
      } catch (error: any) {
        console.error('Error fetching project:', error);
        toast({
          title: "Erreur",
          description: error.message || "Impossible de charger le projet",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [projectId, toast]);
  
  const handlePaymentComplete = (payment: Payment) => {
    setProject(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        payments: [...prev.payments, payment]
      };
    });
    
    toast({
      title: "Paiement réussi",
      description: "Le paiement a été effectué avec succès.",
    });
  };
  
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'waiting':
        return 'En attente';
      case 'in-progress':
        return 'En cours';
      case 'review':
        return 'En relecture';
      case 'completed':
        return 'Terminé';
      default:
        return 'Inconnu';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate(`/projects/${projectId}`)}
        >
          ← Retour au projet
        </Button>
      </div>
      
      {project ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Paiement pour {project.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="text-lg font-medium">Détails du projet</h3>
                <p>Source: {project.source_language}</p>
                <p>Cible: {project.target_language}</p>
                <p>Documents Sources: {project.source_documents.length}</p>
                <p>Documents traduits: {project.translated_documents.length}</p>
                <p>Statut: {getStatusLabel(project.status)}</p>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Sélectionner un mode de paiement</h3>
                {project.payments.some(p => p.status === 'completed') ? (
                  <div className="bg-green-50 p-4 rounded-md border border-green-200">
                    <p className="text-green-700">Ce projet a déjà été payé.</p>
                  </div>
                ) : (
                  <>
                    <PaymentOptions onSelectMethod={setSelectedMethod} />
                    
                    {selectedMethod && (
                      <div className="mt-4">
                        <PaymentForm
                          projectId={project.id}
                          paymentMethod={selectedMethod}
                          onPaymentComplete={handlePaymentComplete}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          <PaymentHistory projectId={projectId} />
        </div>
      ) : loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-xl font-semibold text-red-500">Projet non trouvé</p>
              <Button 
                className="mt-4" 
                onClick={() => navigate('/dashboard')}
              >
                Retourner au tableau de bord
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectPayment;
