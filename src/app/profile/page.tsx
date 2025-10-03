
'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import { DashboardHeader } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import { useAuth, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { LogOut, Loader2, Save } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { updateProfile } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to update your profile.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile(user, {
        displayName: displayName,
        photoURL: photoURL,
      });

      toast({
        title: 'Success',
        description: 'Your profile has been updated successfully.',
      });
      // The user object from useUser will update automatically via onAuthStateChanged
    } catch (error: any) {
      toast({
        title: 'Error updating profile',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const currentAvatarSrc = photoURL || user?.photoURL;

  return (
    <div className="grid h-screen w-full lg:grid-cols-[280px_1fr]">
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
        <SidebarFooter>
          <UserNav />
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="flex items-center mb-4">
            <h1 className="text-lg font-semibold md:text-2xl">My Profile</h1>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <form onSubmit={handleProfileUpdate}>
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                      Update your name and profile picture.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        {currentAvatarSrc && <AvatarImage src={currentAvatarSrc} alt={displayName} />}
                        <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                      </Avatar>
                      <div className='flex-1 space-y-2'>
                        <Label htmlFor="photoURL">Profile Picture URL</Label>
                        <Input
                          id="photoURL"
                          placeholder="https://example.com/avatar.jpg"
                          value={photoURL}
                          onChange={(e) => setPhotoURL(e.target.value)}
                          disabled={isSaving}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        placeholder="Your Name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        disabled={isSaving}
                      />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user?.email || ''}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        Your email address cannot be changed.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <Loader2 className="mr-2 animate-spin" />
                      ) : (
                        <Save className="mr-2" />
                      )}
                      <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                  <CardDescription>
                    Manage your account sessions and data.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                   <Separator />
                  <Button variant="destructive" onClick={handleLogout} className='w-full'>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
