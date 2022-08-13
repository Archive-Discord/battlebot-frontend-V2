import React, { useEffect, useState } from "react";
import ReactTooltip, { Place } from "react-tooltip";

interface ToolTipProps {
  description: string;
  children: JSX.Element;
  name: string;
  place?: Place
}
const Tooltip: React.FC<ToolTipProps> = ({ description, children, name, place }) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <>
      <span data-tip={description} data-for={name}>
        {children}
      </span>
      {isMounted && (
        <ReactTooltip id={name} place={place ? place : "top"} type="dark" effect="float" />
      )}
    </>
  );
};

export default Tooltip;
