import { LoadingOutlined } from "@ant-design/icons";
import React from "react";

export default function Loading() {
  return (
    <div className="h-screen flex items-center justify-center">
      <LoadingOutlined className="text-4xl" spin />
    </div>
  );
}
