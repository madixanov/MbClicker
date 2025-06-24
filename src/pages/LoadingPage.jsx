import "./loading-page.css";
import { Helmet } from "react-helmet";
import { useEffect } from "react";

const LoadingPage = () => {
  useEffect(() => {
          document.body.classList.add("other-page")
  
          return () => {
              document.body.classList.remove('other-page')
          }
      }, [])

  return (
    <div className="loading-wrapper">
      <Helmet>
        <meta
          name="description"
          content="Нажимай, копи MB, обменивай их в Telegram-боте на бесплатный VPN. Просто и удобно!"
        />
      </Helmet>

      <div className="loading-logo">
        <span>🚀</span>
      </div>

      <p className="loading-text">Загрузка...</p>
    </div>
  );
};

export default LoadingPage;
