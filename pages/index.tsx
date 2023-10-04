import { AnimatePresence, motion } from "framer-motion";
import { v4 as uuid } from "uuid";
import Link from "next/link";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import Image from "next/image";
import { getTextToSpeech } from "@/services/eleven-labs";
import { convertBinaryAudioToMP3 } from "../helper";
import { questionsArr } from "@/constants/questions";
import { useSelector } from "react-redux";
import { StoreState } from "@/redux/types";

const questions = [
  {
    id: 1,
    name: "Behavioral",
    description: "behavior oriented interview (F2F HR)",
    difficulty: "Easy",
  },
  {
    id: 2,
    name: "Technical",
    description: "technical interview",
    difficulty: "Medium",
  },
  
  {
    id: 3,
    name: "Technical & Behavioral",
    description: "2-in-1 generic interview",
    difficulty: "Medium",
  },
];

const interviewers = [
  {
    id: "Shreesh",
    name: "Shreesh",
    description: "Software Engineering",
    level: "L4",
  },
  {
    id: "Akash",
    name: "Akash",
    description: "Software Engineering & Management",
    level: "L5",
  },
  {
    id: "Ankit",
    name: "Ankit",
    description: "Software Engineering & Architecture",
    level: "L7",
  },
];

const ffmpeg = createFFmpeg({
  // corePath: `http://localhost:3000/ffmpeg/dist/ffmpeg-core.js`,
  // I've included a default import above (and files in the public directory), but you can also use a CDN like this:
  corePath: "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
  log: true,
});

export default function MockHomePage() {
  const profile = useSelector((store: StoreState) => store.profile);
  const [selected, setSelected] = useState(questions[0]);
  const [selectedInterviewer, setSelectedInterviewer] = useState(
    interviewers[0]
  );
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const webcamRef = useRef<Webcam | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [seconds, setSeconds] = useState(150);
  const [videoEnded, setVideoEnded] = useState(false);
  const [recordingPermission, setRecordingPermission] = useState(true);
  const [cameraLoaded, setCameraLoaded] = useState(false);
  const vidRef = useRef<HTMLVideoElement>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("Processing");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [generatedFeedback, setGeneratedFeedback] = useState("");

  const [message, setMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [messagesArr, setMessagesArr] = useState<any[]>([]);
  const [knowMore, setKnowMore] = useState(false);
  const [playAudio, setPlayAudio] = useState(false);
  const [utterance, setUtterance] = useState<any>(null);
  const [play, setPlay] = useState(false);

  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioResponse, setAudioResponse] = useState<any>(null);
  const processedFeedback = generatedFeedback.replace(/(- [^:]+:)/g, "\n$1");
  const [newQuestion, setNewQuestion] = useState("");
  const [questionCount, setQuestionCount] = useState(1);
  const totalQuestions = 5;

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
  }, []);

  useEffect(() => {
    if (videoEnded) {
      const element = document.getElementById("startTimer");

      if (element) {
        element.style.display = "flex";
      }

      setCapturing(true);
      // setIsVisible(false);

      mediaRecorderRef.current = new MediaRecorder(
        webcamRef?.current?.stream as MediaStream
      );
      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        handleDataAvailable
      );
      mediaRecorderRef.current.start();
    }
  }, [videoEnded, webcamRef, setCapturing, mediaRecorderRef]);

  const handleStartCaptureClick = useCallback(() => {
    // const startTimer = document.getElementById("startTimer");
    // if (startTimer) {
    //   startTimer.style.display = "none";
    // }
    setVideoEnded(true);
    // setCapturing(true);
    // if (vidRef.current) {
    //   vidRef.current.play();
    //   // setVideoEnded(true);
    // }
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = useCallback(
    ({ data }: BlobEvent) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  useEffect(() => {
    let timer: any = null;
    if (capturing) {
      timer = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
      if (seconds === 0) {
        handleStopCaptureClick();
        setCapturing(false);
        setSeconds(0);
      }
    }
    return () => {
      clearInterval(timer);
    };
  });

  // console.log("capturing", capturing);

  const handleDownload = async () => {
    if (recordedChunks.length) {
      setSubmitting(true);
      setStatus("Processing");

      const file = new Blob(recordedChunks, {
        type: `video/webm`,
      });

      const unique_id = uuid();

      // This checks if ffmpeg is loaded
      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
      }

      // This writes the file to memory, removes the video, and converts the audio to mp3
      ffmpeg.FS("writeFile", `${unique_id}.webm`, await fetchFile(file));
      await ffmpeg.run(
        "-i",
        `${unique_id}.webm`,
        "-vn",
        "-acodec",
        "libmp3lame",
        "-ac",
        "1",
        "-ar",
        "16000",
        "-f",
        "mp3",
        `${unique_id}.mp3`
      );

      // This reads the converted file from the file system
      const fileData = ffmpeg.FS("readFile", `${unique_id}.mp3`);
      // This creates a new file from the raw data
      const output = new File([fileData.buffer], `${unique_id}.mp3`, {
        type: "audio/mp3",
      });

      const formData = new FormData();
      formData.append("file", output, `${unique_id}.mp3`);
      formData.append("model", "whisper-1");

      const question = newQuestion ? newQuestion : questionsArr.behavioral;

      setStatus("Transcribing");

      const upload = await fetch(
        `/api/transcribe?question=${encodeURIComponent(question)}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const results = await upload.json();

      if (upload.ok) {
        setIsSuccess(true);
        setSubmitting(false);

        if (results.error) {
          setTranscript(results.error);
        } else {
          setTranscript(results.transcript);
        }

        console.log("Uploaded successfully!");

        await Promise.allSettled([
          new Promise((resolve) => setTimeout(resolve, 800)),
        ]).then(() => {
          setCompleted(true);
          console.log("Success!");
        });

        if (results.transcript.length > 0) {
          const prompt = `Please give feedback on the following interview question: ${question} given the following transcript: ${
            results.transcript
          }. You are ${
            selectedInterviewer?.name
          }, a world-class developer and mentor, specializing in technical and behavioral interviews. Students will share the answer as response where you have to provide immediate, comprehensive, and descriptive feedback in a written summary format. The summary will break down the following areas. You are presently interviewing the student named:${
            profile?.basic_details.first_name
          }. Address student by his/her name only.
          ${`Technical Parameters
          Evaluate the relevance, accuracy, and depth of knowledge demonstrated in the student's answers.
          Soft Skill Parameters
          Assess the clarity of communication, tone and pitch, pace of speech, and confidence displayed during the interview.
          Overall Impression Parameters
          Comment on the student's engagement, time management, professionalism, and self-awareness.
          Conclude with an overall summary that includes a minimum of 250 words, combining all aspects evaluated, along with suggestions and tailored action items for improvement. The mock interview will consist of a mix of technical and behavioral questions. Don't include exact line: Evaluate the relevance, accuracy, and depth of knowledge demonstrated in the student's answers in place of this use Relevance as a parameter. Make sure your response is less than 2400 characters & 350 words.`}`;

          const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt,
            }),
          });

          if (!response.ok) {
            throw new Error(response.statusText);
          }

          // This data is a ReadableStream
          const data = response.body;
          if (!data) {
            return;
          }

          setGeneratedFeedback("");

          const reader = data.getReader();
          const decoder = new TextDecoder();
          let done = false;

          while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            setGeneratedFeedback((prev: any) => prev + chunkValue);
            // console.log("data", chunkValue);
          }
        }
      } else {
        console.error("Upload failed.");
      }

      setTimeout(function () {
        setRecordedChunks([]);
      }, 1500);
    }
  };

  function restartVideo() {
    setRecordedChunks([]);
    setVideoEnded(false);
    setCapturing(false);
    setCompleted(false);
    setIsVisible(true);
    setSeconds(150);
    setTranscript("");
    setGeneratedFeedback("");
    setNewQuestion("");
  }

  const videoConstraints = isDesktop
    ? { width: 1280, height: 720, facingMode: "user" }
    : { width: 480, height: 640, facingMode: "user" };

  const handleUserMedia = () => {
    setTimeout(() => {
      setLoading(false);
      setCameraLoaded(true);
    }, 1000);
  };

  useEffect(() => {
    if (play) {
      handlePlay();
    }
  }, [play]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(aiResponse);

    setUtterance(u);

    return () => {
      synth.cancel();
    };
  }, [aiResponse]);

  const handlePlay = () => {
    const synth = window.speechSynthesis;
    synth.speak(utterance);
    setPlay(false);
  };

  useEffect(() => {
    if (playAudio) {
      fetchVoiceForFeedback();
    }
  }, [playAudio]);

  const fetchVoiceForFeedback = async () => {
    if (generatedFeedback) {
      // let body = {
      //   text: generatedFeedback,
      //   model_id: "eleven_monolingual_v1",
      //   voice_settings: {
      //     stability: 0.5,
      //     similarity_boost: 0.5,
      //   },
      // };
      // const response = await getTextToSpeech("DqjMt2X0sFO9GxWG5DBe", body);
      // setAudioResponse(response);
      // Fetch the audio from the server-side proxy route
      fetch("/api/audio")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.blob();
        })
        .then((blob) => {
          setAudioResponse(blob);
          console.log("blob =====>", blob);
          const data = URL.createObjectURL(blob);
          setAudioURL(data);
          //   convertBinaryAudioToMP3(audioResponse)
          //     .then((url) => setAudioURL(url))
          //     .catch((error) =>
          //       console.error("Error converting binary audio to MP3:", error)
          //     );
        })
        .catch((error) => console.error("Error fetching audio:", error));
    }
  };

  const generateNewQuestion = async () => {
    if (transcript.length > 0 && generatedFeedback.length > 0) {
      const prompt = `You are ${
        selectedInterviewer?.name
      }, a world-class developer and mentor, specializing in technical and behavioral interviews. Students will share the answer as response where you have to provide immediate, comprehensive, and descriptive feedback in a written summary format. You are presently interviewing the student named:${
        profile?.basic_details?.first_name
      }. Address student by his/her name only. Generate a new question based on information provided in ${
        profile?.basic_details?.first_name
      }${`'s`} last response: ${transcript}, type of question should be ${
        selected.name
      }. Share the question only in your response. It should be a short and to the point question. ${
        questionCount === totalQuestions - 1
          ? "This has to be the last question of the interview. Ask accordingly, question should conclude the interview."
          : ""
      }`;

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          prompt,
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      // This data is a ReadableStream
      const data = response.body;
      if (!data) {
        return;
      }

      setGeneratedFeedback("");
      if (questionCount <= totalQuestions) setQuestionCount(questionCount + 1);
      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        setNewQuestion((prev: any) => prev + chunkValue);
        // console.log("data", chunkValue);
      }
    }
  };

  const cameraNotLoadedJSX = () => {
    return (
      <div className="text-white absolute top-1/2 left-1/2 z-20 flex items-center">
        <svg
          className="animate-spin h-4 w-4 text-white mx-auto my-0.5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth={3}
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  };

  // useEffect(() => {

  // }, [audioResponse]);

  // console.log("audio URL", audioResponse, audioURL);

  return (
    <AnimatePresence>
      <>
        {step === 3 ? (
          <div className="w-full min-h-screen flex flex-col px-4 pt-2 pb-8 md:px-8 md:py-2 bg-[#FCFCFC] relative overflow-x-hidden">
            <div className="h-full w-full items-center flex flex-col mt-5">
              {recordingPermission ? (
                <div className="w-full flex flex-col max-w-[1080px] mx-auto justify-center">
                  <h2 className="text-2xl font-semibold text-left text-[#1D2B3A] mb-2">
                    <span className="mr-2">Ques {questionCount}:</span>
                    {newQuestion ? newQuestion : questionsArr.behavioral}
                  </h2>

                  <motion.div
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.35,
                      ease: [0.075, 0.82, 0.965, 1],
                    }}
                    className="relative aspect-[16/9] w-full max-w-[1080px] overflow-hidden bg-[#1D2B3A] rounded-lg ring-1 ring-gray-900/5 shadow-md"
                  >
                    {!cameraLoaded && cameraNotLoadedJSX()}
                    <div className="relative z-10 h-full w-full rounded-lg">
                      {isVisible && (
                        <div className="block absolute top-[10px] sm:top-[20px] lg:top-[40px] left-auto right-[10px] sm:right-[20px] md:right-10 h-[80px] sm:h-[140px] md:h-[180px] aspect-video rounded z-20">
                          <div className="absolute top-[75%] lg:top-[75%] z-20 interviewer-name-on-video">
                            {selectedInterviewer.name}
                          </div>
                          <div className="h-full w-full aspect-video rounded md:rounded-lg lg:rounded-xl">
                            <Image
                              width={100}
                              height={50}
                              id="question-video"
                              alt={selectedInterviewer.name}
                              className="h-full object-cover w-full rounded-md md:rounded-[12px] aspect-video"
                              crossOrigin="anonymous"
                              src={`/interviewers/${selectedInterviewer.name.toLowerCase()}.png`}
                            />
                          </div>
                        </div>
                      )}
                      {!completed ? (
                        <Webcam
                          mirrored
                          audio
                          muted
                          ref={webcamRef}
                          videoConstraints={videoConstraints}
                          onUserMedia={handleUserMedia}
                          onUserMediaError={(error) => {
                            setRecordingPermission(false);
                          }}
                          className="absolute z-10 min-h-[100%] min-w-[100%] h-auto w-auto object-cover"
                        />
                      ) : (
                        <video
                          className="w-full h-full rounded-lg"
                          controls
                          crossOrigin="anonymous"
                          autoPlay
                        >
                          <source
                            src={URL.createObjectURL(
                              new Blob(recordedChunks, { type: "video/mp4" })
                            )}
                            type="video/mp4"
                          />
                        </video>
                      )}
                    </div>
                    {loading && (
                      <div className="absolute flex h-full w-full items-center justify-center">
                        <div className="relative h-[112px] w-[112px] rounded-lg object-cover text-[2rem]">
                          <div className="flex h-[112px] w-[112px] items-center justify-center rounded-[0.5rem] bg-[#4171d8] !text-white">
                            Loading...
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                  {transcript?.length > 0 && generatedFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.5,
                        duration: 0.15,
                        ease: [0.23, 1, 0.82, 1],
                      }}
                      className="mt-8 flex flex-col"
                    >
                      <div>
                        <h2 className="text-xl font-semibold text-left text-[#1D2B3A] mb-2">
                          {profile.basic_details.first_name?.split(" ")[0]}
                          {`’s`} Answer:
                        </h2>
                        <div className="mt-2 page-card">
                          <p className="prose prose-sm max-w-none">
                            {transcript.length > 0
                              ? transcript
                              : "Don't think you said anything. Want to try again?"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h2 className="text-xl font-semibold text-left text-[#1D2B3A] mb-2">
                          {selectedInterviewer.name?.split(" ")[0]}
                          {`’s`} Feedback:
                        </h2>
                        <div className="mt-2 page-card">
                          <p className="prose prose-sm max-w-none">
                            {processedFeedback
                              .split("\n")
                              .map((line, index) => (
                                <React.Fragment key={index}>
                                  {index > 0 && <br />}
                                  {line}
                                </React.Fragment>
                              ))}
                          </p>
                        </div>
                        {/* <button
                          onClick={() => {
                            setPlayAudio(true);
                          }}
                          className="primary-btn d-flex justify-content-between active:scale-95 scale-100 duration-75 mt-4"
                        >
                          <span> Play ? </span>
                        </button> */}

                        {audioURL && audioResponse && (
                          <audio controls>
                            <source src={audioURL} type="audio/mp3" />
                            Your browser does not support the audio element.
                          </audio>
                        )}
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.5,
                      duration: 0.15,
                      ease: [0.23, 1, 0.82, 1],
                    }}
                    className="flex flex-row space-x-1 items-center"
                  >
                    <div className="flex gap-[15px] justify-end mt-8 mb-8">
                      {!transcript.length && !generatedFeedback.length && (
                        <div>
                          <button
                            onClick={
                              capturing
                                ? recordedChunks.length > 0
                                  ? () => restartVideo()
                                  : () => handleStopCaptureClick()
                                : () => handleStartCaptureClick()
                            }
                            className={`primary-btn d-flex justify-content-between active:scale-95 scale-100 duration-75 ${
                              capturing ? "" : "start"
                            }`}
                          >
                            <span>
                              {" "}
                              {capturing || recordedChunks.length > 0
                                ? recordedChunks.length > 0
                                  ? "Restart"
                                  : "Stop"
                                : "Start"}{" "}
                            </span>
                          </button>
                        </div>
                      )}

                      <div>
                        <button
                          onClick={
                            generatedFeedback
                              ? () => {
                                  restartVideo();
                                  generateNewQuestion();
                                }
                              : () => handleDownload()
                          }
                          disabled={
                            !generatedFeedback
                              ? isSubmitting
                              : questionCount === totalQuestions
                          }
                          className={`secondary-btn d-flex justify-content-between active:scale-95 scale-100 duration-75 ${
                            !generatedFeedback
                              ? isSubmitting
                              : questionCount === totalQuestions
                              ? "disabled"
                              : ""
                          }`}
                        >
                          {!generatedFeedback
                            ? isSubmitting
                              ? status
                              : "Process Transcript"
                            : "Next Question"}
                        </button>
                      </div>
                      <div>
                        <button
                          onClick={() => {
                            setStep(1);
                            setSelected(questions[0]);
                            setSelectedInterviewer(interviewers[0]);
                            restartVideo();
                          }}
                          className="primary-btn d-flex justify-content-between active:scale-95 scale-100 duration-75 end"
                        >
                          <span> End Interview </span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="w-full flex flex-col max-w-[1080px] mx-auto justify-center">
                  <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.35,
                      ease: [0.075, 0.82, 0.165, 1],
                    }}
                    className="relative md:aspect-[16/9] w-full max-w-[1080px] overflow-hidden bg-[#1D2B3A] rounded-lg ring-1 ring-gray-900/5 shadow-md flex flex-col items-center justify-center"
                  >
                    <p className="text-white font-medium text-lg text-center max-w-3xl">
                      Camera permission is denied. We don{`'`}t store your
                      attempts anywhere, but we understand not wanting to give
                      us access to your camera. Try again by opening this page
                      in an incognito window {`(`}or enable permissions in your
                      browser settings{`)`}.
                    </p>
                  </motion.div>
                  <div className="flex flex-row space-x-4 mt-8 justify-end">
                    <button
                      onClick={() => setStep(1)}
                      className="primary-btn d-flex justify-content-between active:scale-95 scale-100 duration-75"
                      style={{
                        boxShadow: "0 1px 1px #0c192714, 0 1px 3px #0c192724",
                      }}
                    >
                      Restart demo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row w-full md:overflow-hidden">
            <div className="w-full min-h-[60vh] md:w-1/2 md:h-screen flex flex-col px-4 pt-2 pb-8 md:px-0 md:py-2 bg-[#FAF9F6] justify-center">
              <div className="items-center justify-center flex flex-col">
                <Image
                  width={250}
                  height={250}
                  src="/svgs/kodnest-logo.png"
                  alt="app-logo"
                />
              </div>
              <div className="text-right w-100">
                <p className="text-2xl font-bold text-right mr-4">
                  Mock Interviews {">>"}
                </p>
                <Webcam
                  mirrored
                  videoConstraints={videoConstraints}
                  onUserMediaError={(error) => {
                    setRecordingPermission(false);
                  }}
                />
              </div>
            </div>
            <div className="w-full h-[40vh] md:w-1/2 md:h-screen bg-[#f5f5f7] overflow-y-scroll d-flex align-items-center justify-content-center pt-[250px] pb-[100px]">
              {step === 1 ? (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  key="step-1"
                  transition={{
                    duration: 0.95,
                    ease: [0.165, 0.84, 0.44, 1],
                  }}
                  className="max-w-lg mx-auto px-4 lg:px-0"
                >
                  <h2 className="text-4xl font-bold">Select a question type</h2>
                  <p className="text-[14px] leading-[20px] font-normal my-4">
                    We have hundreds of questions from top tech companies.
                    Choose a type to get started.
                  </p>
                  <div>
                    <div className="row">
                      {questions?.map((question: any) => (
                        <div key={question?.id} className="col-12">
                          <div
                            className={`option-container mb-4 ${
                              selected?.id === question?.id ? "active" : ""
                            }`}
                            onClick={() => setSelected(question)}
                          >
                            <p className="font-medium mb-0">{question?.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-[15px] justify-end mt-8">
                    <div>
                      <button
                        onClick={() => {
                          setStep(2);
                        }}
                        className="primary-btn d-flex justify-content-between active:scale-95 scale-100 duration-75"
                      >
                        <span> Continue </span>
                        <svg
                          className="w-5 h-6 ml-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.75 6.75L19.25 12L13.75 17.25"
                            stroke="#FFF"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19 12H4.75"
                            stroke="#FFF"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : step === 2 ? (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  key="step-2"
                  transition={{
                    duration: 0.95,
                    ease: [0.165, 0.84, 0.44, 1],
                  }}
                  className="max-w-lg mx-auto px-4 lg:px-0"
                >
                  <h2 className="text-4xl font-bold">And an Interviewer</h2>
                  <p className="text-[14px] leading-[20px] font-normal my-4">
                    Choose whoever makes you feel comfortable. You can always
                    try again with another one.
                  </p>
                  <div className="row">
                    {interviewers?.map((interviewer: any) => (
                      <div key={interviewer?.id} className="col-12">
                        <div
                          className={`option-container mb-4 ${
                            selectedInterviewer?.id === interviewer?.id
                              ? "active"
                              : ""
                          }`}
                          onClick={() => setSelectedInterviewer(interviewer)}
                        >
                          <p className="font-medium mb-0">
                            {interviewer?.name}
                          </p>
                          <p className="block mb-0 description">
                            {interviewer.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-[15px] justify-end mt-8">
                    <div>
                      <button
                        onClick={() => setStep(1)}
                        className="secondary-btn d-flex justify-content-between active:scale-95 scale-100 duration-75"
                      >
                        Previous step
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          setStep(3);
                        }}
                        className="primary-btn d-flex justify-content-between active:scale-95 scale-100 duration-75"
                      >
                        <span> Continue </span>
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.75 6.75L19.25 12L13.75 17.25"
                            stroke="#FFF"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19 12H4.75"
                            stroke="#FFF"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <p>Step 3</p>
              )}
            </div>
          </div>
        )}
      </>
    </AnimatePresence>
  );
}

MockHomePage.authGuard = true;
