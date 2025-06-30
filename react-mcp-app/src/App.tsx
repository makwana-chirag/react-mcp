import { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");

  const handleGenerate = async () => {
    const res = await fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setCode(data.code);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>React MCP Prompt</h2>
      <textarea
        rows={4}
        style={{ width: "100%" }}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder='Describe the component you want...'
      />
      <button onClick={handleGenerate}>Generate</button>

      <pre
        style={{ background: "#f4f4f4", padding: "10px", marginTop: "20px" }}
      >
        {code}
      </pre>
    </div>
  );
}

export default App;
