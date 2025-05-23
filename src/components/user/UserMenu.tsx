
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User as UserIcon } from 'lucide-react';

const UserMenu = () => {
  const { user, logout } = useUser();
  
  if (!user) return null;
  
  // Generate initials safely, ensuring user.name exists
  const initials = user.name 
    ? user.name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
    : 'U'; // Fallback to 'U' for User if name is empty/undefined
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="space-y-1">
          <div className="p-2 text-center">
            <p className="text-sm font-medium">{user.name || 'User'}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          
          <div className="border-t border-gray-200 pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserMenu;
