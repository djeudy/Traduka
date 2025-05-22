
import { useState, useEffect, useMemo } from 'react';
import { ApiProject,Project, ProjectStatus } from '@/types';
import { useUser } from '@/contexts/UserContext';
import { projectService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export const useProjectFiltering = () => {
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useUser();
  const { toast } = useToast();
  const projectsPerPage = 5;
  
  useEffect(() => {
    // Fetch projects from API
    const fetchProjects = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Use the projectService to fetch projects
        const response = await projectService.getAllProjects();
        
        if (response.error) {
          throw new Error(response.error);
        }

        // Transform API response to match our Project type
        const transformedProject = response.data?.map(apiProject => ({
        id: apiProject.id,
        source_document_count: apiProject.source_document_count,
        translated_document_count: apiProject.translated_document_count,
        name: apiProject.name,
        client: apiProject.client,
        translator: apiProject.translator ? Number(apiProject.translator) : undefined,
        source_language: apiProject.source_language,
        target_language: apiProject.target_language,
        status: apiProject.status as ProjectStatus,
        submitted_at: apiProject.submitted_at,
        started_at: apiProject.started_at,
        estimated_completion_date: apiProject.estimated_completion_date,
        completed_at: apiProject.completed_at,
        private_project: apiProject.private_project,
      }));
        
        setProjects(transformedProject);
        
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les projets",
          variant: "destructive"
        });
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [user, toast]);
  
  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);
  
  // Filter projects based on search query and status filter
  const filteredProjects = useMemo(() => {
    return projects.filter(project => 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
      (statusFilter === 'all' || project.status === statusFilter)
    );
  }, [projects, searchQuery, statusFilter]);
  
  // Calculate pagination
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  
  // Helper functions
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
  
  // Stats counts
  const waitingCount = projects.filter(p => p.status === 'waiting').length;
  const inProgressCount = projects.filter(p => p.status === 'in-progress').length;
  const reviewCount = projects.filter(p => p.status === 'review').length;
  const completedCount = projects.filter(p => p.status === 'completed').length;
  
  return {
    projects,
    currentProjects,
    filteredProjects,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    getStatusBadgeClass,
    getStatusLabel,
    waitingCount,
    inProgressCount,
    reviewCount,
    completedCount,
    projectsPerPage
  };
};
