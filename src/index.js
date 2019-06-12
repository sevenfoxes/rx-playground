import { takeRight } from "lodash";
import { ajax } from "rxjs/ajax";
import { map, pluck, filter, mergeMap, scan, catchError } from "rxjs/operators";
import { of, timer } from "rxjs";

const startUp = { msg: "start shit" };
const successAction = payload => ({ msg: "a winner is you", payload });
const failAction = payload => ({ msg: "your a fail", payload });

const source = action =>
  timer(0, 1000).pipe(
    mergeMap(a =>
      ajax("https://jsonplaceholder.typicode.com/posts?userId=1").pipe(
        pluck("response"),
        catchError(failAction)
      )
    ),
    scan((allResponses, currentResponse) => [...allResponses, currentResponse], []),
    map(res => {
      if (res.length === 1) {
        return res;
      }

      const last = takeRight(res, 2);

      if (last[0].length !== last[1].length) {
        return last[1];
      }

      return [];
    }),
    filter(payload => payload.length),
    map(a => successAction(a))
  );

source(of(startUp)).subscribe(console.log);
