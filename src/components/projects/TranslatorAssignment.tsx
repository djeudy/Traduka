
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { roleService } from '@/services/roleService';
import { projectService } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';

interface TranslatorAssignmentProps {
  projectId: string;
  currentTranslatorId: number | null;
  onAssignSuccess: (translatorId: number | null) => void;
}

export const TranslatorAssignment = ({ 
  projectId, 
  currentTranslatorId, 
  onAssignSuccess 
}: TranslatorAssignmentProps) => {
  const [translators, setTranslators] = useState<User[]>([]);
  const [selectedTranslator, setSelectedTranslator] = useState<string>(
    currentTranslatorId ? String(currentTranslatorId) : ""
  );
  const [loading, setLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchTranslators = async () => {
      setLoading(true);
      try {
        const response = await roleService.getAllTranslators();
        
        if (response.data) {
          setTranslators(response.data);
        } else {
          toast({
            title: "Erreur",
            description: "Impossible de charger la liste des traducteurs",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching translators:', error);
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite lors du chargement des traducteurs",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTranslators();
  }, [toast]);
  
  const handleAssign = async () => {
    setAssignLoading(true);
    try {
      const translatorId = selectedTranslator ? parseInt(selectedTranslator) : null;
      
      const response = translatorId 
        ? await projectService.assignTranslator(projectId, translatorId)
        : await projectService.unassignTranslator(projectId);
      
      if (!response.error) {
        toast({
          title: translatorId ? "Traducteur assigné" : "Traducteur retiré",
          description: translatorId 
            ? "Le traducteur a été assigné au projet avec succès" 
            : "Le traducteur a été retiré du projet",
        });
        
        onAssignSuccess(translatorId);
      } else {
        toast({
          title: "Erreur",
          description: response.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error assigning translator:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'assignation du traducteur",
        variant: "destructive",
      });
    } finally {
      setAssignLoading(false);
    }
  };
  
  const handleUnassign = async () => {
    setAssignLoading(true);
    try {
      const response = await projectService.unassignTranslator(projectId);
      
      if (!response.error) {
        toast({
          title: "Traducteur retiré",
          description: "Le traducteur a été retiré du projet",
        });
        
        setSelectedTranslator("");
        onAssignSuccess(null);
      } else {
        toast({
          title: "Erreur",
          description: response.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error unassigning translator:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du retrait du traducteur",
        variant: "destructive",
      });
    } finally {
      setAssignLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Assigner un traducteur</h3>
      
      <div className="flex items-end gap-4">
        <div className="flex-grow">
          <label htmlFor="translator-select" className="block text-sm font-medium text-gray-700 mb-1">
            Sélectionner un traducteur
          </label>
          <Select
            value={selectedTranslator}
            onValueChange={setSelectedTranslator}
            disabled={loading}
          >
            <SelectTrigger id="translator-select" className="w-full">
              <SelectValue placeholder="Sélectionner un traducteur" />
            </SelectTrigger>
            <SelectContent>
              {translators.map((translator) => (
                <SelectItem key={translator.id} value={String(translator.id)}>
                  {translator.name} ({translator.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleAssign} 
            disabled={assignLoading || loading}
          >
            {assignLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : null}
            Assigner
          </Button>
          
          {currentTranslatorId && (
            <Button 
              variant="destructive" 
              onClick={handleUnassign}
              disabled={assignLoading || loading}
            >
              Retirer
            </Button>
          )}
        </div>
      </div>
      
      {loading && <p className="text-sm text-gray-500">Chargement des traducteurs...</p>}
      {!loading && translators.length === 0 && (
        <p className="text-sm text-gray-500">Aucun traducteur disponible</p>
      )}
    </div>
  );
};

export default TranslatorAssignment;
