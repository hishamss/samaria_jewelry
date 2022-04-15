import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import { useAuth0 } from "@auth0/auth0-react";
import { NewItem, AddedItemSize } from "../../types"
import { addNewItem, s3Upload, deleteItem } from "../../utils/api";
import { Form, Container, Table, Card } from "react-bootstrap";
const Admin = () => {
    const coverImageRef = useRef<HTMLInputElement | null>(null);
    const otherImagesRef = useRef<HTMLInputElement | null>(null);
    const [adminAction, SetAdminAction] = useState("");
    const [itemName, SetItemName] = useState("");
    const [itemNameToDelete, SetItemNameToDelete] = useState("");
    const [itemType, SetItemType] = useState("");
    const [itemDescription, SetItemDescription] = useState("");
    const [itemPrice, SetItemPrice] = useState(0);
    const [noSizeQuantity, SetNoSizeQuantity] = useState(0);
    const [sizeWithQuantityArray, SetSizeWithQuantityArray] = useState("");
    const [itemSizes, SetItemSizes] = useState<AddedItemSize[]>([]);
    const [itemNameToDeleteMessage, SetItemNameToDeleteMessage] = useState(false);
    const [ItemNameMessage, SetItemNameMessage] = useState(false);
    const [ItemTypeMessage, SetItemTypeMessage] = useState(false);
    const [ItemPriceMessage, SetItemPriceMessage] = useState(false);
    const [ItemQuantityMessage, SetItemQuantityMessage] = useState(false);
    const [ItemSizeMessage, SetItemSizeMessage] = useState(false);
    const [JWTToken, SetJWTToken] = useState<string | undefined>();
    const [formSubmitMessage, SetFormSubmitMessage] = useState("");
    const [formSubmitMessageShow, SetFormSubmitMessageShow] = useState(false);
    const [deleteFormSubmitMessage, SetDeleteFormSubmitMessage] = useState("");
    const [deleteFormSubmitMessageShow, SetDeleteFormSubmitMessageShow] = useState(false);
    const [showLoadingMessage, SetShowLoadingMessage] = useState(false);
    const [showDeleteLoadingMessage, SetShowDeleteLoadingMessage] = useState(false);
    const [coverItemImage, SetCoverItemImage] = useState<File | undefined>();
    const [showCoverImageMessage, SetShowCoverImageMessage] = useState(false);
    const [otherItemImages, SetOtherItemImages] = useState<File[]>([]);
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
    const handleDeleteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        SetDeleteFormSubmitMessageShow(false);
        if (itemNameToDelete !== "") {
            SetShowDeleteLoadingMessage(true);
            const deleteIteamReponse = await deleteItem(itemNameToDelete, JWTToken);
            console.log("delete Items Reponse", deleteIteamReponse)
            SetDeleteFormSubmitMessage(deleteIteamReponse.message);
            SetShowDeleteLoadingMessage(false);
            SetDeleteFormSubmitMessageShow(true);
            SetItemNameToDelete("");
        }
        if (itemNameToDelete === "") SetItemNameToDeleteMessage(true);
    }
    const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        SetFormSubmitMessageShow(false);
        if (itemName !== "" && itemType !== "" && itemPrice > 0 && itemSizes.length > 0 && coverItemImage !== undefined && otherItemImages.length > 0) {
            SetShowLoadingMessage(true);
            const newItem: NewItem = {
                name: itemName,
                type: itemType,
                description: itemDescription,
                price: itemPrice,
                numOfOtherImage: otherItemImages.length,
                sizes: itemSizes
            }
            const formData = new FormData();
            formData.append("folder", itemName)
            formData.append("images", coverItemImage);
            Array.from(otherItemImages).forEach((file, index) => {
                formData.append("images", file);
            })

            await uploadAndAddAPI(newItem, formData, JWTToken);



            resetAddForm();
        }
        if (itemName === "") SetItemNameMessage(true);
        if (itemType === "") SetItemTypeMessage(true);
        if (itemPrice <= 0) SetItemPriceMessage(true);
        if (itemSizes.length === 0 && itemType !== 'Ring') SetItemQuantityMessage(true);
        if (itemSizes.length === 0 && itemType === 'Ring') SetItemSizeMessage(true);
        if (coverItemImage === undefined) SetShowCoverImageMessage(true);
        if (otherItemImages.length === 0) SetShowOtherImagesMessage(true);
    }

    const uploadAndAddAPI = async (newItem: NewItem, formData: FormData, JWTToken: string | undefined) => {

        const addItemResponse = await addNewItem(newItem, JWTToken);
        if (addItemResponse.message === 'Added sucessfully') {
            const uploadImagesResponse = await s3Upload(formData, JWTToken);
            if (uploadImagesResponse.message !== 'images uploaded sucessfully') {
                await deleteItem(itemName, JWTToken);
                SetFormSubmitMessage(uploadImagesResponse.message);
            } else {
                SetFormSubmitMessage(addItemResponse.message);
            }
        }else {
            SetFormSubmitMessage(addItemResponse.message);
        }
        SetShowLoadingMessage(false);
        SetFormSubmitMessageShow(true);

    }
    const resetAddForm = () => {
        SetItemName("")
        SetItemType("")
        SetItemDescription("")
        SetItemPrice(0)
        SetItemSizes([])
        SetSizeWithQuantityArray("");
        SetNoSizeQuantity(0);
        SetCoverItemImage(undefined);
        SetOtherItemImages([])
        coverImageRef!.current!.value = '';
        otherImagesRef!.current!.value = '';
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
            if (e.target.files[0].size <= 500000 && e.target.files[0].type === 'image/jpeg') {

                let tempFile = new File([e.target.files[0]], `main`, {
                    type: e.target.files[0].type,
                    lastModified: e.target.files[0].lastModified,
                });
                SetCoverItemImage(tempFile);
            } else {
                alert("Item images have to be in JPG format and 0.5MB as max size")
                e.target.value = null;
            }
        }



    }
    const handleItemOtherImagesChange = (e: any) => {
        SetShowOtherImagesMessage(false);
        if (e.target.files.length > 0) {
            let uploadedFiles: File[] = e.target.files;
            let updatedFiles: File[] = [];
            for (let i = 0; i < uploadedFiles.length; i++) {
                if (uploadedFiles[i].size > 500000 || uploadedFiles[i].type !== 'image/jpeg') {
                    alert("Item images have to be in JPG format and 0.5MB as max size")
                    e.target.value = null;
                    return
                }
                let tempFile = new File([uploadedFiles[i]], `${i + 1}`, {
                    type: uploadedFiles[i].type,
                    lastModified: uploadedFiles[i].lastModified,
                });
                updatedFiles.push(tempFile);
            }
            SetOtherItemImages(currentArray => [...currentArray, ...updatedFiles]);
        }

    }
    return <Container>
        <div style={{ display: "flex", justifyContent: "end" }}>
            {isAuthenticated && (<button className="adminPageBtns" onClick={() => logout()}>logout</button>)}
            {!isAuthenticated && (<button className="adminPageBtns" onClick={() => loginWithRedirect()}>Login</button>)}
        </div>
        <br></br>
        <div style={{ display: "flex", justifyContent: "center" }}>
            {isAuthenticated && (
                <Form.Group style={{ width: "50%" }}>
                    <Form.Text>What would you like to do?</Form.Text>
                    <Form.Control as="select" onChange={(e) => SetAdminAction(e.target.value)}>
                        <option value="" selected disabled hidden>Action</option>
                        <option value='Add Item'>Add Item</option>
                        <option value='Delete Item'>Delete Item</option>
                    </Form.Control>
                </Form.Group>

            )}
        </div>
        <br></br>
        {isLoading && (<div>Loading...</div>)}
        {!isLoading && isAuthenticated && adminAction === "Delete Item" && (
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Card className="adminCard">
                    <Card.Title>Delete Item</Card.Title>
                    <Card.Body>
                        <Form onSubmit={e => handleDeleteSubmit(e)}>
                            <Form.Group>
                                <Form.Label>Item Name</Form.Label>
                                <Form.Control type="text" name="itemName" value={itemNameToDelete} onChange={(e) => { SetItemNameToDelete((e.target.value).toLocaleUpperCase()); SetItemNameToDeleteMessage(false) }} />
                                <Form.Text className="formMessages text-muted" style={{ opacity: itemNameToDeleteMessage ? "1" : "0" }}>
                                    Required
                                </Form.Text>
                            </Form.Group>
                            <button style={{ display: !showDeleteLoadingMessage ? "inline" : "none" }} className="adminPageBtns" type="submit">Delete Item</button>
                            <img style={{ display: showDeleteLoadingMessage ? "inline" : "none" }} src="loading.gif" alt="loading img" />
                            <br></br>
                            <br></br>
                            <p className="formMessages" style={{ opacity: deleteFormSubmitMessageShow ? "1" : "0" }}>{deleteFormSubmitMessage}</p>
                        </Form>
                    </Card.Body>
                </Card></div>

        )}
        {!isLoading && isAuthenticated && adminAction === "Add Item" && (
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Card className="adminCard">
                    <Card.Title>Add New Item</Card.Title>
                    <Card.Body>
                        <Form onSubmit={e => handleAddSubmit(e)}>
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


                            <Form.Group>
                                <Form.Label>Item Cover Image</Form.Label>
                                <Form.Control ref={coverImageRef} type="file" accept="image/jpeg" onChange={(e) => handleItemCoverImageChange(e)} />
                                <Form.Text className="formMessages text-muted" style={{ opacity: showCoverImageMessage ? "1" : "0" }}>Required</Form.Text>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Item Other Images</Form.Label>
                                <Form.Control ref={otherImagesRef} type="file" accept="image/jpeg" multiple onChange={(e) => handleItemOtherImagesChange(e)} />
                                <Form.Text className="formMessages text-muted" style={{ opacity: showOtherImagesMessage ? "1" : "0" }}>At least one image required</Form.Text>
                            </Form.Group>

                            <button style={{ display: !showLoadingMessage ? "inline" : "none" }} className="adminPageBtns" type="submit">Add Item</button>
                            <img style={{ display: showLoadingMessage ? "inline" : "none" }} src="loading.gif" alt="loading img" />
                            <br></br>
                            <br></br>
                            <p className="formMessages" style={{ opacity: formSubmitMessageShow ? "1" : "0" }}>{formSubmitMessage}</p>

                        </Form>
                    </Card.Body>
                </Card>
            </div>
        )}
    </Container>
}

export default Admin;