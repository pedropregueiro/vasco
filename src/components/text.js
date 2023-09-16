export const MutedText = (props) => {
  return (
    <p
      {...props}
      style={{ color: "#7b7b7b", fontSize: "0.8rem", ...props.style }}
    >
      {props.children}
    </p>
  );
};
