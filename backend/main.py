import asyncio
import os
import threading
import subprocess
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from google.cloud import speech
from dotenv import load_dotenv

load_dotenv()

# client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
app = FastAPI()



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
active_clients = {}

def start_ffmpeg_pipe(url):
    """Starts an FFmpeg process and pipes audio data."""
    ffmpeg_command = [
        "ffmpeg",
        "-i", url,
        "-vn",  # Disable video
        "-f", "flac",  # Google Speech-to-Text prefers FLAC
        "-ar", "16000",  # Resample to 16 kHz
        "-ac", "1",  # Mono audio

        "pipe:1",
    ]
    print(f"Running FFmpeg command: {' '.join(ffmpeg_command)}")
    return subprocess.Popen(
        ffmpeg_command,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        bufsize=10**6,
    )

def stop_ffmpeg_process(stream_name):
    """Stops an FFmpeg process for a given stream."""
    process = ffmpeg_processes.pop(stream_name, None)
    if process:
        print(f"Terminating FFmpeg process for {stream_name}")
        process.terminate()

@app.on_event("shutdown")
def cleanup_streams():
    """Stops all FFmpeg processes on shutdown."""
    for name in list(ffmpeg_processes.keys()):
        stop_ffmpeg_process(name)

async def stream_to_google_speech(websocket: WebSocket, ffmpeg_proc, stream_name, language_code="ja-JP"):
    """Streams audio from FFmpeg to Google Cloud Speech-to-Text and sends transcriptions."""
    client = speech.SpeechClient()

    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.FLAC,
        sample_rate_hertz=16000,
        language_code=language_code,
    )
    streaming_config = speech.StreamingRecognitionConfig(config=config, interim_results=True)

    def generate_audio_chunks():
        """Generator that yields audio chunks from FFmpeg."""
        while True:
            print("Reading audio chunk from FFmpeg")
            chunk = ffmpeg_proc.stdout.read(4096)  # Read 4KB chunks
            print(f"Read chunk: {len(chunk)} bytes")
            if not chunk:
                print(f"No more audio data from FFmpeg. Errors: {error_message}")

                break
            bytes_read += len(chunk)
            print(f"Read chunk: {len(chunk)} bytes, Total bytes: {bytes_read}")
            yield chunk

    try:
        requests = (
            speech.StreamingRecognizeRequest(audio_content=chunk)
            for chunk in generate_audio_chunks()
        )
        responses = client.streaming_recognize(config=streaming_config, requests=requests)

        async for response in responses:
            for result in response.results:
                if result.alternatives:
                    transcription = result.alternatives[0].transcript
                    await websocket.send_text(transcription)

    except Exception as e:
        print(f"Error during streaming: {e}")
    finally:
        # When all clients disconnect, stop the FFmpeg process
        active_clients[stream_name].remove(websocket)
        if not active_clients[stream_name]:
            stop_ffmpeg_process(stream_name)

@app.websocket("/ws/transcribe/{stream_name}")
async def websocket_transcribe(websocket: WebSocket, stream_name: str):
    if stream_name not in STREAMS:
        await websocket.close(code=1003)
        raise HTTPException(status_code=404, detail="Stream not found")

    # Accept the WebSocket connection
    await websocket.accept()

    # Start FFmpeg process for the stream if not already running
    if stream_name not in ffmpeg_processes:
        print(f"Starting FFmpeg process for {stream_name}")
        ffmpeg_proc = start_ffmpeg_pipe(STREAMS[stream_name])
        ffmpeg_processes[stream_name] = ffmpeg_proc
        active_clients[stream_name] = []

    # Add the WebSocket connection to the active clients for this stream
    print(f"Adding websocket to ffmpeg process for {stream_name}")
    active_clients[stream_name].append(websocket)

    try:
        # Start streaming the transcription
        await stream_to_google_speech(websocket, ffmpeg_processes[stream_name], stream_name)
    except WebSocketDisconnect:
        print(f"Client disconnected from {stream_name}")