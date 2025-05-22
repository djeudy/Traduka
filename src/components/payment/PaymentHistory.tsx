
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Payment } from '@/types';
import { useUser } from '@/contexts/UserContext';
import { get } from '@/services/api';

interface PaymentHistoryProps {
  projectId?: string;
}

const PaymentHistory = ({ projectId }: PaymentHistoryProps) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        let endpoint = '/payments';
        
        if (projectId) {
          endpoint = `/projects/${projectId}/payments`;
        } else if (user) {
          endpoint = `/users/${user.id}/payments`;
        }
        
        const response = await get<Payment[]>(endpoint);
        
        if (response.error) throw new Error(response.error);
        
        if (response.data) {
          setPayments(response.data);
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };
    
    if (user) {
      fetchPayments();
    }
  }, [projectId, user]);

  if (payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">Aucun paiement trouvé</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des paiements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="border-b pb-4 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{payment.amount} {payment.currency}</p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(payment.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={
                  payment.status === "completed" ? "default" :
                  payment.status === "pending" ? "outline" : "destructive"
                }>
                  {payment.status === "completed" ? "Complété" : payment.status === "pending" ? "En attente" : "Échoué"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
