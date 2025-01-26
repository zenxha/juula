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

def start_ffmpeg_pipe(url):
    """Starts an FFmpeg process and pipes audio data."""
    ffmpeg_command = [
        "ffmpeg",
        "-i", url,
        "-vn",  # Disable video
        "-f", "flac",  # Google Speech-to-Text prefers FLAC
        "pipe:1",
    ]
    print(f"Running FFmpeg command: {' '.join(ffmpeg_command)}")
    return subprocess.Popen(
        ffmpeg_command,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,  # Capture errors
        bufsize=10**6,
    )


async def stream_to_google_speech(websocket: WebSocket, ffmpeg_proc, language_code="ja-JP"):
    """Streams audio from FFmpeg to Google Cloud Speech-to-Text and sends transcriptions."""
    client = speech.SpeechClient()

    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.FLAC,
        sample_rate_hertz=16000,
        language_code=language_code,
    )
    streaming_config = speech.StreamingRecognitionConfig(config=config, interim_results=True)

    # The function should take ffmpeg_proc as an argument
    def generate_audio_chunks(ffmpeg_proc):
        """Generator that yields audio chunks from FFmpeg."""
        bytes_read = 0
        while True:
            chunk = ffmpeg_proc.stdout.read(4096)  # Read 4KB chunks
            if not chunk:
                error_message = ffmpeg_proc.stderr.read().decode()
                print(f"No more audio data from FFmpeg. Errors: {error_message}")
                break
            bytes_read += len(chunk)
            print(f"Read chunk: {len(chunk)} bytes, Total bytes: {bytes_read}")
            yield chunk

    # Create requests from the chunks
    requests = (
        speech.StreamingRecognizeRequest(audio_content=chunk)
        for chunk in generate_audio_chunks(ffmpeg_proc)  # Pass ffmpeg_proc here
    )

    try:
        responses = client.streaming_recognize(config=streaming_config, requests=requests)

        async for response in responses:
            for result in response.results:
                if result.alternatives:
                    transcription = result.alternatives[0].transcript
                    print(f"Transcription: {transcription}")
                    await websocket.send_text(transcription)

    except Exception as e:
        print(f"Error during streaming: {e}")
    finally:
        ffmpeg_proc.terminate()


@app.websocket("/ws/transcribe/{stream_name}")
async def websocket_transcribe(websocket: WebSocket, stream_name: str):
    if stream_name not in STREAMS:
        await websocket.close(code=1003)
        raise HTTPException(status_code=404, detail="Stream not found")

    await websocket.accept()

    url = STREAMS[stream_name]
    print(f"Pulling audio from stream: {url}")
    ffmpeg_proc = start_ffmpeg_pipe(url)

    try:
        await stream_to_google_speech(websocket, ffmpeg_proc)
    except WebSocketDisconnect:
        print(f"Client disconnected from {stream_name}")
    except Exception as e:
        print(f"Unexpected error: {e}")
    finally:
        ffmpeg_proc.terminate()