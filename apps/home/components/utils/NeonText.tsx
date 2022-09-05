import { FC } from "react";

const NeonText: FC<{
  className?: string;
  ["nofg"]?: boolean;
}> = ({ children, className, nofg }) => {
  return (
    <div className={`${className}`}>
      <div className="w-auto h-auto text-neon-shadow-a relative">
        <div className="">{children}</div>

        <div className="w-auto h-auto text-neon-shadow-b transform absolute top-0 left-0  -translate-x-0.5 -translate-y-0.5 ">
          {children}
        </div>
        {!(nofg && true) && (
          <div className="w-auto h-auto text-neon-fg transform absolute top-0 left-0 translate-x-0.5 translate-y-0.5">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default NeonText;
