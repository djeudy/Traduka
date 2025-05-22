
import { Button } from "@/components/ui/button";
import { Notification } from "@/components/ui/notification";
import { useToast } from "@/components/ui/use-toast";

export default function NotificationExample() {
  const { success, error, info, warning, toast } = useToast();

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold">Exemples de notifications</h2>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Notifications in-line</h3>
        <div className="space-y-3">
          <Notification
            variant="success"
            title="Opération réussie"
            description="Votre action a été effectuée avec succès."
          />
          
          <Notification
            variant="error"
            title="Erreur"
            description="Une erreur s'est produite lors de l'opération."
          />
          
          <Notification
            variant="warning"
            title="Attention"
            description="Veuillez vérifier les informations avant de continuer."
          />
          
          <Notification
            variant="info"
            title="Information"
            description="Voici quelques informations importantes à connaître."
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Notifications toast</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => success("Opération réussie", "Votre action a été effectuée avec succès.")}
            variant="default"
            className="bg-green-600 hover:bg-green-700"
          >
            Succès
          </Button>
          
          <Button
            onClick={() => error("Erreur", "Une erreur s'est produite lors de l'opération.")}
            variant="destructive"
          >
            Erreur
          </Button>
          
          <Button
            onClick={() => warning("Attention", "Veuillez vérifier les informations avant de continuer.")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            Attention
          </Button>
          
          <Button
            onClick={() => info("Information", "Voici quelques informations importantes à connaître.")}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Info
          </Button>
          
          <Button
            onClick={() => toast({
              title: "Notification personnalisée",
              description: "Vous pouvez personnaliser l'apparence de cette notification.",
              className: "bg-purple-50 border-purple-200 text-purple-800"
            })}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            Personnalisée
          </Button>
        </div>
      </div>
    </div>
  );
}
