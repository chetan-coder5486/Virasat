import React from 'react';
import { Loader2 } from 'lucide-react';

const Spinner = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50">
      <Loader2 className="h-12 w-12 text-rose-500 animate-spin" />
    </div>
  );
};

export default Spinner;