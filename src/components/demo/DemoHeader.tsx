import React from "react";
import { Badge } from "@/components/ui/badge";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import { demoData } from "@/data/demoData";

interface DemoHeaderProps {
  apiOnline: boolean | null;
}

export const DemoHeader: React.FC<DemoHeaderProps> = ({ apiOnline }) => {
  return (
    <div className="text-center space-y-1">
      <h1 className="text-3xl font-bold text-gray-800">{demoData.title}</h1>
      <p className="text-gray-500 text-sm">{demoData.subtitle}</p>

      {/* API Status Badge */}
      <div className="flex justify-center pt-1">
        {apiOnline === null && (
          <Badge variant="secondary">{demoData.apiStatus.checking}</Badge>
        )}
        {apiOnline === true && (
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 flex gap-1.5 items-center">
            <MdCheckCircle size={16} /> {demoData.apiStatus.online}
          </Badge>
        )}
        {apiOnline === false && (
          <Badge variant="destructive" className="flex gap-1.5 items-center">
            <MdCancel size={16} /> {demoData.apiStatus.offline}
          </Badge>
        )}
      </div>
    </div>
  );
};
