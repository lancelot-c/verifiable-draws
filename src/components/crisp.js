"use client"

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("afb57526-488a-4687-9058-b6fea152a312");
  });

  return null;
}

export default CrispChat;