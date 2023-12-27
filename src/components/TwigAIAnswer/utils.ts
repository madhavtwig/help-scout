export const acceptResponse = async ( message: string, accessTokenVal: string) => {
    const parser = new DOMParser();
    var returnData = null;
    const htmlString = parser.parseFromString(message, "text/html").body
      .textContent;
    zafClient.invoke("ticket.comment.appendMarkdown", message);

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
    var settings = {
      url: url,
      type: "POST",
      dataType: "json",
      accepts: "application/json",
      data: JSON.stringify(payload),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessTokenVal,
      },
    };
    await zafClient.request(settings).then(
      function (data) {
        returnData = data;
      },
      function (response) {
        console.error(response.responseText);
      }
    );
    // return returnData;
  };