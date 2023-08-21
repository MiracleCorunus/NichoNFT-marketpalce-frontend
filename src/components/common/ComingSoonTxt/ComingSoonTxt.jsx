import React from "react";
import { useTranslation } from "react-i18next"
import "./ComingSoonTxt.scss";

const ComingSoon = () => {
    const { t } = useTranslation();
    return (
        <div className="coming-soon-model">
            <div className="coming-soon">{t("comingSoon")}</div>
        </div>
    );
}

export default ComingSoon;