from faster_whisper import WhisperModel
import sys

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

audio_path = sys.argv[1]

model = WhisperModel(
    "base",
    device="cpu",
    compute_type="int8"
)

segments, info = model.transcribe(audio_path)

result = ""

for segment in segments:
    result += segment.text + " "

# print(result.strip())
sys.stdout.buffer.write(result.strip().encode("utf-8"))