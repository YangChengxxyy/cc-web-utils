import { AxiosResponse } from "axios";
import { message } from "antd";

export default async (
  download: (args: {
    responseType: "blob";
  }) => Promise<AxiosResponse<Blob, any>>,
  fileName?: string,
) => {
  const originRes = await download({
    responseType: "blob",
  });
  const res = originRes.data;
  const originFileName =
    decodeURIComponent(
      originRes.headers["content-disposition"]?.split("filename=")[1],
    ) ||
    fileName ||
    "download";
  try {
    const json = JSON.parse(await res.text());
    if (json.code !== 0 && json.message) {
      message.error(json.message);
    }
  } catch {
    const blob = new Blob([res]);

    const objectURL = URL.createObjectURL(blob);
    let btn: HTMLAnchorElement | null = document.createElement("a");
    btn.href = objectURL;
    btn.download = originFileName;
    btn.click();
    URL.revokeObjectURL(objectURL);
    btn = null;
  }
};
