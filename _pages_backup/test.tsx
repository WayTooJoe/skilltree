// pages/test.tsx
import type { NextPage } from "next";

const TestPage: NextPage = () => {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#020617",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "32px",
      }}
    >
      Test route works ✅ (pages router)
    </main>
  );
};

export default TestPage;
