import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { useUser } from '@/contexts/UserContext';
import { post } from '@/services/api';
import { fileService } from '@/services/api';
import { projectService } from '@/services/api';

const SubmitProject = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [projectName, setProjectName] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [privateProject, setPrivateProject] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const languageOptions = [
    'Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien', 
    'Portugais', 'Chinois', 'Russe', 'Arabe', 'Japonais'
  ];
  
  const acceptedFileTypes = [
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint', 
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain', 
    'text/csv'
  ];
  
  const validateFileTypes = (fileList: File[]): {valid: File[], invalid: File[]} => {
    const valid: File[] = [];
    const invalid: File[] = [];
    
    fileList.forEach(file => {
      if (acceptedFileTypes.includes(file.type)) {
        valid.push(file);
      } else {
        invalid.push(file);
      }
    });
    
    return { valid, invalid };
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const { valid, invalid } = validateFileTypes(filesArray);
      
      if (invalid.length > 0) {
        const invalidNames = invalid.map(f => f.name).join(', ');
        toast({
          title: "Types de fichiers non acceptés",
          description: `Ces fichiers ne sont pas acceptés: ${invalidNames}. Seuls les documents (PDF, Word, Excel, PowerPoint) et fichiers texte sont autorisés.`,
          variant: "destructive",
        });
      }
      
      if (valid.length > 0) {
        setFiles(prev => [...prev, ...valid]);
      }
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      const { valid, invalid } = validateFileTypes(filesArray);
      
      if (invalid.length > 0) {
        const invalidNames = invalid.map(f => f.name).join(', ');
        toast({
          title: "Types de fichiers non acceptés",
          description: `Ces fichiers ne sont pas acceptés: ${invalidNames}. Seuls les documents (PDF, Word, Excel, PowerPoint) et fichiers texte sont autorisés.`,
          variant: "destructive",
        });
      }
      
      if (valid.length > 0) {
        setFiles(prev => [...prev, ...valid]);
      }
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName) {
      return toast({
        title: "Nom du projet manquant",
        description: "Veuillez donner un nom à votre projet",
        variant: "destructive",
      });
    }
    
    if (!sourceLanguage) {
      return toast({
        title: "Langue source manquante",
        description: "Veuillez sélectionner la langue source",
        variant: "destructive",
      });
    }
    
    if (!targetLanguage) {
      return toast({
        title: "Langue cible manquante",
        description: "Veuillez sélectionner la langue cible",
        variant: "destructive",
      });
    }
    
    if (sourceLanguage === targetLanguage) {
      return toast({
        title: "Langues identiques",
        description: "Les langues source et cible doivent être différentes",
        variant: "destructive",
      });
    }
    
    if (files.length === 0) {
      return toast({
        title: "Aucun fichier",
        description: "Veuillez ajouter au moins un document à traduire",
        variant: "destructive",
      });
    }

    setUploading(true);
    
    try {
      if (!user) {
        throw new Error("Vous devez être connecté pour soumettre un projet");
      }

      // Create a new project using the API service
      const response = await projectService.createProject(user.id, projectName, sourceLanguage, targetLanguage, instructions, privateProject);

      if (response.error) {
        throw new Error(response.error);
      }
      
      // Fix for error TS2339: Property 'id' does not exist on type 'unknown'
      const projectId = response.data && typeof response.data === 'object' && 'id' in response.data 
        ? String(response.data.id) 
        : null;
        
      if (!projectId) {
        throw new Error("Impossible de récupérer l'ID du projet créé");
      }
      
      // Upload files to Appwrite Storage
      const uploadResult = await fileService.uploadFiles(files, 'project_documents', projectId, user.id);
      
      if (uploadResult.error && !uploadResult.data) {
        throw new Error(uploadResult.error);
      }
      
      // If some files failed to upload but not all
      if (uploadResult.error && uploadResult.data) {
        // Fix for error TS2322: Type '"warning"' is not assignable to type '"default" | "destructive"'
        toast({
          title: "Attention",
          description: uploadResult.error,
          variant: "default",
          className: "bg-yellow-50 border-yellow-200 text-yellow-800",
        });
      }
      
      // After successful upload, update project with file information
      const fileUpdateResponse = await post(`/api/projects/${projectId}/documents/`, {
        files: uploadResult.data?.files.map(file => ({
          name: file.name,
          path: file.path,
          size: file.size,
          url: file.url
        }))
      });
      
      if (fileUpdateResponse.error) {
        console.error("Error updating project with files:", fileUpdateResponse.error);
        // Fix for error TS2322: Type '"warning"' is not assignable to type '"default" | "destructive"'
        toast({
          title: "Projet créé mais erreur lors de l'enregistrement des fichiers",
          description: "Votre projet a été créé, mais nous avons rencontré un problème lors de l'enregistrement des références de fichiers.",
          variant: "default",
          className: "bg-yellow-50 border-yellow-200 text-yellow-800",
        });
      }
      
      const projectPrivacyMessage = privateProject 
        ? "Votre projet ne sera pas conservé sur la plateforme après traitement." 
        : "";
      
      toast({
        title: "Projet soumis avec succès",
        description: `Votre projet a été créé et sera traité prochainement. ${projectPrivacyMessage}`,
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Project submission error:', error);
      toast({
        title: "Erreur de soumission",
        description: error.message || "Une erreur est survenue lors de la création de votre projet",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };
  
  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Nouveau projet de traduction</h1>
        <p className="text-gray-600 mt-1">Soumettez vos documents à traduire et spécifiez vos besoins</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Détails du projet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Nom du projet *</Label>
                <Input 
                  id="projectName" 
                  placeholder="Ex: Traduction brochure commerciale"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  disabled={uploading}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sourceLanguage">Langue source *</Label>
                  <Select value={sourceLanguage} onValueChange={setSourceLanguage} disabled={uploading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une langue" />
                    </SelectTrigger>
                    <SelectContent>
                      {languageOptions.map(language => (
                        <SelectItem key={language} value={language}>
                          {language}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="targetLanguage">Langue cible *</Label>
                  <Select value={targetLanguage} onValueChange={setTargetLanguage} disabled={uploading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une langue" />
                    </SelectTrigger>
                    <SelectContent>
                      {languageOptions.map(language => (
                        <SelectItem key={language} value={language}>
                          {language}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions spécifiques</Label>
                <Textarea 
                  id="instructions" 
                  placeholder="Précisez toute exigence particulière, terminologie spécifique ou contexte important..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={4}
                  disabled={uploading}
                />
              </div>
              
              {/* Privacy Option */}
              <div className="flex items-center justify-between space-x-2 pt-2">
                <div>
                  <Label htmlFor="private-project" className="font-medium">Ne pas conserver le projet</Label>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Les documents seront supprimés de la plateforme une fois la traduction terminée
                  </p>
                </div>
                <Switch
                  id="private-project"
                  checked={privateProject}
                  onCheckedChange={setPrivateProject}
                  disabled={uploading}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Document Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Documents à traduire</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="file-upload p-6 border-2 border-dashed border-gray-300 rounded-lg text-center hover:bg-gray-50 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400 mb-2 mx-auto">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                <p className="font-medium">Glissez-déposez vos documents ici</p>
                <p className="text-sm text-gray-500 mt-1">Formats acceptés: PDF, DOCX, XLSX, PPTX, TXT, CSV</p>
                
                <div className="mt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="relative"
                    disabled={uploading}
                  >
                    Parcourir
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={handleFileChange}
                      multiple
                      disabled={uploading}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
                    />
                  </Button>
                </div>
              </div>
              
              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="font-medium text-sm">Documents ajoutés ({files.length})</h4>
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB</p>
                        </div>
                      </div>
                      
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-500 hover:text-red-600"
                        onClick={() => removeFile(index)}
                        disabled={uploading}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {uploading && uploadProgress > 0 && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 text-right">{uploadProgress}% téléchargé</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Submit */}
          <Card>
            <CardFooter className="flex justify-between p-6">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/dashboard')}
                disabled={uploading}
              >
                Annuler
              </Button>
              
              <Button 
                type="submit" 
                className="bg-translation-600 hover:bg-translation-700"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Soumission en cours...
                  </>
                ) : (
                  'Soumettre le projet'
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default SubmitProject;
