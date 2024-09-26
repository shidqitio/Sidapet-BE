import { PythonShell } from "python-shell";

interface CallbackEncryptImage {
  message: string;
  keypass: any;
  source_file_encrypt: string;
}

const encryptImage = async (
  source_file: string,
  source_file_encrypt: string,
  watermark_text: string
): Promise<CallbackEncryptImage | null> => {
  try {
    const givewatermark = await PythonShell.run(
      "src/python/givewatermarkimage.py",
      {
        args: [source_file, source_file_encrypt, watermark_text],
      }
    );
    if (givewatermark[0]) {
      const res = await PythonShell.run("src/python/encryptimage.py", {
        args: [source_file, source_file_encrypt],
      });
      if (res.length > 0) {
        return {
          message: res[0],
          keypass: res[1],
          source_file_encrypt: res[2],
        };
      }
    }

    return null;
  } catch (err) {
    throw err;
  }
};

export default encryptImage