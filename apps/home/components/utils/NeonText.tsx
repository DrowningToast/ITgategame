import { FC } from "react";

const NeonText: FC = ({ children }) => {
  return (
    <div className="w-auto h-auto relative">
      <div className="w-auto h-auto text-neon-shadow-b absolute -left-0.5 -top-0.5">
        {children}
      </div>
      <div className="w-auto h-auto text-neon-shadow-a">{children}</div>
      <div className="w-auto h-auto text-neon-fg absolute left-0.5 top-0.5">
        {children}
      </div>
    </div>
  );
};

export default NeonText;
