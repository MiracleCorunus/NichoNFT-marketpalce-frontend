import { useMoralis } from 'react-moralis'
import { Row, Col, Button, Image, Pagination } from 'antd';
import SoldCard from 'components/SoldCard';
import './NFTBalanceContent.scss';
import { useState, useEffect } from 'react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import methodImg1 from 'assets/images/new/grid_method.png';
import methodImg2 from 'assets/images/new/grid_method2.png';
import methodActiveImg1 from 'assets/images/new/grid_method_icon1.png';
import methodActiveImg2 from 'assets/images/new/grid_method_icon2.png';
import { getSoldNFTsApi } from 'api/user';

function NFTSold() {
    const [items, setItems] = useState();
    const [cardColumn, setCardColumn] = useState([6, 6, 8, 12, 12, 24]);
    const [pageInfo, setPageInfo] = useState({pageNo: 1, pageSize: 50});
    const [total, setTotal] = useState(0);

    const { user } = useMoralis();
    const { t } = useTranslation();

    useEffect(() => {
        const getUserItems = async () => {    
            if (!user) return;
            const params = {
                ethAddress: user.get("ethAddress"),
                ...pageInfo
            }
            const { records, total } = await getSoldNFTsApi(params);
            console.log(records)
            if (records) {
                setTotal(total)
                setItems(records)
            }    
        }
        getUserItems();
    }, [user, pageInfo]);

    // 分页  
    const onPageChange = async(pageNo) => {
        setPageInfo((prevState) => {
            return {
                ...prevState,
                pageNo
            }
        })
    };

    const changeCardColumn = (columnArr, smallView) => {
        setCardColumn(columnArr)
        if(smallView) {
            setPageInfo((prevState) => {
                return {
                    ...prevState,
                    pageSize: 100
                }
            })
        } else {
            setPageInfo((prevState) => {
                return {
                    ...prevState,
                    pageSize: 50
                }
            })
        }
    }

    return (
        <Fragment>
            <Row
                justify="space-between"
                align="middle"
                style={{ marginBottom: "30px" }}
            >
                <h3 className="total-counter">
                    {t("totalItems")} {items?.length > 0 ? items?.length : 0}
                </h3>
                <div className="set-column-wrap">
                    <Button
                        className="grid-method"
                        onClick={() => changeCardColumn([6, 6, 8, 12, 12, 24])}
                    >
                        <Image
                            preview={false}
                            width={24}
                            height={24}
                            src={cardColumn[1]===6 ? methodImg1 : methodActiveImg1}
                        />
                    </Button>
                    <Button
                        className="grid-method"
                        onClick={() => changeCardColumn([3, 3, 6, 8, 12, 12])}
                    >
                        <Image
                            preview={false}
                            width={24}
                            height={24}
                            src={cardColumn[1]===3 ? methodImg2 : methodActiveImg2}
                        />
                    </Button>
                </div>
            </Row>

            <Row gutter={[30, 30]}>
                {   items &&
                    items.map((item, index) => (
                    <Col
                            xxl={cardColumn[0]}
                            xl={cardColumn[1]}
                            lg={cardColumn[2]}
                            md={cardColumn[3]}
                            sm={cardColumn[4]}
                            xs={cardColumn[5]}
                            key={index}
                        >
                        <SoldCard type={2} product={item} />
                    </Col>
                ))}
            </Row>
            <Row style={{ padding: "28px 0" }}>
                <Pagination
                className="com-pagination"
                showQuickJumper
                current={pageInfo.pageNo}
                pageSize={pageInfo.pageSize}
                pageSizeOptions={[16, 32, 50, 100]}
                total={total}
                showTotal={(total) => `${t("total")} ${total} ${t("items")}`}
                onChange={onPageChange}
                />
            </Row>
        </Fragment>
    );
}

export default NFTSold;

// objectId
// timestamp
// nftID
// address
// price
// tokenUri
// ownerOf
// sellerUsername
// sellerAvatar
