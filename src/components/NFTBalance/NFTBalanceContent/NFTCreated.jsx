import { useMoralis } from 'react-moralis'
import { Row, Col, Button, Image, Pagination } from 'antd';
import ProductCard from 'components/ProductCard';
import './NFTBalanceContent.scss';
import { useState, useEffect } from 'react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import methodImg1 from 'assets/images/new/grid_method.png';
import methodImg2 from 'assets/images/new/grid_method2.png';
import methodActiveImg1 from 'assets/images/new/grid_method_icon1.png';
import methodActiveImg2 from 'assets/images/new/grid_method_icon2.png';
import { getCreatedNFTsApi } from 'api/nftList';

function NFTCreated() {
    const [items, setItems] = useState();
    const [cardColumn, setCardColumn] = useState([6, 6, 8, 12, 12, 24]);
    const [total, setTotal] = useState(0);
    const [pageInfo, setPageInfo] = useState({pageNo: 1, pageSize: 50});

    const { user } = useMoralis();
    const { t } = useTranslation();

    const getUserItems = async () => {    
        try {
            if (!user) return;
            const params = {
                ethAddress: user.get("ethAddress"),
                ...pageInfo
            }
            const { records, total } = await getCreatedNFTsApi(params);
            console.log(records)
            if (records) {
                setItems(records)
                setTotal(total)
            }    
        } catch(err) {
            console.log(err)
        }
    }

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

    useEffect(() => {
        if (!user) return;
        
        getUserItems();
    }, [user, pageInfo]);

    return (
        <Fragment>
            <Row justify="space-between" align="middle" style={{ marginBottom: '30px' }}>
                <h3 className='total-counter'>{t("totalItems")} {items?.length > 0 ? items?.length : 0}</h3>
                <div className="set-column-wrap">
                    <Button className="grid-method" onClick={() => changeCardColumn([6, 6, 8, 12, 12, 24], false)} >
                        <Image preview={false} width={24} height={24} src={cardColumn[1]===6 ? methodImg1 : methodActiveImg1}/>
                    </Button>
                    <Button className="grid-method" onClick={() => changeCardColumn([3, 3, 6, 8, 12, 12], true)} >
                        <Image preview={false} width={24} height={24} src={cardColumn[1]===3 ? methodImg2 : methodActiveImg2}/>
                    </Button>
                </div>
            </Row>

            <Row gutter={[30, 30]}>
                {items && items.map((item, index) => (
                    <Col lg={cardColumn[0]} md={cardColumn[1]} sm={cardColumn[2]} key={index}>
                        <ProductCard product={item} />
                    </Col>
                ))}
            </Row>
            <Row style={{padding: '28px 0'}}>
                <Pagination 
                    className="com-pagination" 
                    showQuickJumper 
                    current={pageInfo.pageNo} 
                    pageSize={pageInfo.pageSize}
                    pageSizeOptions={[16, 32, 50, 100]}
                    total={total} 
                    showTotal={total => `${t("total")} ${total} ${t("items")}`}
                    onChange={onPageChange} />
            </Row>
        </Fragment>
    );
}

export default NFTCreated;