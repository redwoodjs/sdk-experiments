import { RequestInfo } from "rwsdk/worker";
import { Fraction } from "fraction.js";

export function Home({ ctx }: RequestInfo) {
  return (
    <div>
      <h1>Hello World {new Fraction(0.5).toString()}</h1>
    </div>
  );
}
