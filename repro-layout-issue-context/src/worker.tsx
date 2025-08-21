import { defineApp } from "rwsdk/worker";
import { render, route, prefix, layout } from "rwsdk/router";

import { Document } from "@/app/Document";
import { Home } from "@/app/pages/Home";
import { setCommonHeaders } from "@/app/headers";
import { MainLayout } from "@/app/components/layouts/MainLayout";
import { QuestionListPage } from "@/app/pages/questions/QuestionListPage";

export type AppContext = {
  user?: {
    id: string;
    email: string;
    name: string;
  } | null;
};

export default defineApp([
  setCommonHeaders(),
  ({ ctx }) => {},
  render(Document, [
    //route("/", Home),
    prefix("" /*"/questions"*/, [
      layout(MainLayout, [route("/", QuestionListPage)]),
    ]),
    //prefix("" /*"/questions"*/, [route("/", QuestionListPage)]),
  ]),
]);
