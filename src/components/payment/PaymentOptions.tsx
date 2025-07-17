
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PaymentMethod } from "@/types";
import { Dispatch, SetStateAction } from "react";

export interface PaymentOptionsProps {
  onSelectMethod: Dispatch<SetStateAction<string | null>>;
}

const PaymentOptions = ({ onSelectMethod }: PaymentOptionsProps) => {
  const handleSelectMethod = (method: PaymentMethod) => {
    onSelectMethod(method);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4 cursor-pointer border-2 hover:border-gray-400 transition-colors"
        onClick={() => handleSelectMethod('moncash')}>
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6 text-green-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
          </div>
          <span className="font-medium">MonCash</span>
          <p className="text-sm text-gray-500 text-center">Paiement mobile sécurisé</p>
          <Button variant="outline" size="sm" className="mt-2 w-full">
            Sélectionner
          </Button>
        </div>
      </Card>

      <Card className="p-4 cursor-pointer border-2 hover:border-gray-400 transition-colors"
        onClick={() => handleSelectMethod('bank')}>
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6 text-purple-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15l-1.5 18h-12L4.5 3zM12 3v18M3 12h18" />
            </svg>
          </div>
          <span className="font-medium">Virement bancaire</span>
          <p className="text-sm text-gray-500 text-center">Transfert direct depuis votre banque</p>
          <Button variant="outline" size="sm" className="mt-2 w-full">
            Sélectionner
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PaymentOptions;
