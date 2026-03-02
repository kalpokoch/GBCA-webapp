import React from "react";
import type { PredictResponse } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import CountUp from "@/components/ui/count-up";

interface Props { data: PredictResponse; }

export const ResultCard: React.FC<Props> = ({ data }) => {
  const isCancer = data.predicted_class === 1;
  const pctNum = parseFloat((data.probability * 100).toFixed(2));
  const pct = pctNum.toFixed(2);

  return (
    <Card className={isCancer ? "border-red-300 bg-red-50" : "border-green-300 bg-green-50"}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          <CardTitle className="font-display text-lg sm:text-xl">
            {isCancer ? "🔴 Cancer Detected" : "🟢 Normal"}
          </CardTitle>
          <Badge
            variant="outline"
            className={isCancer
              ? "font-mono bg-red-100 text-red-700 border-red-200 text-xs"
              : "font-mono bg-green-100 text-green-700 border-green-200 text-xs"}
          >
            class {data.predicted_class}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex justify-between font-body text-sm text-gray-600">
          <span>Confidence</span>
          <span className="font-semibold">
            <CountUp to={pctNum} from={0} duration={1.5} />%
          </span>
          {/* CountUp auto-detects 2 decimal places from pctNum */}
        </div>
        <Progress
          value={parseFloat(pct)}
          className={isCancer ? "[&>div]:bg-red-500" : "[&>div]:bg-green-500"}
        />
      </CardContent>

      <CardFooter>
        <p className="font-body text-xs text-gray-400 ml-auto">Threshold: {data.threshold_used}</p>
      </CardFooter>
    </Card>
  );
};
