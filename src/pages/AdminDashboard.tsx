
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import UserRoleManager from '@/components/admin/UserRoleManager';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const { user } = useUser();

  // Redirection si l'utilisateur n'est pas administrateur
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord administrateur</h1>
        <p className="text-gray-600">Gérez les utilisateurs, les rôles et les paramètres du système.</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
          <TabsTrigger value="logs">Logs système</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-6">
          <UserRoleManager />
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres système</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Configuration des paramètres système à venir</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Logs système</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Visualisation des logs système à venir</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
