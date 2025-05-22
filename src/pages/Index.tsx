
import { useState } from "react";
import RequestForm, { ApiResponse } from "@/components/api/RequestForm";
import ResponseViewer from "@/components/api/ResponseViewer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const handleResponse = (apiResponse: ApiResponse) => {
    setResponse(apiResponse);
    
    // In a real app, we would also add this to the history
    // addToHistory({ url, method, response: apiResponse });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">API Explorer</h1>
        <p className="text-muted-foreground">
          Test API endpoints with a simple interface
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Make a Request</CardTitle>
          <CardDescription>
            Enter an API endpoint URL and configure your request
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RequestForm onResponse={handleResponse} />
        </CardContent>
      </Card>

      <ResponseViewer response={response} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Try these APIs</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <ArrowRight className="h-4 w-4 mr-2 text-api-get" />
                <span className="text-sm hover:underline cursor-pointer">
                  https://jsonplaceholder.typicode.com/posts
                </span>
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-4 w-4 mr-2 text-api-get" />
                <span className="text-sm hover:underline cursor-pointer">
                  https://api.publicapis.org/entries
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
