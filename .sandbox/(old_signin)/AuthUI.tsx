'use client';

import { useSupabase } from '@/app/supabase-provider';
import { getURL } from '@/lib/helpers';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function AuthUI() {
  const { supabase } = useSupabase();
  return (
    <div className="flex flex-col space-y-4">
      <Auth
        supabaseClient={supabase}
        providers={['github']}
        redirectTo={getURL()}
        magicLink={true}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {

            }
          }
        }}
      />
    </div>
  );
}
