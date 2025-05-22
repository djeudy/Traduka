
import { ApiResponse } from "./RequestForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, FileJson, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ResponseViewerProps {
  response: ApiResponse | null;
}

const ResponseViewer = ({ response }: ResponseViewerProps) => {
  if (!response) {
    return (
      <div className="h-[400px] flex items-center justify-center border rounded-lg bg-card">
        <div className="text-center text-muted-foreground">
          <FileJson className="mx-auto h-12 w-12 opacity-50 mb-2" />
          <p>Send a request to see the response</p>
        </div>
      </div>
    );
  }

  const formatJson = (json: any) => {
    if (typeof json !== "object" || json === null) {
      return json;
    }

    const formatted = JSON.stringify(json, null, 2);
    return formatJsonSyntax(formatted);
  };

  const formatJsonSyntax = (jsonString: string) => {
    // Replace JSON syntax with HTML spans for styling
    return jsonString
      .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
        let cls = "json-number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "json-key";
          } else {
            cls = "json-string";
          }
        } else if (/true|false/.test(match)) {
          cls = "json-boolean";
        } else if (/null/.test(match)) {
          cls = "json-null";
        }
        return `<span class="${cls}">${match}</span>`;
      });
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-api-post text-white";
    if (status >= 300 && status < 400) return "bg-api-put text-white";
    if (status >= 400 && status < 500) return "bg-api-delete text-white";
    if (status >= 500) return "bg-destructive text-white";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="border rounded-lg bg-card mt-4 overflow-hidden animate-fade-in">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(response.status)}>
            {response.status} {response.statusText}
          </Badge>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {response.duration} ms
          </div>
          <div>
            {(response.size / 1024).toFixed(1)} KB
          </div>
        </div>
      </div>
      <Tabs defaultValue="body" className="p-2">
        <TabsList>
          <TabsTrigger value="body">Response Body</TabsTrigger>
          <TabsTrigger value="headers">Response Headers</TabsTrigger>
        </TabsList>
        <TabsContent value="body">
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <pre className="text-sm font-mono whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatJson(response.data) }} />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="headers">
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="space-y-2">
              {Object.entries(response.headers).map(([key, value]) => (
                <div key={key} className="flex">
                  <div className="font-medium text-muted-foreground w-40">{key}:</div>
                  <div className="flex-1">{value}</div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResponseViewer;
