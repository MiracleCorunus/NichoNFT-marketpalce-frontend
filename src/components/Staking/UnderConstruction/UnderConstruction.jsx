import React from "react";
import { useTranslation } from "react-i18next";
import "./UnderConstruction.scss";

const UnderConstruction = () => {
  const { t } = useTranslation();
  return (
    <div className="under-construction-model">
      <div className="under-construction">
        {/* {t(
          "This month's limited sale has ended, please come back next month".toUpperCase()
        )} */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>
          {t("upgradingToStake")}
            <span
              style={{ color: "orange", textShadow: "1px 1px 20px orange" }}
            >
              {t("upgradingToStakeV2")}
            </span>
          </div>
          <div>{t("flexibleStake")}{t("addUnit")}{t("lockStake")}</div>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;
