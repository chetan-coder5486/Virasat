import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FAMILY_API_ENDPOINT } from '@/utils/constant';

export function InviteMemberPopover() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSendInvite = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${FAMILY_API_ENDPOINT}/send-invite`,
        { email },
        { withCredentials: true }
      );

      toast.success(response.data.message);
      setEmail('');
      setOpen(false); // Close the popover on success
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send invite.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* FIX: Added the PopoverTrigger to open the popover */}
      <PopoverTrigger asChild>
        <Button className="bg-rose-600 hover:bg-rose-700 text-white">
          <UserPlus className="mr-2 h-4 w-4" /> Invite Member
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 bg-white border-rose-200">
        <form onSubmit={handleSendInvite}>
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none text-rose-800">Invite a New Member</h4>
              <p className="text-sm text-rose-600">
                Enter the email address of the person you want to invite to your family trunk.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-rose-900">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-rose-300 focus-visible:ring-green-500"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Invite'
              )}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}