import { BrowserRouter as Router } from "react-router-dom";

import RouteHandler from "../routes/route-handler";

function Root() {
  return (
    <Router>
      <RouteHandler />
    </Router>
  );
}

export default Root;
