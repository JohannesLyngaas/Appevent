import { useState } from "react";
import { signIn } from "../firebase/auth";
import { useRouter } from "next/router";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError("Feil ved innlogging: " + err.message);
    }
  };

  return (
    <div>
      <h2>Logg inn</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="E-post" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Passord" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Logg inn</button>
      </form>
    </div>
  );
};

export default LoginPage;
