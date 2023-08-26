import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from "framer-motion";
import { selectChat } from '../../redux/chatSlice';

export const ChatMessages: React.FC = () => {
  const { messages } = useSelector(selectChat);

  return (
    <div className="grid gap-6">
      {messages.map((message: any) => (
        <React.Fragment key={message.id}>
        {message.author === "user" ? (
          <motion.div
            className="flex flex-col items-end gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <p key={message.id} className="bg-sky-blue text-white-blue max-w-[60%] p-3 rounded-[10px] text-xs sm:text-sm">
              {message.message}
            </p>
            <span className="text-white-blue text-xs">{message.createdAt}</span>
          </motion.div>
        ): (
          <>
          {message.message !== "" && (
            <motion.div
              className="flex flex-col items-start gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <p key={message.id} className="bg-dark-medium text-white-blue max-w-[60%] p-3 rounded-[10px] text-xs sm:text-sm">
                {message.message}
              </p>
              <span className="text-white-blue text-xs">{message.createdAt}</span>
            </motion.div>
          )}
          </>
        )}
        </React.Fragment>
      ))}
    </div>
  );
}
