import { ChangeEvent, MouseEvent, useState } from "react";
import { setSessionStorage } from "../../utils/localStorage";
import { LocalStorage } from "../../enum/localStorage";

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
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Set Twig API Key
          </h3>

          <div className="mt-5 sm:flex sm:items-center">
            <div className="flex flex-col  w-full">
              <div className="w-full">
                <input
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Twig API key"
                  value={props.twigApiKey}
                />
              </div>
              <button
                className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={props.onSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
