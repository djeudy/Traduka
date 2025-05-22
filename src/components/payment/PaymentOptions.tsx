
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4 cursor-pointer border-2 hover:border-gray-400 transition-colors" 
        onClick={() => handleSelectMethod('stripe')}>
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
          </div>
          <span className="font-medium">Carte bancaire</span>
          <Button variant="outline" size="sm" className="mt-2 w-full">
            Sélectionner
          </Button>
        </div>
      </Card>

      <Card className="p-4 cursor-pointer border-2 hover:border-gray-400 transition-colors"
        onClick={() => handleSelectMethod('paypal')}>
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="font-medium">PayPal</span>
          <Button variant="outline" size="sm" className="mt-2 w-full">
            Sélectionner
          </Button>
        </div>
      </Card>

      <Card className="p-4 cursor-pointer border-2 hover:border-gray-400 transition-colors"
        onClick={() => handleSelectMethod('moncash')}>
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
          </div>
          <span className="font-medium">MonCash</span>
          <Button variant="outline" size="sm" className="mt-2 w-full">
            Sélectionner
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PaymentOptions;
