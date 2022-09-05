import { FC } from "react";

const NeonText: FC<{
  className: string;
}> = ({ children, className }) => {
  return (
    <div className={`w-auto h-auto absolute ${className}`}>
      <div className="w-auto h-auto text-neon-shadow-b transform -translate-x-0.5 -translate-y-0.5">
        {children}
      </div>
      <div className="w-auto h-auto text-neon-shadow-a">{children}</div>
      <div className="w-auto h-auto text-neon-fg transform translate-x-0.5 translate-y-0.5">
        {children}
      </div>
    </div>
  );
};

export default NeonText;
