"use client";

import React from "react";

export const DiffToggle = ({ diffNumber, diffPercentage }) => {
  const [showPercentage, setShowPercentage] = React.useState(true);

  const bigNumberFormatter = new Intl.NumberFormat("en", {
    signDisplay: "always",
  });
  const percentageFormatter = new Intl.NumberFormat("en", {
    style: "percent",
    maximumSignificantDigits: 2,
    signDisplay: "always",
  });

  const handleToggleClick = () => {
    setShowPercentage(!showPercentage);
  };

  const diffText = Math.abs(diffNumber) > 1 ? "messages" : "message";

  return (
    <div>
      <div
        onClick={handleToggleClick}
        style={{
          color: "#de554f",
          cursor: "pointer",
        }}
      >
        {showPercentage ? (
          <p>({percentageFormatter.format(diffPercentage)})</p>
        ) : (
          <p>
            ({bigNumberFormatter.format(diffNumber)} {diffText})
          </p>
        )}
      </div>
    </div>
  );
};
