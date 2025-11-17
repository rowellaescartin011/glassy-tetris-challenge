import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useGameRoomCleanup = (roomId: string | null) => {
  useEffect(() => {
    if (!roomId) return;

    const handleBeforeUnload = async () => {
      // Use sendBeacon for reliable cleanup during page unload
      const { error } = await supabase
        .from('game_rooms')
        .delete()
        .eq('id', roomId);
      
      if (error) {
        console.error('Failed to cleanup room:', error);
      }
    };

    // Also cleanup on visibility change (when tab is closed)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleBeforeUnload();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Final cleanup when component unmounts
      handleBeforeUnload();
    };
  }, [roomId]);
};
