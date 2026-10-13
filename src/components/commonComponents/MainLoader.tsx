import React from "react";


const MainLoader: React.FC = () => {
  return (
    <>
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
        <div className="relative flex justify-center items-start mt-4" style={{ height: '35px', minWidth: '70px' }}>
          <span className="loader" style={{ color: 'var(--loader-color)' }}></span>
        </div>
        <style dangerouslySetInnerHTML={{
          __html: `
        @keyframes draw {
          0%, 10% { stroke-dashoffset: 100; }
          40%, 60% { stroke-dashoffset: 0; }
          90%, 100% { stroke-dashoffset: -100; }
        }
        @keyframes shine {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(200%) translateY(200%) rotate(45deg); }
        }
        .loader, .loader::before, .loader::after {
          border-radius: 50%;
          width: 2.5em;
          height: 2.5em;
          animation-fill-mode: both;
          animation: bblFadInOut 1.8s infinite ease-in-out;
        }
        .loader {
          font-size: 7px;
          position: relative;
          text-indent: -9999em;
          transform: translateZ(0);
          animation-delay: -0.16s;
        }
        .loader::before,
        .loader::after {
          content: '';
          position: absolute;
          top: 0;
        }
        .loader::before {
          left: -3.5em;
          animation-delay: -0.32s;
        }
        .loader::after {
          left: 3.5em;
        }
        @keyframes bblFadInOut {
          0%, 80%, 100% { box-shadow: 0 2.5em 0 -1.3em currentColor; }
          40% { box-shadow: 0 2.5em 0 0 currentColor; }
        }
      `}} />
      </div>
    </>
  );
};

export default MainLoader;