
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Collections = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Collections</h1>
        <p className="text-muted-foreground">Organize your API requests</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Collections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No collections yet</p>
            <p className="text-sm mt-1">
              Create collections to organize your API requests
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Collections;
