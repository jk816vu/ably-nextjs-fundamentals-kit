// pages/rooms.tsx

import { MouseEventHandler, MouseEvent, useEffect, useState } from 'react'
import * as Ably from 'ably/promises'
import { configureAbly } from '@ably-labs/react-hooks'
import Layout from '../components/layout'
import Logger, { LogEntry } from '../components/logger'
import styles from '../styles/PubSub.module.css'
import { createRoom, connectToRoom, publishFromClient } from '../services/roomService';

export default function Rooms() {
  const [logs, setLogs] = useState<Array<LogEntry>>([]);
  const [channel, setChannel] = useState<Ably.Types.RealtimeChannelPromise | null>(null);
  const [messageText, setMessageText] = useState<string>('A message');
  const [squareState, setSquareState] = useState<string>('blue');
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [connectedClients, setConnectedClients] = useState<number>(0);
  const [connectedRoomNumber, setConnectedRoomNumber] = useState<number | null>(null);
  const [roomChannel, setRoomChannel] = useState<Ably.Types.RealtimeChannelPromise | null>(null);
  const [ably, setAbly] = useState<Ably.Types.RealtimePromise | null>(null); // Declare ably here

  const [roomColors, setRoomColors] = useState<Record<number, string>>({}); // Mapping between room numbers and colors

  useEffect(() => {
    const ablyInstance: Ably.Types.RealtimePromise = configureAbly({ authUrl: '/api/authentication/token-auth' });

    ablyInstance.connection.on((stateChange: Ably.Types.ConnectionStateChange) => {
      console.log(stateChange);
    
      if (stateChange.current === 'connected') {
        setConnectedClients(prev => prev + 1);
        // Set up channels and subscriptions here
      } else if (stateChange.current === 'disconnected') {
        setConnectedClients(prev => Math.max(prev - 1, 0));
      }
    });

    const _channel = ablyInstance.channels.get('status-updates');
    _channel.subscribe((message: Ably.Types.Message) => {
      setLogs(prev => [...prev, new LogEntry(`✅ event name: ${message.name} text: ${message.data.text}`)]);
      console.log("message ", message.data.text);
      console.log("color: ", message.data.color);

      setSquareState(message.data.color || 'blue');
      console.log("new state of square: ", message.data.text);

      setConnectedRoomNumber(message.data.roomNumber);
    });

    setChannel(_channel);
     setAbly(ablyInstance); // Set ably instance
    return () => {
      _channel.unsubscribe();
      setConnectedClients(prev => Math.max(prev - 1, 0));
    };
  }, []);

  useEffect(() => {
    // Subscribe to the room-specific channel when connectedRoomNumber changes
    if (connectedRoomNumber !== null) {
      
      const roomChannel = ably?.channels.get(`room-${connectedRoomNumber}`);
      

      if (roomChannel) {
        roomChannel.subscribe((message: Ably.Types.Message) => {
          console.log(`Received message for room ${connectedRoomNumber}:`, message.data);
          setSquareState(message.data.color || 'blue');
        });
        setRoomChannel(roomChannel);
      }
    }
  }, [connectedRoomNumber]);

  const createRoomHandler: MouseEventHandler = async (_event) => {
    try {
      const response = await fetch('/api/create-room', {
        method: 'POST',
      });
  
      if (response.ok) {
        const createdRoom = await response.json();
        console.log("created room: ", createdRoom);
        setConnectedRoomNumber(createdRoom.room_number);
  
        console.log("Attempting to create room");
        const roomChannel = ably?.channels.get(`room-${createdRoom.room_number}`);
        console.log("roomChannel in createRoomHandler:", roomChannel);
  
        if (roomChannel) {
          roomChannel.subscribe((message: Ably.Types.Message) => {
            console.log(`Received message for room ${createdRoom.room_number}:`, message.data);
            // Handle messages for the room-specific channel
  
            // Update squareState directly
            setSquareState(message.data.color || 'blue');
          });
  
          // Set the room-specific channel
          setRoomChannel(roomChannel);
        } else {
          console.log("room channel is null", roomChannel);
        }
      } else {
        console.error('Failed to create room');
      }
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };
  
  const connectToRoomHandler: MouseEventHandler = async (_event: MouseEvent<HTMLButtonElement>) => {
    try {
      // Prompt the user for the room code
      const enteredRoomCode = prompt('Enter room code:');
  
      if (enteredRoomCode) {
        // Make a POST request to the connect-to-room API endpoint
        const response = await fetch('/api/connect-to-room', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ room_number: enteredRoomCode }),
        });
  
        if (response.ok) {
          const connectedRoom = await response.json();
          // Handle the logic for connecting to the room on the client side
          setConnectedRoomNumber(connectedRoom.room_number);
  
          console.log("Attempting to create room");
          const roomChannel = ably?.channels.get(`room-${connectedRoom.room_number}`);
          console.log("roomChannel in connectToRoomHandler:", roomChannel);
  
          if (roomChannel) {
            roomChannel.subscribe((message: Ably.Types.Message) => {
              console.log("subscribing to room channel");
              console.log(`Received message for room ${connectedRoom.room_number}:`, message.data);
              // Handle messages for the room-specific channel
  
              // Update squareState directly
              setSquareState(message.data.color || 'blue');
            });
  
            // Set the room-specific channel
            setRoomChannel(roomChannel);
          } else {
            console.log("room channel is null", roomChannel);
          }
        } else {
          console.error('Failed to connect to room');
        }
      }
    } catch (error) {
      console.error('Error connecting to room:', error);
    }
  };

  const publicFromClientHandler: MouseEventHandler = async (_event: MouseEvent<HTMLButtonElement>) => {
    if (roomChannel === null || connectedRoomNumber === null) return;
  
    const randomColor = getRandomColor();
  
    const message = { text: messageText, color: randomColor, room_number: connectedRoomNumber };
    console.log("publishing message: ", message);
  
    publishFromClient(roomChannel, 'update-from-client', message);
    console.log(`Published message with color: ${randomColor} for room: ${connectedRoomNumber}`);
  };

  function getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }

  return (
    <Layout
      pageTitle="Ably PubSub with Next.js"
      metaDescription="Ably PubSub with Next.js"
    >
      <section className={styles.publish}>
        <h3>Room Actions</h3>
        <div>
          <button onClick={createRoomHandler}>Create Room</button>
          
        </div>
        <div>
          <button onClick={connectToRoomHandler}>Connect to Room</button>
        </div>
      </section>

      <section className={styles.publish}>
        <h3>Publish</h3>
        <div>
          <label htmlFor="message">Message text</label>
          <input type="text" placeholder="message to publish" value={messageText} onChange={e => setMessageText(e.target.value)} />
        </div>
        <div>
          <button onClick={publicFromClientHandler}>Publish from client</button>
        </div>
      </section>

      <section>
        <h3>Test square</h3>
        <div className={styles.square} style={{ backgroundColor: squareState }}></div>
      </section>

      <section>
        <h3>Subscribe now</h3>
        <div>
          <p>Connected Clients: {connectedClients}</p>
          <p>Connected Room Number: {connectedRoomNumber}</p>
        </div>
        <Logger logEntries={logs} />
      </section>
    </Layout>
  );
}
