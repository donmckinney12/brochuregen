from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import List, Dict
import json

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        # active_connections: {org_id: [websocket1, websocket2, ...]}
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, org_id: str):
        await websocket.accept()
        if org_id not in self.active_connections:
            self.active_connections[org_id] = []
        self.active_connections[org_id].append(websocket)

    def disconnect(self, websocket: WebSocket, org_id: str):
        if org_id in self.active_connections:
            self.active_connections[org_id].remove(websocket)
            if not self.active_connections[org_id]:
                del self.active_connections[org_id]

    async def broadcast_to_org(self, message: str, org_id: str, sender: WebSocket):
        if org_id in self.active_connections:
            for connection in self.active_connections[org_id]:
                if connection != sender:
                    await connection.send_text(message)

manager = ConnectionManager()

@router.websocket("/ws/{org_id}")
async def websocket_endpoint(websocket: WebSocket, org_id: str):
    await manager.connect(websocket, org_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Broadcast the received message to everyone else in the same org
            await manager.broadcast_to_org(data, org_id, websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket, org_id)
