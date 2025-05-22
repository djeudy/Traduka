
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProjectFiltering } from '@/hooks/useProjectFiltering';
import StatCards from '@/components/dashboard/StatCards';
import SearchFilter from '@/components/dashboard/SearchFilter';
import ProjectList from '@/components/dashboard/ProjectList';
import ProjectPagination from '@/components/dashboard/ProjectPagination';

const Dashboard = () => {
  const { t } = useLanguage();
  const {
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
    completedCount
  } = useProjectFiltering();
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('dashboard.title')}</h1>
          <p className="text-gray-600 mt-1">{t('dashboard.description')}</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link to="/submit-project">
            <Button className="bg-customBlue hover:bg-customBlue/90">
              {t('dashboard.newProject')}
            </Button>
          </Link>
        </div>
      </div>
      
      <StatCards 
        totalCount={filteredProjects.length}
        inProgressCount={inProgressCount}
        reviewCount={reviewCount}
        completedCount={completedCount}
      />
      
      <SearchFilter 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        getStatusBadgeClass={getStatusBadgeClass}
        getStatusLabel={getStatusLabel}
      />
      
      {/* Projects tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">{t('dashboard.activeProjects')}</TabsTrigger>
          <TabsTrigger value="completed">{t('dashboard.completedProjects')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          <ProjectList 
            projects={currentProjects} 
            loading={loading} 
            searchQuery={searchQuery} 
            statusFilter={statusFilter} 
            getStatusBadgeClass={getStatusBadgeClass}
            getStatusLabel={getStatusLabel}
          />
          
          {/* Pagination for active projects */}
          {filteredProjects.filter(p => p.status !== 'completed').length > 0 && (
            <ProjectPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          <ProjectList 
            projects={currentProjects} 
            loading={loading} 
            searchQuery={searchQuery} 
            statusFilter={statusFilter} 
            getStatusBadgeClass={getStatusBadgeClass}
            getStatusLabel={getStatusLabel}
            isCompleted={true}
          />
          
          {/* Pagination for completed projects */}
          {filteredProjects.filter(p => p.status === 'completed').length > 0 && (
            <ProjectPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
