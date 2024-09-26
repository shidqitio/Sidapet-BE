import { PythonShell } from "python-shell";

interface Callback {
  image_base64: string;
}

 const decryptImage = async (
  file_source: string,
  key: any
): Promise<Callback | null> => {
  try {
    const res = await PythonShell.run("src/python/decryptimage.py", {
      args: [file_source, key],
    });
    if (res.length > 0) {
      return {
        image_base64: `data:image/jpeg;base64,${res[0]}`,
      };
    }
    return null;
  } catch (err) {
    throw err;
  }
};

export default decryptImage