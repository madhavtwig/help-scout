import { useHelpScoutContext } from "@helpscout/ui-kit";
import { useEffect } from "react";
import { LocalStorage } from "../../enum/localStorage";
import { getSessionStorageOrDefault } from "../../utils/localStorage";

export default function TwigAIAnswer() {
  const { user } = useHelpScoutContext();
  console.log({ user });

  const getAccessToken = async () => {
    const url = "https://app.twig.so/api/external-api-key-auth";
    var returnData = null;

    try {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey: getSessionStorageOrDefault(LocalStorage.TWIG_API_KEY, ""),
          email: user?.email,
        }),
      })
        .then((res) => res.json())
        .then((jsonRes) => console.log({ jsonRes }))
        .catch((err) => console.log({ err }));
    } catch (error) {
      console.log({ error });
    }

    return returnData;
  };

  useEffect(() => {
    if (user?.id) {
      getAccessToken();
    }
  }, [user]);

  return <>Twig AI Answer</>;
}
