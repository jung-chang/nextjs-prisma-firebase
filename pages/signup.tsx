import Layout from "components/Layout";
import { useState, FormEvent } from "react";
import firebase from "firebase/app";
import { useRouter } from "next/router";

const SignUpForm = () => {
  const router = useRouter();

  const [botField, setBotField] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

  let recaptchaVerifier = null;

  const isFormValid = () => {
    return true;
  };

  const resetCaptcha = () => {
    console.log({ recaptchaVerifier });
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
    }
  };

  const resetErrors = () => {
    setEmailError("");
    setPasswordError("");
    setError("");
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetErrors();
    if (!isFormValid()) {
      return;
    }

    if (recaptchaVerifier === null) {
      recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha", {
        "callback": () => {
          firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(async (userCredentials: firebase.auth.UserCredential) => {
              console.log({ userCredentials });
              resetCaptcha();
              router.push("/login");
            })
            .catch((error) => {
              console.log(error);
              setError("Sign up failed. Please try again.");
            });
        },
        "expired-callback": () => {
          setError("reCAPTCHA failed. Please try again.");
          resetCaptcha();
        },
      });
    }

    recaptchaVerifier?.render();
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        name="name"
        aria-label="Humans need not fill out"
        type="text"
        value={botField}
        onChange={(event: any) => setBotField(event.target.value)}
        style={{ display: "none" }}
      />
      <input
        placeholder="Email"
        value={email}
        type="email"
        onChange={(event) => {
          setEmail(event.target.value);
          resetCaptcha();
        }}
        onBlur={resetErrors}
      />{" "}
      {emailError && <span>{emailError}</span>}
      <input
        placeholder="Password"
        value={password}
        type="password"
        onChange={(event) => {
          setPassword(event.target.value);
          resetCaptcha();
        }}
        onBlur={resetErrors}
      />{" "}
      {passwordError && <span>{passwordError}</span>}
      <input type="submit" value="Sign up" />
      <span>{error}</span>
      <div id="recaptcha"></div>
    </form>
  );
};

const SignUpPage = () => {
  return (
    <Layout>
      <main>
        <SignUpForm />
      </main>
    </Layout>
  );
};

export default SignUpPage;
