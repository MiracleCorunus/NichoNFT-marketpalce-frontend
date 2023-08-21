import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Row,
  InputNumber,
  Upload,
  Typography,
  DatePicker,
  Input,
  Table,
  Form,
  Popconfirm,
  Divider,
  message,
} from "antd";
import { Helmet } from 'react-helmet';
import {
  PlusOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import $ from "jquery";
import * as htmlToImage from "html-to-image";
import * as download from "downloadjs";
import {
  useMoralis,
  useMoralisWeb3Api,
  useWeb3ExecuteFunction,
} from "react-moralis";
import {
  contractAddress,
  aiAgentABI,
  aiAgentAddress,
  marketplaceAddress,
  nichonftABI,
  marketplaceABI,
} from "../../contracts/constants";
import "./Staking.scss";
import ComingSoonTxt from "components/common/ComingSoonTxt";
// import { html2pdf } from "html2pdf.js";
const html2pdf = require("html2pdf.js");
const { Title } = Typography;
const { TextArea } = Input;

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const InvoiceGenerator = () => {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [sellingPrice, setSellingPrice] = useState();
  const [note, setNote] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bic, setBIC] = useState("");
  const [reference, setReference] = useState("");
  const [businessId, setBusinessId] = useState("");
  const [senderInfo, setSenderInfo] = useState("");
  const [recipientInfo, setReceipientInfo] = useState("");
  const [subtotal, setSubTotal] = useState(0);
  const [subVat, setSubVat] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [dataSource, setDataSource] = useState([
    {
      key: "0",
      description: `Enter your item description`,
      quantity: "0",
      unit_price: "0",
      vat: "0",
      amount: "0",
    },
  ]);
  const [count, setCount] = useState(1);

  const [waiting, setWaiting] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [uploaded, setUploaded] = useState(false);

  const invoiceCollectionId = process.env.REACT_APP_INVOICE_IMAGE_COLLECTION_ID;
  const web3Api = useMoralisWeb3Api();
  const { fetch: mintNFT } = useWeb3ExecuteFunction();
  const { fetch: getTokenId } = useWeb3ExecuteFunction();
  const { fetch: setApprovalForAll } = useWeb3ExecuteFunction();
  const { fetch: listItemToMarket } = useWeb3ExecuteFunction();
  const { Moralis, user, isAuthenticated } = useMoralis();

  const onChange = (date, dateString) => {
    console.log(date, dateString);
    setDueDate(dateString);
  };

  const handleChange = ({ fileList }) => {
    setUploaded(true);
    getBase64(fileList[fileList.length - 1].originFileObj, (url) => {
      setImageUrl(url);
    });
    console.log("fileList", fileList);
  };

  useEffect(() => {
    const tmpDataSource = dataSource;
    let tmpSubTotal = 0;
    let tmpSubVat = 0;
    let tmpTotalAmount = 0;

    for (let i = 0; i < tmpDataSource.length; i++) {
      let quantity = parseInt(tmpDataSource[i].quantity);
      let unit_price = parseFloat(tmpDataSource[i].unit_price);
      let vat = parseFloat(tmpDataSource[i].vat);

      let amount = (quantity * unit_price * (100 + vat)) / 100;
      tmpSubTotal += quantity * unit_price;
      tmpSubVat += (quantity * unit_price * vat) / 100;
      tmpTotalAmount += amount;
    }
    setSubTotal(tmpSubTotal);
    setSubVat(tmpSubVat);
    setTotalAmount(tmpTotalAmount);
    // forceRender((old) => !old);
  }, [dataSource, totalAmount]);

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };
  const defaultColumns = [
    {
      title: "Description",
      dataIndex: "description",
      width: "50%",
      editable: true,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      editable: true,
    },
    {
      title: "Unit Price",
      dataIndex: "unit_price",
      editable: true,
    },
    {
      title: "VAT%",
      dataIndex: "vat",
      editable: true,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (_, record) =>
        (parseInt(record.quantity) *
          parseFloat(record.unit_price) *
          (100 + parseFloat(record.vat))) /
        100,
    },
    {
      title: "",
      dataIndex: "delete",
      render: (_, record) =>
        dataSource.length >= 1 && !waiting ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <DeleteOutlined />
          </Popconfirm>
        ) : null,
    },
  ];
  const handleAdd = () => {
    const newData = {
      key: count,
      description: `Enter your item description`,
      quantity: "0",
      unit_price: "0",
      vat: "0",
      amount: 0,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };
  const handleSave = (row) => {
    console.log("****+>");
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  // eslint-disable-next-line no-unused-vars
  const downloadImage = async () => {
    setWaiting(true);
    document.getElementById("new-item-btn").style.display = "none";
    let findValue = 780 / $(".card-container").outerWidth();
    console.log(findValue);
    await htmlToImage
      .toPng(document.getElementById("capture"), { pixelRatio: findValue })
      .then(async function (dataUrl) {
        console.log(dataUrl);
        await download(dataUrl, "my-node.png");

        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const imageFile = new File([blob], "image.png", { type: "image/png" });
        console.log(imageFile);
      });
    document.getElementById("new-item-btn").style.display = "block";
    setWaiting(false);
  };

  const downloadPdf = () => {
    var element = document.getElementById("capture-hidden");
    var opt = {
      margin: 1,
      filename: "invoice.pdf",
      image: {
        type: "png",
        quality: 0.98,
      },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    var worker = html2pdf(element);
    worker
      .set(opt)
      .outputImg("img")
      .then((img) => {
        var link = document.createElement("a");
        link.download = "invoice.png";
        link.href = img.src;
        link.click();
      });
  };

  const mintInvoiceUpdated = async () => {
    setWaiting(true);
    document.getElementById("new-item-btn").style.display = "none";
    let findValue = 780 / $(".card-container").outerWidth();
    console.log(findValue);
    if (user && isAuthenticated) {
      var element = document.getElementById("capture-hidden");
      var opt = {
        margin: 1,
        filename: "invoice.pdf",
        image: {
          type: "png",
          quality: 0.98,
        },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      var worker = html2pdf(element);
      worker
        .set(opt)
        .outputImg("img")
        .then(async (img) => {
          const dataUrl = img.src;
          const base64AiImage = dataUrl.replace("data:image/png;base64,", "");
          console.log(base64AiImage);

          // Upload Generated Invoice Image
          const imageParams = {
            abi: [
              {
                path: "image.png",
                content: base64AiImage,
              },
            ],
          };
          const imagePath = await web3Api.storage.uploadFolder(imageParams);

          console.log(
            "Metadata => ",
            invoiceNumber,
            dueDate,
            senderInfo,
            recipientInfo,
            note,
            subtotal,
            subVat,
            totalAmount,
            bankAccount,
            bic,
            reference,
            businessId
          );
          // Upload Metadata
          const metadataParams = {
            abi: [
              {
                path: "metadata/metadata.json",
                content: {
                  collection: "Invoice Generator Images",
                  invoiceNumber: invoiceNumber,
                  dueDate: dueDate,
                  senderInfo: senderInfo,
                  recipientInfo: recipientInfo,
                  note: note,
                  subtotal: subtotal,
                  subVat: subVat,
                  totalInvoiceAmount: totalAmount,
                  bankAccount: bankAccount,
                  bic: bic,
                  reference: reference,
                  businessId: businessId,
                  image: imagePath[0].path,
                },
              },
            ],
          };
          const metadataPath = await web3Api.storage.uploadFolder(
            metadataParams
          );

          console.log("Metadata Path => ", metadataPath);

          // Mint Invoice NFT
          const params = {
            _nichoNft: contractAddress,
            _tokenURI: metadataPath[0].path,
            _toAddress: user.get("ethAddress"),
            _price: Moralis.Units.ETH(sellingPrice),
            _cId: invoiceCollectionId,
          };

          const tx = await mintNFT({
            params: {
              abi: aiAgentABI,
              contractAddress: aiAgentAddress,
              functionName: "mint",
              params,
            },
            onError: (err) => {
              throw err.message;
            },
          });
          await tx.wait(1);

          // Get Minted Token Id

          const tokenId = await getTokenId({
            params: {
              abi: aiAgentABI,
              contractAddress: aiAgentAddress,
              functionName: "getTokenId",
            },
            onError: (err) => {
              throw err.message;
            },
          });
          console.log("Minted Token Id => ", tokenId);

          // Set Approve For All to Marketplace

          const setApproveTx = await setApprovalForAll({
            params: {
              contractAddress,
              abi: nichonftABI,
              functionName: "setApprovalForAll",
              params: {
                operator: marketplaceAddress,
                approved: true,
              },
            },
            onError: (err) => {
              throw err.message;
            },
          });
          await setApproveTx.wait(1);
          console.log("Approve successfully!");

          // Linst NFT to marketplace

          const listItemToMarketTx = await listItemToMarket({
            params: {
              contractAddress: marketplaceAddress,
              abi: marketplaceABI,
              functionName: "listItemToMarket",
              params: {
                tokenAddress: contractAddress,
                tokenId: Number(tokenId),
                askingPrice: Moralis.Units.ETH(sellingPrice),
              },
            },
            onError: (err) => {
              throw err.message;
            },
          });

          await listItemToMarketTx.wait(1);
          message.success("Invoice Image minted");
        });
    }

    document.getElementById("new-item-btn").style.display = "block";
    setWaiting(false);
  };

  // eslint-disable-next-line no-unused-vars
  const mintInvoice = async () => {
    setWaiting(true);
    document.getElementById("new-item-btn").style.display = "none";
    let findValue = 780 / $(".card-container").outerWidth();
    console.log(findValue);
    if (user && isAuthenticated) {
      await htmlToImage
        .toPng(document.getElementById("capture"), { pixelRatio: findValue })
        .then(async function (dataUrl) {
          const base64AiImage = dataUrl.replace("data:image/png;base64,", "");
          console.log(base64AiImage);

          // Upload Generated Invoice Image
          const imageParams = {
            abi: [
              {
                path: "image.png",
                content: base64AiImage,
              },
            ],
          };
          const imagePath = await web3Api.storage.uploadFolder(imageParams);

          console.log(
            "Metadata => ",
            invoiceNumber,
            dueDate,
            senderInfo,
            recipientInfo,
            note,
            subtotal,
            subVat,
            totalAmount,
            bankAccount,
            bic,
            reference,
            businessId
          );
          // Upload Metadata
          const metadataParams = {
            abi: [
              {
                path: "metadata/metadata.json",
                content: {
                  collection: "Invoice Generator Images",
                  invoiceNumber: invoiceNumber,
                  dueDate: dueDate,
                  senderInfo: senderInfo,
                  recipientInfo: recipientInfo,
                  note: note,
                  subtotal: subtotal,
                  subVat: subVat,
                  totalInvoiceAmount: totalAmount,
                  bankAccount: bankAccount,
                  bic: bic,
                  reference: reference,
                  businessId: businessId,
                  image: imagePath[0].path,
                },
              },
            ],
          };
          const metadataPath = await web3Api.storage.uploadFolder(
            metadataParams
          );

          console.log("Metadata Path => ", metadataPath);

          // Mint Invoice NFT
          const params = {
            _nichoNft: contractAddress,
            _tokenURI: metadataPath[0].path,
            _toAddress: user.get("ethAddress"),
            _price: Moralis.Units.ETH(sellingPrice),
            _cId: invoiceCollectionId,
          };

          const tx = await mintNFT({
            params: {
              abi: aiAgentABI,
              contractAddress: aiAgentAddress,
              functionName: "mint",
              params,
            },
            onError: (err) => {
              throw err.message;
            },
          });
          await tx.wait(1);

          // Get Minted Token Id

          const tokenId = await getTokenId({
            params: {
              abi: aiAgentABI,
              contractAddress: aiAgentAddress,
              functionName: "getTokenId",
            },
            onError: (err) => {
              throw err.message;
            },
          });
          console.log("Minted Token Id => ", tokenId);

          // Set Approve For All to Marketplace

          const setApproveTx = await setApprovalForAll({
            params: {
              contractAddress,
              abi: nichonftABI,
              functionName: "setApprovalForAll",
              params: {
                operator: marketplaceAddress,
                approved: true,
              },
            },
            onError: (err) => {
              throw err.message;
            },
          });
          await setApproveTx.wait(1);
          console.log("Approve successfully!");

          // Linst NFT to marketplace

          const listItemToMarketTx = await listItemToMarket({
            params: {
              contractAddress: marketplaceAddress,
              abi: marketplaceABI,
              functionName: "listItemToMarket",
              params: {
                tokenAddress: contractAddress,
                tokenId: Number(tokenId),
                askingPrice: Moralis.Units.ETH(sellingPrice),
              },
            },
            onError: (err) => {
              throw err.message;
            },
          });

          await listItemToMarketTx.wait(1);
          message.success("Invoice Image minted");
        });
    }

    document.getElementById("new-item-btn").style.display = "block";
    setWaiting(false);
  };

  return (
    <>
      <Helmet>
        <title>Nicho AI NFT | Invoice Generator</title>
        <meta name="description" content="AI-NFT generator powered by artificial intelligence." />
        <meta name="keywords" content="Nicho AI, AI NFT, AI NFT Creator, Multichain AI NFT, AIGC NFT, Artificial intelligence Powered NFT, AIGCNFT, AI-NFT, AINFT, AI NFT generator" />
      </Helmet>
      <div className="App">
        <div className="form-layout">
          <div className="invoice-header">Invoice Generator</div>
          <div className="invoice-container">
            <div className="card-container" id="capture">
              <div>
                <Row>
                  <Col span={11}>
                    <Title level={5} style={{ marginTop: 0 }}>
                      {" "}
                      Invoice Number
                    </Title>
                    <InputNumber
                      placeholder="Invoice Number"
                      className="ant-input-number"
                      onChange={(val) => setInvoiceNumber(val)}
                    />
                    <Upload
                      listType="picture-card"
                      onChange={handleChange}
                      style={{ visibility: uploaded ? "hidden" : "" }}
                      showUploadList={false}
                    >
                      {!uploaded ? (
                        <div style={{ color: "white" }}>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>Upload your logo</div>
                        </div>
                      ) : (
                        <img
                          src={imageUrl}
                          alt="Nicho AI NFT"
                          style={{
                            width: "100%",
                          }}
                        />
                      )}
                    </Upload>
                  </Col>
                  <Col span={2}></Col>
                  <Col span={11}>
                    <Title level={5} style={{ marginTop: 0 }}>
                      {" "}
                      Due Date
                    </Title>
                    <DatePicker
                      onChange={onChange}
                      className="ant-datepicker"
                    />
                    <Title level={5} style={{ marginTop: 5 }}>
                      {" "}
                      Price
                    </Title>
                    <InputNumber
                      placeholder="Inovice Price"
                      className="ant-input-number"
                      value={0}
                      onChange={(val) => setSellingPrice(val)}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col span={11}>
                    <div className="sender-info-container">
                      <Title level={5}> Sender </Title>
                      <TextArea
                        value={senderInfo}
                        onChange={(e) => setSenderInfo(e.target.value)}
                        placeholder={
                          "Your company name\nAddreess\nContact details (eamil, phone number)"
                        }
                        autoSize={{ minRows: 5, maxRows: 8 }}
                        rows={3}
                      />
                    </div>
                  </Col>
                  <Col span={2}></Col>
                  <Col span={11}>
                    <div className="sender-info-container">
                      <Title level={5}> Recipient </Title>
                      <TextArea
                        value={recipientInfo}
                        onChange={(e) => setReceipientInfo(e.target.value)}
                        placeholder={
                          "Recipient company name\nAddreess\nContact person"
                        }
                        autoSize={{ minRows: 5, maxRows: 8 }}
                        rows={3}
                      />
                    </div>
                  </Col>
                </Row>

                <Title style={{ marginTop: "20px" }} level={5}>
                  {" "}
                  Notes{" "}
                </Title>
                <TextArea
                  placeholder="Optional: Message to the recipient explaining what is this invoice for"
                  value={note}
                  onChange={(e) => {
                    setNote(e.target.value);
                  }}
                  autoSize={{ minRows: 5, maxRows: 8 }}
                  rows={5}
                />
                <div style={{ marginTop: "20px" }}>
                  <Table
                    components={components}
                    rowClassName={() => "editable-row"}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                  />

                  <Button
                    onClick={handleAdd}
                    type="primary"
                    style={{
                      marginBottom: 16,
                      marginTop: 15,
                    }}
                    id="new-item-btn"
                  >
                    <PlusCircleOutlined />
                    New Item
                  </Button>
                </div>

                <Row>
                  <Col span={20} style={{ textAlign: "right" }}>
                    <Title level={5}>Subtotal</Title>
                    <Title level={5}>VAT</Title>
                  </Col>
                  <Col span={4} style={{ textAlign: "right" }}>
                    <Title level={5}>${subtotal}</Title>
                    <Title level={5}>${subVat}</Title>
                  </Col>
                </Row>

                <Divider />

                <Row>
                  <Col span={20} style={{ textAlign: "right" }}>
                    <Title level={5} style={{ marginTop: 0, marginBottom: 0 }}>
                      Total due
                    </Title>
                  </Col>
                  <Col span={4} style={{ textAlign: "right" }}>
                    <Title level={5} style={{ marginTop: 0, marginBottom: 0 }}>
                      ${totalAmount}
                    </Title>
                  </Col>
                </Row>

                <Divider />

                <Row>
                  <Col span={11}>
                    <Title level={5}>Bank Account</Title>
                    <Input
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                    />
                    <Title level={5}>Reference</Title>
                    <Input
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                    />
                  </Col>
                  <Col span={2}></Col>
                  <Col span={11}>
                    <Title level={5}>BIC/Swift</Title>
                    <Input
                      value={bic}
                      onChange={(e) => setBIC(e.target.value)}
                    />
                    <Title level={5}>Business ID</Title>
                    <Input
                      value={businessId}
                      onChange={(e) => setBusinessId(e.target.value)}
                    />
                  </Col>
                </Row>
              </div>
            </div>
            <div
              className="card-container-hidden"
              id="capture-hidden"
              style={{ width: "800px", height: "900px", padding: "30px" }}
            >
              <div>
                <Row>
                  <Col span={11}>
                    <h1 style={{ marginTop: 0 }}>
                      {" "}
                      Invoice Number #{invoiceNumber}
                    </h1>
                    {uploaded && (
                      <img
                        src={imageUrl}
                        alt="Nicho AI NFT"
                        style={{
                          width: "100%",
                        }}
                      />
                    )}
                  </Col>
                  <Col span={2}></Col>
                  <Col span={11}>
                    <h3 style={{ marginTop: 0 }}> Due Date</h3>
                    <h2>{dueDate.toString()}</h2>
                  </Col>
                </Row>

                <Row>
                  <Col span={11}>
                    <div className="sender-info-container">
                      <h3> Sender </h3>
                      <TextArea
                        value={senderInfo}
                        onChange={(e) => setSenderInfo(e.target.value)}
                        placeholder={
                          "Your company name\nAddreess\nContact details (eamil, phone number)"
                        }
                        autoSize={{ minRows: 5, maxRows: 8 }}
                        rows={3}
                        style={{ color: "black" }}
                      />
                    </div>
                  </Col>
                  <Col span={2}></Col>
                  <Col span={11}>
                    <div className="sender-info-container">
                      <h3> Recipient </h3>
                      <h2>{recipientInfo}</h2>
                    </div>
                  </Col>
                </Row>

                <h3 style={{ marginTop: "20px" }}> Notes </h3>
                <h4>{note}</h4>

                <Divider />

                <div style={{ marginTop: "20px", display: "flex" }}>
                  <div
                    style={{
                      flex: "40%",
                      borderRight: "solid 1px rgb(200,200,200)",
                    }}
                  >
                    <h3>Description</h3>
                    {dataSource.map((d) => (
                      <h4 style={{ paddingTop: "10px" }}>{d.description}</h4>
                    ))}
                  </div>
                  <div
                    style={{
                      flex: "15%",
                      borderRight: "solid 1px rgb(200,200,200)",
                      paddingLeft: "15px",
                    }}
                  >
                    <h3>Quantity</h3>
                    {dataSource.map((d) => (
                      <h4 style={{ paddingTop: "10px" }}>{d.quantity}</h4>
                    ))}
                  </div>
                  <div
                    style={{
                      flex: "13%",
                      borderRight: "solid 1px rgb(200,200,200)",
                      paddingLeft: "15px",
                    }}
                  >
                    <h3>Unit Price</h3>
                    {dataSource.map((d) => (
                      <h4 style={{ paddingTop: "10px" }}>{d.unit_price}</h4>
                    ))}
                  </div>
                  <div
                    style={{
                      flex: "7%",
                      borderRight: "solid 1px rgb(200,200,200)",
                      paddingLeft: "15px",
                    }}
                  >
                    <h3>Vat%</h3>
                    {dataSource.map((d) => (
                      <h4 style={{ paddingTop: "10px" }}>{d.vat}</h4>
                    ))}
                  </div>
                  <div style={{ flex: "15%", paddingLeft: "15px" }}>
                    <h3>Amount</h3>
                    {dataSource.map((d) => (
                      <h4 style={{ paddingTop: "10px" }}>{d.amount}</h4>
                    ))}
                  </div>
                </div>

                <Divider />

                <div style={{ display: "flex" }}>
                  <div
                    style={{ flex: "80%", padding: "10px", textAlign: "right" }}
                  >
                    <h3>Subtotal</h3>
                    <h3>VAT</h3>
                  </div>
                  <div
                    style={{ flex: "20%", padding: "10px", textAlign: "right" }}
                  >
                    <h3>${subtotal}</h3>
                    <h3>${subVat}</h3>
                  </div>
                </div>

                <Divider />

                <div style={{ display: "flex" }}>
                  <div
                    style={{ flex: "80%", padding: "10px", textAlign: "right" }}
                  >
                    <h3 style={{ marginTop: 0, marginBottom: 0 }}>Total due</h3>
                  </div>
                  <div
                    style={{ flex: "20%", padding: "10px", textAlign: "right" }}
                  >
                    <h3 style={{ marginTop: 0, marginBottom: 0 }}>
                      ${totalAmount}
                    </h3>
                  </div>
                </div>

                <Divider />

                <div style={{ display: "flex" }}>
                  <div style={{ flex: "50%", padding: "10px" }}>
                    <h3>Bank Account</h3>
                    <h2>{bankAccount}</h2>
                    <h3>Reference</h3>
                    <h2>{reference}</h2>
                  </div>
                  <Col span={2}></Col>
                  <div style={{ flex: "50%", padding: "10px" }}>
                    <h3>BIC/Swift</h3>
                    <h2>{bic}</h2>
                    <h3>Business ID</h3>
                    <h2>{businessId}</h2>
                  </div>
                </div>

                <Divider />

                <h1 style={{ paddingTop: "50px" }}>Generated by Nicho</h1>
              </div>
            </div>
            <div className="action-container">
              <Button
                style={{ width: "100%", marginBottom: "15px" }}
                type="primary"
                size="large"
                onClick={downloadPdf}
              >
                DOWNLOAD IMAGE
              </Button>
              <br />
              <Button
                style={{ width: "100%" }}
                type="primary"
                size="large"
                onClick={mintInvoiceUpdated}
              >
                MINT NFT
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ComingSoonTxt />
    </>
  );
};

export default InvoiceGenerator;
