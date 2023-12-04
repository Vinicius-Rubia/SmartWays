import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { useDispatch } from "react-redux";
import IconChat from "../../assets/icons/smartways_logo.svg";
import { MessageResponse } from "../../interfaces/responses/bot";
import { setMessages } from "../../redux/chatSlice";
import { Bot } from "../../services/Bot";
import { ChatMessages } from "../ChatMessages";

export const WindowChat: React.FC = () => {
  const [message, setMessage] = useState("");
  const [responseIA, setResponseIA] = useState<boolean>(true);
  const [countdown, setCountdown] = useState(20);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const dispatch = useDispatch();

  const scrollRef = useRef<HTMLDivElement>(null);
  const maxCharacters = 100;
  const numberOfCaracters = maxCharacters - message.length;

  const handleMessage = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    newValue.length <= maxCharacters && setMessage(newValue);
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsInputDisabled(true);
    setCountdown(20);

    dispatch(setMessages({ author: "user", message: message }));
    setMessage("");

    setResponseIA(false);

    
    const responseMessage = await Bot.post("completions") as MessageResponse;
    dispatch(setMessages({ author: "IA", message: responseMessage.choices[0].message.content }));
    setResponseIA(true);
  };

  const handleScrollDown = () => {
    const { current } = scrollRef;

    if (current && current.scrollHeight > current.offsetHeight) {
      current.scrollTop = current.scrollHeight - current.offsetHeight;
    }
  };

  useEffect(() => {
    handleScrollDown();
  }, [responseIA]);

  useEffect(() => {
    let timer: number;

    if (isInputDisabled) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isInputDisabled]);

  useEffect(() => {
    if (countdown === 0) {
      setIsInputDisabled(false);
    }
  }, [countdown]);

  return (
    <div className="bg-dark-medium flex-1 flex flex-col justify-between">
      <header className="h-11 my-2 mx-3 flex justify-between items-center rounded-t-xl text-white-blue">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img src={IconChat} className="w-12" alt="SmartWays" />
            <span className="w-3 h-3 rounded-full bg-green block absolute bottom-0 right-0"></span>
          </div>
          <div>
            <h2 className="text-white-blue">SmartWays</h2>
            <p className="text-xs text-green font-semibold">{responseIA ? "Online" : "Digitando..."}</p>
          </div>
        </div>
      </header>

      <main
        className="flex-1 bg-dark text-white-blue overflow-y-auto p-5 relative"
        ref={scrollRef}
      >
        <ChatMessages />
      </main>

      <footer className="h-11 m-2 text-white-blue rounded-b-xl">
        <form
          className="flex items-center justify-between gap-2"
          onSubmit={handleSubmit}
        >
          <div className="w-full flex items-center relative bg-dark-light text-white-blue px-3 h-10 rounded-[10px] text-xs md:text-sm disabled:cursor-not-allowed disabled:opacity-30">
            <input
              disabled={isInputDisabled}
              className="w-full bg-dark-light border-none outline-none"
              type="text"
              maxLength={100}
              placeholder={
                isInputDisabled
                  ? `Aguarde a IA terminar de responder... ${countdown > 0 && `Aguarde ${countdown} segundos`}`
                  : "Digite sua mensagem"
              }
              value={message}
              onChange={handleMessage}
            />
            <span className="pl-2">{numberOfCaracters}/100</span>
          </div>
          <button
            disabled={message === ""}
            className="disabled:cursor-not-allowed"
            onClick={handleSubmit}
          >
            <IoMdSend className={`w-10 h-10 p-2 rounded-[10px] transition-colors
              ${message != ""
                ? "bg-white-blue text-sky-blue"
                : "bg-dark-light opacity-30"
              }`}
            />
          </button>
        </form>
      </footer>
    </div>
  );
};
