import { Fragment } from "react";
import { useTranslation} from "react-i18next"

const Page404 = () => {
    const { t } = useTranslation();
    return (
        <Fragment>
            {t("connectYourWallet")}
        </Fragment>
    ); 
}

export default Page404;
