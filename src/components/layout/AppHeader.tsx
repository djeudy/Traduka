
import { Button } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { BookOpen } from "lucide-react";

const AppHeader = () => {
  return (
    <header className="border-b border-border flex justify-between items-center p-4">
      <div className="flex items-center space-x-2">
        <div className="font-bold text-2xl bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          API Explorer
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm">
          <BookOpen className="mr-2 h-4 w-4" />
          Docs
        </Button>
        <Button variant="ghost" size="sm">
          <GitHubLogoIcon className="mr-2 h-4 w-4" />
          GitHub
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;
