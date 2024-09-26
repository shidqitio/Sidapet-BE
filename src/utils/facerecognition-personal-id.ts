import { PythonShell } from "python-shell";

interface CallBackFaceRecognitionPersonalId {
  message: string;
  similarity: boolean;
  distance_presentage: number;
  distance_point: number;
}

const faceRecognitionPernosalId = async (
  soruce_file: string
): Promise<CallBackFaceRecognitionPersonalId | null> => {
  try {
    const res = await PythonShell.run("src/python/facerecognitionpersonalid.py", {
      args: [soruce_file],
    });
    if (res.length > 0) {
      return {
        message: res[0],
        similarity: res[1],
        distance_presentage: res[2],
        distance_point: res[3],
      };
    }
    return null;
  } catch (err) {
    throw err;
  }
};

export default faceRecognitionPernosalId