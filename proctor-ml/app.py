from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import mediapipe as mp
import base64
import json
import io
from PIL import Image

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize MediaPipe Face Detection
mp_face_detection = mp.solutions.face_detection
mp_face_mesh = mp.solutions.face_mesh
mp_drawing = mp.solutions.drawing_utils

face_detection = mp_face_detection.FaceDetection(
    model_selection=1, 
    min_detection_confidence=0.5
)

face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Initialize VAD (Voice Activity Detection)
# Note: webrtcvad requires 16-bit PCM audio at specific sample rates
# For demonstration, we'll simulate this

@app.get("/")
async def root():
    return {"message": "Proctoring ML Service"}

@app.post("/analyze-frame")
async def analyze_frame(file: UploadFile = File(...)):
    """
    Analyze a video frame for proctoring purposes
    """
    try:
        # Read the image file
        contents = await file.read()
        
        # Convert to numpy array
        nparr = np.frombuffer(contents, np.uint8)
        
        # Decode image
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return {"error": "Could not decode image"}
        
        # Convert BGR to RGB
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Analyze face detection
        face_results = face_detection.process(img_rgb)
        
        # Initialize response data
        response_data = {
            "face_count": 0,
            "multiple_faces_detected": False,
            "face_landmarks": None,
            "head_pose": None,
            "suspicion_score": 0,
            "events": []
        }
        
        # Count faces
        if face_results.detections:
            face_count = len(face_results.detections)
            response_data["face_count"] = face_count
            
            if face_count > 1:
                response_data["multiple_faces_detected"] = True
                response_data["events"].append({
                    "type": "multiple_faces",
                    "description": f"Detected {face_count} faces in frame",
                    "severity": "medium"
                })
                response_data["suspicion_score"] += 30
            
            # Analyze first face in detail
            detection = face_results.detections[0]
            bbox = detection.location_data.relative_bounding_box
            
            # Add face analysis
            response_data["events"].append({
                "type": "face_detected",
                "description": f"Face detected at ({bbox.xmin:.2f}, {bbox.ymin:.2f})",
                "severity": "info"
            })
            
            # Analyze face landmarks for head pose and eye gaze
            face_mesh_results = face_mesh.process(img_rgb)
            
            if face_mesh_results.multi_face_landmarks:
                response_data["face_landmarks"] = "detected"
                
                # For simplicity, we're not doing detailed head pose estimation
                # In a real implementation, you would use the landmarks to estimate head pose
                
                # Check for potential gaze direction
                # This is a simplified check - a real implementation would be more sophisticated
                landmarks = face_mesh_results.multi_face_landmarks[0].landmark
                
                # Get nose and eye landmarks
                nose_tip = landmarks[1]  # Nose tip
                left_eye = landmarks[159]  # Left eye upper eyelid
                right_eye = landmarks[386]  # Right eye upper eyelid
                
                # Simple check for extreme head tilt (would need more sophisticated analysis in practice)
                if abs(nose_tip.y - left_eye.y) > 0.05 or abs(nose_tip.y - right_eye.y) > 0.05:
                    response_data["events"].append({
                        "type": "head_pose",
                        "description": "Potential head tilt detected",
                        "severity": "low"
                    })
                    response_data["suspicion_score"] += 10
        
        else:
            # No face detected
            response_data["events"].append({
                "type": "no_face",
                "description": "No face detected in frame",
                "severity": "high"
            })
            response_data["suspicion_score"] += 50
        
        # Ensure suspicion score is between 0 and 100
        response_data["suspicion_score"] = min(100, max(0, response_data["suspicion_score"]))
        
        return response_data
        
    except Exception as e:
        return {"error": str(e)}

@app.post("/analyze-audio")
async def analyze_audio(
    audio_data: str = Form(...),
    sample_rate: int = Form(16000)
):
    """
    Analyze audio for proctoring purposes
    """
    try:
        # In a real implementation, you would:
        # 1. Decode the base64 audio data
        # 2. Use webrtcvad to detect voice activity
        # 3. Analyze for multiple speakers or suspicious sounds
        
        # For this example, we'll return simulated results
        response_data = {
            "voice_activity": True,
            "multiple_speakers_detected": False,
            "suspicion_score": 0,
            "events": []
        }
        
        # Simulate some analysis
        import random
        if random.random() > 0.7:
            response_data["multiple_speakers_detected"] = True
            response_data["events"].append({
                "type": "multiple_speakers",
                "description": "Multiple speakers detected in audio",
                "severity": "high"
            })
            response_data["suspicion_score"] += 40
        elif random.random() > 0.5:
            response_data["events"].append({
                "type": "background_noise",
                "description": "Background noise detected",
                "severity": "low"
            })
            response_data["suspicion_score"] += 10
            
        response_data["suspicion_score"] = min(100, max(0, response_data["suspicion_score"]))
        
        return response_data
        
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)