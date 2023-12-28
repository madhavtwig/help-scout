import { ReplyThreadPayload } from "../typedefs/helpScout";

export const getHelpScoutAccessToken = async () => {
  try {
    const res = await fetch("https://api.helpscout.net/v2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: "0XNx0SGPmpULSPGPoMXOESlYWh3tsh0J",
        client_secret: "GAm1Za3I3x84GxfbXWzBNRzCVnn9QJeB",
      }),
    });
    return (await res.json())?.access_token;
  } catch (error) {
    console.log(error);
  }
};

export const getConversationById = async (
  conversationId: number,
  helpScoutToken: string,
) => {
  try {
    const res = await fetch(
      `https://api.helpscout.net/v2/conversations/${conversationId}?embed=threads`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${helpScoutToken}`,
        },
      },
    );
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

export const createReplyThread = async (
  helpScoutToken: string,
  conversationId: number,
  data: ReplyThreadPayload,
) => {
  try {
    const res = await fetch(
      `https://api.helpscout.net/v2/conversations/${conversationId}/reply`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${helpScoutToken}`,
        },
      },
    );
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};
