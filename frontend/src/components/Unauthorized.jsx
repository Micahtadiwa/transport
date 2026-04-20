import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Access denied</h2>
      <p>You do not have permission to view this page.</p>
      <Link to="/dashboard">Back to dashboard</Link>
    </div>
  );
}

export default Unauthorized;
