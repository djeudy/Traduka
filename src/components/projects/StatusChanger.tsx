
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProjectStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { put } from '@/services/api';
import { LoaderCircle } from 'lucide-react';

interface StatusChangerProps {
  projectId: string;
  currentStatus: ProjectStatus;
  onStatusChanged: (newStatus: ProjectStatus) => void;
  disabled?: boolean;
}

const StatusChanger = ({ projectId, currentStatus, onStatusChanged, disabled = false }: StatusChangerProps) => {
  const [status, setStatus] = useState<ProjectStatus>(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
  const handleStatusChange = async () => {
    if (status === currentStatus) return;
    
    setIsUpdating(true);
    try {
      const response = await put(`/api/projects/${projectId}/status/`, { status });
      
      if (response.error) {
        toast({
          title: "Erreur",
          description: response.error,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Statut mis à jour",
        description: "Le statut du projet a été mis à jour avec succès.",
        className: "bg-green-50 border-green-200 text-green-800",
      });
      
      onStatusChanged(status);
    } catch (error) {
      console.error('Error updating project status:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-2">
      <Select
        value={status}
        onValueChange={(value) => setStatus(value as ProjectStatus)}
        disabled={disabled || isUpdating}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Changer le statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="waiting">En attente</SelectItem>
          <SelectItem value="in-progress">En cours</SelectItem>
          <SelectItem value="review">En relecture</SelectItem>
          <SelectItem value="completed">Terminé</SelectItem>
        </SelectContent>
      </Select>
      
      <Button 
        onClick={handleStatusChange} 
        disabled={status === currentStatus || disabled || isUpdating}
        variant="secondary"
        size="sm"
      >
        {isUpdating ? (
          <>
            <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
            Mise à jour...
          </>
        ) : (
          "Mettre à jour"
        )}
      </Button>
    </div>
  );
};

export default StatusChanger;
