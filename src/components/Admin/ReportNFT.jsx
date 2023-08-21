
import { useLocation } from "react-router";
import { useMoralis } from "react-moralis";
import {
    Button,
} from "antd";
import { FlagFilled, FrownFilled } from "@ant-design/icons";
import { showSuccess } from "helpers/Utils";
import { useState } from "react";

const ReportNFT = () => {
    const { user, Moralis } = useMoralis();
    const { search } = useLocation();
    const [ loading, setLoading ] = useState(false);

    /// Report NFT
    const reportFunc = async () => {
        try {
            setLoading(true);
            const id = new URLSearchParams(search).get("id");

            const params = {
                id,
                isReported: true
            };
            const response = await Moralis.Cloud.run("ReportNFT", params);
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

    /// Block NFT
    const blockFunc = async () => {
        try {
            setLoading(true);

            const id = new URLSearchParams(search).get("id");

            const params = {
                id,
                isBlocked: true
            };
            const response = await Moralis.Cloud.run("BlockNFT", params);
            console.log("Res:", response)
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
        <div style={{ marginTop: '5px'}}>
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

export default ReportNFT;