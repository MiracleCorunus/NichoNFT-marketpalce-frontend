
import { useLocation } from "react-router";
import { useMoralis } from "react-moralis";
import {
    Button,
} from "antd";
import { FlagFilled, FrownFilled } from "@ant-design/icons";
import { showSuccess } from "helpers/Utils";
import { useState } from "react";

const ReportCollection = () => {
    const { user, Moralis } = useMoralis();
    const { search } = useLocation();
    const [ loading, setLoading ] = useState(false);

    /// Report NFT collection
    const reportFunc = async () => {
        try {
            setLoading(true);
            const collectionId = new URLSearchParams(search).get("collectionId");

            const params = {
                collectionId,
                isReported: true
            };
            const response = await Moralis.Cloud.run("ReportCollection", params);
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

    /// Block NFT collection
    const blockFunc = async () => {
        try {
            setLoading(true);

            const collectionId = new URLSearchParams(search).get("collectionId");

            const params = {
                collectionId,
                isBlocked: true
            };
            const response = await Moralis.Cloud.run("BlockCollection", params);
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

export default ReportCollection;