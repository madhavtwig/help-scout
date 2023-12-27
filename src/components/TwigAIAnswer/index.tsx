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
import logo from "./assets/twig-thumbnail-icon.png";
import pin from "./assets/pin.png";
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
  getConversationById,
  getHelpScoutAccessToken,
} from "../../apis/helpScout";

export default function TwigAIAnswer() {
  const { user, conversation, mailbox, company, customer } =
    useHelpScoutContext();
  console.log({ user, conversation, mailbox, company, customer });

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
              />
              <Button className="flex items-center my-4" styled="outlined">
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
        />
        <div className="flex items-center space-x-4 my-4 text-blue-600">
          <Icon name="list" shade="default" state="default" style={{}} />
          <ArrowsPointingOutIcon className="h-4 w-4" />
          <ArrowsPointingInIcon className="h-4 w-4" />
          <Icon name="emoji" shade="default" state="default" style={{}} />
          <Icon
            name="circle-arrow"
            shade="default"
            state="default"
            style={{}}
          />
        </div>
      </div>
      <div className="my-2">
        <Text weight="medium">Citations</Text>
        <hr className="h-[2px] my-2 bg-gray-800 border-0" />
        <Accordion className="[&_#accordion\_title\_section1]:items-center [&_#accordion\_title\_section2]:items-center">
          <Accordion.Section id="section1" title="Section 1">
            <div className="flex flex-col items-start">
              Content for section 1.
              <Button styled="linked">Accept</Button>
            </div>
          </Accordion.Section>
          <Accordion.Section id="section2" title="Section 2">
            <div className="flex flex-col items-start">
              Content for section 2.
              <Button styled="linked">Accept</Button>
            </div>
          </Accordion.Section>
        </Accordion>
      </div>
    </div>
  );
}
