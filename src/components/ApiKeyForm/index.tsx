import { ChangeEvent, MouseEvent, useState } from "react";
import { setSessionStorage } from "../../utils/localStorage";
import { LocalStorage } from "../../enum/localStorage";
import { Button, Heading } from "@helpscout/ui-kit";

type ApiKeyFormType = {
  setTwigApiKey: (value: string) => void;
  twigApiKey: string;
  onSave: () => void;
};

export default function ApiKeyForm(props: ApiKeyFormType) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    props.setTwigApiKey(event?.target?.value);
  };

  return (
    <div className="container mx-auto w-screen px-4 py-2">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <Heading level="h1" state="default">
            Set Twig API Key
          </Heading>
          <div className="mt-5 sm:flex sm:items-center">
            <div className="flex flex-col space-y-2 w-full">
              <div className="w-full">
                <input
                  onChange={handleChange}
                  className="p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Twig API key"
                  value={props.twigApiKey}
                />
              </div>
              <Button className="mt-3 w-full" onClick={props.onSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
