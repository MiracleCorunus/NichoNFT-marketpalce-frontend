
import { useLocation } from "react-router";
import { useMoralis } from "react-moralis";
import {
    Button,
} from "antd";
import { FlagFilled, FrownFilled } from "@ant-design/icons";
import { showSuccess } from "helpers/Utils";
import { useState } from "react";

const ReportUser = () => {
    const { user, Moralis } = useMoralis();
    const { search } = useLocation();
    const [ loading, setLoading ] = useState(false);

    /// Report User
    const reportFunc = async () => {
        try {
            setLoading(true);
            const target = new URLSearchParams(search).get("address");

            const params = {
                target,
                isReported: true
            };
            const response = await Moralis.Cloud.run("ReportUser", params);
            if (response) {
                /// reported successfully
                showSuccess("Reported successfully");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    /// Block User
    const blockFunc = async () => {
        try {
            setLoading(true);

            const target = new URLSearchParams(search).get("address");

            const params = {
                target,
                isBlocked: true
            };
            const response = await Moralis.Cloud.run("BlockUser", params);
            console.log("Res:", response, params)
            if (response) {
                /// reported successfully
                showSuccess("Blocked successfully");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ marginBottom: '5px'}}>
            {
                user && user.get("role") === "superAdmin" && 
                <Button 
                    danger icon={ <FlagFilled color="red"/> } 
                    onClick={ blockFunc }
                    loading={ loading }
                >
                    Block
                </Button>
            }
            {   user && user.get("role") === "adminAgency" && 
                <Button 
                    danger icon={ <FrownFilled /> }
                    onClick={ reportFunc }
                    loading={ loading }
                >
                    Report
                </Button> 
            }
        </div> 
    );
}

export default ReportUser;