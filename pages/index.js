import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [nameInput, setNameInput] = useState("");
  const [company, setCompany] = useState("");
  const [result, setResult] = useState([]);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: nameInput, company: company }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      console.log(data.result)
      setNameInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter an name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <input
            type="text"
            name="name"
            placeholder="Enter an company name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <input type="submit" value="Generate Email" />
        </form>
        <div>
          
        {
          result.map((str, id) => {
            
              return <h4 key={id}> {str} </h4>
            
          })
        }
        </div>
      
      </main>
    </div>
  );
}