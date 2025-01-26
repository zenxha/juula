import subprocess
# from openai import OpenAI


from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
import threading
import os
from dotenv import load_dotenv

load_dotenv()

# client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
app = FastAPI()

# Replace with your OpenAI API Key


STREAMS = {
    "NHK_G": "http://vthanh.utako.moe/NHK_G/index.m3u8",
    "NHK_E": "http://vthanh.utako.moe/NHK_E/index.m3u8",
    "NTV": "http://vthanh.utako.moe/Nippon_TV/index.m3u8",
    "TBS": "http://vthanh.utako.moe/TBS/index.m3u8",
    "Fuji_TV": "http://vthanh.utako.moe/Fuji_TV/index.m3u8",
    "TV_Asahi": "http://vthanh.utako.moe/TV_Asahi/index.m3u8",
    "TV_Tokyo": "http://vthanh.utako.moe/TV_Tokyo/index.m3u8",
    "Tokyo_MX": "http://vthanh.utako.moe/Tokyo_MX/index.m3u8",
    "NHK_BS": "http://vthanh.utako.moe/NHK_BS/index.m3u8", 
    "BS11": "http://vthanh.utako.moe/BS11/index.m3u8",
    "Animax": "http://vthanh.utako.moe/Animax/index.m3u8"

    # More
}

ffmpeg_processes = {}

def start_ffmpeg_process(name, url, output_file):
    """Starts an FFmpeg process for a given stream."""
    ffmpeg_command = [
        "ffmpeg",
        "-i", url,
        "-vn",  # Disable video
        "-acodec", "pcm_s16le",
        "-ar", "16000",
        "-ac", "1",
        output_file,
    ]
    # Run FFmpeg in a subprocess
    process = subprocess.Popen(ffmpeg_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    ffmpeg_processes[name] = process

def stop_ffmpeg_process(name):
    """Stops an FFmpeg process for a given stream."""
    process = ffmpeg_processes.pop(name, None)
    if process:
        process.terminate()

@app.on_event("shutdown")
def cleanup_streams():
    """Stops all FFmpeg processes on shutdown."""
    for name in list(ffmpeg_processes.keys()):
        stop_ffmpeg_process(name)

@app.get("/streams")
def get_streams():
    """Returns a list of available streams."""
    return list(STREAMS.keys())

@app.websocket("/ws/transcribe/{stream_name}")
async def websocket_transcribe(websocket: WebSocket, stream_name: str):
    print(f"Client connected to {stream_name}")
    if stream_name not in STREAMS:
        print(f"Stream {stream_name} not found")
        await websocket.close(code=1003)
        raise HTTPException(status_code=404, detail="Stream not found")

    audio_file = f"{stream_name}.wav"

    # Start FFmpeg process if not already running
    if stream_name not in ffmpeg_processes:
        print(f"Starting FFmpeg process for {stream_name}")
        threading.Thread(
            target=start_ffmpeg_process,
            args=(stream_name, STREAMS[stream_name], audio_file),
            daemon=True,
        ).start()

    # Accept the WebSocket connection
    await websocket.accept()
    print(f"Established WebSocket connection")
    try:
        while True:
            # Transcribe audio and send real-time updates to the frontend
            try:
                with open(audio_file, "rb") as audio:
                    response = client.audio.transcribe("whisper-1", audio)
                    await websocket.send_json({"transcription": response.text})
            except FileNotFoundError:
                await websocket.send_json({"error": "Audio file not ready yet"})
            except Exception as e:
                await websocket.send_json({"error": str(e)})
    except WebSocketDisconnect:
        print(f"Client disconnected from {stream_name}")