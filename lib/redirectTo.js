import Router from "next/router";

// native -> use native code for navigating i.e. using window.location
export default function redirectTo(
  destination,
  { res, status, native = false } = {}
) {
  if (res) {
    res.writeHead(status || 302, { Location: destination });
    res.end();
  } else {
    if (native) {
      window.location = destination;
    } else {
      if (destination[0] === "/" && destination[1] !== "/") {
        Router.push(destination);
      } else {
        window.location = destination;
      }
    }
  }
}
