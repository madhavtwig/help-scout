import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import {
  getSessionStorageOrDefault,
  setSessionStorage,
} from "../../utils/localStorage";
import { LocalStorage } from "../../enum/localStorage";
import TwigAIAnswer from "../TwigAIAnswer";
import ApiKeyForm from "../ApiKeyForm";

export default function Auth() {
  const [twigApiKey, setTwigApiKey] = useState("");
  const [hasTwigApiKey, setHasTwigApiKey] = useState(false);

  const handleApiKeySave = () => {
    setSessionStorage(LocalStorage.TWIG_API_KEY, twigApiKey);
    setHasTwigApiKey(true);
  };

  useEffect(() => {
    setHasTwigApiKey(
      !!getSessionStorageOrDefault(LocalStorage.TWIG_API_KEY, null),
    );
  }, []);

  return (
    <>
      {hasTwigApiKey ? (
        <TwigAIAnswer />
      ) : (
        <ApiKeyForm
          twigApiKey={twigApiKey}
          setTwigApiKey={setTwigApiKey}
          onSave={handleApiKeySave}
        />
      )}
    </>
  );
}
