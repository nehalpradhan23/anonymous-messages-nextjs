import { Loader } from "lucide-react";
import React from "react";

const loading = () => {
  return (
    <div className="flex w-full min-h-screen items-center justify-center">
      <Loader className="animate-spin" size={50} />
    </div>
  );
};

export default loading;
