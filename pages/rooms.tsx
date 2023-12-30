import { MouseEventHandler, MouseEvent, useEffect, useState } from 'react'

import * as Ably from 'ably/promises'
import { configureAbly } from '@ably-labs/react-hooks'

import Layout from '../components/layout'
import Logger, { LogEntry } from '../components/logger'

import homeStyles from '../styles/Home.module.css'
import styles from '../styles/PubSub.module.css'

export default function PubSub() {
  const [logs, setLogs] = useState<Array<LogEntry>>([]);
  const [channel, setChannel] = useState<Ably.Types.RealtimeChannelPromise | null>(null);
  const [messageText, setMessageText] = useState<string>('A message');
  const [squareState, setSquareState] = useState<string>('blue');
  const [roomCode, setRoomCode] = useState<string | null>(null);

  useEffect(() => {
    const ably: Ably.Types.RealtimePromise = configureAbly({ authUrl: '/api/authentication/token-auth' });

    ably.connection.on((stateChange: Ably.Types.ConnectionStateChange) => {
      console.log(stateChange);
    });

    const _channel = ably.channels.get('status-updates');
  _channel.subscribe((message: Ably.Types.Message) => {
    setLogs(prev => [...prev, new LogEntry(`✅ event name: ${message.name} text: ${message.data.text}`)]);
    console.log("message ", message.data.text);
    console.log("color: ", message.data.color); // Log the color information

    setSquareState(message.data.color || 'blue'); // Use the received color or default to 'blue'
    console.log("new state of square: ", message.data.text);
  });

  setChannel(_channel);
  return () => {
    _channel.unsubscribe();
  };
  }, []); // Only run the client

  const createRoomHandler: MouseEventHandler = async (_event: MouseEvent<HTMLButtonElement>) => {
    try {
      // Logic to create a room
      const response = await fetch('/api/create-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const createdRoom = await response.json();
        setRoomCode(createdRoom.roomCode);
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
          body: JSON.stringify({ roomCode: enteredRoomCode }),
        });
  
        if (response.ok) {
          const connectedRoom = await response.json();
          // Handle the logic for connecting to the room on the client side
  
          // Log a success message in the console
          console.log(`Successfully connected to room ${connectedRoom.roomCode}`);
        } else {
          console.error('Failed to connect to room');
        }
      }
    } catch (error) {
      console.error('Error connecting to room:', error);
    }
  };

  const publicFromClientHandler: MouseEventHandler = async (_event: MouseEvent<HTMLButtonElement>) => {
    if (channel === null) return;

    // Generate a random color for testing purposes
    const randomColor = getRandomColor();
    const message = { text: messageText, color: randomColor };

    // Publish the message with color information
    channel.publish('update-from-client', message);
    setSquareState(randomColor);

    // Log a success message in the console
    console.log(`Published message with color: ${randomColor}`);
  };

  function getRandomColor() {
    // Generate a random hex color code
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }

  const changeColorHandler: MouseEventHandler = async (_event: MouseEvent<HTMLButtonElement>) => {
    // Call the existing color change logic
    publicFromClientHandler(_event);
  };

  const publicFromServerHandler: MouseEventHandler = (_event: MouseEvent<HTMLButtonElement>) => {
    fetch('/api/pub-sub/publish', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ text: messageText }),
    });
    setSquareState(messageText);
  };


  return (
    <Layout
      pageTitle="Ably PubSub with Next.js"
      metaDescription="Ably PubSub with Next.js"
    >
      <p className={homeStyles.description}>
        {/* Your existing description... */}
      </p>

      <section className={styles.publish}>
        <h3>Room Actions</h3>
        <div>
          <button onClick={createRoomHandler}>Create Room</button>
          {roomCode && <p>Room Code: {roomCode}</p>}
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
          <button onClick={changeColorHandler}>Change Color</button>
        </div>
      </section>

      <section>
        <h3>Test square</h3>
        <div className={styles.square} style={{ backgroundColor: squareState }}></div>
      </section>

      <section>
        <h3>Subscribe now</h3>
        <Logger logEntries={logs} />
      </section>
    </Layout>
  );
}
