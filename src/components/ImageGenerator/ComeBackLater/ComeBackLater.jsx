import React from "react";
import { useTranslation } from "react-i18next";
import "./ComeBackLater.scss";

const ComeBackLater = () => {
  const { t } = useTranslation();
  return (
    <div className="coming-back-model">
      <div className="coming-back">
        {t(
          "This month's limited sale has ended, please come back next month".toUpperCase()
        )}
      </div>
    </div>
  );
};

export default ComeBackLater;
