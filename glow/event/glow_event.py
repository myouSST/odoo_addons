import asyncio

import stomp
import websocket


class MyListener(stomp.ConnectionListener):
    def on_error(self, headers, message):
        print('Received an error "%s"' % message)
    def on_message(self, headers, message):
        print('Received a message "%s"' % message)

async def websocket_client(uri):
    websocket.enableTrace(True)
    ws = websocket.WebSocket()
    headers = {
        "Origin": "http://localhost:8080",
        "Sec-WebSocket-Key": "ELJv6/jM4N0/bzo+Oc1G/w==",
        "Sec-WebSocket-Version": "13",
        "Connection": "Upgrade",
    }

    async with ws.connect(uri, headers=headers) as websocket2:
        conn = stomp.Connection12([('localhost', 8080)], auto_content_length=True)
        conn.set_listener('', MyListener())
        conn.set_listener('debug', stomp.PrintingListener())

        # Start the connection
        conn.connect(wait=True)

        # Subscribe to the channel
        conn.subscribe(destination='/topic/glowStatus', id=1, ack='auto')

        # Send a message
        conn.send(body='Hello, World!', destination='/app/glow/on')

        # Receive a message
        response = await websocket2.recv()
        print(f"Received from server: {response}")

        # Disconnect
        conn.disconnect()


def update_model(env, data):
    glow_record = env['glow'].search([('name', '=', data.get('name'))])
    if glow_record:
        glow_record.write({
            'switch': data.get('switch'),
            'description': data.get('description'),
            'sequence': data.get('sequence'),
            'group_id': data.get('group_id')
        })


def start_websocket_client(env):
    print('Starting Websocket Client')
    uri = "ws://localhost:8080/ws/glow"
    asyncio.run(websocket_client(uri))
