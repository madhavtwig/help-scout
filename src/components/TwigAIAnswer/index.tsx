import HelpScout, { NOTIFICATION_TYPES } from "@helpscout/javascript-sdk";
import {
  Button,
  DefaultStyle,
  Heading,
  useSetAppHeight,
  Text,
  useHelpScoutContext,
  Accordion,
  Icon,
} from "@helpscout/ui-kit";
import logo from "../../assets/twig-thumbnail-icon.png";
import pin from "../../assets/pin.png";
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/24/outline";
import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { LocalStorage } from "../../enum/localStorage";
import {
  getSessionStorageOrDefault,
  setSessionStorage,
} from "../../utils/localStorage";
import {
  createReplyThread,
  getConversationById,
  getHelpScoutAccessToken,
} from "../../apis/helpScout";
import { ReplyThreadPayload } from "../../typedefs/helpScout";

const feedback = {
  accurate: "ACCURATE",
  edited: "EDITED",
  accurateWithEdit: "ACCURATE_WITH_EDIT",
  inAccurate: "IN_ACCURATE",
  notReviewed: "NOT_REVIEWED",
};

export default function TwigAIAnswer() {
  const [ticketDescription, setTicketDescription] = useState("");
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refinePrompt, setRefinePrompt] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [helpScoutAccessToken, setHelpScoutAccessToken] = useState("");
  const [agentProcessing, setAgentProcessing] = useState(false);
  const [aiAgent, setAIAgent] = useState<any>(null);
  const [interaction, setInteraction] = useState<any>(null);
  const [conversationData, setConversationData] = useState<any>(null);
  const stopWord = " \n\n###\n\n";
  const { user, conversation, mailbox, company, customer } =
    useHelpScoutContext();
  console.log({ user, conversation, mailbox, company, customer });

  function onChangeAnswer(e: any) {
    e.preventDefault();
    setAnswer(e.target.value);
  }

  function getRandomString(len: any, charSet: any) {
    charSet =
      charSet ||
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var randomString = "";
    for (var i = 0; i < len; i++) {
      var randomPoz = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
  }

  const acceptResponse = async (message: any, accessTokenVal: any) => {
    const parser = new DOMParser();
    var returnData = null;
    const htmlString = parser.parseFromString(message, "text/html").body
      .textContent;
    // zafClient.invoke("ticket.comment.appendMarkdown", message);

    try {
      const replyPayload: ReplyThreadPayload = {
        customer: {
          id: conversation?.customerId as number,
        },
        text: htmlString as string,
      };
      await createReplyThread(
        helpScoutAccessToken,
        conversationData.id,
        replyPayload,
      );

      const url =
        "https://app.twig.so/api/interactions/" +
        String(interaction["id"]) +
        "/status";

      let payload = {
        feedbackCode:
          answer == String(interaction["summaryResponse"])
            ? feedback.accurate
            : feedback.edited,
        editedResponse: answer,
        citation: interaction["citation"],
      };

      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessTokenVal,
        },
      });
      returnData = await res.json();
    } catch (error) {
      console.log(error);
    }
  };

  const getAccessToken = async () => {
    const url = "https://app.twig.so/api/external-api-key-auth";
    var returnData = "";

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

  const getAIAgent = async (accessTokenVal: string) => {
    const url = "https://app.twig.so/api/ai-agent-managers/user/" + "na";
    var returnData = null;

    try {
      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessTokenVal,
        },
      });
      returnData = await res.json();
    } catch (error) {
      console.log(error);
    }

    return returnData;
  };

  const getRegeneratedResponse = async (
    refinePromptVal: string,
    accessTokenVal: string,
  ) => {
    let url = "https://app.twig.so/api/" + "chat-refine";

    let payload = {
      promptVal: ticketDescription,
      aiAgent: aiAgent?.aiAgentManager,
      citations: citations,
      refinePrompt: refinePromptVal,
    };

    var returnData = null;

    try {
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessTokenVal,
        },
      });
      returnData = await res.json();
    } catch (error) {
      console.log(error);
    }

    return returnData;
  };

  const getSimplePromptedResponse = async (promptRequestType: string) => {
    setAgentProcessing(true);
    let prompt = answer;

    if (answer == "") {
      return;
    }

    switch (promptRequestType) {
      case "Bulleted":
        prompt = `Answer in bullets: \n ${stopWord}`;
        break;
      case "Long":
        prompt = `Answer in a long sentence: \n ${stopWord}`;
        break;
      case "Short":
        prompt = `Answer in a concise manner:  \n ${stopWord}`;
        break;
      case "Positive":
        prompt = `Answer in a postive tone: \n ${stopWord}`;
        break;
      case "Neutral":
        prompt = `Answer in a neutral tone: \n ${stopWord}`;
        break;
      case "Empathetic":
        prompt = `Answer in a empathetic tone: \n ${stopWord}`;
        break;
      case "Rephrase":
        if (refinePrompt == "") {
          prompt = `Regenerate answer \n ${stopWord}`;
        } else {
          prompt = refinePrompt + "\n ${stopWord}";
        }

        break;
      default:
        prompt = `Make this sound empathetic: \n ${stopWord}`;
    }

    let responseVal = await getRegeneratedResponse(
      prompt,
      getSessionStorageOrDefault(LocalStorage.ACCESS_TOKEN, ""),
    );

    setAnswer(String(responseVal));
    setRefinePrompt("");
    setAgentProcessing(false);
  };

  const getAISuggestion = async (
    prompt: string,
    accessTokenVal: string,
    aiAgentObject: any,
    externalReferenceId: string,
    externalReferenceUrl: string,
  ) => {
    const url = "https://app.twig.so/api/chat";
    var returnData = null;

    try {
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          promptVal: prompt,
          aiAgent: aiAgentObject.aiAgentManager,
          originType: "HELP_SCOUT",
          isAutomated: true,
          externalReferenceId: externalReferenceId,
          externalReferenceUrl: externalReferenceUrl,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessTokenVal,
        },
      });
      returnData = await res.json();
    } catch (error) {
      console.log(error);
    }

    return returnData;
  };

  useEffect(() => {
    // Update the document title using the browser API
    const fetchData = async () => {
      setLoading(true);

      let externalReferenceId = String(conversationData?.id);
      // let brandUrl = (await zafClient.get("ticket.brand.url"))[
      //   "ticket.brand.url"
      // ];
      let brandUrl = "";
      let externalReferenceUrl =
        brandUrl + "/agent/tickets/" + externalReferenceId;
      let tmpAccessToken: string = "";

      if (!getSessionStorageOrDefault(LocalStorage.ACCESS_TOKEN, null)) {
        tmpAccessToken = await getAccessToken();
        setSessionStorage(LocalStorage.ACCESS_TOKEN, tmpAccessToken);
      } else {
        tmpAccessToken = getSessionStorageOrDefault(
          LocalStorage.ACCESS_TOKEN,
          "",
        );
      }

      let aiAgentObject = await getAIAgent(tmpAccessToken);
      setAIAgent(aiAgentObject);

      // zafClient.invoke("resize", { width: "100%", height: "800" });

      const response = await getAISuggestion(
        ticketDescription,
        tmpAccessToken,
        aiAgentObject,
        externalReferenceId,
        externalReferenceUrl,
      );
      setInteraction(response);
      console.log({ response });
      setAnswer(String(response["summaryResponse"]));

      setCitations(response["citation"]);
      setLoading(false);
    };

    if (conversation?.id) {
      fetchData().catch(console.error);
    }
  }, [ticketDescription]);
  console.log(document.querySelector('[data-testid="reply-editor"]'));
  useEffect(() => {
    if (user?.id) {
      getAccessToken();
    }
  }, [user]);

  useEffect(() => {
    const fetchHelpScoutData = async () => {
      const helpScoutToken = await getHelpScoutAccessToken();

      if (helpScoutToken) {
        setHelpScoutAccessToken(helpScoutToken);
        const conversationRes = await getConversationById(
          conversation?.id as number,
          helpScoutToken,
        );

        setConversationData(conversationRes);
        setTicketDescription(
          conversationRes?.subject +
            ". " +
            conversationRes?._embedded?.threads?.[0]?.body,
        );
      }
    };

    if (conversation?.id) {
      fetchHelpScoutData();
    }
  }, [conversation]);

  return (
    <div className="mx-2">
      <div className="my-2">
        <div className="flex justify-between items-center">
          <Heading level="h1">Apps</Heading>
          {agentProcessing && (
            <Icon name="refresh" shade="default" state="default" />
          )}
        </div>
        <Accordion className="mt-2 [&_#accordion\_title\_section1]:items-center">
          <Accordion.Section
            id="section1"
            title={
              <div className="flex items-center">
                <div className="flex items-center space-x-2 mr-4">
                  <div className="p-2 bg-orange-600 rounded-full">
                    <img
                      className="w-4 h-4 invert brightness-0 grayscale"
                      src={logo}
                      alt="logo"
                    />
                  </div>
                  <Text weight="medium">Twig AI 1204</Text>
                </div>
                <div>
                  <img className="w-4 h-4" src={pin} alt="pin" />
                </div>
              </div>
            }
          >
            <div className="flex flex-col">
              <textarea
                rows={10}
                cols={25}
                className="border-2 border-gray-200 rounded-md"
                onChange={(e) => {
                  e.preventDefault();
                  onChangeAnswer(e);
                }}
                value={answer}
              />
              <Button
                className="flex items-center my-4"
                styled="outlined"
                onClick={() => acceptResponse(answer, accessToken)}
              >
                <HandThumbUpIcon className="w-4 h-4 mr-2" />
                Accept
              </Button>
            </div>
          </Accordion.Section>
        </Accordion>
      </div>
      <div className="flex flex-col">
        <input
          type="text"
          className="p-2 text-xs border-2 border-gray-200 rounded-md"
          placeholder="Tell in your own words"
          value={refinePrompt}
          onChange={(e) => {
            e.preventDefault();
            setRefinePrompt(e.target.value);
          }}
        />
        <div className="flex items-center space-x-4 my-4 text-blue-600">
          <Button
            onClick={() => {
              getSimplePromptedResponse("Bulleted");
            }}
            styled="linked"
          >
            <Icon name="list" shade="default" state="default" style={{}} />
          </Button>
          <Button
            onClick={() => getSimplePromptedResponse("Long")}
            styled="linked"
          >
            <ArrowsPointingOutIcon className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => getSimplePromptedResponse("Short")}
            styled="linked"
          >
            <ArrowsPointingInIcon className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => getSimplePromptedResponse("Empathetic")}
            styled="linked"
          >
            <Icon name="emoji" shade="default" state="default" style={{}} />
          </Button>
          <Button
            onClick={() => getSimplePromptedResponse("Rephrase")}
            styled="linked"
          >
            <Icon name="circle-arrow" shade="default" state="default" />
          </Button>
        </div>
      </div>

      {!!citations.length && (
        <div className="my-2">
          <Text weight="medium">Citations</Text>
          <hr className="h-[2px] my-2 bg-gray-800 border-0" />
          <Accordion className="[&_#accordion\_title\_section1]:items-center [&_#accordion\_title\_section2]:items-center">
            {citations.map((citationObj: any, index) => (
              <Accordion.Section
                key={getRandomString(10, null)}
                title={citationObj?.citationTitle}
                id={`${index}`}
              >
                <div className="flex flex-col items-start">
                  <div className="citationContent">
                    {citationObj?.citationSnippet}
                  </div>
                  <div className="citationURL">{citationObj?.citationURL}</div>
                  <Button
                    styled="linked"
                    // TODO: handle this later
                    // onClick={() =>
                    //   acceptResponse(
                    //     searchResult?.metadata?.title +
                    //       "\n\n" +
                    //       searchResult?.metadata?.content +
                    //       "\n\n" +
                    //       searchResult?.metadata?.url,
                    //     accessToken,
                    //   )
                    // }
                  >
                    Accept
                  </Button>
                </div>
              </Accordion.Section>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}
