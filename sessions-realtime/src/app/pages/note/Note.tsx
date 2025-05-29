import { Editor } from "./Editor";
import { getContent } from "./functions";
import { RequestInfo } from "rwsdk/worker";

const Note = async ({ params }: RequestInfo<{ key: string }>) => {
  const key = params.key;
  const content = await getContent(key);
  return <Editor noteKey={key} initialContent={content} />;
};

export { Note };
