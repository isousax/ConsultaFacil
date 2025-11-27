import { useEffect } from 'react';

const FooterSignature = () => {
  useEffect(() => {
    console.log(
      `%c✨ Este site foi criado pela Pixelaria\n` +
      `💡 Tem um projeto em mente? Vamos conversar!\n` +
      `🌐 https://pixelaria.com.br`,
      'background: linear-gradient(90deg, #6A0DAD, #8B5FBF); color: white; padding: 12px; border-radius: 8px; font-family: sans-serif; font-size: 12px;'
    );
  }, []);

  return (
    <div className="group flex items-center justify-center gap-2 px-4 mt-4 rounded-lg transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-600/50">
      {/* Ícone robo com animação */}
      <div className="shrink-0 transform transition-transform duration-300 group-hover:-translate-y-px">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-purple-500 group-hover:text-purple-600 transition-colors duration-300"
        >
          <rect x="3" y="8" width="18" height="12" rx="2" ry="2" />
          <circle cx="8.5" cy="14" r="1.5" />
          <circle cx="15.5" cy="14" r="1.5" />
          <path d="M12 8V4" />
          <path d="M9 4h6" />
        </svg>
      </div>

      <span className="text-sm text-gray-500 dark:text-gray-700 font-light">
        Desenvolvido por{" "}
        <a
          href="https://pixelaria.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="relative text-gray-700 dark:text-gray-900 font-medium transition-colors duration-200 
                     group-hover:text-purple-600 dark:group-hover:text-purple-500
                     after:absolute after:left-0 after:-bottom-0.5 after:w-0 after:h-px
                     after:bg-purple-500 after:transition-all after:duration-300
                     group-hover:after:w-full"
        >
          Pixelaria
        </a>
      </span>
    </div>
  );
};

export default FooterSignature;
