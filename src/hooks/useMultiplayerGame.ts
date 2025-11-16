import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { GameState } from '@/types/tetris';

interface MultiplayerState {
  roomCode: string | null;
  isHost: boolean;
  opponentConnected: boolean;
  opponentGameState: GameState | null;
}

export const useMultiplayerGame = (localGameState: GameState) => {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [multiplayerState, setMultiplayerState] = useState<MultiplayerState>({
    roomCode: null,
    isHost: false,
    opponentConnected: false,
    opponentGameState: null,
  });

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createRoom = async () => {
    const roomCode = generateRoomCode();
    
    const { error } = await supabase
      .from('game_rooms')
      .insert({
        room_code: roomCode,
        status: 'waiting',
      });

    if (error) {
      console.error('Error creating room:', error);
      return;
    }

    joinRoomChannel(roomCode, true);
    setMultiplayerState(prev => ({ ...prev, roomCode, isHost: true }));
  };

  const joinRoom = async (roomCode: string) => {
    const { data, error } = await supabase
      .from('game_rooms')
      .select('*')
      .eq('room_code', roomCode)
      .single();

    if (error || !data) {
      console.error('Room not found:', error);
      return false;
    }

    await supabase
      .from('game_rooms')
      .update({ status: 'playing', started_at: new Date().toISOString() })
      .eq('room_code', roomCode);

    joinRoomChannel(roomCode, false);
    setMultiplayerState(prev => ({ ...prev, roomCode, isHost: false }));
    return true;
  };

  const joinRoomChannel = (roomCode: string, isHost: boolean) => {
    const newChannel = supabase.channel(`game:${roomCode}`);

    newChannel
      .on('presence', { event: 'sync' }, () => {
        const state = newChannel.presenceState();
        const presenceCount = Object.keys(state).length;
        setMultiplayerState(prev => ({ ...prev, opponentConnected: presenceCount >= 2 }));
      })
      .on('broadcast', { event: 'game_state' }, ({ payload }) => {
        setMultiplayerState(prev => ({ ...prev, opponentGameState: payload }));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await newChannel.track({
            user: isHost ? 'host' : 'guest',
            online_at: new Date().toISOString(),
          });
        }
      });

    setChannel(newChannel);
  };

  const leaveRoom = async () => {
    if (channel) {
      await channel.unsubscribe();
      setChannel(null);
    }

    if (multiplayerState.roomCode) {
      await supabase
        .from('game_rooms')
        .delete()
        .eq('room_code', multiplayerState.roomCode);
    }

    setMultiplayerState({
      roomCode: null,
      isHost: false,
      opponentConnected: false,
      opponentGameState: null,
    });
  };

  // Broadcast local game state to opponent
  useEffect(() => {
    if (channel && multiplayerState.opponentConnected) {
      channel.send({
        type: 'broadcast',
        event: 'game_state',
        payload: localGameState,
      });
    }
  }, [localGameState, channel, multiplayerState.opponentConnected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [channel]);

  return {
    ...multiplayerState,
    createRoom,
    joinRoom,
    leaveRoom,
  };
};
