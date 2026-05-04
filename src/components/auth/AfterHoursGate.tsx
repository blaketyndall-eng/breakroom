import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { isLocalClockedOut } from '@/lib/localSession';

export default function AfterHoursGate() {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    async function check() {
      if (isLocalClockedOut()) {
        setAllowed(true);
        return;
      }

      if (!supabase) {
        setAllowed(false);
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) {
        setAllowed(false);
        return;
      }

      const { data } = await supabase.from('user_profiles').select('shift_status').eq('id', user.id).single();
      setAllowed(data?.shift_status === 'clocked_out' || data?.shift_status === 'still_out');
    }

    check().catch(() => setAllowed(false));
  }, []);

  useEffect(() => {
    if (allowed === false) {
      const t = window.setTimeout(() => {
        window.location.href = '/portal';
      }, 1400);
      return () => window.clearTimeout(t);
    }
  }, [allowed]);

  if (allowed === null) {
    return <div className="memo-box">Checking shift status...</div>;
  }

  if (allowed === false) {
    return <div className="memo-box red-stamp">Access denied / clock out first. Redirecting to your employee file.</div>;
  }

  return <div className="status-strip"><span>ACCESS CONFIRMED</span><span>CLOCKED OUT</span><span>After Hours gate open</span></div>;
}
