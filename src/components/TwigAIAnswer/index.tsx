import { Heading, Icon, Text, useHelpScoutContext } from "@helpscout/ui-kit";
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

  return (
    <div className="mx-2">
      <div className="my-2">
        <div className="flex justify-between items-center">
          <Heading level="h1">Apps</Heading>
          <Icon name="refresh" shade="default" state="default" style={{}} />
        </div>
        <Text weight="medium">Twig AI 1204</Text>
      </div>
      <div className="flex flex-col">
        <textarea
          rows={10}
          cols={50}
          className="border-2 border-gray-200 rounded-md"
        />
      </div>
    </div>
  );
}
