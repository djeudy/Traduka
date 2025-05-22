
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface RequestFormProps {
  onResponse: (response: ApiResponse) => void;
}

export interface ApiResponse {
  data: any;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  duration: number;
  size: number;
}

const RequestForm = ({ onResponse }: RequestFormProps) => {
  const [url, setUrl] = useState<string>("");
  const [method, setMethod] = useState<string>("GET");
  const [loading, setLoading] = useState<boolean>(false);
  const [headers, setHeaders] = useState<string>('{\n  "Content-Type": "application/json"\n}');
  const [params, setParams] = useState<string>("{}");
  const [body, setBody] = useState<string>("");

  const sendRequest = async () => {
    if (!url) {
      toast.error("Please enter a URL");
      return;
    }

    try {
      setLoading(true);
      const start = performance.now();
      
      let requestUrl = url;
      
      // Add query params if they exist and it's not empty object
      try {
        const parsedParams = JSON.parse(params);
        if (Object.keys(parsedParams).length > 0) {
          const queryParams = new URLSearchParams();
          Object.entries(parsedParams).forEach(([key, value]) => {
            queryParams.append(key, String(value));
          });
          requestUrl = `${requestUrl}${url.includes('?') ? '&' : '?'}${queryParams.toString()}`;
        }
      } catch (e) {
        toast.error("Invalid JSON in parameters");
        setLoading(false);
        return;
      }

      // Parse headers
      let headersObj: Record<string, string> = {};
      try {
        headersObj = JSON.parse(headers);
      } catch (e) {
        toast.error("Invalid JSON in headers");
        setLoading(false);
        return;
      }

      // Parse body if needed
      let requestBody: string | undefined;
      if (method !== "GET" && method !== "HEAD" && body) {
        try {
          // Just to validate it's valid JSON
          JSON.parse(body);
          requestBody = body;
        } catch (e) {
          toast.error("Invalid JSON in request body");
          setLoading(false);
          return;
        }
      }

      const options: RequestInit = {
        method,
        headers: headersObj,
        body: requestBody,
      };

      const response = await fetch(requestUrl, options);
      const end = performance.now();
      
      // Get response size
      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = responseText;
      }

      const size = new Blob([responseText]).size;
      const duration = Math.round(end - start);

      // Extract headers
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      const apiResponse: ApiResponse = {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        duration,
        size,
      };

      onResponse(apiResponse);
      toast.success(`Request completed in ${duration}ms`);
    } catch (error) {
      console.error(error);
      toast.error(`Request failed: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">
              <span className="method-badge method-get">GET</span>
            </SelectItem>
            <SelectItem value="POST">
              <span className="method-badge method-post">POST</span>
            </SelectItem>
            <SelectItem value="PUT">
              <span className="method-badge method-put">PUT</span>
            </SelectItem>
            <SelectItem value="DELETE">
              <span className="method-badge method-delete">DELETE</span>
            </SelectItem>
            <SelectItem value="PATCH">
              <span className="method-badge method-patch">PATCH</span>
            </SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="https://api.example.com/endpoint"
          className="flex-1"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button onClick={sendRequest} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send
        </Button>
      </div>

      <Tabs defaultValue="params">
        <TabsList>
          <TabsTrigger value="params">Params</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          {(method === "POST" || method === "PUT" || method === "PATCH") && (
            <TabsTrigger value="body">Body</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="params">
          <Textarea
            placeholder="Enter JSON parameters"
            className="font-mono text-sm h-32"
            value={params}
            onChange={(e) => setParams(e.target.value)}
          />
        </TabsContent>
        <TabsContent value="headers">
          <Textarea
            placeholder="Enter JSON headers"
            className="font-mono text-sm h-32"
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
          />
        </TabsContent>
        {(method === "POST" || method === "PUT" || method === "PATCH") && (
          <TabsContent value="body">
            <Textarea
              placeholder="Enter JSON body"
              className="font-mono text-sm h-32"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default RequestForm;
