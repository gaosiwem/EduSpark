import os
import subprocess

"""Extract frames from a video file using ffmpeg.

Args:
    video_path (str): Path to the video file.
    output_dir (str): Directory to save the extracted frames.
    fps (float): Frames per second to extract.  """

def extract_frames(video_path, output_dir="frames", fps=0.5):
    os.makedirs(output_dir, exist_ok=True)
    cmd = ["ffmpeg", "-i", video_path, "-vf", f"fps={fps}", f"{output_dir}/frame_%04d.png"]
    subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return sorted(os.listdir(output_dir))