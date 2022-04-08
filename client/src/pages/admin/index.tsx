import React, { useState, useEffect } from "react";
import "./index.css";
import { useAuth0 } from "@auth0/auth0-react";
import { NewItem, AddedItemSize } from "../../types"
import { addNewItem } from "../../utils/api";
import { Form, Container, Table, Card } from "react-bootstrap";
const Admin = () => {
    const [itemName, SetItemName] = useState("");
    const [itemType, SetItemType] = useState("");
    const [itemDescription, SetItemDescription] = useState("");
    const [itemPrice, SetItemPrice] = useState(0);
    const [noSizeQuantity, SetNoSizeQuantity] = useState(0);
    const [sizeWithQuantityArray, SetSizeWithQuantityArray] = useState("");
    const [itemSizes, SetItemSizes] = useState<AddedItemSize[]>([]);
    const [ItemNameMessage, SetItemNameMessage] = useState(false);
    const [ItemTypeMessage, SetItemTypeMessage] = useState(false);
    const [ItemPriceMessage, SetItemPriceMessage] = useState(false);
    const [ItemQuantityMessage, SetItemQuantityMessage] = useState(false);
    const [ItemSizeMessage, SetItemSizeMessage] = useState(false);
    const [JWTToken, SetJWTToken] = useState<string | undefined>();
    const [formSubmitMessage, SetFormSubmitMessage] = useState("");
    const [formSubmitMessageShow, SetFormSubmitMessageShow] = useState(false);
    const [showLoadingMessage, SetShowLoadingMessage] = useState(false);
    const [coverItemImage, SetCoverItemImage] = useState<File | undefined>();
    const [showCoverImageMessage, SetShowCoverImageMessage] = useState(false);
    const [otherItemImages, SetotherItemImages] = useState<File[]>([]);
    const [showOtherImagesMessage, SetShowOtherImagesMessage] = useState(false);
    const { loginWithRedirect, logout, isAuthenticated, isLoading, getIdTokenClaims } = useAuth0();
    useEffect(() => {
        if (isAuthenticated) {
            (async () => {
                const claims = await getIdTokenClaims();
                SetJWTToken(claims?.__raw)
            })();
        }


    })
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        SetFormSubmitMessageShow(false);

        if (itemName !== "" && itemType !== "" && itemPrice > 0 && itemSizes.length > 0 && coverItemImage !== undefined && otherItemImages.length > 0) {
            SetShowLoadingMessage(true);
            const newItem: NewItem = {
                name: itemName,
                type: itemType,
                description: itemDescription,
                price: itemPrice,
                numOfOtherImage: 3,
                sizes: itemSizes
            }
            addNewItem(newItem, JWTToken).then(result => {
                SetShowLoadingMessage(false);
                SetFormSubmitMessage(result.message);
                SetFormSubmitMessageShow(true);
            })
            console.log('form submitted successfully')
            console.log(newItem)
            resetForm();
        }
        if (itemName === "") SetItemNameMessage(true);
        if (itemType === "") SetItemTypeMessage(true);
        if (itemPrice <= 0) SetItemPriceMessage(true);
        if (itemSizes.length === 0 && itemType !== 'Ring') SetItemQuantityMessage(true);
        if (itemSizes.length === 0 && itemType === 'Ring') SetItemSizeMessage(true);
        if (coverItemImage === undefined) SetShowCoverImageMessage(true);
        if (otherItemImages.length === 0) SetShowOtherImagesMessage(true);
    }
    const resetForm = () => {
        SetItemName("")
        SetItemType("")
        SetItemDescription("")
        SetItemPrice(0)
        SetItemSizes([])
        SetSizeWithQuantityArray("");
        SetNoSizeQuantity(0);
    }

    const handleChangeQuantityForItemsWithNoSizes = (quant: number) => {
        if (quant > 0) {
            SetItemSizes([{
                size: 'all',
                quantity: quant
            }])
        }
    }
    const handleAddSizeQuantity = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        let tempSizeWithQuantityArray = sizeWithQuantityArray.split(":");
        let currentSize: string = tempSizeWithQuantityArray[0];
        let currentQuantity: number = Number.parseInt(tempSizeWithQuantityArray[1])
        if (!isNaN(currentQuantity) && tempSizeWithQuantityArray.length === 2) {
            let currentItemSizes = itemSizes;
            let sizeExist = false
            for (let i = 0; i < currentItemSizes.length; i++) {
                if (currentItemSizes[i].size === currentSize) {
                    currentItemSizes[i].quantity += currentQuantity;
                    SetItemSizes(currentItemSizes);
                    sizeExist = true;
                    break;
                }

            }
            if (!sizeExist) SetItemSizes(currentArray => [...currentArray, { size: currentSize, quantity: currentQuantity }])
        } else {
            alert(`Failed to add size, please add size with quantity in this format size:quantity`)
        }
        SetSizeWithQuantityArray('');
        SetItemSizeMessage(false);
    }
    const handleChangeItemType = (type: string) => {
        if (type === 'Ring') SetItemSizes([])
        SetItemType(type);
    }

    const handleItemCoverImageChange = (e: any) => {
        SetShowCoverImageMessage(false);
        if (e.target.files[0]) {
            if (e.target.files[0].size <= 1000000 && e.target.files[0].type === 'image/jpeg') {
                console.log("Cover Image pass");
                SetCoverItemImage(e.target.files[0])
            } else {
                alert("Item images have to be in JPG format and 1MB as max size")
                e.target.value = null;
            }
        }



    }
    const handleItemOtherImagesChange = (e: any) => {
        SetShowOtherImagesMessage(false);
        if (e.target.files.length > 0) {
            let uploadedFiles: File[] = e.target.files;
            for (let i = 0; i < uploadedFiles.length; i++) {
                if (uploadedFiles[i].size > 1000000 || uploadedFiles[i].type !== 'image/jpeg') {
                    alert("Item images have to be in JPG format and 1MB as max size")
                    e.target.value = null;
                    return
                }
            }

        }
        SetotherItemImages(e.target.files)
    }
    return <Container>
        <div>
            {isAuthenticated && (<button className="adminPageBtns" onClick={() => logout()}>logout</button>)}
            {!isAuthenticated && (<button className="adminPageBtns" onClick={() => loginWithRedirect()}>Login</button>)}
        </div>
        <br></br>
        {isLoading && (<div>Loading...</div>)}
        {!isLoading && isAuthenticated && (
            <div style={{display:"flex", justifyContent:"center"}}>
            <Card className="adminCard">
                <Card.Title>Add New Item</Card.Title>
                <Card.Body>
                <Form onSubmit={e => handleSubmit(e)}>
                <Form.Group>
                    <Form.Label>Item Name</Form.Label>
                    <Form.Control type="text" name="itemName" value={itemName} onChange={(e) => { SetItemName((e.target.value).toLocaleUpperCase()); SetItemNameMessage(false) }} />
                    <Form.Text className="formMessages text-muted" style={{ opacity: ItemNameMessage ? "1" : "0" }}>
                        Required
                    </Form.Text>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Item Type</Form.Label>
                    <Form.Control as="select" name="type" onChange={(e) => { handleChangeItemType(e.target.value); SetItemTypeMessage(false) }} value={itemType}>
                        <option value="" selected disabled hidden>Item Type</option>
                        <option value='Earing'>Earing</option>
                        <option value='Pendant'>Pendant</option>
                        <option value='Ring'>Ring</option>
                    </Form.Control>
                    <Form.Text className="formMessages text-muted" style={{ opacity: ItemTypeMessage ? "1" : "0" }}>
                        Required
                    </Form.Text>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" value={itemDescription} name="description" maxLength={250} onChange={(e) => SetItemDescription(e.target.value)}></Form.Control>
                    <Form.Text className="formMessages text-muted" style={{ opacity: 0 }}>
                        Required
                    </Form.Text>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        value={itemPrice} type="number" name="price" min="1" onChange={(e) => { SetItemPrice(Number.parseFloat(e.target.value)); SetItemPriceMessage(false) }} >
                    </Form.Control>
                    <Form.Text className="formMessages text-muted" style={{ opacity: ItemPriceMessage ? "1" : "0" }}>
                        Price Must be greater than zero
                    </Form.Text>
                </Form.Group>
                {itemType !== 'Ring' ?
                    <Form.Group>
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control type="number" value={noSizeQuantity} name="quantity" min="1" onChange={(e) => { handleChangeQuantityForItemsWithNoSizes(Number.parseInt(e.target.value)); SetItemQuantityMessage(false); SetNoSizeQuantity(Number.parseInt(e.target.value)) }
                        } />
                        <Form.Text className="formMessages text-muted" style={{ opacity: ItemQuantityMessage ? "1" : "0" }}>Quantity Must be greater than zero</Form.Text>
                    </Form.Group>
                    : null}
                {itemType === 'Ring' ?


                    [<Form.Group>
                        <Form.Label>Size:Quantity</Form.Label>
                        <Form.Control type="text" value={sizeWithQuantityArray} placeholder="size:quantity, e.g., 7:3 means size 7 has quantity 3" onChange={(e) => { SetSizeWithQuantityArray(e.target.value); SetItemSizeMessage(false) }} />
                        <div className="input-group-append">
                            <button className="adminPageBtns" onClick={e => handleAddSizeQuantity(e)}>Add Size</button>
                        </div>

                        <Form.Text className="formMessages text-muted" style={{ opacity: ItemSizeMessage ? "1" : "0" }}>Size and quantity must be added for this type</Form.Text>
                    </Form.Group>,

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th className="w-50">Size</th>
                                <th className="w-50">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>


                            {itemSizes.map((sizeQantity) =>
                                <tr>
                                    <td>{sizeQantity.size}</td>
                                    <td>{sizeQantity.quantity}</td>
                                </tr>
                            )}

                        </tbody>
                    </Table>]


                    : null}

                <p className="formMessages" style={{ opacity: formSubmitMessageShow ? "1" : "0" }}>{formSubmitMessage}</p>
                <p className="formMessages" style={{ opacity: showLoadingMessage ? "1" : "0" }}>Loading....</p>
                <Form.Group>
                    <Form.Label>Item Cover Image</Form.Label>
                    <Form.Control type="file" accept="image/jpeg" onChange={(e) => handleItemCoverImageChange(e)} />
                    <Form.Text className="formMessages text-muted" style={{ opacity: showCoverImageMessage ? "1" : "0" }}>Required</Form.Text>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Item Other Images</Form.Label>
                    <Form.Control type="file" accept="image/jpeg" multiple onChange={(e) => handleItemOtherImagesChange(e)} />
                    <Form.Text className="formMessages text-muted" style={{ opacity: showOtherImagesMessage ? "1" : "0" }}>At least one image required</Form.Text>
                </Form.Group>
                <button className="adminPageBtns" type="submit">Add Item</button>
            </Form>
                </Card.Body>
            </Card>
            </div>
        )}
    </Container>
}

export default Admin;