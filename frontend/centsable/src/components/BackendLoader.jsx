import { ClipLoader } from "react-spinners";

export default function BackendLoader() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <ClipLoader size={40} />
      <p>Starting server...</p>
    </div>
  );
}
