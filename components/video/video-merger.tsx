import React, { useEffect, useRef, useState } from "react";

interface VideoMergerProps {
  videoBlobs: Blob[];
}

const VideoMerger: React.FC<VideoMergerProps> = ({ videoBlobs }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);

  useEffect(() => {
    const mergeVideos = async () => {
      if (videoBlobs.length === 0) return;

      const mediaStream = new MediaStream();

      // Create video elements and add them to the mediaStream
      for (const blob of videoBlobs) {
        const videoElement = document.createElement("video");
        videoElement.src = URL.createObjectURL(blob);
        videoElement.muted = true;
        videoElement.autoplay = true;

        // Wait for the video to load and add its track to the mediaStream
        await videoElement.play();
        // const tracks = videoElement?.captureStream().getTracks();
        // if (tracks.length > 0) {
        //   mediaStream.addTrack(tracks[0]);
        // }
      }

      // Create a MediaRecorder to record the merged video
      const mediaRecorder = new MediaRecorder(mediaStream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Create a blob from the recorded chunks
        const mergedBlob = new Blob(chunks, { type: "video/webm" });
        setMergedBlob(mergedBlob);
      };

      mediaRecorder.start();

      // Stop the recorder after a few seconds (you can adjust the duration)
      setTimeout(() => {
        mediaRecorder.stop();
      }, 5000); // Example: Stop recording after 5 seconds
    };

    mergeVideos();
  }, [videoBlobs]);

  return (
    <div>
      <video
        ref={videoRef}
        controls
        src={mergedBlob ? URL.createObjectURL(mergedBlob) : undefined}
      ></video>
    </div>
  );
};

export default VideoMerger;
